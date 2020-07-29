// eslint-disable-next-line no-unused-vars
import { bold, italic } from "./buttonlist";

export default (function() {
  class ToolBar {
    constructor() {
      // this.buttons = buttons;
      this.buttonlist = [bold, italic];
      this.container = {};
    }
    init(el) {
      this.container = el;
      this.container.style.width = "100%";
      // this.container.style.height =
      this.render();
      // this.buttonlist.forEach(item => {
      //   const buttonDom = item.buildButtonDom();
      //   this.container.appendChild(buttonDom);
      // });
    }
    render() {
      this.buttonlist.forEach(item => {
        // console.log("item",item.init)
        const buttonDom = item.init();
        this.container.appendChild(buttonDom);
      });
    }
    getButton(buttnName) {
      return this.buttonlist.find(item => {
        return item.buttonName === buttnName;
      });
    }
  }
  // ToolBar.prototype.xxx
  return ToolBar;
})();
