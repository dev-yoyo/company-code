<template>
  <!-- 头部 -->
  <!-- <div class="fix-top"> -->
  <header class="head_">
    <div class="head-left">
      <div class="logo">
          <router-link to="/home">
          <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/logo.png" alt="">
        </router-link>
      </div>
      <div class="home-title">
        <router-link to="/home">项目协作</router-link>
      </div>
      <div>
        <router-link to="/home">首页</router-link>
      </div>
      <!-- <div>
        <router-link to="/hall">项目大厅</router-link>
      </div> -->
      <!-- <div><a href="">摸鱼</a></div> -->
      <div><a target="_blank" href="https://www.ebaina.com/">社区</a></div>
      <div><a target="_blank" href="https://chip.ebaina.com/">芯城</a></div>
    </div>
    <div class="head-right">
      <div class="head-right" v-if="islogin">
      <!-- 管理员 -->
      <p class="console" v-if="BackstageShow" @click="goManage">项目后台</p>
      <!--  -->
      <div  v-if="!BackstageShow">
        <p class="console" @click="goWork" v-if="!singleTeam">
          <i class="iconfont icon-db-gzt"></i>
          <span>工作台</span>
        </p>
        <!-- 个人和团队身份 -->
        <p class="console" v-if="singleTeam">
          <el-dropdown >
        <span class="el-dropdown-link" >
          <i class="iconfont icon-db-gzt"></i>
          <span>工作台</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="goSingle">个人</el-dropdown-item>
          <el-dropdown-item @click.native="goTeam">团队</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
        </p>
      </div>
      <p class="message" @click="goMessage">
          <i class="iconfont icon-sy-xx"></i>
          <span>消息</span>
          <span class="message-number" v-if="($store.state.SocketNum.all_count!=0)">{{$store.state.SocketNum.all_count}}</span>  
      </p>

    </div>
      <div class="login">
        <router-link to="/register" v-if="!islogin">登录</router-link>
        <el-dropdown>
          <span class="el-dropdown-link">
            <img :src="userInfo.avatar" alt="" class="username" v-if="islogin"  style="object-fit: cover;" >
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toPersonalCenter">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </header>
<!-- </div> -->
</template>
   <script>
import store from "@/store";
import routers from "@/router/routers";
import { mapActions } from 'vuex';
import { getData, postData } from "@/api/user";
export default {
  inject:['reload'],
  data() {
    return {
      userInfo:'',
      islogin:false,
      BackstageShow:false,
      singleTeam:false,
      roleId:'',
      currentRole:''
    }
  },
  created: function () {
    // 如果用户信息存在 该用户注册过
    this.islogin= store.state.islogin
    this.userInfo=store.state.userInfo
    this.judgeRole()

  },

  methods: {
    
    ...mapActions(["handleLogOut"]),

    // 重新获取用户数据
    // getUserinfo() {
      // getData({
      //   url: "/login/get_userinfo",
      // }).then((res) => {
      //   if (res.code==200 &&res.data.info?.role_id) {
      //     this.currentRole=res.data.info.role_id
      //     this.$store.commit("setRoleId", this.currentRole);
      //     // 判断团队状态下的个人身份 显示团队 个人下拉框
      //     if(this.userInfo.role_id == 4 && this.currentRole==3){
      //       this.$store.commit('setSingleTeam',true)
      //       this.singleTeam=store.state.SingleTeam
      //     }
      //   }
      // });
      // 判断逻辑 当个人用户点击时 获取最新用户身份 判断是否通过团队认证审核
      // getData({
      //   url: "/login/get_userinfo",
      // }).then((res) => {
      //   if (res.code==200 && res.data?.info) {
      //     console.log(res.data.info);
      //     this.$store.commit("setUserInfo", res.data.info);
      //   }
      
      // }).catch((err)=>{
      //   console.log(err);

      // })
    // },
    // 角色判断
    judgeRole(){
      this.userInfo = store.state.userInfo;
      // 判断逻辑
      //  1 当 role_id =1 管理员 模式
      //  2 当 role_id =2 ||4 工作台 模式
      //  2 当 role_id 3 团队个人 模式
    if(this.userInfo.role_id == 1){
      this.BackstageShow=true
      this.$store.commit('setSingleTeam',false)
    }
    if(this.userInfo.role_id == 2 || this.userInfo.role_id == 3 || this.userInfo.role_id == 4){
      this.BackstageShow=false
      this.$store.commit('setSingleTeam',false)
    }
    // 判断个人身份时 展示的工作台还是团队个人下拉框
    if(this.userInfo.role_id == 3){
      this.$store.commit('setSingleTeam',true)
    }
    
    // 判断 当前权限为4且全部权限为3的时候  团队个人 模式
    if((localStorage.getItem('headRoleid'))=="3" && this.userInfo.role_id == 4){
      this.$store.commit('setSingleTeam',true)
    }
    this.singleTeam=store.state.SingleTeam
    },
    goMessage(){
    let role_id = store.state.userInfo.role_id
      let login = JSON.parse(localStorage.getItem('login'))
      if (role_id == 1) {
        if (!login) {
          this.$router.push('/login')
        }else{
          this.$router.push('/workbench/message')
        }
      } else if (role_id != 1) {
        this.$router.push('/workbench/message')
      }
   },
    // 管理员进入
    goManage(){
    var login=JSON.parse(localStorage.getItem('login'))
      if (login) this.$router.push('/workbench/board')
      else this.$router.push('/login')
    },
     // 团队个人切换状态
    goSingle(){
      this.$store.commit("setRoleId", 4);
      this.$store.commit('setSingleTeam',true)
      this.singleTeam=true
      window.location.href='/workbench/project'
    },
    goTeam(){
      this.$store.commit("setRoleId", 3);
      this.$store.commit('setSingleTeam',true)
      this.singleTeam=true
      window.location.href='/workbench/project'
    },
    goWork(){
      // 判断逻辑 当个人用户点击时 获取最新用户身份 判断是否通过团队认证审核
      getData({
        url: "/login/get_userinfo",
      }).then((res) => {
        if (res.code==200 && res.data?.info) {
          this.$store.commit("setUserInfo", res.data.info);
              if (res.data.info.role_id==3) {
                this.$store.commit("setRoleId", 3);
                this.$store.commit('setSingleTeam',true)
                 this.singleTeam=true
                 localStorage.setItem('headRoleid',3)
                 window.location.href='/workbench/project'
            }else{
              if (this.userInfo?.role_id) {
                this.$store.commit('setSingleTeam',false)
                window.location.href='/workbench/project'
              } else {
                 this.$confirm('登录后才可进入工作台', '提示',{})
              }
            }
            //  console.log('setRoleId',store.state.userInfo.role_id);
            //  console.log('setSingleTeam',store.state.SingleTeam);
        }
      
      }).catch((err)=>{
        console.log(err);

      })
    
    },
    toPersonalCenter(){
      
      let role_id = store.state.userInfo.role_id
      let login = JSON.parse(localStorage.getItem('login'))
      if (role_id == 1) {
        if (!login) {
          this.$router.push('/login')
        }else{
          this.$router.push('/workbench/userCenter');
        }
      } else if (role_id != 1) {
        this.$router.push('/workbench/userCenter');
      }

    }
  },
  components: {

  },
};
</script>
<style scope src="@/assets/css/style.css"></style>
<style lang='less' scoped>
    // .fix-top{
      // width: 19.2rem;
      // position: relative;
      // z-index: 999;
     
    
   header {
    width: 19.2rem;
    // height: 0.6rem;
    //  background: #fff;
    background-color: rgba(255, 255, 255, 0.5);
  
     padding: 0rem 3.1rem;
     display: flex;
     align-self: center;
     justify-content: space-between;
     font-size: 0.16rem;
     position: fixed;
     z-index: 99;
    //  margin-bottom: 0.6rem;
     .head-left {
       display: flex;
       flex: 1;
       align-items: center;
       .logo {
         width: 0.33rem;
         margin-right: 0.15rem;
       }
   
       div {
         margin-right: 0.4rem;
   
         a {
           color: #333333;
           text-decoration: none;
           font-size: 0.15rem;
         }
       }
   
       .home-title {
         a {
           color: #000;
           font-size: 0.18rem;
         }
       }
     }

     .head-right {
       // width: 6rem;
       display: flex;
       align-items: center;
       text-align: right;
       font-size: 0.14rem;
       position: relative;
       .message{
    cursor: pointer;
    position: relative;
    .message-number{
    position: absolute;
    top: -0.04rem;
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
       p {
         color: #333;
         margin-right: 0.21rem;
   
         i {
           margin-right: 0.03rem;
           font-size: 0.15rem;
         }
       }
   
       .console {
        cursor: pointer;
         i {
           font-size: 0.13rem;
         }
       }
 
       .login {
        height: 0.6rem;
        display: flex;
        align-items: center;
        background-image: none;
        width: auto;
        cursor: pointer;
        
         a {
           text-decoration: none;
           color: #0077DD;
           font-size: 0.14rem;
         }
         .username{
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;

         }
       }
     }
   }
  // }
   </style>