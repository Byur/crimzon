import Vue from "vue";
import Vuex from "vuex";

let _ = require("lodash");
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    prevRangeFactor: {},
    prevTextNodeLength: {},
    // tempAttr: ""
    // // expect String,record last stack action type,when execute Indo action and lastAction===undo||redo:than clean normal Stack&& history Stack
    // lastAction: "",
    /**
     * expect an Array item with range:{startContainer,endContainer,startOffset,endOffset} and virtual-DOM tree
     */

    normalStack: [],
    historyStack: [],
    // assign an variable, to solve vuex's mutations can not return a value to an outside vue-instance
    undoTop: {}
  },
  // getters: {
  //   normalundoTop: state => {
  //     return state.normalStack[0];
  //   }
  // },
  mutations: {
    saveRangeBeforeTextChange(state, payload) {
      // console.log("存入store的range参数", payload.rangeFactor);
      state.prevRangeFactor = payload.rangeFactor;
    },
    savePreTextNodeLength(state, payload) {
      state.prevTextNodeLength = payload.prelength;
    },
    testArrayPush(state, payload) {
      state.testArray.push(payload);
      // console.log(state.testArray);
    },
    // stackHandler
    actionUndo(state) {
      // console.log("beforeUndo", state.normalStack);
      let top = null;
      // 当normalStack长度为1时,此时是初始化的状态,如果再删除,会导致pop出空,这就是为什么点击redo或者undo有时候不生效的原因,为了不让他返回空,在这里加一个限制
      if (state.normalStack.length > 1) {
        const pop = state.normalStack.pop();
        state.historyStack.push(pop);
        // top = pop;
        top = _.last(state.normalStack);
        // console.log(
        //   "即将呈现",
        //   top.range.startId,
        //   top.trees.children[0].children
        // );
        // console.log("afterUndo------------normalStack", state.normalStack);
        // console.log("afterUndo------------historyStack", state.historyStack);
      } else {
        top = state.normalStack[0];
        // console.log("undo栈pop限制");
      }
      state.undoTop = top;
      state.lastAction = "Undo";
      // eslint-disable-next-line no-unused-vars
      const beforeIndo = Array.from(state.normalStack, item => {
        return (
          item.range.startId + "|" + item.range.startOffset + "|"
          // +
          // item.trees.children[0].children[0].text +
          // "|" +
          // item.trees.children[0].children[1].text
        );
      });
      // console.log(
      //   "--------------------------------afterUndo------------------------\n",
      //   beforeIndo
      // );
      return;
    },
    actionRedo(state) {
      // console.log("beforeRedo", state.normalStack);
      if (state.historyStack.length > 0) {
        const top = state.historyStack.pop();
        state.normalStack.push(top);
        // console.log("afterRedo------------normalStack", state.normalStack);
        // console.log("afterRedo------------historyStack", state.historyStack);
        return;
      }
      // console.log("redo栈pop限制");
      state.lastAction = "Redo";
      return;
    },
    // 每一个Indo都会把history清空
    actionIndo(state, payload) {
      state.historyStack = [];
      const payloadafterDeal = _.cloneDeep(payload);
      // console.log("payload", payloadafterDeal);
      // eslint-disable-next-line no-unused-vars
      const beforeIndo = Array.from(state.normalStack, item => {
        return (
          item.range.startId +
          "|" +
          item.range.startOffset +
          "|" +
          item.trees.children[0].children[0].text
          // +
          // "|" +
          // item.trees.children[0].children[1].text
        );
      });
      // console.log(
      //   "--------------------------------beforeIndo------------------------\n",
      //   beforeIndo
      // );
      // if (state.lastAction==='Undo'){
      //   state.normalStack = state.normalStack.splice(0,1);
      // }
      state.normalStack.push(payloadafterDeal);
      state.lastAction = "Indo";
      // eslint-disable-next-line no-unused-vars
      const tempArr = Array.from(state.normalStack, item => {
        return (
          item.range.startId + "|" + item.range.startOffset + "|"
          // +
          // item.trees.children[0].children[0].text +
          // "|" +
          // item.trees.children[0].children[1].text
        );
      });
      // console.log(
      //   tempArr
      //   // "\nlength",
      //   // state.normalStack.length,
      //   // "\nfirst",
      //   // state.normalStack[0].trees.children[0].children[1].text,
      //   // // state.normalStack[1].trees.children[0].children[0].text,
      //   // "\nlast",
      //   // _.last(state.normalStack).trees.children[0].children[1].text
      // );
      // console.log("history", state.historyStack);
    }
  },
  actions: {},
  modules: {}
});
