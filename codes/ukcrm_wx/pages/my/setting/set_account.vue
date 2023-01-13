<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="tips"> 更换手机号后，下次登录需使用新的手机号登录 </view>

    <view class="account d-flex">
      <view class="l_name"> 当前账号 </view>
      <view class="r_txt"> {{ userInfo.phone || "暂无" }} </view>
    </view>

    <view class="tips change"> 更换手机号 </view>

    <view class="form_main">
      <u--form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="top"
        labelWidth="100"
      >
        <u-form-item label="手机号" prop="phone" borderBottom>
          <u--input
            v-model="info.phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            border="none"
          ></u--input>
        </u-form-item>

        <u-form-item label="验证码" prop="code" borderBottom>
          <u-input
            type="number"
            v-model="info.code"
            maxlength="6"
            placeholder="请输入验证码"
            border="none"
          >
            <template slot="suffix">
              <u-code
                ref="uCode"
                @change="codeChange"
                seconds="60"
                changeText="X秒重新获取"
              ></u-code>
              <u-button class="get_code" @tap="getCode" :text="tips"></u-button>
            </template>
          </u-input>
        </u-form-item>
      </u--form>

      <view
        class="fixed_btm btm_btn_box"
        :class="is_submit ? 'lightBtn' : 'btn'"
      >
        <u-button
          @click="submit"
          :loading="createLoading"
          :disabled="createLoading"
        >
          更换手机号
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
export default {
  data() {
    return {
      role_id: null,
      userInfo: {},
      info: {
        phone: "",
        code: "",
      },
      register_key: "",
      tips: "获取验证码",
      rules: {
        phone: [
          {
            type: "number",
            required: true,
            message: "请填写手机号",
            trigger: ["blur"],
          },
          {
            validator: (rule, value, callback) => {
              return this.$u.test.mobile(value);
            },
            message: "手机号码不正确",
            trigger: ["change", "blur"],
          },
        ],

        code: {
          type: "number",
          required: true,
          message: "请填写验证码",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  computed: {
    is_submit() {
      const { phone, code } = this.info;
      let flag = false;

      if (phone && code) {
        flag = true;
      }
      return flag;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      getData(`/user`).then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.userInfo = user;
        }
      });
    },
    codeChange(text) {
      this.tips = text;
    },
    getCode() {
      if (!this.info.phone) {
        return this.$u.toast("手机号不能为空");
      } else if (!this.$u.test.mobile(this.info.phone)) {
        return this.$u.toast("请填写手机号");
      }

      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: "正在获取验证码",
        });

        uni.hideLoading();
        uni.$u.toast("验证码已发送");
        this.$refs.uCode.start();

        postData("/login/sendcode", {
          phone: this.info.phone,
        }).then((res) => {
          const {
            code,
            data: { pin_code, phone },
          } = res;
          if (code === 200) {
            this.register_key = pin_code;
          } else if (code === 422) {
            this.$refs.uCode.reset();

            if (phone) {
              this.$u.toast(phone[0]);
            }
          }
        });
      } else {
        // uni.$u.toast("倒计时结束后再发送");
      }
    },

    submit() {
      if (!this.is_submit) return;

      // 同意
      this.$refs.uForm.validate().then((res) => {
        this.createLoading = !this.createLoading;

        postData("/user/change_phone", {
          phone: this.info.phone,
          code: this.info.code,
          change_key: this.register_key,
        })
          .then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.createLoading = !this.createLoading;
              this.init();
              let _th = this;

              this.$refs.uToast.show({
                message: msg,
                complete() {
                  _th.$Router.replaceAll({
                    name: "login",
                  });
                },
              });
            } else if (code === 422) {
              this.createLoading = !this.createLoading;
              this.$u.toast(msg);
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
            // uni.$u.toast("注册失败，请重试");
          });
      });
    },
    nav(name) {
      this.$Router.push({
        name: name,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 130px;
  height: 100%;
  background-color: #fff;
}
.tips {
  padding: 15px 20px;
  background-color: #f7f8fa;

  font-size: 12px;
  font-weight: 400;
  color: #999999;
}

.change {
  padding: 40px 20px 20px;
  font-size: 18px;
  font-weight: 600;
  color: #333333;
}

.account {
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;

  .l_name {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }

  .r_txt {
    font-size: 14px;
    color: #666666;
  }
}

.form_main {
  padding: 20px;
}

.btm_btn_box {
  margin-top: 100px;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

/deep/ .get_code {
  width: 80px;
  height: 32px;
  background: rgba(255, 255, 255, 0.39);
  border: 1px solid #bbbbbb;
  opacity: 1;
  border-radius: 4px;
}
/deep/.u-form-item__body {
  padding-left: 0 !important;
  }
</style>