<template>
  <div class="register">
    <div class="register-content">
      <div class="qrcode" v-if="registerShow">
        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/login/register_bg_infor.png" alt="" class="cooperation-img">
        <!-- 二维码  qrcodeShow-->
        <div class="qrcode-infor"  v-if="qrcodeShow">
          <h3 class="title">登录</h3>
          <div class="focuson">
            <div class="qrcode-w" v-loading="qrcodeing">
              <img :src="qrCodeImg" alt="" class="qrcode-img" :class="qrcodeIcon ?'blur2':''" >
              <div class="cover-img"  v-if="qrcodeIcon" @click="getLoginQrcode()" >
                <!-- <svg class="icon svg-icon" aria-hidden="true">
                  <use xlink:href="#icon-gengxin1"></use>
                </svg> -->
                <p>
                  <!-- <i class="iconfont icon-dl-gx"></i> -->
                  <i class="iconfont icon-gengxin1"></i><br>
                  <span>二维码失效<br>点击更新</span>
                </p>
                
              </div>
            </div>
            <p class="desc">微信扫码关注即可注册/登录</p>
          </div>
          <div class="register-agree">
            <span>
              <el-checkbox v-model="checked"></el-checkbox>
            </span>
            扫码提交即表示同意平台的<router-link class="action" to="/agreement">《用户协议》</router-link>
          </div>
        </div>
        <!-- 绑定手机   -->
        <div class="bindphone-infor"  v-if="bindphoneShow">
          <h3 class="bindphone-title">绑定手机号</h3>
          <el-form ref="form" :model="form" :rules="rules" label-width="70px" class="bindphone-right"
            label-position="right">
            <el-form-item prop="phone" class="phone" label="手机号">
              <el-input v-model="form.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item prop="code" class="verification-code" label="验证码">
              <div class="d-between">
                <el-input v-model="form.code" placeholder="请输入" class="yzm"></el-input>
                <el-button type="primary" class="get_q_code" :disabled="timeout" size="small" @click="get_code">
                  {{ q_code_msg }}
                </el-button>
              </div>
            </el-form-item>
            <el-form-item class="flower-title" label="花名" prop="stage_name">
              <div class="d-between">
                <el-input placeholder="请选择" v-model="form.stage_name" readonly  class="choose-inp">
                    <el-button  slot="append" type="primary" size="medium"  class="choose-name"  @click="getLoginStageName">选择</el-button>
             
                </el-input>
                <el-tooltip class="item" effect="dark" content="说明：花名将作为参与项目的唯一身份标识" placement="bottom-start">
                  <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/login/ques-mark.png" alt="" class="ques-mark">
                </el-tooltip>
              </div>
            </el-form-item>
            <div class="login">
              <el-button type="primary" size="medium" @click="register" class="btn" :loading="createLoading"
                :disabled="createLoading">登&nbsp;&nbsp;录</el-button>
            </div>
          </el-form>
          <div class="register-agree">
            <span>
              <el-checkbox v-model="checked"></el-checkbox>
            </span>
            提交即表示同意<router-link class="action" to="/agreement">《用户协议》</router-link>
          </div>
        </div>

      </div>

      <!-- 花名选择   -->
      <div class="flowername" v-if="flowerShow">
        <div class="flower-nav">
          <h3 class="flower-choosename">选择花名</h3>
          <div class="flower-left">
            <span class="name"  v-if="form.stage_name">已选择<span class="font-3458DD">“{{form.stage_name}}”</span></span>
            <el-button type="primary" plain icon="el-icon-refresh" class="refresh" @click="refreshStage">换一批</el-button>
          </div>
        </div>
        <div class="flower-content" v-loading="flowing">
          <el-button plain v-for="(item ,index) in flowernameList" :key="index" @click="selectFlowerName(index,item)"
            :class="active === index ? 'check' : '' ">{{item.stage_name}}</el-button>

        </div>
        <div class="btn">
          <!-- <el-button class="back" :class="comeback == 'back'? 'check' : '' " plain @click="backTo">返回</el-button>
          <el-button class="confirm" :class="confirm == 'confirm'? 'check' : '' "  plain @click="sure">确定</el-button> -->
          <el-button class="back" plain @click="backTo">返回</el-button>
          <el-button class="confirm" plain @click="sure">确定</el-button>
        </div>
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

    let checkstage = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("花名不能为空"));
      } else {
        callback();
      }
    };

    return {
      qrCodeImg: "",
      checked: false,
      qrcodeShow: true,
      active: '',
      createLoading: false,
      comeback: '',
      confirm: '',
      bindphoneShow: false,
      flowerShow: false,
      registerShow: true,
      flowernameList: '',
      flowing: false,
      qrcodeing:false,
      form: {
        phone: "",
        register_key: "",//sendsms接口返回的
        code: "",
        auth_id: "",
        stage_name: "",
        message_key: ""
      },
      number:0,
      qrcodeIcon:false,
      rules: {
        phone: [{ validator: checkphone, trigger: ["blur", "change"] }],
        code: [{ validator: checkcode, trigger: ["blur", "change"] }],
        stage_name: [{ validator: checkstage, trigger: ["blur", "change"] }],
      },
      q_code_msg: "获取",
      timeout: false,
      time_Interval: "",
      currentItem:'',
      total:'',
      page:1,
      pagesize:72,
      checked:true,
    };
  },
  watch: {
    'form.message_key'(newValue, oldValue) {
      if (newValue != oldValue) {
        this.getCheckForWaitLogin()
      }
    }
  },

 created () {
    this.page=1
    this.getLoginQrcode();

  },
 
  methods: {
    ...mapActions(["handleRegister"]),
    // 换一批 刷新页面花名
    refresh(){

    },
    // 获取二维码
    getLoginQrcode() {
      this.number=1
      this.qrcodeing=true
      this.qrcodeIcon=false
      // this.qrcodeIcon=true
      getData({
        url: "/login/qrcode",
        data: {
        },
      }).then((res) => {
        this.qrcodeing=false
        const { code, data } = res;
        this.qrCodeImg = data.qrcode_url
        this.form.message_key = data.channel_id
      
      })
    },
    // 扫码轮询
    getCheckForWaitLogin() {
      var timer = setInterval(() => {
        getData({
          url: "/login/check_for_wait_login/" + this.form.message_key,
          data: {},
        }).then(async (res) => {
          const { code, data } = res;
          this.number+=1;
          // 用户未关注微信公众号 verification false 未注册绑定手机号 true 绑定
          if (data.result != null) {
            clearInterval(timer)
            if (data.result.verification == false) {
              this.qrcodeShow = false;
              this.bindphoneShow = true;
            }else if (data.result.verification == true){
              // 取的是result下user_info的值 注意！！！ 与登录层级不同 判断逻辑不同
              if (res.code == 200 && res.data.result?.jwt_token && res.data.result?.user_info) {
                const { jwt_token, user_info,  }= res.data.result
                // this.$success('登录成功');
                localStorage.setItem('headRoleid',user_info.role_id)
                await  this.handleRegister({ jwt_token, user_info });
              }else{
                this.$err('登录失败')
                return false
              }
            }
            this.form.auth_id = data.result.user_auth.id;
          } else {
           
          }
          if(this.number==15){
            // this.qrCodeImg = ''
            // this.qrcodeing=true
            this.qrcodeIcon=true
            clearInterval(timer)
          }
        })
      }, 2000);

    },
    // 换一批
    refreshStage(){
      if( this.page<this.total){
        this.page++
      
      }else{
        this.page=1
       
      }
      this.getLoginStageName()
     
    },
    // 花名
    getLoginStageName() {
      this.flowing = true;
      this.registerShow=false
      this.flowerShow=true
      getData({
        url: "/login/get_stage_name",
        data: {
          page:this.page,
          pagesize:this.pagesize
        
        },
      }).then((res) => {
        this.flowing = false;
        const { code, data } = res;
        this.flowernameList = data.list.data
        // 向上取整.
        this.total= Math.ceil(res.data.list.total/this.pagesize)
      })

    },

  // 选择花名
    selectFlowerName(index, item) {
      this.active = index
      this.currentItem=item
    },

    backTo() {
      this.comeback = 'back'
      this.confirm = '';
      this.flowerShow = false;
      this.registerShow = true
      this.bindphoneShow = true

    },
    sure() {
      this.confirm = 'confirm'
      this.comeback = ''
      this.flowerShow = false;
      this.registerShow = true
      this.bindphoneShow = true
      this.form.stage_name =  this.currentItem.stage_name
    },
    register() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          var data = this.form;
          postData({
            url: "/login/register",
            data: data,
          }).then( async(res) => {
            if (res.code === 200) {
              // 注册登录页面 没有result层级 取得是user的数据 注意与扫码登录user_info不一样
              if (res.code == 200 && res.data?.jwt_token && res.data?.user) {
                const { jwt_token  }= res.data
                // 该赋值必须用 user_info 与actions中的args 的形参保持一致
                var user_info=res.data.user
                localStorage.setItem('headRoleid',user_info.role_id)
                await  this.handleRegister({ jwt_token, user_info });
              }else{
                this.$err('登录失败')
                return false
              }
         
            }
            else {
              this.createLoading = false;
              // this.$err(message);
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
            phone: this.form.phone,
            provider: 'wechat'
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
            this.form.register_key = data.register_key;
          } else if (code === 422) {
            this.$err(data.message);
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
  background-image: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/login/register_bg.png');
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  justify-content: center;
  .el-checkbox__inner{
    margin-right: 0.05rem;
  }
  // .el-checkbox__inner:hover{
  //   border: 1px solid #3458DD;
  // }
  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background-color: #3458DD;
    border-color: #3458DD;
   
  }

 

  .register-content {
    width: 13rem;
    margin: auto;
    // height: 6.28rem;

    .qrcode {
      height: 100%;
      display: flex;
      // align-items: flex-start;
      box-shadow: 0 0 0.06rem 0.02rem #ccc;

      .cooperation-img {
        width: 7.95rem;
        height: 6.873rem;
      }

      .qrcode-infor {
        flex: 1;
        // padding: 0.72rem 0.77rem 0.78rem 1.03rem;
        padding: 0.72rem 0.77rem 1.05rem 1.03rem;
        background: #fff;

        .title {
          margin-bottom: 1.26rem;
          font-size: 0.18rem;
        }

        .focuson {
          // width: 1.45rem;
          margin: 0 auto 1.26rem;
          margin-bottom: 1.04rem;
          position: relative;
          width: 100%;
          text-align: center;
          .qrcode-w {
            width: 2.01rem;
            height: 2.01rem;
            margin: 0 auto 0.2rem;
            position: relative;
          }

          .qrcode-img {
            width: 100%;
            height: 100%;
            position: relative;
          }
          .blur2{
            filter: blur(0.08rem);
          }
          .cover-img{
            width: 2.01rem;
            height: 2.01rem;
            position: absolute;
            top:0;
            right: 0;
            // background: rgba(255,255,255,0.5);
            background: rgb(144 147 153 / 26%);
            border-radius: 0.1rem;
      //       background: url(../../assets/images/flur.png);
      //       background-size: cover;
      //       background-position: center;
            // text-align: center;
            // line-height: 2.01rem;
            p{
              margin-top: 0.58rem;
              width: 2.01rem;
             height: 2.01rem;
            }
            i{
              width: 0.6rem;
              font-size: 0.6rem;
              color: #fff;
              margin-bottom: 0.1rem;
              
            }
            span{
              width: 0.65rem;
          font-size: 0.13rem;
          color: #FFFFFF;
            }
           
            // svg{
            //   width: 0.6rem;
            //   font-size: 0.35rem;
            //   color: #474545;
              
            // }

          }

          .desc {
            margin: 0 auto;
            font-size: 0.13rem;
          }
        }

        .register-agree {
          text-align: center;
          font-size: 0.12rem;
          font-weight: 400;
          line-height: 0.17rem;
          color: #657180;
          margin-top: 0.3rem;
        }
      }

      //  绑定手机号
      .bindphone-infor {
        flex: 1;
        background: #fff;
        padding: 0.72rem 0.77rem 0.58rem 0.74rem;

        .bindphone-title {
          font-size: 0.18rem;
          margin-bottom: 1rem;
        }

        .bindphone-right {

          .phone,
          .verification-code {
            margin-bottom: 0.3rem !important;
            .get_q_code{
              width: 0.92rem;
            }
            .get_q_code.is-disabled{
              background: #cacaca !important;
              border: 1px solid transparent!important;
            }
          }

          label {
            text-align-last: justify;
          }

          .d-between .yzm {
            width: 1.64rem !important;
            margin-right: 0.19rem;
          }

          .el-input .el-input__inner {
            height: 0.32rem !important;
            line-height: 0.32rem !important;
          }
          // .el-input .el-input-group__append {
          //   border-radius:0  20px  20px 0!important;
          //   background: #ffff;
          //   color:#fff;
          // }

          .flower-title {
            margin-bottom: 0.68rem !important;
            display: flex;
         
          .choose-inp .el-input-group__append .el-button--primary{
            background: #fff!important;
            padding: 0.07rem 0.15rem;
            border:none !important;
            border-radius: 0;
            color: #1B385C;
          }
          .choose-inp .el-input-group__append .el-button--primary:hover{
            color: #3458DD;
            background:#E6EEFF; 

          }
            .el-form-item__content {
              margin-left: 0 !important;
            }

            .d-between .el-input-group--append {
              width: 2.45rem;
              margin-right: 0.2rem;
            }

            .ques-mark {
              width: 0.18rem;
              background: #3458DD;
              border-radius: 50%;
            }

            .ques-mark:hover {
              background: #7490F8;
            }
          }

          .login {
            width: 2rem;
            height: 0.32rem;
            margin: 0 auto 0.73rem;

            .btn {
              width: 100%;
              height: 100%;
            }
          }

        }

        .register-agree {
          font-size: 0.12rem;
          font-weight: 400;
          line-height: 0.17rem;
          color: #657180;
          margin-top: 0.3rem;
        }
      }
    }

    .flowername {
      width: 13rem;
      // padding: 0.35rem 0.36rem 0.36rem 0.37rem;
      padding: 0.35rem;
      // height: 8.24rem;
      align-items: center;
      background: #fff;
      margin: auto;

      .flower-nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.22rem;

        .flower-choosename {
          color: #464C5B;
          font-size: 0.16rem;
        }

        .flower-left {
          .name {
            font-size: 0.14rem;
            color: #666666;
            margin-right: 0.2rem;

            span {
              color: #3458DD;
            }

          }
          .refresh{
              background: #F0F8FF!important;
              border: 1px solid  #F0F8FF!important;
              color: #409EFF!important;

            }
            .refresh:hover{
              background: #F0F8FF!important;
              border: 1px solid  #F0F8FF!important;
              color: #409EFF!important;

            }

        }
      }

      .flower-content {
        background: #F5F5F5;
        // padding: 0.36rem;
        // padding: 0.36rem 0.4rem 0.12rem 0.39rem;
        padding: 0.36rem 0 0.12rem  0.38rem;
        margin-bottom: 0.36rem;
        width: 12.27rem;
      height: 6.42rem;
        display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
        .el-button {
          width: 1.26rem;
          height: 0.46rem;
          margin: 0 0.2rem 0.2rem 0;
          font-size: 0.14rem;
        }

        // .el-button:nth-child(8n+1) {
        //   margin-right: 0;
        // }

        .el-button.check {
          background: #3458DD;
          color: #fff;
        }

      }

      .btn {
        width: 5rem;
        margin: 0 auto;

        .back,
        .confirm {
          width: 1.82rem;
          height: 0.42rem;
        }
        .confirm{
          background: #4D6FFF!important;
          color:#fff;
          border:1px solid  #4D6FFF!important;;
        }
      }

      .el-button.check {
        background: #3458DD;
        color: #fff;
      }


    }
  }
}
</style>