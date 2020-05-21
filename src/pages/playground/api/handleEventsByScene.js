import ElementNode from "../baseclass/tags";
import { findTargetNode } from "../api/corefunctions";
export const backspace = {
  scenePointMode: function(range) {
    const currentRange = range;
    const partAText = currentRange.commonAncestorContainer.nodeValue.substr(
      0,
      currentRange.startOffset
    );
    // console.log("partAText", partAText);
    const partBText = currentRange.commonAncestorContainer.nodeValue.substr(
      currentRange.endOffset,
      currentRange.commonAncestorContainer.nodeValue.length
    );
    if (currentRange.commonAncestorContainer.nodeType === 3) {
      const currentOperateObj = currentRange.commonAncestorContainer.parentNode;
      // 获取相应的虚拟dom的引用
      findTargetNode(currentOperateObj).then(async res => {
        const target = res;

        if (partAText.length > 1) {
          target.text =
            partAText.substring(0, partAText.length - 1) + partBText;
          // console.log(
          //   "删除之后",
          //   partAText.substring(0, partAText.length - 1),
          //   "|",
          //   partBText,
          //   "|",
          //   target.text
          // );
          setTimeout(() => {
            const id = target.id;
            this.redirectRange({
              startId: id,
              startOffset: partAText.length - 1,
              endId: id,
              endOffset: partAText.length - 1
            });
            this.saveStack({
              startId: currentRange.startContainer.parentNode.id,
              startOffset: partAText.length,
              endId: currentRange.endContainer.parentNode.id,
              endOffset: partAText.length
            });
          });
          return;
        } else {
          /**
           * 如果partAtext.length===0,那么会有一下几种情况:
           * 1 paraIndex===0,targetIndex==0;此时如果partAtext不存在,那么就证明这里是文本的顶端了,再次触发事件时,需要阻止删除行为
           * 2 paraIndex!==0,也就是>0,targetIndex==0,此时partAtext,则退回上一个P节点,使用最后一位的span节点的最后一位offset作为新range
           * 3 targetIndex!==0,常规删除行为,使用targetIndex-1的span节点以及text的长度创建新range;
           */

          // const id = s
          // 按键发生时,target所对应的span元素在兄弟元素节点中的索引;
          const paraIndex = this.trees.children.findIndex(item => {
            return item.id === target.parent.id;
          });
          const targetIndex = target.parent.children.findIndex(item => {
            return item.id === target.id;
          });

          // 此时位于段首,再删除会删到上一个段落
          if (targetIndex === 0) {
            console.log("位于段首,退回上一段");
            if (paraIndex === 0) {
              if (partAText.length === 0) {
                console.log("删无可删");
                return;
              } else {
                console.log("啊?");
                target.text =
                  partAText.substring(0, partAText.length - 1) + partBText;
                const br = await new ElementNode("br");
                br.parent = target.parent;
                target.parent.children.unshift(br);
                setTimeout(() => {
                  const id = target.parent.id;
                  this.redirectRange({
                    startId: id,
                    // startOffset: partAText.length-1,
                    endId: id
                    // endOffset: partAText.length-1
                  });
                }, 0);
                return;
              }
            } else {
              target.text =
                partAText.substring(0, partAText.length - 1) + partBText;
              // const paraList = this.trees.children
              const elderBro = this.trees.children[paraIndex - 1];
              // 上一个段落存在有意义的元素节点
              console.log("上一个段落存在有意义的元素节点");
              if (elderBro.children[0] && elderBro.children[0].tag !== "br") {
                // 新range为上一个段落的最后一个节点的末尾
                setTimeout(() => {
                  const id = elderBro.id;

                  this.redirectRange({
                    startId: id,
                    startOffset:
                      elderBro.children[elderBro.children.length - 1].text
                        .length,
                    endId: id,
                    endOffset:
                      elderBro.children[elderBro.children.length - 1].text
                        .length
                  });
                }, 0);
              } else {
                // 上一个段落没有
                console.log("上一个段落没有实体元素,新range在段首");
                setTimeout(() => {
                  const id = elderBro.id;
                  this.redirectRange({
                    startId: id,
                    endId: id
                  });
                }, 0);
              }
            }
          } else if (targetIndex > 0) {
            console.log("退到前一位");
            target.text =
              partAText.substring(0, partAText.length - 1) + partBText;
            setTimeout(() => {
              const id = target.parent.children[targetIndex - 1].id;
              this.redirectRange({
                startId: id,
                startOffset:
                  target.parent.children[targetIndex - 1].text.length,
                endId: id,
                endOffset: target.parent.children[targetIndex - 1].text.length
              });
            });
            return;
          }
          return;
        }
      });

      // 暂不处理
      return;
    } else {
      // event.stopImmediatePropagation();
      // event.preventDefault();
      return;
    }
  },
  sceneRangeMode: function(range) {
    const currentRange = range;

    return currentRange;
  }
};
export const enter = {
  scenePointMode: function(range) {
    const currentRange = range;
    return currentRange;
  },
  sceneRangeMode: function(range) {
    const currentRange = range;
    return currentRange;
  }
};
