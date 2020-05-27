import ElementNode from "../baseclass/tags";
import { saveStack } from "../api/stack";
import {
  findTargetNode,
  redirectRange,
  rangeForTextChange,
  cleanEmptySibling,
  saveRange
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
    } else if (partAText.length === 1) {
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
            item => item.id === target.id
          );
          paraIndex = trees.children.findIndex(item => {
            return item.id === target.parent.id;
          });
          if (targetIndex === 0) {
            console.log("位于段首");
            if (paraIndex === 0) {
              // 位于文首
              console.log("前方没有同胞节点,也没有任何P节点,删无可删");
              return;
            } else {
              // 前方没有同胞节点,但前方有另外一个P节点,保留空行,确保下一次删除可以返回上一个P
              console.log("前方没有同胞节点,但前方有另外一个P节点");
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
            // targetIndex>0,有前一个节点,因此不需要考虑P节点的index
            console.log("退到前一位");
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
          }
        } else {
          // 前方没有同胞节点了,直接判断paraIndex
          paraIndex = paraIndex = trees.children.findIndex(item => {
            return item.id === target.parent.id;
          });
          console.log("前方没有同胞节点", range, target.id, target.parent.id);
          if (paraIndex === 0) {
            console.log("删无可删");
            return;
          } else {
            console.log("位于段首,本次保留空行,再次退格将退回上一段");
            target.text =
              partAText.substring(0, partAText.length - 1) + partBText;
            const br = await new ElementNode("br");
            br.parent = target.parent;
            target.parent.children.unshift(br);
            setTimeout(() => {
              const id = target.parent.id;
              const offset = 0;
              // target.parent.children[targetIndex - 1].text.length;
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
        }

        // console.log(targetIndex);
        // if (targetIndex >= 0) {
        //   console.log("退到前一位");
        //   if (paraIndex === 0) {
        //     if (partAText.length === 0) {
        //       console.log("删无可删");
        //       return;
        //     } else if (partAText.length === 1) {
        //       console.log("该节点即将删除");

        //       const previousSibling =
        //         range.startContainer.parentNode.previousSibling;
        //       const id = previousSibling.id;
        //       const offset = previousSibling.innerText.length;

        //       const idForSaveStack = range.startContainer.parentNode.id;
        //       console.log(
        //         "ready to move range",
        //         previousSibling,
        //         "gartgettext",
        //         partAText.substring(0, partAText.length - 1) + partBText
        //       );
        //       target.text =
        //         partAText.substring(0, partAText.length - 1) + partBText;

        //       cleanEmptySibling(trees);
        //       setTimeout(() => {
        //         redirectRange(store, {
        //           startId: id,
        //           startOffset: offset,
        //           endId: id,
        //           endOffset: offset
        //         });
        //         saveStack(trees, store, {
        //           startId: idForSaveStack,
        //           startOffset: partAText.length,
        //           endId: idForSaveStack,
        //           endOffset: partAText.length
        //         });
        //         console.log("longtimemytree", trees);
        //       }, 0);
        //     } else {
        //       console.log("paraIndex?", paraIndex);
        //       target.text =
        //         partAText.substring(0, partAText.length - 1) + partBText;
        //       const br = await new ElementNode("br");
        //       br.parent = target.parent;
        //       target.parent.children.unshift(br);
        //       cleanEmptySibling(trees);
        //       setTimeout(() => {
        //         const id = target.parent.id;
        //         redirectRange(store, {
        //           startId: id,
        //           // startOffset: partAText.length-1,
        //           endId: id
        //           // endOffset: partAText.length-1
        //         });
        //         saveStack(trees, store, {
        //           startId: id,
        //           startOffset: partAText.length,
        //           endId: id,
        //           endOffset: partAText.length
        //         });
        //       }, 0);
        //       return;
        //     }
        //   } else {
        //     target.text =
        //       partAText.substring(0, partAText.length - 1) + partBText;
        //     // const paraList = trees.children
        //     const elderBro = trees.children[paraIndex - 1];
        //     // 上一个段落存在有意义的元素节点
        //     console.log("上一个段落存在有意义的元素节点");
        //     if (elderBro.children[0] && elderBro.children[0].tag !== "br") {
        //       // 新range为上一个段落的最后一个节点的末尾
        //       setTimeout(() => {
        //         const id = elderBro.id;

        //         redirectRange(store, {
        //           startId: id,
        //           startOffset:
        //             elderBro.children[elderBro.children.length - 1].text.length,
        //           endId: id,
        //           endOffset:
        //             elderBro.children[elderBro.children.length - 1].text.length
        //         });

        //         saveStack(trees, store, {
        //           startId: id,
        //           startOffset: partAText.length,
        //           endId: id,
        //           endOffset: partAText.length
        //         });
        //       }, 0);
        //     } else {
        //       // 上一个段落没有
        //       console.log("上一个段落没有实体元素,新range在段首");
        //       setTimeout(() => {
        //         const id = elderBro.id;
        //         redirectRange(store, {
        //           startId: id,
        //           endId: id
        //         });

        //         saveStack(trees, store, {
        //           startId: id,
        //           startOffset: partAText.length,
        //           endId: id,
        //           endOffset: partAText.length
        //         });
        //       }, 0);
        //     }
        //   }
        // }
        return;
      });
      return;
    } else {
      // partAText.length===0,整段删除时可用
      console.log("partAText.length===0,应该不会出现这种情况");
      console.log("删无可删");
      return;
    }
  },
  sceneRangeMode: function(range) {
    // const  = range;

    return range;
  }
};
export const enter = {
  scenePointMode: function(range, trees, store) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const partAText = range.commonAncestorContainer.nodeValue.substr(
      0,
      range.startOffset
    );
    // console.log("partAText", partAText);
    const partBText = range.commonAncestorContainer.nodeValue.substr(
      range.endOffset,
      range.commonAncestorContainer.nodeValue.length
    );

    // 起点和终点在同一个之文本节点内
    // 如果range.commonAncestorContainer的节点类型为text(nodeType===3),则证明当前是一个文本节点,使用他的父节点parentNode作为currentObject;如果不是文本节点,则证明有可能发生了跨节点选取或者P级元素中存在span的元素节点和对应的文本节点
    const currentOperateObj = range.commonAncestorContainer.parentNode;
    // 获取相应的虚拟dom的引用
    findTargetNode(currentOperateObj, trees).then(async res => {
      const target = res;
      console.log("正在受影响的实例", target);
      const paraNode = range.commonAncestorContainer.parentNode.parentNode;
      console.log("paraNode", paraNode.id);
      // 通过partA/partB的内容长度,来判断换行时的range是在文本节点的开端还是末尾
      // if (partAText){
      //   target.text = partAText;
      // }
      // console.log(partBText);

      // 找到paraNode在trees中的索引
      let insertIndex = null;
      // 如果partAText不存在,则认为是在文本节点的开端进行换行,则新创建一个P级元素,target.id之后的所有元素,插在target所属的P元素之前,否则插在P元素之后
      if (partAText) {
        target.text = partAText;

        // 当inSameTextNode时,commonAncestorContainer必为文本节点,向上推两级,可得到P级节点
        // if (range.commonAncestorContainer==='text'){
        // }
        // 查询插入位置,当partAText存在的时候,
        insertIndex =
          trees.children.findIndex(item => {
            return item.id === paraNode.id;
          }) + 1;
        console.log("insertIndex", insertIndex);
        // 组装新一行的元素节点
        const newPara = await new ElementNode("p");
        const br = await new ElementNode("br");

        if (partBText) {
          const partBContainer = await new ElementNode();
          partBContainer.tag = target.tag;
          // partBContainer.attr.id = partBContainer.id;
          partBContainer.text = partBText;
          partBContainer.style = target.style;
          partBContainer.children = target.children;
          console.log("新的容器", partBContainer);
          // 换行时间发生的span节点在P节点中的索引
          // console.log('无法可说',target.id,target.parent)
          const restStartIndex = target.parent.children.findIndex(item => {
            return target.id === item.id;
          });
          console.log("换行时间发生的span节点在P节点中的索引", restStartIndex);
          // 需要的索引是restStartIndex+1,来获取target在P中之后剩余的节点
          const restNodeInP = target.parent.children.splice(
            restStartIndex + 1,
            target.parent.children.length
          );
          console.log("P元素切割剩余的数组", restNodeInP);
          restNodeInP.forEach(item => {
            item.parent = newPara;
          });
          // 0424 追加父节点属性parent
          partBContainer.parent = newPara;
          newPara.children.push(partBContainer);
          newPara.children.push(...restNodeInP);
          // newPara.children.concat(restNodeInP);
        } else {
          // partBText为空,仅代表事件发生时焦点在当前文本节点的末尾,而不代表文本节点所属的span元素后,没有其他span元素,因此,在这里,依然需要做一个splice,切割片段

          const restStartIndex = target.parent.children.findIndex(item => {
            return target.id === item.id;
          });
          console.log("换行时间发生的span节点在P节点中的索引", restStartIndex);
          // 需要的索引是restStartIndex+1,来获取target在P中之后剩余的节点
          const restNodeInP = target.parent.children.splice(
            restStartIndex + 1,
            target.parent.children.length
          );
          console.log("P元素切割剩余的数组", restNodeInP);
          restNodeInP.forEach(item => {
            item.parent = newPara;
          });

          // 0424 追加父节点属性parent
          br.parent = newPara;
          console.log("空状态下,新一行");
          if (restNodeInP.length === 0) {
            newPara.children.push(br);
          } else {
            newPara.children.push(...restNodeInP);
          }
        }
        console.log("newPara", newPara, br.toString());
        // 0424 追加父节点属性parent
        newPara.parent = trees;
        trees.children.splice(insertIndex, 0, newPara);
        setTimeout(() => {
          // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          const id = newPara.id;
          redirectRange(store, {
            startId: id,
            endId: id
          });
          saveStack(trees, store, {
            startId: id,
            // startOffset: partAText.length,
            endId: id
            // endOffset: partAText.length
          });
          console.log("insertIndex", insertIndex);
        }, 0);
        return;
      } else {
        console.log("partAText无内容");
        insertIndex = trees.children.findIndex(item => {
          return item.id === paraNode.id;
        });
        const newPara = await new ElementNode("p");
        const br = await new ElementNode("br");
        // 0424 追加父节点属性parent
        br.parent = newPara;
        newPara.children.push(br);
        console.log("即将插入", newPara.toString());
        // 0424 追加父节点属性parent
        newPara.parent = trees;
        trees.children.splice(insertIndex, 0, newPara);
        setTimeout(() => {
          // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          const id = paraNode.id;
          redirectRange(store, {
            startId: id,
            endId: id
          });
          saveStack(trees, store, {
            startId: id,
            // startOffset: partAText.length,
            endId: id
            // endOffset: partAText.length
          });
          console.log("insertIndex", insertIndex);
        }, 0);
        return;
      }
    });
    return;
  },
  sceneRangeMode: function(range) {
    // const range = range;
    return range;
  }
};
export const regularInput = {
  sceneDirectMode: (range, trees, store) => {
    saveRange(store)
    console.log("saveRangefromrebuild")
    const currentOperateObj = range.commonAncestorContainer.parentNode;
    findTargetNode(currentOperateObj, trees).then(async res => {
      // 若res不是个用于装载文本的节点,他将会是个P级节点,由上一个注释可知,在P级节点中编辑文本,重排时依然会保留用于占位的br节点,因此在下面做了一个判断,当p级节点但只有一个子节点并且这个节点为br时,将删除这个节点并且新增一个span节点手动插入
      // console.log("-----------按键松开后的range所在的父级元素节点", res);
      if (res.tag !== "span") {
        console.log("不声不响?")
        if (res.children.length === 1 && res.children[0].tag === "br") {
          res.children.pop();
        }
        const span = await new ElementNode(
          "span",
          range.commonAncestorContainer.nodeValue
        );
        // 0424 追加父节点属性parent
        span.parent = res;
        res.children.push(span);
        setTimeout(() => {
          rangeForTextChange(store);
          saveStack(trees, store, {
            startId: span.id,
            startOffset: span.text.length,
            endId: span.id,
            endOffset: span.text.length
          });
          // console.timeEnd("-----timer-----\n");
        }, 5);
        return;
      }
      const target = res;
      // console.log("正在受影响的实例", target);
      const currentNodeValue = range.commonAncestorContainer.nodeValue;
      // console.error("--------修改值---------", currentNodeValue);
      target.text = currentNodeValue;
      // rangeForTextChange();
      setTimeout(() => {
        rangeForTextChange(store);
        // console.log("")
        const ceshixiugaizhiqian = Array.from(store.state.normalStack, item => {
          return (
            item.range.startId +
            "|" +
            item.range.startOffset +
            "|" +
            item.trees.children[0].children[0].text +
            "|" +
            item.trees.children[0].children[1].text
          );
        });
        console.log("--------------------------------修改完成,入栈之前------------------------\n",ceshixiugaizhiqian)
        saveStack(trees, store, {
          startId: target.id,
          startOffset: target.text.length,
          endId: target.id,
          endOffset: target.text.length
        });
        // console.timeEnd("-----timer-----\n");
      }, 3);
      return;
    });
    return;
  },
  sceneComposiveMode: (wordKeeper, range, trees, store) => {
    const currentOperateObj = range.commonAncestorContainer.parentNode;
    findTargetNode(currentOperateObj, trees).then(res => {
      // console.log("莫非这才是正主", res);
      let target = res;
      // console.log("正在受影响的实例", target);
      let currentNodeValue = range.commonAncestorContainer.nodeValue;
      console.log(currentNodeValue);
      let startOffset = store.state.prevRangeFactor.startOffset;
      console.log(
        wordKeeper,
        "--------预览结果------------",
        currentNodeValue.substring(0, startOffset) + wordKeeper
      );
      console.log(
        "准备工作",
        store.state.prevRangeFactor.startTextTankAncestor
      );
      console.log(window.getSelection().getRangeAt(0));
      saveRange(store);
      // saveStack(trees, store, {
      //   startId: target.id,
      //   startOffset: target.text.length,
      //   endId: target.id,
      //   endOffset: target.text.length
      // });
      target.text = currentNodeValue;
      console.log("结束工作", target.text);
      // console.log(window.getSelection().getRangeAt(0));
      setTimeout(() => {
        rangeForTextChange(store);
        saveStack(trees, store, {
          startId: target.id,
          startOffset: target.text.length,
          endId: target.id,
          endOffset: target.text.length
        });
      }, 0);
      // wordKeeper = "";
      // console.log(target, trees);
    });
  }
};
