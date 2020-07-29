import ElementNode from "../baseclass/tags";
// import { saveStack } from "../api/stack";
import {
  findTargetNode,
  // redirectRange,
  // rangeForTextChange,
  //   cleanEmptySibling,
  //   saveRange,
  clearRange
  // isActivated
} from "../api/corefunctions";
// export const enter =
export default {
  // 起点和终点在同一个之文本节点内
  // 如果range.commonAncestorContainer的节点类型为text(nodeType===3),则证明当前是一个文本节点,使用他的父节点parentNode作为currentObject;如果不是文本节点,则证明有可能发生了跨节点选取或者P级元素中存在span的元素节点和对应的文本节点
  scenePointMode: function(range, trees) {
    event.stopImmediatePropagation();
    event.preventDefault();
    // console.log("currentStyle", currentStyle);
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
    // console.log("currentOperateObj in breakline",currentOperateObj.style)
    // 获取相应的虚拟dom的引用
    // findTargetNode(currentOperateObj, trees).then(async res => {
    const target = findTargetNode(currentOperateObj, trees);
    // console.log("正在受影响的实例", target);
    const paraNode = range.commonAncestorContainer.parentNode.parentNode;
    // console.log("paraNode", paraNode.id);
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
      // console.log("insertIndex", insertIndex);
      // 组装新一行的元素节点
      const newPara = new ElementNode("p");
      const br = new ElementNode("br");
      // currentStyle = target.style;
      if (partBText) {
        const partBContainer = new ElementNode();
        partBContainer.tag = target.tag;
        // partBContainer.attr.id = partBContainer.id;
        partBContainer.text = partBText;
        partBContainer.style = target.style;
        partBContainer.children = target.children;
        // console.log("新的容器", partBContainer);
        // 换行时间发生的span节点在P节点中的索引
        // console.log('无法可说',target.id,target.parent)
        const restStartIndex = target.parent.children.findIndex(item => {
          return target.id === item.id;
        });
        // console.log("换行时间发生的span节点在P节点中的索引", restStartIndex);
        // 需要的索引是restStartIndex+1,来获取target在P中之后剩余的节点
        const restNodeInP = target.parent.children.splice(
          restStartIndex + 1,
          target.parent.children.length
        );
        // console.log("P元素切割剩余的数组", restNodeInP);
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
        // console.log("换行时间发生的span节点在P节点中的索引", restStartIndex);
        // 需要的索引是restStartIndex+1,来获取target在P中之后剩余的节点
        const restNodeInP = target.parent.children.splice(
          restStartIndex + 1,
          target.parent.children.length
        );
        // console.log("P元素切割剩余的数组", restNodeInP);
        restNodeInP.forEach(item => {
          item.parent = newPara;
        });

        // 0424 追加父节点属性parent
        br.parent = newPara;
        // console.log("空状态下,新一行");
        if (restNodeInP.length === 0) {
          newPara.children.push(br);
        } else {
          newPara.children.push(...restNodeInP);
        }
      }
      // console.log("newPara", newPara, br.toString());
      // 0424 追加父节点属性parent
      newPara.parent = trees;
      trees.children.splice(insertIndex, 0, newPara);
      clearRange();
      // setTimeout(() => {
      //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
      //   const id = newPara.id;
      //   redirectRange(store, {
      //     startId: id,
      //     endId: id
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     // startOffset: partAText.length,
      //     endId: id
      //     // endOffset: partAText.length
      //   });
      //   console.log("insertIndex", insertIndex);
      // }, 0);
      const id = newPara.id;
      return {
        startId: id,
        // startOffset: partAText.length,
        endId: id
        // endOffset: partAText.length
      };
    } else {
      // console.log("partAText无内容");
      insertIndex = trees.children.findIndex(item => {
        return item.id === paraNode.id;
      });
      const newPara = new ElementNode("p");
      const br = new ElementNode("br");
      // 0424 追加父节点属性parent
      br.parent = newPara;
      newPara.children.push(br);
      // console.log("即将插入", newPara.toString());
      // 0424 追加父节点属性parent
      newPara.parent = trees;
      trees.children.splice(insertIndex, 0, newPara);
      clearRange();
      // setTimeout(() => {
      //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
      //   const id = paraNode.id;
      //   redirectRange(store, {
      //     startId: id,
      //     endId: id
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     // startOffset: partAText.length,
      //     endId: id
      //     // endOffset: partAText.length
      //   });
      //   console.log("insertIndex", insertIndex);
      // }, 0);
      const id = paraNode.id;
      return {
        startId: id,
        // startOffset: partAText.length,
        endId: id
        // endOffset: partAText.length
      };
    }
    // });
    // return;
  },
  sceneRangeMode: {
    spanParas: function(range, trees) {
      // console.log("跨p选取", range);
      // 判定为选区模式
      // 跨P选取
      // if (range.commonAncestorContainer.id === "origin") {
      // event.stopImmediatePropagation();
      // event.preventDefault();
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
          // target.text = partAText;
          // console.log('修改后',target.parent.children)
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
          const endParaIndex = trees.children.findIndex(item => {
            return item.id === range.endContainer.parentNode.parentNode.id;
          });
          const endPara = trees.children[endParaIndex];
          const partBTextIndex = endPara.children.findIndex(item => {
            return range.endContainer.parentNode.id === item.id;
          });
          // 获取endContainer所属的span在所属的P节点中的index,在此index之前的节点全部弃置
          endPara.children = endPara.children.slice(partBTextIndex);
          // console.log("endPara.children", endPara.children);
          if (partBText) {
            endPara.children[0].text = partBText;
          } else {
            const br = new ElementNode("br");
            br.parent = endPara;
            endPara.children[0] = br;
          }
          // console.log(startParaIndex, endParaIndex);

          // trees.children[endParaIndex];
          // const restStartIndex = target.parent.children.findIndex(
          //   item => {
          //     return range.endContainer.parentNode.id === item.id;
          //   }
          // );
          // 删除沿途的P节点
          // console.log("开始删除");
          // console.log("优化测试");
          trees.children.splice(
            startParaIndex + 1,
            endParaIndex - startParaIndex - 1
          );
          clearRange();
          // 焦点重定向到结束段落的endOffset,在end节点之前的文本弃置
          // redirectRange(endPara.id);
          // setTimeout(() => {
          //   const id = endPara.id;
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
          const id = endPara.id;
          return {
            startId: id,
            endId: id
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
            endParaIndex - startParaIndex - 1
          );
          clearRange();
          // setTimeout(() => {
          //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          //   // 新的range应为target，因为新增加的行添加在target之上
          //   const id = endDom.id;
          //   redirectRange(store, {
          //     startId: id,
          //     endId: id
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     // startOffset: partAText.length,
          //     endId: id
          //     // endOffset: partAText.length
          //   });
          //   // console.log("insertIndex", insertIndex);
          // }, 0);
          // });
          const id = endDom.id;
          return {
            startId: id,
            // startOffset: partAText.length,
            endId: id
            // endOffset: partAText.length
          };
        } else {
          // console.log("意料之外的endDom", endDom);
          return;
        }
      }
      // startContainer选中了整个P
      else if (range.startContainer.tagName === "P") {
        // console.log("startContainer选中了整个P");
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
            // restNodeInP.forEach(item=>item.parent = target.parent)
            target.parent.children = restNodeInP;
          }
          // if (targetIndex) {}

          const newPara = new ElementNode("p");
          const br = new ElementNode("br");
          newPara.parent = trees;
          br.parent = newPara;
          newPara.children.push(br);
          // console.log("splice", startParaIndex, endParaIndex);
          trees.children.splice(
            startParaIndex,
            endParaIndex - startParaIndex,
            newPara
          );

          clearRange();
          // setTimeout(() => {
          //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          //   // 新的range应为target，因为新增加的行添加在target之上
          //   const id = target.parent.id;
          //   redirectRange(store, {
          //     startId: id,
          //     endId: id
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     // startOffset: partAText.length,
          //     endId: id
          //     // endOffset: partAText.length
          //   });
          //   // console.log("insertIndex", insertIndex);
          // }, 0);
          // });

          const id = target.parent.id;
          return {
            startId: id,
            // startOffset: partAText.length,
            endId: id
            // endOffset: partAText.length
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
            // console.log("splice", findTargetNode(endDom, trees));
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
            //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
            //   // 新的range应为target，因为新增加的行添加在target之上
            //   const id = newPara.id;
            //   redirectRange(store, {
            //     startId: id,
            //     endId: id
            //   });
            //   saveStack(trees, store, {
            //     startId: id,
            //     // startOffset: partAText.length,
            //     endId: id
            //     // endOffset: partAText.length
            //   });
            //   // console.log("insertIndex", insertIndex);
            // }, 0);
            // });
            // const newPara = new ElementNode("p");
            // const br = new ElementNode("br");
            // newPara.parent = trees;
            // br.parent = newPara;
            // newPara.children.push(br);

            const id = newPara.id;
            return {
              startId: id,
              // startOffset: partAText.length,
              endId: id
              // endOffset: partAText.length
            };
          }
        }
      } else {
        console.log("意料之外的range");
        return;
      }
      // startContainer为整个P
      // else if (range.startContainer.tagName === "P") {

      // }

      // }
    },
    spanSpans: function(range, trees) {
      console.log("in handler", range.startContainer);
      const startObj = range.startContainer.parentNode;
      // findTargetNode(startObj, trees).then(async res => {
      // console.log("res", res);
      const target = findTargetNode(startObj, trees);
      // partA处置
      const partAText = target.text.substring(0, range.startOffset);

      const partBText = range.endContainer.nodeValue.substr(
        range.endOffset,
        range.endContainer.nodeValue.length
      );
      const splitStartIndex = target.parent.children.findIndex(item => {
        return target.id === item.id;
      });
      console.log("splitStartIndex", splitStartIndex);
      // restStartIndex,也是endContainer所属span的index,以他自身为终点,以splitStartIndex为起点,这个跨度之间的实例文本全部置空
      const restStartIndex = target.parent.children.findIndex(item => {
        return range.endContainer.parentNode.id === item.id;
      });
      // const
      console.log("restStartIndex", restStartIndex);
      // 先获取partA之后的列表；再从这个列表中截取partB,同时达到处理range范围内的节点的效果
      // 这里的splitStartIndex+1是表示startContainer(不包括自身)之后的剩余剩余元素list的起始位置,因为partA的第一个text元素可能是被分割截取过的,所以,restNodeInP需要从后一位开始算,直接拿partB
      const restNodeInP = target.parent.children.slice(splitStartIndex + 1);
      target.parent.children = target.parent.children.slice(
        0,
        splitStartIndex + 1
      );
      target.text = partAText;

      console.log("after split", target.parent.children, "baby", restNodeInP);
      const paraBcontent = restNodeInP.slice(
        restStartIndex - (splitStartIndex + 1)
      );

      // const restNodeInP = target.parent.children.splice(
      //   restStartIndex + 1,
      //   target.parent.children.length - restStartIndex + 1
      // );
      console.log("剩余物料", paraBcontent);
      // 开始填充

      // paraBcontent场景处理
      if (paraBcontent.length !== 0) {
        if (partBText !== "") {
          // 如果存在partBText,普通赋值
          paraBcontent[0].text = partBText;
        } else {
          // 如果不存在partBText，且置换前paraBcontent长度为1，用空行取代
          if (paraBcontent.length === 1) {
            paraBcontent.pop();
            const br = new ElementNode("br");
            // 0424 追加父节点属性parent
            paraBcontent.push(br);
          }
        }
      } else {
        const br = new ElementNode("br");
        // 0424 追加父节点属性parent
        paraBcontent.push(br);
      }
      // 上边这个if，没有else了，这种情况下不存在paraBcontent.length === 0的场景，paraBcontent.length === 0意味着没有endcontainer或者说startContainer===endContainer。
      console.log("paraBcontent", paraBcontent);
      const newPara = new ElementNode("p");
      paraBcontent.forEach(item => {
        item.parent = newPara;
      });
      newPara.parent = trees;
      newPara.children = paraBcontent;
      trees.children.splice(splitStartIndex + 1, 0, newPara);
      clearRange();
      // setTimeout(() => {
      //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
      //   // 新的range应为target，因为新增加的行添加在target之上
      //   const id = newPara.id;
      //   redirectRange(store, {
      //     startId: id,
      //     endId: id
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     // startOffset: partAText.length,
      //     endId: id
      //     // endOffset: partAText.length
      //   });
        // console.log("insertIndex", insertIndex);
      // }, 0);
      // });
      const id = newPara.id;
      return {
        startId: id,
        // startOffset: partAText.length,
        endId: id
        // endOffset: partAText.length
      };
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
      const currentOperateObj = range.startContainer.parentNode;
      // 获取相应的虚拟dom的引用
      // console.log('range',range.startContainer.parentNode)
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const target = findTargetNode(currentOperateObj, trees);
      // console.log("res", target);
      const splitStartIndex = target.parent.children.findIndex(item => {
        return target.id === item.id;
      });
      // console.log(
      //   target.parent.children.length === 1,
      //   splitStartIndex === 0,
      //   partAText === ""
      // );

      // 一个P中只有一个span节点并且这个span节点即将被消除
      target.text = partAText;
      if (
        // target.parent.children.length === 1 &&
        splitStartIndex === 0 &&
        partAText === ""
      ) {
        // console.log("装填空行");
        const br = new ElementNode("br");
        br.parent = target.parent;
        target.parent.children[0] = br;
      }
      const restNodeInP = target.parent.children.splice(
        splitStartIndex + 1,
        target.parent.children.length
      );
      // console.log(restNodeInP);
      const newPara = new ElementNode("p");
      newPara.parent = trees;
      // 插入位置为target所在的P元素的后一个位置
      const insertIndex =
        trees.children.findIndex(item => {
          return item.id === target.parent.id;
        }) + 1;
      // 处理newPara,若有partBText,将partBContainer加到newPara的children的首位;如有restNodeInP,将restNodeInP,加到newPara的末位,最后添加到trees中
      if (restNodeInP.length !== 0) {
        restNodeInP.forEach(item => {
          item.parent = newPara;
        });
        newPara.children.push(...restNodeInP);
        if (partBText) {
          const partBContainer = new ElementNode(target.tag);
          partBContainer.text = partBText;
          partBContainer.style = target.style;
          // console.log("新的容器", partBContainer);
          partBContainer.parent = newPara;
          newPara.children.unshift(partBContainer);
        }
      } else {
        // console.log('该段落后续无元素')
        if (partBText) {
          // console.log("partBText作为新一行的元素", partBContainer);
          const partBContainer = new ElementNode(target.tag);
          partBContainer.text = partBText;
          partBContainer.style = target.style;
          partBContainer.parent = newPara;
          newPara.children.unshift(partBContainer);
        } else {
          // console.log('新一空行')
          const br = new ElementNode("br");
          // 0424 追加父节点属性parent
          br.parent = newPara;
          newPara.children.unshift(br);
        }
      }
      newPara.parent = trees;
      trees.children.splice(insertIndex, 0, newPara);
      // setTimeout(() => {
      //   const id = newPara.id;
      //   redirectRange(store, {
      //     startId: id,
      //     endId: id
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     // startOffset: partAText.length,
      //     endId: id
      //     // endOffset: partAText.length
      //   });
      // }, 0);
      // });
      const id = newPara.id;
      return {
        startId: id,
        // startOffset: partAText.length,
        endId: id
        // endOffset: partAText.length
      };
    }
  },
  sceneOutOfException1: function(range, trees) {
    // return console.log(range, trees, store)
    // console.log(range.commonAncestorContainer.tagName);
    // 若此时的range在BR上,当前是空段落，下一个回车键，将切到新一行，index为当前的paraIndex之后
    if (range.commonAncestorContainer.tagName === "BR") {
      // const paraIndex =

      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // findTargetNode(currentOperateObj, trees).then(async res => {
      console.log(
        "commonAncestorContainer",
        range.commonAncestorContainer.parentNode
      );
      const target = findTargetNode(currentOperateObj, trees);
      const paraIndex = trees.children.findIndex(item => {
        return item.id === target.id;
      });
      if (paraIndex < 0) {
        console.error("paraIndex违规", paraIndex);
      }
      console.log("paraIndex", paraIndex);
      const newPara = new ElementNode("p");
      const br = new ElementNode("br");
      newPara.parent = trees;
      br.parent = newPara;
      newPara.children.push(br);
      trees.children.splice(paraIndex, 0, newPara);
      clearRange();
      // setTimeout(() => {
      //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
      //   // 新的range应为target，因为新增加的行添加在target之上
      //   const id = target.id;
      //   redirectRange(store, {
      //     startId: id,
      //     endId: id
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     // startOffset: partAText.length,
      //     endId: id
      //     // endOffset: partAText.length
      //   });
      //   // console.log("insertIndex", insertIndex);
      // }, 0);
      const id = target.id;
      return {
        startId: id,
        // startOffset: partAText.length,
        endId: id
        // endOffset: partAText.length
      };
      // });
    }
    // 当前是在文本首端，startcontianer是SPAN
    else if (range.commonAncestorContainer.tagName === "SPAN") {
      // console.log("WHEN SPAN");
      const currentOperateObj = range.commonAncestorContainer;
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const target = findTargetNode(currentOperateObj, trees);
      const paraIndex = trees.children.findIndex(item => {
        return item.id === target.parent.id;
      });
      const newPara = new ElementNode("p");
      const br = new ElementNode("br");
      newPara.parent = trees;
      br.parent = newPara;
      newPara.children.push(br);
      trees.children.splice(paraIndex, 0, newPara);
      clearRange();
      // setTimeout(() => {
      //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
      //   // 新的range应为target，因为新增加的行添加在target之上
      //   const id = target.id;
      //   redirectRange(store, {
      //     startId: id,
      //     endId: id
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     // startOffset: partAText.length,
      //     endId: id
      //     // endOffset: partAText.length
      //   });
      //   // console.log("insertIndex", insertIndex);
      // }, 0);
      const id = target.id;
      return {
        startId: id,
        // startOffset: partAText.length,
        endId: id
        // endOffset: partAText.length
      };
      // });
    } else if (range.commonAncestorContainer.tagName === "P") {
      console.log("WHEN P");
      const currentOperateObj = range.commonAncestorContainer;
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const target = findTargetNode(currentOperateObj, trees);
      const paraIndex = trees.children.findIndex(item => {
        return item.id === target.id;
      });
      const newPara = new ElementNode("p");
      const br = new ElementNode("br");
      newPara.parent = trees;
      br.parent = newPara;
      newPara.children.push(br);
      trees.children.splice(paraIndex, 0, newPara);
      clearRange();
      // setTimeout(() => {
      //   // const id = newPara.children[0]?newPara.children[0].id:newPara.id
      //   // 新的range应为target，因为新增加的行添加在target之上
      //   const id = target.id;
      //   redirectRange(store, {
      //     startId: id,
      //     endId: id
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     // startOffset: partAText.length,
      //     endId: id
      //     // endOffset: partAText.length
      //   });
      //   // console.log("insertIndex", insertIndex);
      // }, 0);
      // });
      const id = target.id;
      return {
        startId: id,
        // startOffset: partAText.length,
        endId: id
        // endOffset: partAText.length
      };
    }
  }
};
