<template>
  <div class="login">
    <div class="main-box">
     <div class="content">
        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/login/register_bg_login.png" alt="" class="cooperation-img">
        <div class="login-right">
          <h3>项目后台登录</h3>
          <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="left" >
            <el-form-item prop="account" label="账号：" class="username">
              <el-input
                v-model="form.account"
                placeholder="请输入账号"
              ></el-input>
            </el-form-item>
            <el-form-item prop="pwd" label="密码：" class="password">
              <el-input
                v-model="form.pwd"
                type="pwd"
                placeholder="请输入密码"
                @keydown.enter.native="keyDown"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="login" class="btn" :loading="createLoading" :disabled="createLoading" >登录</el-button>
            </el-form-item>
          </el-form>
        </div>
        
     </div>
     
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { login, getData } from "@/api/user";
import toReviewVue from '../workbench/team/component/to-review.vue';

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

    return {
      createLoading: false,
      form: {
        account: "",
        pwd: "",
      },
      rules:{
        account:[{  message: "账号不能为空", trigger: ['blur','change']}],
        pwd:[{  message: "密码不能为空", trigger: ['blur','change'] }]
      }
    };
  },
  methods: {
    keyDown(e){
      if (e.keyCode == 13 || e.keyCode == 100) {
        this.login(); 
      }
    },
    login() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          login({
            account: this.form.account,
            password: this.form.pwd,
          }).then((res) => {
            const {
              code
            } = res;
            this.createLoading = !this.createLoading;
            if (code == 200) {
              localStorage.setItem('login',true)
              this.$router.push('/workbench/project')
            } else {
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
  background-image: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/login/register_bg.png');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  .main-box{
    width: 1300px;
    margin: auto;
    height: 628px;
    .content{
      height: 100%;
      display: flex;
      // align-items: flex-start;
      box-shadow: 0 0 6px 2px #ccc;
      .cooperation-img {
        width: 795px;
        height: auto;
      }
      .login-right{
        flex: 1;
        padding: 72px 76px 0 74px;
        background: #fff;
        h3{
          font-size: 18px;
          margin-bottom: 113px;
        }
        .username{
          margin-bottom: 44px!important;
        }
        .password{
          margin-bottom: 109px!important;
        }
        .el-form-item__label{
          text-align-last: justify;
        }
           
        .btn{
          margin: 0 auto;
          width: 200px;
          // height: 32px;
          // line-height: 32px;
         
        }
      }
    }
  
  }


}
.el-form-item__error {
  padding-top: 4px!important;
}
</style>