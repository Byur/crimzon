// let _ = require("lodash");
// eslint-disable-next-line no-unused-vars
export function compareNCombine(source, template) {
  const validKeyList = [];
  const keyList = Object.keys(source);
  keyList.forEach(item => {
    if (source[item] !== undefined || source[item] !== null) {
      validKeyList.push(item);
    }
  });
  validKeyList.forEach(i => {
    source[i] = template[i];
  });
  console.log(source);
  return false;
};
export function buildNewRange(rangeFactor) {
  // console
  const startContainer = document.getElementById(rangeFactor.startId);
  const endContainer = document.getElementById(rangeFactor.endId);
  console.log("startContainer", startContainer, "endContainer", endContainer);
  const range = document.createRange();
  range.setStart(startContainer.childNodes[0], rangeFactor.startOffset);
  range.setEnd(endContainer.childNodes[0], rangeFactor.endOffset);
  return range;
}
/**
 * @description 公共API，检测某段range对应的虚拟元素的list中是否全都含有特定的样式，返回一个布尔值
 * @param {Array} treedNodes_split
 * @param {String} cssAttr
 * @returns {Boolean}
 */
export function isAllActivated_switch(treedNodes_split, cssAttr) {
  // console.log("treedNodes_split", treedNodes_split);
  const attrPair = cssAttr.split("_");
  const flaten = treedNodes_split.flat(1);
  const afterFilter = flaten.filter(item => {
    return item.tag !== "br" && item.tag !== "p";
  });
  // console.log("flaten", flaten);
  // console.log("afterFilter", afterFilter);
  if (afterFilter.length > 0) {
    return afterFilter.every(item => {
      // console.log("item.style:", item.style);
      // console.log("targetStyle:", item.style[attrPair[0]], attrPair[1]);
      console.log("item in corefunction", item.style[attrPair[0]], attrPair[1]);
      return item.style[attrPair[0]] === attrPair[1];
    });
  }
  return false;
}
export function cleanEmptySibling(tree) {
  tree.children.forEach(function(item, index) {
    if (item.children.length > 0) {
      // item.forEach(function(e,i){
      //   if
      // })
      const filter = item.children.filter(function(item) {
        return item.display !== false;
      });
      item.children = filter;
    } else {
      tree.splice(index, 1);
    }
  });
}
// 手动清楚range
export function clearRange() {
  let selection = window.getSelection();
  selection.removeAllRanges();
}
// 判定为选区模式时，处理选取中的文本;样式更换/文本覆盖/删除/换行,但操作微调太多，暂不考虑
// export function rangeDealer(trees,range){
// console.log(trees,range)
// }
// 保存range要素至data和vuex
export function saveRange(store) {
  if (window.getSelection().getRangeAt(0)) {
    // this.range = window.getSelection().getRangeAt(0);
    // console.log("saved", this.range);
    store.commit("saveRangeBeforeTextChange", {
      rangeFactor: {
        startTextTankAncestor: window.getSelection().getRangeAt(0)
          .startContainer.parentNode,
        startOffset: window.getSelection().getRangeAt(0).startOffset,
        endTextTankAncestor: window.getSelection().getRangeAt(0).endContainer
          .parentNode,
        endOffset: window.getSelection().getRangeAt(0).endOffset
      }
    });
  }
}
// 20200218添加补正参数startOffsetChange和endOffsetChange,用于在直接输入和输入法输入包括剪切粘贴的时候,把range调整到合理的位置
export function rangeForTextChange(store, offsetFluctuation = 0) {
  let rangeAfter = store.state.prevRangeFactor;
  console.log("rangeAfter", rangeAfter);
  let selection = window.getSelection();
  let newRange = document.createRange();
  // // range对象,通常是this.range

  // 20200212,通过id获取文本节点的父元素节点
  let startTextTankAncestor = document.getElementById(
      rangeAfter.startTextTankAncestor.id
    ),
    endTextTankAncestor = document.getElementById(
      rangeAfter.endTextTankAncestor.id
    );
  // console.log("teeeeeees", _.cloneDeep(rangeAfter));
  let startContainer =
    startTextTankAncestor.childNodes[0] || startTextTankAncestor;
  let endContainer = endTextTankAncestor.childNodes[0] || endTextTankAncestor;

  // console.log("startContainer", startTextTankAncestor, startContainer);
  newRange.setStart(startContainer, rangeAfter.startOffset + offsetFluctuation);
  newRange.setEnd(endContainer, rangeAfter.endOffset + offsetFluctuation);
  // console.log(newRange.startContainer.parentNode);
  selection.removeAllRanges();
  selection.addRange(newRange);

  // console.timeEnd("-----------------timer--------------------");
}
export function redirectRange(store, forNewRange) {
  // console.log("设置指定range", forNewRange.startId);
  // console.log(
  //   // "test get dom",
  //   forNewRange.startId,
  //   document.getElementById(forNewRange.startId)
  // );
  store.commit("saveRangeBeforeTextChange", {
    rangeFactor: {
      startTextTankAncestor: document.getElementById(forNewRange.startId),
      startOffset: forNewRange.startOffset || 0,
      endTextTankAncestor: document.getElementById(forNewRange.endId),
      endOffset: forNewRange.endOffset || 0
    }
  });
  // setTimeout(() => {
  rangeForTextChange(store);
  // }, 0);
}
// 每次遍历节点的路径
let currentPath = [];
function getAncestorNode(htmlNode) {
  if (htmlNode.parentNode) {
    let upgradeNode = htmlNode.parentNode;
    if (upgradeNode.id == "origin") {
      // console.log("应该停下来了", upgradeNode);
      return upgradeNode;
    } else {
      // 获取这个元素节点的的父元素ID加入
      currentPath.unshift(upgradeNode.id);
      // console.log("递归中", currentPath);
      return getAncestorNode(upgradeNode);
    }
  }
}
function getGenerationTree(htmlNode) {
  // console.log("入参：", htmlNode);
  currentPath = [];
  // 从数组头部加入冒泡顺序上的第一个元素节点id,这会导致最后一个也就是距离origin最近的子元素将会排在数组第一位
  currentPath.unshift(htmlNode.id);
  getAncestorNode(htmlNode);
  // console.log("获取到路径", currentPath);
  return currentPath;
}

export function findTargetNode(htmlNode, trees) {
  let res = getGenerationTree(htmlNode);
  // console.log("回调开始", res);
  let currentposi = trees;
  // console.log("trees", trees);
  // 生成id列表,表示新增节点落点位置的查找路径
  // for (let item of afterSplit) {
  //   nodeFullId = nodeFullId + item;
  //   res.push(nodeFullId);
  // }

  // console.log("matcher", res);
  // 通过路径获取落点容器的引用,从最外层origin的children开始查找,找到数组的倒数第二位节点作容器,即length-2的元素节点并返回
  for (let i = 0; i < res.length; i++) {
    // console.log(`第${i}次匹配,当前节点为：`, currentposi, "匹配ID为：", res[i]);
    // 若当前遍历到的节点没有子节点
    // console.log(`第${i}次查询的对象是:`, currentposi);
    if (currentposi.children.length !== 0) {
      currentposi = currentposi.children.find(item => {
        // console.log("此次遍历到的子节点", item);
        // console.log("currentMatcher", res[i]);
        return item.id === res[i];
      });
      // console.log("此次遍历完毕", currentposi);
    }
  }
  // console.log("循环结束", currentposi);
  return currentposi;
}
