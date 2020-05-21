import _ from "lodash";
// action:redo/undo为参数,从相应的栈中获取栈顶,将相应时刻的trees和range返回
export function getStack(trees, store, action) {
  if (action === "undo") {
    // if (store.state.historyStack.length === 0){
    //   console.log('额外录入一个栈')
    //   saveStack();
    //   getStack('undo')
    //   return;
    // }
    console.log("undo");
    store.commit("actionUndo");
    // let currentStack = store.state.historyStack;
    const topAfterUndo = store.state.undoTop;
    console.log("topAfterUndo", topAfterUndo);
    if (topAfterUndo) {
      trees = topAfterUndo.trees;
      console.log("jieshu");
    }
    return;
  } else {
    console.log("redo");
    store.commit("actionRedo");
    let currentStack = store.state.normalStack;
    const topAfterRedo = _.last(currentStack);
    console.log("topAfterRedo", topAfterRedo);
    if (topAfterRedo) {
      trees = topAfterRedo.trees;
      console.log("jieshu");
    }
  }
  // console.log(currentStack);
}
// normal入栈
export function saveStack(trees, store, forNewRange) {
  console.log("入栈");
  const payload = {
    range: {
      startId: forNewRange.startId,
      startOffset: forNewRange.startOffset || 0,
      endId: forNewRange.endId,
      endOffset: forNewRange.endOffset || 0
    },
    trees: trees
  };
  store.commit("actionIndo", payload);
}
