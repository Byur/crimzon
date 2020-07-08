// events manage
function on(target, eventName, handler) {
  target.addEventListener(eventName, handler);
  console.log("this is event action-on,add event listener base function param");
  return;
}
// event,handler
function off(target, eventName, handler) {
  target.removeEventListener(eventName, handler);
  console.log(
    "this is event action-off,cancel event listener base function param"
  );
  return;
}
// custom event,handler
function fire() {
  console.log(
    "this is event action-fire,trigger event listener base function param"
  );
  return;
}

// eslint-disable-next-line no-unused-vars
const actions = { on, off, fire };

export default (function() {
  class Base {
    constructor() {}
  }
  //   加载模块
  Base.prototype.installModules = function installModules(c, modules) {
    console.log("Object.keys(modules)", modules);
    Object.keys(modules).forEach(moduleName => {
      console.log("this", moduleName, modules[moduleName]);
      c.prototype[moduleName] = modules[moduleName];
    });
  };

  Base.prototype.installModules(Base, actions);
  console.log("Base", Base);
  return Base;
})();
