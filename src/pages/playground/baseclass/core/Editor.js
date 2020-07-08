import Base from "./baseclass_base";
// const eventList = ["click"];
// const click = function() {
//   console.log("tempfunc");
//   return;
// };
// const methodList = [click];



export default (function() {
  const CrimEditor = (function(Base) {
    console.log("Base", Base);
    class CrimEditor {
      constructor(el) {
        const dom77 = document.getElementById(el);
        dom77.innerHTML = "";

        // const textfield = document.createElement('DIV');
        // textfield.contentEditable = true;

        this.toolBar = [];
        this.store = {};
        this.theSilentCartoGrapher = {};
        this.colorBar = [];
      }
    }
    CrimEditor.prototype = Base.prototype;
    return CrimEditor;
  })(Base);
  // at last
  return CrimEditor;
})();
