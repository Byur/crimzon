import ElementNode from "../baseclass/tags";
let _ = require("lodash");
import { saveStack } from "../api/stack";
import {
  // findTargetNode,
  redirectRange,
  // rangeForTextChange,
  cleanEmptySibling
  // saveRange,
  // clearRange
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
        // console.log("hardest");
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        // console.log("startParaIndex", startParaIndex);
        const startIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        // console.log("startIndex", startIndex);
        const endParaID = range.endContainer.parentNode.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        // console.log("endParaIndex", endParaIndex);
        const endIndex = trees.children[endParaIndex].children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
        // console.log("endIndex", endIndex);
        const copyPartOfTrees_startPara_children = trees.children[
          startParaIndex
        ].children.slice(startIndex);
        // console.log("start para", copyPartOfTrees_startPara_children);
        const copyPartOfTrees_EndPara_children = trees.children[
          endParaIndex
        ].children.slice(0, endIndex + 1);
        // console.log("last para", copyPartOfTrees_EndPara_children);
        const restParas = trees.children.slice(
          startParaIndex + 1,
          endParaIndex
        );
        // console.log("restParas", restParas);
        const throwOut = [];
        throwOut.push(copyPartOfTrees_startPara_children);
        restParas.forEach(item => {
          throwOut.push(item.children);
        });
        throwOut.push(copyPartOfTrees_EndPara_children);
        return throwOut;
      } else if (
        range.endContainer.tagName === "P" ||
        range.endContainer.tagName === "BR"
      ) {
        // 一个找到关联的trees节点的起点
        // 获取startContainer所在的P
        // console.log("medium");
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        const startIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        const endParaID = range.endContainer.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        // console.log("endParaIndex", endParaIndex);
        // const endIndex = trees.children[startParaIndex].findIndex(
        //   item => item.id === range.endContainer.parentNode.id
        // );
        const copyPartOfTrees_startPara = trees.children[
          startParaIndex
        ].children.slice(startIndex);
        const copyPartOfTrees_EndPara = trees.children[endParaIndex].children;
        const restParas = trees.children.slice(
          startParaIndex + 1,
          endParaIndex
        );
        const throwOut = [];
        throwOut.push(copyPartOfTrees_startPara);

        restParas.forEach(item => {
          throwOut.push(item.children);
        });
        console.log(
          "crossPara_end===p_stage1抛出的深拷贝",
          _.cloneDeep(throwOut)
        );
        throwOut.push(copyPartOfTrees_EndPara);
        return throwOut;
      }
    } else if (
      range.startContainer.tagName === "P" ||
      range.startContainer.tagName === "BR"
    ) {
      if (range.endContainer.nodeType === 3) {
        // console.log("medium well");
        // 一个找到关联的trees节点的起点
        // 获取startContainer所在的P
        const startParaID = range.startContainer.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        // const startIndex = trees.children[startParaIndex].findIndex(
        //   item => item.id === range.startContainer.parentNode.id
        // );

        const endParaID =
          range.startContainer.tagName === "P"
            ? range.endContainer.parentNode.parentNode.id
            : range.endContainer.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        const endIndex = trees.children[endParaIndex].children.findIndex(
          item => {
            if (range.startContainer.tagName === "P") {
              return item.id === range.endContainer.parentNode.id;
            } else {
              return item.id === range.endContainer.id;
            }
          }
        );
        // console.log("endParaIndex", endParaIndex, "endIndex", endIndex);
        // const copyPartOfTrees_startPara = trees.children[startParaIndex].slice(
        //   startIndex
        // );
        const copyPartOfTrees_EndPara = trees.children[
          endParaIndex
        ].children.slice(0, endIndex + 1);
        const restParas = trees.children.slice(
          startParaIndex + 1,
          endParaIndex
        );
        const throwOut = [];
        // throwOut.push(copyPartOfTrees_startPara);
        restParas.forEach(item => {
          throwOut.push(item.children);
        });
        throwOut.push(copyPartOfTrees_EndPara);
        console.log("ready to throw out when stage1", _.cloneDeep(throwOut));
        return throwOut;
      } else if (range.endContainer.tagName === "P") {
        // 一个找到关联的trees节点的起点
        // 获取startContainer所在的P
        console.log("well done", range.endContainer);
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
        restParas.forEach(item => {
          throwOut.push(item.children);
        });
        // throwOut.push(copyPartOfTrees_EndPara);
        return throwOut;
      } else if (range.endContainer.tagName === "BR") {
        // console.log('unexcept range in stage1',range)
        let startParaIndex = trees.children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        let endParaIndex = trees.children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );

        const startIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
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
        restParas.forEach(item => {
          throwOut.push(item.children);
        });
        throwOut.push(copyPartOfTrees_EndPara);
        return throwOut;
      } else {
        console.log("unexcept range in stage1", range);
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
    console.log("throwOut", throwOut);
    return throwOut;
  },
  withinSingleSpan: function(trees, range) {
    console.log("range.startContainer", range.startContainer);
    const targetPara = trees.children.find(
      item => item.id === range.startContainer.parentNode.parentNode.id
    );
    const targetSpan = targetPara.children.find(
      item => item.id === range.startContainer.parentNode.id
    );
    console.log("withinSingleSpan targetSpan", targetSpan);
    const throwOut = [];
    throwOut.push(targetSpan);
    return throwOut;
  },
  scenePointMode: function(trees, range) {
    console.log("scenePointMode in stage1", range.startContainer);
    if (range.startContainer.nodeType === 3) {
      console.log("range.startContainer", range.startContainer);
      const targetPara = trees.children.find(
        item => item.id === range.startContainer.parentNode.parentNode.id
      );
      const targetSpan = targetPara.children.find(
        item => item.id === range.startContainer.parentNode.id
      );

      console.log("scenePointMode targetNode", targetSpan);
      const throwOut = [];
      throwOut.push(targetSpan);
      return throwOut;
    } else {
      console.log("unexcept range", range.startContainer.tagName);

      return [];
    }
  }
};
// stage2：改动trees,改动后返回精准list，供修改样式用
export const refinedNodesByRange_stage2 = {
  spanParas: function(elementList_Stage1, trees, range, store) {
    if (range.startContainer.nodeType === 3) {
      if (range.endContainer.nodeType === 3) {
        console.log("rear", elementList_Stage1);
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        console.log("startParaIndex", startParaIndex);
        const endParaID = range.endContainer.parentNode.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        console.log("endParaIndex", endParaIndex);

        const startIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        console.log("startIndex", startIndex);
        const endIndex = trees.children[endParaIndex].children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
        console.log("endIndex", endIndex);

        const partA = elementList_Stage1[0][0];
        const partAText = partA.text.substring(0, range.startOffset);
        const partAText_rest = partA.text.substring(range.startOffset);

        const partA_rest_container = new ElementNode("span");
        partA_rest_container.tag = partA.tag;
        partA_rest_container.text = partAText_rest;
        partA_rest_container.style = _.cloneDeep(partA.style);
        partA_rest_container.parent = partA.parent;
        partA.text = partAText;
        // 在partA后加入将要抛出的剩余部分
        elementList_Stage1[0].splice(0 + 1, 0, partA_rest_container);
        // 处理partB
        const lastPara_children =
          elementList_Stage1[elementList_Stage1.length - 1];
        const partB = lastPara_children[lastPara_children.length - 1];
        const partBText = partB.text.substring(0, range.endOffset);
        const partBText_rest = partB.text.substring(range.endOffset);

        const partB_rest_container = new ElementNode("span");
        partB_rest_container.tag = partB.tag;
        partB_rest_container.text = partBText_rest;
        partB_rest_container.style = _.cloneDeep(partB.style);
        partB_rest_container.parent = partB.parent;
        partB.text = partBText;
        lastPara_children.splice(
          lastPara_children.length,
          0,
          partB_rest_container
        );
        console.log("elementList_Stage1", elementList_Stage1);

        // 开头段
        const beforeConcat_paraA = trees.children[
          startParaIndex
        ].children.slice(0, startIndex);
        console.log(
          "beforeConcat_paraA",
          beforeConcat_paraA.concat(elementList_Stage1[0])
        );

        trees.children[startParaIndex].children = beforeConcat_paraA.concat(
          elementList_Stage1[0]
        );
        // 结尾段
        const beforeConcat_paraB = trees.children[endParaIndex].children.slice(
          endIndex + 1
        );
        console.log(endParaIndex, beforeConcat_paraB);
        console.log(
          "beforeConcat_paraB",
          // beforeConcat_paraB.concat(
          elementList_Stage1[elementList_Stage1.length - 1].concat(
            beforeConcat_paraB
          )
          // )
        );

        trees.children[endParaIndex].children = elementList_Stage1[
          elementList_Stage1.length - 1
        ].concat(beforeConcat_paraB);

        // 浅拷贝elementList_Stage1
        const elementList_Stage2 = elementList_Stage1.slice(0);

        elementList_Stage2[0] = elementList_Stage2[0].slice(1);

        const lastParaChildren =
          elementList_Stage2[elementList_Stage2.length - 1];
        console.log("lastParaChildren", lastParaChildren);

        const lastParaChildren_new = lastParaChildren.slice(
          0,
          lastParaChildren.length - 1
        );
        elementList_Stage2[
          elementList_Stage2.length - 1
        ] = lastParaChildren_new;

        console.log("ready to throwOut", elementList_Stage2);
        const forNewRange = {
          startId: elementList_Stage2[0][0].id,
          endId:
            elementList_Stage2[elementList_Stage2.length - 1][
              lastParaChildren_new.length - 1
            ].id,
          startOffset: 0,
          endOffset:
            elementList_Stage2[elementList_Stage2.length - 1][
              lastParaChildren_new.length - 1
            ].text.length
        };
        setTimeout(function() {
          redirectRange(store, _.cloneDeep(forNewRange));
          saveStack(trees, store, forNewRange);
        }, 0);
        return elementList_Stage2;
      } else if (
        range.endContainer.tagName === "P" ||
        range.endContainer.tagName === "BR"
      ) {
        console.log("medium", elementList_Stage1);
        const startParaID = range.startContainer.parentNode.parentNode.id;
        const startParaIndex = trees.children.findIndex(
          item => item.id === startParaID
        );
        console.log("startParaIndex", startParaIndex);
        // 为了记忆range而声明endParaIndex
        const endParaID =
          range.startContainer.tagName === "P"
            ? range.endContainer.parentNode.parentNode.id
            : range.endContainer.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        console.log("endParaIndex", endParaIndex);
        // const endIndex = trees.children[endParaIndex].children.findIndex(
        //   item => {
        //     if (range.startContainer.tagName === "P") {
        //       return item.id === range.endContainer.parentNode.id;
        //     } else {
        //       return item.id === range.endContainer.id;
        //     }
        //   }
        // );

        // console.log("endParaIndex", endParaIndex);

        const startIndex = trees.children[startParaIndex].children.findIndex(
          item => item.id === range.startContainer.parentNode.id
        );
        console.log("startIndex", startIndex);
        // const endIndex = trees.children[endParaIndex].children.findIndex(
        //   item => item.id === range.endContainer.parentNode.id
        // );
        // console.log("endIndex", endIndex);

        const partA = elementList_Stage1[0][0];
        const partAText = partA.text.substring(0, range.startOffset);
        const partAText_rest = partA.text.substring(range.startOffset);

        const partA_rest_container = new ElementNode("span");
        partA_rest_container.tag = partA.tag;
        partA_rest_container.text = partAText_rest;
        partA_rest_container.style = _.cloneDeep(partA.style);
        partA_rest_container.parent = partA.parent;
        partA.text = partAText;
        // 在partA后加入将要抛出的剩余部分
        elementList_Stage1[0].splice(0 + 1, 0, partA_rest_container);
        // 处理partB
        // const lastPara_children =
        //   elementList_Stage1[elementList_Stage1.length - 1];
        // const partB = lastPara_children[lastPara_children.length - 1];
        // const partBText = partB.text.substring(0, range.endOffset);
        // const partBText_rest = partB.text.substring(range.endOffset);

        // const partB_rest_container = new ElementNode("span");
        // partB_rest_container.tag = partB.tag;
        // partB_rest_container.text = partBText_rest;
        // partB_rest_container.style = _.cloneDeep(partB.style);
        // partB_rest_container.parent = partB.parent;
        // partB.text = partBText;
        // lastPara_children.splice(
        //   lastPara_children.length,
        //   0,
        //   partB_rest_container
        // );
        console.log("elementList_Stage1", elementList_Stage1);

        // 开头段
        const beforeConcat_paraA = trees.children[
          startParaIndex
        ].children.slice(0, startIndex);
        console.log(
          "beforeConcat_paraA",
          beforeConcat_paraA.concat(elementList_Stage1[0])
        );

        trees.children[startParaIndex].children = beforeConcat_paraA.concat(
          elementList_Stage1[0]
        );
        // 结尾段
        // const beforeConcat_paraB = trees.children[endParaIndex].children.slice(
        //   endIndex + 1
        // );
        // console.log(endParaIndex, beforeConcat_paraB);
        // console.log(
        //   "beforeConcat_paraB",
        //   // beforeConcat_paraB.concat(
        //   elementList_Stage1[elementList_Stage1.length - 1].concat(
        //     beforeConcat_paraB
        //   )
        //   // )
        // );

        // trees.children[endParaIndex].children = elementList_Stage1[
        //   elementList_Stage1.length - 1
        // ].concat(beforeConcat_paraB);

        // 浅拷贝elementList_Stage1
        const elementList_Stage2 = elementList_Stage1.slice(0);
        console.log(_.cloneDeep(elementList_Stage1));
        elementList_Stage2[0] = elementList_Stage2[0].slice(1);

        // elementList_Stage2.length - 2是个空段落
        const lastParaChildren =
          elementList_Stage2[elementList_Stage2.length - 1];
        console.log("lastParaChildren", lastParaChildren);
        const lastParaChildren_new = lastParaChildren.slice(
          0,
          lastParaChildren.length - 1
        );
        console.log("ready to throwOut1", elementList_Stage2);
        elementList_Stage2[
          elementList_Stage2.length - 1
        ] = lastParaChildren_new;
        const forNewRange = {
          startId: elementList_Stage2[0][0].id,
          endId: _.last(elementList_Stage2[elementList_Stage2.length - 2]).id,
          startOffset: 0,
          endOffset: _.last(elementList_Stage2[elementList_Stage2.length - 2])
            .text.length
        };
        console.log("endId", forNewRange.endId);
        setTimeout(function() {
          redirectRange(store, _.cloneDeep(forNewRange));
          saveStack(trees, store, forNewRange);
        }, 0);
        return elementList_Stage2;
      }
    } else if (
      range.startContainer.tagName === "P" ||
      range.startContainer.tagName === "BR"
    ) {
      if (range.endContainer.nodeType === 3) {
        console.log("medium well", _.cloneDeep(elementList_Stage1));
        // 为了记忆range，声明startParaIndex
        // const startParaID =
        //   range.startContainer.tagName === "P"
        //     ? range.startContainer.parentNode.parentNode.id
        //     : range.startContainer.parentNode.id;
        // const startParaIndex = trees.children.findIndex(
        //   item => item.id === startParaID
        // );
        // console.log("startParaIndex", startParaIndex);
        const endParaID = range.endContainer.parentNode.parentNode.id;
        const endParaIndex = trees.children.findIndex(
          item => item.id === endParaID
        );
        console.log("endParaIndex", endParaIndex);

        // const startIndex = trees.children[startParaIndex].children.findIndex(
        //   item => item.id === range.startContainer.parentNode.id
        // );
        // console.log("startIndex", startIndex);
        const endIndex = trees.children[endParaIndex].children.findIndex(
          item => item.id === range.endContainer.parentNode.id
        );
        console.log("endIndex", endIndex);

        const partA = elementList_Stage1[0][0];
        const partAText = partA.text.substring(0, range.startOffset);
        const partAText_rest = partA.text.substring(range.startOffset);

        const partA_rest_container = new ElementNode("span");
        partA_rest_container.tag = partA.tag;
        partA_rest_container.text = partAText_rest;
        partA_rest_container.style = _.cloneDeep(partA.style);
        partA_rest_container.parent = partA.parent;
        partA.text = partAText;
        // 在partA后插入将要抛出的剩余部分
        elementList_Stage1[0].splice(0 + 1, 0, partA_rest_container);
        // 方便后续处理，partA===''时，将partA删除
        if (partA.text === "") {
          elementList_Stage1[0].shift();
        }
        // 处理partB
        const lastPara_children =
          elementList_Stage1[elementList_Stage1.length - 1];
        const partB = lastPara_children[lastPara_children.length - 1];
        const partBText = partB.text.substring(0, range.endOffset);
        const partBText_rest = partB.text.substring(range.endOffset);

        const partB_rest_container = new ElementNode("span");
        partB_rest_container.tag = partB.tag;
        partB_rest_container.text = partBText_rest;
        partB_rest_container.style = _.cloneDeep(partB.style);
        partB_rest_container.parent = partB.parent;
        partB.text = partBText;
        lastPara_children.splice(
          lastPara_children.length,
          0,
          partB_rest_container
        );
        console.log("elementList_Stage1", elementList_Stage1);

        // 开头段
        // const beforeConcat_paraA = trees.children[
        //   startParaIndex
        // ].children.slice(0, startIndex);
        // console.log(
        //   "beforeConcat_paraA",
        //   beforeConcat_paraA.concat(elementList_Stage1[0])
        // );

        // trees.children[startParaIndex].children = beforeConcat_paraA.concat(
        //   elementList_Stage1[0]
        // );
        // 结尾段
        const beforeConcat_paraB = trees.children[endParaIndex].children.slice(
          endIndex + 1
        );
        console.log(endParaIndex, beforeConcat_paraB);
        console.log(
          "beforeConcat_paraB",
          // beforeConcat_paraB.concat(
          elementList_Stage1[elementList_Stage1.length - 1].concat(
            beforeConcat_paraB
          )
          // )
        );

        trees.children[endParaIndex].children = elementList_Stage1[
          elementList_Stage1.length - 1
        ].concat(beforeConcat_paraB);

        // 浅拷贝elementList_Stage1
        const elementList_Stage2 = elementList_Stage1.slice(0);

        // elementList_Stage2[0] = elementList_Stage2[0].slice(1);

        const lastParaChildren =
          elementList_Stage2[elementList_Stage2.length - 1];
        console.log("lastParaChildren", _.last(lastParaChildren));

        elementList_Stage2[
          elementList_Stage2.length - 1
        ] = lastParaChildren.slice(0, lastParaChildren.length - 1);
        console.log("ready to throwOut", elementList_Stage2);

        // const startContainer =
        // range.endContainer.nodeType === 3,所以，partB会被分割，所以lastParaChildren的最后一个元素，不应该是endContainer，真正的endContainer应该是倒数第二个元素
        const forNewRange = {
          startId: elementList_Stage2[0][0].id,
          endId: lastParaChildren[lastParaChildren.length - 2].id,
          startOffset: 0,
          endOffset: lastParaChildren[lastParaChildren.length - 2].text.length
        };
        setTimeout(function() {
          redirectRange(store, _.cloneDeep(forNewRange));
          saveStack(trees, store, forNewRange);
        }, 0);
        return elementList_Stage2;
      } else if (
        range.endContainer.tagName === "P" ||
        range.endContainer.tagName === "BR"
      ) {
        console.log("well done", _.cloneDeep(elementList_Stage1));
        // 开局为br，结尾也为br

        const forNewRange = {
          startId: elementList_Stage1[0][0].id,
          endId: _.last(elementList_Stage1[elementList_Stage1.length - 1]).id,
          startOffset: 0,
          endOffset: _.last(elementList_Stage1[elementList_Stage1.length - 1])
            .text.length
        };
        console.log(forNewRange);
        setTimeout(function() {
          redirectRange(store, _.cloneDeep(forNewRange));
          saveStack(trees, store, forNewRange);
        }, 0);
        return elementList_Stage1;
      }
    }
  },
  spanSpans: function(elementList_Stage1, trees, range, store) {
    console.log("refinedNodesByRange_stage2,spanSpans入参", elementList_Stage1);
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
    console.log("startIndex", startIndex, "endIndex", endIndex);
    const partA = elementList_Stage1[0];
    const partAText = partA.text.substring(0, range.startOffset);
    const partAText_rest = partA.text.substring(range.startOffset);
    console.log("partAText", partAText);
    const partA_rest_container = new ElementNode("span");
    partA_rest_container.parent = partA.parent;
    partA_rest_container.tag = partA.tag;
    partA_rest_container.text = partAText_rest;
    partA_rest_container.style = _.cloneDeep(partA.style);
    partA.text = partAText;

    const partB = elementList_Stage1[elementList_Stage1.length - 1];
    const partBText = partB.text.substring(0, range.endOffset);
    console.log("partBText", partBText);
    const partBText_rest = partB.text.substring(range.endOffset);
    const partB_rest_container = new ElementNode("span");
    partB_rest_container.tag = partB.tag;
    partB_rest_container.text = partBText_rest;
    partB_rest_container.style = _.cloneDeep(partB.style);
    partB_rest_container.parent = partB.parent;
    partB.text = partBText;
    // trees.children[startParaIndex].children.splice()
    // splice操作elementList_Stage1

    elementList_Stage1.splice(1, 0, partA_rest_container);
    elementList_Stage1.splice(endIndex + 1 + 1, 0, partB_rest_container);
    console.log("即将插入", elementList_Stage1);
    trees.children[startParaIndex].children.splice(
      startIndex,
      endIndex - startIndex + 1,
      ...elementList_Stage1
    );
    const elementList_Stage2 = elementList_Stage1.slice(
      1,
      elementList_Stage1.length - 1
    );
    cleanEmptySibling(trees);
    const forNewRange = {
      startId: partA_rest_container.id,
      endId: elementList_Stage2[elementList_Stage2.length - 1].id,
      startOffset: 0,
      endOffset: elementList_Stage2[elementList_Stage2.length - 1].text.length
    };
    setTimeout(function() {
      redirectRange(store, _.cloneDeep(forNewRange));
      saveStack(trees, store, forNewRange);
    }, 0);
    return elementList_Stage2;
  },
  withinSingleSpan: function(elementList_Stage1, trees, range, store) {
    const target = elementList_Stage1[0];
    console.log("elementList_Stage1 in stage2", target.text);
    const targetPara = target.parent;
    const startIndex = targetPara.children.findIndex(
      item => item.id === target.id
    );

    const partAText = target.text.substring(0, range.startOffset);
    const partAText_rest = target.text.substring(
      range.startOffset,
      range.endOffset
    );
    const partA_rest_container = new ElementNode("span");
    partA_rest_container.tag = target.tag;
    partA_rest_container.text = partAText_rest;
    partA_rest_container.style = _.cloneDeep(target.style);
    partA_rest_container.parent = target.parent;

    const partBText = target.text.substring(range.endOffset);
    const partB = new ElementNode("span");
    partB.tag = target.tag;
    partB.text = partBText;
    partB.style = target.style;
    partB.parent = target.parent;

    target.text = partAText;
    // partA_rest_container,partB_rest_container添加在startIndex之后
    targetPara.children.splice(startIndex + 1, 0, partA_rest_container, partB);
    cleanEmptySibling(trees);
    console.log("ready to throwOut", partA_rest_container);
    // console.log("withinSingleSpan targetNode", targetSpan);
    const throwOut = [];
    throwOut.push(partA_rest_container);

    const forNewRange = {
      startId: partA_rest_container.id,
      endId: partA_rest_container.id,
      startOffset: 0,
      endOffset: partA_rest_container.text.length
    };
    // console.log("ready to flash back", _.cloneDeep(targetPara.children));
    setTimeout(function() {
      redirectRange(store, _.cloneDeep(forNewRange));
      saveStack(trees, store, forNewRange);
    }, 0);

    return throwOut;
  },

  scenePointMode: function(trees, range, store) {
    console.log("scenePointMode in stage2", range.startContainer);
    if (range.startContainer.nodeType === 3) {
      console.log("range.startContainer", range.startContainer);
      const targetPara = trees.children.find(
        item => item.id === range.startContainer.parentNode.parentNode.id
      );
      const targetSpan = targetPara.children.find(
        item => item.id === range.startContainer.parentNode.id
      );
      console.log("scenePointMode targetNode", targetSpan);
      const throwOut = [];
      throwOut.push(targetSpan);
      console.log("ready to throwout scenePointMode in stage2", throwOut);
      // currentStyle = targetSpan.style;
      // this.theSilentCartoGrapher = targetSpan.style;
      // range不变
      const forNewRange = {
        startId: range.startContainer.parentNode.id,
        endId: range.startContainer.parentNode.id,
        startOffset: range.startOffset,
        endOffset: range.endOffset
      };
      setTimeout(function() {
        redirectRange(store, _.cloneDeep(forNewRange));
        saveStack(trees, store, forNewRange);
      }, 0);
      return [];
    } else {
      console.log("unexcept range", range);
      return [];
    }
  }
};
// keyBoardEvent
