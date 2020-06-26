const paintItAll = function(cssAttr, elementList, theSilentCartoGrapher) {
  const cssAttrName = cssAttr.split("_")[0];
  const cssAttrValue = cssAttr.split("_")[1];
  if (theSilentCartoGrapher && elementList[0]) {
    Object.assign(theSilentCartoGrapher,elementList[0].style)
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
      paintItAll(this.cssAttr, elementList, theSilentCartoGrapher);
      this.srcClass = "iconfont icon icon-jiacuxuanzhong";
      return;
    }
    // 撤销
    else {
      paintItAll("font-weight_normal", elementList, theSilentCartoGrapher);
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
      paintItAll(this.cssAttr, elementList, theSilentCartoGrapher);
      this.srcClass = "iconfont icon icon-xietixuanzhong";
      return;
    }
    // 撤销
    else {
      paintItAll("font-style_normal", elementList, theSilentCartoGrapher);
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
  // 外部的isActivated方法,if true,证明选取范围内全是bold
  changeStyle: function(elementList) {
    console.log("got command", elementList);
    if (this.srcClass === "iconfont icon icon-ziti4") {
      paintItAll(this.cssAttr, elementList);
      this.srcClass = "iconfont icon icon-xiahuaxian15";
      return;
    }
    // 撤销
    else {
      paintItAll("text-decoration_none", elementList);
      this.srcClass = "iconfont icon icon-ziti4";
      return;
    }
  }
};
