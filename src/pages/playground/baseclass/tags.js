// 单标签列表
const singelTagList = ["br", "img"];
export default class ElementNode {
  // except:
  // tag-String
  // text-String
  // attr-Object
  // decoration-Object
  // children-Array
  constructor(tag, text, style, attr, children) {
    // let now = new Date();
    this.tag = tag || "";
    this._text = text || "";
    this.style = style || {};
    this.attr = attr || {};
    this.children = children || [];
    this.display = true;
    // 唯一标识，用于在同一级数中识别自身
    this.id = "z" + new Date().getTime();
    this.parent = null;
    // 用于区别节点深度和获取引用的路径，可重复
    // this.level = level;
  }
  set text(value) {
    if (this.tag === "span") {
      this._text = value;
      if (value !== "") {
        // console.log("改变了", value);
        return;
      } else {
        // this._text = value
        this.display = false;
        return;
      }
    }
  }
  get text() {
    return this._text;
  }
  // set setText(value){
  //   if (value===''){
  //     this.display = false;
  //     this.text = '1'
  //     return;
  //   }
  //   this.text = value;
  //   return;
  // }
  toString() {
    // this.attr.id = this.id;
    let formatStyle = "";
    for (let i in this.style) {
      if (this.style[i].length === 0) {
        continue;
      }
      formatStyle = formatStyle + `${i}:${this.style[i]};`;
      // console.log(`${i}:${this.style[i]};`);
    }
    let formatAttr = "";
    for (let i in this.attr) {
      formatAttr = formatAttr + `${i}=${this.attr[i]} `;
      // console.log(`${i}:${this.style[i]};`);
    }
    // console.log()
    if (singelTagList.indexOf(this.tag) === -1) {
      // console.log('不是单标签')
      const head = `<${this.tag} ${
        formatStyle ? "style=" + formatStyle : ""
      } id=${this.id} ${formatAttr}>`;
      const tail = `</${this.tag}>`;
      let filterenable = this.children.filter(item => {
        return item.display === true;
      });
      if (filterenable.length === 0) {
        return head + this._text + tail;
      } else {
        // console.log('filterenable',this,filterenable)
        // if (filterenable.length > 0) {
        let innerHTML = filterenable.reduce(function(prev, cur) {
          return prev + cur;
        });
        return head + innerHTML + tail;
        // }
      }
    } else {
      console.log("单标签?", this.tag);
      const theRudeConstructor = `<${this.tag}${
        this.id ? " id=" + this.id + "" : ""
      }${formatStyle ? "style=" + formatStyle : ""}${formatAttr || ""}
      />`;
      return theRudeConstructor;
    }
  }
  // valueOf() {}
}
