/* eslint-disable no-unused-vars */
// (function (global, factory) {
//     typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//         typeof define === 'function' &&
//             (global = global || self, global.Swiper = factory());
// }(this, function () {

// }));

export default function() {
  const mask = {
    dom77: {},
    collapsed: true,

    style: {
      height: window.screen.availHeight + "px",
      width: window.screen.availWidth + "px",
      backgroundColor: "rgba(0,0,0,.1)",
      visibility: "hidden",
      position: "fixed",
      left: "0px",
      top: "0px"
    },
    collapse: function() {
      const mask = this;
      console.log("this hidden", mask);
      mask.dom77.style.visibility = "hidden";
      mask.collapsed = true;
      return;
    },
    spread: function() {
      const mask = this;
      console.log("this visible", this);
      mask.dom77.style.visibility = "visible";
      mask.collapsed = false;
      return;
    },
    init: function(el) {
      const mask = this;
      console.log("this in init", mask);
      const dom77 = document.getElementById(el);
      mask.dom77 = dom77;
      // const initStyle = function() {
      (function(dom77) {
        const style = mask.style;
        Object.keys(style).forEach(item => {
          dom77.style[item] = style[item];
        });
      })(mask.dom77);
    }
  };
  return mask;
}
