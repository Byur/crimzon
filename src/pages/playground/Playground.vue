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
      v1: "",
      v2: 3,
      v3: 4
    };
  },
  computed: {
    v4() {
      const v2 = this.v2;
      const v3 = this.v3;
      // const
      return v2 + v3;
    }
  },
  methods: {
    toAboutForms() {
      this.$router.push("/playground/aboutForms");
    },
    richEditor() {
      console.log(this.v4);
      this.v4 = { a: "3" };
      console.log("第二次", this.v4);
      // this.$router.push("/richEditor");
    }
  }
};
</script>
<style lang="scss" scoped>
#qwe {
  color: orange;
}
</style>
