<template>
  <view>
    <view>
      <view class="toolbar">
        <view v-if="show">
          <view class="iconfont icon-bold" @click="toolBarClick('bold')"></view>
          <view
            class="iconfont icon-italic"
            @click="toolBarClick('italic')"
          ></view>
          <view
            class="iconfont icon-strike"
            @click="toolBarClick('strike')"
          ></view>

          <view class="iconfont icon-daima" @click="toolBarClick('ma')"></view>
          <view
            class="iconfont icon-wuxupailie"
            @click="toolBarClick('ul')"
          ></view>
          <view
            class="iconfont icon-youxupailie"
            @click="toolBarClick('ol')"
          ></view>
          <!-- <view class="iconfont icon-link" @click="toolBarClick('link')"></view> -->

          <view
            class="iconfont icon-charutupian"
            @click="toolBarClick('image')"
          ></view>
          <view
            class="iconfont icon-qingkong"
            @click="toolBarClick('clear')"
          ></view>
          <!-- <view class="iconfont icon-preview" @click="toolBarClick('preview')"></view> -->
        </view>
        <view v-else class="close_box">
          <view
            class="iconfont icon-e-qx41"
            @click="toolBarClick('close')"
          ></view>
        </view>
      </view>
      <view class="input-content" v-if="show">
        <textarea
          ref="area"
          maxlength="-1"
          v-model="text"
          @blur="getCursor"
          :cursor="cursor"
        ></textarea>
      </view>
      <view class="help-content" v-else>
        <u-parse :html="html"></u-parse>
      </view>
    </view>
    <view class="preview" v-if="showPreview">
      <u-parse :html="html"></u-parse>
    </view>
  </view>
</template>

<script>
import marked from "./marked";
import store from "@/store";

export default {
  name: "ly-markdown",
  props: {
    textareaData: {
      type: String,
      default: "",
    },
    textareaHtml: {
      type: String,
      default: "",
    },
    showPreview: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      screenHeight: 0,
      cursor: 0,
      text: this.textareaData,
      html: this.textareaHtml,
      show: true,
    };
  },
  watch: {
    text: function (newValue, oldValue) {
      this.html = marked(newValue);
      this.$emit("updateData", newValue);
      this.$emit("updateHtml", this.html);
    },
  },
  methods: {
    toolBarClick(type) {
      let str = "";
      if (type == "bold") {
        str += "\n **粗体文字**";
      } else if (type == "italic") {
        str += "\n*斜体*";
      } else if (type == "strike") {
        str += "\n~~中划线~~ ";
      } else if (type == "ma") {
        str += "\n``` 代码块 \n\n```";
      } else if (type == "link") {
        str += "\n[在此输入网址描述](在此输入网址)";
      } else if (type == "ul") {
        str += "\n- 无序排列 \n\n";
      } else if (type == "ol") {
        str += "\n1. 有序排列 \n\n";
      } else if (type == "image") {
        uni.chooseImage({
          count: 1,
          success: (res) => {
            uni.showLoading({
              title: "图片上传中",
            });

            uni.uploadFile({
              url: `${store.state.httpUrl}/api/m/upload/single`,
              filePath: res.tempFilePaths[0],
              name: "file",
              success: (uploadFileRes) => {
                uni.hideLoading();
                console.log(uploadFileRes);
                const back = JSON.parse(uploadFileRes.data);
                console.log(back);
                if (back.code == "200") {
                  console.log(back.data.path_url);
                  str += "![图像](" + back.data.path_url + ") ";
                  console.log(str);
                  this.insert(str);
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
      } else if (type == "clear") {
        uni.showModal({
          title: "提示",
          content: "确定清空?",
          success: (res) => {
            if (res.confirm) {
              this.text = "";
            }
          },
        });
      } else if (type == "preview") {
        this.show = false;
      } else if (type == "close") {
        this.show = true;
      }
      this.insert(str);
    },
    insert(str) {
      if (this.cursor <= this.text.length) {
        this.text =
          this.text.substring(0, this.cursor) +
          str +
          this.text.substring(this.cursor, this.text.length);
        this.cursor = this.cursor + str.length;
      } else {
        this.text += str;
        this.cursor = str.length;
      }
    },
    getCursor(e) {
      this.cursor = e.detail.cursor;
    },
  },
};
</script>

<style>
.input-content,
.help-content {
  height: 500rpx;
  width: 100%;
  background: #fff;
  padding: 20rpx 20rpx 40rpx;
  border: 1rpx solid #e0e0e0;
  border-top: none;
}

.input-content textarea {
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  font-size: 30rpx;
  line-height: 1.5;
}

.preview {
  width: 100%;
  padding-bottom: 40rpx;
}

.toolbar {
  width: 100%;
  border: none;
  background: #fff;
  border-bottom: 1rpx solid #e0e0e0;
  box-shadow: 0 0rpx 4rpx rgba(0, 0, 0, 0.157), 0 0rpx 4rpx rgba(0, 0, 0, 0.227);
}

.toolbar .iconfont {
  display: inline-block;
  cursor: pointer;
  line-height: 61.6rpx;
  width: 52rpx;
  margin: 10rpx 6rpxs;
  font-size: 28rpx;
  padding: 10rpx 30rpx 11rpx;
  color: #757575;
  border-radius: 11rpx;
  text-align: center;
  background: none;
  border: none;
  outline: none;
  line-height: 2.2;
  vertical-align: middle;
}

.close_box {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 30rpx 0 0;
}
</style>
