import Base from "./baseclass_base";

import Core from "./editor_core";
import Toolbar from "./Toolbar";

import {
  // eslint-disable-next-line no-unused-vars
  compareNCombine,
  isAllActivated_switch
} from "../../api/corefunctions";
// import { read } from "./database";
import {
  // backspace,
  // enter,
  // regularInput,
  // overwriteRangeInput,
  refinedNodesByRange_stage1,
  refinedNodesByRange_stage2
} from "../../api/refinement";

/**
 * @description 初始化样式，可拓展为根据参数如{width:100px}自定义初始化时的样式，如宽高之类的;
 */
function loadStyleDynamited() {
  var link = document.createElement("STYLE");
  link.rel = "stylesheet";
  link.type = "text/css";
  // link.href = url;
  var styleText = document.createTextNode(`
  #toolbar {
    display: flex;
    width: 100%;
  }
  #toolbar .cell {
    box-sizing: border-box;
    width: 25px;
    height: 25px;
    background-color: rgba(255, 255, 255, 1);
    position: relative;
  }
  #toolbar .cell:hover {
  background-color: rgba(134, 134, 134, 0.3);
  }
  #toolbar .cell:hover .description {
  visibility: visible;
  }
  #toolbar .cell:hover .description span {
  background-color: beige
  }
  #toolbar .description {
  position: absolute;
  visibility: hidden;
  height: 0px;
  width: 0px;
  background-color: rgba(134, 134, 134, 0.3);
  top: -15px;
  left: 0px;
  }
  #toolbar .description span {
  display: block;
  width: 40px;
  font-size: 8px;
  }
  `);

  link.appendChild(styleText);
  document.getElementsByTagName("head")[0].appendChild(link);
}
// eslint-disable-next-line no-unused-vars
/**
 * @description 绑定在按键上的事件，由toolbar代理监听，用于改变开关类型的文本样式如粗体、斜体等
 * @param {String} cssAttr 糅合了样式属性和属性值的字符串
 * @param {Array} elementList 与选区对应的虚拟元素节点列表，精确度为stage2
 * @param {Object} theSilentCartoGrapher 位于全局的记录选区元素和新元素样式的对象
 */
const paintItAll_switch = function(
  // context,
  cssAttr,
  elementList,
  theSilentCartoGrapher
) {
  const cssAttrName = cssAttr.split("_")[0];
  const cssAttrValue = cssAttr.split("_")[1];
  console.log("this in paintItAll_switch", this);
  if (theSilentCartoGrapher && elementList[0]) {
    // theSilentCartoGrapher = elementList[0].style;
    // 进一步需要改造成遍历两个object的属性，只有他们属性的值同时有意义的时候，才能够将其覆盖，不允许新建；
    // compareNCombine(theSilentCartoGrapher,elementList[0].style)
    Object.assign(theSilentCartoGrapher, elementList[0].style);
    theSilentCartoGrapher[cssAttrName] = cssAttrValue;
    console.log("修改制图机", theSilentCartoGrapher);
    return;
  }
  if (elementList.length > 0) {
    const flaten = elementList.flat(1);
    const afterFilter = flaten.filter(item => {
      return item.tag !== "br" && item.tag !== "p";
    });
    console.log("afterFilter", afterFilter);
    afterFilter.forEach(item => {
      console.log(`${item.text},${item.style[cssAttrName]} to ${cssAttrValue}`);
      item.style[cssAttrName] = cssAttrValue;
    });
    console.log("done");
    return;
  }
  return;
};

/**
 * @description 响应点击事件的核心处理方法，用于执行样式更改与同步修改后的与选中文本对应的按钮样式
 * @param {Array} elementList 与选区对应的虚拟元素节点列表，精确度为stage2
 * @param {Object} theSilentCartoGrapher 位于全局的记录选区元素和新元素样式的对象
 */
function changeStyle(editor, elementList, theSilentCartoGrapher) {
  console.log(
    "change style in component",
    theSilentCartoGrapher,
    this.currentStatus
  );
  if (this.type === "switch") {
    // 检测该段样式与当前按钮样式是否匹配，若不匹配，点击时，将与当前状态样式相反的cssAttr手动传入到paintItAll_switch中，给theSilentCartoGrapher赋值

    console.log("当前按钮相对样式是否被激活status");
    if (theSilentCartoGrapher) {
      // 检测该段样式与当前按钮样式是否匹配，若不匹配，点击时，将与当前状态样式相反的cssAttr手动传入到paintItAll_switch中，给theSilentCartoGrapher赋值
      // 首次触发时微调，currentStatus手动识别一次
      if (this.currentStatus === null) {
        this.currentStatus = isAllActivated_switch(elementList, this.cssAttr);
      }
      this.freeClick(Boolean(this.currentStatus));
      // editor.toolbar.updateButtonDom(this.buttonName);
      const willSetCssAttr = this.currentStatus
        ? this.cssAttrActivated
        : this.cssAttrDeactivated;
      paintItAll_switch(
        // editor,
        willSetCssAttr,
        elementList,
        theSilentCartoGrapher
      );
      editor.core.range.watcherTrigger = "OFF";
      console.log(editor.core.range);
      return;
    }
    // 添加样式
    if (this.srcClass === this.deactivateIconClass) {
      paintItAll_switch(
        // editor,
        this.cssAttrActivated,
        elementList,
        theSilentCartoGrapher
      );
      // this.srcClass = this.activateIconClass;
      // this.cssAttr = this.cssAttrActivated;
      // return;
    }
    // 撤销
    else {
      paintItAll_switch(
        // editor,
        this.cssAttrDeactivated,
        elementList,
        theSilentCartoGrapher
      );
      // this.srcClass = this.deactivateIconClass;
      // this.cssAttr = this.cssAttrDeactivated;
      // return;
    }

    return;
  }
}
// eslint-disable-next-line no-unused-vars
/**
 * @description 检测选取文本中的样式是否与当前按钮的状态对应，如果否，则更改按钮样式
 * @param {Object} range range对象
 * @param {Object} trees 文本区虚拟dom
 * @param {*} index toolbar第N个按钮
 */
function checkStyle(range, trees, index) {
  // 不闭合，rangeMode,涉及文本改动
  let receive = [];
  console.log("checking style");
  if (!range.collapsed) {
    if (range.commonAncestorContainer.id === "origin") {
      // return paragraphs
      console.log(
        "test spanParas after watch",
        range.startContainer,
        range.endContainer
      );
      receive = refinedNodesByRange_stage1.spanParas(trees, range);
      console.log("spanParas", receive);
      this.toolbar.buttonlist.forEach(item => {
        console.log("item", item);
        if (item.type === "switch") {
          const boolean = isAllActivated_switch(receive, item.cssAttr);
          console.log("inside vue instance", boolean);
          item.isActived(boolean);
        }
      });
      // this.toolbar.render();
      return { receive, type: "spanParas" };
    } else if (
      range.commonAncestorContainer.tagName === "P" &&
      range.startContainer !== range.endContainer
    ) {
      receive = refinedNodesByRange_stage1.spanSpans(trees, range);
      console.log("spanSpans", receive);
      this.toolbar.buttonlist.forEach(item => {
        console.log("item", item);
        if (item.type === "switch") {
          const boolean = isAllActivated_switch(receive, item.cssAttr);
          item.currentStatus = boolean;
          console.log("inside vue instance", boolean);
          item.isActived(boolean);
        }
      });
      // this.toolbar.render();
      return { receive, type: "spanSpans" };
    } else if (range.startContainer === range.endContainer) {
      receive = refinedNodesByRange_stage1.withinSingleSpan(trees, range);
      console.log("withinSingleSpan from core", receive);
      this.toolbar.buttonlist.forEach(item => {
        console.log("item", item);
        if (item.type === "switch") {
          const boolean = isAllActivated_switch(receive, item.cssAttr);
          item.currentStatus = boolean;
          console.log("inside vue instance", boolean, item);
          item.isActived(boolean);
        }
      });
      // this.toolbar.render();
      return { receive, type: "withinSingleSpan" };
      // return span which text in
    }
  }
  // 闭合，pointMode,不涉及文本改动;
  else {
    receive = refinedNodesByRange_stage1.scenePointMode(trees, range);
    // console.log(this);
    console.log("scenePointMode IN CHECK STYLE", receive);

    this.toolbar.buttonlist.forEach((item, i) => {
      console.log("item", item);
      if (range.watcherTrigger === "OFF" && i === index) {
        // item.isActived(!boolean);
        // console.log（）
        // do nothing
      } else {
        if (item.type === "switch") {
          const boolean = isAllActivated_switch(receive, item.cssAttr);
          // item.currentStatus = boolean;
          console.log("inside vue instance", boolean, item);
          // console.log("")
          item.isActived(boolean);

          // if (){}
          // console.log('aftercheckout',range)
        }
      }
    });
    // this.toolbar.render();
    // if (receive[0] && receive[0].style) {
    //   this.theSilentCartoGrapher = receive[0].style;
    // }
    // 添加当前
    console.log("check this.theSilentCartoGrapher", this.theSilentCartoGrapher);
    return { receive, type: "scenePointMode" };
  }
}

/**
 * 0730 组件间通信受阻，状况如下：
 * 1.背景：通过派发自定义事件，用indexedDB保存了trees的局部内容，从core传到main,然后通过监听取出list检测选区节点样式，但当点击改变样式的时候遇到了问题，indexedDB保存下来的数据应该是一个深拷贝，没有原型属性（不可枚举），导致了不能通过浅拷贝复杂数据时引用相同的特性，通过修改局部trees的方法，同步虚拟dom中的数据，同理，还未处理的stack操作将也不会成功；
 * 2：改造方案，保存trees弃用indexedDB，在全局内存储trees，
 */

export default (function() {
  const CrimEditor = (function() {
    // console.log("Base", Base);
    class CrimEditor extends Base {
      /**
       * @description 构造函数
       * @param {HTMLElement} el 文档树中现存的一个块级元素
       * @param {Object} store 目前用vuex替代
       */
      constructor(el, store) {
        super();
        // 加载样式
        loadStyleDynamited("./style.css");
        // 获取dom实体
        const dom77 = document.getElementById(el);

        // 状态管理
        this.store = {};
        // 制图师
        this.theSilentCartoGrapher = {
          color: "#000000",
          // 删除线(through-line),下划线(underline),上划线,暂时支持underline
          "text-decoration": "none",
          // 突出标记
          "background-color": "",
          // 切换斜体italic||normal
          "font-style": "normal",
          // 字号
          // "font-size": "",
          // 边框
          border: "",
          // 粗体
          "font-weight": "normal"
        };
        // toolBar渲染
        const toolbarContainer = document.createElement("DIV");
        toolbarContainer.id = "toolbar";
        const toolbar = new Toolbar();
        toolbar.init(toolbarContainer);
        console.log("toolbar", toolbar);
        dom77.appendChild(toolbarContainer);

        // 核心的渲染
        const editorCoreContainer = document.createElement("DIV");
        editorCoreContainer.id = "editor_core";
        const ed = new Core(store);
        console.log("ed", ed, this.theSilentCartoGrapher);
        ed.init(editorCoreContainer, this.theSilentCartoGrapher);
        dom77.appendChild(editorCoreContainer);
        const edRender = ed.render.bind(ed);
        const edSaveStack = ed.saveStack.bind(ed);
        const edSaveRange = ed.saveRange.bind(ed);
        const edRedirectRange = ed.redirectRange.bind(ed);
        // core挂载到this
        this.core = ed;

        // 关于mouseup\mouseleave\click事件的委托
        const crimEditor = this;

        const checkStyleBind = checkStyle.bind(crimEditor);
        crimEditor.on(dom77, "keyup", function(event) {
          console.log("==========read button BOLD start");
          console.log(crimEditor.toolbar.buttonlist[0].srcClass);
          console.log(crimEditor.toolbar.buttonlist[0].cssAttr);
          console.log(crimEditor.toolbar.buttonlist[0].freeClickSwitch);
          console.log("==========read button BOLD end");
          if ([8, 37, 38, 39, 40, 46, 32, 229].indexOf(event.keyCode) !== -1) {
            checkStyleBind(crimEditor.core.range, crimEditor.core.trees);
            // return;
          }
        });
        crimEditor.on(dom77, "rangeModified", async function() {
          console.log(
            "rangeModified detected, checkstyle function will be executed"
          );
          checkStyleBind(crimEditor.core.range, crimEditor.core.trees);
        });
        crimEditor.on(dom77, "resetButtonConfig", async function() {
          // checkStyleBind(crimEditor.core.range, crimEditor.core.trees);
          // console.log("重置按钮配置");
          // if (crimEditor.toolbar.currentButton.configReset) {
          //   crimEditor.toolbar.currentButton.configReset();
          //   crimEditor.toolbar.currentButton = {};
          // }
        });
        // 在焦点模式下通过click时间每一次触发checkStyle之后，将特殊button的样式开关，使其临时改变样式与cssattr；
        crimEditor.on(dom77, "specialclickswitchON", async function() {
          // checkStyleBind(crimEditor.core.range, crimEditor.core.trees);
          crimEditor.toolbar.buttonlist.forEach(item => {
            console.log(
              `现在将设置按钮${item.buttonName}的freeClickSwitch为true`
            );
            item.freeClickSwitch = true;
          });
        });
        crimEditor.on(dom77, "customclick", async function(event) {
          console.log("customclick", event.detail);
          const button = crimEditor.toolbar.getButton(event.detail.buttonName);
          crimEditor.toolbar.currentButton = button;
          const changeStyleBind = changeStyle.bind(button);

          console.log(
            "------------stage2 temp range---------",
            crimEditor.core.range
          );
          const res = checkStyleBind(
            crimEditor.core.range,
            crimEditor.core.trees
          );
          console.log("stage1", res);
          let exactcut = {};
          let elementList_Stage2 = [];
          // 精修
          switch (res.type) {
            case "spanParas":
              exactcut = refinedNodesByRange_stage2.spanParas(
                res.receive,
                crimEditor.core.trees,
                crimEditor.core.range,
                crimEditor.core.store
              );
              break;
            case "spanSpans":
              exactcut = refinedNodesByRange_stage2.spanSpans(
                res.receive,
                crimEditor.core.trees,
                crimEditor.core.range,
                crimEditor.core.store
              );
              break;
            case "withinSingleSpan":
              exactcut = refinedNodesByRange_stage2.withinSingleSpan(
                res.receive,
                crimEditor.core.trees,
                crimEditor.core.range,
                crimEditor.core.store
              );
              break;
            case "scenePointMode":
              exactcut = refinedNodesByRange_stage2.scenePointMode(
                // res.receive,
                crimEditor.core.trees,
                crimEditor.core.range,
                crimEditor.core.store
                // this.theSilentCartoGrapher,
              );
              break;
            default:
              console.log("default", res.type);
              break;
          }
          // 拆分结构，找到正确的range
          edRender();
          elementList_Stage2 = exactcut.elementList;
          console.log(
            "before change style elementList_Stage2",
            elementList_Stage2
          );
          if (res.type !== "scenePointMode") {
            // 若为选区模式，不需要传制图机
            changeStyleBind(crimEditor, elementList_Stage2);
            crimEditor.toolbar.updateButtonDom(button.buttonName);
            edRender();
            edRedirectRange(crimEditor.core.store, exactcut.rangeFactor);
            edSaveRange();
            edSaveStack(
              crimEditor.core.trees,
              crimEditor.core.store,
              exactcut.rangeFactor
            );
            // checkStyleBind(crimEditor.core.range, crimEditor.core.trees);
            return;
          }
          // 若为焦点模式，传输制图机,不入栈
          changeStyleBind(
            crimEditor,
            elementList_Stage2,
            crimEditor.theSilentCartoGrapher
          );
          edRender();
          // console.log("finish change style",crimEditor.core.range)
          edRedirectRange(crimEditor.core.store, exactcut.rangeFactor);
          if (crimEditor.core.range.watcherTrigger === "OFF") {
            edSaveRange();
            crimEditor.core.range.watcherTrigger = "OFF";
          }
          console.log(
            "theSilentCartoGrapher after free click",
            // button,
            crimEditor.theSilentCartoGrapher
          );
          return;
        });
        // toolbar挂载到this
        this.toolbar = toolbar;

        this.colorBar = [];
      }
    }
    // CrimEditor.prototype = Base.prototype;
    return CrimEditor;
  })(Base);
  // at last
  return CrimEditor;
})();
