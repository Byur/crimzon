import ElementNode from "../baseclass/tags";
import { saveStack } from "../api/stack";
import {
  findTargetNode,
  redirectRange,
  cleanEmptySibling
} from "../api/corefunctions";

export const backspace = {
  scenePointMode: (range, trees, store) => {
    console.log("进入", range);
    const partAText = range.commonAncestorContainer.nodeValue.substr(
      0,
      range.startOffset
    );
    // console.log("partAText", partAText);
    const partBText = range.commonAncestorContainer.nodeValue.substr(
      range.endOffset,
      range.commonAncestorContainer.nodeValue.length
    );
    const currentOperateObj = range.commonAncestorContainer.parentNode;
    if (partAText.length > 1) {
      // 获取相应的虚拟dom的引用
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        target.text = partAText.substring(0, partAText.length - 1) + partBText;
        cleanEmptySibling(trees);
        setTimeout(() => {
          const id = target.id;
          console.log(
            "---------------------------store------------------",
            store
          );
          redirectRange(store, {
            startId: id,
            startOffset: partAText.length - 1,
            endId: id,
            endOffset: partAText.length - 1
          });
          saveStack(trees, store, {
            startId: id,
            startOffset: partAText.length - 1,
            endId: id,
            endOffset: partAText.length - 1
          });
        });
        return;
      });
    } else {
      /**
       * 如果partAtext.length===0,那么会有一下几种情况:
       * 1 paraIndex===0,targetIndex==0;此时如果partAtext不存在,那么就证明这里是文本的顶端了,再次触发事件时,需要阻止删除行为
       * 2 paraIndex!==0,也就是>0,targetIndex==0,此时partAtext,则退回上一个P节点,使用最后一位的span节点的最后一位offset作为新range
       * 3 targetIndex!==0,常规删除行为,使用targetIndex-1的span节点以及text的长度创建新range;
       */

      // const id = s
      // 按键发生时,target所对应的span元素在兄弟元素节点中的索引;
      // 0522 由于之前追加了删除文本节点后,对应的虚拟dom的dispaly为false,导致根据ID找不到节点,寻找解决办法中...
      // 在backspace场景下,当partAText<=1时,则意味着事件执行之后当前range所在的虚拟dom将会被销毁,导致后续的range和stack处理会因为找不到虚拟dom报错或者执行无效;现追加判断,当这种场景下:
      // 若range.startContainer.parentNode.previousSibling为null(意味着该节点前没有同胞节点了),则将range.startContainer.parentNode.previousSibling作为参数输入findTargetNode方法,执行同样的代码;
      // 若startContainer.parentNode.previousSibling为null,直接获取paraIndex,并将targetIndex设为0
      console.log("rebuildfunction", range.startContainer);

      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        console.log(
          "target",
          target,
          range.startContainer.parentNode.previousSibling
        );
        let targetIndex = null;
        let paraIndex = null;
        if (range.startContainer.parentNode.previousSibling !== null) {
          console.log("一般状态");
          targetIndex = target.parent.children.findIndex(
            item =>
              item.id === range.startContainer.parentNode.previousSibling.id
          );
        } else {
          console.log("前方没有同胞节点");
          targetIndex = -1;
        }
        paraIndex = trees.children.findIndex(item => {
          return item.id === target.parent.id;
        });
        // const targetIndex = target.parent.children
        //   ? target.parent.children.findIndex(item => {
        //       return (
        //         item.id === range.startContainer.parentNode.previousSibling.id
        //       );
        //     })
        //   : 0;
        console.log(targetIndex)
        if (targetIndex === -1) {
          if (paraIndex === 0) {
            console.log("删无可删");
            return;
          } else {
            console.log("位于段首,退回上一段");
            target.text =
              partAText.substring(0, partAText.length - 1) + partBText;
            setTimeout(() => {
              const id = target.parent.children[targetIndex - 1].id;
              const offset =
                target.parent.children[targetIndex - 1].text.length;
              redirectRange(store, {
                startId: id,
                startOffset: offset,
                endId: id,
                endOffset: offset
              });
              saveStack(trees, store, {
                startId: id,
                startOffset: offset,
                endId: id,
                endOffset: offset
              });
            });
            return;
          }
        } else if (targetIndex >= 0) {
          console.log("退到前一位");
          if (paraIndex === 0) {
            if (partAText.length === 0) {
              console.log("删无可删");
              return;
            } else if (partAText.length === 1) {
              console.log("该节点即将删除");

              const previousSibling =
                range.startContainer.parentNode.previousSibling;
              const id = previousSibling.id;
              const offset = previousSibling.innerText.length;

              const idForSaveStack = range.startContainer.parentNode.id;
              console.log(
                "ready to move range",
                previousSibling,
                "gartgettext",
                partAText.substring(0, partAText.length - 1) + partBText
              );
              target.text =
                partAText.substring(0, partAText.length - 1) + partBText;

              cleanEmptySibling(trees);
              setTimeout(() => {
                redirectRange(store, {
                  startId: id,
                  startOffset: offset,
                  endId: id,
                  endOffset: offset
                });
                saveStack(trees, store, {
                  startId: idForSaveStack,
                  startOffset: partAText.length,
                  endId: idForSaveStack,
                  endOffset: partAText.length
                });
                console.log("longtimemytree", trees);
              }, 0);
            } else {
              console.log("paraIndex?", paraIndex);
              target.text =
                partAText.substring(0, partAText.length - 1) + partBText;
              const br = await new ElementNode("br");
              br.parent = target.parent;
              target.parent.children.unshift(br);
              cleanEmptySibling(trees);
              setTimeout(() => {
                const id = target.parent.id;
                redirectRange(store, {
                  startId: id,
                  // startOffset: partAText.length-1,
                  endId: id
                  // endOffset: partAText.length-1
                });
                saveStack(trees, store, {
                  startId: id,
                  startOffset: partAText.length,
                  endId: id,
                  endOffset: partAText.length
                });
              }, 0);
              return;
            }
          } else {
            target.text =
              partAText.substring(0, partAText.length - 1) + partBText;
            // const paraList = trees.children
            const elderBro = trees.children[paraIndex - 1];
            // 上一个段落存在有意义的元素节点
            console.log("上一个段落存在有意义的元素节点");
            if (elderBro.children[0] && elderBro.children[0].tag !== "br") {
              // 新range为上一个段落的最后一个节点的末尾
              setTimeout(() => {
                const id = elderBro.id;

                redirectRange(store, {
                  startId: id,
                  startOffset:
                    elderBro.children[elderBro.children.length - 1].text.length,
                  endId: id,
                  endOffset:
                    elderBro.children[elderBro.children.length - 1].text.length
                });

                saveStack(trees, store, {
                  startId: id,
                  startOffset: partAText.length,
                  endId: id,
                  endOffset: partAText.length
                });
              }, 0);
            } else {
              // 上一个段落没有
              console.log("上一个段落没有实体元素,新range在段首");
              setTimeout(() => {
                const id = elderBro.id;
                redirectRange(store, {
                  startId: id,
                  endId: id
                });

                saveStack(trees, store, {
                  startId: id,
                  startOffset: partAText.length,
                  endId: id,
                  endOffset: partAText.length
                });
              }, 0);
            }
          }
        } else {
          console.log("----------------unexcept-------------", targetIndex);
        }
        return;
      });
      return;
    }
  },
  sceneRangeMode: function(range) {
    // const  = range;

    return range;
  }
};
export const enter = {
  scenePointMode: function(range) {
    // const range = range;
    return range;
  },
  sceneRangeMode: function(range) {
    // const range = range;
    return range;
  }
};
