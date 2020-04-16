// 单标签列表
const singelTagList = ["br", "img"];
export default class elementNode {
  // except:
  // tag-String
  // text-String
  // attr-Object
  // decoration-Object
  // children-Array
  constructor(tag, text, attr, style, children, dispaly = true) {
    let now = new Date();
    this.tag = tag || "";
    this.text = text || "";
    this.attr = attr || {};
    this.style = style || {};
    this.children = children || [];
    this.display = dispaly;
    // 唯一标识，用于在同一级数中识别自身
    this.id = "z" + now.getTime();
    // 用于区别节点深度和获取引用的路径，可重复
    // this.level = level;
  }
  // set text(value) {
  //   // this.text = value;
  //   console.log("改变了吗", value);
  // }
  toString() {
    this.attr.id = this.id;
    let formatStyle = "";
    for (let i in this.style) {
      formatStyle = formatStyle + `${i}:${this.style[i]};`;
      console.log(`${i}:${this.style[i]};`);
    }
    let formatAttr = "";
    for (let i in this.attr) {
      formatAttr = formatAttr + `${i}=${this.attr[i]} `;
      console.log(`${i}:${this.style[i]};`);
    }
    // console.log()
    if (singelTagList.indexOf(this.tag) === -1) {
      const head = `<${this.tag}${
        formatStyle ? "style=" + formatStyle : ""
      } ${formatAttr}>`;
      const tail = `</${this.tag}>`;
      if (this.children.length === 0) {
        return head + this.text + tail;
      } else {
        let filterenable = this.children.filter(item => {
          return item.display === true;
        });
        let innerHTML = filterenable.reduce(function(prev, cur) {
          return prev + cur;
        });
        return head + innerHTML + tail;
      }
    } else {
      const theRudeConstructor = `<${this.tag}${
        formatStyle ? "style=" + formatStyle : ""
      } ${formatAttr}/>`;
      return theRudeConstructor;
    }
  }
  // valueOf() {}
}
