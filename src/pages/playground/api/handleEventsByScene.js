import ElementNode from "../baseclass/tags";
import { saveStack } from "../api/stack";
import {
  findTargetNode,
  redirectRange,
  // rangeForTextChange,
  cleanEmptySibling,
  saveRange,
  clearRange
} from "../api/corefunctions";

export const backspace = {
  scenePointMode: (range, trees, store) => {
    console.log("进入", range.commonAncestorContainer);
    const partAText = range.commonAncestorContainer.nodeValue.substr(
      0,
      range.startOffset
    );
    console.log("partAText", partAText);
    const partBText = range.commonAncestorContainer.nodeValue.substr(
      range.endOffset,
      range.commonAncestorContainer.nodeValue.length
    );
    console.log("partBText", partBText);
    const currentOperateObj = range.commonAncestorContainer.parentNode;
    if (partAText.length > 1) {
      // 获取相应的虚拟dom的引用
      findTargetNode(currentOperateObj, trees).then(async res => {
        console.log("常规处理");
        const target = res;
        target.text = partAText.substring(0, partAText.length - 1) + partBText;
        clearRange();
        cleanEmptySibling(trees);
        // let selection = window.getSelection();
        // selection.removeAllRanges();
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
        }, 0);
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
              clearRange();
              const br = await new ElementNode("br");
              br.parent = target.parent;
              target.parent.children.unshift(br);
              cleanEmptySibling(trees);
              clearRange();
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
            clearRange();
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
          // if (paraIndex === 0) {
          console.log("partAtext", partAText);
          // console.log("删无可删");
          //   return;
          // } else {
          console.log("位于段首,本次保留空行,再次退格将退回上一段");
          target.text = "" + partBText;
          console.log(
            "target.text______________________________",
            target.parent.children.length
          );
          // 防止连续添加br，只加一次
          // 本来像使用every，但如果children是一个空list也会返回true
          if (target.text.length === 0 && target.parent.children.length <= 1) {
            const brExist = target.parent.children.findIndex(item => {
              console.log("此次遍历的对象", item.tag);
              return item.tag === "br";
            });
            if (brExist === -1) {
              console.log(brExist, "增加一次br");
              const br = await new ElementNode("br");
              br.parent = target.parent;
              target.parent.children.unshift(br);
            }
          }

          cleanEmptySibling(trees);
          clearRange();
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
          }, 0);
          return;
          // } else {

          // }
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
      // partAText.length===0,以range计算startContainer的特性,此时焦点前方已经不存在文本节点,因此可以视为焦点当前位于段首，所以该判断分支在即将删除段落时可用，该判断分支，在一个段落中连续触发删除时间，会触发一次，如果触发时上一个段落是空段落，将会执行sceneOutOfException1的判断。
      // console.log("partAText.length===0,应该不会出现这种情况");
      // console.log("删无可删");
      // 整段删除
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        const paraIndex = trees.children.findIndex(
          item => target.parent.id === item.id
        );
        if (paraIndex > 0) {
          // 如果paraIndex>0,退回上一段最后一个节点的末端
          // 当前没有选中文本节点，当前range的commonAncestorContainer是一个br
          const elderBroParaNode = trees.children[paraIndex - 1];
          if (
            elderBroParaNode.children.length > 0 &&
            elderBroParaNode.children[0].tag !== "br"
          ) {
            const nextPosition =
              elderBroParaNode.children[elderBroParaNode.children.length - 1];

            console.log(nextPosition);
            // 改换门庭
            trees.children[paraIndex].children.forEach(item => {
              item.parent = elderBroParaNode;
            });
            elderBroParaNode.children = elderBroParaNode.children.concat(
              // 删除当前段落
              trees.children[paraIndex].children
            );
            console.log("剪切之后", elderBroParaNode.children);
            trees.children.splice(paraIndex, 1);
            clearRange();
            setTimeout(() => {
              const id = nextPosition.id;
              const offset = nextPosition.text.length;
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
            }, 0);
          }
          // 前一个段落是空段落
          else {
            // 删除前一个段落
            trees.children.splice(paraIndex - 1, 1);
            clearRange();
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
            }, 0);
          }
        } else {
          console.log("paraIndex === 0");
          return;
        }
      });

      return;
    }
  },
  sceneOutOfException1: (range, trees, store) => {
    console.log("进入sceneOutOfException1", range);
    // const partAText = range.commonAncestorContainer.nodeValue.substr(
    //   0,
    //   range.startOffset
    // );
    // // console.log("partAText", partAText);
    // const partBText = range.commonAncestorContainer.nodeValue.substr(
    //   range.endOffset,
    //   range.commonAncestorContainer.nodeValue.length
    // );
    // 此时commonAncestorContainer是span节点或者P节点，需要区分判断，一般来说此时由连续删除事件所重定向的range会是一个span(offset===0)或者br(offset===0),但由鼠标点击或者方向键调整的range，如果移动到一个空段落（也有可能是段首）的时候，此时的commonAncestorContainer会是P节点，所以需要区分处理。
    const currentOperateObj = range.commonAncestorContainer;
    findTargetNode(currentOperateObj, trees).then(async res => {
      const target = res;
      console.log(target);
      // 判断target所在的位置(paraIndex)
      let paraIndex = null;
      if (target.tag !== "p") {
        paraIndex = trees.children.findIndex(
          item => target.parent.id === item.id
        );
      } else {
        paraIndex = trees.children.findIndex(item => target.id === item.id);
      }

      if (paraIndex > 0) {
        console.log(
          "存在上一个段落,退回上一段,其中有可能上一段是个空段落,需要区别处理"
        );

        // 如果paraIndex>0,退回上一段最后一个节点的末端
        // 当前没有选中文本节点，当前range的commonAncestorContainer是一个br
        const elderBroParaNode = trees.children[paraIndex - 1];
        console.log("前一个段落", elderBroParaNode);
        if (
          elderBroParaNode.children.length > 0 &&
          elderBroParaNode.children[0].tag !== "br"
        ) {
          const nextPosition =
            elderBroParaNode.children[elderBroParaNode.children.length - 1];

          console.log(nextPosition);
          // 改换门庭
          const tempArr = trees.children[paraIndex].children.filter(
            item => item.tag !== "br"
          );
          tempArr.forEach(item => {
            item.parent = elderBroParaNode;
          });
          elderBroParaNode.children = elderBroParaNode.children.concat(
            // 删除当前段落
            tempArr
          );
          console.log("剪切之后", elderBroParaNode.children);
          trees.children.splice(paraIndex, 1);
          cleanEmptySibling(trees);
          clearRange();
          setTimeout(() => {
            const id = nextPosition.id;
            const offset = nextPosition.text.length;
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
          }, 0);
          return;
        }
        // 前一个段落是空段落
        else {
          // 删除前一个段落
          if (paraIndex > 0) {
            console.log("删除前一个段落");
            trees.children.splice(paraIndex - 1, 1);
          }
          // clearRange();
          setTimeout(() => {
            const id = target.tag !== "p" ? target.parent.id : target.id;
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
          }, 0);
          return;
        }
      } else {
        // console.log(range.commonAncestorContainer.innerText);
        // range.commonAncestorContainer.innerText.substring(0, partAText.length - 1)
        // target.text = "";
        // cleanEmptySibling(trees);
        console.log("paraIndex<=0", paraIndex);
        if (target.tag === "br") {
          console.log("最后一个段落,无法再向上删除");
          return;
        } else if (target.tag === "span") {
          if (target.text.length === 1) {
            target.text = range.commonAncestorContainer.innerText.substring(
              0,
              range.commonAncestorContainer.innerText.length - 1
            );
            // 补充一个br保持空行
            const br = await new ElementNode("br");
            br.parent = target.parent;
            target.parent.children.unshift(br);
            clearRange();
            cleanEmptySibling(trees);
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
            }, 0);
          }
          // console.log("thisthisthis")
          return;
        } else if (target.tag === "p") {
          console.log("????");
        }
      }
      // const partAText = target.text.substr(0, range.startOffset);
      // // console.log("partAText", partAText);
      // const partBText = target.text.substr(range.endOffset, target.text.length);
      // console.log("partAText", partAText, "partBText", partBText);
      // console.log(store);
    });
    return;
  },
  sceneRangeMode: function(range) {
    // const  = range;

    return range;
  }
};
export const enter = {
  // 起点和终点在同一个之文本节点内
  // 如果range.commonAncestorContainer的节点类型为text(nodeType===3),则证明当前是一个文本节点,使用他的父节点parentNode作为currentObject;如果不是文本节点,则证明有可能发生了跨节点选取或者P级元素中存在span的元素节点和对应的文本节点
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
        clearRange();
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
        clearRange();
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
  },
  sceneOutOfException1: (range, trees, store) => {
    // return console.log(range, trees, store)
    console.log(range.commonAncestorContainer.tagName);
    // 若此时的range在BR上,当前是空段落，下一个回车键，将切到新一行，index为当前的paraIndex之后
    if (range.commonAncestorContainer.tagName === "BR") {
      // const paraIndex =

      const currentOperateObj = range.commonAncestorContainer.parentNode;
      findTargetNode(currentOperateObj, trees).then(async res => {
        console.log(
          "commonAncestorContainer",
          range.commonAncestorContainer.parentNode
        );
        const target = res;
        const paraIndex = trees.children.findIndex(item => {
          return item.id === target.id;
        });
        if (paraIndex < 0) {
          console.error("paraIndex违规", paraIndex);
        }
        console.log("paraIndex", paraIndex);
        const newPara = await new ElementNode("p");
        const br = await new ElementNode("br");
        newPara.parent = trees;
        br.parent = newPara;
        newPara.children.push(br);
        trees.children.splice(paraIndex, 0, newPara);
        clearRange();
        setTimeout(() => {
          // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          // 新的range应为target，因为新增加的行添加在target之上
          const id = target.id;
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
          // console.log("insertIndex", insertIndex);
        }, 0);
      });
    }
    // 当前是在文本首端，startcontianer是SPAN
    else if (range.commonAncestorContainer.tagName === "SPAN") {
      console.log("WHEN SPAN");
      const currentOperateObj = range.commonAncestorContainer;
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        const paraIndex = trees.children.findIndex(item => {
          return item.id === target.parent.id;
        });
        const newPara = await new ElementNode("p");
        const br = await new ElementNode("br");
        newPara.parent = trees;
        br.parent = newPara;
        newPara.children.push(br);
        trees.children.splice(paraIndex, 0, newPara);
        clearRange();
        setTimeout(() => {
          // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          // 新的range应为target，因为新增加的行添加在target之上
          const id = target.id;
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
          // console.log("insertIndex", insertIndex);
        }, 0);
      });
    } else if (range.commonAncestorContainer.tagName === "P") {
      console.log("WHEN P");
      const currentOperateObj = range.commonAncestorContainer;
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        const paraIndex = trees.children.findIndex(item => {
          return item.id === target.id;
        });
        const newPara = await new ElementNode("p");
        const br = await new ElementNode("br");
        newPara.parent = trees;
        br.parent = newPara;
        newPara.children.push(br);
        trees.children.splice(paraIndex, 0, newPara);
        clearRange();
        setTimeout(() => {
          // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          // 新的range应为target，因为新增加的行添加在target之上
          const id = target.id;
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
          // console.log("insertIndex", insertIndex);
        }, 0);
      });
    }
  }
};

export const regularInput = {
  /**
   * @function
   * @param {String} keyData
   */
  sceneDirectMode: (keyData, range, trees, store) => {
    saveRange(store);
    /**
     * 待追加特殊字符转义 如空格转&nbsp;
     * https://tool.oschina.net/commons?type=2
     */
    keyData = keyData.replace(" ", "&nbsp;");
    console.log("转义后的字符", keyData);
    console.log("saveRangefromrebuild", range);
    // 两个场景下,不能正确地调整range,一个场景是range.commonAncestorContainer是P元素,且innerText为空,此时将要触发按键;
    // 另一种场景在上一种场景的基础之下在debounce之内连续按键,导致了range.commonAncestorContainer是text节点,但range.commonAncestorContainer.parentNode是P元素(因为连续操作被debounce忽略,导致来不及处理range,场景1变成了场景2)
    // 此种场景为在空段落中输入内容,此时将创建一个span
    if (range.commonAncestorContainer.tagName === "P") {
      console.log("for this moment");
      const currentOperateObj = range.commonAncestorContainer;
      findTargetNode(currentOperateObj, trees).then(async res => {
        // if (res.children.length === 1 && res.children[0].tag === "br") {
        //   res.children.pop();
        // }
        console.log("res.children", res.children);
        const span = await new ElementNode("span", keyData);
        // 0424 追加父节点属性parent
        span.parent = res;
        res.children.push(span);
        res.children.shift();
        setTimeout(() => {
          // rangeForTextChange(store);
          redirectRange(store, {
            startId: span.id,
            startOffset: span.text.length,
            endId: span.id,
            endOffset: span.text.length
          });
          saveStack(trees, store, {
            startId: span.id,
            startOffset: span.text.length,
            endId: span.id,
            endOffset: span.text.length
          });
          // console.timeEnd("-----timer-----\n");
        }, 0);
      });
      return;
    } else if (range.commonAncestorContainer.tagName === "BR") {
      // 在空行进行输入，将创建一个span元素,并且删除br元素，此时commonAncestorContainer是br，需要获取它的parentNode也就是P节点
      console.log("空行输入", range.commonAncestorContainer);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        const span = await new ElementNode("span", keyData);
        span.parent = target;
        target.children.push(span);
        target.children.shift();
        console.log("span", span.toString, "\n", target.toString());
        clearRange();
        setTimeout(() => {
          redirectRange(store, {
            startId: span.id,
            startOffset: span.text.length,
            endId: span.id,
            endOffset: span.text.length
          });
          saveStack(trees, store, {
            startId: span.id,
            startOffset: span.text.length,
            endId: span.id,
            endOffset: span.text.length
          });
          // console.timeEnd("-----timer-----\n");
        }, 0);
      });
    } else if (
      range.commonAncestorContainer.nodeType === 3 &&
      range.commonAncestorContainer.parentNode.tagName === "P"
    ) {
      // if (res.tag !== "span" && range.commonAncestorContainer.nodeType===3) {
      console.log("不声不响?", range.commonAncestorContainer.nodeValue);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      findTargetNode(currentOperateObj, trees).then(async res => {
        const span = await new ElementNode(
          "span",
          range.commonAncestorContainer.nodeValue
        );
        console.log(span);
        span.parent = res;
        res.children.push(span);
        res.children.shift();
        saveRange(store);
        clearRange();
        setTimeout(() => {
          // rangeForTextChange(store);
          redirectRange(store, {
            startId: span.id,
            startOffset: span.text.length,
            endId: span.id,
            endOffset: span.text.length
          });
          saveStack(trees, store, {
            startId: span.id,
            startOffset: span.text.length,
            endId: span.id,
            endOffset: span.text.length
          });

          // console.timeEnd("-----timer-----\n");
        }, 0);
      });
      return;
      // }
    } else if (range.commonAncestorContainer.tagName === "SPAN") {
      const partAText = range.commonAncestorContainer.innerText.substr(
        0,
        range.startOffset
      );
      console.log("partAText", partAText);
      const partBText = range.commonAncestorContainer.innerText.substr(
        range.endOffset,
        range.commonAncestorContainer.innerText.length
      );
      console.log("partBText", partBText);
      const currentOperateObj = range.commonAncestorContainer;
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        const currentNodeValue = partAText + keyData + partBText;
        target.text = currentNodeValue;
        clearRange();
        setTimeout(() => {
          redirectRange(store, {
            startId: target.id,
            startOffset: partAText.length + 1,
            endId: target.id,
            endOffset: partAText.length + 1
          });
          saveStack(trees, store, {
            startId: target.id,
            startOffset: partAText.length + 1,
            endId: target.id,
            endOffset: partAText.length + 1
          });
          // console.timeEnd("-----timer-----\n");
        }, 0);
      });
      return;
    } else {
      console.log(
        "range.commonAncestorContainer.tagName",
        range.commonAncestorContainer.tagName,
        range
      );
      const partAText = range.commonAncestorContainer.nodeValue.substr(
        0,
        range.startOffset
      );
      console.log("partAText", partAText);
      const partBText = range.commonAncestorContainer.nodeValue.substr(
        range.endOffset,
        range.commonAncestorContainer.nodeValue.length
      );
      console.log(partAText, partBText);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      findTargetNode(currentOperateObj, trees).then(async res => {
        // console.log('res',res)
        // 使用span作为判断条件不是很严谨,该种异常出现于基于上一种直接在P元素中连续触发按键(range.commonAncestorContainer.tagName === "P"是debounce内只触发一次按键事件),会进入原先写有代码的判断分支,姑且现在这里做处理

        const target = res;
        console.log("normal", target);
        const currentNodeValue = partAText + keyData + partBText;
        // console.error("--------修改值---------", currentNodeValue);
        target.text = currentNodeValue;
        // rangeForTextChange();
        clearRange();
        setTimeout(() => {
          redirectRange(store, {
            startId: target.id,
            startOffset: partAText.length + 1,
            endId: target.id,
            endOffset: partAText.length + 1
          });
          saveStack(trees, store, {
            startId: target.id,
            startOffset: partAText.length + 1,
            endId: target.id,
            endOffset: partAText.length + 1
          });
          // console.timeEnd("-----timer-----\n");
        }, 0);
        return;
      });
      return;
    }
    // let currentOperateObj = this.range.commonAncestorContainer.parentNode;
    // // 0419有一个问题在于,当一个P级元素删除晚全部文本后,确实是会留下一个br站位保持换行,但是在此基础上新添加的文本是不在span标签中的,因而会对后续的trees造成影响,因此在这里追加一个判断,当currentOperateObj不为span时,创造一个span添加到P里
  },
  sceneComposiveMode: (wordKeeper, range, trees, store) => {
    console.log("sceneComposiveMode.range", range);
    // if (range.commonAncestorContainer){

    // }
    const currentOperateObj = range.commonAncestorContainer.parentNode;
    findTargetNode(currentOperateObj, trees).then(res => {
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
      clearRange();
      console.log("结束工作", target.text);
      // console.log(window.getSelection().getRangeAt(0));
      setTimeout(() => {
        redirectRange(store, {
          startId: target.id,
          startOffset: target.text.length,
          endId: target.id,
          endOffset: target.text.length
        });
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
export const overwriteRangeInput = {
  sceneDirectMode: () => {
    return;
  },
  sceneComposiveMode: () => {
    return;
  }
};
