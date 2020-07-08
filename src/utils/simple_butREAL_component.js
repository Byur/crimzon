/* eslint-disable no-unused-vars */
// (function (global, factory) {
//     typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//         typeof define === 'function' &&
//             (global = global || self, global.Swiper = factory());
// }(this, function () {

// }));

// mask v1.0 导出一个构造函数
// export default function() {
//   const mask = {
//     dom77: {},
//     collapsed: true,

//     style: {
//       height: window.screen.availHeight + "px",
//       width: window.screen.availWidth + "px",
//       backgroundColor: "rgba(0,0,0,.1)",
//       visibility: "hidden",
//       position: "fixed",
//       left: "0px",
//       top: "0px"
//     },
//     collapse: function() {
//       const mask = this;
//       console.log("this hidden", mask);
//       mask.dom77.style.visibility = "hidden";
//       mask.collapsed = true;
//       return;
//     },
//     spread: function() {
//       const mask = this;
//       console.log("this visible", this);
//       mask.dom77.style.visibility = "visible";
//       mask.collapsed = false;
//       return;
//     },
//     init: function() {
//       const mask = this;
//       console.log("this in init", mask);
//       // const dom77 = document.getElementById(el);
//       const dom77 = document.createElement("DIV");
//       // dom77.innerHTML = "";
//       mask.dom77 = dom77;
//       // const initStyle = function() {
//       (function(dom77) {
//         const style = mask.style;
//         Object.keys(style).forEach(item => {
//           dom77.style[item] = style[item];
//         });
//         document.body.appendChild(dom77);
//         dom77.addEventListener("click", function(e) {
//           if (!mask.collapsed) {
//             mask.collapse();
//           }
//         });
//         dom77.addEventListener("mousewheel", function(e) {
//           // if (!mask.collapsed) {
//           //   mask.collapse();
//           // }
//           // if (e.target === dom7){
//           if (!mask.collapsed) {
//             event.preventDefault();
//           } else {
//             console.log("？？？", e);
//           }
//           // }
//         });
//       })(mask.dom77);
//     }
//   };
//   return mask;
// }

// mask v1.1 导出自执行函数，返回一个class,mixin了Base类，添加了事件处理
import Base from "@/pages/playground/baseclass/core/baseclass_base";

export default (function() {
  console.log("instance Base", Object.keys(Base.prototype));
  class Mask {
    constructor() {
      const basePrototype = Object.keys(Base.prototype);
      basePrototype.forEach(item => {
        this[item] = Base.prototype[item];
      });
      this.style = {
        height: window.screen.availHeight + "px",
        width: window.screen.availWidth + "px",
        backgroundColor: "rgba(0,0,0,.1)",
        visibility: "hidden",
        position: "fixed",
        left: "0px",
        top: "0px"
      };
      this.collapse = function() {
        const mask = this;
        console.log("this hidden", mask);
        mask.dom77.style.visibility = "hidden";
        mask.collapsed = true;
        return;
      };
      this.spread = function() {
        const mask = this;
        console.log("this visible", this);
        mask.dom77.style.visibility = "visible";
        mask.collapsed = false;
        return;
      };
      this.init = function() {
        const mask = this;
        console.log("this in init", mask);
        const dom77 = document.createElement("DIV");
        mask.dom77 = dom77;
        (function(dom77) {
          const style = mask.style;
          Object.keys(style).forEach(item => {
            dom77.style[item] = style[item];
          });
          document.body.appendChild(dom77);

          mask.on(dom77, "click", function(e) {
            if (!mask.collapsed) {
              mask.collapse();
            }
          });
          mask.on(dom77, "mousewheel", function(e) {
            if (!mask.collapsed) {
              event.preventDefault();
            } else {
              console.log("？？？", e);
            }
          });
        })(mask.dom77);
      };
    }
  }

  return Mask;
})();
