<template>
    <div class="page">
      <div class="main">
        <div class="tabs">
          <ul class="tabs_ul">
            <li :class="tabName=='first'?'active':''"  @click="tabName='first';tab()">项目预警<span class="message-number" v-if="(Num.warning_count!=0)">{{Num.warning_count}}</span></li>
            <li :class="tabName=='second'?'active':''"  @click="tabName='second';tab()">系统消息<span class="message-number" v-if="(Num.message_count!=0)">{{Num.message_count}}</span></li>
          </ul>
        </div>
        <div class="msg_box">
          <div class="msg" v-for="(v, k) in msgList" :key="k" :style="{'border-width':k==msgList.length-1?'0':'1px'}">
            <p>
              <span class="message-number" v-if="(v.has_read=='否')"></span>
              <span class="msg_t">“{{ v.type }}”</span>
              <span class="msg_c">{{ v.show_str }}</span> 
            </p>
            <p class="msg_i">{{ v.created_at }}</p>
          </div>
          <div v-if="noDataShow" class="noDataBox">
            <div class="noData">
              <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzt-zwsj.png" alt="">
              <span>暂无消息！</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getData, postData } from "@/api/user";
  export default {
    name: "personalcenter",
    data() {
      return {
        noData: '',
        tabName: "first",
        alertNumber:{},
        Num:{
          warning_count:0,
          message_count:0
        },
        msgList: [],
        noDataShow:false
      };
    },
    created() {
      this.tab();
      // this.messCount()
    },
  
    methods: {
      messCount(){
        let url ='/user/project_warning/all_message_count'
        getData({url}).then(res=>{
          if(res.code == 200){
            this.Num = res.data
            this.$store.commit('SocketNum',this.Num)
          }
        })
  
      },
      tab(){
        this.messCount()
        this.msgList=[]
        let url = this.tabName=='first'?'/user/project_warning/index':'/user/project_message/index';
        getData({url}).then(res=>{
          if(res.code == 200){
            this.msgList = res.data.list
            if(this.msgList.length==0){
              this.noDataShow=true
            }
           
         
          }
        })
        this.messCount()
      }
    },
  };
  </script>
  
  <style lang="less" scoped>
  .noDataBox{
    width: 100%;
    .noData{
      margin: 0 auto;
      margin-top: 10vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .page {
    min-height: 82vh;
    background-color: #fff;
  }
  .main {
    margin: 0 auto;
    margin-bottom: 1rem;
    padding: 0.34rem 0.32rem;
    .tabs{
      width: 100%;
      border-bottom: 1px solid #EBEBEB;
      font-size: 0.16rem;
      font-weight: 400;
      line-height: 0.22rem;
      color: #666666;
      .tabs_ul{
        display: flex;
        
       li{
        margin-right: 0.6rem;
        padding-bottom: 0.2rem;
        position: relative;
        cursor: pointer;
       }
       li.active{
        color: #333;
        font-weight: 600;
       }
       li.active::before{
        position: absolute;
        top:0.4rem;
        content: '';
        width: 100%;
        height: 0.04rem;
        background:#2141B4 ;
        border-radius: 0.04rem;
        }
  
      }
      .message-number{
      position: absolute;
      top: -0.04rem;
      left: 0.68rem;
      display: inline-block;
      width: 0.19rem;
      height: 0.14rem;
      font-size: 0.13rem;
      color: #fff;
      text-align: center;
      line-height: 0.14rem;
      background: #FF0319;
      border-radius:  0.15rem  0.15rem 0.15rem 0;
      font-weight: 500;
    }
    }
  
  
  }
  .msg_box {
    .message-number{
      width: 0.05rem;
      height: 0.05rem;
   border-radius: 50%;
      line-height: 0.14rem;
      background: #FF0319;
    }
    .msg {
      height: 0.8rem;
      display: flex;
      font-size: 0.15rem;
      align-items: center;
      border-bottom: 0.01rem dashed #999;
      justify-content: space-between;
      p{
        display: inline-flex;
        align-items: center;
      }
      .msg_t{
        color: #1b4b84;
        font-family: PingFang SC;
        font-weight: 700;
      }
      .msg_c{
        display: inline-block;
        color: #333;
        width: 9.7rem;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .msg_i{
        color: #999;
      }
    }
  }
  </style>