<template>
  <div class="left-wrap" :class="!userHide?'shrink':''" >
   <div class="leftmain" >
    <div class="top-userinfor" >
      <div class="userimg" >
        <img :src="user.avatar" alt=""   style="object-fit: cover;" />
      </div>
      <p class="username"  v-if="userHide">{{ user.stage_name }}</p>
      <div class="userlevel" v-if="userHide">
        <span class="level-name" v-if="user.role_id == 1">管理员</span>
        <span class="level-name" v-if="user.role_id == 2">项目经理</span>
        <span class="level-name" v-if="user.role_id == 3">团队</span>
        <span class="level-name" v-if="user.role_id == 4">个人</span>
        <span class="level-tag">lv.{{ user.level }}</span>
      </div>
    </div>
    <div v-for="(v, i) in menuList" :key="i">
      <el-menu
        :default-active="currentName"
        background-color="#222F4B"
        active-text-color="#1E273B"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item :index="val.name"
              v-for="(val, idx) in v.children"
              :key="idx"
              @click="changeNav(val)">
              <i class="iconfont" :class="val.meta ? val.meta.icon : ''"></i>
          <span slot="title">{{ val.meta ? val.meta.title : ""}}</span>
        </el-menu-item>
      </el-menu>
      
    </div>
    <div  class="dh" @click="changeDh()">
      <span v-if="isCollapse">&lt;</span>
      <span v-else>&gt;</span>
      
    </div>
   
  </div>
</div>
</template>
<script>
import routers from "@/router/routers";
import store from "@/store";
export default {
  data() {
    return {
      user: {},
      menuList: [],
      isCollapse: false,
      collapsed: true,
      userHide:true,
    };
  },
  created() {
    let user = store.state.userInfo;
    this.user = user;
    this.menuList = this.getNewMenus(user);
    this.$store.commit("setMenuList", this.menuList);
    // console.log('当前权限',store.state.userInfo.role_id, '全部权限', localStorage.getItem('headRoleid'));
  },
  methods: {
    changeDh() {
      this.isCollapse=!this.isCollapse
      this.userHide=!this.userHide
    },
    changeNav(v) {
      this.$router.push({
        name: v.name,
      });
    },
    getRoleList(user) {
      console.log("routers", routers);
      let uid = user.role_id;
      console.log("uid", uid);
      let arr = [];
      routers.map((i) => {
        if (i.meta && i.meta.role && !i.meta.hideMenu) {
          if (i.meta.role.includes(uid)) {
            arr.push(i);
          }
        }
      });
      arr.map((i, k) => {
        if (i.children) {
          let c_List = [];
          let idx = '';
          c_List = i.children.filter(i=>i.meta.role.includes(uid));
          console.log('c_list',c_List)
          c_List.map((a, b) => {
            if (a.meta && a.meta.hideMenu) {
              console.log(a,b,'11111111111')
              idx = b;
            }
          });
          console.log('idx',idx)
          c_List.splice(idx, 1);
          arr[k].children = c_List;
        }
      });
      console.log("arr", arr);
      return arr;
    },
    // 遍历路由数组，筛选包含角色权限的路由
    getNewMenus(user) {
      let newArr = [];
      routers.map((e) => {
        // 需要校验 权限
       
        if (e.meta && (e.meta.role  && e.meta.hideMenu!=true)) {
          if (e.meta.role.includes(user.role_id)) {
            newArr.push(e);
          }

          if (e.children) {
            e.children = this.getChild(user, e.children);
          }
        } else {
          newArr.push(e);

          if (e.children) {
            e.children = this.getChild(user, e.children);
          }
        }
      });
      return newArr;
    },
    getChild(user, childlist) {
      let childArr = [];
      childlist && childlist.map((e) => {
        
        if (e.meta &&  (e.meta.role  && e.meta.hideMenu!=true)) {
          if (e.meta.role.includes(user.role_id)) {
            childArr.push(e);
          }
        } else {
          if (!e.meta.hideMenu) {
            childArr.push(e);
          }}
        });

      return childArr;
      
    },
    to_home() {
      this.$router.push({
        path: "/home",
      });
      window.scrollTo(100, 0);
    },
  },
  computed: {
    currentName() {
      let route_name = this.$store.getters.currentRouteName;
      return route_name;
    },
  },
};
</script>

<style lang="less" scoped>
.w2 {
  width: 2rem;
}
.w05 {
  width: 0.5rem;
}
.el-menu--collapse{
  width: 0.5rem;
  text-align: center;
}
/deep/.el-menu-item{
.el-tooltip{
  padding: 0!important;
}
}
.left-wrap.shrink{
  width: 0.49rem!important;
  transition: linear 0.3s;
  .leftmain{
    width: 0.49rem!important;
    .top-userinfor{
      height: 1rem!important;
      .userimg{
        width: 0.3rem!important;
        height: 0.3rem!important;
        line-height: 1rem!important;
      }
    }
  }

}
.left-wrap{
  position: relative;
  width: 2rem;
  height: 100%;
  max-width: 2rem;
  overflow: hidden;
}
.leftmain {
  width: 2rem;
  height: 100%!important;
  position: fixed;
  z-index: 99;
  overflow: hidden;
  background: #222f4b;
  .el-submenu__title{
  text-align: center;
}
.dh{
  height: 0.48rem;
  width: 100%;
 cursor: pointer;
  position: absolute;
  // top: 9.2rem;
  bottom: 0.8rem;
  border-top: 1px solid #fff;
  color: #fff;
  text-align: center;
  line-height: 0.48rem;
}
  .collapse {
    text-align: center;
    margin-bottom: 0.2rem;
    color: #c0c0c0;
    position: fixed;
    width: 2rem;
    bottom: 0.2rem;
    padding-top: 0.1rem;
    border-top: 1px solid #f4f4f4;
  }
  .top-userinfor {
    width: 100%;
    height: 2rem;
    background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/gzt/gzgt-tb.png");
    background-size: cover;
    background-position: center;
    position: relative;
    padding: 0.19rem 0;
    .userimg {
      width: 0.89rem;
      height: 0.89rem;
      margin: 0 auto 0.08rem;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .username {
      text-align: center;
      margin: 0 auto;
      width: 1.54rem;
      font-size: 0.14rem;
      color: #ffffff;
      white-space: nowrap;
      overflow: hidden; //超出的文本隐藏
      text-overflow: ellipsis; //溢出用省略号显示
      margin-bottom: 0.1rem;
    }
    .userlevel {
      width: 100%;
      margin: 0 auto;
      text-align: center;
      .level-name {
        display: inline-block;
        width: auto !important;
        font-size: 0.14rem;
        line-height: 0.2rem;
        color: #45dbff;
        margin-right: 0.1em;
      }
      .level-tag {
        width: 0.2rem;
        height: 0.2rem;
        font-size: 0.14rem;
        color: #333333;
        background: #fff;
        border-radius: 0.12rem;
        padding: 0rem 0.11rem;
      }
    }
  }
  .top_logo {
    height: 0.61rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
      margin-right: 0.1rem;
      width: 0.36rem;
      flex-shrink: 0;
    }

    .txt {
      font-size: 0.18rem;
      color: #409eff;
      line-height: 1;
    }
  }

  .leftmenuitem {
    height: 0.5rem !important;
    line-height: 0.5rem !important;
  }

  .leftmenuitemm {
    text-align: left;
  }

  .is-active {
    background-color: #1e273b !important;
    color: #ffffff !important;
  }

  .iconfont {
    margin-right: 0.05rem;
    color: #fff;
    font-size: 0.16rem;
  }

  .el-scrollbar__view {
    // height: 100vh;
  }

  .el-menu {
    position: relative;;
    border-right: 0 !important;
  }
}
</style>
