import Button from "../baseclass/Button";
console.log("Button", Button);

export default (function() {
  class ToolBar {
    constructor() {}
  }
  // ToolBar.prototype.xxx
  return ToolBar;
})();
