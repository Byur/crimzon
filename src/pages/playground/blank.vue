<template>
  <div id="page">
    <div id="ed"></div>
  </div>
</template>
<script>
import Core from '../playground/baseclass/core/editor_core'
export default {
  data() {
    return {
      ed:{}
    };
  },
  mounted() {
    const ed = new Core(this.$store)
    ed.init('ed')
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
