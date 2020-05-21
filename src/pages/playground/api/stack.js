import _ from "lodash";
// action:redo/undo为参数,从相应的栈中获取栈顶,将相应时刻的trees和range返回
export function getStack(action) {
  if (action === "undo") {
    // if (this.$store.state.historyStack.length === 0){
    //   console.log('额外录入一个栈')
    //   this.saveStack();
    //   this.getStack('undo')
    //   return;
    // }
    console.log("undo");
    this.$store.commit("actionUndo");
    // let currentStack = this.$store.state.historyStack;
    const topAfterUndo = this.$store.state.undoTop;
    console.log("topAfterUndo", topAfterUndo);
    if (topAfterUndo) {
      this.trees = topAfterUndo.trees;
      console.log("jieshu");
    }
    return;
  } else {
    console.log("redo");
    this.$store.commit("actionRedo");
    let currentStack = this.$store.state.historyStack;
    const topAfterRedo = _.last(currentStack);
    console.log("topAfterRedo", topAfterRedo);
    if (topAfterRedo) {
      this.trees = topAfterRedo.trees;
      console.log("jieshu");
    }
  }
  // console.log(currentStack);
}
// normal入栈
export function saveStack(forNewRange) {
  console.log("入栈");
  const payload = {
    range: {
      startId: forNewRange.startId,
      startOffset: forNewRange.startOffset || 0,
      endId: forNewRange.endId,
      endOffset: forNewRange.endOffset || 0
    },
    trees: this.trees
  };
  this.$store.commit("actionIndo", payload);
}
