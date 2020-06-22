import ElementNode from "../baseclass/tags";
import { saveStack } from "../api/stack";
import {
  findTargetNode,
  redirectRange,
  // rangeForTextChange,
  cleanEmptySibling,
  saveRange,
  clearRange
  // isActivated
} from "../api/corefunctions";
// stage1 for check style;stage2 for get exactly tree nodes by range
// stage1:不改动trees,返回一个多维list供检测样式用
export const refinedNodesByRange_stage1 = {
  spanParas: function(trees, range) {
    if (range.startContainer.nodeType === 3) {
      if (range.endContainer.nodeType === 3) {
        // 一个找到关联的trees节点的起点
        // 获取startContainer所在的P
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        const startIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        const endParaID = range.startContainer.parentNode.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        const endIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
        const copyPartOfTrees_startPara = trees.children[
          startParaIndex
        ].children.slice(startIndex);
        const copyPartOfTrees_EndPara = trees.children[
          endParaIndex
        ].children.slice(endIndex);
        const restParas = trees.children.slice(
          startParaIndex + 1,
          endParaIndex
        );
        const throwOut = [];
        throwOut.push(copyPartOfTrees_startPara);
        throwOut.push(...restParas);
        throwOut.push(copyPartOfTrees_EndPara);
        return throwOut;
      } else if (range.endContainer.tagName === "P") {
        // 一个找到关联的trees节点的起点
        // 获取startContainer所在的P
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        const startIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        const endParaID = range.startContainer.parentNode.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        // const endIndex = trees.children[startParaIndex].findIndex(
        //   item => item.id === range.endContainer.parentNode.id
        // );
        const copyPartOfTrees_startPara = trees.children[
          startParaIndex
        ].children.slice(startIndex);
        // const copyPartOfTrees_EndPara = trees.children[endParaIndex].slice(
        //   endIndex
        // );
        const restParas = trees.children.slice(
          startParaIndex + 1,
          endParaIndex
        );
        const throwOut = [];
        throwOut.push(copyPartOfTrees_startPara);
        throwOut.push(...restParas);
        // throwOut.push(copyPartOfTrees_EndPara);
        return throwOut;
      }
    } else if (range.startContainer.tagName === "P") {
      if (range.endContainer.nodeType === 3) {
        // 一个找到关联的trees节点的起点
        // 获取startContainer所在的P
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        // const startIndex = trees.children[startParaIndex].findIndex(
        //   item => item.id === range.startContainer.parentNode.id
        // );
        const endParaID = range.startContainer.parentNode.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        const endIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
        // const copyPartOfTrees_startPara = trees.children[startParaIndex].slice(
        //   startIndex
        // );
        const copyPartOfTrees_EndPara = trees.children[
          endParaIndex
        ].children.slice(endIndex);
        const restParas = trees.children.slice(
          startParaIndex + 1,
          endParaIndex
        );
        const throwOut = [];
        // throwOut.push(copyPartOfTrees_startPara);
        throwOut.push(...restParas);
        throwOut.push(copyPartOfTrees_EndPara);
        return throwOut;
      } else if (range.endContainer.tagName === "P") {
        // 一个找到关联的trees节点的起点
        // 获取startContainer所在的P
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        // const startIndex = trees.children[startParaIndex].findIndex(
        //   item => item.id === range.startContainer.parentNode.id
        // );
        const endParaID = range.startContainer.parentNode.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        // const endIndex = trees.children[startParaIndex].findIndex(
        //   item => item.id === range.endContainer.parentNode.id
        // );
        // const copyPartOfTrees_startPara = trees.children[startParaIndex].slice(
        //   startIndex
        // );
        // const copyPartOfTrees_EndPara = trees.children[endParaIndex].slice(
        //   endIndex
        // );
        const restParas = trees.children.slice(
          startParaIndex + 1,
          endParaIndex
        );
        const throwOut = [];
        // throwOut.push(copyPartOfTrees_startPara);
        throwOut.push(...restParas);
        // throwOut.push(copyPartOfTrees_EndPara);
        return throwOut;
      }
    }
  },
  spanSpans: function(trees, range) {
    const id = range.startContainer.parentNode.parentNode.id;
    const effectedPara = trees.children.find(item => item.id === id);
    const startIndex = effectedPara.children.findIndex(
      item => item.id === range.startContainer.parentNode.id
    );
    const endIndex = effectedPara.children.findIndex(
      item => item.id === range.endContainer.parentNode.id
    );
    const throwOut = effectedPara.children.slice(startIndex, endIndex + 1);
    return throwOut;
  },
  withinSingleSpan: function(trees, range) {
    const targetPara = trees.children.find(
      item => item.id === range.startContainer.parentNode.parentNode.id
    );
    const targetSpan = targetPara.children.find(
      item => item.id === range.startContainer.parentNode.id
    );
    console.log("withinSingleSpan targetNode", targetSpan);
    const throwOut = [];
    throwOut.push(targetSpan);
    return throwOut;
  },
  scenePointMode: function(trees, range) {
    if (
      range.startContainer.tagName !== "P" ||
      range.startContainer.tagName !== "BR"
    ) {
      const targetPara = trees.children.find(
        item => item.id === range.startContainer.parentNode.parentNode.id
      );
      const targetSpan = targetPara.children.find(
        item => item.id === range.startContainer.parentNode.id
      );
      console.log("withinSingleSpan targetNode", targetSpan);
      const throwOut = [];
      throwOut.push(targetSpan);
      return throwOut;
    } else {
      return [];
    }
  }
};
// stage2：改动trees,改动后返回精准list，供修改样式用
export const refinedNodesByRange_stage2 = {
  spanParas: function(elementList_Stage1, trees, range) {
    if (range.startContainer.nodeType === 3) {
      if (range.endContainer.nodeType === 3) {
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        // const endParaID = range.endContainer.parentNode.parentNode.id;
        // const endParaIndex = trees.children.findIndex(
        //   item => item.id === endParaID
        // );
        const startIndex = elementList_Stage1[0].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        const endIndex = elementList_Stage1[
          elementList_Stage1.length - 1
        ].children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
        const partA = elementList_Stage1[0].children[startIndex];
        const partAText = partA.text.substring(0, range.startOffset);
        const partAText_rest = partA.text.substring(range.startOffset);

        const partA_rest_container = new ElementNode("span");
        partA_rest_container.tag = partA.tag;
        partA_rest_container.text = partAText_rest;
        partA_rest_container.style = partA.style;
        partA.text = partAText;
        elementList_Stage1[0].children.splice(
          startIndex + 1,
          0,
          partA_rest_container
        );
        // 处理partB
        const partB =
          elementList_Stage1[elementList_Stage1.length - 1].children[endIndex];
        const partBText = partB.text.substring(0, range.endOffset);
        const partBText_rest = partB.text.substring(range.endOffset);

        const partB_rest_container = new ElementNode("span");
        partB_rest_container.tag = partB.tag;
        partB_rest_container.text = partBText_rest;
        partB_rest_container.style = partB.style;
        partB.text = partBText;
        elementList_Stage1[elementList_Stage1.length - 1].children.splice(
          endIndex + 1,
          0,
          partB_rest_container
        );

        trees.children[startParaID] = elementList_Stage1[0];

        const elementList_Stage2 = [];
        elementList_Stage2.push(elementList_Stage1[0].children.slice(1));
        elementList_Stage2.push(
          ...elementList_Stage1.slice(1, elementList_Stage1.length - 2)
        );
        const lastParaChildren =
          elementList_Stage1[elementList_Stage1.length - 1].children;
        elementList_Stage2.push(
          lastParaChildren.slice(0, lastParaChildren.length - 2)
        );
        elementList_Stage2.forEach((item, index) => {
          trees.children[startParaIndex + index] = item;
        });
        return elementList_Stage2;
      } else if (range.endContainer.tagName === "P") {
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        const startIndex = elementList_Stage1[0].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        // const endIndex = elementList_Stage1[
        //   elementList_Stage1.length - 1
        // ].children.findIndex(
        //   item => item.id === range.endContainer.parentNode.id
        // );
        const partA = elementList_Stage1[0].children[startIndex];
        const partAText = partA.text.substring(0, range.startOffset);
        const partAText_rest = partA.text.substring(range.startOffset);

        const partA_rest_container = new ElementNode("span");
        partA_rest_container.tag = partA.tag;
        partA_rest_container.text = partAText_rest;
        partA_rest_container.style = partA.style;
        partA.text = partAText;
        elementList_Stage1[0].children.splice(
          startIndex + 1,
          0,
          partA_rest_container
        );
        // 处理partB
        // const partB =
        //   elementList_Stage1[elementList_Stage1.length - 1].children[endIndex];
        // const partBText = partB.text.substring(0, range.endOffset);
        // const partBText_rest = partB.text.substring(range.endOffset);

        // const partB_rest_container = new ElementNode("span");
        // partB_rest_container.tag = partB.tag;
        // partB_rest_container.text = partBText_rest;
        // partB_rest_container.style = partB.style;
        // partB.text = partBText;
        // elementList_Stage1[elementList_Stage1.length - 1].children.splice(
        //   endIndex + 1,
        //   0,
        //   partB_rest_container
        // );
        const elementList_Stage2 = [];
        elementList_Stage2.push(elementList_Stage1[0].children.slice(1));
        elementList_Stage2.push(
          ...elementList_Stage1.slice(1, elementList_Stage1.length - 1)
        );
        // const lastParaChildren =
        //   elementList_Stage1[elementList_Stage1.length - 1].children;
        // elementList_Stage2.push(
        //   lastParaChildren.slice(0, lastParaChildren.length - 2)
        // );
        elementList_Stage2.forEach((item, index) => {
          trees.children[startParaIndex + index] = item;
        });
        return elementList_Stage2;
      }
    } else if (range.startContainer.tagName === "P") {
      if (range.endContainer.nodeType === 3) {
        // const startIndex = elementList_Stage1[0].children.findIndex(
        //   item => item.id === range.startContainer.parentNode.id
        // );
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        const endIndex = elementList_Stage1[
          elementList_Stage1.length - 1
        ].children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
        // const partA = elementList_Stage1[0].children[startIndex];
        // const partAText = partA.text.substring(0, range.startOffset);
        // const partAText_rest = partA.text.substring(range.startOffset);

        // const partA_rest_container = new ElementNode("span");
        // partA_rest_container.tag = partA.tag;
        // partA_rest_container.text = partAText_rest;
        // partA_rest_container.style = partA.style;
        // partA.text = partAText;
        // elementList_Stage1[0].children.splice(
        // startIndex + 1,
        // 0,
        // partA_rest_container
        // );
        // 处理partB
        const partB =
          elementList_Stage1[elementList_Stage1.length - 1].children[endIndex];
        const partBText = partB.text.substring(0, range.endOffset);
        const partBText_rest = partB.text.substring(range.endOffset);

        const partB_rest_container = new ElementNode("span");
        partB_rest_container.tag = partB.tag;
        partB_rest_container.text = partBText_rest;
        partB_rest_container.style = partB.style;
        partB.text = partBText;
        elementList_Stage1[elementList_Stage1.length - 1].children.splice(
          endIndex + 1,
          0,
          partB_rest_container
        );

        const elementList_Stage2 = [];
        // head
        // elementList_Stage2.push(elementList_Stage1[0].children.slice(1));
        // body
        elementList_Stage2.push(
          ...elementList_Stage1.slice(0, elementList_Stage1.length - 2)
        );
        // tail
        const lastParaChildren =
          elementList_Stage1[elementList_Stage1.length - 1].children;
        elementList_Stage2.push(
          lastParaChildren.slice(0, lastParaChildren.length - 2)
        );
        elementList_Stage2.forEach((item, index) => {
          trees.children[startParaIndex + 1 + index] = item;
        });
        return elementList_Stage2;
      } else if (range.endContainer.tagName === "P") {
        // const startIndex = elementList_Stage1[0].children.findIndex(
        //   item => item.id === range.startContainer.parentNode.id
        // );
        // const endIndex = elementList_Stage1[
        //   elementList_Stage1.length - 1
        // ].children.findIndex(
        //   item => item.id === range.endContainer.parentNode.id
        // );
        // const partA = elementList_Stage1[0].children[startIndex];
        // const partAText = partA.text.substring(0, range.startOffset);
        // const partAText_rest = partA.text.substring(range.startOffset);

        // const partA_rest_container = new ElementNode("span");
        // partA_rest_container.tag = partA.tag;
        // partA_rest_container.text = partAText_rest;
        // partA_rest_container.style = partA.style;
        // partA.text = partAText;
        // elementList_Stage1[0].children.splice(
        //   startIndex + 1,
        //   0,
        //   partA_rest_container
        // );
        // 处理partB
        // const partB =
        // elementList_Stage1[elementList_Stage1.length - 1].children[endIndex];
        // const partBText = partB.text.substring(0, range.endOffset);
        // const partBText_rest = partB.text.substring(range.endOffset);

        // const partB_rest_container = new ElementNode("span");
        // partB_rest_container.tag = partB.tag;
        // partB_rest_container.text = partBText_rest;
        // partB_rest_container.style = partB.style;
        // partB.text = partBText;
        // elementList_Stage1[elementList_Stage1.length - 1].children.splice(
        // endIndex + 1,
        // 0,
        // partB_rest_container
        // );
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        const elementList_Stage2 = [];
        // elementList_Stage2.push(elementList_Stage1[0].children.slice(1));
        elementList_Stage2.push(
          ...elementList_Stage1.slice(0, elementList_Stage1.length - 1)
        );
        // const lastParaChildren =
        //   elementList_Stage1[elementList_Stage1.length - 1].children;
        // elementList_Stage2.push(
        //   lastParaChildren.slice(0, lastParaChildren.length - 2)
        // );
        elementList_Stage2.forEach((item, index) => {
          trees.children[startParaIndex + 1 + index] = item;
        });
        return elementList_Stage2;
      }
    }
  },
  spanSpans: function(elementList_Stage1, trees, range) {
    const startParaID = range.startContainer.parentNode.parentNode.id;
    const startParaIndex = trees.children.findIndex(
      item => item.id === startParaID
    );

    const startIndex = trees.children[startParaIndex].children.findIndex(
      item => item.id === range.startContainer.parentNode.id
    );
    const endIndex = trees.children[startParaIndex].children.findIndex(
      item => item.id === range.endContainer.parentNode.id
    );
    const partA = elementList_Stage1[0];
    const partAText = partA.text.substring(0, range.startOffset);
    const partAText_rest = partA.text.substring(range.startOffset);
    const partA_rest_container = new ElementNode("span");
    partA_rest_container.tag = partA.tag;
    partA_rest_container.text = partAText_rest;
    partA_rest_container.style = partA.style;
    partA.text = partAText;
    elementList_Stage1.splice(1, 0, partA_rest_container);

    const partB = elementList_Stage1[elementList_Stage1.length - 1];
    const partBText = partB.text.substring(0, range.endOffset);
    const partBText_rest = partB.text.substring(range.endOffset);
    const partB_rest_container = new ElementNode("span");
    partB_rest_container.tag = partB.tag;
    partB_rest_container.text = partBText_rest;
    partB_rest_container.style = partB.style;
    partB.text = partBText;
    // trees.children[startParaIndex].children.splice()

    elementList_Stage1.splice(-1, 0, partB_rest_container);
    trees.children[startParaIndex].children.splice(
      startIndex,
      endIndex - startIndex,
      ...elementList_Stage1
    );
    const elementList_Stage2 = elementList_Stage1.slice(
      1,
      elementList_Stage1.length - 2
    );
    return elementList_Stage2;
  },
  withinSingleSpan: function(elementList_Stage1, trees, range) {
    const target = elementList_Stage1[0];
    const targetPara = target.parent;
    const startIndex = targetPara.children.findIndex(
      item => item.id === target.id
    );
    const partAText = target.text.substring(0, range.startOffset);
    const partAText_rest = target.text.substring(range.endOffset);
    const partA_rest_container = new ElementNode("span");
    partA_rest_container.tag = target.tag;
    partA_rest_container.text = partAText_rest;
    partA_rest_container.style = target.style;
    target.text = partAText;
    targetPara.children.splice(startIndex, 0, partA_rest_container);
    // console.log("withinSingleSpan targetNode", targetSpan);
    const throwOut = [];
    throwOut.push(partA_rest_container);
    return throwOut;
  },
  scenePointMode: function(trees, range) {
    console.log("scenePointMode");
    if (
      range.startContainer.tagName !== "P" ||
      range.startContainer.tagName !== "BR"
    ) {
      const targetPara = trees.children.find(
        item => item.id === range.startContainer.parentNode.parentNode.id
      );
      const targetSpan = targetPara.children.find(
        item => item.id === range.startContainer.parentNode.id
      );
      console.log("withinSingleSpan targetNode", targetSpan);
      const throwOut = [];
      throwOut.push(targetSpan);
      return throwOut;
    } else {
      return [];
    }
  }
};
// keyBoardEvent
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
  sceneRangeMode: {
    spanParas: function(range, trees, store) {
      console.log("跨p选取", range);
      // 判定为选区模式
      // 跨P选取
      console.log("起点", range.startContainer);
      // startContainer是一个text节点
      if (range.startContainer.nodeType === 3) {
        const endDom = range.endContainer;
        const startObj = range.startContainer.parentNode;
        if (endDom.nodeType === 3) {
          findTargetNode(startObj, trees).then(async res => {
            const target = res;
            console.log("target", res);
            // 获取P节点的id,进行字符串截取
            // partA
            const partAText = target.text.substring(0, range.startOffset);
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
            console.log("span节点在partA中的索引", targetIndex);
            //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置,取[0,targetIndex+1]区间的值
            target.parent.children = target.parent.children.slice(
              0,
              targetIndex + 1
            );
            console.log("A部分", target.parent, target.parent.children);
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

            console.log("restNodeInP", restNodeInP);
            target.parent.children.splice(
              target.parent.children.length,
              0,
              ...restNodeInP
            );
            // endPara.children = endPara.children.slice(partBTextIndex);
            console.log("endPara.children", endPara.children);
            console.log(startParaIndex, endParaIndex);
            // 删除沿途的P节点
            console.log("开始删除");
            console.log("优化测试");
            trees.children.splice(
              startParaIndex + 1,
              endParaIndex - startParaIndex
            );
            clearRange();
            // 焦点重定向到结束段落的endOffset,在end节点之前的文本弃置
            setTimeout(() => {
              const id = target.id;
              const offset = partAText.length;
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
          });
          return;
        } else if (endDom.tagName === "P") {
          console.log("endDom.tagName === 'P'");
          findTargetNode(startObj, trees).then(async res => {
            const target = res;
            const partAText = target.text.substring(0, range.startOffset);
            console.log("partAText", partAText);

            const targetIndex = target.parent.children.findIndex(item => {
              return target.id === item.id;
            });
            console.log("span节点在partA中的索引", targetIndex);
            //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置
            target.parent.children = target.parent.children.slice(
              0,
              targetIndex + 1
            );
            console.log("A部分", target.parent, target.parent.children);
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
          });
          return;
        } else {
          console.log("意料之外的endDom", endDom);
          return;
        }
      }
      // startContainer选中了整个P
      else if (range.startContainer.tagName === "P") {
        const startDom = range.startContainer;
        const endDom = range.endContainer;
        if (endDom.nodeType === 3) {
          console.log("需要截取endDom字符串", startDom, endDom.parentNode);
          findTargetNode(endDom.parentNode, trees).then(async res => {
            const target = res;
            console.log("endDom", res);
            const startParaIndex = trees.children.findIndex(
              item => item.id === startDom.id
            );
            const endParaIndex = trees.children.findIndex(
              item => item.id === res.parent.id
            );
            // 截取节点在原P节点中的索引
            const targetIndex = target.parent.children.findIndex(
              item => item.id === target.id
            );
            const supposevalue = target.text.substring(range.endOffset);
            console.log("若这是段落中的最后一个子节点，并且将被赋值为空字符串");
            // 若这是段落中的最后一个子节点，并且将被赋值为空字符串
            if (supposevalue === "" && targetIndex === 0) {
              console.log("condition1");
              const br = await new ElementNode("br");
              br.parent = target.parent;
              target.parent.children[targetIndex] = br;
            } else {
              console.log("condition2");
              target.text = supposevalue;
              const restNodeInP = target.parent.children.slice(targetIndex);
              target.parent.children = restNodeInP;
            }

            console.log("splice", startParaIndex, endParaIndex);
            trees.children.splice(
              startParaIndex,
              endParaIndex - startParaIndex
            );

            clearRange();
            setTimeout(() => {
              const id = target.parent.id;
              redirectRange(store, {
                startId: id,
                endId: id
              });
              saveStack(trees, store, {
                startId: id,
                endId: id
              });
            }, 0);
          });

          return;
        } else {
          if (endDom.tagName === "P") {
            console.log("endDom,完整截取了N个P，计算index即可");
            const startDom = range.startContainer;
            const endDom = range.endContainer;
            const startParaIndex = trees.children.findIndex(
              item => item.id === startDom.id
            );
            const endParaIndex = trees.children.findIndex(
              item => item.id === endDom.id
            );
            findTargetNode(endDom, trees).then(async res => {
              console.log("splice", res);
              // const target = res;

              const newPara = await new ElementNode("p");
              const br = await new ElementNode("br");
              newPara.parent = trees;
              br.parent = newPara;
              newPara.children.push(br);
              trees.children.splice(
                startParaIndex,
                endParaIndex - startParaIndex,
                newPara
              );
              clearRange();
              setTimeout(() => {
                const id = newPara.id;
                redirectRange(store, {
                  startId: id,
                  endId: id
                });
                saveStack(trees, store, {
                  startId: id,
                  endId: id
                });
              }, 0);
            });

            return;
          }
        }
      } else {
        console.log("意料之外的range");
        return;
      }
    },
    spanSpans: function(range, trees, store) {
      const startObj = range.startContainer.parentNode;
      console.log("cross span", range.commonAncestorContainer, startObj);
      findTargetNode(startObj, trees).then(async res => {
        console.log("res", res);
        const target = res;
        const partAText = target.text.substring(0, range.startOffset);
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
          const br = await new ElementNode("br");
          br.parent = target.parent;
          target.parent.children.push(br);
          setTimeout(() => {
            // 新的range应为target，因为新增加的行添加在target之上
            const id = target.parent.id;
            // const offset = partAText.length;
            redirectRange(store, {
              // startOffset: offset,
              startId: id,
              endId: id
              // endOffset: offset
            });
            saveStack(trees, store, {
              // startOffset: offset,
              startId: id,
              endId: id
              // endOffset: offset
            });
          }, 0);
          return;
        } else {
          setTimeout(() => {
            // 新的range应为target，因为新增加的行添加在target之上
            const id =
              partAText.length > 0
                ? target.id
                : target.parent.children[splitEndIndex].id;
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
          return;
        }
      });
      return;
    },
    withinSingleSpan: function(range, trees, store) {
      console.log("选中一个文本节点的部分或全部内容");
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
      // 获取相应的虚拟dom的引用
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
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
        if (
          target.parent.children.length === 1 &&
          splitStartIndex === 0 &&
          newvalue === ""
        ) {
          console.log("装填空行");
          const br = await new ElementNode("br");
          br.parent = target.parent;
          target.parent.children[0] = br;
        }
        setTimeout(() => {
          const id = newvalue ? target.id : target.parent.id;
          const offset = partAText.length;
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
      });
    }
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
  sceneRangeMode: {
    spanParas: function(range, trees, store) {
      console.log("跨p选取", range);
      // 判定为选区模式
      // 跨P选取
      // if (range.commonAncestorContainer.id === "origin") {
      // event.stopImmediatePropagation();
      // event.preventDefault();
      console.log("起点", range.startContainer);
      // startContainer是一个text节点
      if (range.startContainer.nodeType === 3) {
        const endDom = range.endContainer;
        const startObj = range.startContainer.parentNode;
        if (endDom.nodeType === 3) {
          findTargetNode(startObj, trees).then(async res => {
            const target = res;
            console.log("target", res);
            // 获取P节点的id,进行字符串截取
            // partA
            const partAText = target.text.substring(0, range.startOffset);
            console.log("partAText", partAText);
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
            console.log("span节点在partA中的索引", targetIndex);
            //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置
            target.parent.children = target.parent.children.slice(
              0,
              targetIndex + 1
            );
            console.log("A部分", target.parent, target.parent.children);
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
            console.log("endPara.children", endPara.children);
            if (partBText) {
              endPara.children[0].text = partBText;
            } else {
              const br = new ElementNode("br");
              br.parent = endPara;
              endPara.children[0] = br;
            }
            console.log(startParaIndex, endParaIndex);

            // trees.children[endParaIndex];
            // const restStartIndex = target.parent.children.findIndex(
            //   item => {
            //     return range.endContainer.parentNode.id === item.id;
            //   }
            // );
            // 删除沿途的P节点
            console.log("开始删除");
            console.log("优化测试");
            trees.children.splice(
              startParaIndex + 1,
              endParaIndex - startParaIndex - 1
            );
            clearRange();
            // 焦点重定向到结束段落的endOffset,在end节点之前的文本弃置
            // redirectRange(endPara.id);
            setTimeout(() => {
              const id = endPara.id;
              redirectRange(store, {
                startId: id,
                endId: id
              });
              saveStack(trees, store, {
                startId: id,
                endId: id
              });
            }, 0);
          });
          return;
        } else if (endDom.tagName === "P") {
          console.log("endDom.tagName === 'P'");
          findTargetNode(startObj, trees).then(async res => {
            const target = res;
            const partAText = target.text.substring(0, range.startOffset);
            console.log("partAText", partAText);

            const targetIndex = target.parent.children.findIndex(item => {
              return target.id === item.id;
            });
            console.log("span节点在partA中的索引", targetIndex);
            //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置
            target.parent.children = target.parent.children.slice(
              0,
              targetIndex + 1
            );
            console.log("A部分", target.parent, target.parent.children);
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
            setTimeout(() => {
              // const id = newPara.children[0]?newPara.children[0].id:newPara.id
              // 新的range应为target，因为新增加的行添加在target之上
              const id = endDom.id;
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
          return;
        } else {
          console.log("意料之外的endDom", endDom);
          return;
        }
      }
      // startContainer选中了整个P
      else if (range.startContainer.tagName === "P") {
        console.log("startContainer选中了整个P");
        const startDom = range.startContainer;
        const endDom = range.endContainer;
        if (endDom.nodeType === 3) {
          console.log("需要截取endDom字符串", startDom, endDom.parentNode);
          findTargetNode(endDom.parentNode, trees).then(async res => {
            const target = res;
            console.log("endDom", res);
            const startParaIndex = trees.children.findIndex(
              item => item.id === startDom.id
            );
            const endParaIndex = trees.children.findIndex(
              item => item.id === res.parent.id
            );
            // 截取节点在原P节点中的索引
            const targetIndex = target.parent.children.findIndex(
              item => item.id === target.id
            );
            const supposevalue = target.text.substring(range.endOffset);
            console.log("若这是段落中的最后一个子节点，并且将被赋值为空字符串");
            // 若这是段落中的最后一个子节点，并且将被赋值为空字符串

            if (supposevalue === "" && targetIndex === 0) {
              console.log("condition1");
              const br = await new ElementNode("br");
              br.parent = target.parent;
              target.parent.children[targetIndex] = br;
            } else {
              console.log("condition2");
              target.text = supposevalue;
              const restNodeInP = target.parent.children.slice(targetIndex);
              // restNodeInP.forEach(item=>item.parent = target.parent)
              target.parent.children = restNodeInP;
            }
            // if (targetIndex) {}

            const newPara = await new ElementNode("p");
            const br = await new ElementNode("br");
            newPara.parent = trees;
            br.parent = newPara;
            newPara.children.push(br);
            console.log("splice", startParaIndex, endParaIndex);
            trees.children.splice(
              startParaIndex,
              endParaIndex - startParaIndex,
              newPara
            );

            clearRange();
            setTimeout(() => {
              // const id = newPara.children[0]?newPara.children[0].id:newPara.id
              // 新的range应为target，因为新增加的行添加在target之上
              const id = target.parent.id;
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

          return;
        } else {
          if (endDom.tagName === "P") {
            console.log("endDom,完整截取了N个P，计算index即可");
            const startDom = range.startContainer;
            const endDom = range.endContainer;
            const startParaIndex = trees.children.findIndex(
              item => item.id === startDom.id
            );
            const endParaIndex = trees.children.findIndex(
              item => item.id === endDom.id
            );
            findTargetNode(endDom, trees).then(async res => {
              console.log("splice", res);
              // const target = res;

              const newPara = await new ElementNode("p");
              const br = await new ElementNode("br");
              newPara.parent = trees;
              br.parent = newPara;
              newPara.children.push(br);
              trees.children.splice(
                startParaIndex,
                endParaIndex - startParaIndex,
                newPara
              );
              clearRange();
              setTimeout(() => {
                // const id = newPara.children[0]?newPara.children[0].id:newPara.id
                // 新的range应为target，因为新增加的行添加在target之上
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
                // console.log("insertIndex", insertIndex);
              }, 0);
            });
            // const newPara = await new ElementNode("p");
            // const br = await new ElementNode("br");
            // newPara.parent = trees;
            // br.parent = newPara;
            // newPara.children.push(br);

            return;
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
    spanSpans: function(range, trees, store) {
      console.log("in handler", range.startContainer);
      const startObj = range.startContainer.parentNode;
      findTargetNode(startObj, trees).then(async res => {
        console.log("res", res);
        const target = res;
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
              const br = await new ElementNode("br");
              // 0424 追加父节点属性parent
              paraBcontent.push(br);
            }
          }
        } else {
          const br = await new ElementNode("br");
          // 0424 追加父节点属性parent
          paraBcontent.push(br);
        }
        // 上边这个if，没有else了，这种情况下不存在paraBcontent.length === 0的场景，paraBcontent.length === 0意味着没有endcontainer或者说startContainer===endContainer。
        console.log("paraBcontent", paraBcontent);
        const newPara = await new ElementNode("p");
        paraBcontent.forEach(item => {
          item.parent = newPara;
        });
        newPara.parent = trees;
        newPara.children = paraBcontent;
        trees.children.splice(splitStartIndex + 1, 0, newPara);
        clearRange();
        setTimeout(() => {
          // const id = newPara.children[0]?newPara.children[0].id:newPara.id
          // 新的range应为target，因为新增加的行添加在target之上
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
          // console.log("insertIndex", insertIndex);
        }, 0);
      });
      return;
    },
    withinSingleSpan: function(range, trees, store) {
      console.log("选中一个文本节点的部分或全部内容");
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
      const currentOperateObj = range.startContainer.parentNode;
      // 获取相应的虚拟dom的引用
      // console.log('range',range.startContainer.parentNode)
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
        console.log("res", res);
        const splitStartIndex = target.parent.children.findIndex(item => {
          return target.id === item.id;
        });
        console.log(
          target.parent.children.length === 1,
          splitStartIndex === 0,
          partAText === ""
        );

        // 一个P中只有一个span节点并且这个span节点即将被消除
        target.text = partAText;
        if (
          // target.parent.children.length === 1 &&
          splitStartIndex === 0 &&
          partAText === ""
        ) {
          console.log("装填空行");
          const br = await new ElementNode("br");
          br.parent = target.parent;
          target.parent.children[0] = br;
        }
        const restNodeInP = target.parent.children.splice(
          splitStartIndex + 1,
          target.parent.children.length
        );
        console.log(restNodeInP);
        const newPara = await new ElementNode("p");
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
            const partBContainer = await new ElementNode(target.tag);
            partBContainer.text = partBText;
            partBContainer.style = target.style;
            console.log("新的容器", partBContainer);
            partBContainer.parent = newPara;
            newPara.children.unshift(partBContainer);
          }
        } else {
          // console.log('该段落后续无元素')
          if (partBText) {
            console.log("partBText作为新一行的元素", partBContainer);
            const partBContainer = await new ElementNode(target.tag);
            partBContainer.text = partBText;
            partBContainer.style = target.style;
            partBContainer.parent = newPara;
            newPara.children.unshift(partBContainer);
          } else {
            // console.log('新一空行')
            const br = await new ElementNode("br");
            // 0424 追加父节点属性parent
            br.parent = newPara;
            newPara.children.unshift(br);
          }
        }
        newPara.parent = trees;
        trees.children.splice(insertIndex, 0, newPara);
        setTimeout(() => {
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
        }, 0);
      });
    }
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
    // let currentOperateObj = range.commonAncestorContainer.parentNode;
    // // 0419有一个问题在于,当一个P级元素删除晚全部文本后,确实是会留下一个br站位保持换行,但是在此基础上新添加的文本是不在span标签中的,因而会对后续的trees造成影响,因此在这里追加一个判断,当currentOperateObj不为span时,创造一个span添加到P里
  },
  sceneComposiveMode: (wordKeeper, range, trees, store) => {
    console.log("sceneComposiveMode.range", range);
    if (range.startContainer.nodeType === 3) {
      console.log("直球！");
      const currentOperateObj = range.commonAncestorContainer.parentNode;
      findTargetNode(currentOperateObj, trees).then(res => {
        let target = res;
        console.log(
          "正在受影响的实例",
          range.startContainer,
          range.startOffset,
          range.startOffset + wordKeeper.length
        );
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
        // console.log(window.getSelection().getRangeAt(0));
        saveRange(store);
        // saveStack(trees, store, {
        //   startId: target.id,
        //   startOffset: target.text.length,
        //   endId: target.id,
        //   endOffset: target.text.length
        // });
        target.text = currentNodeValue;
        // 需要在clearRange之前
        const offset = range.startOffset + wordKeeper.length;
        clearRange();
        console.log("结束工作", target.text);
        // console.log(window.getSelection().getRangeAt(0));
        setTimeout(() => {
          const id = target.id;
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
      });
    } else if (range.startContainer.tagName === "P") {
      // 空段落
      // 节省性能，不用find方法
      const target = trees.children.find(
        item => item.id === range.startContainer.id
      );
      const newSpan = new ElementNode("span", wordKeeper);
      newSpan.parent = target;
      if (target.children.length === 1 && target.children[0].tag === "br") {
        target.children.splice(0, 1, newSpan);
      } else {
        console.log("意料之外的target.children");
        return;
      }
      clearRange();
      setTimeout(() => {
        const id = newSpan.id;
        redirectRange(store, {
          startId: id,
          startOffset: newSpan.text.length,
          endId: id,
          endOffset: newSpan.text.length
        });
        saveStack(trees, store, {
          startId: id,
          startOffset: newSpan.text.length,
          endId: id,
          endOffset: newSpan.text.length
        });
      }, 0);
      return;
    }
  }
};
export const overwriteRangeInput = {
  sceneDirectMode: {
    spanParas: function(keyData, range, trees, store) {
      console.log("跨p选取", range);
      // 判定为选区模式
      // 跨P选取
      console.log("起点", range.startContainer);
      // startContainer是一个text节点
      if (range.startContainer.nodeType === 3) {
        const endDom = range.endContainer;
        const startObj = range.startContainer.parentNode;
        if (endDom.nodeType === 3) {
          findTargetNode(startObj, trees).then(async res => {
            const target = res;
            console.log("target", res);
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
            console.log("span节点在partA中的索引", targetIndex);
            //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置
            target.parent.children = target.parent.children.slice(
              0,
              targetIndex + 1
            );
            console.log("A部分", target.parent, target.parent.children);
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
            console.log("restNodeInP", restNodeInP);
            target.parent.children.splice(
              target.parent.children.length,
              0,
              ...restNodeInP
            );
            // endPara.children = endPara.children.slice(partBTextIndex);
            console.log("endPara.children", endPara.children);
            console.log(startParaIndex, endParaIndex);
            // 删除沿途的P节点
            console.log("开始删除");
            console.log("优化测试");
            trees.children.splice(
              startParaIndex + 1,
              endParaIndex - startParaIndex
            );
            clearRange();
            // 焦点重定向到结束段落的endOffset,在end节点之前的文本弃置
            setTimeout(() => {
              const id = target.id;
              const offset = partAText.length;
              redirectRange(store, {
                startId: id,
                startOffset: offset,
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
          });
          return;
        } else if (endDom.tagName === "P") {
          console.log("endDom.tagName === 'P'in input");
          findTargetNode(startObj, trees).then(async res => {
            const target = res;
            const partAText =
              target.text.substring(0, range.startOffset) + keyData;
            console.log("partAText", partAText);

            const targetIndex = target.parent.children.findIndex(item => {
              return target.id === item.id;
            });
            console.log("span节点在partA中的索引", targetIndex);
            //  targetIndex+1为当事节点之后的span节点,从这个索引开始(包括自身)之后的所有节点全部弃置
            target.parent.children = target.parent.children.slice(
              0,
              targetIndex + 1
            );
            console.log("A部分", target.parent, target.parent.children);
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
              redirectRange(store, {
                startId: id,
                startOffset: partAText.length,
                endId: id,
                endOffset: partAText.length
              });
              saveStack(trees, store, {
                startId: id,
                startOffset: partAText.length,
                endId: id,
                endOffset: partAText.length
              });
            }, 0);
          });
          return;
        } else {
          console.log("意料之外的endDom", endDom);
          return;
        }
      }
      // startContainer选中了整个P
      else if (range.startContainer.tagName === "P") {
        const startDom = range.startContainer;
        const endDom = range.endContainer;
        if (endDom.nodeType === 3) {
          console.log(
            "需要截取endDom字符串 in  input",
            startDom,
            endDom.parentNode
          );
          findTargetNode(endDom.parentNode, trees).then(async res => {
            const target = res;
            console.log("endDom", res);
            const startParaIndex = trees.children.findIndex(
              item => item.id === startDom.id
            );
            const endParaIndex = trees.children.findIndex(
              item => item.id === res.parent.id
            );
            // 截取节点在原P节点中的索引
            const targetIndex = target.parent.children.findIndex(
              item => item.id === target.id
            );
            // const partAText =
            const supposevalue =
              keyData + target.text.substring(range.endOffset);
            console.log("若这是段落中的最后一个子节点，并且将被赋值为空字符串");
            // 若这是段落中的最后一个子节点，并且将被赋值为空字符串
            if (supposevalue === "" && targetIndex === 0) {
              console.log("condition1");
              const br = await new ElementNode("br");
              br.parent = target.parent;
              target.parent.children[targetIndex] = br;
            } else {
              console.log("condition2");
              target.text = supposevalue;
              const restNodeInP = target.parent.children.slice(targetIndex);
              target.parent.children = restNodeInP;
            }

            console.log("splice", startParaIndex, endParaIndex);
            trees.children.splice(
              startParaIndex,
              endParaIndex - startParaIndex
            );

            clearRange();
            setTimeout(() => {
              const id = target.id;
              redirectRange(store, {
                startId: id,
                startOffset: keyData.length,
                endId: id,
                endOffset: keyData.length
              });
              saveStack(trees, store, {
                startId: id,
                startOffset: keyData.length,
                endId: id,
                endOffset: keyData.length
              });
            }, 0);
          });

          return;
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
            findTargetNode(endDom, trees).then(async res => {
              console.log("splice", res);
              // const target = res;

              const newPara = await new ElementNode("p");
              const newSpan = await new ElementNode("span", keyData);
              newPara.parent = trees;
              newSpan.parent = newPara;
              newPara.children.push(newSpan);
              trees.children.splice(
                startParaIndex,
                endParaIndex - startParaIndex,
                newPara
              );
              clearRange();
              setTimeout(() => {
                const id = newSpan.id;
                redirectRange(store, {
                  startId: id,
                  startOffset: newSpan.text.length,
                  endId: id,
                  endOffset: newSpan.text.length
                });
                saveStack(trees, store, {
                  startId: id,
                  startOffset: newSpan.text.length,
                  endId: id,
                  endOffset: newSpan.text.length
                });
              }, 0);
            });
            return;
          }
        }
      } else {
        console.log("意料之外的range");
        return;
      }
    },
    spanSpans: function(keyData, range, trees, store) {
      const startObj = range.startContainer.parentNode;
      console.log("cross span", range.commonAncestorContainer, startObj);
      findTargetNode(startObj, trees).then(async res => {
        console.log("res", res);
        const target = res;
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
          const br = await new ElementNode("br");
          br.parent = target.parent;
          target.parent.children.push(br);
          setTimeout(() => {
            // 新的range应为target，因为新增加的行添加在target之上
            const id = target.parent.id;
            // const offset = partAText.length;
            redirectRange(store, {
              // startOffset: offset,
              startId: id,
              endId: id
              // endOffset: offset
            });
            saveStack(trees, store, {
              // startOffset: offset,
              startId: id,
              endId: id
              // endOffset: offset
            });
          }, 0);
          return;
        } else {
          setTimeout(() => {
            // 新的range应为target，因为新增加的行添加在target之上
            const id =
              partAText.length > 0
                ? target.id
                : target.parent.children[splitEndIndex].id;
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
          return;
        }
      });
      return;
    },
    withinSingleSpan: function(keyData, range, trees, store) {
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
      findTargetNode(currentOperateObj, trees).then(async res => {
        const target = res;
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
          const br = await new ElementNode("br");
          br.parent = target.parent;
          target.parent.children[0] = br;
        }
        setTimeout(() => {
          const id = newvalue ? target.id : target.parent.id;
          const offset = partAText.length;
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
      });
    }
  },
  sceneComposiveMode: {
    spanSpans: function(keyData, range, trees, store) {
      const startObj = range.startContainer.parentNode;
      console.log("cross span", range.startContainer, startObj);
      findTargetNode(startObj, trees).then(async res => {
        console.log("res", res);
        const target = res;
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
          const br = await new ElementNode("br");
          br.parent = target.parent;
          target.parent.children.push(br);
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
          return;
        } else {
          setTimeout(() => {
            // 新的range应为target，因为新增加的行添加在target之上
            const id =
              partAText.length > 0
                ? target.id
                : target.parent.children[splitEndIndex].id;
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
          return;
        }
      });
      return;
    }
  }
};
