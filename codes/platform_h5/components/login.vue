<template>
  <view>
    <u-popup
      v-model="loginShow"
      mode="center"
      border-radius="16"
      :mask-close-able="false"
    >
      <view class="popup">
        <view class="top_tit">
          <text>绑定手机号</text>

          <i class="icon iconfont icon-e-cha1" @click="close"></i>
        </view>

        <view>
          <u-field
            v-model="phone"
            label-width="0"
            placeholder="输入手机号"
            maxlength="11"
            placeholder-style="color:#C7C5C5"
            :error-message="errtelMsg"
            trim
          >
          </u-field>

          <u-field
            v-model="code"
            label-width="0"
            placeholder="输入验证码"
            placeholder-style="color:#C7C5C5"
            maxlength="6"
            :error-message="errCodeMsg"
            trim
          >
            <view class="code_btn" slot="right" @click="getCode">
              {{ codeText }}
            </view>
          </u-field>

          <u-verification-code
            ref="uCode"
            :seconds="seconds"
            :keep-running="true"
            @change="codeChange"
          ></u-verification-code>
        </view>

        <u-button class="btn" @click="login">确定绑定</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script>
import store from "@/store";
// import { mapGetters } from "vuex";

export default {
  // props: ["show"],
  data() {
    return {
      seconds: 60,
      phone: "",
      code: "",
      key: "",
      register_key: "",
      codeText: "获取验证码",
      errtelMsg: "",
      errCodeMsg: "",
    };
  },
  created() {
    // console.log("login >>>>>>", store.state.status);
    // console.log("loginShow >>>", this.loginShow);
  },
  computed: {
    // ...mapGetters(["loginShow"]),
    loginShow: {
      get() {
        return store.state.loginShow;
      },
      set(val) {
        return store.state.loginShow;
      },
    },
  },
  methods: {
    close() {
      this.$emit("closePopup");
      this.$u.vuex("loginShow", false);

      this.phone = "";
      this.code = "";
    },
    getCode() {
      if (!this.$u.test.mobile(this.phone)) {
        return this.$u.toast("手机号格式不正确");
      } else if (!this.phone) {
        return this.$u.toast("手机号不能为空");
      }

      uni.showLoading({
        title: "正在获取验证码",
      });

      if (this.$refs.uCode.canGetCode) {
        // 模拟向后端请求验证码
        uni.showLoading({
          title: "正在获取验证码",
        });
        setTimeout(() => {
          uni.hideLoading();
          // 通知验证码组件内部开始倒计时
          this.$refs.uCode.start();

          this.$u.api
            .sendCode({
              phone: this.phone,
              openid: store.state.openid,
              provider: store.state.provider,
            })
            .then((res) => {
              const {
                code,
                data: { key, pin_code, phone },
              } = res;
              if (code === 200) {
                this.key = key;
                this.register_key = pin_code;
              } else if (code === 422) {
                this.$refs.uCode.reset();

                if (phone) {
                  this.$u.toast(phone[0]);
                }
              }
            });
        }, 1000);
      } else {
        this.$u.toast("倒计时结束后再发送");
      }
    },
    codeChange(text) {
      this.codeText = text;
    },
    async login() {
      if (!this.$u.test.mobile(this.phone)) {
        return this.$u.toast("手机号格式不正确");
      } else if (!this.phone) {
        return this.$u.toast("手机号不能为空");
      }

      if (!this.$u.test.code(this.code, 6)) {
        return this.$u.toast("验证码格式不正确");
      } else if (!this.code) {
        return this.$u.toast("验证码不能为空");
      }

      await this.$u.api
        .codeLogin({
          nickname: "昵称昵称",
          code: this.code,
          key: this.key,
          register_key: this.register_key,
        })
        .then((res) => {
          const {
            code,
            data: {
              data: { jwt_token, userAuth },
              message,
            },
          } = res;
          if (code === 200) {
            this.close();
            this.$u.vuex("vuex_user", userAuth);
            this.$u.vuex("vuex_token", jwt_token);
            this.$u.vuex("status", 1);
          } else if (code === 422) {
            this.$u.toast(message);
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.popup {
  padding: 50rpx;
  width: 642rpx;

  .btn {
    margin-top: 74rpx;
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    background: #0268fa;
    border-radius: 44rpx;
  }

  .code_btn {
    padding: 0 20rpx;
    height: 64rpx;
    line-height: 64rpx;
    font-size: 28rpx;
    font-weight: 400;
    color: #0268fa;
    background: #ffffff;
    border: 2rpx solid #005ef4 !important;
    border-radius: 8rpx;
  }
}

.top_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 70rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1;

  .iconfont {
    font-size: 16rpx;
    color: #999999;
  }
}
</style>