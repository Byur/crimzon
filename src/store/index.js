import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    prevRangeFactor: {},
    prevTextNodeLength: {}
    // tempAttr: ""
  },
  mutations: {
    saveRangeBeforeTextChange(state, params) {
      console.log("我开始了", params.rangeFactor);
      state.prevRangeFactor = params.rangeFactor;
    },
    savePreTextNodeLength(state, param) {
      state.prevTextNodeLength = param.prelength;
    }
    // getRange(state) {
    //   return state.prevRangeFactor;
    // },
    // temptest(state, param) {
    //   console.log("payload", param);
    //   state.tempAttr = param;
    // }
  },
  actions: {},
  modules: {}
});
