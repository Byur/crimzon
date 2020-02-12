<template>
  <div id="ArrayBox">
    {{ target.length }}
    <br />
    {{ JSON.stringify(target) }}
  </div>
</template>
<script>
export default {
  props: {
    target: {
      type: Array,
      default: function() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  methods: {},
  watch: {
    target: {
      handler(val) {
        console.log("watcher trigger", val);
      },
      deep: true
    }
  }
};
</script>
<style lang="scss" scoped></style>
