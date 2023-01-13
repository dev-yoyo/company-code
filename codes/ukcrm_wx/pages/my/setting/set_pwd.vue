<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="top_bgc">
      <view class="account d-flex">
        <view class="l_name"> 当前账号 </view>
        <view class="r_txt"> {{ userInfo.phone || "暂无" }} </view>
      </view>
    </view>

    <view class="form_main">
      <u--form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="top"
        labelWidth="100"
      >
        <u-form-item label="原密码" prop="oldPwd" borderBottom>
          <u--input
            :password="true"
            v-model="info.oldPwd"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
          ></u--input>
        </u-form-item>

        <u-form-item label="新密码" prop="pwd" borderBottom>
          <u--input
            :password="true"
            v-model="info.pwd"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
          ></u--input>
        </u-form-item>

        <u-form-item label="确认密码" prop="npwd" borderBottom>
          <u--input
            :password="true"
            v-model="info.npwd"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
          ></u--input>
        </u-form-item>
      </u--form>

      <view class="forget_box d-flex">
        <view class="item d-flex" @click="nav('forgetPwd')">
          <i class="icon iconfont icon-wjmm"></i>
          忘记密码
        </view>
      </view>

      <view
        class="login_btn_box fixed_btm"
        :class="is_submit ? 'lightBtn' : 'btn'"
      >
        <u-button @click="submit"> 更改密码 </u-button>
      </view>
    </view>

    <u-modal :show="tipShow" width="240px" :showConfirmButton="false">
      <view class="tip_box slot-content">
        <view class="icon_box">
          <i class="t-icon iconfont t-icon-guo-l"></i>
        </view>
        <view class="content">密码修改成功,请重新登录</view>

        <view class="content">{{ endNum }}s</view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
export default {
  data() {
    return {
      userInfo: {},
      tipShow: false,
      endNum: 3,
      tipInner: "", // 跳转定时器

      info: {
        phone: "",
        oldPwd: "",
        pwd: "",
        npwd: "",
      },
      rules: {
        oldPwd: {
          type: "string",
          required: true,
          message: "请输入原密码",
          trigger: ["blur", "change"],
        },
        pwd: {
          type: "string",
          required: true,
          message: "请输入新密码",
          trigger: ["blur", "change"],
        },
        npwd: [
          {
            type: "string",
            required: true,
            message: "请输入确认密码",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return this.info.pwd === value;
            },
            message: "两次输入密码不一致",
            trigger: ["blur"],
          },
        ],
      },
    };
  },
  computed: {
    is_submit() {
      let info = this.info;

      if (info.oldPwd && info.pwd && info.npwd) return true;

      return false;
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

    nav(name) {
      this.$Router.push({
        name,
      });
    },

    submit() {
      if (!this.is_submit) return;

      this.$refs.uForm.validate().then((res) => {
        postData("/user/change_password", {
          password: this.info.oldPwd,
          new_password: this.info.pwd,
          confirm_password: this.info.npwd,
        })
          .then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$u.vuex("vuex_user", "");
              this.$u.vuex("vuex_token", "");

              let _th = this;
              this.tipShow = true;
              this.tipInner = setInterval(() => {
                _th.endNum--;

                if (this.endNum <= 0) {
                  clearInterval(this.tipInner);
                  _th.$Router.replace({
                    name: "login",
                  });
                }
              }, 1000);
            } else if (code === 422) {
              this.$u.toast(msg);
            }
          })
          .catch((errors) => {
            // uni.$u.toast("校验失败");
          });
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

.top_bgc {
  padding: 10px 0 20px;
  background-color: #f7f8fa;

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
}

.form_main {
  position: relative;
  padding: 0 20px;
  background-color: #fff;
}

// 忘记密码
.forget_box {
  margin-top: 10px;
  justify-content: flex-end;
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  color: #666666;

  .item {
    justify-content: flex-end;
    font-size: 14px;
    font-weight: 400;
    line-height: 1;
    color: #666666;

    .iconfont {
      margin-right: 8px;
    }
  }
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

/deep/.u-form-item__body {
  padding-left: 0 !important;
}

.tip_box {
  text-align: center;
  font-size: 13px;
  color: #333;

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