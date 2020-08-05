<template>
  <div id="page">
    <div id="ed"></div>
  </div>
</template>
<script>
import Editor from "../playground/baseclass/core/Editor";
export default {
  data() {
    return {
      ed: {}
    };
  },
  mounted() {
    const ed = new Editor("ed", this.$store);
    // ed.init()
    console.log("editor outside of window", ed);
  }
};
</script>
<style lang="scss" scoped>
#page {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;
  background-color: rgb(107, 121, 119);
}
</style>
