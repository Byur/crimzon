/* eslint-disable no-unused-vars */
// (function (global, factory) {
//     typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//         typeof define === 'function' && define.amd ? define(factory) :
//             (global = global || self, global.Swiper = factory());
// }(this, function () {

// }));

// export default function(element) {
//   const dom77 = document.getElementById(element);

//   // 计算设备宽高
//   const setStyle = function() {
//     const height = window.screen.availHeight + "px";
//     const width = window.screen.availWidth + "px";
//     const backgroundColor = "rgba(0,0,0,.1)";
//     const visable = "hidden";
//     const position = "fixed";
//     const left = "0px";
//     const top = "0px";
//     return { height, width, backgroundColor, visable, position, left, top };
//   };

//   (function(dom77) {
//     const style = setStyle();
//     Object.keys(style).forEach(item => {
//       dom77.style[item] = style[item];
//     });
//   })(dom77);

//   //   const style = initStyle();
//   const on = {
//     // collapsed: function(e) {

//     // },
//     // spread: function(e) {

//     // },
//     click: function(e) {
//       // this = mask;
//       // this
//       const mask = this;
//       console.log("？", this);
//       if (e.target.id === mask.id) {
//         if (mask.collapsed) {
//           mask.style.visibility = "visable";
//           mask.collapsed = true;
//           return;
//         } else {
//           mask.style.visibility = "hidden";
//           mask.collapsed = false;
//           return;
//         }
//       } else {
//         console.log(e.target.id, mask.dom77.id);
//       }
//     }
//   };
//   //   dom77.addEventListener("click", on.click);
//   const maskprototype = {
//     collapsed: true,
//     dom77: dom77
//   };
//   const mask = Object.create(maskprototype);
//   //   mask.init = function(){}
//   mask.onclick = on.click(
//     //   mask.prototype.
//     function(mask) {
//       mask.dom77.addEventListener("click", mask.onclick);
//     }
//   )(mask);
//   return mask;
// }

export default function() {
  const mask = {
    dom77: {},
    collapsed: true,
    // on: {
    //   collapsed: function() {},
    //   spread: function() {},
    //   click: function(e) {
    //     const mask = this;
    //     console.log("？", e, this);
    //     //   function(){}(mask)
    //     if (e.target.id === mask.dom77.id) {
    //       if (mask.collapsed) {
    //         mask.style.visibility = "visable";
    //         mask.collapsed = true;
    //         console.log("cancel", mask);
    //         return;
    //       } else {
    //         mask.style.visibility = "hidden";
    //         mask.collapsed = false;
    //         console.log("do", mask);
    //         return;
    //       }
    //     } else {
    //       console.log(e.target.id, mask.dom77.id);
    //     }
    //   }
    // },
    init: function(el) {
      const mask = this;
      console.log("this in init", mask);
      const dom77 = document.getElementById(el);
      mask.dom77 = dom77;
      const setStyle = function() {
        const height = window.screen.availHeight + "px";
        const width = window.screen.availWidth + "px";
        const backgroundColor = "rgba(0,0,0,.1)";
        const visable = "hidden";
        const position = "fixed";
        const left = "0px";
        const top = "0px";
        // const zIndex = "10086";
        // const display = 'block';
        return {
          height,
          width,
          backgroundColor,
          visable,
          position,
          left,
          top,
        //   zIndex,
        //   display,
        };
      };
      (function(dom77) {
        const style = setStyle();
        Object.keys(style).forEach(item => {
          dom77.style[item] = style[item];
        });
      })(mask.dom77);
      const whenCollapsed =  mask.dom77.createEvent("Event")
      const whenSpread =  mask.dom77.createEvent("Event")

      whenCollapsed.initEvent("collapsed");
      whenSpread.initEvent("spread");
    //   mask.dom77.addEventListener('collapsed',function(e){
    //     mask.onEvent(e,function(){

    //     })
    //   })
      mask.onEvent = function(e){
        console.log(e)
      }
      mask.dom77.addEventListener("click", function(e) {
        if (e.target.id === mask.dom77.id) {
          if (mask.collapsed) {
            console.log(mask.dom77.style);
            // mask.dom77.style.visibility = "visable";
            mask.dom77.style.visibility = "hidden";
            mask.collapsed = true;
            console.log("cancel", mask);
            return;
          } else {
            mask.dom77.style.visibility = "visable";
            mask.collapsed = false;
            console.log("do", mask);
            return;
          }
        } else {
          console.log(e.target.id, mask.dom77.id);
        }
      });
    }
  };
  return mask;
}
