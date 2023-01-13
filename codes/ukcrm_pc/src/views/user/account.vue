<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <left-menu ></left-menu>
      <top-nav active_title="个人中心"></top-nav>

      <div class="content_main">
        <div class="account">
          <el-tabs v-model="active">
            <el-tab-pane label="账号设置" name="account">
              <el-form
                :model="form"
                ref="form"
                :rules="rules"
                label-width="60px"
                class="demo-form"
              >
                <el-form-item label="当前账号">
                  <div class="text">{{info.phone}}</div>
                  <p class="tip d-flex"><i class="iconfont icon-ykb-zy"></i>更换手机号后，下次登录需要新得手机号登录</p>
                </el-form-item>

                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="form.phone" placeholder="请输入"></el-input>
                </el-form-item>

                <el-form-item label="验证码" prop="code">
                  <div class="code_box d-between">
                    <el-input class="code" v-model="form.code" placeholder="请输入"></el-input>
                    <el-button
                      type="text"
                      class="get_q_code"
                      :disabled="timeout"
                      @click="get_code"
                    >
                      {{ q_code_msg }}
                    </el-button>
                  </div>
                </el-form-item>

                <el-form-item>
                  <div class="btns">
                    <el-button
                      class="btn"
                      @click="submitForm"
                      :loading="createLoading"
                      :disabled="createLoading"
                    >
                      保存
                    </el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="密码设置" name="password">
              <el-form
                :model="form_pwd"
                ref="form_pwd"
                :rules="rules_pwd"
                label-width="60px"
                class="demo-form"
              >
                <el-form-item label="当前账号">
                  <div class="text">{{info.phone}}</div>
                </el-form-item>

                <el-form-item label="原密码" prop="oldPwd">
                  <el-input v-model="form_pwd.oldPwd" placeholder="请输入" type="password" show-password></el-input>
                </el-form-item>

                <el-form-item label="新密码" prop="pwd">
                  <el-input v-model="form_pwd.pwd" placeholder="请输入" type="password" show-password></el-input>
                </el-form-item>

                <el-form-item label="确认密码" prop="npwd">
                  <el-input v-model="form_pwd.npwd" placeholder="请输入" type="password" show-password></el-input>
                </el-form-item>

                <div class="other">
                  <span @click="forget_pwd">忘记密码？</span>
                </div>

                <el-form-item>
                  <div class="btns">
                    <el-button
                      class="btn"
                      @click="submit"
                      :loading="createLoading"
                      :disabled="createLoading"
                    >
                      保存
                    </el-button>
                  </div>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <forget ref="add" v-if="visible"  @cancel="hideadd"></forget>
  </div>
</template>

<script>

import { postData, getData } from "@/api/user";
import store from "@/store";
import forget from './forget.vue'
import { mapActions } from "vuex";

export default {
  data() {
    let isCellPhone = (val) => {
      if (!/^1[3456789]\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    }

    let isPassword = (val) => {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(val)) {
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

    let checkcode = (rule, value, callback) => {
        if (value === "") {
            callback(new Error("验证码不能为空"));
        } else if (value.length != 6) {
            callback(new Error("验证码为6位数字"));
        } else {
            callback();
        }
    }
    let checkoldpwd  =  (rule, value, callback) => {
      if (value === "") {
        callback(new Error("原密码不能为空"));
      }  else {
        callback();
      }
    }

    let checkpwd =  (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (!isPassword(value)) {
        callback(new Error("密码由8-20位数字、字母组合"));
      } else {
        callback();
      }
    }

    let checknpwd =  (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (this.form.pwd != value) {
        callback(new Error("两次输入密码不一致"));
      }else {
        callback();
      }
    }

    let checknpwds =  (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (this.form_pwd.pwd != value) {
        callback(new Error("两次输入密码不一致"));
      }else {
        callback();
      }
    }

    return {
      visible: false,
      createLoading: false,
      active:'account',
      info:{},
      form: {
        phone:'',
        code:'',
        register_key: '',
      },
      rules: {
        phone:[
          { validator: checkphone, trigger: ["blur", "change"] },
        ],
        code: [
          { validator: checkcode, trigger: ["blur", "change"] },
        ],
      },
      form_pwd: {
        oldPwd: "",
        pwd: "",
        npwd: "",
      },
      rules_pwd: {
        oldPwd:[{validator: checkoldpwd, trigger: ["blur", "change"] }],
        pwd:[{ validator: checkpwd, trigger: ['blur','change'] }],
        npwd:[{ validator: checknpwds, trigger: ['blur','change'] }],
      },
      q_code_msg: "发送验证码",
      timeout: false,
      time_Interval: '',
    };
  },
  created() {
    this.init();
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    init() {
      getData({
        url: "/user",
      }).then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.info = user;
        }
      });
    },
    // 验证码
    get_code() {
      let bol = true;
      this.$refs.form.validateField(["phone"], (vaild) => {
        if (vaild != "") {
          bol = false;
        }
      });

      if (bol) {
        this.timeout = true;
        postData({
            url: "/login/sendcode",
            data: { 
              phone: this.form.phone,  
            },
        }).then((res) => {
            let {data, code} = res;
            // 倒计时
            let num = 60;
            clearInterval(this.time_Interval);
            this.time_Interval = setInterval(() => {
                this.q_code_msg = `${num}s`;

                if (num <= 0) {
                    this.q_code_msg = "重新获取";
                    this.timeout = false;
                    clearInterval(this.time_Interval);
                }
                num--;
            }, 1000);

            if (code === 200) {
                this.form.register_key = data.pin_code;
            } else if (code === 422) {
                this.$err(data.phone[0]);
                this.q_code_msg = "重新获取";
                this.timeout = false;
                clearInterval(this.time_Interval);
            }
        });
      }
    },
    
    submitForm () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url:'/user/change_phone',
            data: {
              phone: this.form.phone,
              code: this.form.code,
              change_key: this.form.register_key,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg },
              } = res;
              if (code === 200) {
                this.$success(msg);
                setTimeout(()=>{
                  this.handleLogOut();
                },1500)
              }  else if (code === 422) {
                this.$err(msg);
                this.createLoading = false;
              }else  {
                this.createLoading = false;
              }
            })
            .catch(() => {
              this.createLoading = false;
            });
        } else {
          this.createLoading = false;
          return false;
        }
      })
    },


    // --------------------密码设置--------------------
    forget_pwd () {
      this.visible = true;
      this.$nextTick(() => {
        this.$refs.add.handleOpen();
      });
    },

    hideadd() {
      this.visible = false
    },

    submit () {
      this.$refs["form_pwd"].validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url:'/user/change_password',
            data: {
              password: this.form_pwd.oldPwd,
              new_password: this.form_pwd.pwd,
              confirm_password: this.form_pwd.npwd,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg },
              } = res;
              if (code === 200) {
                this.$success(msg);
                setTimeout(()=>{
                  this.$router.replace({ path: '/login' })
                  window.scrollTo(100, 0)
                },1500)
              }else if (code === 422) {
                this.$err(msg);
                this.createLoading = false;
              }else  {
                this.createLoading = false;
              }
            })
            .catch(() => {
              this.createLoading = false;
            });
        } else {
          this.createLoading = false;
          return false;
        }
      })
    },
  },
  components:{
    forget
  }
};
</script>

<style lang="less" scoped>
.content_main {
  padding: 25px 24px;
  .account {
    min-height: 85vh;
    padding: 26px 24px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    background: #fff;
  }

  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .form_tit {
    margin: 24px 0 16px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
    color: #464c5b;
  }

  /deep/.demo-form {
    .el-form-item__label {
      font-size: 12px;
      font-weight: 400;
      color: #657180;
    }

    .el-input {
      line-height: 32px!important;
      width: 350px!important;
    }
  }

  /deep/.el-form-item {
    margin-bottom: 24px!important;
  }

  /deep/.el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  /deep/.el-tabs__nav {
    width: 100%;
  }

  /deep/.el-tabs__item {
    width: 100px;
    text-align: center;
    font-size: 16px;
  }

  /deep/.el-tabs__item.is-active {
    color: #4D6FFF;
  }
  /deep/.el-tabs__item:hover {
    color: #4D6FFF;
  }

  /deep/.el-tabs__active-bar {
    background-color: #3965F9;
  }

  .text {
    width: 350px;
    height: 32px;
    line-height: 32px;
    background: #F7F7F7;
    border: 1px solid #D7DCE6;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 12px;
    font-weight: 400;
    color: #9EA7B4;
  }

  .tip {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #9EA7B4;
    margin-bottom: 20px;
    .iconfont {
      font-size: 14px;
      margin-right:12px;
    }
  }

  .btns {
    margin-top: 34px;
    .btn {
      width: 182px;
      height: 42px !important;
      background: #4D6FFF !important;
      border-radius: 8px !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      color: #FFFFFF !important;
      width: 350px;
    }
  }

  .code_box {
    width: 350px;
  }

  .get_q_code {
    width: auto;
    height: 32px;
    background: #4d6fff;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 32px;
    color: #ffffff;
    padding: 0 10px;
    margin-left: 17px;
  }

  .other {
    width: 415px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #3399FF;
    text-align: right;
    span {
      cursor:pointer;
    }
  }

}

</style>
