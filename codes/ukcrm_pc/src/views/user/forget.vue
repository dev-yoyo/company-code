<template>
  <div class="forget">
    <el-dialog
      class="modal_join"
      title="忘记密码"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose">
        <el-form ref="form" :model="form" :rules="rules" label-width="0">
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
            <div class="label">新密码</div>
            <el-input
              v-model="form.pwd"
              type="password"
              placeholder="请输入密码"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item prop="npwd">
            <div class="label">确认密码</div>
            <el-input
              v-model="form.npwd"
              type="password"
              placeholder="请再次输入密码"
              @keydown.enter.native="forget"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
          </el-form-item>
        </el-form>
      

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getData,postData } from "@/api/user";

export default {
  name: "forget",
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

    return {
      visible: false,
      createLoading: false,
      form: {
        phone: "",
        pwd: "",
        npwd: "",
        code: "",
        register_key: "",
      },
      rules:{
        phone:[{ validator: checkphone, trigger: ['blur','change'] }],
        pwd:[{ validator: checkpwd, trigger: ['blur','change'] }],
        npwd:[{ validator: checknpwd, trigger: ['blur','change'] }],
        code: [{ required: true, validator: checkcode, trigger: ['blur','change'] }],
      },
      q_code_msg: "发送验证码",
      timeout: false,
      time_Interval: "",
    };
  },
  methods: {
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url: "/change_password_phone",
            data: {
              code: this.form.code,
              phone: this.form.phone,
              new_password: this.form.pwd,
              confirm_password: this.form.npwd,
              change_key: this.form.register_key,
            }
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$success(msg);
              setTimeout(()=>{
                this.handleLogOut();
              },1500)
            } else if (code === 422) {
                this.$err(msg);
                this.createLoading = false;
              }else {
              this.createLoading = false;
            }
          });
        }else{
          this.createLoading = false;
          return false;
        }
      });
    },

    get_code() {
      let bol = true
      this.$refs.form.validateField(['phone'],(vaild)=>{
        if(vaild != '') {
          bol = false
        }
      })

      if(bol) {
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

    handleOpen() {
      this.visible = true
    },

    handleClose() {
      this.visible = false
      this.$emit('cancel')
    }
  },
};
</script>

<style lang="less">
.forget {
  .label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #464C5B;
    margin-bottom: 12px;
  }

  .el-form-item {
    margin-bottom: 24px;
  }

  .get_q_code,
  .el-button.is-disabled.el-button--text {
    width: auto;
    height: 32px;
    background: #4D6FFF;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 32px;
    color: #FFFFFF;
    padding: 0 10px;
    margin-left: 17px;
  }
}
</style>s