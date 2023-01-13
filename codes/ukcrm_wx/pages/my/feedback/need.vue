<template>
  <view class="feedback_need">
    <u-toast ref="uToast"></u-toast>
    <view class="title">需求描述</view>

    <u-form
      ref="uForm"
      :model="info"
      :rules="rules"
      labelPosition="top"
      labelWidth="100"
    >
      <u-form-item label=" " prop="describe" borderBottom>
        <u--textarea
          v-model="info.describe"
          placeholder="请描述关于您对产品的需求意见"
          placeholderStyle="#999999"
          fontSize="14"
          border="none"
          maxlength="-1"
        ></u--textarea>
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
      >
        提交
      </u-button>
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
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      cancelStyle: store.state.cancelStyle,
      tipShow: false,

      info: {
        describe: "",
      },

      rules: {
        describe: {
          type: "string",
          required: true,
          message: "请输入问题描述",
          trigger: ["blur", "change"],
        },
      },
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },

  methods: {
    create() {
      // if (this.describe == '') {
      //   this.$u.toast("需求描述不能为空")
      //   return
      // }
      this.$refs.uForm.validate().then((res) => {
        this.createLoading = !this.createLoading;

        postData("/bug", {
          type: 1,
          describe: this.info.describe,
        })
          .then((res) => {
            let _th = this;
            const { code, data } = res;
            if (code === 200) {
              _th.createLoading = !_th.createLoading;

              this.tipShow = true;
              setTimeout(() => {
                uni.navigateBack({ delta: 1 });
              }, 3000);
            } else if (code === 422) {
              this.$u.toast(data.msg);
              this.createLoading = !this.createLoading;
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
          });
      });
    },

    cancel() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="less" scoped>
.feedback_need {
  .title {
    font-size: 13px;
    font-weight: 400;
    line-height: 18px;
    color: #333333;
    padding: 16px 20px 9px;
  }

  /deep/.u-form-item__body {
    padding: 0 !important;
  }

  /deep/.u-textarea {
    border-radius: 0;
    padding: 20px;
    textarea {
      height: 400px !important;
    }
  }

  /deep/.u-form-item__body__right__message {
    padding-left: 20px !important;
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