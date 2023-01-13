<template>
  <view class="editor_container">
    <view class="toolbar" @tap="format">
      <view
        :class="formats.bold ? 'ql-active' : ''"
        class="iconfont icon-zitijiacu"
        data-name="bold"
      ></view>
      <view
        :class="
          'iconfont icon-zitixieti ' + (formats.italic ? 'ql-active' : '')
        "
        data-name="italic"
      ></view>

      <view
        :class="formats.list === 'ordered' ? 'ql-active' : ''"
        class="iconfont icon-youxupailie"
        data-name="list"
        data-value="ordered"
      ></view>

      <view
        :class="formats.list === 'bullet' ? 'ql-active' : ''"
        class="iconfont icon-wuxupailie"
        data-name="list"
        data-value="bullet"
      ></view>

      <view
        :class="formats.header === 2 ? 'ql-active' : ''"
        class="iconfont icon-format-header-2"
        data-name="header"
        :data-value="2"
      ></view>
      <view
        :class="formats.header === 3 ? 'ql-active' : ''"
        class="iconfont icon-format-header-3"
        data-name="header"
        :data-value="3"
      ></view>

      <view class="iconfont icon-charutupian" @tap="insertImage"></view>

      <view class="iconfont icon-undo" @tap="undo"></view>
      <view class="iconfont icon-redo" @tap="redo"></view>
    </view>

    <editor
      id="editor"
      class="ql-container"
      showImgToolbar
      :placeholder="placeholder"
      @ready="onEditorReady"
      @input="getHtml"
    ></editor>
  </view>
</template>

<script>
// 这里使用了https://ext.dcloud.net.cn/plugin?id=412 插件，用于选择字体颜色。其余的话看自己扩展吧.
var _self;
export default {
  props: ["content"],
  data() {
    return {
      formats: {},
      placeholder: "开始输入...",
      isIOS: false,

      contentVal: "", //内容（纯文本）
      html_content: "", //内容（带html）
    };
  },
  onLoad() {
    _self = this;
  },
  created() {
    // console.log(" content >>>>", this.content);
  },
  methods: {
    onEditorReady() {
      // #ifdef MP-BAIDU
      this.editorCtx =
        requireDynamicLib("editorLib").createEditorContext("editorId");
      // #endif

      // #ifdef APP-PLUS || H5 ||MP-WEIXIN
      uni
        .createSelectorQuery()
        .select("#editor")
        .context((res) => {
          // console.log(res);
          // var contentVal_1 = this.contentVal;
          // this.editorCtx = res.context; //将内容写入编辑器
          // let EContent = {
          //   html: contentVal_1,
          // };
          // this.editorCtx.setContents(EContent); //设置富文本编辑器的内容

          this.editorCtx = res.context;

          this.editorCtx.setContents({
            html: this.content,
          });
        })
        .exec();
      // #endif
    },
    format(e) {
      let { name, value } = e.target.dataset;
      if (!name) return;
      // console.log('format', name, value)
      this.editorCtx.format(name, value);
    },
    insertImage() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          uni.showLoading({
            title: "图片上传中",
          });

          //上传文件的临时路径
          const tempFilePaths = res.tempFilePaths;
          console.log(tempFilePaths);
          uni.uploadFile({
            url: "upload",
            filePath: tempFilePaths[0],
            name: "file",
            success: (uploadFileRes) => {
              console.log("编辑详情的时候返回照片地址");
              console.log(uploadFileRes);
              uni.hideLoading();
              const back = JSON.parse(uploadFileRes.data);
              if (back.status == "0") {
                console.log(_self.host + back.filepath[0]);

                _self.editorCtx.insertImage({
                  src: _self.host + back.filepath[0],
                  alt: "图像",
                  success: function () {},
                });
              } else {
                uni.showToast({
                  title: back.msg,
                });
              }
            },
            fail: () => {
              uni.hideLoading();
              uni.showLoading({
                title: "图片上传失败，请重试！",
              });
            },
          });
        },
      });
    },
    clear() {
      this.editorCtx.clear();
    },
    getHtml(e) {
      // console.log(e.detail.html); //带标签内容
      // console.log(e.detail.text); //带标签内容

      // this.contentVal = e.detail.text;
      // this.html_content = e.detail.html;

      this.$emit("getHtml", e);
    },
    undo() {
      this.editorCtx.undo();
    },
    redo() {
      this.editorCtx.redo();
    },

    insertImage() {
      uni.chooseImage({
        count: 1,
        success: function (res) {
          _self.editorCtx.insertImage({
            src: res.tempFilePaths[0],
            data: {
              id: "abcd",
              role: "god",
            },
            width: "80%",
            success: function () {
              console.log("insert image success");
            },
          });
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import url("@/static/common/css/editor-icon.css");

.editor_container {
  // padding: 30rpx 30rpx 50rpx;

  .toolbar {
    margin-bottom: 50rpx;
    border-bottom: 2rpx solid #e2e2e2;
  }

  .iconfont {
    display: inline-block;
    padding: 8rpx 15rpx;
    cursor: pointer;
    font-size: 40rpx;
  }

  .ql-active {
    color: #0268fa;
  }

  .ql-container {
    padding: 20rpx;
    height: 450rpx;
    background: #ffffff;
    border: 2rpx solid #e6e6e6;
  }
}
</style>