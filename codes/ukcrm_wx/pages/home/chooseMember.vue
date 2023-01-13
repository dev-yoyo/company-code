<template>
  <view class="detail">
    <view class="container_main">
      <u-sticky offset-top="0">
        <view class="ser_box">
          <u-search
            v-model="keyword"
            placeholder="请输入搜索内容"
            shape="square"
            :showAction="false"
            bgColor="#F6F7F9"
            borderColor="#F6F7F9"
            height="36"
            @search="search"
            animation
          ></u-search>
        </view>

        <view class="tab_list_box d-center" v-if="role_id < 3">
          <view
            class="item"
            :class="activeTab == 0 ? 'active' : ''"
            @click="tabChange(0)"
          >
            员工列表
            <view class="line"></view>
          </view>

          <view
            class="item branch"
            :class="activeTab == 1 ? 'active' : ''"
            @click="tabChange(1)"
          >
            部门列表
            <view class="line"></view>
          </view>
        </view>

        <!-- 主管 展示自己部门 -->
        <view class="branch_tit" v-else>
          {{ department_name }}
        </view>
      </u-sticky>

      <view class="list_main">
        <view class="list_bgc"></view>

        <!-- 员工 -->
        <view v-if="activeTab === 0">
          <view class="list_box" v-if="memberList.length > 0">
            <view
              class="item d-between"
              :class="diyMemberInfo.id == v.user.id ? 'active' : ''"
              v-for="(v, i) in memberList"
              :key="i"
              @click="chooseMember(v)"
            >
              <view class="label">{{ v.user.name }}</view>

              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>
          </view>

          <view class="slogan" v-else>
            <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
            <view class="txt"> 暂无数据 </view>
          </view>
        </view>

        <!-- 部门 -->
        <view v-else-if="activeTab === 1">
          <view class="list_box" v-if="commemberList.length > 0">
            <view
              class="item d-between"
              :class="diyMemberInfo.id == v.id ? 'active' : ''"
              v-for="(v, i) in commemberList"
              :key="i"
              @click="chooseBranch(v)"
            >
              <view class="label">{{ v.name }}</view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>
          </view>

          <view class="slogan" v-else>
            <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
            <view class="txt"> 暂无数据 </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getData } from "@/common/api";
import { navBack } from "@/common/hooks";
import store from "@/store";

export default {
  data() {
    return {
      from_type: "", // 从那个页面来的 home contract return_money
      role_id: null,
      keyword: "",
      activeTab: 0, // 0员工 1 部门
      page: 1,
      next_page: true,

      memberList: [],
      commemberList: [],
      noData: store.state.no_data,

      activeMember: "", // 1公司 2个人 3自定义
      diyMemberInfo: {},
      department_name: "", // 主管 部门名称
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);
    this.activeMember = query.activeMember;
    this.activeTab = query.chooseMemberTabs == 0 ? 0 : 1;
    this.diyMemberInfo = query.diyMemberInfo;
    this.from_type = query.from_type;
    this.init();
  },
  methods: {
    init() {
      if (this.activeTab == 0) {
        this.getMember();
      } else {
        this.getDepartment();
      }
    },
    // 全部成员or部门成员
    getMember() {
      getData("/company/company_department_member", {
        params: {
          page: this.page,
          search_word: this.keyword,
        },
      }).then((res) => {
        const {
          code,
          data: { user_list, role_id, department_name },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.role_id = role_id;
          this.department_name = department_name;
          this.memberList = user_list ? user_list.data : [];
        }
      });
    },
    getDepartment() {
      getData("/department/list", {
        params: {
          page: this.page,
          search_word: this.keyword,
        },
      }).then((res) => {
        const {
          code,
          data: { department_list },
        } = res;

        if (code === 200) {
          uni.stopPullDownRefresh();
          this.commemberList = department_list;
        }
      });
    },
    tabChange(i) {
      this.activeTab = i;
      this.page = 1;
      this.next_page = true;
      this.init();
    },
    search() {
      this.page = 1;
      this.init();
    },

    chooseMember(v) {
      if (this.from_type == "home") {
        uni.$emit("homeChooseMember", {
          info: JSON.stringify(v.user),
          activeMember: this.activeMember,
          chooseMemberTabs: this.activeTab,
        });
      }
      if (this.from_type == "contract") {
        uni.$emit("contractChooseMember", {
          info: JSON.stringify(v.user),
          activeMember: this.activeMember,
          chooseMemberTabs: this.activeTab,
        });
      }
      if (this.from_type == "return_money") {
        uni.$emit("returnMoneyChooseMember", {
          info: JSON.stringify(v.user),
          activeMember: this.activeMember,
          chooseMemberTabs: this.activeTab,
        });
      }

      navBack();
    },

    chooseBranch(v) {
      if (this.from_type == "home") {
        uni.$emit("homeChooseMember", {
          info: JSON.stringify(v),
          activeMember: this.activeMember,
          chooseMemberTabs: this.activeTab,
        });
      }
      if (this.from_type == "contract") {
        uni.$emit("contractChooseMember", {
          info: JSON.stringify(v),
          activeMember: this.activeMember,
          chooseMemberTabs: this.activeTab,
        });
      }
      if (this.from_type == "return_money") {
        uni.$emit("returnMoneyChooseMember", {
          info: JSON.stringify(v),
          activeMember: this.activeMember,
          chooseMemberTabs: this.activeTab,
        });
      }
      navBack();
    },

    onPullDownRefresh() {
      this.page = 1;
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.container_main {
  padding: 0 0 30px;

  .ser_box {
    padding: 11px 15px;
    background-color: #fff;
  }

  .tab_list_box {
    margin: 17px 0 5px;

    .item {
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
      color: #333333;
    }

    .line {
      visibility: hidden;
      margin: 9px auto 0;
      width: 40px;
      height: 4px;
      background: #4d6fff;
      border-radius: 5px;
    }

    .branch {
      margin-left: 85px;
    }

    .active {
      font-size: 14px;
      color: #4d6fff;

      .line {
        visibility: visible;
      }
    }
  }

  .branch_tit {
    margin: 19px 20px 16px;
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }
}

.list_main {
  position: relative;

  .list_box {
    .item {
      margin-bottom: 1px;
      padding: 0 40px;
      height: 60px;
      background-color: #fff;

      .label {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
      }

      .t-icon {
        display: none;
      }
    }

    .active {
      .label {
        color: #4d6fff !important;
      }

      .iconfont {
        display: block;
      }
    }
  }
}

.slogan {
  padding: 135px 0 0;
}
</style>