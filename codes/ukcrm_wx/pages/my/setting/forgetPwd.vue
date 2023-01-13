<template>
  <view class="login_detail">
    <u-toast ref="uToast"></u-toast>

    <view class="phone_form">
      <u--form
        ref="uForm"
        :model="userInfo"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item label="手机号" prop="phone">
          <u--input
            v-model="userInfo.phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u--input>
        </u-form-item>
      </u--form>
    </view>

    <view class="form_main">
      <u--form
        ref="uForm"
        :model="userInfo"
        :rules="rules"
        labelPosition="top"
        labelWidth="100"
      >
        <u-form-item label="验证码" prop="code" borderBottom>
          <u-input
            type="number"
            v-model="userInfo.code"
            maxlength="6"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
          >
            <template slot="suffix">
              <u-code
                ref="uCode"
                @change="codeChange"
                seconds="60"
                changeText="X秒重新获取"
              ></u-code>
              <u-button
                class="get_code"
                @click="getCode"
                :text="tips"
              ></u-button>
            </template>
          </u-input>
        </u-form-item>

        <u-form-item label="新密码" prop="pwd" borderBottom>
          <u--input
            type="password"
            v-model="userInfo.pwd"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
          ></u--input>
        </u-form-item>

        <u-form-item label="确认密码" prop="nPwd" borderBottom>
          <u--input
            type="password"
            v-model="userInfo.nPwd"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
          ></u--input>
        </u-form-item>
      </u--form>

      <view
        class="fixed_btm login_btn_box"
        :class="is_submit ? 'lightBtn' : 'btn'"
      >
        <u-button
          @click="submit"
          :loading="createLoading"
          :disabled="createLoading"
        >
          更改密码
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import { navBack } from "@/common/hooks";

export default {
  data() {
    return {
      userInfo: {
        phone: "",
        code: "",
        pwd: "",
        nPwd: "",
      },
      pin_code: "",
      tips: "获取验证码",
      rules: {
        phone: [
          {
            type: "number",
            required: true,
            message: "请输入手机号",
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
          message: "请输入验证码",
          trigger: ["blur", "change"],
        },
        pwd: {
          type: "string",
          required: true,
          message: "请输入新密码",
          trigger: ["blur", "change"],
        },
        nPwd: [
          {
            type: "string",
            required: true,
            message: "请输入确认密码",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return this.userInfo.pwd === value;
            },
            message: "两次输入密码不一致",
            trigger: ["blur"],
          },
        ],
      },
      createLoading: false,
    };
  },
  computed: {
    is_submit() {
      const { phone, code, pwd, nPwd } = this.userInfo;

      if (phone && code && pwd && nPwd) return true;

      return false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  onShow() {},
  methods: {
    nav(name) {
      this.$Router.push({
        name,
      });
    },
    codeChange(text) {
      this.tips = text;
    },
    getCode() {
      if (!this.userInfo.phone) {
        return this.$u.toast("手机号不能为空");
      } else if (!this.$u.test.mobile(this.userInfo.phone)) {
        return this.$u.toast("请输入手机号");
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
          phone: this.userInfo.phone,
        }).then((res) => {
          const {
            code,
            data: { pin_code, phone },
          } = res;
          if (code === 200) {
            this.pin_code = pin_code;
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

      this.$refs.uForm
        .validate()
        .then((res) => {
          this.createLoading = !this.createLoading;

          let info = this.userInfo;
          postData("/change_password_phone", {
            code: info.code,
            phone: info.phone,
            new_password: info.pwd,
            confirm_password: info.nPwd,
            change_key: this.pin_code,
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.createLoading = !this.createLoading;
              this.$refs.uToast.show({
                message: msg,
                complete() {
                  uni.navigateBack({ delta: 1 });
                },
              });
            } else if (code === 422) {
              this.createLoading = !this.createLoading;
              this.$u.toast(msg);
            }
          });
        })
        .catch(() => {
          this.createLoading = !this.createLoading;
        //   uni.$u.toast("更改失败，请重试");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.login_detail {
  padding: 0 0 130px;
  height: 100%;
  background-color: #fff;
}

.phone_form {
  padding: 20px 0;
  background-color: #e8e8e8;

  /deep/.u-form {
    padding: 0 20px;
    background-color: #fff;
  }
}
.form_main {
  position: relative;
  padding: 0 20px;
  background-color: #fff;
}

.login_btn_box {
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