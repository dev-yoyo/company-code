<template>
  <div class="leftmain">
    <div class="top_logo" @click="to_home()">
      <!-- <img src="@/assets/images/logo.png" alt="" />
      <div class="txt">友客帮</div> -->

      <img class="logo" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202207/07/%E9%A3%9E%E4%B9%A620220709-102100.png">
    </div>

    <!-- <el-scrollbar wrap-class="scrollbar-wrapper"> -->
    <div v-for="(v, i) in menuList" :key="i">
      <el-menu
        :default-active="currentName"
        background-color="#374069"
        active-text-color="#4D6FFF"
        text-color="#fff"
      >
        <el-submenu :index="v.name" v-if="v.children">
          <template slot="title">
            <i class="iconfont" :class="v.meta ? v.meta.icon : ''"></i>
            <span>{{ v.meta ? v.meta.title : "" }}</span>
          </template>

          <el-menu-item-group>
            <el-menu-item
              :index="val.name"
              v-for="(val, idx) in v.children"
              :key="idx"
              @click="changeNav(val)"
            >
              <i class="iconfont" :class="val.meta ? val.meta.icon : ''"></i>
              {{ val.meta ? val.meta.title : "" }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>

        <el-menu-item :index="v.name" v-else @click="changeNav(v)">
          <i class="iconfont" :class="v.meta ? v.meta.icon : ''"></i>
          <span slot="title">{{ v.meta ? v.meta.title : "" }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- </el-scrollbar> -->

    <change-company></change-company>
  </div>
</template>

<script>
import routers from "@/router/routers";
import store from "@/store";
import changeCompany from "./changeCompany";

export default {
  data() {
    return {
      user: {},
      menuList: [],
    };
  },
  created() {
    let user = store.state.userInfo;
    this.user = user;
    this.menuList = this.getNewMenus(user);
    this.$store.commit("setMenuList", this.menuList);

//     console.log(
//       "userInfo >>>",
//       user,
//       `
// role_id >>> ${user.role_id}
// 当前路由 >>> ${this.currentName}
// `
//     );
  },
  methods: {
    changeNav(v) {
      this.$router.push({
        name: v.name,
      });
    },

    // 遍历路由数组，筛选包含角色权限的路由
    getNewMenus(user) {
      let newArr = [];
      routers.map((e) => {
        // 需要校验 权限
        if (e.meta && e.meta.role) {
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
        if (e.meta && e.meta.role) {
          if (e.meta.role.includes(user.role_id)) {
            childArr.push(e);
          }
        } else {
          if (!e.meta.hideMenu) {
            childArr.push(e);
          }
        }
      });

      return childArr;
    },
    to_home () {
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
  components: {
    changeCompany,
  },
};
</script>

<style lang="less">
.leftmain {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  overflow: hidden;
  background-color: #374069;

  .top_logo {
    height: 61px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    img {
      margin-right: 10px;
      width: 36px;
      flex-shrink: 0;
    }

    .txt {
      font-size: 18px;
      color: #409eff;
      line-height: 1;
    }

    .logo {
        width: 50%;
        margin: 0;
    }
  }

  .leftmenuitem {
    height: 50px !important;
    line-height: 50px !important;
  }

  .leftmenuitemm {
    text-align: left;
  }

  .is-active {
    background-color: #4D6FFF !important;
    color: #ffffff !important;
  }

  .iconfont {
    margin-right: 5px;
    color: #fff;
    font-size: 16px;
  }

  .el-scrollbar__view {
    height: 100vh;
  }

  .el-menu {
    border-right: 0 !important;
  }
}
</style>