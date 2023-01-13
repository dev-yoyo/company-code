<template>
  <view class="content_detail">
    <u-toast ref="uToast"></u-toast>

    <u-navbar title="注册" bgColor="transparent" :autoBack="true" fixed>
    </u-navbar>

    <view class="top_bgc"> </view>

    <view class="form_main">
      <view class="top_txt">
        <view class="login_txt"> 注册 </view>
        <view class="login_txt"> 欢迎使用友客帮 </view>
      </view>

      <u--form
        ref="uForm"
        :model="userInfo"
        :rules="rules"
        labelPosition="top"
        labelWidth="100"
      >
        <u-form-item label="姓名" prop="name" borderBottom>
          <u--input
            v-model="userInfo.name"
            placeholder="请输入姓名"
            border="none"
          ></u--input>
        </u-form-item>

        <u-form-item label="手机号" prop="phone" borderBottom>
          <u--input
            v-model="userInfo.phone"
            type="number"
            maxlength="11"
            placeholder="请输入手机号"
            border="none"
          ></u--input>
        </u-form-item>

        <u-form-item label="密码" prop="pwd" borderBottom>
          <u--input
            type="password"
            v-model="userInfo.pwd"
            placeholder="请输入密码"
            border="none"
          ></u--input>
        </u-form-item>

        <u-form-item label="验证码" prop="code" borderBottom>
          <u-input
            type="number"
            v-model="userInfo.code"
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

      <view class="btm_btn_box" :class="is_submit ? 'lightBtn' : 'btn'">
        <view class="check_read d-flex">
          <u-checkbox-group v-model="checked" placement="column">
            <u-checkbox
              v-for="(item, index) in checkboxList"
              :key="index"
              :label="item.name"
              :name="item.name"
              shape="circle"
            >
            </u-checkbox>
          </u-checkbox-group>

          我已阅读并同意
          <text class="agreement" @click="show('1')"> 《服务协议》</text>
          <text @click="show('2')">《隐私政策》</text>
        </view>

        <u-button
          @click="submit"
          :loading="createLoading"
          :disabled="createLoading"
        >
          立即注册
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
      cid: "",
      createLoading: false,
      bgColor: "transparent",
      userInfo: {
        name: "",
        phone: "",
        pwd: "",
        code: "",
      },
      register_key: "",
      tips: "获取验证码",
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "请输入姓名",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 4) {
                return false;
              }
            },
            message: "姓名限制4个字符",
            trigger: ["change", "blur"],
          },
        ],
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
        pwd: {
          type: "string",
          required: true,
          message: "请输入密码",
          trigger: ["blur", "change"],
        },
        code: {
          type: "number",
          required: true,
          message: "请输入验证码",
          trigger: ["blur", "change"],
        },
      },
      checked: false,
      checkboxList: [{ name: "" }],
    };
  },
  computed: {
    is_submit() {
      return this.checked.length > 0 ? true : false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  onShow() {
    //#ifdef APP-PLUS
    // app 获取设备cid
    const clientInfo = plus.push.getClientInfo();
    this.cid = clientInfo.clientid;
    //#endif
  },
  methods: {
    show(type) {
      if (type == 1) {
        this.$Router.push({
          name: "agreement",
        });
      } else {
        this.$Router.push({
          name: "privacy",
        });
      }
    },
    codeChange(text) {
      this.tips = text;
    },
    getCode() {
      if (!this.userInfo.name) {
        return this.$u.toast("请输入姓名");
      } else if (!this.userInfo.phone) {
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

        postData("/login/sendsmspin", {
          name: this.userInfo.name,
          phone: this.userInfo.phone,
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
          }else {
            this.$u.toast(msg);
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
        let consent = this.checked.length > 0 ? true : false;
        if (!consent) {
          return uni.showToast({
            title: "点击同意，登录",
            icon: "none",
          });
        }

        this.createLoading = !this.createLoading;

        getData("/login/register", {
          params: {
            name: this.userInfo.name,
            phone: this.userInfo.phone,
            password: this.userInfo.pwd,
            code: this.userInfo.code,
            register_key: this.register_key,
            cid: this.cid,
          },
        })
          .then((res) => {
            const { code, data } = res;
            if (code === 200) {
              this.createLoading = !this.createLoading;
              let _th = this;

              this.$refs.uToast.show({
                message: data.msg,
                complete() {
                  _th.$u.vuex("vuex_user", data.user_info);
                  _th.$u.vuex("vuex_token", data.jwt_token);
                  _th.$u.vuex("status", 1);

                  _th.$Router.replace({
                    name: "choose_company",
                    from: "login",
                  });
                },
              });
            } else if (code === 422) {
              this.createLoading = !this.createLoading;
              this.$u.toast(data.msg);
            }else {
              this.$u.toast(msg);
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
            // uni.$u.toast("注册失败，请重试");
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content_detail {
  padding: 0 20px;
  height: 100%;
  background-color: #fff;
}

.top_bgc {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 253px;
  background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/20220303-101916.png)
    no-repeat;
  background-size: 100% 100%;
  z-index: 1;
}

.form_main {
  position: relative;
  z-index: 2;

  .top_txt {
    padding: 149px 0 24px;

    .login_txt {
      font-size: 28px;
      font-weight: 600;
      line-height: 40px;
      color: #333333;
    }
  }
}

.btm_btn_box {
  margin-top: 100px;

  .check_read {
    justify-content: center;
    margin-bottom: 10px;
    font-size: 14px;

    text {
      color: #4d6fff;
    }

    .agreement {
      margin-left: 3px;
    }
  }

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

/deep/.u-form-item__body__left__content__label {
  color: #333 !important;
}
</style>