<template>
  <div id="AboutForms">
    <div class="container">
      <div class="head">
        <!-- <ArrayBox :target='tempArr'></ArrayBox> -->
        <!-- <el-button @click="addArr">trigger</el-button> -->
      </div>
      <div class="main">
        <el-row class="row">
          <el-col :span="14" class="formOperation">
            <form action="" ref="form">
              <div style="padding:10px 0px">
                <el-tag
                  effect="plain"
                  size="mini"
                  v-for="(item, index) in inputOperations"
                  :key="index"
                  :color="currentIndex === index ? '#dadada' : '#fff'"
                  @click="selectOp(index)"
                >
                  {{ item.label }}
                </el-tag>
              </div>

              <textarea
                name=""
                cols="78"
                rows="30"
                ref="textarea"
                class="txt"
                @copy="acceptCM(2)"
                @focus="acceptCM(0)"
                @select="acceptCM(1)"
                v-model="stuff.content"
              ></textarea>
            </form>
            <!-- 富文本编辑 -->
            <!-- <div class="editWords">
              <div class="shell">
                <div class="of">
                  <div class="toolBar">
                    <el-tag effect="plain" @click="test">
                      反射
                    </el-tag>
                    <el-tag effect="plain" @click="anotest">
                      黑色破坏光线
                    </el-tag>
                    <el-tag effect="plain" @click="anotest1">
                      白色破坏光线
                    </el-tag>
                  </div>
                  <div
                    id="theGhost"
                    ref="wysiwys"
                    contenteditable
                    @mouseleave="checkRange"
                  ></div>
                </div>
              </div>
            </div> -->
          </el-col>
          <el-col :span="10" class="resultField">
            <div class="liview">
              <!-- 展示被选中的字符串 -->
              <div class="displaySelect">
                <div class="desc">
                  展示被选中的字符串
                </div>
                <div class="content">
                  {{ selectedString }}
                </div>
              </div>
              <!-- 展示被复制的字符串 -->
              <div class="displayCopy">
                <div class="desc">
                  展示被复制的字符串
                </div>
                <div class="content">
                  <textarea
                    v-model="copybynoPermit"
                    name=""
                    id=""
                    cols="45"
                    rows="10"
                    placeholder="soft, try me"
                  ></textarea>
                </div>
              </div>
              <!-- 展示粘贴之后的字符串 -->
              <div class="displaypaste">
                <div class="desc">
                  阻止粘贴
                </div>
                <div class="content">
                  <input
                    type="text"
                    @keydown="acceptCM(4)"
                    @paste="acceptCM(4)"
                  />
                </div>
              </div>
              <!-- 展示过滤输入 -->
              <div class="inputFilter">
                <div class="desc">
                  展示过滤输入/粘贴
                </div>
                <div class="content">
                  <textarea
                    name=""
                    id=""
                    cols="45"
                    rows="5"
                    placeholder="数字、字母、下划线"
                    @keydown="inputFilter"
                  >
                  </textarea>
                </div>
              </div>
              <!-- 展示自动切换焦点 -->
              <div class="autoSwitch">
                <div class="desc">
                  展示自动切换焦点
                </div>
                <div class="content" @keydown="autoShiftingFocus">
                  <input
                    type="text"
                    ref="part1"
                    maxlength="3"
                    placeholder="***"
                  />
                  <input
                    type="text"
                    ref="part2"
                    maxlength="4"
                    placeholder="****"
                  />
                  <input
                    type="text"
                    ref="part3"
                    maxlength="4"
                    placeholder="****"
                  />
                </div>
              </div>
              <!-- 单项表单校验合法性和禁用校验,校验整个表单 -->
              <div class="validator">
                <div class="desc">
                  单项表单校验合法性和禁用校验,校验整个表单
                </div>
                <div class="content"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
// import ArrayBox from "./components/ArrayBox";
export default {
  name: "AboutForms",
  components: {
    // ArrayBox
  },
  // mounted(){
  //     let inputGroup = [this.$refs.part1, this.$refs.part2, this.$refs.part3];
  //     console.log(inputGroup);
  // },
  data() {
    return {
      // 当前被选择标签
      currentIndex: 0,
      // 当前演示类型
      currentType: 0,
      // 被选择的文本
      selectedString: "",
      copybynoPermit: "",
      // 剪贴板中的文本
      // clipboardText: "",
      // 演示方案
      inputOperations: [
        {
          type: 0,
          label: "聚焦时选中所有文本"
        },
        {
          type: 1,
          label: "获取被选中的文本"
        },
        {
          type: 2,
          label: "阻止复制操作"
        },
        // {
        //   type: 3,
        //   label: "修改复制文本"
        // },
        // 本质上与2相同
        {
          type: 4,
          label: "阻止粘贴"
        }
        // 加入正则环节之后，根据校验结果判断是否阻止
        // {
        //   type: 5,
        //   label: "过滤输入"
        // },
        // {
        //   type: 6,
        //   label: "自动切换焦点"
        // }
      ],
      // 施法材料
      stuff: {
        title: "Gettysburg Address",
        content:
          "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal.Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that nation might live. It is altogether fitting and proper that we should do this.But, in a larger sense, we can not dedicate -- we can not consecrate -- we can not hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth."
      },
      // 无实际意义
      tempArr: [
        {
          name: "obj1",
          behavior: "none"
        },
        {
          name: "obj2",
          behavior: "none"
        }
      ]
    };
  },
  methods: {
    debounce(fn,delay){
      return ()=>{
        let timer
        
      }
    },
    acceptCM() {
      switch (this.currentType) {
        case 0:
          this.selectAllString();
          break;
        case 1:
          this.setSelectedString();
          break;
        // 阻止复制,复制动作时执行，需要onselect事件配合
        case 2:
          this.blockCopyAction();
          break;
        // 复制动作时执行,修改剪贴板,在粘贴动作中体现
        case 3:
          this.editClipboardValue();
          break;
        // 阻止粘贴,在粘贴动作中体现
        case 4:
          this.blockPasteAction();
          break;
        // 输入规则
        case 5:
          this.inputFilter();
          break;
        // 切换焦点
        case 6:
          this.autoShiftingFocus();
          break;
        default:
          break;
      }
    },
    selectOp(index) {
      this.currentIndex = index;
      this.currentType = this.inputOperations[index].type;
      console.log(this.currentType);
    },
    addArr() {
      let length = this.tempArr.length;
      // this.tempArr.push({
      //     name:`obj${length+1}`,
      //     behavior:'none'
      // })
      this.tempArr = [
        ...this.tempArr,
        {
          name: `obj${length + 1}`,
          behavior: "none"
        }
      ];
    },
    // ie能在任何时候访问
    // 选择所有文本
    selectAllString() {
      console.log("selectAllString");
      // 在聚焦的时候选择所有文本,但select动作本身就会使输入框失焦,并且会在松开鼠标之后恢复焦点
      this.$refs.textarea.select();
    },
    // 获取选择的文本
    setSelectedString() {
      // select动作会使输入框失焦,并且会在松开鼠标之后恢复焦点,导致选择了部分文本之后,触发失焦动作,所以获取局部选择的文本和全部选择文本的功能不能应用于一个表单控件之内
      console.log("setSelectedString");
      console.log(event.target.selectionStart, event.target.selectionEnd);
      console.log(this.$refs.textarea.value);
      let sentences = this.$refs.textarea.value;
      this.selectedString = sentences.substring(
        event.target.selectionStart,
        event.target.selectionEnd
      );
    },
    // 阻止复制,复制操作时触发,可枚举其剪贴板对象并操作，IE浏览器的剪贴板对象在Window对象下，其余浏览器在event下,且不能识别text类型，所以在getdata中只设置一个text的参数，是不能有效返回的
    blockCopyAction() {
      let clipboardData = event.clipboardData || window.clipboardData;
      console.log("blocking", clipboardData);
      // console.log('selected',document.getSelection().toString());可获取，所以除了阻止复制之外，也可篡改复制内容
      // IE之外
      if (clipboardData) {
        let salt =
          "---------copy from Byur's text with no permition------------";
        // let source = document.getSelection().toString();

        // Chrome
        if (event.clipboardData) {
          clipboardData.setData("text/plain", "" + salt);
          event.preventDefault();
        }
        // IE
        else if (window.clipboardData) {
          clipboardData.setData("text", "" + salt);
          // 设置完data之后，需要阻止默认的复制事件，否则，复制动作将继续进行，选择到的文本将会替代这里的salt，被复制出来
          event.preventDefault();
        }

        console.log(clipboardData.getData("text"));
        this.copybynoPermit = clipboardData.getData("text");
      }

      // console.log(event.clipboardData.getData("text"));
      // this.clipboardText = event.clipboardData.getData("text");
    },
    // 修改剪贴板内容
    editClipboardValue() {
      if (event.clipboardData) {
        console.log(
          "catch",
          event.clipboardData,
          event.clipboardData.getData("text")
        );
      } else {
        return;
      }
    },
    // 阻止ctrl+v粘贴
    blockPasteAction() {
      // console.log("paste", event, event.clipboardData.getData("text"));
      // this.clipboardText = event.clipboardData.getData("text");
      // console.log(event,event.keyCode);
      if (event.keyCode == 86 && event.ctrlKey) {
        event.preventDefault();
      } else if (event.clipboardData) {
        event.preventDefault();
      }
    },
    // 屏蔽输入
    inputFilter() {
      // console.log(event.keyCode)
      // 出现非法字符的情况:,./;'[]\等，以及shiftKey下的1234567890，还需要允许回车键和回删和del键
      // let pattern = /[A-Za-z0-9]/;
      // let letter = String.fromCharCode(event.keyCode);
      // // console.log(letter,pattern.test(letter));
      // if (event.keyCode && !pattern.test(letter)) {
      //   return
      // } else {
      //   event.preventDefault()
      // }
    },
    // 自动切换焦点
    // 在vue中大概就是使用$refs获取一个表单元素的数组，通常会是input，当长度满足最大长度限制的时候，函数方法时使数组下一个元素.focus(),使下一个元素获取焦点
    autoShiftingFocus() {
      // console.log(event.keyCode);
      let inputGroup = [this.$refs.part1, this.$refs.part2, this.$refs.part3];
      // console.log(inputGroup);
      // let currentIndex = 0;
      // for (let i in inputGroup) {
      //   console.log(i.maxLength);
      //   if (i.value.length >= i.maxLength && inputGroup[currentIndex + 1]) {
      //     // inputGroup[currentIndex+1]).focus()
      //     console.log()
      //     inputGroup[currentIndex + 1].focus();
      //   }
      // }
      inputGroup.forEach((item, index) => {
        if (item.value.length >= item.maxLength && inputGroup[index + 1]) {
          // inputGroup[currentIndex+1]).focus()
          inputGroup[index + 1].focus();
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./AboutForms.scss";
</style>
