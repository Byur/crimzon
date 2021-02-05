<template>
  <div class="cube">
    <!-- @mouseout="handleEndDragging" -->
    <div
      class="content_shadow"
      :class="startDragging ? 'content_shadow' : 'content_shadow_size'"
      @mousedown="handleStartDragging"
      @mouseup="handleEndDragging"
      @mousemove="handleDragging"
      v-show="draggingMode"
    ></div>
    <div class="content">
      <slot name="content"></slot>
    </div>
    <!-- 正北 上 -->
    <div class="switch"></div>
    <div
      v-show="!draggingMode"
      class="stake n major"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(2, e)"
      @mouseup="(e) => resetBlockSize(2, e)"
      @mouseleave="(e) => resetBlockSize(2, e)"
    ></div>
    <!-- 正东 右 -->
    <div
      v-show="!draggingMode"
      class="stake e major"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(4, e)"
      @mouseup="(e) => resetBlockSize(4, e)"
      @mouseleave="(e) => resetBlockSize(4, e)"
    ></div>
    <!-- 正南 下 -->
    <div
      v-show="!draggingMode"
      class="stake s major"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(6, e)"
      @mouseup="(e) => resetBlockSize(6, e)"
      @mouseleave="(e) => resetBlockSize(6, e)"
    ></div>
    <!-- 正西 左 -->
    <div
      v-show="!draggingMode"
      class="stake w major"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(8, e)"
      @mouseup="(e) => resetBlockSize(8, e)"
      @mouseleave="(e) => resetBlockSize(8, e)"
    ></div>
    <!-- 西北 左上 -->
    <div
      v-show="!draggingMode"
      class="stake nw"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(1, e)"
      @mouseup="(e) => resetBlockSize(1, e)"
      @mouseleave="(e) => resetBlockSize(1, e)"
    ></div>
    <!-- 东北 右上 -->
    <div
      v-show="!draggingMode"
      class="stake ne"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(3, e)"
      @mouseup="(e) => resetBlockSize(3, e)"
      @mouseleave="(e) => resetBlockSize(3, e)"
    ></div>
    <!-- 东南 右下 -->
    <div
      v-show="!draggingMode"
      class="stake se"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(5, e)"
      @mouseup="(e) => resetBlockSize(5, e)"
      @mouseleave="(e) => resetBlockSize(5, e)"
    ></div>
    <!-- 西南 左下 -->
    <div
      v-show="!draggingMode"
      class="stake sw"
      @mousemove="onSizeChangeThrottle"
      @mousedown="(e) => getDirection(7, e)"
      @mouseup="(e) => resetBlockSize(7, e)"
      @mouseleave="(e) => resetBlockSize(7, e)"
    ></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cubeId: "",
      // darggingSwitch: false,
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
      renderData: {},
      cuzGen: {},
    };
  },
  props: {
    renderOption: {
      type: Object,
      default: function () {
        return {};
      },
    },
    draggingMode: {
      type: Boolean,
      default: function () {
        return false;
      },
    },
  },
  mounted() {
    console.log("renderOption", this.renderOption, this.id);
    if (this.renderOption.id) {
      console.log("this.id", this.renderOption.id);
      this.render(this.renderOption);
      // const target = document.getElementById(this.id);
      // console.log(target);
    }
  },
  watch: {
    // renderOption: {
    //   deep: true,
    //   handler(val) {
    //     console.log("this.render run", val);
    //     this.render(val);
    //   },
    // },
    // id: {
    //   type: String,
    //   default: function () {
    //     return "";
    //   },
    // },
  },
  methods: {
    // reset and render
    render(obj) {
      const target = document.getElementById(obj.id);
      console.log("target", target);
      this.renderData = obj;
      target.style.left = obj.positionInfo.x + "px";
      target.style.top = obj.positionInfo.y + "px";
      obj.sizeInfo && obj.sizeInfo.width
        ? (target.style.width = obj.sizeInfo.width + "px")
        : false;
      obj.sizeInfo && obj.sizeInfo.height
        ? (target.style.height = obj.sizeInfo.height + "px")
        : false;
      // this.$forceUpdate();
    },
    // general rules
    outOfSight() {
      this.startDragging = false;
      this.startCheckPosition = false;
    },
    // dragging events
    handleStartDragging(e) {
      console.log(
        "e",
        e.target.offsetTop,
        e.target.parentNode.parentNode.offsetHeight,
        e.clientY,
        e.offsetY,
        e.target.offsetLeft,
        e.target.parentNode.parentNode.offsetWidth,
        e.clientX,
        e.offsetX
      );
      if (!this.currentCube.draggingWarp) {
        this.currentCube.draggingWarp = {};
        this.currentCube.draggingWarp.width =
          'calc(~"100% - 10px")' || e.target.offsetWidth;
        this.currentCube.draggingWarp.height =
          'calc(~"100% - 10px")' || e.target.offsetHeight;
        this.currentCube.draggingWarp.left = e.target.offsetLeft;
        this.currentCube.draggingWarp.top = e.target.offsetTop;
      }
      const resetLeft = e.clientX - 166 - e.offsetX;
      console.log("resetLeft", resetLeft, e.target.style.left);
      const resetTop = e.clientY - 62 - e.offsetY;
      console.log("resetTop", resetTop);

      // if (this.currentCube.draggingWarp) {
      //   e.target.style.width =
      //     e.target.parentNode.parentNode.offsetWidth + "px";
      //   e.target.style.left = e.target.offsetLeft - resetLeft + "px";
      //   e.target.style.height =
      //     e.target.parentNode.parentNode.offsetHeight + "px";
      //   e.target.style.top = e.target.offsetTop - resetTop + "px";
      // }

      e.target.style.width = e.target.parentNode.parentNode.offsetWidth + "px";
      e.target.style.left = e.target.offsetLeft - resetLeft + "px";
      e.target.style.height =
        e.target.parentNode.parentNode.offsetHeight + "px";
      e.target.style.top = e.target.offsetTop - resetTop + "px";

      this.lastCurPos = { x: e.x, y: e.y };
      this.startDragging = true;
      // change cursor style
      // e.target.classList.remove("grab");
      // e.target.classList.add("grabbing");
      // e.
      // e.style.
    },
    // reset cursor style
    handleEndDragging(e) {
      this.startDragging = false;
      console.log("handleEndDragging start");
      if (this.currentCube.draggingWarp) {
        console.log(this.currentCube.draggingWarp);
        console.log(
          this.currentCube.draggingWarp.left,
          this.currentCube.draggingWarp.top
        );
        // debugger;
        e.target.style.width = this.currentCube.draggingWarp.width + "px";
        e.target.style.height = this.currentCube.draggingWarp.height + "px";
        e.target.style.left = this.currentCube.draggingWarp.left + "px";
        e.target.style.top = this.currentCube.draggingWarp.top + "px";
        this.currentCube = {};
      }
      // change cursor style
      // e.target.classList.remove("grabbing");
      // e.target.classList.add("grab");
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
        if (this.renderData.revertFlag) {
          console.log("this.renderData", this.renderData);
          if (
            Math.abs(this.renderData.revert.x) >
            Math.abs(this.renderData.revert.y)
          ) {
            const newOffsetTop = cube.offsetTop - this.renderData.revert.y;
            console.log("newOffsetTop", newOffsetTop);
            cube.style.top = newOffsetTop + "px";
            this.renderData.positionInfo.y = newOffsetTop;
          } else if (
            Math.abs(this.renderData.revert.x) <
            Math.abs(this.renderData.revert.y)
          ) {
            const newOffsetLeft = cube.offsetLeft - this.renderData.revert.x;
            console.log(newOffsetLeft);
            cube.style.left = newOffsetLeft + "px";
            this.renderData.positionInfo.x = newOffsetLeft;
          }

          this.renderData.revert.x = 0;
          this.renderData.revert.y = 0;
          this.renderData.revertFlag = false;
          this.$emit("posChanged", this.renderData);
        } else {
          const newOffsetTop = cube.offsetTop + movement.y;
          cube.style.top = newOffsetTop + "px";
          const newOffsetLeft = cube.offsetLeft + movement.x;
          cube.style.left = newOffsetLeft + "px";
          // console.log("cube", cube);
          this.renderData.positionInfo.x = newOffsetLeft;
          this.renderData.positionInfo.y = newOffsetTop;
          this.$emit("posChanged", this.renderData);
        }
      }
    },
    // resizing events
    onSizeChangeThrottle(e) {
      if (this.timer) {
        return;
      } else {
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
      console.log("this.renderData", this.renderData);
      switch (direction) {
        case 1:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight - sizeDifference.height;
            const caculatedOffsetTop = target.offsetTop + sizeDifference.height;

            this.renderData.sizeInfo.height = caculatedOffsetHeight;
            this.renderData.positionInfo.y = caculatedOffsetTop;

            target.style.height = caculatedOffsetHeight + "px";
            target.style.top = caculatedOffsetTop + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth - sizeDifference.width;
            const caculatedOffsetLeft =
              target.offsetLeft + sizeDifference.width;

            this.renderData.sizeInfo.width = caculatedOffsetWidth;
            this.renderData.positionInfo.x = caculatedOffsetLeft;

            target.style.width = caculatedOffsetWidth + "px";
            target.style.left = caculatedOffsetLeft + "px";
          }
          break;
        case 2:
          // console.log("sizeDifference.height",sizeDifference.height)
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight - sizeDifference.height;
            const caculatedOffsetTop = target.offsetTop + sizeDifference.height;

            this.renderData.sizeInfo.height = caculatedOffsetHeight;
            this.renderData.positionInfo.y = caculatedOffsetTop;

            target.style.height = caculatedOffsetHeight + "px";
            target.style.top = target.offsetTop + sizeDifference.height + "px";
          }
          break;
        case 3:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight - sizeDifference.height;
            const caculatedOffsetTop = target.offsetTop + sizeDifference.height;

            this.renderData.sizeInfo.height = caculatedOffsetHeight;
            this.renderData.positionInfo.y = caculatedOffsetTop;

            target.style.height = caculatedOffsetHeight + "px";
            target.style.top = target.offsetTop + sizeDifference.height + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth + sizeDifference.width;

            this.renderData.sizeInfo.width = caculatedOffsetWidth;
            target.style.width = caculatedOffsetWidth + "px";
          }
          break;
        case 4:
          // console.log("sizeDifference.width",sizeDifference.width)
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth + sizeDifference.width;

            this.renderData.sizeInfo.width = caculatedOffsetWidth;
            target.style.width = caculatedOffsetWidth + "px";
          }
          break;
        case 5:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight + sizeDifference.height;

            this.renderData.sizeInfo.height = caculatedOffsetHeight;
            target.style.height = caculatedOffsetHeight + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth + sizeDifference.width;

            this.renderData.sizeInfo.width = caculatedOffsetWidth;
            target.style.width = caculatedOffsetWidth + "px";
          }
          break;
        case 6:
          // console.log("sizeDifference.height",sizeDifference.height)
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight + sizeDifference.height;
            // console.log("target.height",sizeDifference.height)
            this.renderData.sizeInfo.height = caculatedOffsetHeight;
            target.style.height = caculatedOffsetHeight + "px";
          }
          break;
        case 7:
          if (sizeDifference.height) {
            const caculatedOffsetHeight =
              target.offsetHeight + sizeDifference.height;

            this.renderData.sizeInfo.height = caculatedOffsetHeight;
            target.style.height = caculatedOffsetHeight + "px";
          }
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth - sizeDifference.width;
            const caculatedOffsetLeft =
              target.offsetLeft + sizeDifference.width;

            this.renderData.sizeInfo.width = caculatedOffsetWidth;
            this.renderData.positionInfo.x = caculatedOffsetLeft;

            target.style.width = caculatedOffsetWidth + "px";
            target.style.left = caculatedOffsetLeft + "px";
          }
          break;
        case 8:
          // console.log("sizeDifference.width",sizeDifference.width)
          if (sizeDifference.width) {
            const caculatedOffsetWidth =
              target.offsetWidth - sizeDifference.width;
            const caculatedOffsetLeft =
              target.offsetLeft + sizeDifference.width;

            this.renderData.sizeInfo.width = caculatedOffsetWidth;
            this.renderData.positionInfo.x = caculatedOffsetLeft;
            // console.log("target.width",caculatedOffsetWidth)
            target.style.width = caculatedOffsetWidth + "px";
            target.style.left = caculatedOffsetLeft + "px";
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
.cube {
  // margin: 20px;
  box-sizing: border-box;
  padding: 10px;
  border: 4px dashed #777;
  width: 300px;
  height: 300px;
  max-width: 100%;
  max-height: 100%;
  background-color: aqua;
  position: absolute;
  left: 0px;
  top: 0px;
  @rest: calc(~"100% - 10px");
  @tip: 10px;

  overflow: visible;
  // overflow-x: auto;
  // overflow-y: auto;
  .content_shadow {
    position: absolute;
    left: 5px;
    top: 5px;
    width: @rest;
    height: @rest;
    background-color: darkgreen;
    cursor: move;
    // min-width: 1200px;
  }
  .content_shadow_size {
    width: @rest!important;
    height: @rest!important;
    cursor: move;
  }
  // .grab {
  //   cursor: grab;
  //   // width: @rest;
  //   // height: @rest;
  // }
  // .grabbing {
  //   cursor: grabbing;
  //   // width: 1000%;
  //   // height: 1000%;
  // }
  // .default {
  //   cursor: default;
  // }
  .content {
    // position: relative;
    // z-index: 6;
    width: 100%;
    height: 100%;
  }
  .stake {
    width: @tip;
    height: @tip;
    // background-color: blueviolet;
    position: absolute;
    text-align: center;
    // vertical-align: middle;
  }
  // positions
  .major {
    // background-color: palevioletred;
  }
  .n {
    left: 50%;
    top: 0px;
    width: @rest;
    transform: translate(-50%, -50%);
  }
  .n:hover {
    cursor: n-resize;
  }
  .s {
    left: 50%;
    bottom: 0px;
    width: @rest;
    transform: translate(-50%, 50%);
  }
  .s:hover {
    cursor: s-resize;
  }
  .w {
    left: 0px;
    top: 50%;
    height: @rest;
    transform: translate(-50%, -50%);
  }
  .e:hover {
    cursor: e-resize;
  }
  .e {
    right: 0px;
    top: 50%;
    height: @rest;
    transform: translate(50%, -50%);
  }
  .w:hover {
    cursor: w-resize;
  }
  .ne {
    right: 0px;
    top: 0px;
    transform: translate(50%, -50%);
  }
  .ne:hover {
    cursor: ne-resize;
  }
  .nw {
    left: 0px;
    top: 0px;
    transform: translate(-50%, -50%);
  }
  .nw:hover {
    cursor: nw-resize;
  }
  .se {
    bottom: 0px;
    right: 0px;
    transform: translate(50%, 50%);
  }
  .se:hover {
    cursor: se-resize;
  }
  .sw {
    bottom: 0px;
    left: 0px;
    transform: translate(-50%, 50%);
  }
  .sw:hover {
    cursor: sw-resize;
  }
}
</style>
