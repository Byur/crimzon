import Base from "../baseclass/tags";
// 具象化dom结构的时候，参考vueloader，使用createElement('XXX')之后再对真实dom进行操作
export default (function() {
  class Button {
    constructor(
      buttonName,
      type,
      cssAttr,
      description,
      negativeIconClass,
      positiveIconClass
    ) {
      this.buttonName = buttonName;
      this.type = type;
      this.cssAttr = cssAttr;
      this.html = "";
      this.description = description;
      this.negativeIconClass = negativeIconClass;
      this.positiveIconClass = positiveIconClass;
    }
  }
  Button.prototype = Base.prototype;

  Button.prototype.init = function() {};
  Button.prototype.isActived = function() {};
  Button.prototype.changeStyle = function() {};

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
