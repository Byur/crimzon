<template>
  <div class="container">
    <div class="stacklogs">
      <span>undo-stack:{{ undoLength }}</span>
      <br />
      <span>redo-stack:{{ redoLength }}</span>
    </div>
    <div class="toolbar_simple">
      <div class="cell" @click="actionUndo">
        <i class="iconfont icon icon-ziyuan1"></i>
      </div>
      <div class="cell" @click="actionRedo">
        <i class="iconfont icon icon-ziyuan"></i>
      </div>
      <div
        class="cell"
        v-for="(item, index) in toolBar"
        :key="item.name"
        @click="setStyle(index)"
      >
        <i :class="item.srcClass"></i>
      </div>
    </div>
    <!-- <div class="toolbar_fullpower"></div> -->
    <!-- @click="saveRange" -->
    <div
      id="theGhost"
      ref="wysiwys"
      v-html="innerText"
      contenteditable
      @beforepaste="handleBeforePaste"
      @paste="handlePasteAction"
      @input="catchInput"
      @keydown="handlerInput"
      @keypress="donothing"
      @compositionstart="start"
      @compositionend="end"
      @compositionupdate="watcher"
      @click="checkRange"
      @mouseup="checkRangeWhenNoCollapsed"
      @mouseleave="checkRangeWhenNoCollapsed"
    ></div>
  </div>
</template>
<script>
import ElementNode from "../baseclass/tags";
import {
  // saveRange,
  rangeForTextChange,
  findTargetNode
  // saveRange
} from "../api/corefunctions";
import {
  // backspace,
  // enter,
  // regularInput,
  // overwriteRangeInput,
  refinedNodesByRange_stage1,
  refinedNodesByRange_stage2
} from "../api/refinement";
import { regularInput, overwriteRangeInput } from "../api/handleInputEvent";
import enter from "../api/handleBreakLine";
import backspace from "../api/handleBackSpace";
import { getStack, saveStack } from "../api/stack";
import { redirectRange, isAllActivated } from "../api/corefunctions";
import { toolBar } from "./toolBar";
let _ = require("lodash");
export default {
  // @mouseleave="checkRange"
  // @mousedown="getTarget"
  // @mouseup="getTarget"
  async created() {
    this.store = this.$store;
    this.init();
  },
  mounted() {
    this.toolBar.push(...toolBar);
  },
  data() {
    return {
      toolBar: [],
      // 0521抽象化进程:将外部api文件中的this脱出
      store: {},
      // 20200416,开始插入toolbar概念,追加安静制图机,首先提供的参数效果不能互相覆盖,经整理,只修改样式,不对布局(指视觉上的,实际上只要影响了range,都会造成布局改变)造成影响的可修改项目前有:粗体(fontweight),斜体(italic),删除线(through-line),下划线(underline),突出(bgc),颜色(color),字号(fontsize),边框(border),上下标(vertical-align:super/sub),字体,格式刷,清除格式;
      theSilentCartoGrapher: {
        // 字体颜色
        color: "#000000",
        // 删除线(through-line),下划线(underline),上划线,暂时支持underline
        "text-decoration": "none",
        // 突出标记
        "background-color": "",
        // 切换斜体italic||normal
        "font-style": "",
        // 字号
        "font-size": "",
        // 边框
        border: "",
        // 粗体
        "font-weight": ""
      },
      insertNewElementNode: false,
      // 色盘,暂不支持
      colorBar: [],

      // 20200404,追加输入锁,在连续输入（使用输入法）转为直接输入一段时间之内,按键事件所触发的输入事件无效。
      // 输入锁：this.directInput由false转为true时,
      // 本来想使用栈的概念去判断栈顶和next栈之间的关系,来决定是否启用这个锁,但因为栈的概念还没弄清楚,暂时放置'
      // inputLock: false,
      // inputLockTimer: null,

      // 20200219追加功能键键码列表
      // 其中可能会出现的问题有：不同浏览器小键盘和数字键的键码不一样,比如在numlock打开的情况下,谷歌浏览器小键盘0的键码和数字键0的键码是一样的,这点在IE上可能会不一样,因为另一份资料显示小键盘0的键码是96,数字键0是48；除此之外,delete键,键码46删除文本的按键,还没有做响应的事件,暂时不知道有没有必要做,等做好了键码屏蔽之后,将会进行测试,enter键未做屏蔽,将会用来断行,新建一个p元素
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
        8, // 删除
        9,
        12,
        13, // 空格
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
      // 当前判断是否打开了输入法,true为直接输入,false为输入法输入
      directInput: true,
      // 上一次触发按键时的输入模式
      lastStackInputMode: 0,

      // 临时存储输入法输入时键入的文字或词语
      wordKeeper: "",
      // rangeKeeper: {},
      range: {},
      currentRange: {},
      worker: "",
      innerText: "",
      // 用于保存上一步的配置,通过后退触发,可前进,暂不开发
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
  computed: {
    undoLength: function() {
      return this.$store.state.normalStack.length;
    },
    redoLength: function() {
      return this.$store.state.historyStack.length;
    }
  },
  watch: {
    // innerText(val) {
    //   let i = document.getElementById("theGhost");
    //   console.log(val, i.childNodes);
    // },
    // directInput(val) {
    //   // 如果更改后的值变为true,则证明之前为false(连续输入),将使输入锁短暂开启
    //   if (val) {
    //     if (this.inputLockTimer === null) {
    //       console.log("现在开启输入锁");
    //       this.inputLock = true;
    //       this.inputLockTimer = setTimeout(() => {
    //         console.log("现在关闭输入锁");
    //         this.inputLock = false;
    //         this.inputLockTimer = null;
    //       }, 200);
    //     }
    //   }
    // },
    theSilentCartoGrapher: {
      handler(val) {
        console.log("有内鬼，终止交易", val);
      },
      deep: true
    },
    trees: {
      handler(val) {
        this.innerText = val.toString();
        // setTimeout(() => {
        //   this.rangeForTextChange();
        //   console.log("------------------------------------------------trees watcher", val);
        // }, 10);
      },
      deep: true
    },
    range: {
      handler(val) {
        if (val.watcherTrigger !== "OFF") {
          console.log("watch range", val);
          this.checkStyle();
          return;
        }
        console.log(
          "-------------------------本次不检测toolbar状态------------------------"
        );
      },
      deep: true
    }
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
  //     return this.store.state.
  //   }
  // },
  methods: {
    checkRangeWhenNoCollapsed: _.debounce(function() {
      if (this.range && !this.range.collapsed) {
        this.saveRange();
      }
      return;
    }, 50),
    checkRange: _.debounce(function() {
      this.saveRange();
    }, 50),
    setStyle(index) {
      const buttonName = this.toolBar[index].buttonName;
      console.log(buttonName);
      // this.saveRange();
      const res = this.checkStyle();
      console.log("ready to setStyle", _.cloneDeep(res.receive));
      let elementList_Stage2 = [];
      // 精修
      switch (res.type) {
        case "spanParas":
          elementList_Stage2 = refinedNodesByRange_stage2.spanParas(
            res.receive,
            this.trees,
            this.range,
            this.$store
          );
          break;
        case "spanSpans":
          elementList_Stage2 = refinedNodesByRange_stage2.spanSpans(
            res.receive,
            this.trees,
            this.range,
            this.$store
          );
          break;
        case "withinSingleSpan":
          elementList_Stage2 = refinedNodesByRange_stage2.withinSingleSpan(
            res.receive,
            this.trees,
            this.range,
            this.$store
          );
          break;
        case "scenePointMode":
          elementList_Stage2 = refinedNodesByRange_stage2.scenePointMode(
            // res.receive,
            this.trees,
            this.range,
            this.$store
            // this.theSilentCartoGrapher,
          );
          break;
        default:
          console.log("default", res.type);
          break;
      }
      // 涉及到页面重排
      if (res.type !== "scenePointMode") {
        console.log("elementList_Stage2 from core", elementList_Stage2);
        this.toolBar[index].changeStyle(elementList_Stage2);
        setTimeout(() => {
          // rangeForTextChange(this.$store);
          // window.sleep()
          this.saveRange();
          // this.range.watcherTrigger = "ON";
        }, 0);
        return;
      }
      // 改变当前theSilentCartoGrapher的配置,不涉及重排,在此之后的下一次输入，将使用新配置;
      console.log("scenePointMode");
      // this.theSilentCartoGrapher = elementList_Stage2[0].style;
      this.toolBar[index].changeStyle(res.receive, this.theSilentCartoGrapher);
      setTimeout(() => {
        // rangeForTextChange(this.$store);
        // window.sleep()
        this.range.watcherTrigger = "OFF";
      }, 0);
      return;
    },
    checkStyle() {
      // 不闭合，rangeMode,涉及文本改动
      let receive = [];
      if (!this.range.collapsed) {
        if (this.range.commonAncestorContainer.id === "origin") {
          // return paragraphs
          console.log(
            "test spanParas after watch",
            this.range.startContainer,
            this.range.endContainer
          );
          receive = refinedNodesByRange_stage1.spanParas(
            this.trees,
            this.range
          );
          console.log("spanParas", receive);
          toolBar.forEach(item => {
            console.log("item", item);
            const boolean = isAllActivated(receive, item.cssAttr);
            console.log("inside vue instance", boolean);
            item.isActived(boolean);
          });
          return { receive, type: "spanParas" };
        } else if (
          this.range.commonAncestorContainer.tagName === "P" &&
          this.range.startContainer !== this.range.endContainer
        ) {
          receive = refinedNodesByRange_stage1.spanSpans(
            this.trees,
            this.range
          );
          console.log("spanSpans", receive);
          toolBar.forEach(item => {
            console.log("item", item);
            const boolean = isAllActivated(receive, item.cssAttr);
            console.log("inside vue instance", boolean);
            item.isActived(boolean);
          });
          return { receive, type: "spanSpans" };
        } else if (this.range.startContainer === this.range.endContainer) {
          receive = refinedNodesByRange_stage1.withinSingleSpan(
            this.trees,
            this.range
          );
          console.log("withinSingleSpan from core", receive);
          toolBar.forEach(item => {
            console.log("item", item);
            const boolean = isAllActivated(receive, item.cssAttr);
            console.log("inside vue instance", boolean);
            item.isActived(boolean);
          });
          return { receive, type: "withinSingleSpan" };
          // return span which text in
        }
      }
      // 闭合，pointMode,不涉及文本改动;
      else {
        receive = refinedNodesByRange_stage1.scenePointMode(
          this.trees,
          this.range
        );
        console.log("scenePointMode IN CHECK STYLE", receive);

        toolBar.forEach(item => {
          console.log("item", item);
          const boolean = isAllActivated(receive, item.cssAttr);
          console.log("inside vue instance", boolean);
          item.isActived(boolean);
        });
        // if (receive[0] && receive[0].style) {
        //   this.theSilentCartoGrapher = receive[0].style;
        // }
        // 添加当前
        return { receive, type: "scenePointMode" };
      }
    },
    // debounce

    // events
    donothing(event) {
      event.preventDefault();
      // console.log("被阻止了");
      return;
    },
    actionUndo() {
      // 0527修改了半潜在缺陷:由于getStack(this.$store, "undo")所获取的top被直接赋值给trees,使得渲染中的trees与store中normal的栈顶引用了同一个栈内存地址,因此在keyupkeydown等事件修改this.trees时,也修改了原则上只读的stack栈顶,并且在之后被压入第二位,栈顶被event最后的saveStack取代,导致出现栈顶而第二个栈的trees一样的缺陷,特在此,使用cloneDeep将getStack深拷贝再让trees使用,割裂他们(trees和stack)之间的引用关系
      const afterUndo = _.cloneDeep(getStack(this.$store, "undo"));
      // console.log(
      //   "actionUndo---------------------------------------------",
      //   afterUndo.trees.children[0].children[1].text,
      //   "\nrange",
      //   afterUndo.range.startOffset
      // );
      this.trees = afterUndo.trees;
      setTimeout(() => {
        redirectRange(this.$store, afterUndo.range);
      }, 0);
    },
    actionRedo() {
      const afterRedo = _.cloneDeep(getStack(this.$store, "redo"));
      this.trees = afterRedo.trees;
      setTimeout(() => {
        redirectRange(this.$store, afterRedo.range);
      }, 0);
    },
    // 输入动作触发顺序compositionstart-input-compositionend
    watcher() {
      console.log("旅の途中", event);
    },
    start() {
      console.log("-----------------start---------------------", event);

      if (this.range.watcherTrigger !== "OFF") {
        this.saveRange();
      }
      this.directInput = false;
    },
    // end: _.debounce(function(event) {
    end() {
      console.log("-----------------end---------------------", event);
      this.wordKeeper = event.data;
      console.log("saveRange from core：keydown", this.range);
      const currentRange = this.range;
      const pointMode = currentRange.collapsed;

      if (pointMode) {
        event.stopImmediatePropagation();
        event.preventDefault();
        regularInput.sceneComposiveMode(
          this.wordKeeper,
          _.cloneDeep(this.theSilentCartoGrapher),
          this.range,
          this.trees,
          this.$store
        );
        setTimeout(() => {
          this.saveRange();
          this.directInput = true;
          this.range.watcherTrigger = "ON";
          console.log("刷新外部range", this.range);
        }, 5);
        return;
      } else {
        event.stopImmediatePropagation();
        event.preventDefault();
        console.log("非常规--连续输入");
        if (currentRange.commonAncestorContainer.id === "origin") {
          overwriteRangeInput.sceneDirectMode.spanParas(
            this.wordKeeper,
            this.range,
            this.trees,
            this.$store
          );
          // 这个状态应该作为局部状态，封装在某个被共同引用的js文件中，后续将补充
          this.directInput = true;
          return;
        } else if (
          currentRange.commonAncestorContainer.tagName === "P" &&
          currentRange.startContainer !== currentRange.endContainer
        ) {
          console.log("from core", currentRange);
          overwriteRangeInput.sceneComposiveMode.spanSpans(
            this.wordKeeper,
            _.cloneDeep(this.theSilentCartoGrapher),
            this.range,
            this.trees,
            this.$store
          );
          this.directInput = true;
          return;
        } else if (currentRange.startContainer === currentRange.endContainer) {
          overwriteRangeInput.sceneDirectMode.withinSingleSpan(
            this.wordKeeper,
            this.range,
            this.trees,
            this.$store
          );

          this.directInput = true;
          return;
        } else {
          console.log("意料之外的range", currentRange);
          return;
        }
      }
    },
    // }, 1000),

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
      // 删除、粘贴、剪切、退格,在这里执行删除操作
      // 使用剪贴板内容的时候,需要计算剪贴板内容的长度,然后再与startOffset作为新的startOffset
    },
    // handlerInput: _.throttle(async function(event) {
    async handlerInput() {
      // event.stopImmediatePropagation();
      // event.preventDefault();
      // if (this.funcKeyCodes.indexOf(event.keyCode) !== -1) {
      console.log(
        "___________________________________throttle",
        event.target,
        event.keyCode,
        this.directInput
      );
      // } else {
      //   console.log(event.key)
      // }
      // console.log("未被屏蔽的事件", event);
      // partAText
      // const partAText = target.text.substr(0, this.range.startOffset);
      // partBText
      // const partBText = target.text.substr(this.range.endOffset,target.text.length); // 作用于同一文本节点时
      if (this.directInput) {
        // console.log("")
        if (this.range.watcherTrigger !== "OFF") {
          this.saveRange();
        }
        // 判断场景
        // 焦点:段首,段末.文本节点中
        // 选区: 跨text,跨span,跨P
        // const inSameTextNode =
        //   this.range.commonAncestorContainer.nodeType === 3 &&
        //   this.range.startContainer === this.range.endContainer;

        console.log("saveRange from core：keydown", this.range);
        const currentRange = this.range;
        const pointMode = currentRange.collapsed;
        // 判定为焦点模式
        if (pointMode) {
          if (this.funcKeyCodes.indexOf(event.keyCode) === -1) {
            event.stopImmediatePropagation();
            event.preventDefault();
            console.log("常规输入", event.key);
            const keyData = event.key;
            // _.throttle(()=>{
            regularInput.sceneDirectMode(
              keyData,
              _.cloneDeep(this.theSilentCartoGrapher),
              this.range,
              this.trees,
              this.$store
            );
            setTimeout(() => {
              this.saveRange();
              this.range.watcherTrigger = "ON";
              console.log("刷新外部range", this.range);
            }, 50);
            return;
            // }, 20)();
          } else {
            if (currentRange.commonAncestorContainer.nodeType === 3) {
              // 被焦点分割的前后两部分文本

              if (event.keyCode === 8) {
                event.stopImmediatePropagation();
                event.preventDefault();
                backspace.scenePointMode(currentRange, this.trees, this.$store);
                // // 暂不处理
                return;
              } else if (event.keyCode === 13) {
                event.stopImmediatePropagation();
                event.preventDefault();
                enter.scenePointMode(currentRange, this.trees, this.$store);
                return;
              }
            } else {
              console.log("from core:当前没有选中文本节点");
              if (event.keyCode === 8) {
                event.stopImmediatePropagation();
                event.preventDefault();
                backspace.sceneOutOfException1(
                  currentRange,
                  this.trees,
                  this.$store
                );
                return;
              } else if (event.keyCode === 13) {
                enter.sceneOutOfException1(
                  currentRange,
                  this.trees,
                  this.$store
                );
                return;
              }
            }
          }
          // currentRange.commonAncestorContainer.nodeType === 3应该是覆盖了所有的场景,但还不确定
        } else {
          // 判定为选区模式
          // 跨P选取
          console.log(
            "不在同一个文本节点内",
            currentRange.startContainer,
            currentRange.endContainer
          );
          if (currentRange.commonAncestorContainer.id === "origin") {
            if (this.funcKeyCodes.indexOf(event.keyCode) === -1) {
              event.stopImmediatePropagation();
              event.preventDefault();
              console.log("非常规输入", event.key);
              const keyData = event.key;
              // _.throttle(()=>{
              overwriteRangeInput.sceneDirectMode.spanParas(
                keyData,
                this.range,
                this.trees,
                this.$store
              );
              return;
              // }, 20)();
            } else if (event.keyCode === 8) {
              event.stopImmediatePropagation();
              event.preventDefault();
              backspace.sceneRangeMode.spanParas(
                currentRange,
                this.trees,
                this.$store
              );
              return;
            } else if (event.keyCode === 13) {
              event.stopImmediatePropagation();
              event.preventDefault();
              enter.sceneRangeMode.spanParas(
                currentRange,
                this.trees,
                this.$store
              );
              return;
            }
          }
          // 跨span选取
          // 涉及同P节点内多个span的文本的选取,在此种场景下换行时,应删除被选取的文本,在startContainer的父节点之后进行切割,剩余部分的节点装在到新的P中,插入到startContainer所属的P节点的下一个
          else if (
            currentRange.commonAncestorContainer.tagName === "P" &&
            currentRange.startContainer !== currentRange.endContainer
          ) {
            if (this.funcKeyCodes.indexOf(event.keyCode) === -1) {
              event.stopImmediatePropagation();
              event.preventDefault();
              console.log("非常规输入", event.key);
              const keyData = event.key;
              // _.throttle(()=>{
              overwriteRangeInput.sceneDirectMode.spanSpans(
                keyData,
                this.range,
                this.trees,
                this.$store
              );
              return;
              // }, 20)();
            } else if (event.keyCode === 8) {
              event.stopImmediatePropagation();
              event.preventDefault();
              backspace.sceneRangeMode.spanSpans(
                currentRange,
                this.trees,
                this.$store
              );
              return;
            } else if (event.keyCode === 13) {
              event.stopImmediatePropagation();
              event.preventDefault();
              console.log("跨span选取");
              // 修改partA实例
              enter.sceneRangeMode.spanSpans(
                currentRange,
                this.trees,
                this.$store
              );
              return;
            }
          }
          // 选中一个text节点中的全部或者部分文本
          // 当pointMode为false且currentRange.startContainer === currentRange.endContainer时,则可说明startOffset !== endOffset
          else if (currentRange.startContainer === currentRange.endContainer) {
            if (this.funcKeyCodes.indexOf(event.keyCode) === -1) {
              event.stopImmediatePropagation();
              event.preventDefault();
              console.log("非常规输入", event.key);
              const keyData = event.key;
              // _.throttle(()=>{
              overwriteRangeInput.sceneDirectMode.withinSingleSpan(
                keyData,
                this.range,
                this.trees,
                this.$store
              );
              return;
              // }, 20)();
            } else if (event.keyCode === 8) {
              event.stopImmediatePropagation();
              event.preventDefault();
              backspace.sceneRangeMode.withinSingleSpan(
                currentRange,
                this.trees,
                this.$store
              );
              return;
            } else if (event.keyCode === 13) {
              event.stopImmediatePropagation();
              event.preventDefault();
              enter.sceneRangeMode.withinSingleSpan(
                currentRange,
                this.trees,
                this.$store
              );
              return;
            }
          }
          return;
        }
      }
    },
    // }, 2000),

    /**
     * @event
     * 粘贴前的操作,可用于拦截默认事件进行敏感词过滤等
     */
    testArraypush() {
      this.store.commit("testArrayPush", "酸菜宇");
    },
    handleBeforePaste() {
      return;
    },
    /**
     * @event
     * 粘贴动作发生时的事件，包含了右键菜单栏复制和ctrl+v键，该处调用剪贴板api，但因为不需要对默认事件做出干涉，所以应该不需要考虑兼容性的问题，这里需要做的是把粘贴内容真正嵌入data中并且更新range
     */
    handlePasteAction() {
      event.preventDefault();
      this.saveRange();
      console.log("paste此时的range", this.range);
      console.time("-----when paste-----");
      // 0416以下是带格式渲染的时候,从外部粘贴进来的文本所展示的结构,比如说从word或者excel粘贴文本进去,会跟粘贴一般文本有很大不同,当前无力完成,日后也许将作为一个拓展功能点追加
      // console.log("复制事件:文本格式", event.clipboardData.getData("text/plain"));
      // console.log("复制事件:绘本格式", event.clipboardData.getData("text/html"));

      const strFromCopy = event.clipboardData.getData("text");
      // this.saveRange();

      let currentOperateObj = this.range.commonAncestorContainer.parentNode;
      // 获取相应的虚拟dom的引用
      this.findTargetNode(currentOperateObj).then(async res => {
        let target = res;
        console.log("正在受影响的实例", target);
        // this.saveRange();
        let currentNodeValue = this.range.commonAncestorContainer.nodeValue;
        console.error("--------修改值---------", currentNodeValue);
        target.text = currentNodeValue + strFromCopy;
        // this.rangeForTextChange();
        setTimeout(() => {
          this.rangeForTextChange(strFromCopy.length);
        }, 3);
        console.timeEnd("-----when paste-----");
        return;
      });
    },
    /**
     * @event
     * keyup事件
     * @ignore 以下是开发日志：
     * 20200213:当前是监听退格键,预计改成监听按键事件,非特殊按键则认为是正常输入,用这个判断来识别退格、粘贴、剪切、删除和输入和类型
     *
     * 20200213,退格：退格操作简单分为三步：
     * 第一步是删除文档中的响应的文本节点,这时候视觉效果来看用户选择的文本已经被删除了,但虚拟dom中还是原来的样子,这里我们可以获取当前文档中,也就是表面删除后的range对象和文本节点；
     * 第二步是同步html文档和虚拟dom中相关实例的文本,这里需要通过第一步获取的文本节点的parentNode,也就是他所属的元素节点,通过接着元素节点找到虚拟dom中相应的实例、然后将文本节点的值赋值给这个实例的text属性；
     * 第三步是给第二步擦屁股,因为依赖更新之后,会引起浏览器的重绘,这个时候会出现焦点出现在文档流里编辑器区域的头部,所以我们需要使焦点出现在我们修改/删除后的文本的末尾,这一步操作需要将现有的range对象修改/替换为第一步提到的range对象。
     *
     * 20200213,正常输入
     * 输入和删除都会触发oninput事件,但这两者的不同之处在于输入场景的时候文本长度会变长,而删除的时候文本长度会变短,所以我想如果输入时要保持range对象,目标文本的前后文本长度是需要记录的,这里先假设keydown和keyup两个时刻文本长度会有变化,那恢复range的时候正确的startOffset和endOffset应该为：输入前的startOffset+（输入后的文本长度-输入前的文本长度）,这个公式一样可以应用于选中多文本的替换输入（或者粘贴）的场景。（经实测键盘事件不能获取到最深的文本节点所属的元素节点,因此将改为使用range的startContainer获取,为了简洁,可能要考虑将存ID改为保存节点本身）
     * 20200218 已经将英文的正常输入做好,现在由于部分不能输出字符的按键被触发的时候,会因为文本节点长度找不到range+1的位置,这点将在后续对功能键做屏蔽处理
     * 20200218 关于上面这点问题与中英文输入的结合,目前打算是输入法输入的时候将,在keydown事件里将空格键做一个意外处理屏蔽掉,然后
     *
     * ,判断keyCode等于8时触发,目前通过触发keyup事件触发,要使range位置返回原位,需要临时保存删除之后文档中所在的元素节点的ID,,暂时不需要额外参数
     */
    // 监听删除操作,返回虚拟dom
    // 0320,使用debounce,应对连续输入状况150毫秒延迟后触发一次,若间隔小于150,将重置计时
    delectionLimit: _.debounce(async function(event) {
      // console.time("-----timer-----\n");
      // 删除的场景：1：退格键,range跨节点/多文本删除 2：删除键

      /**
       * @readonly
       * 文本更新之后导致的视图刷新之后range位置重置,将当前焦点的range对象部分参数存入状态管理,然后在删除文本之后取出,新建一个range对象插回
       */
      // console.log("事件对象", event, this.directInput);
      // this.range = window.getSelection().getRangeAt(0);
      // this.store.commit('actionUndo')("saveRangeBeforeTextChange", {
      //   rangeFactor: {
      //     startTextTankAncestor: window.getSelection().getRangeAt(0)
      //       .startContainer.parentNode,
      //     startOffset: window.getSelection().getRangeAt(0).startOffset,
      //     endTextTankAncestor: window.getSelection().getRangeAt(0).endContainer
      //       .parentNode,
      //     endOffset: window.getSelection().getRangeAt(0).endOffset
      //   }
      // });
      // console.log(this.store.prevRange);
      // console.log()一个复杂类型（具有get、set属性）的值的时候,在chrome里console.log展开看到的是这个变量当前的值而不是代码执行时的快照,如果需要这个变量全部的属性,需要进行深拷贝,而JSON.stringify这种级别的深拷贝对不可枚举的部分和对象的方法本身不能实现序列化,需要比较麻烦的额外处理,所以如果只使用少量属性的话,建议单独取出如下,这里取出的startOffset是快照的数值而不是当前的数值
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
      // 直接输出模式,这时候的退格键会将文本删除

      if (this.funcKeyCodes.indexOf(event.keyCode) !== -1) {
        console.log(
          "-----------------------keyup被屏蔽的键码是----------------",
          event.keyCode
        );
        event.preventDefault();
        return false;
      }
      if (this.directInput) {
        if (event.keyCode === 8) {
          event.preventDefault();
          return;
        } else {
          // this.saveRange();
          console.log("keyup时刻的range", this.store.state.prevRangeFactor);
          // regularInput.sceneDirectMode(this.range, this.trees, this.$store);
          // let currentOperateObj = this.range.commonAncestorContainer.parentNode;
          // // 0419有一个问题在于,当一个P级元素删除晚全部文本后,确实是会留下一个br站位保持换行,但是在此基础上新添加的文本是不在span标签中的,因而会对后续的trees造成影响,因此在这里追加一个判断,当currentOperateObj不为span时,创造一个span添加到P里
          // // 获取相应的虚拟dom的引用
          // this.findTargetNode(currentOperateObj,this.trees).then(async res => {
          //   // 若res不是个用于装载文本的节点,他将会是个P级节点,由上一个注释可知,在P级节点中编辑文本,重排时依然会保留用于占位的br节点,因此在下面做了一个判断,当p级节点但只有一个子节点并且这个节点为br时,将删除这个节点并且新增一个span节点手动插入
          //   console.log("-----------按键松开后的range所在的父级元素节点", res);
          //   if (res.tag !== "span") {
          //     if (res.children.length === 1 && res.children[0].tag === "br") {
          //       res.children.pop();
          //     }
          //     const span = await new ElementNode(
          //       "span",
          //       this.range.commonAncestorContainer.nodeValue
          //     );
          //     // 0424 追加父节点属性parent
          //     span.parent = res;
          //     res.children.push(span);
          //     setTimeout(() => {
          //       this.rangeForTextChange();
          //       // console.timeEnd("-----timer-----\n");
          //     }, 5);
          //     return;
          //   }
          //   let target = res;
          //   // console.log("正在受影响的实例", target);
          //   let currentNodeValue = this.range.commonAncestorContainer.nodeValue;
          //   // console.error("--------修改值---------", currentNodeValue);
          //   target.text = currentNodeValue;
          //   // this.rangeForTextChange();
          //   setTimeout(() => {
          //     this.rangeForTextChange();
          //     // console.timeEnd("-----timer-----\n");
          //   }, 3);
          //   return;
          // });
          return;
        }
      } else {
        // keydown compositionstart input keyup compositionend
        console.log("当前为连续输入模式", event.keyCode);
        // event.stopImmediatePropagation();
        // event.preventDefault();
        // 非直接输出模式,这时候退格键、回车键、加减、数字键将操作输入法,而不会影响已经同步了的文本,要做额外处理
        // 这里离应该做一个功能键的列表,当他们按下的时候,不做任何操作,return false就完事
      }
    }, 0),

    /**
     * @feature
     */
    // 初始化
    init() {
      // shell
      const origin = new ElementNode(
        "div",
        "",
        // "origin",
        {},
        {},
        []
      );
      this.trees = origin;
      origin.id = "origin";

      setTimeout(() => {
        const newPara = new ElementNode("p", "", {}, {}, []);
        newPara.parent = this.trees;
        this.trees.children.push(newPara);
        setTimeout(() => {
          const newinlineEle = new ElementNode("span", "abdl", {}, {}, []);
          newinlineEle.parent = newPara;
          const ano1 = new ElementNode(
            "span",
            "acdc",
            { color: "red", "font-weight": "bold" },
            {},
            []
          );
          const ano2 = new ElementNode(
            "span",
            "lenox",
            { color: "green", "font-weight": "bold" },
            {},
            []
          );
          const ano3 = new ElementNode(
            "span",
            "bowy",
            { color: "pink", "font-weight": "bold" },
            {},
            []
          );
          ano1.id += 1;
          ano1.parent = newPara;
          ano2.id += 2;
          ano2.parent = newPara;
          ano3.id += 3;
          ano3.parent = newPara;
          newPara.children.push(newinlineEle);
          newPara.children.push(ano1);
          newPara.children.push(ano2);
          newPara.children.push(ano3);

          this.saveStack(this.trees, this.$store, {
            startId: ano3.id,
            startOffset: ano3.text.length,
            endId: ano3.id,
            endOffset: ano3.text.length
          });
        }, 0);
      }, 0);
    },
    // 创建元素
    createVirtualNode(tag, text, style, attr, children) {
      return new Promise(res => {
        const ele = new ElementNode(tag, text, style, attr, children);
        return res(ele);
      });
    },
    // normal入栈
    saveStack,
    // action:redo/undo为参数,从相应的栈中获取栈顶,将相应时刻的trees和range返回
    getStack,
    splitDocByRange(id) {
      console.log("id", id);
      return;
    },
    redirectRange(forNewRange) {
      console.log("设置指定range", forNewRange.startId);
      console.log(document.getElementById(forNewRange.startId));
      this.store.commit("saveRangeBeforeTextChange", {
        rangeFactor: {
          startTextTankAncestor: document.getElementById(forNewRange.startId),
          startOffset: forNewRange.startOffset || 0,
          endTextTankAncestor: document.getElementById(forNewRange.endId),
          endOffset: forNewRange.endOffset || 0
        }
      });
      setTimeout(() => {
        this.rangeForTextChange();
      }, 3);
    },

    // 当要在文档末尾插入节点时,用该方法获取文档的最末节点,所以添加需要添加在该节点之后,通过id识别
    // 获取一个节点的最末子节点
    // getDeepestNodeId(node) {
    //   if (node.children.length === 0) {
    //     return node;
    //   } else {
    //     return this.getDeepestNodeId(node.children[node.children.length - 1]);
    //   }
    // },

    /**
     * @featrue
     * type=>Object
     */
    creatElementNode(config) {
      // 插入某个节点之后,为保持节点ID的易识别性和唯一性,id使用时间戳
      console.log("当前的创建配置为:", config);
    },

    // 获取与入参元素节点对应的虚拟dom的引用
    findTargetNode,
    // 20200218添加补正参数startOffsetChange和endOffsetChange,用于在直接输入和输入法输入包括剪切粘贴的时候,把range调整到合理的位置
    rangeForTextChange,
    // 保存range要素至data和vuex
    saveRange() {
      try {
        if (window.getSelection().getRangeAt(0)) {
          this.range = window.getSelection().getRangeAt(0);
          // console.log("saved", this.range);
          this.store.commit("saveRangeBeforeTextChange", {
            rangeFactor: {
              startTextTankAncestor: window.getSelection().getRangeAt(0)
                .startContainer.parentNode,
              startOffset: window.getSelection().getRangeAt(0).startOffset,
              endTextTankAncestor: window.getSelection().getRangeAt(0)
                .endContainer.parentNode,
              endOffset: window.getSelection().getRangeAt(0).endOffset
            }
          });
        }
      } catch (error) {
        // console.log('error', error)
        return;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  .toolbar_simple {
    display: flex;
    width: 100%;
    .cell {
      // display: flex;
      box-sizing: border-box;
      width: 25px;
      height: 25px;
      background-color: rgba(255, 255, 255, 1);
      // justify-content: center;
      // align-items: center;
      // border: 1px solid #ccc;
    }
    .cell:hover {
      background-color: rgba(134, 134, 134, 0.3);
    }
  }
  #theGhost {
    padding: 10px;
    min-height: 500px;
    text-align: left;
    word-wrap: break-word;
    p {
      width: 100%;
      word-wrap: break-word;
    }
  }
}
</style>
