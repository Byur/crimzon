import ElementNode from "../baseclass/tags";
import { saveStack } from "../api/stack";
import {
  findTargetNode,
  redirectRange,
  // rangeForTextChange,
  cleanEmptySibling,
  //   saveRange,
  clearRange
  // isActivated
} from "../api/corefunctions";
// import _ from "lodash";
export default {
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
      // findTargetNode(currentOperateObj, trees).then(async res => {
      console.log("常规处理");
      const target = findTargetNode(currentOperateObj, trees);
      target.text = partAText.substring(0, partAText.length - 1) + partBText;
      clearRange();
      cleanEmptySibling(trees);
      // let selection = window.getSelection();
      // selection.removeAllRanges();
      // setTimeout(() => {
      //   const id = target.id;
      // console.log(
      //     "---------------------------store------------------",
      //     store
      //   );
      //   redirectRange(store, {
      //     startId: id,
      //     startOffset: partAText.length - 1,
      //     endId: id,
      //     endOffset: partAText.length - 1
      //   });

      // }, 0);
      const id = target.id;
      saveStack(trees, store, {
        startId: id,
        startOffset: partAText.length - 1,
        endId: id,
        endOffset: partAText.length - 1
      });
      return {
        startId: id,
        startOffset: partAText.length - 1,
        endId: id,
        endOffset: partAText.length - 1
      };
      // });
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
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const target = findTargetNode(currentOperateObj, trees);
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
            const br = new ElementNode("br");
            br.parent = target.parent;
            target.parent.children.unshift(br);
            cleanEmptySibling(trees);
            clearRange();
            // setTimeout(() => {
            //   const id = target.parent.id;
            //   redirectRange(store, {
            //     startId: id,
            //     // startOffset: partAText.length-1,
            //     endId: id
            //     // endOffset: partAText.length-1
            //   });
            const id = target.parent.id;
            saveStack(trees, store, {
              startId: id,
              startOffset: partAText.length,
              endId: id,
              endOffset: partAText.length
            });
            // }, 0);
            return {
              startId: id,
              // startOffset: partAText.length-1,
              endId: id
              // endOffset: partAText.length-1
            };
          }
        } else {
          // targetIndex>0,有前一个节点,因此不需要考虑P节点的index
          console.log("退到前一位");
          console.log("该节点即将删除");

          const previousSibling =
            range.startContainer.parentNode.previousSibling;
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
          // setTimeout(() => {
          //   redirectRange(store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          saveStack(trees, store, {
            startId: idForSaveStack,
            startOffset: partAText.length,
            endId: idForSaveStack,
            endOffset: partAText.length
          });
          // console.log("longtimemytree", trees);
          // }, 0);

          const id = previousSibling.id;
          const offset = previousSibling.innerText.length;
          return {
            startId: id,
            startOffset: offset,
            endId: id,
            endOffset: offset
          };
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
            const br = new ElementNode("br");
            br.parent = target.parent;
            target.parent.children.unshift(br);
          }
        }

        cleanEmptySibling(trees);
        clearRange();
        // setTimeout(() => {
        //   const id = target.parent.id;
        //   const offset = 0;
        //   // target.parent.children[targetIndex - 1].text.length;
        //   redirectRange(store, {
        //     startId: id,
        //     startOffset: offset,
        //     endId: id,
        //     endOffset: offset
        //   });

        // }, 0);
        const id = target.parent.id;
        const offset = 0;
        saveStack(trees, store, {
          startId: id,
          startOffset: offset,
          endId: id,
          endOffset: offset
        });
        return {
          startId: id,
          startOffset: offset,
          endId: id,
          endOffset: offset
        };
        // } else {

        // }
      }

      // console.log(targetIndex);
      // if (targetIndex >= 0) {
      // console.log("退到前一位");
      //   if (paraIndex === 0) {
      //     if (partAText.length === 0) {
      // console.log("删无可删");
      //       return;
      //     } else if (partAText.length === 1) {
      // console.log("该节点即将删除");

      //       const previousSibling =
      //         range.startContainer.parentNode.previousSibling;
      //       const id = previousSibling.id;
      //       const offset = previousSibling.innerText.length;

      //       const idForSaveStack = range.startContainer.parentNode.id;
      // console.log(
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
      // console.log("longtimemytree", trees);
      //       }, 0);
      //     } else {
      // console.log("paraIndex?", paraIndex);
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
      // console.log("上一个段落存在有意义的元素节点");
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
      // console.log("上一个段落没有实体元素,新range在段首");
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
      //   return;
      // // });
      // return;
    } else {
      // partAText.length===0,以range计算startContainer的特性,此时焦点前方已经不存在文本节点,因此可以视为焦点当前位于段首，所以该判断分支在即将删除段落时可用，该判断分支，在一个段落中连续触发删除时间，会触发一次，如果触发时上一个段落是空段落，将会执行sceneOutOfException1的判断。
      // console.log("partAText.length===0,应该不会出现这种情况");
      // console.log("删无可删");
      // 整段删除
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const target = findTargetNode(currentOperateObj, trees);
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

          // console.log(nextPosition);
          // 改换门庭
          trees.children[paraIndex].children.forEach(item => {
            item.parent = elderBroParaNode;
          });
          elderBroParaNode.children = elderBroParaNode.children.concat(
            // 删除当前段落
            trees.children[paraIndex].children
          );
          // console.log("剪切之后", elderBroParaNode.children);
          trees.children.splice(paraIndex, 1);
          clearRange();
          // setTimeout(() => {
          //   const id = nextPosition.id;
          //   const offset = nextPosition.text.length;
          //   // target.parent.children[targetIndex - 1].text.length;
          //   redirectRange(store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          // }, 0);
          const id = nextPosition.id;
          const offset = nextPosition.text.length;
          saveStack(trees, store, {
            startId: id,
            startOffset: offset,
            endId: id,
            endOffset: offset
          });
          return {
            startId: id,
            startOffset: offset,
            endId: id,
            endOffset: offset
          };
        }
        // 前一个段落是空段落
        else {
          // 删除前一个段落
          trees.children.splice(paraIndex - 1, 1);
          clearRange();
          // setTimeout(() => {
          //   const id = target.parent.id;
          //   const offset = 0;
          //   // target.parent.children[targetIndex - 1].text.length;
          //   redirectRange(store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          // }, 0);
          const id = target.parent.id;
          const offset = 0;
          saveStack(trees, store, {
            startId: id,
            startOffset: offset,
            endId: id,
            endOffset: offset
          });
          return {
            startId: id,
            startOffset: offset,
            endId: id,
            endOffset: offset
          };
        }
      } else {
        // console.log("paraIndex === 0");
        return;
      }
      // });

      // return;
    }
  },
  sceneOutOfException1: (range, trees) => {
    // console.log("进入sceneOutOfException1", range);
    // const partAText = range.commonAncestorContainer.nodeValue.substr(
    //   0,
    //   range.startOffset
    // );
    // console.log("partAText", partAText);
    // const partBText = range.commonAncestorContainer.nodeValue.substr(
    //   range.endOffset,
    //   range.commonAncestorContainer.nodeValue.length
    // );
    // 此时commonAncestorContainer是span节点或者P节点，需要区分判断，一般来说此时由连续删除事件所重定向的range会是一个span(offset===0)或者br(offset===0),但由鼠标点击或者方向键调整的range，如果移动到一个空段落（也有可能是段首）的时候，此时的commonAncestorContainer会是P节点，所以需要区分处理。
    const currentOperateObj = range.commonAncestorContainer;
    // findTargetNode(currentOperateObj, trees).then(async res => {
    const target = findTargetNode(currentOperateObj, trees);
    // console.log(target);
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
      // console.log(
      // "存在上一个段落,退回上一段,其中有可能上一段是个空段落,需要区别处理"
      // );

      // 如果paraIndex>0,退回上一段最后一个节点的末端
      // 当前没有选中文本节点，当前range的commonAncestorContainer是一个br
      const elderBroParaNode = trees.children[paraIndex - 1];
      // console.log("前一个段落", elderBroParaNode);
      if (
        elderBroParaNode.children.length > 0 &&
        elderBroParaNode.children[0].tag !== "br"
      ) {
        const nextPosition =
          elderBroParaNode.children[elderBroParaNode.children.length - 1];

        // console.log(nextPosition);
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
        // console.log("剪切之后", elderBroParaNode.children);
        trees.children.splice(paraIndex, 1);
        cleanEmptySibling(trees);
        clearRange();
        // setTimeout(() => {
        //   const id = nextPosition.id;
        //   const offset = nextPosition.text.length;
        //   // target.parent.children[targetIndex - 1].text.length;
        //   redirectRange(store, {
        //     startId: id,
        //     startOffset: offset,
        //     endId: id,
        //     endOffset: offset
        //   });
        //   saveStack(trees, store, {
        //     startId: id,
        //     startOffset: offset,
        //     endId: id,
        //     endOffset: offset
        //   });
        // }, 0);
        const id = nextPosition.id;
        const offset = nextPosition.text.length;
        return {
          startId: id,
          startOffset: offset,
          endId: id,
          endOffset: offset
        };
      }
      // 前一个段落是空段落
      else {
        // 删除前一个段落
        if (paraIndex > 0) {
          // console.log("删除前一个段落");
          trees.children.splice(paraIndex - 1, 1);
        }
        // clearRange();
        // setTimeout(() => {
        //   const id = target.tag !== "p" ? target.parent.id : target.id;
        //   const offset = 0;
        //   // target.parent.children[targetIndex - 1].text.length;
        //   redirectRange(store, {
        //     startId: id,
        //     startOffset: offset,
        //     endId: id,
        //     endOffset: offset
        //   });
        //   saveStack(trees, store, {
        //     startId: id,
        //     startOffset: offset,
        //     endId: id,
        //     endOffset: offset
        //   });
        // }, 0);
        const id = target.tag !== "p" ? target.parent.id : target.id;
        const offset = 0;
        return {
          startId: id,
          startOffset: offset,
          endId: id,
          endOffset: offset
        };
      }
    } else {
      // console.log(range.commonAncestorContainer.innerText);
      // range.commonAncestorContainer.innerText.substring(0, partAText.length - 1)
      // target.text = "";
      // cleanEmptySibling(trees);
      // console.log("paraIndex<=0", paraIndex);
      if (target.tag === "br") {
        // console.log("最后一个段落,无法再向上删除");
        return;
      } else if (target.tag === "span") {
        if (target.text.length === 1) {
          target.text = range.commonAncestorContainer.innerText.substring(
            0,
            range.commonAncestorContainer.innerText.length - 1
          );
          // 补充一个br保持空行
          const br = new ElementNode("br");
          br.parent = target.parent;
          target.parent.children.unshift(br);
          clearRange();
          cleanEmptySibling(trees);
          // setTimeout(() => {
          //   const id = target.parent.id;
          //   const offset = 0;
          //   // target.parent.children[targetIndex - 1].text.length;
          //   redirectRange(store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          // }, 0);
          const id = target.parent.id;
          const offset = 0;
          return {
            startId: id,
            startOffset: offset,
            endId: id,
            endOffset: offset
          };
        }
        // console.log("thisthisthis")
        return;
      } else if (target.tag === "p") {
        // console.log("????");
      }
    }
    // const partAText = target.text.substr(0, range.startOffset);
    // console.log("partAText", partAText);
    // const partBText = target.text.substr(range.endOffset, target.text.length);
    // console.log("partAText", partAText, "partBText", partBText);
    // console.log(store);
    // });
    return;
  },
  sceneRangeMode: {
    spanParas: function(range, trees, store) {
      // console.log("跨p选取", range);
      // 判定为选区模式
      // 跨P选取
      // console.log("起点", range.startContainer);
      // startContainer是一个text节点
      if (range.startContainer.nodeType === 3) {
        const endDom = range.endContainer;
        const startObj = range.startContainer.parentNode;
        if (endDom.nodeType === 3) {
          // findTargetNode(startObj, trees).then(async res => {
          const target = findTargetNode(startObj, trees);
          // console.log("target", target);
          // 获取P节点的id,进行字符串截取
          // partA
          const partAText = target.text.substring(0, range.startOffset);
          // console.log("partAText", partAText);
          // partB
          const partBText = range.endContainer.nodeValue.substr(
            range.endOffset,
            range.endContainer.nodeValue.length
          );
          // console.log('修改后',target.parent.children)
          const targetIndex = target.parent.children.findIndex(item => {
            return target.id === item.id;
          });
          // console.log("span节点在partA中的索引", targetIndex);
          //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置,取[0,targetIndex+1]区间的值
          target.parent.children = target.parent.children.slice(
            0,
            targetIndex + 1
          );
          // console.log("A部分", target.parent, target.parent.children);
          target.parent.children[targetIndex].text = partAText;
          // 至此，partA已经处理好了
          const startParaIndex = trees.children.findIndex(item => {
            return item.id === target.parent.id;
          });
          const endParaIndex = trees.children.findIndex(item => {
            return item.id === range.endContainer.parentNode.parentNode.id;
          });
          const endPara = trees.children[endParaIndex];
          const partBTextIndex = endPara.children.findIndex(item => {
            return range.endContainer.parentNode.id === item.id;
          });
          // 处理partB,接到partA后边
          const restNodeInP = endPara.children.slice(partBTextIndex);

          // 改变待拼接数据的parent

          restNodeInP.forEach(item => (item.parent = target.parent));
          restNodeInP[0].text = partBText;

          // console.log("restNodeInP", restNodeInP);
          target.parent.children.splice(
            target.parent.children.length,
            0,
            ...restNodeInP
          );
          // endPara.children = endPara.children.slice(partBTextIndex);
          // console.log("endPara.children", endPara.children);
          // console.log(startParaIndex, endParaIndex);
          // 删除沿途的P节点
          // console.log("开始删除");
          // console.log("优化测试");
          trees.children.splice(
            startParaIndex + 1,
            endParaIndex - startParaIndex
          );
          clearRange();
          // 焦点重定向到结束段落的endOffset,在end节点之前的文本弃置
          // setTimeout(() => {
          //   const id = target.id;
          //   const offset = partAText.length;
          //   redirectRange(store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     startOffset: offset,
          //     endId: id,
          //     endOffset: offset
          //   });
          // }, 0);
          // });
          const id = target.id;
          const offset = partAText.length;
          return {
            startId: id,
            startOffset: offset,
            endId: id,
            endOffset: offset
          };
        } else if (endDom.tagName === "P") {
          // console.log("endDom.tagName === 'P'");
          // findTargetNode(startObj, trees).then(async res => {
          const target = findTargetNode(startObj, trees);
          const partAText = target.text.substring(0, range.startOffset);
          // console.log("partAText", partAText);

          const targetIndex = target.parent.children.findIndex(item => {
            return target.id === item.id;
          });
          // console.log("span节点在partA中的索引", targetIndex);
          //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置
          target.parent.children = target.parent.children.slice(
            0,
            targetIndex + 1
          );
          // console.log("A部分", target.parent, target.parent.children);
          target.parent.children[targetIndex].text = partAText;

          const startParaIndex = trees.children.findIndex(item => {
            return item.id === target.parent.id;
          });
          // 再次强调，endContainer是一个P元素
          const endParaIndex = trees.children.findIndex(item => {
            return item.id === range.endContainer.id;
          });
          trees.children.splice(
            startParaIndex + 1,
            endParaIndex - startParaIndex
          );
          clearRange();
          setTimeout(() => {
            // 新的range应为target，因为新增加的行添加在target之上
            const id = target.id;
            const offset = partAText.length;
            redirectRange(store, {
              startOffset: offset,
              startId: id,
              endId: id,
              endOffset: offset
            });
            saveStack(trees, store, {
              startOffset: offset,
              startId: id,
              endId: id,
              endOffset: offset
            });
          }, 0);
          // });
          const id = target.id;
          const offset = partAText.length;
          return {
            startOffset: offset,
            startId: id,
            endId: id,
            endOffset: offset
          };
        } else {
          // console.log("意料之外的endDom", endDom);
          return;
        }
      }
      // startContainer选中了整个P
      else if (range.startContainer.tagName === "P") {
        const startDom = range.startContainer;
        const endDom = range.endContainer;
        if (endDom.nodeType === 3) {
          // console.log("需要截取endDom字符串", startDom, endDom.parentNode);
          // findTargetNode(endDom.parentNode, trees).then(async res => {
          const target = findTargetNode(endDom.parentNode, trees);
          // console.log("endDom", target);
          const startParaIndex = trees.children.findIndex(
            item => item.id === startDom.id
          );
          const endParaIndex = trees.children.findIndex(
            item => item.id === target.parent.id
          );
          // 截取节点在原P节点中的索引
          const targetIndex = target.parent.children.findIndex(
            item => item.id === target.id
          );
          const supposevalue = target.text.substring(range.endOffset);
          // console.log("若这是段落中的最后一个子节点，并且将被赋值为空字符串");
          // 若这是段落中的最后一个子节点，并且将被赋值为空字符串
          if (supposevalue === "" && targetIndex === 0) {
            // console.log("condition1");
            const br = new ElementNode("br");
            br.parent = target.parent;
            target.parent.children[targetIndex] = br;
          } else {
            // console.log("condition2");
            target.text = supposevalue;
            const restNodeInP = target.parent.children.slice(targetIndex);
            target.parent.children = restNodeInP;
          }

          // console.log("splice", startParaIndex, endParaIndex);
          trees.children.splice(startParaIndex, endParaIndex - startParaIndex);

          clearRange();
          // setTimeout(() => {
          //   const id = target.parent.id;
          //   redirectRange(store, {
          //     startId: id,
          //     endId: id
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     endId: id
          //   });
          // }, 0);
          // });

          const id = target.parent.id;
          return {
            startId: id,
            endId: id
          };
        } else {
          if (endDom.tagName === "P") {
            // console.log("endDom,完整截取了N个P，计算index即可");
            const startDom = range.startContainer;
            const endDom = range.endContainer;
            const startParaIndex = trees.children.findIndex(
              item => item.id === startDom.id
            );
            const endParaIndex = trees.children.findIndex(
              item => item.id === endDom.id
            );
            // findTargetNode(endDom, trees).then(async res => {
            // console.log("splice", res);
            // const target = res;

            const newPara = new ElementNode("p");
            const br = new ElementNode("br");
            newPara.parent = trees;
            br.parent = newPara;
            newPara.children.push(br);
            trees.children.splice(
              startParaIndex,
              endParaIndex - startParaIndex,
              newPara
            );
            clearRange();
            // setTimeout(() => {
            //   const id = newPara.id;
            //   redirectRange(store, {
            //     startId: id,
            //     endId: id
            //   });
            //   saveStack(trees, store, {
            //     startId: id,
            //     endId: id
            //   });
            // }, 0);
            // });

            const id = newPara.id;
            return {
              startId: id,
              endId: id
            };
          }
        }
      } else {
        // console.log("意料之外的range");
        return;
      }
    },
    spanSpans: function(range, trees) {
      const startObj = range.startContainer.parentNode;
      // console.log("cross span", range.commonAncestorContainer, startObj);
      // findTargetNode(startObj, trees).then(async res => {
      const target = findTargetNode(startObj, trees);
      // console.log("res", target);
      const partAText = target.text.substring(0, range.startOffset);
      const partBText = range.endContainer.nodeValue.substr(
        range.endOffset,
        range.endContainer.nodeValue.length
      );
      // console.log("beforesplice", _.cloneDeep(target.parent.children));
      const splitStartIndex = target.parent.children.findIndex(
        item => target.id === item.id
      );
      target.text = partAText;

      const splitEndIndex = target.parent.children.findIndex(
        item => item.id === range.endContainer.parentNode.id
      );
      // console.log("splitEndIndex", splitEndIndex);
      target.parent.children[splitEndIndex].text = partBText;
      // const restNodeInP = target.parent.children.splice(
      //   splitEndIndex + 1,
      //   target.parent.children.length - splitEndIndex + 1
      // );
      // target.parent.children.splice(
      //   splitStartIndex + 1,
      //   splitEndIndex - splitStartIndex - 1
      // );

      // console.log("before clean empty sibling", target.parent.children);
      cleanEmptySibling(trees);
      // console.log("cishicike", target.parent.children);
      // console.log(
      //   splitStartIndex,
      //   splitStartIndex + 1,
      //   splitEndIndex - splitStartIndex - 1
      // );
      clearRange();
      if (target.parent.children.length === 0) {
        const br = new ElementNode("br");
        br.parent = target.parent;
        target.parent.children.push(br);
        // setTimeout(() => {
        //   // 新的range应为target，因为新增加的行添加在target之上
        //   const id = target.parent.id;
        //   // const offset = partAText.length;
        //   redirectRange(store, {
        //     // startOffset: offset,
        //     startId: id,
        //     endId: id
        //     // endOffset: offset
        //   });
        //   saveStack(trees, store, {
        //     // startOffset: offset,
        //     startId: id,
        //     endId: id
        //     // endOffset: offset
        //   });
        // }, 0);
        const id = target.parent.id;
        return {
          // startOffset: offset,
          startId: id,
          endId: id
          // endOffset: offset
        };
      } else {
        // setTimeout(() => {
        //   // 新的range应为target，因为新增加的行添加在target之上
        //   const id =
        //     partAText.length > 0
        //       ? target.id
        //       : target.parent.children[splitEndIndex].id;
        //   const offset = partAText.length;
        //   redirectRange(store, {
        //     startOffset: offset,
        //     startId: id,
        //     endId: id,
        //     endOffset: offset
        //   });
        //   saveStack(trees, store, {
        //     startOffset: offset,
        //     startId: id,
        //     endId: id,
        //     endOffset: offset
        //   });
        // }, 0);
        let id;
        let offset;
        // id = partAText.length > 0
        //     ? target.id
        //     : target.parent.children[splitEndIndex].id;
        // 跨span删除时，若当事的两个span，最终都被赋值为空，则会因为shaking操作，导致选区部分包含的span，全部被删除，此时(删除后的)的parent.children的startIndex,会定位到原range.endContainer之后的第一个span且offfset因为partAtext为空的原因，设置为0;为了修正这种现象，这里将手动做一些调整
        // 删除一部分条件： && partBText.length === 0
        if (partAText.length === 0) {
          // console.log(
          //   "测试极端情况1",
          //   target.parent.children[splitStartIndex - 1]
          // );
          // 上边的输出，体现了一个极端情况为，当splitStartIndex为0的时候，splitStartIndex-1的位置是不存在的，因此需要做一些处理，即当splitStartIndex为0的时候，新的range为段首；
          if (splitStartIndex === 0) {
            // 存在整段删除的现象，因此新range有可能为空段落的段首
            id = target.parent.children[0]
              ? target.parent.children[0].id
              : target.parent.id;
            // id = target.parent.children[0].id;
            offset = 0;
          } else {
            id = target.parent.children[splitStartIndex - 1].id;
            offset = target.parent.children[splitStartIndex - 1].text.length;
          }
        } else {
          // console.log("normal",target.parent.children,splitStartIndex+1,splitEndIndex-(splitStartIndex+1));
          target.parent.children.splice(
            splitStartIndex + 1,
            splitEndIndex - (splitStartIndex + 1)
          );
          id = target.id;
          offset = partAText.length;
        }
        // const
        return {
          startOffset: offset,
          startId: id,
          endId: id,
          endOffset: offset
        };
      }
      // });
      // return;
    },
    withinSingleSpan: function(range, trees) {
      // console.log("选中一个文本节点的部分或全部内容");
      const partAText = range.commonAncestorContainer.nodeValue.substr(
        0,
        range.startOffset
      );
      // console.log("partAText", partAText);
      const partBText = range.commonAncestorContainer.nodeValue.substr(
        range.endOffset,
        range.commonAncestorContainer.nodeValue.length
      );
      // console.log("partBText", partBText);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // 获取相应的虚拟dom的引用
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const target = findTargetNode(currentOperateObj, trees);
      const splitStartIndex = target.parent.children.findIndex(item => {
        return target.id === item.id;
      });
      // console.log(
      //   target.parent.children.length === 1,
      //   splitStartIndex === 0,
      //   partAText === ""
      // );

      // 一个P中只有一个span节点并且这个span节点即将被消除
      const newvalue = partAText + partBText;
      target.text = newvalue;
      if (
        target.parent.children.length === 1 &&
        splitStartIndex === 0 &&
        newvalue === ""
      ) {
        // console.log("装填空行");
        const br = new ElementNode("br");
        br.parent = target.parent;
        target.parent.children[0] = br;
        const id = newvalue ? target.id : target.parent.id;
        const offset = partAText.length;
        return {
          startId: id,
          startOffset: offset,
          endId: id,
          endOffset: offset
        };
      }
      // 其他场景
      //
      if (target.parent.children.length !== 1) {
        const id = newvalue
          ? target.id
          : target.parent.children[splitStartIndex - 1].id;
        const offset = newvalue
          ? partAText.length
          : target.parent.children[splitStartIndex - 1].text.length;
        return {
          startId: id,
          startOffset: offset,
          endId: id,
          endOffset: offset
        };
      }

      // });
    }
  }
};
