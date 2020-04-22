<template>
  <!-- 富文本编辑 -->
  <div class="editWords">
    <div class="shell">
      <div class="of">



        <editor
          @input="getInnerHTML"
          @focusOffsetChange="takeYourComfort"
          :innerText="haveyourself"
          ref="editor"
        ></editor>
        <button click='addAnLetter'>llllllllllick</button>
        <div id="letterbox" contenteditable>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import editor from "./components/Core";
// import elementNode from "./baseclass/tags";
export default {
  components: {
    editor
  },
  created() {
    // let range = document.createRange();
    // console.log("onload", range);
      const letterbox = document.getElementById('letterbox')
      letterbox.innerHTML = '<h1>喂喂喂?</h1>'
  },
  mounted() {

  },
  watch: {
    richEditor: {
      handler(val) {
        console.log("watch", val);
      },
      deep: true
    },
    haveyourself(val) {
      console.log("inject", val);
    }
  },
  data() {
    return {
      // nobel2:'',
      currentNode: {},
      haveyourself: "",
      richEditor: [],
      // 可供改动属性

      //
      range: null,

      currentSku: [],
      // 当前改动样式
      currentStyle: 0
    };
  },
  methods: {
    // core
    takeYourComfort(currentnode) {
      console.log("out of the component", currentnode);
      this.currentNode = currentnode;
    },
    getInnerHTML(range) {
      console.log("oninput", range, this.$refs.editor);
    },

    // temptest
    addAnLetter(){
      const letterbox = document.getElementById('letterbox')
      letterbox.innerText += 'A'
    }
  }
};
</script>
<style lang="scss" scoped>
.editWords {
  padding: 20px;
  background-color: #fff;
  .shell {
    border: 1px dotted #93b5cf;
    .of {
      padding-top: 10px;
      .toolBar {
        height: 40px;
        background-color: #fff;
      }
      #theGhost {
        border: 1px solid #000;
        height: 200px;
      }
      #letterbox {
        border: 1px solid #000;
        height: 200px;
      }
    }
  }
}
</style>
