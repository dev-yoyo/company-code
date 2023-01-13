<template>
  <view class="feedback_use">
    <u-toast ref="uToast"></u-toast>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="top"
        labelWidth="100"
      >
        <view class="item d-between" @click="show = true">
          <text class="label">设备类型</text>
          <u-picker
            :show="show"
            :columns="columns"
            @confirm="confirm"
            @cancel="close"
          ></u-picker>
          <view class="d-flex">
            <text class="val">{{ info.type }}</text>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </view>
        </view>

        <u-form-item label="问题描述" prop="describe" borderBottom>
          <u--textarea
            v-model="info.describe"
            :placeholder="place"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            maxlength="-1"
            :focus="is_focus"
            @focus="focusIpt"
            @blur="blurIpt"
          ></u--textarea>
        </u-form-item>

        <u-form-item label="界面截图">
          <view class="add_logo">
            <u-upload
              :fileList="fileList"
              @afterRead="afterRead"
              width="68"
              height="68"
              multiple
              @delete="deletePic"
            >
              <view class="upload_box d-flex">
                <i class="icon iconfont icon-tj4"></i>
              </view>
            </u-upload>
          </view>
        </u-form-item>
      </u-form>

      <view class="new_fixed_btm">
        <u-button type="default" @click="cancel" :customStyle="cancelStyle">
          取消
        </u-button>

        <u-button
          @click="create"
          color="#4D6FFF"
          :loading="createLoading"
          :disabled="createLoading"
          :class="is_submit ? 'lightBtn' : 'btn'"
        >
          提交
        </u-button>
      </view>
    </view>

    <u-modal :show="tipShow" width="240px" :showConfirmButton="false">
      <view class="tip_box slot-content">
        <view class="icon_box">
          <i class="t-icon iconfont t-icon-guo-l"></i>
        </view>

        <view class="content">提交成功</view>
        <view class="content">谢谢您的反馈，我们会及时处理</view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import config from "@/common/config";
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      cancelStyle: store.state.cancelStyle,
      show: false,
      is_focus: false,
      tipShow: false,

      info: {
        type: "IOS",
        describe: "",
        thumb: [],
      },
      rules: {
        describe: {
          type: "string",
          required: true,
          message: "请输入问题描述",
          trigger: ["blur", "change"],
        },
      },
      fileList: [],
      columns: [["IOS", "Android"]],
      place: `请描述你遇到的问题：\n\n在哪个界面，操作了什么功能，遇到了什么问题 \n\n问题发生的频率怎么样`,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  methods: {
    // 删除图片
    deletePic(e) {
      this.fileList.splice(e.index, 1);
      this.info.thumb.splice(e.index, 1);
    },
    // 新增图片
    async afterRead(event) {
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      uni.showLoading({
        title: "上传中",
        mask: true,
      });

      let lists = [].concat(event.file);
      await this.uploadFilePromise(lists, 0);
    },
    focusIpt() {
      this.is_focus = true;
    },

    blurIpt() {
      this.is_focus = false;
    },
    uploadFilePromise(list, index) {
      let _th = this;
      if (index > list.length) {
        uni.hideLoading();
        return;
      }

      uni.uploadFile({
        url: `${config.baseUrl}/api/single`,
        filePath: list[index].url,
        name: "file",
        fileType: "image",
        success: (uploadFileRes) => {
          const {
            code,
            data: { path_url, msg },
          } = JSON.parse(uploadFileRes.data);
          if (code === 200) {
            _th.info.thumb.push(path_url);


            _th.fileList.splice(
              _th.info.thumb.length,
              1,
              Object.assign(
                {},
                {
                  status: "success",
                  message: "",
                  url: path_url,
                }
              )
            );


            if (index < list.length - 1) {
              _th.uploadFilePromise(list, index + 1);
            } else {
              uni.hideLoading();
            }
          } else if (code === 422) {
            uni.$u.toast(msg);
            _th.fileList.splice(index, 1);
          } else {
            uni.$u.toast(msg);
            _th.fileList.splice(index, 1);
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.$u.toast("上传失败，请重试！");
        },
      });
    },
    confirm(e) {
      this.info.type = e.value[0];
      this.show = false;
    },
    close() {
      this.show = false;
    },
    cancel() {
      uni.navigateBack({ delta: 1 });
    },
    // 提交
    create() {
      this.$refs.uForm
        .validate()
        .then((res) => {
          this.createLoading = !this.createLoading;

          postData("/bug ", {
            img: this.info.thumb,
            type: 0,
            equipment: this.info.type == "IOS" ? 1 : 0,
            describe: this.info.describe,
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              let _th = this;
              _th.createLoading = !_th.createLoading;
              this.tipShow = true;
              setTimeout(() => {
                uni.navigateBack({ delta: 1 });
              }, 3000);
            } else if (code === 422) {
              this.$u.toast(msg);
              this.createLoading = !this.createLoading;
            }
          });
        })
    },
  },
};
</script>

<style lang="less" scoped>
.feedback_use {
  .item {
    height: 52px;
    margin-top: 10px;
    padding: 0 20px 0 26px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #666666;
    background: #fff;
    margin-bottom: 1px;
    .val {
      margin-right: 15px;
      color: #333;
    }
    .icon {
      color: #c3c3c3;
    }
  }
  /deep/.u-textarea {
    border-radius: 0;
    padding: 0 0 24px;
    textarea {
      height: 120px !important;
    }
  }

  /deep/ .u-form-item__body__right__message {
    padding-left: 26px;
  }

  /deep/.u-form-item__body__left__content__label {
    color: #333 !important;
  }

  // 上传logo
  .upload_box {
    justify-content: center;
    width: 68px;
    height: 68px;
    background: #f4f4f4;
    border-radius: 4px;
    color: #666666;
    font-size: 17px;

    .iconfont {
      font-weight: 400;
      color: #c3c3c3;
    }
  }

  /deep/ .u-upload__deletable {
    height: 24px !important;
    width: 24px !important;
  }

  /deep/ .uicon-close {
    font-size: 20px !important;
    top: 7px !important;
  }

  .new_fixed_btm {
    justify-content: space-around;

    /deep/.u-button {
      width: 100%;
      height: 45px;
      background: #e8e8e8;
      border-radius: 23px;
      color: #fff;
    }
  }
}

.tip_box {
  text-align: center;
  font-size: 13px;
  color: #333;
  white-space: nowrap;

  .icon_box {
    .iconfont {
      font-size: 30px;
      color: #4d6fff;
      width: 30px;
      height: 30px;
    }
  }

  .content {
    margin-top: 10px;
    font-size: 14px;
    color: #333;
  }
}
</style>