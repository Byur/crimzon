const paintItAll = function(cssAttr, elementList) {
  const afterFlatten = elementList.flat(1);
  const cssAttrName = cssAttr.split("_")[0];
  const cssAttrValue = cssAttr.split("_")[1];
  afterFlatten.forEach(item => {
    item.style[cssAttrName] = cssAttrValue;
  });
};

export const bold = {
  buttonName: "bold",
  cssAttr: "font-weight_bold",
  srcClass: "iconfont icon icon-jiacuweixuanzhong",
  deactivated_srcClass: "iconfont icon icon-jiacuxuanzhong",

  isActived: function(self, boolean) {
    console.log("params", self, boolean);
    //   如果是true，说明检测范围内全都是bold;如果不是,则展示bold未被选中的class;
    if (boolean) {
      self.srcClass = "iconfont icon icon-jiacuxuanzhong";
    } else {
      self.srcClass = "iconfont icon icon-jiacuweixuanzhong";
    }
  },
  /**
   *
   * @param {Object} self icon object itself
   * @param {Array} elementList a vdom element list which contains range.startcontainer and range.endcontainer in a same ancestor container , split by range.start/endOffset, then slice() to get copy references;
   */
  // 外部的isActivated方法,if true,证明选取范围内全是bold
  changeStyle: function(self, elementList) {
    console.log("got command", elementList);
    // 添加样式,只在jiacuweixuanzhongs时操作;
    if (self.srcClass === "iconfont icon icon-jiacuweixuanzhong") {
      console.log("测试this", this);
      paintItAll(self.cssAttr, elementList);
      self.srcClass = "iconfont icon icon-jiacuxuanzhong";
      //   self.deactivated_srcClass = "iconfont icon icon-jiacuweixuanzhong";
      return;
    }
    // 撤销
    else {
      paintItAll("font-weight_normal", elementList);
      // self.deactivated_srcClass = "iconfont icon icon-jiacuxuanzhong";
      self.srcClass = "iconfont icon icon-jiacuweixuanzhong";
      return;
    }
  }

  //   remove: function(self, elementList) {
  //   }
};
