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

const paintItAll_volume = function(
  cssAttr,
  value,
  elementList,
  theSilentCartoGrapher
) {
  // const cssAttrName = cssAttr.split("_")[0];
  // const cssAttrValue = cssAttr.split("_")[1];
  if (theSilentCartoGrapher && elementList[0]) {
    Object.assign(theSilentCartoGrapher, elementList[0].style);
    theSilentCartoGrapher[cssAttr] = value;
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
      console.log(`${item.text},${item.style[cssAttr]} to ${value}`);
      item.style[cssAttr] = value;
    });
    console.log("done");
    return;
  }

  return;
};

export const bold = {
  type: "switch",
  buttonName: "bold",
  cssAttr: "font-weight_bold",
  srcClass: "iconfont icon icon-jiacuweixuanzhong",
  description: "字体粗体",
  isActived: function(boolean) {
    console.log("params", boolean);
    //   如果是true，说明检测范围内全都是bold;如果不是,则展示bold未被选中的class;
    if (boolean) {
      this.srcClass = "iconfont icon icon-jiacuxuanzhong";
    } else {
      this.srcClass = "iconfont icon icon-jiacuweixuanzhong";
    }
  },
  /**
   *
   * @param {Object} self icon object itself
   * @param {Array} elementList a vdom element list which contains range.startcontainer and range.endcontainer in a same ancestor container , split by range.start/endOffset, then slice() to get copy references;
   */
  // 外部的isActivated方法,if true,证明选取范围内全是bold
  changeStyle: function(elementList, theSilentCartoGrapher) {
    // 添加样式,只在jiacuweixuanzhongs时操作;
    if (this.srcClass === "iconfont icon icon-jiacuweixuanzhong") {
      paintItAll_switch(this.cssAttr, elementList, theSilentCartoGrapher);
      this.srcClass = "iconfont icon icon-jiacuxuanzhong";
      return;
    }
    // 撤销
    else {
      paintItAll_switch(
        "font-weight_normal",
        elementList,
        theSilentCartoGrapher
      );
      this.srcClass = "iconfont icon icon-jiacuweixuanzhong";
      return;
    }
  }
};

export const italic = {
  type: "switch",
  buttonName: "italic",
  cssAttr: "font-style_italic",
  srcClass: "iconfont icon icon-xietiweixuanzhong",
  description: "字体斜体",
  isActived: function(boolean) {
    if (boolean) {
      this.srcClass = "iconfont icon icon-xietixuanzhong";
    } else {
      this.srcClass = "iconfont icon icon-xietiweixuanzhong";
    }
  },
  // 外部的isActivated方法,if true,证明选取范围内全是bold
  changeStyle: function(elementList, theSilentCartoGrapher) {
    console.log("got command", elementList, theSilentCartoGrapher);
    if (this.srcClass === "iconfont icon icon-xietiweixuanzhong") {
      paintItAll_switch(this.cssAttr, elementList, theSilentCartoGrapher);
      this.srcClass = "iconfont icon icon-xietixuanzhong";
      return;
    }
    // 撤销
    else {
      paintItAll_switch(
        "font-style_normal",
        elementList,
        theSilentCartoGrapher
      );
      this.srcClass = "iconfont icon icon-xietiweixuanzhong";
      return;
    }
  }
};

export const underline = {
  type: "switch",
  buttonName: "underline",
  cssAttr: "text-decoration_underline",
  srcClass: "iconfont icon icon-ziti4",
  description: "下划线",
  isActived: function(boolean) {
    if (boolean) {
      this.srcClass = "iconfont icon icon-xiahuaxian15";
    } else {
      this.srcClass = "iconfont icon icon-ziti4";
    }
  },
  changeStyle: function(elementList, theSilentCartoGrapher) {
    if (this.srcClass === "iconfont icon icon-ziti4") {
      paintItAll_switch(this.cssAttr, elementList, theSilentCartoGrapher);
      this.srcClass = "iconfont icon icon-xiahuaxian15";
      return;
    }
    // 撤销
    else {
      paintItAll_switch(
        "text-decoration_none",
        elementList,
        theSilentCartoGrapher
      );
      this.srcClass = "iconfont icon icon-ziti4";
      return;
    }
  }
};
export const color = {
  type: "volume",
  buttonName: "color",
  cssAttr: "color",
  srcClass: "iconfont icon icon-wenziyanse",
  description: "字体颜色",
  isActived: function(boolean) {
    if (boolean) {
      this.srcClass = "iconfont icon icon-wenziyanse";
    } else {
      this.srcClass = "iconfont icon icon-wenziyanse";
    }
  },
  // 外部的isActivated方法,if true,证明选取范围内全是bold
  changeStyle: function(value, elementList, theSilentCartoGrapher) {
    if (this.srcClass === "iconfont icon icon-wenziyanse") {
      paintItAll_volume(
        this.cssAttr,
        value,
        elementList,
        theSilentCartoGrapher
      );
      // this.srcClass = "iconfont icon icon-xiahuaxian15";
      return;
    }
    // 撤销
    else {
      // paintItAll_volume("text-decoration_none", value, elementList, theSilentCartoGrapher);
      // this.srcClass = "iconfont icon icon-wenziyanse";
      return;
    }
  }
};

// export const fontsize_up = {
//   type: "volume",
//   volume_range: [
//     {
//       size: "5pt",
//       pixel: "6px"
//     },
//     {
//       size: "5.5pt",
//       pixel: "7px"
//     },
//     {
//       size: "6.5pt",
//       pixel: "8px"
//     },
//     {
//       size: "7.5pt",
//       pixel: "10px"
//     },
//     {
//       size: "9pt",
//       pixel: "12px"
//     },
//     {
//       size: "10.5pt",
//       pixel: "14px"
//     },
//     {
//       size: "12pt",
//       pixel: "16px"
//     },
//     {
//       size: "14pt",
//       pixel: "18px"
//     },
//     {
//       size: "15pt",
//       pixel: "20px"
//     },
//     {
//       size: "15pt",
//       pixel: "20px"
//     },
//     {
//       size: "15pt",
//       pixel: "20px"
//     },
//     {
//       size: "16pt",
//       pixel: "21px"
//     },
//     {
//       size: "18pt",
//       pixel: "24px"
//     },
//     {
//       size: "22pt",
//       pixel: "29px"
//     },
//     {
//       size: "24pt",
//       pixel: "32px"
//     },
//     {
//       size: "26pt",
//       pixel: "34px"
//     },
//     {
//       size: "36pt",
//       pixel: "48px"
//     },
//     {
//       size: "42pt",
//       pixel: "56px"
//     }
//   ],
//   buttonName: "fontsize",
//   cssAttr: "font-size",
//   srcClass: "iconfont icon icon-zihaojiadaweixuanzhong",
//   description: "更大字号",
//   isActived: function(boolean) {
//     if (boolean) {
//       this.srcClass = "iconfont icon icon-zihaojiadaweixuanzhong";
//     } else {
//       this.srcClass = "iconfont icon icon-zihaojiadaweixuanzhong";
//     }
//   },
//   // 外部的isActivated方法,if true,证明选取范围内全是bold
//   changeStyle: function(value, elementList, theSilentCartoGrapher) {
//     if (this.srcClass === "iconfont icon icon-zihaojiadaweixuanzhong") {
//       paintItAll_volume(
//         this.cssAttr,
//         value,
//         elementList,
//         theSilentCartoGrapher
//       );
//       // this.srcClass = "iconfont icon icon-xiahuaxian15";
//       return;
//     }
//     // 撤销
//     else {
//       // paintItAll_volume("text-decoration_none", value, elementList, theSilentCartoGrapher);
//       // this.srcClass = "iconfont icon icon-zihaojiadaweixuanzhong";
//       return;
//     }
//   }
// };

// export const fontsize_down = {
//   type: "volume",
//   buttonName: "fontsize",
//   cssAttr: "font-size",
//   srcClass: "iconfont icon icon-zihaojianxiaoweixuanzhong",
//   description: "更小字号",
//   isActived: function(boolean) {
//     if (boolean) {
//       this.srcClass = "iconfont icon icon-zihaojianxiaoweixuanzhong";
//     } else {
//       this.srcClass = "iconfont icon icon-zihaojianxiaoweixuanzhong";
//     }
//   },
//   // 外部的isActivated方法,if true,证明选取范围内全是bold
//   changeStyle: function(value, elementList, theSilentCartoGrapher) {
//     if (this.srcClass === "iconfont icon icon-zihaojianxiaoweixuanzhong") {
//       paintItAll_volume(
//         this.cssAttr,
//         value,
//         elementList,
//         theSilentCartoGrapher
//       );
//       // this.srcClass = "iconfont icon icon-xiahuaxian15";
//       return;
//     }
//     // 撤销
//     else {
//       // paintItAll_volume("text-decoration_none", value, elementList, theSilentCartoGrapher);
//       // this.srcClass = "iconfont icon icon-zihaojianxiaoweixuanzhong";
//       return;
//     }
//   }
// };
