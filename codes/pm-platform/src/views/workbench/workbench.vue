<template>
    <div class="bench">
      <top-nav></top-nav>
      <div style="display:flex">
        <el-aside>
        <left-menu></left-menu>
       </el-aside>
   
    <div class="content-right workbench">
      <div v-if="BreadcrumbShow">
        <Breadcrumb></Breadcrumb>
      </div>
      
      <router-view></router-view>
    </div>
      </div>
 
  </div>
</template>
  
  <script>
import Breadcrumb from "../../components/Breadcrumb/index.vue";
// import { removeWatermark, setWaterMark } from "@/libs/waterMark"
  export default {
    name: "workbench",
    data() {
        return {
          BreadcrumbShow:true
        };
    },
    methods: {},
    components: { Breadcrumb },
  //   mounted() {
  //  setWaterMark("", "Ebaina 易百纳");
  // },
  // destroyed() {
  //  removeWatermark();
  // },
    // watch:{
    //   $route(route) {
    //   // if you go to the redirect page, do not update the breadcrumbs
    //   // 判断当项目大厅的时候不显示面包屑
    //   if(this.$route.path=='/workbench/hall'){
    //     this.BreadcrumbShow =false
    //   }else{
    //     this.BreadcrumbShow =true
    //   }
    // },
    // },
   
    created(){

      // if(this.$route.path=='/workbench/hall'){
      //   this.BreadcrumbShow =false
      // }else{
      //   this.BreadcrumbShow =true
      // }
    }
}
  </script>
  
  <style lang="less" >
  .el-aside{
    width: auto!important
  }
  .bench{
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 100%;
  }
    .content-right{
      margin:0.2rem ;
      max-width: 18.3rem;
      min-width: 16.8rem;
      width: 100%;
      position: relative;
  
    
    }
    .el-aside {
      transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -moz-transition: width 0.15s;
    -webkit-transition: width 0.15s;
    -o-transition: width 0.15s;
    }

 
  </style>