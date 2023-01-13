<template>
 <div class="home">
   <!-- 头部 -->
   <head-Nav></head-Nav>
  
   <div class="first-tips" v-if="firstTips">
      <div class="first-box">
        <i class="iconfont icon-sc close-tips" @click="closetips"></i>
        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/tips.png" alt="">
        <div class="btns flex-center">
          <button type="text" @click="goAgreement">了解平台规则</button>
          <button type="text" @click="goProject">查看项目</button>
        </div>
      </div>
     </div>
     
   <div class="content">
   
     <div class="bannner">
       <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/banner.png" alt="">
     </div>

     <!-- 五个模块 -->
     <section class="develop">
       <div class="develop-five">
        <div>
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-zb.png" alt="">
         <p>主板/PCB开发</p>
        </div>
        <div>
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-qr.png" alt="">
         <p>嵌入式开发</p>
        </div>
        <div>
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-qd.png" alt="">
         <p>驱动/底层开发</p>
        </div>
        <div>
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-rj.png" alt="">
         <p>软件/系统开发</p>
        </div>
        <div>
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-dp.png" alt="">
         <p>单片机开发</p>
        </div>
       </div>
     </section>

     <section class="service-desc">
       <h3>全方位服务保障</h3>
       <div class="service-box">
        <div class="service-box-item">
         <div class="dec-img">
          <div>
           <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-zsxq.png" alt="">
          </div>
          </div>
          <div class="desc-infor">
            <p class="desc-schema">真实需求</p>
            <p class="platform-desc">平台官方发布<br/>保障项目的真实性</p>
          </div>
       </div>
       <!--  -->
       <div class="service-box-item">
         <div class="dec-img">
          <div>
           <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-djtx.png" alt="">
          </div>
          </div>
          <div class="desc-infor">
            <p class="desc-schema">等级体系</p>
            <p class="platform-desc">等级越高<br/>竞价成功几率越高</p>
          </div>
       </div>
       <!--  -->
       <div class="service-box-item">
         <div class="dec-img">
          <div>
           <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-syaq.png" alt="">
          </div>
          </div>
          <div class="desc-infor">
            <p class="desc-schema">隐私安全</p>
            <p class="platform-desc">使用社区花名参与项目<br/>保障个人隐私安全</p>
          </div>
       </div>
       <!--  -->
       <div class="service-box-item">
         <div class="dec-img">
           <div>
            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-zjaq.png" alt="">
           </div>
          </div>
          <div class="desc-infor">
            <p class="desc-schema">资金安全</p>
            <p class="platform-desc">线下签订项目协议<br/>法律权益保障</p>
          </div>
       </div>
       <!--  -->
       </div>
     </section>
     <section class="platform-union">
      <div class="platform-union-box">
        <!--  -->
        <div class="union-item">
         <div>
            <i class="iconfont icon-sy-xmsl"></i>
            <span>项目数量</span>
          </div>
          <p class="union-number">{{homeData.project_count}}</p>
        </div>
       <!--  -->
       <div class="union-item">
         <div >
            <i class="iconfont icon-sy-xnje"></i>
            <span>项目金额</span>
          </div>
          <p class="union-number">{{homeData.price_count}}</p>
        </div>
       <!--  -->
       <div class="union-item">
         <div>
            <i class="iconfont icon-sy-zcgcs"></i>
            <span>注册工程师</span>
          </div>
          <p class="union-number">{{homeData.user_count}}</p>
        </div>
       <!--  -->
      </div>
     </section>
     <section class="guide">
       <div class="guider-item">
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-sfrz.png" alt="">
         <div class="guide-desc">
           <h3>身份认证</h3>
           <p>5分钟完善技能与经验1分钟完成身份认证</p>
         </div>
       </div>
       <i class="iconfont icon-sy-xyg"></i>
       <div class="guider-item">
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-jjbm.png" alt="">
         <div class="guide-desc">
           <h3>竞价报名</h3>
           <p>项目招募多种角色选择角色，参与竞价</p>
         </div>
       </div>
       <i class="iconfont icon-sy-xyg"></i>
       <div class="guider-item">
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-xmkf.png" alt="">
         <div class="guide-desc">
           <h3>项目开发</h3>
           <p>报名成功，进入工作台完成项目开发任务</p>
         </div>
       </div>
       <i class="iconfont icon-sy-xyg"></i>
       <!-- <i class="iconfont  icon-message"></i>  -->
      
       <div class="guider-item">
         <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-hqsy.png" alt="">
         <div class="guide-desc">
           <h3>获取收益</h3>
           <p>项目收入冻结在个人账户项目完成后可申请提现</p>
         </div>
       </div>
     </section>
   </div>
   <btm-Nav></btm-Nav>
 </div>
</template>

<script>
import { getData } from "@/api/user";
// import store from "@/store";
import router from '../../router';
export default {
  name: "home",
  data() {
    return{
      firstTips:true,
      homeData:[]
    }
   },
  created () {
    this.homeIndex()
  },

  mounted() {
    if(localStorage.getItem('firstTips')){
      this.firstTips = false
    }
    // this.connetSocket()
  },

  methods: { 
    homeIndex() {
      getData({
        url: "/home/index/",
      }).then((res) => {    
        this.homeData=res.data

      }).catch(err=>{
        console.log(err);
      })
    },
    goAgreement(){
    },
    goProject(){
      this.$router.push('/hall')
    },
    closetips(){
      this.firstTips = false;
      localStorage.setItem('firstTips', false)
    }
    
  
  },
  components: {
  },
};
</script>
<style scope src="@/assets/css/style.css"></style>
<style lang='less' scoped>
  .home{
    max-width: 19.2rem;
        // flex: 1 1 0%;
    height: 100vh;
    position: relative;
    margin: 0 auto;
    box-sizing: border-box;
    overflow-y: scroll;
    overflow-x: hidden;
    .first-tips{
      position: fixed;
      top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
      z-index: 99;
      // top: 0;
      // left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      .first-box{
        position: absolute;
        top:50%;
      left: 50%;
      transform: translate(-50%,-50%);
      }
      .btns{
        margin-top: -1rem;
        margin-left: 0.5rem;
        width: 2.5rem;
        button {
          background: none!important;
          border: none!important;
          color: #fff;
          font-size: 0.16rem;
          cursor: pointer;
        }
        button:hover{
          text-decoration: underline;
        }
      }
      .close-tips{
        background: rgba(0,0,0,0.5);
        position: absolute;
        top: -0.15rem;
        right: -0.15rem;
        width: 0.37rem;
        height: 0.37rem;
        border-radius: 50%;
        text-align: center;
        line-height: 0.37rem;
        color: #fff;
      }
    }
    .content{
      position: relative;
      .bannner{
        width: 100%;
        height: 400px;
        margin: 0 auto;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .develop{
        width: 100%;
        background: #fff;
        padding: 0.59rem 3.57rem 0.79rem 3.45rem;
        margin: 0 auto;
        .develop-five{
          width: 13rem;
          display: flex;
          justify-content: space-between;
          img{
            width: 0.8rem;
          }
          p{
            color: #333333;
            font-size: 0.16rem;
          }
        }
      }
      .service-desc{
        width: 100%;
        height: 6.54rem;
        background-image: url('https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-xq.png');
        background-size: cover;
        background-position: center;
        position: relative;
        padding: 0.43rem 3.1rem 1.27rem;
        text-align: center;
        margin:  0 auto;
        h3{
          font-size: 0.28rem;
          color: #333;
          margin-bottom: 0.6rem;
        }
        .service-box{
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          width: 13rem;
          // border: 0.01rem solid red;
          margin: 0 auto;
          .service-box-item{
            width: 3.1rem;
            box-shadow: 0 0 0.1rem 0.01rem #ccc;
            .dec-img{
              width: 3.1rem;
              height: 2.58rem;
              background: linear-gradient(to bottom,#EAF1F5,#FFFFFF);
              display: flex;
              justify-content: center;
              align-items: center;
              div{
                width: 1.85rem;
                height: 1.85rem;
                img{
                  width: 100%;
                  height: 100%;
                  border-radius: 50%;
                }
              }
             
            }
            .desc-infor{
              width: 3.1rem;
              background: #FBFCFD;
              padding: 0.14rem 0 0.35rem 0;
              .desc-schema{
                font-size: 0.2rem;
                color:#1B385C ;
                margin-bottom: 0.08rem;
                font-weight: 600;

              }
              .platform-desc{
                color: #1B4B84;
                font-size: 0.14rem;
                line-height: 0.2rem;
              }

            }
          }
        }
      }
      .platform-union{
        background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/sy-sj.png);
        width: 100%;
        height: 2.4rem;
        display: flex;
        align-items: center;
        .platform-union-box{
          width: 13rem;
          margin: 0 auto;
          display: flex;
          justify-content: space-around;
          .union-item{
            width: 2rem;
            div{
              display: flex;
              align-items: center;
              i{
                color:#659AFB ;
                margin-right: 0.04rem;
                font-size: 0.3rem;
              }
              span{
                font-size: 0.16rem;
                color: #333;
              }
            }
            .union-number{
                font-size: 0.42rem;
                color: #333;
                font-weight: 600;
              }
           }
        }
      }
      .guide{
        position: relative;
        width: 100%;
        height: 3.92rem;
        background: #F4F7FA;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 3.1rem;
        i{
          color: #3458DD;
          font-size: 0.27rem;
        }
        .guider-item{
          position: relative;
          width: 2.78rem;
          height: 1.95rem;
          box-shadow: 0 0 0.1rem 0.01rem #ccc;
          img{
          position: relative;
        }
          .guide-desc{
            width: 1.54rem;
            position: absolute;
            right: 0.2rem;
            top:0.57rem;
            z-index: 10;
           h3{
             color: #1B4B84;
             font-size: 0.2rem;
             margin-bottom: 0.08rem;
           }
           p{
             color: #1B4B84;
             font-size: 0.14rem;
             line-height: 0.2rem;
           }
          }
        }
      }
    }
  
  }
</style>