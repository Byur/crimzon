import Base from "../core/baseclass_base";
// import { extend } from "lodash";
// 具象化toobar的dom结构的时候，参考vueloader，使用createElement('XXX')之后再对真实dom进行操作

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

// eslint-disable-next-line no-unused-vars
// const paintItAll_volume = function(
//   cssAttr,
//   value,
//   elementList,
//   theSilentCartoGrapher
// ) {
//   // const cssAttrName = cssAttr.split("_")[0];
//   // const cssAttrValue = cssAttr.split("_")[1];
//   if (theSilentCartoGrapher && elementList[0]) {
//     Object.assign(theSilentCartoGrapher, elementList[0].style);
//     theSilentCartoGrapher[cssAttr] = value;
//     console.log("修改制图机", theSilentCartoGrapher);
//     return;
//   }
//   if (elementList.length > 0) {
//     const flaten = elementList.flat(1);
//     const afterFilter = flaten.filter(item => {
//       return item.tag !== "br" && item.tag !== "p";
//     });
//     console.log("afterFilter", afterFilter);
//     afterFilter.forEach(item => {
//       console.log(`${item.text},${item.style[cssAttr]} to ${value}`);
//       item.style[cssAttr] = value;
//     });
//     console.log("done");
//     return;
//   }

//   return;
// };

// eslint-disable-next-line no-unused-vars
// function changeStyle(elementList, theSilentCartoGrapher) {
//   if (this.type === "switch") {
//     // 添加样式
//     if (this.srcClass === this.deactivateIconClass) {
//       paintItAll_switch(
//         this.cssAttrDeactivated,
//         elementList,
//         theSilentCartoGrapher
//       );
//       this.srcClass = this.activateIconClass;
//       // this.cssAttr = this.cssAttrActivated;
//       return;
//     }
//     // 撤销
//     else {
//       paintItAll_switch(
//         this.cssAttrActivated,
//         elementList,
//         theSilentCartoGrapher
//       );
//       this.srcClass = this.deactivateIconClass;
//       // this.cssAttr = this.cssAttrDeactivated;
//       return;
//     }
//   }
// }
function isActived(boolean) {
  // console.log("this.buttonDom", this.buttonDom.children[0].classList);
  if (boolean) {
    this.srcClass = this.activateIconClass;
    // this.cssAttr = this.cssAttrActivated;
    this.buttonDom.children[0].classList.remove(this.deactivateIconClass);
  } else {
    this.srcClass = this.deactivateIconClass;
    // this.cssAttr = this.cssAttrDeactivated;
    this.buttonDom.children[0].classList.remove(this.activateIconClass);
  }
  this.buttonDom.children[0].classList.add(this.srcClass);
  // console.log("button after check style", this);
  // this.
}
// 生成button的DOM结构
const buildButtonDom = function() {
  const newDom = document.createElement("I");
  newDom.classList.add("iconfont", "icon", this.srcClass);

  const cell = document.createElement("DIV");
  cell.classList.add("cell");

  cell.appendChild(newDom);
  // cell.addEventListener("click",function () {
  //   console.log("clicked")
  // });
  return cell;
};

// eslint-disable-next-line no-unused-vars
/**
 * @description 焦点模式下自由切换按钮的正反面，同步表面用于判断的数据如cssAttr
 */
function freeClick() {
  console.log(
    "--------free click-before change button style-----------\n",
    this.srcClass,
    "\n",
    this.cssAttr
  );
  if (this.cssAttr === this.cssAttrActivated) {
    console.log("blaze to frost?");
    this.srcClass = this.deactivateIconClass;
    this.cssAttr = this.cssAttrDeactivated;
    this.buttonDom.children[0].classList.remove(this.activateIconClass);
    this.buttonDom.children[0].classList.add(this.deactivateIconClass);
    console.log("after shift frost-----------------", this.srcClass, this.cssAttr);
    return;
  }

  console.log("frost to blaze?");
  this.srcClass = this.activateIconClass;
  this.cssAttr = this.cssAttrActivated;
  this.buttonDom.children[0].classList.remove(this.deactivateIconClass);
  this.buttonDom.children[0].classList.add(this.activateIconClass);
  console.log("after shift blaze-----------------", this.srcClass, this.cssAttr);
  return;
}
export default (function() {
  class Button extends Base {
    /**
     *
     * @param {String} buttonName
     * @param {String} type "volume" || "switch"
     * @param {String} description
     * @param {String} cssAttrActivated "border-color_red"
     * @param {String} cssAttrDeactivated "border-color_none"
     * @param {String} activateIconClass
     * @param {String} deactivateIconClass
     * @param {DOMObject} buttonDom dom reflection of button
     */
    constructor(
      // 按键名，用于
      buttonName,
      type,
      // 按键描述，用于hover效果
      description,
      // css相应属性正反面状态的值
      cssAttrActivated,
      cssAttrDeactivated,
      // 失活时的样式
      activateIconClass,
      // 激活时的样式
      deactivateIconClass
    ) {
      super();
      this.buttonName = buttonName;
      this.type = type;
      this.cssAttrActivated = cssAttrActivated;
      this.cssAttrDeactivated = cssAttrDeactivated;
      this.description = description;
      this.activateIconClass = activateIconClass;
      this.deactivateIconClass = deactivateIconClass;
      // 初始化时，srcClass为未触发状态的值
      this.srcClass = this.deactivateIconClass;
      this.cssAttr = this.cssAttrActivated;
      // Button实例的DOM元素映射；
      this.buttonDom = {};
    }
    // // 初始化结构与事件绑定
    init() {
      const button = this;

      const cell = button.buildButtonDom();

      button.buttonDom = cell;
      const buttonClicked = new CustomEvent("customclick", {
        bubbles: true,
        detail: { buttonName: button.buttonName }
      });
      // 通过点击向上抛出自定义事件，传送自定义事件
      button.on(button.buttonDom, "click", () => {
        // console.log(this)
        button.buttonDom.dispatchEvent(buttonClicked);
      });
      // console.log("_______________button init__________________", button);
      // this.buttonDom.on
      return cell;
    }
    // 响应事件对button样式重渲染
  }
  // Button.prototype = Base.prototype;
  Button.prototype.isActived = isActived;
  Button.prototype.freeClick = freeClick;
  Button.prototype.buildButtonDom = buildButtonDom;
  // Button.prototype.init = function() {
  //   const cell = this.buildButtonDom();
  //   this.buttonDom = cell;
  //   this.on(
  //     cell,
  //     "click",
  //     function() {
  //       console.log("???click???");
  //       console.log("this", this.buttonName);
  //     }.bind(this)
  //   );
  //   // this.buttonDom.on
  //   return cell;
  // };

  // Button.prototype.on(this.buttonDom,"click",changeStyle)
  // Button.prototype.init = function() {};
  // Button.prototype.isActived = function() {};
  // Button.prototype.changeStyle = function() {};

  // 事件处理程序，维护全局样式

  return Button;
})();

// export function Button(name, type, cssKey) {
//   const object = new Object();
//   object.name = name;
//   object.type = type;
//   object.cssKey = cssKey;
//   object.init = function init() {
//     // initail
//     // const button = this;
//   };
// }
