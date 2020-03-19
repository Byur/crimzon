<template>
  <div
    id="theGhost"
    ref="wysiwys"
    v-html="innerText"
    contenteditable
    @input="catchInput"
    @keyup="delectionLimit"
    @keydown="getRange"
    @click="getRange"
    @compositionstart="start"
    @compositionend="end"
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
      // 20200219追加功能键键码列表
      // 其中可能会出现的问题有：不同浏览器小键盘和数字键的键码不一样，比如在numlock打开的情况下，谷歌浏览器小键盘0的键码和数字键0的键码是一样的，这点在IE上可能会不一样，因为另一份资料显示小键盘0的键码是96，数字键0是48；除此之外，delete键，键码46删除文本的按键，还没有做响应的事件，暂时不知道有没有必要做，等做好了键码屏蔽之后，将会进行测试,enter键未做屏蔽，将会用来断行，新建一个p元素
      funcKeyCodes: [
        112,
        113,
        114,
        115,
        116,
        117,
        118,
        119,
        120,
        121,
        122,
        123,
        124,
        125,
        126,
        127,
        128,
        129,
        130,
        131,
        132,
        133,
        134,
        135,
        136,
        137,
        144,
        9,
        12,
        16,
        17,
        18,
        19,
        20,
        27,
        33,
        34,
        35,
        36,
        37,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        46,
        47,
        91,
        93,
        229
      ],
      // 加减号、退格、空格、回车、删除,插入、数字键,229不知道是什么键
      funcKeyInCompositeMode: [
        229,
        187,
        189,
        8,
        32,
        13,
        48,
        49,
        50,
        51,
        52,
        53,
        54,
        55,
        56,
        57
      ],
      // 判断是否打开了输入法，true为直接输入，false为输入法输入
      directInput: true,
      // 临时存储输入法输入时键入的文字或词语
      wordKeeper: "",
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
    // innerText(val) {
    //   let i = document.getElementById("theGhost");
    //   console.log(val, i.childNodes);
    // },
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
    // debounce

    // events
    start() {
      console.log("-----------------start---------------------", event);

      this.directInput = false;
    },
    end() {
      console.log("-----------------end---------------------", event);
      this.wordKeeper = event.data;
      let currentOperateObj = this.range.commonAncestorContainer.parentNode;
      this.findTargetNode(currentOperateObj).then(res => {
        // console.log("莫非这才是正主", res);
        let target = res;
        // console.log("正在受影响的实例", target);
        let currentNodeValue = this.range.commonAncestorContainer.nodeValue;
        console.log(currentNodeValue);
        let startOffset = this.$store.state.prevRangeFactor.startOffset;
        console.log(
          this.wordKeeper,
          "--------预览结果------------",
          currentNodeValue.substring(0, startOffset) + this.wordKeeper
        );
        console.log(
          "准备工作",
          this.$store.state.prevRangeFactor.startTextTankAncestor
        );
        console.log(window.getSelection().getRangeAt(0));
        this.saveRange();
        target.text = currentNodeValue;
        console.log("结束工作", target.text);
        // console.log(window.getSelection().getRangeAt(0));
        this.rangeForTextChange(0);
        console.log(window.getSelection().getRangeAt(0));
        // this.wordKeeper = "";
        // console.log(target, this.trees);
      });
      this.directInput = true;
    },
    getRange() {
      console.log("keydown此时的range", window.getSelection().getRangeAt(0));
      // this.range = window.getSelection().getRangeAt(0);
      // 保存按键时的range
      if (this.directInput) {
        console.log("此刻是直接输入模式");
        this.saveRange();
      } else {
        console.log("此刻还是连续输入模式");
      }
      // this.saveRange();
      // if (event.keyCode === 32) {
      //   console.log("抓到你了");
      //   event.preventDefault();
      // }
      // console.log("按下按键", event.target);
    },
    catchInput() {
      // 删除、粘贴、剪切、退格，在这里执行删除操作
      // 使用剪贴板内容的时候，需要计算剪贴板内容的长度，然后再与startOffset作为新的startOffset
      console.log(
        "--------------------directInput------------------------",
        this.directInput
      );
      console.log("触发了input", event, window.getSelection().getRangeAt(0));
      // this.saveRange();
      // if ()
      // this.saveRange();
      // let currentOperateObj = this.range.commonAncestorContainer.parentNode;
      // // 获取相应的虚拟dom的引用
      // let target = this.findTargetNode(currentOperateObj);
      // console.log("正在受影响的实例", target);
      // let currentNodeValue = this.range.commonAncestorContainer.nodeValue;
      // target.text = currentNodeValue; //keyup时使用
      // // });

      // // 多次测试，这个函数完整运行时间在15MS之内，所以给他设了一个20MS的延迟，使range回退
      // setTimeout(() => {
      //   this.rangeForTextChange();
      // }, 30);
      // this.range = window.getSelection().getRangeAt(0);
      // this.saveRange()

      // this.$store.commit("saveRangeBeforeTextChange", {
      //   rangeFactor: {
      //     startTextTankAncestorId: window.getSelection().getRangeAt(0)
      //       .startContainer.parentNode.id,
      //     startOffset: window.getSelection().getRangeAt(0).startOffset,
      //     endTextTankAncestorId: window.getSelection().getRangeAt(0)
      //       .endContainer.parentNode.id,
      //     endOffset: window.getSelection().getRangeAt(0).endOffset
      //   }
      // });

      // let currentOperateObj = this.range.commonAncestorContainer.parentNode;
      // let target = this.findTargetNode(currentOperateObj);
      // console.log("正在受影响的实例", target);
      // let currentNodeValue = this.range.commonAncestorContainer.nodeValue;

      // target.text = currentNodeValue; //keyup时使用

      // setTimeout(() => {
      //   this.rangeForTextChange();
      // }, 30);

      // this.range = window.getSelection().getRangeAt(0);
      // console.log(this.range);
      // this.worker = this.$refs.wysiwys.innerHTML;
      // console.log(
      //   "in componnet",
      //   this.range.commonAncestorContainer.nodeValue,
      //   this.range.commonAncestorContainer.parentElement,
      //   "光标所在元素节点"
      // );
      // this.trees.this // if
      // .$emit("input", event);
    },

    /**
     * @event
     * keyup事件
     * @ignore 以下是开发日志：
     * 20200213:当前是监听退格键，预计改成监听按键事件，非特殊按键则认为是正常输入，用这个判断来识别退格、粘贴、剪切、删除和输入和类型
     *
     * 20200213，退格：退格操作简单分为三步：
     * 第一步是删除文档中的响应的文本节点，这时候视觉效果来看用户选择的文本已经被删除了，但虚拟dom中还是原来的样子，这里我们可以获取当前文档中，也就是表面删除后的range对象和文本节点；
     * 第二步是同步html文档和虚拟dom中相关实例的文本，这里需要通过第一步获取的文本节点的parentNode，也就是他所属的元素节点，通过接着元素节点找到虚拟dom中相应的实例、然后将文本节点的值赋值给这个实例的text属性；
     * 第三步是给第二步擦屁股，因为依赖更新之后，会引起浏览器的重绘，这个时候会出现焦点出现在文档流里编辑器区域的头部，所以我们需要使焦点出现在我们修改/删除后的文本的末尾，这一步操作需要将现有的range对象修改/替换为第一步提到的range对象。
     *
     * 20200213，正常输入
     * 输入和删除都会触发oninput事件，但这两者的不同之处在于输入场景的时候文本长度会变长，而删除的时候文本长度会变短，所以我想如果输入时要保持range对象，目标文本的前后文本长度是需要记录的，这里先假设keydown和keyup两个时刻文本长度会有变化，那恢复range的时候正确的startOffset和endOffset应该为：输入前的startOffset+（输入后的文本长度-输入前的文本长度）,这个公式一样可以应用于选中多文本的替换输入（或者粘贴）的场景。（经实测键盘事件不能获取到最深的文本节点所属的元素节点，因此将改为使用range的startContainer获取，为了简洁，可能要考虑将存ID改为保存节点本身）
     * 20200218 已经将英文的正常输入做好，现在由于部分不能输出字符的按键被触发的时候，会因为文本节点长度找不到range+1的位置，这点将在后续对功能键做屏蔽处理
     * 20200218 关于上面这点问题与中英文输入的结合，目前打算是输入法输入的时候将，在keydown事件里将空格键做一个意外处理屏蔽掉，然后
     *
     * ，判断keyCode等于8时触发，目前通过触发keyup事件触发，要使range位置返回原位，需要临时保存删除之后文档中所在的元素节点的ID，，暂时不需要额外参数
     */
    // 监听删除操作，返回虚拟dom
    async delectionLimit() {
      //
      // console.log(
      //   "松开按键时,vuex中的range",
      //   this.$store.state.prevRangeFactor
      // );

      console.time("-----------------timer--------------------");

      // 删除的场景：1：退格键，range跨节点/多文本删除 2：删除键

      /**
       * @readonly
       * 文本更新之后导致的视图刷新之后range位置重置，将当前焦点的range对象部分参数存入状态管理，然后在删除文本之后取出，新建一个range对象插回
       */
      console.log("事件对象", event);
      // this.range = window.getSelection().getRangeAt(0);
      // this.$store.commit("saveRangeBeforeTextChange", {
      //   rangeFactor: {
      //     startTextTankAncestor: window.getSelection().getRangeAt(0)
      //       .startContainer.parentNode,
      //     startOffset: window.getSelection().getRangeAt(0).startOffset,
      //     endTextTankAncestor: window.getSelection().getRangeAt(0).endContainer
      //       .parentNode,
      //     endOffset: window.getSelection().getRangeAt(0).endOffset
      //   }
      // });
      // console.log(this.$store.prevRange); // console.log()一个复杂类型（具有get、set属性）的值的时候，console.log展开看到的是这个变量当前的值，如果需要这个变量全部的属性，需要进行深拷贝，而JSON.stringify这种级别的深拷贝对不可枚举的部分和对象的方法本身不能实现序列化，需要比较麻烦的额外处理，所以如果只使用少量属性的话，建议单独取出如下，这里取出的startOffset是快照的数值而不是当前的数值
      // let startContainer = this.range.startContainer;
      // // this.rangeKeeper = startContainer;
      // let startOffset = this.range.startOffset;
      // console.log(
      //   startContainer,
      //   startOffset,
      //   this.range.commonAncestorContainer.parentNode
      //   // JSON.parse(JSON.stringify(window.getSelection().getRangeAt(0)))
      //   // JSON.stringify(window.getSelection().getRangeAt(0))
      // );
      // 直接输出模式，这时候的退格键会将文本删除

      if (this.funcKeyCodes.indexOf(event.keyCode) !== -1) {
        console.log(
          "-----------------------被屏蔽的键码是----------------",
          event.keyCode
        );
        return false;
      }
      if (this.directInput) {
        if (event.keyCode === 8) {
          // let rangeBeforeDel = window.getSelection().getRangeAt(0);
          // this.directInput = true;
          this.saveRange();
          console.log("删除操作，当前的range为", this.range);
          // 当一个p元素的文本刚好被删空的时候，其中会剩下一个br元素保持P元素在页面中的位置，如果继续删除，将会退回上一行，之后的页面中这个P元素就没有体积了，为了避免这点，当只剩一个块级元素节点时、当该节点中只有一个起换行作用的元素节点BR时，删除不应该触发，所以在这里阻止了默认事件的发生。
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
            let currentOperateObj = this.range.commonAncestorContainer
              .parentNode;
            // 获取相应的虚拟dom的引用
            this.findTargetNode(currentOperateObj).then(res => {
              // this.saveRange();
              let target = res;
              console.log("正在受影响的实例", target);
              let currentNodeValue = this.range.commonAncestorContainer
                .nodeValue;
              console.log("删除后的文本", currentNodeValue);
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

              console.log("删除后的range", this.range);
              // this.saveRange();
              // 多次测试，这个函数完整运行时间在15MS之内，所以给他设了一个20MS的延迟，使range回退
              setTimeout(() => {
                this.rangeForTextChange();
              }, 10);
              // this.rangeForTextChange();
              // console.log("删除后的range", this.range);
              // console.log(currentNodeValue.length, currentNodeValue);
            });
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
        } else {
          // console.log("正常输入", this.$store.state.prevRangeFactor);
          this.saveRange();
          console.log("keydown时刻的range", this.$store.state.prevRangeFactor);
          let currentOperateObj = this.range.commonAncestorContainer.parentNode;
          // 获取相应的虚拟dom的引用
          await this.findTargetNode(currentOperateObj).then(res => {
            let target = res;
            console.log("正在受影响的实例", target);
            let currentNodeValue = this.range.commonAncestorContainer.nodeValue;
            console.log(currentNodeValue);
            target.text = currentNodeValue;
            setTimeout(() => {
              this.rangeForTextChange();
            }, 0);
            return;
          });
          return;
          // this.rangeForTextChange();
          // // console.timeEnd(
          // //   "------------------------------timer-------------------"
          // // );
          // this.rangeForTextChange();
          // if (event.data) {

          // }
          // this.rangeForTextChange(1);
          // setTimeout(() => {
          //   this.rangeForTextChange(1);
          // }, 25);
        }
      } else {
        // keydown compositionstart input keyup compositionend
        console.log("当前为连续输入模式", event.keyCode);
        // 非直接输出模式，这时候退格键、回车键、加减、数字键将操作输入法，而不会影响已经同步了的文本,要做额外处理
        // 这里离应该做一个功能键的列表，当他们按下的时候，不做任何操作，return false就完事
        if (this.funcKeyInCompositeMode.indexOf(event.keyCode) !== -1) {
          console.log("连续输入模式下此次屏蔽的按键是", event.keyCode);
          return false;
        } else {
          console.log(
            "----------------------此时的wordKeeper----------------------",
            this.wordKeeper
          );
          if (this.wordKeeper) {
            // let currentOperateObj = this.range.commonAncestorContainer
            //   .parentNode;
            // 获取相应的虚拟dom的引用
            // this.findTargetNode(currentOperateObj).then(res => {
            //   console.log("莫非这才是正主", res);
            //   let target = res;
            //   console.log("正在受影响的实例", target);
            //   let currentNodeValue = this.range.commonAncestorContainer
            //     .nodeValue;
            //   console.log(currentNodeValue);
            // let startOffset = this.$store.state.prevRangeFactor.startOffset;
            // console.log(
            //   this.wordKeeper,
            //   "--------预览结果------------",
            //   currentNodeValue.substring(0, startOffset) + this.wordKeeper
            // );
            // console.log(
            //   "准备工作",
            //   this.$store.state.prevRangeFactor.startTextTankAncestor
            // );
            // target.text =
            //   currentNodeValue.substring(0, startOffset) + this.wordKeeper;
            // console.log("结束工作", target.text);
            // this.rangeForTextChange();
            // this.wordKeeper = "";
            // console.log(target, this.trees);
            // });
            // let target = this.findTargetNode(currentOperateObj);
          }
        }
      }
    },

    /**
     * @feature
     */
    // 获取一个从目标节点到id为origin的节点的列表,供findSupernodeById方法使用
    async getGenerationTree(htmlNode) {
      // console.log("入参：", htmlNode);
      this.currentPath = [];
      // 从数组头部加入冒泡顺序上的第一个元素节点id，这会导致最后一个也就是距离origin最近的子元素将会排在数组第一位
      this.currentPath.unshift(htmlNode.id);
      await this.getAncestorNode(htmlNode);
      console.log("获取到路径", this.currentPath);
      return await this.currentPath;
      // return new Promise((res, rej) => {
      //   // 重置路径准备重新检索

      //   res(this.currentPath);
      //   // rej()
      //   console.log(rej);
      // });
    },
    // 从target或者range对象中获取一个dom元素，根据该元素的ID来组成访问路径

    async getAncestorNode(htmlNode) {
      // let temparr =

      if (htmlNode.parentNode) {
        let upgradeNode = htmlNode.parentNode;
        if (upgradeNode.id == "origin") {
          console.log("应该停下来了", upgradeNode);
          return await upgradeNode;
        } else {
          // console.log("此次的dom元素", upgradeNode);
          // 获取这个元素节点的的父元素ID加入
          this.currentPath.unshift(upgradeNode.id);
          // console.log("递归中", this.currentPath);
          return await this.getAncestorNode(upgradeNode);
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
    async findTargetNode(htmlNode) {
      let res = await this.getGenerationTree(htmlNode);
      console.log("回调开始", res);
      let currentposi = this.trees;
      // console.log("trees", this.trees);
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
        // console.log(`第${i}次查询的对象是:`, currentposi);
        if (currentposi.children.length !== 0) {
          currentposi = currentposi.children.find(item => {
            // console.log("此次遍历到的子节点", item);
            // console.log("currentMatcher", res[i]);
            return item.id === res[i];
          });
          // console.log("此次遍历完毕", currentposi);
        }
      }
      // console.log("循环结束", currentposi);
      return await currentposi;
    },

    // 根据目标节点的level（可能会有重复，每层节点使用三位数标识路径，单）和id，获取落点位置的父元素target，添加到target的children之中。假设节点的level和id为['100','001','001'],为trees的children的第二个元素节点的第二个子元素节点，那么我们应该获取trees的children就够了
    // 传入一个节点ID，获取这个节点的父节点的引用
    // 节点的ID排序和节点的遍历没有关系
    // 0129更新：入参id更改为dom元素，通过dom节点的id来获取一个访问路径，形式为数组，再通过这个数组来获取虚拟DOM的引用
    findSupernodeById(htmlNode) {
      // let pattern = /(\d{3})/g;
      // let afterSplit = id.match(pattern);

      let res = this.getGenerationTree(htmlNode);
      // console.log("回调开始", res);
      let currentposi = this.trees;
      // console.log("trees", this.trees);
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
        // let superNode = this.findSupernodeById(
        //   this.range.commonAncestorContainer.parentNode
        // );
        // console.log("父节点", superNode);
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
    // 20200218添加补正参数startOffsetChange和endOffsetChange，用于在直接输入和输入法输入包括剪切粘贴的时候，把range调整到合理的位置
    rangeForTextChange(offsetFluctuation = 0) {
      let rangeAfter = this.$store.state.prevRangeFactor;
      console.log("rangeAfter", rangeAfter);
      let selection = window.getSelection();
      let newRange = document.createRange();
      // // range对象，通常是this.range

      // 20200212,通过id获取文本节点的父元素节点
      let startTextTankAncestor = document.getElementById(
          rangeAfter.startTextTankAncestor.id
        ),
        endTextTankAncestor = document.getElementById(
          rangeAfter.endTextTankAncestor.id
        );
      // console.log(startTextTankAncestor, endTextTankAncestor);
      let startContainer = startTextTankAncestor.childNodes[0];
      let endContainer = endTextTankAncestor.childNodes[0];

      // console.log("startContainer", startContainer);
      newRange.setStart(
        startContainer,
        rangeAfter.startOffset + offsetFluctuation
      );
      newRange.setEnd(endContainer, rangeAfter.endOffset + offsetFluctuation);
      // console.log(newRange.startContainer.parentNode);
      selection.removeAllRanges();
      selection.addRange(newRange);

      console.timeEnd("-----------------timer--------------------");
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

    // 保存range要素至data和vuex
    saveRange() {
      if (window.getSelection().getRangeAt(0)) {
        this.range = window.getSelection().getRangeAt(0);
        console.log("saved", this.range);
        this.$store.commit("saveRangeBeforeTextChange", {
          rangeFactor: {
            startTextTankAncestor: window.getSelection().getRangeAt(0)
              .startContainer.parentNode,
            startOffset: window.getSelection().getRangeAt(0).startOffset,
            endTextTankAncestor: window.getSelection().getRangeAt(0)
              .endContainer.parentNode,
            endOffset: window.getSelection().getRangeAt(0).endOffset
          }
        });
        console.log(this.$store.state.prevRangeFactor);
      }
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
