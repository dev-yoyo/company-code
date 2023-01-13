<template>
  <div>
    <div class="top_nav d-between">
      <div>
        <div class="top_title d-center">
          <i class="iconfont" :class="icon_name"></i>

          {{ active_title || "首页" }}
          <!-- {{ currentName }} -->
        </div>
      </div>

      <div class="d-center">
        <div class="nav_list d-center" v-if="type != 2">
          <div class="nav_item" v-for="item in list_left" :key="item.text" @click="to(item)" v-show="item.show">
            <i class="iconfont" :class="item.icon"></i>
            <p class="text">{{ item.text }}</p>
          </div>
          <div class="line" v-if="user.role_id"></div>
          <div class="nav_item" v-for="item in list_right" :key="item.text" @click="to(item)" v-show="item.show">
            <div v-if="item.icon == 'icon-ykb-xx'">
              <el-badge :value="count" class="item" v-if="count > 0">
                <i class="iconfont" :class="item.icon"></i>
              </el-badge>
              <i class="iconfont" :class="item.icon" v-else></i>
            </div>
            <i class="iconfont" :class="item.icon" v-else></i>
            <p class="text">{{ item.text }}</p>
          </div>
        </div>

        <div class="nav_btn d-center" @click="back()" v-else>
          <i class="iconfont icon-fhsy-yk"></i>返回首页
        </div>

        <el-dropdown @command="changeUser">
          <span class="el-dropdown-link">
            <div class="user_avatar d-center">
              <!-- <span>{{ user.name || "" }} </span> -->
              <el-avatar :size="32" :src="user.avatar" fit="fill" v-if="user.avatar"></el-avatar>
              <div class="nick" v-else>{{ user.abbreviation }}</div>

              <i class="el-icon-caret-bottom"></i>
            </div>
          </span>

          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="basic">基本信息</el-dropdown-item>
            <el-dropdown-item command="account">账号设置</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <list v-if="show_list" ref="list" @cancel="hidelist"></list>
    <!-- 详情 -->
    <returndetail v-if="detailShow" ref="refDetail" @cancel="hideDetail"></returndetail>
  </div>
</template>

<script>
import { getData } from "@/api/user";
import { mapActions } from "vuex";
import store from "@/store";
import list from "@/views/msg/index.vue";
import returndetail from "@/views/transaction_management/offer/component/detail.vue";

export default {
  props: ["active_title", "icon_name", "type"],
  data() {
    return {
      activeIndex: "0",
      user: {},
      list_left: [],
      list_right: [],
      show_list: false,
      detailShow: false,

      // menuList: [],
    };
  },
  watch: {
    '$store.state.msgShow': {
      handler(newVal, oldVal) {
        if (store.state.msgShow) {
          this.show_list = true;
        }
      }
    }
  },


  created() {
    // this.menuList = store.state.menuList;

    // this.user = store.state.userInfo;

    this.init()
  },
  components: {
    list,
    returndetail,
  },
  methods: {
    ...mapActions(["handleLogOut"]),

    init() {
      getData({
        url: "/user",
      }).then((res) => {
        const {
          code,
          data: { user, message_count },
        } = res;
        if (code === 200) {
          this.user = user;
          this.count = message_count
          this.$store.commit("setUserInfo", user);
          let company = user.company
          this.$store.commit("setCompany", { company });

          this.list_left = [
            {
              icon: "icon-ykb-bfkh",
              text: "计划",
              to: "/visit",
              show: this.user.role_id && this.user.role_id != 0,
            },
            {
              icon: "icon-ykb-sh1",
              text: "审批",
              to: "/approve",
              show: this.user.role_id && this.user.role_id != 0,
            },
            {
              icon: "icon-ykb-txl",
              text: "通讯录",
              to: "/branch",
              show: this.user.role_id && this.user.role_id != 0,
            },
          ],
            this.list_right = [
              {
                icon: "icon-ykb--xtsz",
                text: "设置",
                to: this.user.role_id == 3 ? "/target" : "/put",
                show: this.user.role_id && (this.user.role_id == 1 || this.user.role_id == 2 || this.user.role_id == 3),
              },
              {
                icon: "icon-ykb--bz",
                text: "帮助",
                to: "",
                show: false,
              },
              {
                icon: "icon-ykb-xx",
                text: "消息",
                to: "news",
                show: true,
              }
            ]
        }
      });
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
      this.$store.commit('msgShow', false)
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
.top_nav {
  padding: 0 24px;
  width: 100%;
  height: 72px;
  background: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);

  .top_title {
    align-content: center;
    font-weight: 600;

    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    color: #464c5b;

    .iconfont {
      margin-right: 5px;
      font-size: 22px;
    }
  }

  .nav_item {
    margin-right: 24px;
    text-align: center;
    cursor: pointer;
    color: #657180;

    .iconfont {
      font-size: 22px;
    }

    .text {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
      margin-top: 2px;
    }
  }

  .line {
    width: 0px;
    height: 34px;
    border-right: 1px solid #d1d7e2;
    margin-right: 24px;
  }

  .nav_btn {
    width: 99px;
    height: 32px;
    line-height: 32px;
    background: #fff;
    border: 1px solid #d6dce5;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #657180;
    margin-right: 24px;
    cursor: pointer;

    .iconfont {
      margin-right: 5px;
      font-size: 12px;
    }
  }

  .nick {
    height: 32px;
    width: 32px;
    border-radius: 50%;
    background: #4d6fff;
    color: #fff;
    line-height: 32px;
    font-size: 12px;
    text-align: center;
  }
}
</style>