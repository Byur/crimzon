<template>
  <div id="Playground">
    <el-button @click="toAboutForms">
      aboutForms
    </el-button>
    <el-button @click="richEditor">
      richEditor
    </el-button>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  name: "Playground",
  data() {
    return {
      v1: ""
    };
  },
  methods: {
    toAboutForms() {
      this.$router.push("/playground/aboutForms");
    },
    richEditor() {
      this.$router.push("/richEditor");
    }
  }
};
</script>
<style lang="scss" scoped>
#qwe {
  color: orange;
}
</style>
