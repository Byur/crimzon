<template>
  <div class="container">
    <button @click="dargging">switch</button>
    <div class="sandbox" @mouseleave="outOfSight">
      <fridItem
        v-for="(i, index) in mockData"
        :renderOption="i"
        :id="i.id"
        :key="index"
        @sizeChanged="handleSizeChange"
        @posChanged="handlePosChange"
        :draggingMode="draggingMode"
      ></fridItem>
    </div>
  </div>
</template>
<script>
import fridItem from "./fridItem";
function* gen() {
  while (true) {
    yield true;
    yield false;
  }
}
const cuzGen = gen();
export default {
  components: {
    fridItem,
  },
  created() {
    console.log("created", this.mockData);
    this.mockData.forEach((item) => {
      this.tipsPosi(item);
      console.log(item);
    });
  },
  data() {
    return {
      startCheckPosition: false,
      startDragging: false,
      blockNeedToReset: {
        resetWidth: false,
        resetHeight: false,
      },
      currentDirection: 0,
      currentCube: {},
      timer: null,
      lastCurPos: {},
      mockData: [
        {
          id: "z" + Math.floor(Math.random() * 100000000),
          // 位置信息
          positionInfo: {
            x: 600,
            y: 400,
          },
          sizeInfo: {
            width: 300,
            height: 300,
          },
          // true为通过配置信息，由组件代替渲染和加载图表，劣势是布局样式不可控，false为通过slot动态加载本地的组件
          proxyMode: false,
          revertFlag: false,
          revert: {
            x: 0,
            y: 0,
          },
          // ...其余的属性之后再丰富
        },
        {
          id: "z" + Math.floor(Math.random() * 100000000),
          // 位置信息
          positionInfo: {
            x: 0,
            y: 0,
          },
          sizeInfo: {
            width: 200,
            height: 500,
          },
          // true为通过配置信息，由组件代替渲染和加载图表，劣势是布局样式不可控，false为通过slot动态加载本地的组件
          proxyMode: false,
          revertFlag: false,
          revert: {
            x: 0,
            y: 0,
          },
          // ...其余的属性之后再丰富
        },
      ],
      draggingMode: false,
    };
  },
  methods: {
    // general rules
    outOfSight() {
      this.startDragging = false;
      this.startCheckPosition = false;
    },
    dargging() {
      this.draggingMode = cuzGen.next().value;
    },
    // check collision
    handleSizeChange(obj) {},
    handlePosChange(target) {
      console.log("checked", target);
      // debugger;
      // if (obj.revertFlag) {
      // }
      // const target = this.mockData.find((item) => {
      //   return item.id === obj.id;
      // });
      if (target) {
        // Object.assign(target, obj);
        this.tipsPosi(target);
        const collisionItems = this.mockData.filter((item) => {
          // const horizonal = target;
          if (item.id !== target.id) {
            // console.log("item", item.nw.x, item.ne.x);
            // console.log("target", target.nw.x);
            const validNWX = item.nw.x < target.nw.x && target.nw.x < item.ne.x;
            const validNWY = item.nw.y < target.nw.y && target.nw.y < item.sw.y;

            const validNEX = item.nw.x < target.ne.x && target.ne.x < item.ne.x;
            const validNEY = item.nw.y < target.ne.y && target.ne.y < item.sw.y;

            const validSWX = item.nw.x < target.sw.x && target.sw.x < item.ne.x;
            const validSWY = item.nw.y < target.sw.y && target.sw.y < item.sw.y;

            const validSEX = item.nw.x < target.se.x && target.se.x < item.ne.x;
            const validSEY = item.nw.y < target.se.y && target.se.y < item.sw.y;
            // console.log(validSEX, validSEY);

            const coveredLY =
              target.nw.y < item.nw.y && item.sw.y < target.sw.y && validNWX;
            const coveredRY =
              target.nw.y < item.nw.y && item.sw.y < target.sw.y && validNEX;

            const coveredUX =
              target.nw.x < item.nw.x && item.ne.x < target.ne.x && validNWY;
            const coveredDX =
              target.nw.x < item.nw.x && item.ne.x < target.ne.x && validSWY;
            if (coveredLY) {
              console.log("coveredLYcoveredLYcoveredLY");

              const inroadX = target.nw.x - item.ne.x;
              const inroadY = 999;
              target.revert.x = inroadX;
              target.revert.y = inroadY;
              if (!target.revertFlag) target.revertFlag = true;
              return true;
            }
            if (coveredRY) {
              console.log("coveredRYcoveredRYcoveredRY");

              const inroadX = target.ne.x - item.nw.x;
              const inroadY = 999;
              target.revert.x = inroadX;
              target.revert.y = inroadY;
              if (!target.revertFlag) target.revertFlag = true;
              return true;
            }
            if (coveredUX) {
              console.log("coveredUXcoveredUXcoveredUX");
              const inroadX = 999;
              const inroadY = target.nw.y - item.sw.y;
              target.revert.x = inroadX;
              target.revert.y = inroadY;
              if (!target.revertFlag) target.revertFlag = true;
              return true;
            }
            if (coveredDX) {
              console.log("coveredDXcoveredDXcoveredDX");
              const inroadX = 999;
              const inroadY = target.sw.y - item.nw.y;
              target.revert.x = inroadX;
              target.revert.y = inroadY;
              if (!target.revertFlag) target.revertFlag = true;
              return true;
            }

            if (validNWX && validNWY) {
              const inroadX = target.nw.x - item.se.x;
              const inroadY = target.nw.y - item.se.y;
              target.revert.x = inroadX;
              target.revert.y = inroadY;
              if (!target.revertFlag) target.revertFlag = true;

              console.log(inroadX, inroadY);
              target.gotTargetNW = true;

              target.gotTargetNE = false;
              target.gotTargetSW = false;
              target.gotTargetSE = false;
              return true;
            }
            if (validNEX && validNEY) {
              const inroadX = target.ne.x - item.sw.x;
              const inroadY = target.ne.y - item.sw.y;
              // console.log(inroadX, inroadY);
              target.revert.x = inroadX;
              target.revert.y = inroadY;
              if (!target.revertFlag) target.revertFlag = true;

              target.gotTargetNE = true;

              target.gotTargetNW = false;
              target.gotTargetSW = false;
              target.gotTargetSE = false;
              return true;
            }
            if (validSWX && validSWY) {
              const inroadX = target.sw.x - item.ne.x;
              const inroadY = target.sw.y - item.ne.y;
              // console.log(inroadX, inroadY);
              target.revert.x = inroadX;
              target.revert.y = inroadY;
              if (!target.revertFlag) target.revertFlag = true;

              target.gotTargetSW = true;

              target.gotTargetNE = false;
              target.gotTargetNW = false;
              target.gotTargetSE = false;
              return true;
            }
            if (validSEX && validSEY) {
              const inroadX = target.se.x - item.nw.x;
              const inroadY = target.se.y - item.nw.y;
              // console.log(inroadX, inroadY);
              target.revert.x = inroadX;
              target.revert.y = inroadY;

              target.gotTargetSE = true;

              target.gotTargetSW = false;
              target.gotTargetNE = false;
              target.gotTargetNW = false;
              return true;
            }
          } else {
            return false;
          }
        });
        if (collisionItems.length > 0) {
          // console.log("collisionItems", collisionItems);
        }
      }
      console.log(this.mockData);
      // this.mockData.splice(targetIndex,1,obj)
    },
    // checkCollision(ruler, item) {
    //   if (ruler.id === item.id) return false;
    //   else {
    //     return
    //   }
    //   // const
    //   // return
    // },
    tipsPosi(obj) {
      const nw = { x: obj.positionInfo.x, y: obj.positionInfo.y };
      // nw.inkpoint = nw.x * nw.y;
      const ne = {
        x: obj.positionInfo.x + obj.sizeInfo.width,
        y: obj.positionInfo.y,
      };
      // ne.inkpoint = ne.x * ne.y;
      const se = {
        x: obj.positionInfo.x + obj.sizeInfo.width,
        y: obj.positionInfo.y + obj.sizeInfo.height,
      };
      // se.inkpoint = se.x * se.y;
      const sw = {
        x: obj.positionInfo.x,
        y: obj.positionInfo.y + obj.sizeInfo.height,
      };
      // sw.inkpoint = sw.x * sw.y;
      // console.log("nw", nw.x * nw.y);
      // console.log("ne", ne.x * ne.y);
      // console.log("se", se.x * se.y);
      // console.log("sw", sw.x * sw.y);
      Object.assign(obj, { nw, ne, se, sw });
    },
    // dragging events
    handleStartDragging(e) {
      // console.log("e", e);
      this.lastCurPos = { x: e.x, y: e.y };
      this.startDragging = true;
      // change cursor style
      e.target.classList.remove("grab");
      e.target.classList.add("grabbing");
    },
    // reset cursor style
    handleEndDragging(e) {
      this.startDragging = false;
      // change cursor style
      e.target.classList.remove("grabbing");
      e.target.classList.add("grab");
    },
    handleDragging(e) {
      if (this.timer) {
        return;
      } else {
        if (this.lastCurPos.x === undefined) {
          this.lastCurPos = { x: e.x, y: e.y };
          return;
        }
        // console.log(e);
        const posDifference = {
          x: e.x - this.lastCurPos.x,
          y: e.y - this.lastCurPos.y,
        };
        this.onDragging(e, posDifference);
        this.lastCurPos = { x: e.x, y: e.y };
        this.timer = setTimeout(() => {
          clearInterval(this.timer);
          this.timer = null;
        }, 50);
      }
    },
    onDragging(e, movement) {
      if (this.startDragging) {
        const cube = e.target.parentNode;
        cube.style.top = cube.offsetTop + movement.y + "px";
        cube.style.left = cube.offsetLeft + movement.x + "px";
        // console.log("cube", cube);
      }
    },
    // resizing events
    onSizeChangeThrottle(e) {
      if (this.timer) {
        return;
      } else {
        // 阻止冒泡
        // console.log("e", e);
        if (this.lastCurPos.x === undefined) {
          this.lastCurPos = { x: e.x, y: e.y };
          return;
        }
        const posDifference = {
          x: e.x - this.lastCurPos.x,
          y: e.y - this.lastCurPos.y,
        };
        this.onSizeChange(e, posDifference);

        this.lastCurPos = { x: e.x, y: e.y };
        this.timer = setTimeout(() => {
          clearInterval(this.timer);
          this.timer = null;
          // this.lastCurPos = {};
        }, 50);
      }
    },
    getDirection(direction, e) {
      // console.log("direction",direction,e.target.style.height,e.target.offsetHeight)
      this.startCheckPosition = true;
      this.currentDirection = direction;
      // 2468，1357
      const detectedRange = "700px";
      switch (direction) {
        case 1:
          e.target.style.width = detectedRange;
          e.target.style.height = detectedRange;
          this.blockNeedToReset.resetWidth = true;
          this.blockNeedToReset.resetHeight = true;
          break;
        case 2:
          e.target.style.height = detectedRange;
          this.blockNeedToReset.resetWidth = false;
          this.blockNeedToReset.resetHeight = true;
          break;
        case 3:
          e.target.style.width = detectedRange;
          e.target.style.height = detectedRange;
          this.blockNeedToReset.resetWidth = true;
          this.blockNeedToReset.resetHeight = true;
          break;
        case 4:
          e.target.style.width = detectedRange;
          this.blockNeedToReset.resetWidth = true;
          this.blockNeedToReset.resetHeight = false;
          break;
        case 5:
          e.target.style.width = detectedRange;
          e.target.style.height = detectedRange;
          this.blockNeedToReset.resetWidth = true;
          this.blockNeedToReset.resetHeight = true;
          break;
        case 6:
          e.target.style.height = detectedRange;
          this.blockNeedToReset.resetWidth = false;
          this.blockNeedToReset.resetHeight = true;
          break;
        case 7:
          e.target.style.width = detectedRange;
          e.target.style.height = detectedRange;
          this.blockNeedToReset.resetWidth = true;
          this.blockNeedToReset.resetHeight = true;
          break;
        case 8:
          e.target.style.width = detectedRange;
          this.blockNeedToReset.resetWidth = true;
          this.blockNeedToReset.resetHeight = false;
          break;

        default:
          break;
      }
    },
    resetBlockSize(direction, e) {
      if (this.startCheckPosition) {
        this.startCheckPosition = false;
        // reset values
        if (this.blockNeedToReset.resetWidth) {
          e.target.style.width = 10 + "px";
        }
        if (this.blockNeedToReset.resetHeight) {
          e.target.style.height = 10 + "px";
        }
        // reset states
        this.blockNeedToReset.resetWidth = false;
        this.blockNeedToReset.resetHeight = false;
      }
    },
    onSizeChange(e, movement) {
      if (this.startCheckPosition) {
        const cube = e.target.parentNode;
        this.handleResizingWithDirection(this.currentDirection, cube, {
          width: movement.x,
          height: movement.y,
        });
      }
    },
    /**
     * @param {Number} direction
     * @param {HTMLElement} target
     * @param {{width:Number,height:Number}} sizeDifference
     * @description fill with direction, element size should be change directly with case 2,4,6,8;or you need to change element's position additionally with case 1,3,5,7
     */
    handleResizingWithDirection(direction, target, sizeDifference) {
      switch (direction) {
        case 1:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight - sizeDifference.height;
            target.style.height = caculatedOffsetHeight + "px";
            target.style.top = target.offsetTop + sizeDifference.height + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth - sizeDifference.width;
            target.style.width = caculatedOffsetWidth + "px";
            target.style.left = target.offsetLeft + sizeDifference.width + "px";
          }
          break;
        case 2:
          // console.log("sizeDifference.height",sizeDifference.height)
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight - sizeDifference.height;
            target.style.height = caculatedOffsetHeight + "px";
            target.style.top = target.offsetTop + sizeDifference.height + "px";
          }
          break;
        case 3:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight - sizeDifference.height;
            target.style.height = caculatedOffsetHeight + "px";
            target.style.top = target.offsetTop + sizeDifference.height + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth + sizeDifference.width;
            target.style.width = caculatedOffsetWidth + "px";
          }
          break;
        case 4:
          // console.log("sizeDifference.width",sizeDifference.width)
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth + sizeDifference.width;
            // console.log("target.width",caculatedOffsetWidth)
            target.style.width = caculatedOffsetWidth + "px";
          }
          break;
        case 5:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight + sizeDifference.height;
            target.style.height = caculatedOffsetHeight + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth + sizeDifference.width;
            target.style.width = caculatedOffsetWidth + "px";
          }
          break;
        case 6:
          // console.log("sizeDifference.height",sizeDifference.height)
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight + sizeDifference.height;
            // console.log("target.height",sizeDifference.height)
            target.style.height = caculatedOffsetHeight + "px";
          }
          break;
        case 7:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight + sizeDifference.height;
            target.style.height = caculatedOffsetHeight + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth - sizeDifference.width;
            target.style.width = caculatedOffsetWidth + "px";
            target.style.left = target.offsetLeft + sizeDifference.width + "px";
          }
          break;
        case 8:
          // console.log("sizeDifference.width",sizeDifference.width)
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth - sizeDifference.width;
            // console.log("target.width",caculatedOffsetWidth)
            target.style.width = caculatedOffsetWidth + "px";
            target.style.left = target.offsetLeft + sizeDifference.width + "px";
          }
          break;

        default:
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
}
.sandbox {
  // margin: 10px;
  min-width: 100%;
  min-height: 100%;
  position: relative;
  overflow: auto;
}
// .cube {
//   // margin: 20px;
//   box-sizing: border-box;
//   padding: 10px;
//   border: 4px dashed #777;
//   width: 300px;
//   height: 300px;
//   max-width: 100%;
//   max-height: 100%;
//   background-color: aqua;
//   position: absolute;
//   left: 0px;
//   top: 0px;
//   @rest: calc(~"100% - 10px");
//   @tip: 10px;

//   // overflow-x: auto;
//   // overflow-y: auto;
//   .content_shadow {
//     position: absolute;
//     left: 5px;
//     top: 5px;
//     width: @rest;
//     height: @rest;
//     background-color: darkgreen;
//     // min-width: 1200px;
//   }

//   .grab {
//     cursor: grab;
//     // width: @rest;
//     // height: @rest;
//   }
//   .grabbing {
//     cursor: grabbing;
//     // width: 1000%;
//     // height: 1000%;
//   }
//   .default {
//     cursor: default;
//   }
//   .content {
//     // position: relative;
//     // z-index: 6;
//     width: 100%;
//     height: 100%;
//   }
//   .stake {
//     width: @tip;
//     height: @tip;
//     // background-color: blueviolet;
//     position: absolute;
//     text-align: center;
//     // vertical-align: middle;
//   }
//   // positions
//   .major {
//     // background-color: palevioletred;
//   }
//   .n {
//     left: 50%;
//     top: 0px;
//     width: @rest;
//     transform: translate(-50%, -50%);
//   }
//   .n:hover {
//     cursor: n-resize;
//   }
//   .s {
//     left: 50%;
//     bottom: 0px;
//     width: @rest;
//     transform: translate(-50%, 50%);
//   }
//   .s:hover {
//     cursor: s-resize;
//   }
//   .w {
//     left: 0px;
//     top: 50%;
//     height: @rest;
//     transform: translate(-50%, -50%);
//   }
//   .e:hover {
//     cursor: e-resize;
//   }
//   .e {
//     right: 0px;
//     top: 50%;
//     height: @rest;
//     transform: translate(50%, -50%);
//   }
//   .w:hover {
//     cursor: w-resize;
//   }
//   .ne {
//     right: 0px;
//     top: 0px;
//     transform: translate(50%, -50%);
//   }
//   .ne:hover {
//     cursor: ne-resize;
//   }
//   .nw {
//     left: 0px;
//     top: 0px;
//     transform: translate(-50%, -50%);
//   }
//   .nw:hover {
//     cursor: nw-resize;
//   }
//   .se {
//     bottom: 0px;
//     right: 0px;
//     transform: translate(50%, 50%);
//   }
//   .se:hover {
//     cursor: se-resize;
//   }
//   .sw {
//     bottom: 0px;
//     left: 0px;
//     transform: translate(-50%, 50%);
//   }
//   .sw:hover {
//     cursor: sw-resize;
//   }
// }
// .ano {
//   left: 800px;
//   top: 0px;
// }
</style>
