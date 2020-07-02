// import { initial } from "lodash";

export function Button(name, type, cssKey) {
  const object = new Object();
  object.name = name;
  object.type = type;
  object.cssKey = cssKey;
  object.init = function init() {
    // initail
    // const button = this;
  };
}
