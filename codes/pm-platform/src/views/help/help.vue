<template>
    <div class="help_wrap">
    <head-nav></head-nav>
    <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/help_banner.png" alt="" class="help_bannner">
    <div class="content-help ">
    <help-menu></help-menu>
    <div class="help-right">
        <router-view></router-view>
    </div>
    </div>
    <btm-nav></btm-nav>
  </div>
</template>
   
<script>
import Btm_nav from '../../components/base/btm_nav.vue';
import helpMenu from './help_menu.vue';
export default {
    data() {
        return {
        }
    },
   created () {
    },
    mounted() {
    },
    methods: {},
    components: {
        helpMenu,
        Btm_nav
    },
};
</script>
   <style lang='less' scoped>
    .head_{
    z-index: 100;
      width: 100% !important;
      background:#fff!important;
      background-color:#fff!important;
      margin-bottom: 0.6rem;
    }
   .help_wrap{
    position: relative;
    background: #F5F6F7;
    overflow: hidden;
    
    .help_bannner{
        max-width: 19.2rem;
        height: 2rem;
        width: 100%;
        margin: 0.6rem auto 0.2rem;
        display: block;
        position: relative;
        background-size:100%;
    }
    .content-help{
        position: relative;
        width: 13rem;
        margin: 0 auto;
        display: flex;
        
       
    }
    .help-right{
        width: 9.86rem;
        background: #FFFFFF;
        min-height:6rem ;
       margin-bottom: 0.32rem;
        padding: 0.3rem;
    }

   }

  
   </style>