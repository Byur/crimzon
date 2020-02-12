import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    prevRangeFactor: {},
    tempAttr: ""
  },
  mutations: {
    saveRangeBeforeTextChange(state, params) {
      console.log(state.prevRangeFactor, "我开始了", params.rangeFactor);
      state.prevRangeFactor = params.rangeFactor;
    },
    // getRange(state) {
    //   return state.prevRangeFactor;
    // },
    temptest(state, param) {
      console.log("payload", param);
      state.tempAttr = param;
    }
  },
  actions: {},
  modules: {}
});
