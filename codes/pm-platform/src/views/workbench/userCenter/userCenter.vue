<template>
    <div class="page">
      <div class="main_">
        <div class="tabs">
          <ul class="tabs_ul">
            <li :class="centerIndex== 0 ?'active':''"  @click="centerIndex= 0 ">我的钱包</li>
            <li :class="centerIndex== 1 ?'active':''"  @click="centerIndex= 1 ">个人认证</li>
            <li :class="centerIndex== 2 ?'active':''"  @click="centerIndex= 2 ">团队认证</li>
          </ul>
        </div>
        <div>
            <mypurse @auth="auth" v-if="centerIndex== 0"></mypurse>
            <personalauth v-else-if="centerIndex== 1"></personalauth>
            <enterprise v-else-if="centerIndex== 2"></enterprise>
        </div>
      </div>
    </div>
  </template>
  <script>
import Enterprise from './component/enterprise.vue';
import Mypurse from './component/mypurse.vue';
import personalauth from './component/personalauth.vue';

  export default {
  components: { personalauth, Mypurse, Enterprise },
    name: "userCenter",
    data() {
      return {
        centerIndex:0
       
      };
    },
    created() {
    },
  
    methods: {
        auth(){
            this.centerIndex= 1
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
  .main_ {
    margin: 0 auto;
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
 
  </style>