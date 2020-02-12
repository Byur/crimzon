<template>
  <div id="Home">
    <el-button @click="toPlayGround">toPlayGround</el-button>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      v1: ""
    };
  },
  methods: {
    toPlayGround() {
      this.$router.push("/playground");
    },
    // ie能在任何时候访问
    selectAllString() {
      // this.$refs.textarea.select()
    },
    gerStrings() {
      // console.log(event)
      // console.log(event.target.selectionStart,event.target.selectionEnd)
    },
    blockCopyValue(event) {
      console.log("before", event.clipboardData);
    },
    getCopyValue(event) {
      console.log("catch", event.clipboardData);
    },
    blockPaste(event) {
      console.log("paste", event, event.clipboardData.getData("text"));
    }
  }
};
</script>
<style lang="scss" scoped>
#qwe {
  color: orange;
}
</style>
