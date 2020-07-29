import Base from "./baseclass_base";

import Core from "./editor_core";
import Toolbar from "./Toolbar";
import { isAllActivated_switch, buildNewRange } from "../../api/corefunctions";
import { read } from "./database";
import {
  // backspace,
  // enter,
  // regularInput,
  // overwriteRangeInput,
  refinedNodesByRange_stage1,
  refinedNodesByRange_stage2
} from "../../api/refinement";

// import editor_core from "./editor_core";
// const eventList = ["click"];
// const click = function() {
//   console.log("tempfunc");
//   return;
// };
// const methodList = [click];
// const cssurl = require("./style.css");

function loadStyleDynamited() {
  var link = document.createElement("STYLE");
  link.rel = "stylesheet";
  link.type = "text/css";
  // link.href = url;
  link.appendChild(
    document.createTextNode(`
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
    /* // justify-content: center;
    // align-items: center;
    // border: 1px solid #ccc; */
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
  }`)
  );
  document.getElementsByTagName("head")[0].appendChild(link);
}
// eslint-disable-next-line no-unused-vars
const paintItAll_switch = function(
  cssAttr,
  elementList,
  theSilentCartoGrapher
) {
  const cssAttrName = cssAttr.split("_")[0];
  const cssAttrValue = cssAttr.split("_")[1];
  if (theSilentCartoGrapher && elementList[0]) {
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

function changeStyle(elementList, theSilentCartoGrapher) {
  if (this.type === "switch") {
    // 添加样式
    if (this.srcClass === this.deactivateIconClass) {
      paintItAll_switch(
        this.cssAttrDeactivated,
        elementList,
        theSilentCartoGrapher
      );
      this.srcClass = this.activateIconClass;
      this.cssAttr = this.cssAttrActivated;
      return;
    }
    // 撤销
    else {
      paintItAll_switch(
        this.cssAttrActivated,
        elementList,
        theSilentCartoGrapher
      );
      this.srcClass = this.deactivateIconClass;
      this.cssAttr = this.cssAttrDeactivated;
      return;
    }
  }
}
// eslint-disable-next-line no-unused-vars
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
          console.log("inside vue instance", boolean);
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
    return { receive, type: "scenePointMode" };
  }
}
export default (function() {
  const CrimEditor = (function() {
    // console.log("Base", Base);
    class CrimEditor extends Base {
      constructor(el, store) {
        super();
        loadStyleDynamited("./style.css");
        const dom77 = document.getElementById(el);

        // toolBar的渲染
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
        // console.log("ed", ed);
        ed.init(editorCoreContainer);
        dom77.appendChild(editorCoreContainer);

        // 关于mouseup\mouseleave\click事件的委托
        const crimEditor = this;

        const checkStyleBind = checkStyle.bind(crimEditor);
        crimEditor.on(dom77, "rangeModified", async function() {
          // console.log("event rangeModified trigged outside");
          const data = await read("sendToToolbar", 1);
          // console.log("data in indexedDB", data);
          // const tempRange = buildNewRange(data.rangeFactor);
          // console.log(tempRange)
          const tempRange = window.getSelection().getRangeAt(0);
          checkStyleBind(tempRange, data.trees);
        });
        crimEditor.on(dom77, "customclick", async function(event) {
          console.log("customclick", event.detail);
          const button = crimEditor.toolbar.getButton(event.detail.buttonName);
          // console.log(crimEditor.toolbar.getButton(event.detail.buttonName));

          // 传入range-stage2等参数
          const changeStyleBind = changeStyle.bind(button);
          // const elementList =

          const data = await read("sendToToolbar", 1);
          console.log("stage2 data", data)
          const tempRange = buildNewRange(data.rangeFactor);
          console.log("------------stage2 temp range---------", tempRange)
          const res = checkStyleBind(tempRange, data.trees);
          let elementList_Stage2 = [];
          // 精修
          switch (res.type) {
            case "spanParas":
              elementList_Stage2 = refinedNodesByRange_stage2.spanParas(
                res.receive,
                this.trees,
                tempRange,
                this.store
              );
              break;
            case "spanSpans":
              elementList_Stage2 = refinedNodesByRange_stage2.spanSpans(
                res.receive,
                this.trees,
                tempRange,
                this.store
              );
              break;
            case "withinSingleSpan":
              elementList_Stage2 = refinedNodesByRange_stage2.withinSingleSpan(
                res.receive,
                this.trees,
                tempRange,
                this.store
              );
              break;
            case "scenePointMode":
              elementList_Stage2 = refinedNodesByRange_stage2.scenePointMode(
                // res.receive,
                this.trees,
                tempRange,
                this.store
                // this.theSilentCartoGrapher,
              );
              break;
            default:
              console.log("default", res.type);
              break;
          }
          changeStyleBind(elementList_Stage2, this.theSilentCartoGrapher);
          // button.changeStyle();
        });
        // console.log("dom77", dom77);
        this.toolbar = toolbar;

        this.store = {};
        // 沉默的制图师
        this.theSilentCartoGrapher = {
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
        };
        this.colorBar = [];
      }
    }
    // CrimEditor.prototype = Base.prototype;
    return CrimEditor;
  })(Base);
  // at last
  return CrimEditor;
})();
