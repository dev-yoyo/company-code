<template>
  <div class="top-c">
    <div class="top_nav d-between">
      <div class="top-logo">
          <router-link to="/home">
            <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/home/logo.png" alt="">
            <span>项目协作</span>
          </router-link>
          <div class="top_title d-center">
            <router-link to="/home">
              <i class="iconfont icon-zy-1"></i>首页
            </router-link>
          </div>
        </div>
      <div class="d-center">
        <p class="top-message" @click="goHall">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-xmdt"></use>
          </svg>
          <span>项目大厅</span>
        </p>
        <p class="top-message" @click="goMessage">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-sy-xx"></use>
          </svg>
          <span>消息</span>
          <span class="message-number" v-if="($store.state.SocketNum.all_count!=0)">{{$store.state.SocketNum.all_count}}</span>
         
        </p>
        <p class="top-message"  @click="goHelp">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-bangzhu"></use>
          </svg>
          <span>帮助</span>
        </p>
        <div class="top-userinfor">
          <!-- <img :src="user.avatar" alt=""> -->
          <el-dropdown style="width:0.5rem">
          <span class="el-dropdown-link">
            <img :src="user.avatar" alt="" class="username" v-if="!islogin"  style="object-fit: cover;" >
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toPersonalCenter">个人中心</el-dropdown-item>
            <el-dropdown-item @click.native="handleLogOut">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
          <span>{{user.nickname}}</span>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import store from "@/store";

export default {
  props: ["active_title", "icon_name", "type"],
  data() {
    return {
      activeIndex: "0",
      user: {},
      list_left: [],
      show_list: false,
      detailShow: false,
      islogin:false,
   

      // menuList: [],
    };
  },

  created() {
    this.user = store.state.userInfo;
  },
  components: {
  },
  methods: {
    ...mapActions(["handleLogOut"]),
    toPersonalCenter(){
      this.$router.push('/workbench/userCenter');
    },
   goMessage(){
    this.$router.push('/workbench/message');
   },
   goHelp(){
    this.$router.push('/help/guide/authentication');
   },
   goHall(){
    this.$router.push('/workbench/hall');
   },
    handleSelect(key) {
      this.$emit("handleChange", key);
    },
    changeUser(type) {
      switch (type) {
        case "logout":
          this.handleLogOut();
          break;
        case "basic":
          this.$router.push({
            path: "/basic",
          });
          break;
        case "account":
          this.$router.push({
            path: "/account",
          });
          break;

        default:
          break;
      }
    },
    to(v) {
      if (v.to == "news") {
        this.show_list = true;
      } else {
        this.$router.push({
          path: v.to,
        });
      }
    },
    back() {
      this.$router.replace({
        path: "/home",
      });
    },
    hidelist(v) {
      this.show_list = false;
      if (v) {
        this.detailShow = true;
        this.$nextTick(() => {
          this.$refs.refDetail.init(v.content_id);
          this.init()
        });
      }

    },
    hideDetail() {
      this.detailShow = false;
    },
  },
};
</script>
<style lang="less">
  .top-c{
    height: 0.72rem;
    position: relative;
      z-index: 999;
  }
.top_nav {
  padding: 0 0.33rem;
  width: 100%;
  height: 0.72rem;
  background: #fff;
  position: fixed;
  top:0;
  left: 0;
  box-shadow: 0rem 0.02rem 0.06rem rgba(0, 0, 0, 0.04);
  .top-logo{
    display: flex;
    img{
      display: inline-block;
      vertical-align: middle;
      margin-right: 0.05rem;
    }
    a{
      text-decoration: none;
      font-size: 0.19rem;
      font-weight: 600;
      color: #333333;
      margin-right: 0.53rem;
      }
      .top_title {
        a{
          align-content: center;
          font-weight: 600;
          font-size: 0.14rem;
          color: #333;
        }
        

      .iconfont {
        margin-right: 0.07rem;
        font-size: 0.13rem;
      }
    }
  }
  .top-message{
    margin-right: 0.3rem;
    cursor: pointer;
    position: relative;
    svg{
      width: 0.15rem;
      height: 0.15rem;
      margin-right: 0.05rem;
    }
    span{
      font-size: 0.14rem;
      color: #333333;

    }
    .message-number{
    position: absolute;
    top: -0.04rem;
    right: -0.22rem;
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
  .top-userinfor{
    cursor: pointer;
    img{
      width: 0.36rem;
      height: 0.36rem;
      border-radius: 50%;
      margin-right: 0.05rem;
      vertical-align: middle;
    }
    span{
      vertical-align: middle;
      display: inline-block;
      width: 1rem;
      font-size: 0.14rem;
      color: #333333;
      white-space: nowrap;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
    }

  }

  // .top_title {
  //   align-content: center;
  //   font-weight: 600;

  //   font-size: 0.13rem;
  //   font-weight: 600;
  //   line-height: 0.18rem;
  //   color: #464c5b;

  //   .iconfont {
  //     margin-right: 0.05rem;
  //     font-size: 0.22rem;
  //   }
  // }
  .nav_item {
    margin-right: 0.24rem;
    text-align: center;
    cursor: pointer;
    color: #657180;
    .iconfont {
      font-size: 0.22rem;
    }
    .text {
      font-size: 0.12rem;
      font-weight: 400;
      line-height: 0.17rem;
      color: #657180;
      margin-top: 0.02rem;
    }
  }
  .line {
    width: 0rem;
    height: 0.34rem;
    border-right: 0.01rem solid #d1d7e2;
    margin-right: 0.24rem;
  }
  .nav_btn {
    width: 0.99rem;
    height: 0.32rem;
    line-height: 0.32rem;
    background: #fff;
    border: 0.01rem solid #d6dce5;
    border-radius: 0.04rem;
    font-size: 0.12rem;
    font-weight: 400;
    line-height: 0.17rem;
    color: #657180;
    margin-right: 0.24rem;
    cursor: pointer;
    .iconfont {
      margin-right: 0.05rem;
      font-size: 0.12rem;
    }
  }
  .nick {
    height: 0.32rem;
    width: 0.32rem;
    border-radius: 50%;
    background: #4d6fff;
    color: #fff;
    line-height: 0.32rem;
    font-size: 0.12rem;
    text-align: center;
  }
}
</style>