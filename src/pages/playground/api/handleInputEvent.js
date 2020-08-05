import ElementNode from "../baseclass/tags";
// import { saveStack } from "../api/stack";
import {
  findTargetNode,
  // redirectRange,
  // rangeForTextChange,
  cleanEmptySibling,
  saveRange,
  clearRange
  // isActivated
} from "../api/corefunctions";
// let _ = require("lodash");
export const regularInput = {
  /**
   * @function
   * @param {String} keyData
   */
  sceneDirectMode: (keyData, style, range, trees, store) => {
    // console.log("watcherTrigger", range.watcherTrigger);
    saveRange(store);
    /**
     * 待追加特殊字符转义 如空格转&nbsp;
     * https://tool.oschina.net/commons?type=2
     */
    keyData = keyData.replace(" ", "&nbsp;");
    // console.log("转义后的字符", keyData);
    // console.log("saveRangefromrebuild", range.watcherTrigger);
    // 两个场景下,不能正确地调整range,一个场景是range.commonAncestorContainer是P元素,且innerText为空,此时将要触发按键;
    // 另一种场景在上一种场景的基础之下在debounce之内连续按键,导致了range.commonAncestorContainer是text节点,但range.commonAncestorContainer.parentNode是P元素(因为连续操作被debounce忽略,导致来不及处理range,场景1变成了场景2)
    // 此种场景为在空段落中输入内容,此时将创建一个span
    if (range.commonAncestorContainer.tagName === "P") {
      // console.log("for this moment");
      const currentOperateObj = range.commonAncestorContainer;
      // findTargetNode(currentOperateObj, trees).then(async res => {
      // if (res.children.length === 1 && res.children[0].tag === "br") {
      //   res.children.pop();
      // }
      const res = findTargetNode(currentOperateObj, trees);
      // console.log("res.children", res.children);
      const span = new ElementNode("span", keyData, style);
      // 0424 追加父节点属性parent
      span.parent = res;
      res.children.push(span);
      res.children.shift();
      clearRange();
      // setTimeout(() => {
      //   // rangeForTextChange(store);
      //   redirectRange(store, {
      //     startId: span.id,
      //     startOffset: span.text.length,
      //     endId: span.id,
      //     endOffset: span.text.length
      //   });
      //   saveStack(trees, store, {
      //     startId: span.id,
      //     startOffset: span.text.length,
      //     endId: span.id,
      //     endOffset: span.text.length
      //   });
      //   // console.timeEnd("-----timer-----\n");
      // }, 0);
      // });
      return {
        startId: span.id,
        startOffset: span.text.length,
        endId: span.id,
        endOffset: span.text.length
      };
    } else if (range.commonAncestorContainer.tagName === "BR") {
      // 在空行进行输入，将创建一个span元素,并且删除br元素，此时commonAncestorContainer是br，需要获取它的parentNode也就是P节点
      // console.log("空行输入", range.commonAncestorContainer);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // findTargetNode(currentOperateObj, trees).then(async res => {

      const target = findTargetNode(currentOperateObj, trees);
      const span = new ElementNode("span", keyData, style);
      span.parent = target;
      target.children.push(span);
      target.children.shift();
      // console.log("span", span.toString, "\n", target.toString());
      clearRange();
      // setTimeout(() => {
      //   redirectRange(store, {
      //     startId: span.id,
      //     startOffset: span.text.length,
      //     endId: span.id,
      //     endOffset: span.text.length
      //   });
      //   saveStack(trees, store, {
      //     startId: span.id,
      //     startOffset: span.text.length,
      //     endId: span.id,
      //     endOffset: span.text.length
      //   });
      // console.timeEnd("-----timer-----\n");
      // }, 0);
      return {
        startId: span.id,
        startOffset: span.text.length,
        endId: span.id,
        endOffset: span.text.length
      };
      // });
    } else if (
      range.commonAncestorContainer.nodeType === 3 &&
      range.commonAncestorContainer.parentNode.tagName === "P"
    ) {
      // if (res.tag !== "span" && range.commonAncestorContainer.nodeType===3) {
      // console.log("不声不响?", range.commonAncestorContainer.nodeValue);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const res = findTargetNode(currentOperateObj, trees);
      const span = new ElementNode(
        "span",
        range.commonAncestorContainer.nodeValue,
        style
      );
      // console.log(span);
      span.parent = res;
      res.children.push(span);
      res.children.shift();
      saveRange(store);
      clearRange();
      // setTimeout(() => {
      //   // rangeForTextChange(store);
      //   redirectRange(store, {
      //     startId: span.id,
      //     startOffset: span.text.length,
      //     endId: span.id,
      //     endOffset: span.text.length
      //   });
      //   saveStack(trees, store, {
      //     startId: span.id,
      //     startOffset: span.text.length,
      //     endId: span.id,
      //     endOffset: span.text.length
      //   });

      //   // console.timeEnd("-----timer-----\n");
      // }, 0);
      // });
      return {
        startId: span.id,
        startOffset: span.text.length,
        endId: span.id,
        endOffset: span.text.length
      };
      // }
    } else if (range.commonAncestorContainer.tagName === "SPAN") {
      const partAText = range.commonAncestorContainer.innerText.substr(
        0,
        range.startOffset
      );
      // console.log("partAText", partAText);
      const partBText = range.commonAncestorContainer.innerText.substr(
        range.endOffset,
        range.commonAncestorContainer.innerText.length
      );
      // console.log("partBText", partBText);
      const currentOperateObj = range.commonAncestorContainer;
      // findTargetNode(currentOperateObj, trees).then(async res => {

      const target = findTargetNode(currentOperateObj, trees);
      if (range.watcherTrigger !== "OFF") {
        const currentNodeValue = partAText + keyData + partBText;
        target.text = currentNodeValue;
        clearRange();
        // setTimeout(() => {
        //   redirectRange(store, {
        //     startId: target.id,
        //     startOffset: partAText.length + 1,
        //     endId: target.id,
        //     endOffset: partAText.length + 1
        //   });
        //   saveStack(trees, store, {
        //     startId: target.id,
        //     startOffset: partAText.length + 1,
        //     endId: target.id,
        //     endOffset: partAText.length + 1
        //   });
        // console.timeEnd("-----timer-----\n");
        // }, 0);
        return {
          startId: target.id,
          startOffset: partAText.length + 1,
          endId: target.id,
          endOffset: partAText.length + 1
        };
      } else {
        // console.error("unexcept raneg", range);
      }
      // });
      return;
    } else if (range.commonAncestorContainer.nodeType === 3) {
      const partAText = range.commonAncestorContainer.nodeValue.substr(
        0,
        range.startOffset
      );
      // console.log("partAText", partAText);
      const partBText = range.commonAncestorContainer.nodeValue.substr(
        range.endOffset,
        range.commonAncestorContainer.nodeValue.length
      );
      // console.log(partAText, partBText);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // findTargetNode(currentOperateObj, trees).then(async res => {
      // console.log('res',res)
      // 使用span作为判断条件不是很严谨,该种异常出现于基于上一种直接在P元素中连续触发按键(range.commonAncestorContainer.tagName === "P"是debounce内只触发一次按键事件),会进入原先写有代码的判断分支,姑且现在这里做处理
      const res = findTargetNode(currentOperateObj, trees);
      const target = res;
      console.log("test target text attr---------------", target);
      if (range.watcherTrigger !== "OFF") {
        // console.log("normallll", target);
        const currentNodeValue = partAText + keyData + partBText;
        // console.error("--------修改值---------", currentNodeValue);
        target.text = currentNodeValue;
        // rangeForTextChange();
        clearRange();
        range.watcherTrigger = "ON";
        // setTimeout(() => {
        // console.log("target", target);
        // redirectRange(store, {
        //   startId: target.id,
        //   startOffset: partAText.length + 1,
        //   endId: target.id,
        //   endOffset: partAText.length + 1
        // });
        // saveStack(trees, store, );
        // console.timeEnd("-----timer-----\n");
        // }, 0);
        return {
          startId: target.id,
          startOffset: partAText.length + 1,
          endId: target.id,
          endOffset: partAText.length + 1
        };
      }

      const partBContainer = new ElementNode(
        target.tag,
        partBText,
        target.style
      );
      partBContainer.parent = target.parent;
      partBContainer.id += 1;
      const newStyleSpan = new ElementNode(target.tag, keyData, style);
      newStyleSpan.parent = target.parent;

      target.text = partAText;
      const startIndex = target.parent.children.findIndex(
        item => item.id === target.id
      );
      target.parent.children.splice(
        startIndex + 1,
        0,
        newStyleSpan,
        partBContainer
      );
      // console.log("即将抛出", newStyleSpan, target.parent.children);
      clearRange();
      // setTimeout(() => {
      // redirectRange(store, {
      //   startId: newStyleSpan.id,
      //   startOffset: newStyleSpan.text.length,
      //   endId: newStyleSpan.id,
      //   endOffset: newStyleSpan.text.length
      // });
      // saveStack(trees, store, {
      //   startId: newStyleSpan.id,
      //   startOffset: newStyleSpan.text.length,
      //   endId: newStyleSpan.id,
      //   endOffset: newStyleSpan.text.length
      // });
      // console.timeEnd("-----timer-----\n");
      // }, 0);
      return {
        startId: newStyleSpan.id,
        startOffset: newStyleSpan.text.length,
        endId: newStyleSpan.id,
        endOffset: newStyleSpan.text.length
      };
      // });
      // return;
    } else {
      console.error(
        "unexcepted range-------------------------range.commonAncestorContainer.tagName",
        range.commonAncestorContainer.tagName,
        range.startContainer
      );
    }
    // let currentOperateObj = range.commonAncestorContainer.parentNode;
    // // 0419有一个问题在于,当一个P级元素删除晚全部文本后,确实是会留下一个br站位保持换行,但是在此基础上新添加的文本是不在span标签中的,因而会对后续的trees造成影响,因此在这里追加一个判断,当currentOperateObj不为span时,创造一个span添加到P里
  },
  sceneComposiveMode: (wordKeeper, style, range, trees, store) => {
    // console.log("sceneComposiveMode.range", range);
    // console.log("watcherTrigger", range.watcherTrigger);
    if (range.startContainer.nodeType === 3) {
      // console.log("直球！");
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // findTargetNode(currentOperateObj, trees).then(res => {

      let target = findTargetNode(currentOperateObj, trees);
      if (range.watcherTrigger !== "OFF") {
        // console.log(
        //   "正在受影响的实例",
        //   range.startContainer,
        //   range.startOffset,
        //   range.startOffset + wordKeeper.length
        // );
        const currentNodeValue = range.commonAncestorContainer.nodeValue;
        // console.log(currentNodeValue);
        const startOffset = store.state.prevRangeFactor.startOffset;
        console.log(
          wordKeeper,
          "--------预览结果------------",
          currentNodeValue.substring(0, startOffset) + wordKeeper
        );
        // console.log(
        //   "准备工作",
        //   store.state.prevRangeFactor.startTextTankAncestor
        // );
        range.watcherTrigger = "ON";
        saveRange(store);
        target.text = currentNodeValue;
        // 需要在clearRange之前
        const offset = range.startOffset + wordKeeper.length;
        clearRange();
        // setTimeout(() => {
        //   const id = target.id;
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
        // console.log("ready to return", target, offset);
        const id = target.id;
        return {
          startId: id,
          startOffset: offset,
          endId: id,
          endOffset: offset
        };
      }
      const currentNodeValue = range.commonAncestorContainer.nodeValue;
      // console.log("currentNodeValue", currentNodeValue);
      // 求partA.text
      const partAText = currentNodeValue.substring(0, range.startOffset);
      target.text = partAText;

      // console.log("partAText", partAText);
      // 求新输入部分
      const newStyleSpan = new ElementNode(target.tag, wordKeeper, style);
      newStyleSpan.parent = target.parent;
      // console.log("newStyleSpan", newStyleSpan);
      // 求partB
      const partBText = currentNodeValue.substring(
        range.startOffset + wordKeeper.length
      );
      const partBContainer = new ElementNode(
        target.tag,
        partBText,
        target.style
      );
      // 防止newStyleSpan与partBContainerID重复
      partBContainer.id += 1;
      partBContainer.parent = target.parent;

      // console.log("partBContainer", partBContainer);
      // 插入兄弟节点中
      const targetIndex = target.parent.children.findIndex(
        item => item.id === target.id
      );
      target.parent.children.splice(
        targetIndex + 1,
        0,
        newStyleSpan,
        partBContainer
      );
      clearRange();
      // setTimeout(() => {

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
      const id = newStyleSpan.id;
      const offset = newStyleSpan.text.length;
      return {
        startId: id,
        startOffset: offset,
        endId: id,
        endOffset: offset
      };
      // });
    } else if (range.startContainer.tagName === "SPAN") {
      // range被其他API(如删除)重定向到span
      // console.log("被重定向到span", range.startContainer.innerText, range.startOffset);
      let target = findTargetNode(range.startContainer, trees);
      // console.log(
      //   "编辑前",
      //   target.text.substring(0, range.startOffset),
      //   '\n',
      //   wordKeeper,
      //   '\n',
      //   target.text.substr(range.endOffset)
      // );
      const newvalue =
        target.text.substring(0, range.startOffset) +
        wordKeeper +
        target.text.substr(range.endOffset);
      // console.log("编辑完成", newvalue);
      target.text = newvalue;
      // const targetPara = target.parent;
      // const newSpan = new ElementNode("span", wordKeeper, style);
      // newSpan.parent = target;
      // targetPara.children.unshift(newSpan);
      // const id = newSpan.id;
      // console.log("new range", {
      //   startId: id,
      //   startOffset: newSpan.text.length,
      //   endId: id,
      //   endOffset: newSpan.text.length
      // });
      const id = target.id;
      const offset = range.startOffset + wordKeeper.length;
      return {
        startId: id,
        startOffset: offset,
        endId: id,
        endOffset: offset
      };
    } else if (range.startContainer.tagName === "P") {
      // 空段落
      // 节省性能，不用find方法
      const target = trees.children.find(
        item => item.id === range.startContainer.id
      );
      const newSpan = new ElementNode("span", wordKeeper, style);
      newSpan.parent = target;
      // target.children.splice(0, 1, newSpan);
      if (target.children.length === 1 && target.children[0].tag === "br") {
        // console.log("空段落输入，删除br，用span替代");
        target.children.splice(0, 1, newSpan);
      } else {
        // console.log("意料之外的target.children", target);
        return;
      }
      clearRange();
      // setTimeout(() => {
      //   const id = newSpan.id;
      //   redirectRange(store, {
      //     startId: id,
      //     startOffset: newSpan.text.length,
      //     endId: id,
      //     endOffset: newSpan.text.length
      //   });
      //   saveStack(trees, store, {
      //     startId: id,
      //     startOffset: newSpan.text.length,
      //     endId: id,
      //     endOffset: newSpan.text.length
      //   });
      // }, 0);
      const id = newSpan.id;
      return {
        startId: id,
        startOffset: newSpan.text.length,
        endId: id,
        endOffset: newSpan.text.length
      };
    } else {
      // console.log("意料之外的range", range);
    }
  }
};
export const overwriteRangeInput = {
  sceneDirectMode: {
    spanParas: function(keyData, range, trees) {
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
          // console.log("target", res);
          // 获取P节点的id,进行字符串截取
          // partA
          const partAText =
            target.text.substring(0, range.startOffset) + keyData;
          console.log("partAText", partAText);
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
          //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置
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
          restNodeInP[0].text = partBText;
          restNodeInP.forEach(item => (item.parent = target.parent.id));
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
          //     startOffset: offset,
          //     startId: id,
          //     endId: id,
          //     endOffset: offset
          //   });
          // }, 0);
          // });
          const id = target.id;
          const offset = partAText.length;
          return {
            startOffset: offset,
            startId: id,
            endId: id,
            endOffset: offset
          };
        } else if (endDom.tagName === "P") {
          // console.log("endDom.tagName === 'P'in input");
          // findTargetNode(startObj, trees).then(async res => {
          const target = findTargetNode(startObj, trees);
          const partAText =
            target.text.substring(0, range.startOffset) + keyData;
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
          // setTimeout(() => {
          //   // 新的range应为target，因为新增加的行添加在target之上
          //   const id = target.id;
          //   redirectRange(store, {
          //     startId: id,
          //     startOffset: partAText.length,
          //     endId: id,
          //     endOffset: partAText.length
          //   });
          //   saveStack(trees, store, {
          //     startId: id,
          //     startOffset: partAText.length,
          //     endId: id,
          //     endOffset: partAText.length
          //   });
          // }, 0);
          // });
          // 新的range应为target，因为新增加的行添加在target之上
          const id = target.id;
          return {
            startId: id,
            startOffset: partAText.length,
            endId: id,
            endOffset: partAText.length
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
          // console.log(
          //   "需要截取endDom字符串 in  input",
          //   startDom,
          //   endDom.parentNode
          // );
          // findTargetNode(endDom.parentNode, trees).then(async res => {
          const target = findTargetNode(endDom.parentNode, trees);
          // console.log("endDom", res);
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
          // const partAText =
          const supposevalue = keyData + target.text.substring(range.endOffset);
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
          //   setTimeout(() => {
          //     const id = target.id;
          //     redirectRange(store, {
          //       startId: id,
          //       startOffset: keyData.length,
          //       endId: id,
          //       endOffset: keyData.length
          //     });
          //     saveStack(trees, store, {
          //       startId: id,
          //       startOffset: keyData.length,
          //       endId: id,
          //       endOffset: keyData.length
          //     });
          //   }, 0);
          // // });

          const id = target.id;
          return {
            startId: id,
            startOffset: keyData.length,
            endId: id,
            endOffset: keyData.length
          };
        } else {
          if (endDom.tagName === "P") {
            console.log("endDom,完整截取了N个P，计算index即可 in input");
            const startDom = range.startContainer;
            const endDom = range.endContainer;
            const startParaIndex = trees.children.findIndex(
              item => item.id === startDom.id
            );
            const endParaIndex = trees.children.findIndex(
              item => item.id === endDom.id
            );
            // findTargetNode(endDom, trees).then(async res => {
            console.log("splice", res);
            // const target = res;
            const res = findTargetNode(endDom, trees);
            const newPara = new ElementNode("p");
            const newSpan = new ElementNode("span", keyData);
            newPara.parent = trees;
            newSpan.parent = newPara;
            newPara.children.push(newSpan);
            trees.children.splice(
              startParaIndex,
              endParaIndex - startParaIndex,
              newPara
            );
            clearRange();
            // setTimeout(() => {
            //   const id = newSpan.id;
            //   redirectRange(store, {
            //     startId: id,
            //     startOffset: newSpan.text.length,
            //     endId: id,
            //     endOffset: newSpan.text.length
            //   });
            //   saveStack(trees, store, {
            //     startId: id,
            //     startOffset: newSpan.text.length,
            //     endId: id,
            //     endOffset: newSpan.text.length
            //   });
            // }, 0);
            // });
            const id = newSpan.id;
            return {
              startId: id,
              startOffset: newSpan.text.length,
              endId: id,
              endOffset: newSpan.text.length
            };
          }
        }
      } else {
        console.log("意料之外的range");
        return;
      }
    },
    // 当选中一个段落的所有span时报错
    spanSpans: function(keyData, range, trees) {
      const startObj = range.startContainer.parentNode;
      console.log(
        "cross span:sceneDirectMode:overwriteRangeInput",
        range.commonAncestorContainer,
        startObj
      );
      // findTargetNode(startObj, trees).then(async res => {

      // console.log("res", res);
      const target = findTargetNode(startObj, trees);
      console.log("target", target);
      const partAText = target.text.substring(0, range.startOffset) + keyData;
      const partBText = range.endContainer.nodeValue.substr(
        range.endOffset,
        range.endContainer.nodeValue.length
      );

      const splitStartIndex = target.parent.children.findIndex(
        item => target.id === item.id
      );
      target.text = partAText;

      const splitEndIndex = target.parent.children.findIndex(
        item => item.id === range.endContainer.parentNode.id
      );
      target.parent.children[splitEndIndex].text = partBText;
      // const restNodeInP = target.parent.children.splice(
      //   splitEndIndex + 1,
      //   target.parent.children.length - splitEndIndex + 1
      // );
      target.parent.children.splice(
        splitStartIndex + 1,
        splitEndIndex - splitStartIndex - 1
      );
      cleanEmptySibling(trees);
      console.log("cishicike", target.parent.children);
      clearRange();
      if (target.parent.children.length === 0) {
        console.log("branch1");
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
        // 新的range应为target，因为新增加的行添加在target之上
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

        const id =
          partAText.length > 0
            ? target.id
            : target.parent.children[splitEndIndex].id;
        console.log("id", id);
        const offset = partAText.length;
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
    withinSingleSpan: function(keyData, range, trees) {
      console.log("选中一个文本节点的部分或全部内容");
      const partAText =
        range.commonAncestorContainer.nodeValue.substr(0, range.startOffset) +
        keyData;
      console.log("partAText", partAText);
      const partBText = range.commonAncestorContainer.nodeValue.substr(
        range.endOffset,
        range.commonAncestorContainer.nodeValue.length
      );
      console.log("partBText", partBText);
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      // 获取相应的虚拟dom的引用
      // findTargetNode(currentOperateObj, trees).then(async res => {
      const target = findTargetNode(currentOperateObj, trees);
      const splitStartIndex = target.parent.children.findIndex(item => {
        return target.id === item.id;
      });
      console.log(
        target.parent.children.length === 1,
        splitStartIndex === 0,
        partAText === ""
      );

      // 一个P中只有一个span节点并且这个span节点即将被消除
      const newvalue = partAText + partBText;
      target.text = newvalue;
      // 复用部分，后续可删除
      if (
        target.parent.children.length === 1 &&
        splitStartIndex === 0 &&
        newvalue === ""
      ) {
        console.log("装填空行");
        const br = new ElementNode("br");
        br.parent = target.parent;
        target.parent.children[0] = br;
      }
      // setTimeout(() => {
      //   const id = newvalue ? target.id : target.parent.id;
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
      const id = newvalue ? target.id : target.parent.id;
      const offset = partAText.length;
      return {
        startId: id,
        startOffset: offset,
        endId: id,
        endOffset: offset
      };
    }
  },
  sceneComposiveMode: {
    // store
    spanSpans: function(keyData, style, range, trees) {
      const startObj = range.startContainer.parentNode;
      console.log(
        "cross span:sceneComposiveMode:overwriteRangeInput",
        range.startContainer,
        startObj
      );
      // findTargetNode(startObj, trees).then(async res => {
      // console.log("res", res);
      const target = findTargetNode(startObj, trees);
      const partAText =
        range.startContainer.nodeValue.substring(0, range.startOffset) +
        keyData;
      console.log("partAText", partAText);
      let partBText = "";
      let splitEndIndex = -1;
      if (range.endContainer.nodeType === 3) {
        partBText = range.endContainer.nodeValue.substr(
          range.endOffset,
          range.endContainer.nodeValue.length
        );
        splitEndIndex = target.parent.children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
      } else if (range.endContainer.tagName === "P") {
        partBText = "";
        splitEndIndex = target.parent.children.length - 1;
      }
      console.log("splitEndIndex", splitEndIndex);
      const splitStartIndex = target.parent.children.findIndex(
        item => target.id === item.id
      );
      target.text = partAText;

      target.parent.children[splitEndIndex].text = partBText;
      // const restNodeInP = target.parent.children.splice(
      //   splitEndIndex + 1,
      //   target.parent.children.length - splitEndIndex + 1
      // );
      target.parent.children.splice(
        splitStartIndex + 1,
        splitEndIndex - splitStartIndex - 1
      );
      cleanEmptySibling(trees);
      console.log("cishicike", target.parent.children);
      clearRange();
      if (target.parent.children.length === 0) {
        const br = new ElementNode("br");
        br.parent = target.parent;
        target.parent.children.push(br);
        // setTimeout(() => {
        //   // 新的range应为target，因为新增加的行添加在target之上
        //   const id = target.id;
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
        // 新的range应为target，因为新增加的行添加在target之上
        const id = target.id;
        const offset = partAText.length;
        return {
          startOffset: offset,
          startId: id,
          endId: id,
          endOffset: offset
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
        const id =
          partAText.length > 0
            ? target.id
            : target.parent.children[splitEndIndex].id;
        const offset = partAText.length;
        return {
          startOffset: offset,
          startId: id,
          endId: id,
          endOffset: offset
        };
      }
      // });
      // return;
    }
  }
};
