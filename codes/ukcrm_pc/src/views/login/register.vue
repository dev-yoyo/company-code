<template>
  <div class="register">
    <div class="main_box">
      <div class="register_box">
        <div class="register_title" @click="back()">
          <i class="iconfont icon-ykb-fh"></i>注册友客帮！
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="0">
          <el-form-item prop="name">
            <div class="label">姓名</div>
            <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item prop="phone">
            <div class="label">手机号</div>
            <el-input
              v-model="form.phone"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="code">
            <div class="label">验证码</div>
            <div class="d-between">
              <el-input
                v-model="form.code"
                placeholder="请输入验证码"
              ></el-input>
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
          <el-form-item prop="pwd">
            <div class="label">密码</div>
            <el-input
              v-model="form.pwd"
              type="password"
              placeholder="密码由8-20位数字、字母组合"
              @keydown.enter.native="register"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="register" class="btn"
            :loading="createLoading" :disabled="createLoading">注册</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="register_agree">
        登录即代表同意<router-link class="action" to="/agreement"
          >《用户协议》</router-link
        >及<router-link class="action" to="/policy">《隐私政策》</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getData, postData } from "@/api/user";
import { setTimeout } from "timers";

export default {
  name: "register",
  data() {
    let isCellPhone = (val) => {
      if (!/^1[3456789]\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    };

    let isPassword = (val) => {
      if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,20}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    };

    let checkname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("姓名不能为空"));
      } else if (value && value.length > 4) {
        callback(new Error("姓名限制4个字符"));
      } else {
        callback();
      }
    };

    let checkphone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号码不能为空"));
      } else if (!isCellPhone(value)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
      }
    };

    let checkcode = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("验证码不能为空"));
      } else if (value.length != 6) {
        callback(new Error("验证码为6位数字"));
      } else {
        callback();
      }
    };

    let checkpwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (!isPassword(value)) {
        callback(new Error("密码由8-20位数字、字母组合"));
      } else {
        callback();
      }
    };

    return {
      createLoading: false,
      form: {
        name: "",
        phone: "",
        pwd: "",
        code: "",
        register_key: "",
      },
      rules: {
        name: [{ validator: checkname, trigger: ["blur", "change"] }],
        phone: [{ validator: checkphone, trigger: ["blur", "change"] }],
        pwd: [{ validator: checkpwd, trigger: ["blur", "change"] }],
        code: [
          { required: true, validator: checkcode, trigger: ["blur", "change"] },
        ],
      },
      q_code_msg: "发送验证码",
      timeout: false,
      time_Interval: "",
    };
  },
  methods: {
    ...mapActions(["handleRegister"]),
    register() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          getData({
            url: "/login/register",
            data: {
              name: this.form.name,
              phone: this.form.phone,
              password: this.form.pwd,
              code: this.form.code,
              register_key: this.form.register_key,
            },
          }).then((res) => {
            const {
              code,
              data: { jwt_token, user_info, msg, phone, password, name },
            } = res;
            if (code === 200) {
              this.$success(msg);
              setTimeout(() => {
                this.handleRegister({ jwt_token, user_info });
              }, 1500);
            } else if (code === 422) {
              this.createLoading = false;
              if (password) {
                this.$err(password[0]);
              } else if (phone) {
                this.$err(phone[0]);
              } else if (name) {
                this.$err(name[0]);
              } else {
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

    get_code() {
      let bol = true;
      this.$refs.form.validateField(["name", "phone"], (vaild) => {
        if (vaild != "") {
          bol = false;
        }
      });

      if (bol) {
        this.timeout = true;
        postData({
          url: "/login/sendsmspin",
          data: {
            name: this.form.name,
            phone: this.form.phone,
          },
        }).then((res) => {
          let { data, code } = res;
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
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.register {
  width: 100%;
  height: 100vh;
  background-image: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/dly-bg.png');
  background-size: cover;
  background-position: center;
  position: relative;

  .main_box {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);

    .register_box {
      width: 455px;
      height: auto;
      background: #fff;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 18px;
      padding: 68px 79px 64px;
    }

    .register_title {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #464c5b;
      margin-bottom: 4px;
      .iconfont {
        cursor: pointer;
        margin-right: 5px;
      }
    }

    .label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #464c5b;
      margin-bottom: 12px;
    }

    .el-form-item {
      margin-top: 40px;
      margin-bottom: 0;
    }

    .el-input__inner,
    .el-input__inner:focus,
    .el-input__inner:hover {
      border-top: none !important;
      border-left: none !important;
      border-right: none !important;
      border-radius: 0;
      padding: 0;
      box-shadow: none;
    }

    .btn {
      width: 298px;
      height: 42px;
      background: #4d6fff;
      border-color: #4d6fff;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #ffffff;
    }

    .register_agree {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
      margin-top: 30px;
    }

    .action {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #3399ff;
      cursor: pointer;
      text-decoration: none;
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
  }
}
.el-form-item__error {
  padding-top: 4px!important;
}
</style>s