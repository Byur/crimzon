<template>
  <!-- 富文本编辑 -->
  <div class="editWords">
    <div class="shell">
      <div class="of">
        <div class="toolBar">
          <el-tag effect="plain" @click="test">
            decoration
          </el-tag>
          <el-tag effect="plain" @click="anotest">
            formatblock
          </el-tag>
          <el-tag effect="plain" @click="anotest1">
            removeFormat
          </el-tag>
          <el-tag effect="plain" @click="getTextNodes">
            getTextNodes
          </el-tag>
          <el-tag effect="plain" @click="changeComponentText">
            试一下
          </el-tag>
          <el-tag effect="plain" @click="getTempChildNodes">
            再试一下
          </el-tag>
          <el-tag effect="plain" @click="changeText">
            改变当前节点文本
          </el-tag>
        </div>
        <!-- <div
          id="theGhost"
          ref="wysiwys"
          contenteditable
          @mouseleave="checkRange"
          @mousedown="getTarget"
          @mouseup="getTarget"
        >
        </div> -->

        <!-- 
          tips:
          1,复制也可以触发input
         -->

        <!-- 
          purpose: 
          1，如果光标在文本末尾，输入的文本将按照当前的decoration配置渲染文字格式
          2，如果光标在文本内容中，根据contenteditable的特性，会依照当前所在节点的样式配置进行渲染，
          3，如果选中文本并且点击触发指令，对于修饰级指令，将改变选中文本区域的样式；对于换行级指令，则创建一个新的块级标签，将选中的文本包裹起来；
          4，若选中多个文本节点且无任何指令替换以普通字符串，则以选择范围起点的节点decoration配置为准
          5，选中范围时的删除操作现象待确认
         -->
        <!-- 
          @input --- 使用input获得
          @focusOffsetChange --- 点击文本、当前焦点相对与组件中文本的偏移量改变时（本质上也是点击操作）触发,该方法返回光标所在的html节点元素。
         -->
        <!--  -->

        <editor
          @input="getInnerHTML"
          @focusOffsetChange="takeYourComfort"
          :innerText="haveyourself"
          ref="editor"
        ></editor>
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
  },
  mounted() {
    // this.richEditor = this.$refs.wysiwys.childNodes;
    // console.log('sss',this.richEditor)
    // let node1 = new elementNode("h1", "asd");
    // let node201 = new elementNode(
    //   "span",
    //   "node201",
    //   {},
    //   { color: "red", "font-size": "16px" }
    // );
    // let node202 = new elementNode(
    //   "span",
    //   "node202",
    //   {},
    //   { color: "aqua", "font-size": "18px" }
    // );
    // let node203 = new elementNode(
    //   "span",
    //   "node203",
    //   {},
    //   { color: "pink", "font-size": "20px" }
    // );
    // let node204 = new elementNode(
    //   "span",
    //   "node204",
    //   {},
    //   { color: "gray", "font-size": "24px" }
    // );
    // let node2 = new elementNode("span", "inside", {}, {}, [
    //   node201,
    //   node202,
    //   node203,
    //   node204
    // ]);
    // console.log(node2.toString());
    // this.haveyourself = node2.toString();
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
      configableKeys: {
        // 整个容器
        redo: null, // 撤销
        selectall: null,
        // 插入点/当前range
        removeFormat: null, //格式化
        backcolor: [], // 调色板和可选颜色
        bold: null,
        copy: null, // 仅用于range
        underline: null, // 开始下划线
        createlink: "", // 仅用于range
        cut: null, // 剪切
        delete: null,
        fontname: [], // 常用字体
        fontsize: [], // 1-7递增变大
        forecolor: [], // 调色板和可选颜色

        // 改动选中区域整行
        formatblock: "", // 整行被某个标签包裹
        intent: null, // 缩进
        inserthorizontalrule: null, // 插入水平线并换行
        insertimage: "",
        insertorderelist: null,
        insertunorderelist: null,
        insertparagraph: null,
        italic: null,
        justifycenter: null, // 选中所在行居中
        justifyleft: null, // 选中所在行左对齐
        justifyright: null, // 选中所在行右对齐

        outdent: null,
        paste: null,
        removeformat: null,
        unlink: null
      },
      //
      range: null,

      currentSku: [],
      // 当前改动样式
      currentStyle: 0
    };
  },
  methods: {
    changeText() {
      this.currentNode.innerText = "改变了";
    },
    takeYourComfort(currentnode) {
      console.log("out of the component", currentnode);
      this.currentNode = currentnode;
    },
    getTarget() {
      console.log("click", event.target);
    },
    getInnerHTML() {
      console.log("oninput", this.$refs.editor);
    },
    getTempChildNodes() {
      // console.log
      let target = document.getElementById("theGhost");
      console.log("target", target.childNodes);
    },
    changeComponentText() {
      this.haveyourself = '<h1 id="asd">???</h1>';
    },
    getTextNodes() {
      console.log("node", this.$refs.wysiwys.childNodes);
    },
    // getTarget() {
    //   console.log(event);
    // },
    checkRange() {
      if (window.getSelection().getRangeAt(0)) {
        this.range = window.getSelection().getRangeAt(0);
        console.log("leave", this.range);
      }
    },
    test() {
      this.selectBack().then(() => {
        let result = document.execCommand("backcolor", false, "#DDD");
        console.log(result);
      });
    },
    anotest() {
      this.selectBack().then(() => {
        let result = document.execCommand("fontsize", false, "7");
        console.log(result);
      });
    },
    anotest1() {
      this.selectBack().then(() => {
        let result = document.execCommand("removeFormat", false, null);
        console.log(result);
      });
    },
    selectBack() {
      // console.log('begin',window.getSelection())

      // let result =  document.execCommand('FormatBlock',false,'<h1>');
      return new Promise(res => {
        let selection = window.getSelection();
        selection.removeAllRanges();

        let range = document.createRange();

        range.setStart(this.range.startContainer, this.range.startOffset);

        range.setEnd(this.range.endContainer, this.range.endOffset);

        selection.addRange(range);
        // this.$refs.wysiwys.focus();
        res();
      });

      // let result =  document.execCommand('FormatBlock',false,'<h1>');
      // console.log('result',result)
    },
    // 储存当前文字配置
    editionConfig() {}
    // getRangeText selection.toString(),不是获取不到选中的文本，而是需要获取切开的文本
  }
};
</script>
<style lang="scss" scoped>
.editWords {
  padding: 20px;
  background-color: #475164;
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
    }
  }
}
</style>
