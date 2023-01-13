<template>
  <view class="login_detail">
    <u-navbar bgColor="transparent" title="友客帮" leftIcon=" " fixed>
    </u-navbar>

    <view class="top_bgc"> </view>

    <view class="form_main">
      <view class="top_txt">
        <view class="login_txt"> 登录 </view>
        <view class="login_txt"> 欢迎使用友客帮 </view>
      </view>

      <!-- {{cid ? cid : '暂无cid'}} -->
      <!-- {{clientInfo ? clientInfo : '暂无clientInfo'}} -->

      <u--form
        class="form_box"
        ref="uForm"
        :model="userInfo"
        :rules="rules"
        labelPosition="top"
        labelWidth="100"
      >
        <u-form-item label="手机号" prop="phone" borderBottom>
          <u--input
            v-model="userInfo.phone"
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
            border="none"
            @input="moneyIpt($event)"
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
      </u--form>

      <view class="login_links d-flex">
        <view class="item" @click="nav('register')"> 注册账号 </view>
        <view class="item d-flex" @click="nav('forgetPwd')">
          <i class="icon iconfont icon-wjmm"></i>
          忘记密码
        </view>
      </view>

      <view class="login_btn_box" :class="is_submit ? 'lightBtn' : 'btn'">
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
          立即登录
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
      clientInfo: {},

      createLoading: false,
      userInfo: {
        phone: "",
        pwd: "",
      },
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
        pwd: {
          type: "string",
          required: true,
          message: "请填写密码",
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
    this.clientInfo = clientInfo;
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

    moneyIpt(e) {
      // e = e.match(/\d+\.?\d{0,2}/) ? e.match(/\d+\.?\d{0,2}/)[0] : "";
      e = e.replace(/[^\d]/g, "");

      //重新赋值给input
      this.$nextTick(() => {
        this.userInfo.phone = e;
      });
    },

    nav(name) {
      this.$Router.push({
        name,
      });
    },

    submit() {
      if (!this.is_submit) return;

      // 同意
      this.$refs.uForm.validate().then((res) => {
        if (!this.is_submit) {
          return uni.showToast({
            title: "点击同意，登录",
            icon: "none",
          });
        }

        this.createLoading = !this.createLoading;
        postData("/login", {
          phone: this.userInfo.phone,
          password: this.userInfo.pwd,
          cid: this.cid,
        })
          .then((res) => {
            const { code, data } = res;
            if (code === 200) {
              uni.$u.toast(data.msg);

              this.$u.vuex("vuex_user", data.user);
              this.$u.vuex("vuex_token", data.jwt_token);

              // 暂无企业  选择加入、创建企业
              this.$Router.replaceAll({
                name: "home",
              });
            } else if (code === 422) {
              this.createLoading = !this.createLoading;
              this.$u.toast(data.msg);
            }
          })
          .catch(() => {
            // uni.$u.toast("登陆失败，请重试");
            this.createLoading = !this.createLoading;
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_detail {
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

// 忘记密码
.login_links {
  justify-content: space-between;
  margin: 20px 0;

  .item {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 1;

    .iconfont {
      margin-right: 5px;
    }
  }
}

.login_btn_box {
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

/deep/.u-form-item__body {
  padding-left: 0 !important;
}

/deep/.u-form-item__body__left__content__label {
  color: #333 !important;
}
</style>