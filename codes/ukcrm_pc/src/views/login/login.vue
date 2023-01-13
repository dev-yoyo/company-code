<template>
  <div class="login">
    <div class="main_box">
      <div class="login_box">
        <img class="logo" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/ykb-logo.png"/>
        <div class="login_title">欢迎使用友客帮！</div>
        <el-form ref="form" :model="form" :rules="rules" label-width="0">
          <el-form-item prop="phone">
            <div class="label">账号</div>
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <div class="label">密码</div>
            <el-input
              v-model="form.pwd"
              type="password"
              placeholder="请输入密码"
              @keydown.enter.native="login"
             show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login" class="btn" :loading="createLoading" :disabled="createLoading">登录</el-button>
          </el-form-item>
        </el-form>
        <div class="login_other d-between">
          <router-link class="action" to="/register">注册账号</router-link>
          <router-link class="action" to="/forget">忘记密码？</router-link>
        </div>
      </div>
      <div class="login_agree">登录即代表同意<router-link class="action" to="/agreement">《用户协议》</router-link>及<router-link class="action" to="/policy">《隐私政策》</router-link></div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { login, getData } from "@/api/user";

export default {
  name: "login",
  data() {

    let isCellPhone = (val) => {
      if (!/^1[3456789]\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    }

    let checkphone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号码不能为空"));
      } else if (!isCellPhone(value)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    }

    return {
      createLoading: false,
      form: {
        // phone: "18652070270",
        // pwd: "123456aa",
        phone: "",
        pwd: "",
      },
      rules:{
        phone:[{ validator: checkphone, trigger: ['blur','change'] }],
        pwd:[{ required: true, message: "密码不能为空", trigger: ['blur','change'] }]
      }
    };
  },
  methods: {
    ...mapActions(["handleLogin"]),
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          login({
            phone: this.form.phone,
            password: this.form.pwd,
          }).then((res) => {
            const {
              code,
              data: { jwt_token, user, msg,phone,password },
            } = res;
            if (code === 200) {
              this.handleLogin({jwt_token, user});
            } else if (code === 422) {
              this.createLoading = false;
              if(password) {
                this.$err(password[0]);
              }else if(phone) {
                this.$err(phone[0]);
              }else {
                this.$err(msg);
              } 
            } else {
              this.createLoading = false;
              this.$err(msg);
            } 
          });
        }
      });
    },
  },
};
</script>

<style lang="less">
.login {
  width: 100%;
  height: 100vh;
  background-image: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/20220421-085233.png');
  background-size: cover;
  background-position: center;
  position: relative;

  .main_box {
    position: absolute;
    top: 50%;
    right: 20%;
    transform: translate(0,-50%);

    .login_box {
      width: 380px;
      height: auto;
      background: #fff;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 18px;
      padding: 68px 42px 64px;
    }

    .login_title {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #464C5B;
      margin-bottom: 4px;
    }
    .login_tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }

    .label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #464C5B;
      margin-bottom: 12px;
    }

    .el-form-item {
      margin-top: 40px;
      margin-bottom: 0;
    }

    .el-input__inner,
    .el-input__inner:focus,
    .el-input__inner:hover {
      border-top: none!important;
      border-left: none!important;
      border-right: none!important;
      border-radius: 0;
      padding: 0;
      box-shadow:none 
    }

    .btn {
      width: 298px;
      height: 42px;
      background: #4D6FFF;
      border-color: #4D6FFF;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #FFFFFF;
    }

    .login_other {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      margin-top: 16px;
      cursor: pointer;
    }

    .login_agree {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color:#657180;
      margin-top: 30px;
    }

    .action {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #3399FF;
      cursor: pointer;
      text-decoration: none;
    }
  }
}
.el-form-item__error {
  padding-top: 4px!important;
}
</style>