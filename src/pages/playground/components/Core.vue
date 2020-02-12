<template>
  <div
    id="theGhost"
    ref="wysiwys"
    v-html="innerText"
    contenteditable
    @input="getInput"
    @keyup="delectionLimit"
    @keydown="getRange"
    @click="getRange"
  ></div>
</template>
<script>
import elementNode from "../baseclass/tags";
export default {
  // @mouseleave="checkRange"
  // @mousedown="getTarget"
  // @mouseup="getTarget"
  created() {
    // this.range =
    let origin = new elementNode(
      "div",
      "",
      // "origin",
      { ref: "origin" },
      {},
      []
    );
    origin.id = "origin";
    let newPara = new elementNode("p", "", {}, {}, []);
    // let newinlineseed = new elementNode(
    //   "span",
    //   "...",
    //   "100000000",
    //   {},
    //   {},
    //   [],
    // );
    setTimeout(() => {
      let newinlineEle = new elementNode("span", "1234567", {}, {}, []);
      newPara.children = [newinlineEle];
      origin.children.push(newPara);
      this.trees = origin;
    }, 2);
  },
  data() {
    return {
      // rangeKeeper: {},
      range: {},
      currentRange: {},
      worker: "",
      innerText: "",
      // 用于保存上一步的配置，通过后退触发，可前进,暂不开发
      // Ticks: [
      //   {
      //     range:{},
      //     decoration:{},

      //   }
      // ],
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
        unlink: null
      },
      trees: {},
      // 记录当前dom节点向上追溯至id未origin的元素的节点id的路径
      currentPath: []
    };
  },
  watch: {
    innerText(val) {
      let i = document.getElementById("theGhost");
      console.log(val, i.childNodes);
    },
    trees: {
      handler(val) {
        this.innerText = val.toString();
        console.log("trees watcher", val);
      },
      deep: true
    }
    // range: {
    //   handler(val) {
    //     console.log("watch range", val);
    //   },
    //   deep: true
    // }
  },
  props: {
    // innerText: {
    //   type: String,
    //   default: function() {
    //     return "";
    //   }
    // }
  },
  // computed: {
  //   rangeAfter(){
  //     return this.$store.state.
  //   }
  // },
  methods: {
    getRange() {
      console.log("此时的range", window.getSelection().getRangeAt(0));
      this.range = window.getSelection().getRangeAt(0);
    },
    // 获取一个从目标节点到id为origin的节点的列表,供findSupernodeById方法使用
    getGenerationTree(htmlNode) {
      console.log("入参：", htmlNode);
      this.currentPath = [];
      // 从数组头部加入冒泡顺序上的第一个元素节点id，这会导致最后一个也就是距离origin最近的子元素将会排在数组第一位
      this.currentPath.unshift(htmlNode.id);
      this.getAncestorNode(htmlNode);
      console.log("获取到路径", this.currentPath);
      return this.currentPath;
      // return new Promise((res, rej) => {
      //   // 重置路径准备重新检索

      //   res(this.currentPath);
      //   // rej()
      //   console.log(rej);
      // });
    },
    // 从target或者range对象中获取一个dom元素，根据该元素的ID来组成访问路径

    getAncestorNode(htmlNode) {
      // let temparr =

      if (htmlNode.parentNode) {
        let upgradeNode = htmlNode.parentNode;
        if (upgradeNode.id == "origin") {
          console.log("应该停下来了", upgradeNode);
          return upgradeNode;
        } else {
          console.log("此次的dom元素", upgradeNode);
          // 获取这个元素节点的的父元素ID加入
          this.currentPath.unshift(upgradeNode.id);
          console.log("递归中", this.currentPath);
          return this.getAncestorNode(upgradeNode);
        }
      }
    },

    // 当要在文档末尾插入节点时，用该方法获取文档的最末节点，所以添加需要添加在该节点之后，通过id识别
    // 获取一个节点的最末子节点
    getDeepestNodeId(node) {
      if (node.children.length === 0) {
        return node;
      } else {
        return this.getDeepestNodeId(node.children[node.children.length - 1]);
      }
    },
    // 获取与入参元素节点对应的虚拟dom的引用
    findTargetNode(htmlNode) {
      let res = this.getGenerationTree(htmlNode);
      console.log("回调开始", res);
      let currentposi = this.trees;
      console.log("trees", this.trees);
      // 生成id列表，表示新增节点落点位置的查找路径
      // for (let item of afterSplit) {
      //   nodeFullId = nodeFullId + item;
      //   res.push(nodeFullId);
      // }

      console.log("matcher", res);
      // 通过路径获取落点容器的引用,从最外层origin的children开始查找，找到数组的倒数第二位节点作容器，即length-2的元素节点并返回
      for (let i = 0; i < res.length; i++) {
        // console.log(
        //   `第${i}次匹配，当前节点为：`,
        //   currentposi,
        //   "匹配ID为：",
        //   res[i]
        // );
        // 若当前遍历到的节点没有子节点
        console.log(`第${i}次查询的对象是:`, currentposi);
        if (currentposi.children.length !== 0) {
          currentposi = currentposi.children.find(item => {
            console.log("此次遍历到的子节点", item);
            console.log("currentMatcher", res[i]);
            return item.id === res[i];
          });
          console.log("此次遍历完毕", currentposi);
        }
      }
      console.log("循环结束", currentposi);
      return currentposi;
    },

    // 根据目标节点的level（可能会有重复，每层节点使用三位数标识路径，单）和id，获取落点位置的父元素target，添加到target的children之中。假设节点的level和id为['100','001','001'],为trees的children的第二个元素节点的第二个子元素节点，那么我们应该获取trees的children就够了
    // 传入一个节点ID，获取这个节点的父节点的引用
    // 节点的ID排序和节点的遍历没有关系
    // 0129更新：入参id更改为dom元素，通过dom节点的id来获取一个访问路径，形式为数组，再通过这个数组来获取虚拟DOM的引用
    findSupernodeById(htmlNode) {
      // let pattern = /(\d{3})/g;
      // let afterSplit = id.match(pattern);

      let res = this.getGenerationTree(htmlNode);
      console.log("回调开始", res);
      let currentposi = this.trees;
      console.log("trees", this.trees);
      // 生成id列表，表示新增节点落点位置的查找路径
      // for (let item of afterSplit) {
      //   nodeFullId = nodeFullId + item;
      //   res.push(nodeFullId);
      // }

      console.log("matcher", res);
      // 通过路径获取落点容器的引用,从最外层origin的children开始查找，找到数组的倒数第二位节点作容器，即length-2的元素节点并返回
      for (let i = 0; i < res.length - 1; i++) {
        // console.log(
        //   `第${i}次匹配，当前节点为：`,
        //   currentposi,
        //   "匹配ID为：",
        //   res[i]
        // );
        // 若当前遍历到的节点没有子节点
        console.log(`第${i}次查询的对象是:`, currentposi);
        if (currentposi.children.length !== 0) {
          currentposi = currentposi.children.find(item => {
            console.log("此次遍历到的子节点", item);
            console.log("currentMatcher", res[i]);
            return item.id === res[i];
          });
          console.log("此次遍历完毕", currentposi);
        }
      }
      console.log("循环结束", currentposi);
      return currentposi;

      // this.getGenerationTree(htmlNode).then(res => {
      //   console.log("回调开始", res);
      //   let currentposi = this.trees;
      //   console.log('trees',this.trees)
      //   // 生成id列表，表示新增节点落点位置的查找路径
      //   // for (let item of afterSplit) {
      //   //   nodeFullId = nodeFullId + item;
      //   //   res.push(nodeFullId);
      //   // }

      //   console.log("matcher", res);
      //   // 通过路径获取落点容器的引用,从最外层origin的children开始查找，找到数组的倒数第二位节点作容器，即length-2的元素节点并返回
      //   for (let i = 0; i < res.length; i++) {
      //     // console.log(
      //     //   `第${i}次匹配，当前节点为：`,
      //     //   currentposi,
      //     //   "匹配ID为：",
      //     //   res[i]
      //     // );
      //     // 若当前遍历到的节点没有子节点
      //     console.log(`第${i}次查询的对象是:`, currentposi)
      //     if (currentposi.children.length !== 0) {
      //       currentposi = currentposi.children.find(item => {
      //         console.log('此次遍历到的子节点', item)
      //         console.log("currentMatcher", res[i]);
      //         return item.id === res[i];
      //       });
      //       console.log('此次遍历完毕', currentposi)
      //     }
      //   }
      //   console.log('循环结束', currentposi)
      //   return currentposi;
      // });
      // let nodeFullId = "";

      // 初始化查找起点
    },
    // type: 1---insert,2---add,3---newline
    creatElementNode(type, id) {
      // 插入某个节点之后，为保持节点ID的易识别性和唯一性，id使用时间戳，深度使用level属性
      if (type === 1) {
        console.log(id);
        // this.range
      }
      // 添加新节点到文档最末,不涉及现有range对象的操作
      else if (type === 2) {
        // this.tree.children
        // let target = this.getDeepestNodeId(this.trees);
        // 获取到新实例的ID为 target.level*1+1
        // console.log("fetch", target, target.level);
        // 通过ID获取插入位置的引用

        let superNode = this.findSupernodeById(
          this.range.commonAncestorContainer.parentNode
        );
        console.log("父节点", superNode);
        // console.log("落点目标引用", superNode, superNode.children);
        // 装配新节点，标签名、文本值等应该从外边传进来才对
        // let setLevel = target.level * 1 + 1 + "";
        // let newChild = new elementNode("span", "待测试", {}, {}, []);
        // console.log("id", newChild.id);
        // superNode.children.push(newChild);
      }
      // 另起一行
      // else if(type===3) {
      // 新一行，创建一个块级节点P，在其中创建一个行内节点span，添加至第二级？暂定
      // }
    },

    // 监听删除操作，返回虚拟dom
    delectionLimit() {
      // 多次测试，这个函数完整运行时间在15MS之内，所以给他设了一个20MS的延迟，使range回退
      // console.time("-----------------timer--------------------");
      // const {commit} = this.$store;
      // console.log(
      //   "触发删除时的range",
      //   this.range,
      //   window.getSelection().getRangeAt(0)
      // );
      // 删除的场景：1：退格键，range跨节点/多文本删除 2：删除键
      // this.$store.commit("temptest", 10);
      console.log("事件对象", event);
      this.range = window.getSelection().getRangeAt(0);
      this.$store.commit("saveRangeBeforeTextChange", {
        rangeFactor: {
          startTextTankAncestorId: window.getSelection().getRangeAt(0)
            .startContainer.parentNode.id,
          startOffset: window.getSelection().getRangeAt(0).startOffset,
          endTextTankAncestorId: window.getSelection().getRangeAt(0)
            .endContainer.parentNode.id,
          endOffset: window.getSelection().getRangeAt(0).endOffset
        }
      });

      // console.log(this.$store.prevRange);
      // console.log()一个复杂类型（具有get、set属性）的值的时候，console.log展开看到的是这个变量当前的值，如果需要这个变量全部的属性，需要进行深拷贝，而JSON.stringify这种级别的深拷贝对不可枚举的部分和对象的方法本身不能实现序列化，需要比较麻烦的额外处理，所以如果只使用少量属性的话，建议单独取出如下
      let startContainer = this.range.startContainer;
      // this.rangeKeeper = startContainer;
      let startOffset = this.range.startOffset;
      console.log(
        startContainer,
        startOffset,
        this.range.commonAncestorContainer.parentNode
        // JSON.parse(JSON.stringify(window.getSelection().getRangeAt(0)))
        // JSON.stringify(window.getSelection().getRangeAt(0))
      );
      if (event.keyCode === 8) {
        // let rangeBeforeDel = window.getSelection().getRangeAt(0);
        console.log("删除操作，当前的range为", this.range);

        // 阻止删除的条件：只剩一个块级元素节点、该节点中只有一个起换行作用的元素节点BR
        if (
          // 当前受影响的节点是否是元素节点
          this.range.commonAncestorContainer.nodeType === 1 &&
          // 判断当前受影响的节点是否具有子节点
          this.range.commonAncestorContainer.children.length === 1 &&
          // 判断当前受影响的节点是否为树的第一个子节点
          this.range.commonAncestorContainer.children[0].nodeName === "BR"
        ) {
          console.log("???");
          event.preventDefault();
          console.log("事件对象", event);
          // event.returnValue = false;
          return false;
        } else {
          console.log("删除前的range", this.range);
          let currentOperateObj = this.range.commonAncestorContainer.parentNode;
          // 获取相应的虚拟dom的引用
          let target = this.findTargetNode(currentOperateObj);
          console.log("正在受影响的实例", target);
          let currentNodeValue = this.range.commonAncestorContainer.nodeValue;
          // if () {
          //   this
          // }
          // console.log(
          //   "删除后",
          //   currentNodeValue.substr(0, currentNodeValue.length - 1)
          // );
          // target.text = currentNodeValue.substr(0, currentNodeValue.length - 1); //keydown时使用
          // let prevRange = window.getSelection().getRangeAt(0);

          // console.log(range);
          // this.rangeForTextChange(startContainer, startOffset).then(res => {
          //   console.log("res", res);

          target.text = currentNodeValue; //keyup时使用
          // });
          setTimeout(() => {
            this.rangeForTextChange();
          }, 30);
          this.rangeForTextChange();
          // console.log("删除后的range", this.range);
          // console.log(currentNodeValue.length, currentNodeValue);
        }
        // this.rangeForTextChange();
        // if (
        //   event.keyCode === 8 &&
        //   currentNodeValue.length <= 0
        //   // (currentNodeValue.length <= 0 || this.trees.children.length === 0)
        // ) {
        //   console.log("已经被拦截", this.trees);
        //   event.preventDefault();
        //   // 0129 之前没有加return false，阻止默认事件无效，原因未知，加了之后有效了
        //   return false;
        // } else {
        //   console.log("未被拦截", this.trees);
        //   return false;
        // }
      }

      // console.log(
      //   "children",
      //   this.trees.children.length === 0,
      //   currentNodeValue.length === 0
      // );
      // // if (this.trees.children.length === 0) {
      // //   if (currentNodeValue.length === 0) {
      // //     event.preventDefault();
      // //     return;
      // //   }
      // //   return;
      // // } else {
      // //   return;
      // // }
      // this.selectBack(sss)
    },
    // isObject(value) {
    //   const type = typeof value;
    //   return value != null && (type == "object" || type == "function");
    // },
    // deepClone(obj, hash = new WeakMap()) {
    //   if (null == obj || "object" != typeof obj) return obj;
    //   let cloneObj;
    //   let Constructor = obj.constructor;
    //   console.log(1, Constructor);
    //   switch (Constructor) {
    //     case RegExp:
    //       cloneObj = new Constructor(obj);
    //       break;
    //     case Date:
    //       cloneObj = new Constructor(obj.getTime());
    //       break;
    //     default:
    //       if (hash.has(obj)) return hash.get(obj);
    //       cloneObj = new Constructor();
    //       hash.set(obj, cloneObj);
    //       console.log(2, hash.get(obj));
    //   }
    //   for (let key in obj) {
    //     console.log(3, key, cloneObj);
    //     cloneObj[key] = this.isObject(obj[key])
    //       ? this.deepClone(obj[key], hash)
    //       : obj[key];
    //     console.log(4, key, cloneObj[key]);
    //   }
    //   return cloneObj;
    // },

    rangeForTextChange() {
      let rangeAfter = this.$store.state.prevRangeFactor;
      console.log("rangeAfter", rangeAfter);
      let selection = window.getSelection();
      selection.removeAllRanges();
      let newRange = document.createRange();
      // // range对象，通常是this.range

      // 20200212,通过id获取文本节点的父元素节点
      let startTextTankAncestor = document.getElementById(
          rangeAfter.startTextTankAncestorId
        ),
        endTextTankAncestor = document.getElementById(
          rangeAfter.endTextTankAncestorId
        );
      console.log(startTextTankAncestor, endTextTankAncestor);
      let startContainer = startTextTankAncestor.childNodes[0];
      let endContainer = endTextTankAncestor.childNodes[0];

      // console.log("startContainer", startContainer);
      newRange.setStart(startContainer, rangeAfter.startOffset);
      newRange.setEnd(endContainer, rangeAfter.endOffset);
      // console.log(newRange.startContainer.parentNode);
      selection.addRange(newRange);

      // console.timeEnd("-----------------timer--------------------");
    },

    // 在进行文字修饰之前,选回range,但考虑到好像很少会使用execCommand,所以好像没必要
    selectBack(range) {
      // console.log('begin',window.getSelection())
      console.log("range入参", range);
      // let result =  document.execCommand('FormatBlock',false,'<h1>');
      return new Promise(res => {
        let selection = window.getSelection();
        selection.removeAllRanges();

        let range = document.createRange();
        // range对象，通常是this.range
        range.setStart(range.startContainer, range.startOffset);

        range.setEnd(range.endContainer, range.endOffset);

        selection.addRange(range);
        // this.$refs.wysiwys.focus();
        res();
      });

      // let result =  document.execCommand('FormatBlock',false,'<h1>');
      // console.log('result',result)
    },
    // 保存当前range
    saveRange() {
      if (window.getSelection().getRangeAt(0)) {
        this.range = window.getSelection().getRangeAt(0);
        console.log("leave", this.range);
      }
    },
    getInput() {
      // 删除、粘贴、剪切、退格，在这里执行删除操作
      // 使用剪贴板内容的时候，需要计算剪贴板内容的长度，然后再与startOffset作为新的startOffset
      this.range = window.getSelection().getRangeAt(0);
      console.log(this.range);
      this.worker = this.$refs.wysiwys.innerHTML;
      console.log(
        "in componnet",
        this.range.commonAncestorContainer.nodeValue,
        this.range.commonAncestorContainer.parentElement,
        "光标所在元素节点"
      );
      // this.trees.this // if
      // .$emit("input", event);
    },
    // 获取光标所在节点
    // 临时测试：文本末尾添加新元素

    getTargetNode() {
      //
      console.log("当前节点", event.target);

      this.range = window.getSelection().getRangeAt(0);
      console.log(this.range);
      this.creatElementNode(2);

      // 向上发送光标所在节点
      // this.$emit("focusOffsetChange", event.target);
    }
  }
};
</script>
<style lang="scss" scoped>
#theGhost {
  text-align: left;
  word-wrap: break-word;
  p {
    width: 100%;
    word-wrap: break-word;
  }
}
</style>
