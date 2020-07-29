/* eslint-disable no-unused-vars */

import Base from "./baseclass_base";
import _ from "lodash";
import ElementNode from "../baseclass/tags";
import { add, read, update } from "./database";
import {
  // saveRange,
  rangeForTextChange,
  findTargetNode
  // saveRange
} from "../../api/corefunctions";
import {
  // backspace,
  // enter,
  // regularInput,
  // overwriteRangeInput,
  refinedNodesByRange_stage1,
  refinedNodesByRange_stage2
} from "../../api/refinement";
import { regularInput, overwriteRangeInput } from "../../api/handleInputEvent";
import enter from "../../api/handleBreakLine";
import backspace from "../../api/handleBackSpace";
// import { getStack, saveStack } from "../../api/stack";
import { redirectRange, isAllActivated_switch } from "../../api/corefunctions";
import { toolBar } from "../../components/toolBar";
import { saveStack } from "../../api/stack";
import { underline } from "../../components/buttons";

const handlerInput = function handlerInput(event) {
  console.log("handlerInput", this);
  console.log(
    "___________________________________throttle",
    event.target,
    event.keyCode,
    this.directInput
  );

  if (this.directInput) {
    if (this.range.watcherTrigger !== "OFF") {
      this.saveRange();
    }

    const currentRange = this.range;
    const pointMode = currentRange.collapsed;
    console.log("saveRange from core：keydown", this.range);
    // 判定为焦点模式
    if (pointMode) {
      if (this.funcKeyCodes.indexOf(event.keyCode) === -1) {
        event.stopImmediatePropagation();
        event.preventDefault();
        console.log("常规输入", event.key);
        const keyData = event.key;
        // _.throttle(()=>{
        const fornewrange = regularInput.sceneDirectMode(
          keyData,
          _.cloneDeep(this.theSilentCartoGrapher),
          this.range,
          this.trees,
          this.$store
        );
        this.render();
        redirectRange(this.$store, fornewrange);
        saveStack(this.trees, this.$store, fornewrange);
        setTimeout(() => {
          this.saveRange();
          this.range.watcherTrigger = "ON";
          // console.log("刷新外部range", this.trees);
        }, 5);
        return;
        // }, 20)();
      } else {
        if (currentRange.commonAncestorContainer.nodeType === 3) {
          // 被焦点分割的前后两部分文本

          if (event.keyCode === 8) {
            event.stopImmediatePropagation();
            event.preventDefault();
            const fornewrange = backspace.scenePointMode(
              currentRange,
              this.trees,
              this.$store
            );
            this.render();
            redirectRange(this.$store, fornewrange);
            // saveStack(this.trees, this.$store, fornewrange);
            setTimeout(() => {
              this.saveRange();
              // this.range.watcherTrigger = "ON";
              // console.log("刷新外部range", this.trees);
            }, 5);
            // // 暂不处理
            return;
          } else if (event.keyCode === 13) {
            event.stopImmediatePropagation();
            event.preventDefault();
            const fornewrange = enter.scenePointMode(currentRange, this.trees);
            this.render();
            redirectRange(this.$store, fornewrange);
            saveStack(this.trees, this.$store, fornewrange);
            setTimeout(() => {
              this.saveRange();
              // this.range.watcherTrigger = "ON";
              // console.log("刷新外部range", this.trees);
            }, 5);
            return;
          }
        } else {
          console.log("from core:当前没有选中文本节点");
          if (event.keyCode === 8) {
            event.stopImmediatePropagation();
            event.preventDefault();
            const fornewrange = backspace.sceneOutOfException1(
              currentRange,
              this.trees,
              this.$store
            );
            if (fornewrange) {
              this.render();
              redirectRange(this.$store, fornewrange);
              saveStack(this.trees, this.$store, fornewrange);
              setTimeout(() => {
                this.saveRange();
                // this.range.watcherTrigger = "ON";
                // console.log("刷新外部range", this.trees);
              }, 5);
            }

            return;
          } else if (event.keyCode === 13) {
            event.stopImmediatePropagation();
            event.preventDefault();
            const fornewrange = enter.sceneOutOfException1(
              currentRange,
              this.trees
              // this.$store
            );
            this.render();
            redirectRange(this.$store, fornewrange);
            saveStack(this.trees, this.$store, fornewrange);
            setTimeout(() => {
              this.saveRange();
              // this.range.watcherTrigger = "ON";
              // console.log("刷新外部range", this.trees);
            }, 5);
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
          console.log("非常规输入，跨P", event.key);
          const keyData = event.key;
          // _.throttle(()=>{
          const fornewrange = overwriteRangeInput.sceneDirectMode.spanParas(
            keyData,
            this.range,
            this.trees,
            this.$store
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
          // }, 20)();
        } else if (event.keyCode === 8) {
          event.stopImmediatePropagation();
          event.preventDefault();
          const fornewrange = backspace.sceneRangeMode.spanParas(
            currentRange,
            this.trees,
            this.$store
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
        } else if (event.keyCode === 13) {
          event.stopImmediatePropagation();
          event.preventDefault();
          const fornewrange = enter.sceneRangeMode.spanParas(
            currentRange,
            this.trees
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
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
          console.log("非常规输入，跨span", event.key);
          const keyData = event.key;
          // _.throttle(()=>{
          const fornewrange = overwriteRangeInput.sceneDirectMode.spanSpans(
            keyData,
            this.range,
            this.trees,
            this.$store
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
          // }, 20)();
        } else if (event.keyCode === 8) {
          event.stopImmediatePropagation();
          event.preventDefault();
          const fornewrange = backspace.sceneRangeMode.spanSpans(
            currentRange,
            this.trees,
            this.$store
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
        } else if (event.keyCode === 13) {
          event.stopImmediatePropagation();
          event.preventDefault();
          console.log("跨span选取");
          // 修改partA实例
          const fornewrange = enter.sceneRangeMode.spanSpans(
            currentRange,
            this.trees
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
        }
      }
      // 选中一个text节点中的全部或者部分文本
      // 当pointMode为false且currentRange.startContainer === currentRange.endContainer时,则可说明startOffset !== endOffset
      else if (currentRange.startContainer === currentRange.endContainer) {
        if (this.funcKeyCodes.indexOf(event.keyCode) === -1) {
          event.stopImmediatePropagation();
          event.preventDefault();
          console.log("非常规输入,跨text", event.key);
          const keyData = event.key;
          // _.throttle(()=>{
          const fornewrange = overwriteRangeInput.sceneDirectMode.withinSingleSpan(
            keyData,
            this.range,
            this.trees,
            this.$store
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
          // }, 20)();
        } else if (event.keyCode === 8) {
          event.stopImmediatePropagation();
          event.preventDefault();
          const fornewrange = backspace.sceneRangeMode.withinSingleSpan(
            currentRange,
            this.trees,
            this.$store
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
        } else if (event.keyCode === 13) {
          event.stopImmediatePropagation();
          event.preventDefault();
          const fornewrange = enter.sceneRangeMode.withinSingleSpan(
            currentRange,
            this.trees
          );
          this.render();
          redirectRange(this.$store, fornewrange);
          saveStack(this.trees, this.$store, fornewrange);
          return;
        }
      }
      return;
    }
  } else {
    console.log("this.directInput = false", event.keyCode);
    event.preventDefault();
    event.stopImmediatePropagation();
    // this.saveRange()
    return;
  }
};
const donothing = function donothing(event) {
  event.preventDefault();
  console.log("keyup 或者 keypress被阻止了", this.directInput);
  return;
};
const start = function start(event) {
  // event.preventDefault();
  // event.stopPropagation();
  console.log("-----------------start---------------------", event);

  if (this.range.watcherTrigger !== "OFF") {
    console.log("before composition begins");
    this.saveRange();
  }
  console.log("range in composition start", this.range);
  this.directInput = false;
  if (!this.compositionInputRangeFactor.startId) {
    this.compositionInputRangeFactor = _.cloneDeep({
      startId: this.range.startContainer.parentNode.id,
      endId: this.range.endContainer.parentNode.id,
      startOffset: this.range.startOffset,
      endOffset: this.range.endOffset
    });
  }
  // console.log('缓存该场景下专用的range',this.compositionInputRange,Object.keys(this.compositionInputRange))
  // 缓存该场景下专用的range
};

const end = function end(event) {
  console.log("-----------------end---------------------", event);
  // this.saveRange();
  event.preventDefault();
  event.stopPropagation();
  this.wordKeeper = event.data;
  console.log(
    "trigger from end\n",
    this.range.collapsed,
    "\n",
    this.compositionInputRangeFactor
  );

  let currentRange = this.range;
  if (this.compositionInputRangeFactor.startId !== undefined) {
    console.log("新建range", this.compositionInputRangeFactor);
    const startContainer = document.getElementById(
      this.compositionInputRangeFactor.startId
    );
    const endContainer = document.getElementById(
      this.compositionInputRangeFactor.endId
    );

    const newRange = document.createRange();
    console.log(
      "新建range",
      startContainer.childNodes[0],
      this.compositionInputRangeFactor.startOffset
    );
    newRange.setStart(
      startContainer.childNodes[0],
      this.compositionInputRangeFactor.startOffset
    );
    newRange.setEnd(
      endContainer.childNodes[0],
      this.compositionInputRangeFactor.endOffset
    );
    currentRange = newRange;
    console.log("新建的range：", currentRange);
  }
  console.log(Object.keys(currentRange), Object.keys(this.range));
  const pointMode = currentRange.collapsed;
  // event.preventDefault()
  // console.log('结束')
  // return;
  if (pointMode) {
    console.log("pointMode", pointMode, this.range);
    event.stopImmediatePropagation();
    event.preventDefault();
    console.log("before enter inputAPI：", this.range);
    const fornewrange = regularInput.sceneComposiveMode(
      this.wordKeeper,
      _.cloneDeep(this.theSilentCartoGrapher),
      currentRange,
      this.trees,
      this.$store
    );
    this.render();
    redirectRange(this.$store, fornewrange);
    saveStack(this.trees, this.$store, fornewrange);
    this.compositionInputRangeFactor = {};
    this.saveRange();
    this.directInput = true;
    currentRange.watcherTrigger = "ON";
    console.log("刷新directInput", this.directInput);
    // this.saveRange();
    // setTimeout(() => {
    //   this.saveRange();
    //   this.directInput = true;
    //   this.range.watcherTrigger = "ON";
    //   console.log("刷新外部range", this.range);
    // }, 5);
    return;
  } else {
    event.stopImmediatePropagation();
    event.preventDefault();
    console.log("非常规--连续输入", currentRange);
    if (currentRange.commonAncestorContainer.id === "origin") {
      const fornewrange = overwriteRangeInput.sceneDirectMode.spanParas(
        this.wordKeeper,
        currentRange,
        this.trees,
        this.$store
      );
      // 这个状态应该作为局部状态，封装在某个被共同引用的js文件中，后续将补充
      this.directInput = true;
      this.render();
      redirectRange(this.$store, fornewrange);
      saveStack(this.trees, this.$store, fornewrange);
      return;
    } else if (
      currentRange.commonAncestorContainer.tagName === "P" &&
      currentRange.startContainer !== currentRange.endContainer
    ) {
      console.log("from core", currentRange);
      const fornewrange = overwriteRangeInput.sceneComposiveMode.spanSpans(
        this.wordKeeper,
        _.cloneDeep(this.theSilentCartoGrapher),
        currentRange,
        this.trees,
        this.$store
      );
      this.directInput = true;
      this.render();
      redirectRange(this.$store, fornewrange);
      saveStack(this.trees, this.$store, fornewrange);
      return;
    } else if (currentRange.startContainer === currentRange.endContainer) {
      const fornewrange = overwriteRangeInput.sceneDirectMode.withinSingleSpan(
        this.wordKeeper,
        currentRange,
        this.trees,
        this.$store
      );

      this.directInput = true;
      this.render();
      redirectRange(this.$store, fornewrange);
      saveStack(this.trees, this.$store, fornewrange);
      return;
    } else {
      console.log("意料之外的range", currentRange);
      return;
    }
  }
};
// 自定义事件，将range发送到外部组件

const checkRange = _.debounce(async function() {
  this.saveRange();
  // console.log("this.saveRange()", this.range);
  // 触发rangeModified事件，使用事件委托在外层监听，最后将会被外层的结构捕捉到
  console.log("this.rangeModifiedEvent", this.rangeModifiedEvent);
  const resRead = await read("sendToToolbar", 1);
  console.log("阻塞成功");
  // 存在数据，使用put方法更新
  if (resRead) {
    const resPut = await update("sendToToolbar", 1, {
      rangeFactor: {
        startId:
          this.range.startContainer.id ||
          this.range.startContainer.parentNode.id,
        endId:
          this.range.endContainer.id || this.range.endContainer.parentNode.id,
        startOffset: this.range.startOffset,
        endOffset: this.range.endOffset
      },
      trees: this.trees
    });
    if (resPut) {
      this.dom7.dispatchEvent(this.rangeModifiedEvent);
    }
    return;
  }
  // 不存在数据，使用add方法新增
  const resAdd = await add("sendToToolbar", {
    rangeFactor: {
      startId:
        this.range.startContainer.id || this.range.startContainer.parentNode.id,
      endId:
        this.range.endContainer.id || this.range.endContainer.parentNode.id,
      startOffset: this.range.startOffset,
      endOffset: this.range.endOffset
    },
    trees: this.trees
  });
  if (resAdd) {
    this.dom7.dispatchEvent(this.rangeModifiedEvent);
  }
  return;
  // 当前先用session临时存放trees和range
}, 50);
const checkRangeWhenNoCollapsed = _.debounce(async function() {
  if (this.range && !this.range.collapsed) {
    this.saveRange();
    const resRead = await read("sendToToolbar", 1);
    console.log("阻塞成功");
    // 存在数据，使用put方法更新
    if (resRead) {
      const resPut = await update("sendToToolbar", 1, {
        rangeFactor: {
          startId:
            this.range.startContainer.id ||
            this.range.startContainer.parentNode.id,
          endId:
            this.range.endContainer.id || this.range.endContainer.parentNode.id,
          startOffset: this.range.startOffset,
          endOffset: this.range.endOffset
        },
        trees: this.trees
      });
      if (resPut) {
        this.dom7.dispatchEvent(this.rangeModifiedEvent);
      }
      return;
    }
    // 不存在数据，使用add方法新增
    const resAdd = await add("sendToToolbar", {
      rangeFactor: {
        startId:
          this.range.startContainer.id ||
          this.range.startContainer.parentNode.id,
        endId:
          this.range.endContainer.id || this.range.endContainer.parentNode.id,
        startOffset: this.range.startOffset,
        endOffset: this.range.endOffset
      },
      trees: this.trees
    });
    if (resAdd) {
      this.dom7.dispatchEvent(this.rangeModifiedEvent);
    }
    return;
  }
}, 50);

const methods = {
  handlerInput,
  donothing,
  start,
  end,
  checkRange,
  checkRangeWhenNoCollapsed
};

export default (function() {
  class Core extends Base {
    constructor(store) {
      super();
      this.dom7 = {};
      this.$store = store;
      this.range = {};
      this.compositionInputRangeFactor = {};
      this.style = {
        width: "100%",
        minHeight: "500px",
        textAlign: "left",
        wordWrap: "break-word",
        backgroundColor: "#fff",
        padding: "10px"
      };
      this.funcKeyCodes = [
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
      ];
      this.funcKeyInCompositeMode = [
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
      ];
      // 当前判断是否打开了输入法,true为直接输入,false为输入法输入
      this.directInput = true;
      this.wordKeeper = "";
      this.range = {};
      this.currentRange = {};
      this.innerText = "";
      this.trees = {};
      this.currentPath = {};
      //   this.on = Base.prototype.on
      this.rangeModifiedEvent = new CustomEvent("rangeModified", {
        bubbles: true
      });
    }

    // setStyle(index) {
    //   const buttonName = this.toolBar[index].buttonName;
    //   console.log(buttonName);
    // this.saveRange();
    //   const res = this.checkStyle(index);
    //   console.log("ready to setStyle", _.cloneDeep(res.receive));
    //   let elementList_Stage2 = [];
    //   // 精修
    //   switch (res.type) {
    //     case "spanParas":
    //       elementList_Stage2 = refinedNodesByRange_stage2.spanParas(
    //         res.receive,
    //         this.trees,
    //         this.range,
    //         this.$store
    //       );
    //       break;
    //     case "spanSpans":
    //       elementList_Stage2 = refinedNodesByRange_stage2.spanSpans(
    //         res.receive,
    //         this.trees,
    //         this.range,
    //         this.$store
    //       );
    //       break;
    //     case "withinSingleSpan":
    //       elementList_Stage2 = refinedNodesByRange_stage2.withinSingleSpan(
    //         res.receive,
    //         this.trees,
    //         this.range,
    //         this.$store
    //       );
    //       break;
    //     case "scenePointMode":
    //       elementList_Stage2 = refinedNodesByRange_stage2.scenePointMode(
    //         // res.receive,
    //         this.trees,
    //         this.range,
    //         this.$store
    //         // this.theSilentCartoGrapher,
    //       );
    //       break;
    //     default:
    //       console.log("default", res.type);
    //       break;
    //   }
    //   // 涉及到页面重排
    //   if (res.type !== "scenePointMode") {
    //     console.log("elementList_Stage2 from core", elementList_Stage2);
    //     this.toolBar[index].changeStyle(elementList_Stage2);
    //     setTimeout(() => {
    //       // rangeForTextChange(this.$store);
    //       // window.sleep()
    //       this.saveRange();
    //       // this.range.watcherTrigger = "ON";
    //     }, 0);
    //     return;
    //   }
    //   // 改变当前theSilentCartoGrapher的配置,不涉及重排,在此之后的下一次输入，将使用新配置;
    //   console.log("scenePointMode");
    //   // this.theSilentCartoGrapher = elementList_Stage2[0].style;
    //   this.toolBar[index].changeStyle(res.receive, this.theSilentCartoGrapher);
    //   setTimeout(() => {
    //     // rangeForTextChange(this.$store);
    //     // window.sleep()
    //     this.range.watcherTrigger = "OFF";
    //   }, 0);
    //   return;
    // }

    // checkStyle(index) {
    //   // 不闭合，rangeMode,涉及文本改动
    //   let receive = [];
    //   if (!this.range.collapsed) {
    //     if (this.range.commonAncestorContainer.id === "origin") {
    //       // return paragraphs
    //       console.log(
    //         "test spanParas after watch",
    //         this.range.startContainer,
    //         this.range.endContainer
    //       );
    //       receive = refinedNodesByRange_stage1.spanParas(
    //         this.trees,
    //         this.range
    //       );
    //       console.log("spanParas", receive);
    //       toolBar.forEach(item => {
    //         console.log("item", item);
    //         if (item.type === "switch") {
    //           const boolean = isAllActivated_switch(receive, item.cssAttr);
    //           console.log("inside vue instance", boolean);
    //           item.isActived(boolean);
    //         }
    //       });
    //       return { receive, type: "spanParas" };
    //     } else if (
    //       this.range.commonAncestorContainer.tagName === "P" &&
    //       this.range.startContainer !== this.range.endContainer
    //     ) {
    //       receive = refinedNodesByRange_stage1.spanSpans(
    //         this.trees,
    //         this.range
    //       );
    //       console.log("spanSpans", receive);
    //       toolBar.forEach(item => {
    //         console.log("item", item);
    //         if (item.type === "switch") {
    //           const boolean = isAllActivated_switch(receive, item.cssAttr);
    //           console.log("inside vue instance", boolean);
    //           item.isActived(boolean);
    //         }
    //       });
    //       return { receive, type: "spanSpans" };
    //     } else if (this.range.startContainer === this.range.endContainer) {
    //       receive = refinedNodesByRange_stage1.withinSingleSpan(
    //         this.trees,
    //         this.range
    //       );
    //       console.log("withinSingleSpan from core", receive);
    //       toolBar.forEach(item => {
    //         console.log("item", item);
    //         if (item.type === "switch") {
    //           const boolean = isAllActivated_switch(receive, item.cssAttr);
    //           console.log("inside vue instance", boolean);
    //           item.isActived(boolean);
    //         }
    //       });
    //       return { receive, type: "withinSingleSpan" };
    //       // return span which text in
    //     }
    //   }
    //   // 闭合，pointMode,不涉及文本改动;
    //   else {
    //     receive = refinedNodesByRange_stage1.scenePointMode(
    //       this.trees,
    //       this.range
    //     );
    //     console.log("scenePointMode IN CHECK STYLE", receive);

    //     toolBar.forEach((item, i) => {
    //       console.log("item", item);
    //       if (this.range.watcherTrigger === "OFF" && i === index) {
    //         // item.isActived(!boolean);
    //         // console.log（）
    //         // do nothing
    //       } else {
    //         if (item.type === "switch") {
    //           const boolean = isAllActivated_switch(receive, item.cssAttr);
    //           console.log("inside vue instance", boolean);
    //           item.isActived(boolean);
    //           // if (){}
    //           // console.log('aftercheckout',this.range)
    //         }
    //       }
    //     });
    //     // if (receive[0] && receive[0].style) {
    //     //   this.theSilentCartoGrapher = receive[0].style;
    //     // }
    //     // 添加当前
    //     return { receive, type: "scenePointMode" };
    //   }
    // }

    // checkRangeWhenNoCollapsed: _.debounce(function() {
    //     if (this.range && !this.range.collapsed) {
    //       this.saveRange();
    //     }
    //     return;
    //   }, 50),

    //   checkRange: _.debounce(function() {
    //     this.saveRange();
    //   }, 50),

    // actionUndo() {
    //   // 0527修改了半潜在缺陷:由于getStack(this.$store, "undo")所获取的top被直接赋值给trees,使得渲染中的trees与store中normal的栈顶引用了同一个栈内存地址,因此在keyupkeydown等事件修改this.trees时,也修改了原则上只读的stack栈顶,并且在之后被压入第二位,栈顶被event最后的saveStack取代,导致出现栈顶而第二个栈的trees一样的缺陷,特在此,使用cloneDeep将getStack深拷贝再让trees使用,割裂他们(trees和stack)之间的引用关系
    //   const afterUndo = _.cloneDeep(this.getStack(this.$store, "undo"));
    //   // console.log(
    //   //   "actionUndo---------------------------------------------",
    //   //   afterUndo.trees.children[0].children[1].text,
    //   //   "\nrange",
    //   //   afterUndo.range.startOffset
    //   // );
    //   this.trees = afterUndo.trees;
    //   setTimeout(() => {
    //     redirectRange(this.$store, afterUndo.range);
    //   }, 0);
    // }
    // actionRedo() {
    //   const afterRedo = _.cloneDeep(this.getStack(this.$store, "redo"));
    //   this.trees = afterRedo.trees;
    //   setTimeout(() => {
    //     redirectRange(this.$store, afterRedo.range);
    //   }, 0);
    // }

    // handleBeforePaste() {
    //   return;
    // }
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
      this.saveRange();

      let currentOperateObj = this.range.commonAncestorContainer.parentNode;
      // 获取相应的虚拟dom的引用
      this.findTargetNode(currentOperateObj).then(async res => {
        let target = res;
        console.log("正在受影响的实例", target);
        this.saveRange();
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
    }

    // normal入栈
    // saveStack;
    // action:redo/undo为参数,从相应的栈中获取栈顶,将相应时刻的trees和range返回
    // getStack;
    editorInit() {
      // shell
      const origin = new ElementNode(
        "div",
        "",
        // "origin",
        { width: "100%", height: "100%" },
        {},
        []
      );
      this.trees = origin;
      origin.id = "origin";

      // setTimeout(() => {
      const newPara = new ElementNode("p", "", {}, {}, []);
      newPara.id += 0;
      console.log("newPara.id", newPara.id);
      newPara.parent = this.trees;
      this.trees.children.push(newPara);
      // setTimeout(() => {
      const newinlineEle = new ElementNode(
        "span",
        "abdl",
        { color: "aqua" },
        {},
        []
      );
      console.log("newinlineEle.id", newinlineEle.id);
      newinlineEle.parent = newPara;
      const ano1 = new ElementNode(
        "span",
        "acdc",
        { color: "red", "font-weight": "bold" },
        {},
        []
      );
      console.log("ano1.id", ano1.id);
      const ano2 = new ElementNode(
        "span",
        "lenox",
        { color: "green", "font-weight": "bold" },
        {},
        []
      );
      console.log("ano2.id", ano2.id);
      const ano3 = new ElementNode(
        "span",
        "bowy",
        { color: "pink", "font-weight": "bold" },
        {},
        []
      );
      console.log("ano3.id", ano3.id);
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

      // this.saveStack(this.trees, this.$store, {
      //   startId: ano3.id,
      //   startOffset: ano3.text.length,
      //   endId: ano3.id,
      //   endOffset: ano3.text.length
      // });
      // }, 0);
      // }, 0);
    }
    // 获取与入参元素节点对应的虚拟dom的引用
    findTargetNode;
    // 20200218添加补正参数startOffsetChange和endOffsetChange,用于在直接输入和输入法输入包括剪切粘贴的时候,把range调整到合理的位置
    rangeForTextChange;
    saveRange() {
      try {
        if (window.getSelection().getRangeAt(0)) {
          this.range = window.getSelection().getRangeAt(0);
          console.log("saved", this.range);
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
    init(el) {
      const ed = this;
      const container = el;
      // const container = document.getElementById(el);
      // const container = document.createElement("DIV");
      this.dom7 = container;
      container.setAttribute("contenteditable", "");
      container.innerHTML = "";
      // console.log()
      ed.on(container, "keydown", methods.handlerInput.bind(this));
      ed.on(container, "keyup", methods.donothing.bind(this));
      // ed.on(container, "keypress", methods.donothing.bind(this));
      ed.on(container, "compositionstart", methods.start.bind(this));
      ed.on(container, "compositionend", methods.end.bind(this));
      ed.on(container, "click", methods.checkRange.bind(this));
      ed.on(container, "mouseup", methods.checkRangeWhenNoCollapsed.bind(this));
      ed.on(
        container,
        "mouseleave",
        methods.checkRangeWhenNoCollapsed.bind(this)
      );
      // 设置样式
      Object.keys(this.style).forEach(item => {
        container.style[item] = this.style[item];
      });
      ed.editorInit();
      console.log("ed.trees", ed.trees.toString());
      // setTimeout(function() {
      container.innerHTML = ed.trees.toString();
      // }, 0);

      // this.range = window.getSelection().getRangeAt(0);
    }
    render() {
      this.dom7.innerHTML = this.trees.toString();
    }
  }
  // Core.prototype = Base.prototype;
  // 初始化
  // Core.prototype.init = function
  return Core;
})();
