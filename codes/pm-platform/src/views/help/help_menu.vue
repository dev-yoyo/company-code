<template>
    <div class="helpmenu">
      <div v-for="(item, key) in menuList" :key="key">
        <div v-for="(v,i) in item.children" :key="i">
            <el-menu
          :default-active="currentName"
          background-color="#FFFFFF"
          active-text-color="#0268F9"
          text-color="#666666"
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
        </el-menu>
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
        personMenuList: "",
      };
    },
    created() {
      let user = store.state.userInfo;
      this.user = user;
      this.menuList = this.getNewMenus(user);
      this.$store.commit("setMenuList", this.menuList);
    },
    methods: {
        handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
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
            if (e.meta.role.includes("help")) {
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
        childlist &&
          childlist.map((e) => {
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
    components: {},
  };
  </script>
  
  <style lang="less">
  .helpmenu {
    position: relative;
    left: 0;
    top:0;
    width: 2.94rem;
    height:8.14rem;
    overflow: hidden;
    margin-right: 0.2rem;
    background: #FFFFFF;
  
    .leftmenuitem {
      height: 0.5rem !important;
      line-height: 0.5rem !important;
    }
  
    .leftmenuitemm {
      text-align: left;
    }
  
    .is-active {
      background-color: #F4F4F4 !important;
      color: #0268F9 !important;
    }

    .el-scrollbar__view {
      height: 100vh;
    }
  
    .el-menu {
      border-right: 0 !important;
    }
    .el-menu-item:hover{
      background-color: #F4F4F4!important;
    }
  }
  .iconfont {
    padding-right: 0.05rem;
  }
  .el-submenu__title{
    font-size: 0.16rem;
    color: #333333;
font-weight: 600;
font-family: PingFang SC;
  }
  </style>