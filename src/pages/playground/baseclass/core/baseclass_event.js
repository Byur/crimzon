export default (function() {
  class Event {
    constructor(eventList, methodList) {
      // event,handler
      this.eventList = eventList;
      this.methodList = methodList;
    }
  }
  //   const on = function() {
  //     console.log(
  //       "this is event action-on,add event listener base function param"
  //     );
  //     return;
  //   };
  //   // event,handler
  //   const off = function() {
  //     console.log(
  //       "this is event action-off,cancel event listener base function param"
  //     );
  //     return;
  //   };
  //   // event,handler
  //   const fire = function() {
  //     console.log(
  //       "this is event action-fire,trigger event listener base function param"
  //     );
  //     return;
  //   };
  //   Event.prototype.on = on;
  //   Event.prototype.off = off;
  //   Event.prototype.fire = fire;
  return Event;
})();
