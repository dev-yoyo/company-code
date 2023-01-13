<template>
  <view class="detail">
    <u-sticky offset-top="0">
      <view class="com_top_tit d-between">
        <view class="tab_list_box">
          <!-- 客户详情来的 tabs -->
          <view class="tabs_tit"> 回款单 </view>
        </view>

        <view class="r_select d-center">
          <!-- 管理员+主管 可以筛选 管理员全部 、 主管只能看本部门的 -->
          <view
            class="item d-center"
            @click="memberShow = true"
            v-if="role_id < 4 && role_id > 0"
          >
            {{ showActiveMember || "全部" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>

          <view class="item d-center" @click="dateShow = true">
            {{ dateInfo.activeDate || "本年度" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>
        </view>
      </view>
    </u-sticky>

    <view class="sell_main">
      <view class="list" v-if="returnList.length > 0">
        <view
          class="item"
          v-for="(v, i) in returnList"
          :key="i"
          @click="detail(v)"
        >
          <view class="number_box d-between">
            <view class="name u-line-1">
              {{ v.return_num }}
            </view>

            <view class="moeny">
              {{ v.return_money }}
              <text>元</text>
            </view>
          </view>

          <view class="info_mian">
            <view class="item_li d-flex">
              <view class="label"> 关联客户： </view>
              <view class="content"> {{ v.contract.customer_name }}</view>
            </view>
            <view class="item_li d-flex">
              <view class="label"> 关联公司： </view>
              <view class="content">
                {{ v.contract.customer_company_name }}</view
              >
            </view>
            <view class="item_li d-flex">
              <view class="label"> 关联合同： </view>
              <view class="content"> {{ v.contract.contract_name }}</view>
            </view>
            <view class="item_li d-flex">
              <view class="label"> 合同金额： </view>
              <view class="content"> {{ v.contract.money }}</view>
            </view>
            <view class="item_li d-flex">
              <view class="label"> 已回款额：</view>
              <view class="content">
                {{ v.contract.has_return_money }}
              </view>
            </view>
            <view class="item_li d-flex">
              <view class="label"> 回款日期： </view>
              <view class="content"> {{ v.return_time }} </view>
            </view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

        <view class="txt"> 暂无数据 </view>
        <view
          class="create d-flex"
          @click="addReturn"
          v-if="from != 'com_detail'"
        >
          <i class="icon iconfont icon-tjx"></i>
          新建回款单
        </view>
      </view>

      <view
        class="new_fixed_btm"
        v-if="returnList.length > 0 && from != 'com_detail'"
      >
        <view class="item" @click="addReturn">
          <view class="icon_box">
            <!-- <i class="icon iconfont icon-xjhkd1"></i> -->
			<image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjhk%402x.png" mode="aspectFit"></image>
          </view>
          新建回款单
        </view>
      </view>
    </view>

    <!-- 选择时间 -->
    <choosedate
      :dateShow="dateShow"
      :dateList="dateList"
      :dateInfo="dateInfo"
      @chooseTime="chooseTime"
      @submitDate="submitDate"
      @hideChooseDate="hideChooseDate"
    ></choosedate>

    <!-- 全部成员 部门选择 -->
    <u-popup
      :show="memberShow"
      :round="10"
      mode="bottom"
      :safeAreaInsetBottom="false"
      @close="memberShow = false"
    >
      <view class="home_choose_member">
        <view class="propup_main">
          <view class="tit"> 请选择 </view>

          <view class="choose_list">
            <view
              class="item_li d-between"
              :class="!activeMember ? 'active' : ''"
              @click="chooseMember('')"
            >
              <view class="label">
                {{ role_id > 2 ? "本部门" : "全公司" }}
              </view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>

            <view
              class="item_li d-between"
              :class="activeMember == '仅本人' ? 'active' : ''"
              @click="chooseMember('仅本人')"
            >
              <view class="label">仅本人</view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>

            <view
              class="item_li d-between"
              :class="activeMember == 'diy' ? 'active' : ''"
              @click="chooseMember('diy')"
            >
              <view class="label">自定义</view>
              <view class="r_ipt d-center">
                <u-input
                  v-model="diyMemberInfo.name"
                  placeholder="去设置"
                  placeholderStyle="#999999"
                  fontSize="13"
                  border="none"
                  inputAlign="right"
                  readonly
                ></u-input>

                <i class="icon iconfont icon-you"></i>
              </view>
            </view>
          </view>
        </view>

        <view class="popup_btns">
          <view class="btn cancel" @click="memberShow = false"> 取消 </view>
          <view class="btn" @click="submitChooseMember"> 确定 </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import store from "@/store";
import { getData, timeSearch, getUser } from "@/common/api";
import choosedate from "@/components/chooseDate.vue"; // 选择时间

export default {
  data() {
    return {
      role_id: null,
      user: {},
      customer_id: "", // 客户id
      user_id: "", //
      from: "", // home  detail 首页过来的展示所又合同 客户详情过来的 只展示这个客户的
      noData: store.state.no_data,
      next_page: true,
      page: 1,
      returnList: [], //我的合同订单

      dateShow: false,
      dateList: [],
      dateInfo: {
        activeDate: "本年度", // i 后端arr diy 自定义
        startTime: "",
        endTime: "",
        showStartTime: "",
        showEndTime: "",
      },

      memberShow: false,
      showActiveMember: "", // 员工
      activeMember: "", //  全公司  仅本人 自定义 diy
      chooseMemberTabs: 0, // 0 员工 、1 部门
      diyMemberInfo: {},
    };
  },
  onLoad() {
    let query = this.$Route.query;
    this.from = query.from;
    this.customer_id = query.customer_id;
    // this.present();
    this.initDate();

    let _th = this;
    uni.$on("returnMoneyChooseMember", function (data) {
      _th.activeMember = data.activeMember;
      _th.chooseMemberTabs = data.chooseMemberTabs;
      _th.diyMemberInfo = JSON.parse(data.info);
    });
  },
  onShow() {
    this.present();
    // this.init();
  },
  methods: {
    present() {
      // 今日、本周等数组
      timeSearch().then((res) => {
        const { code, data } = res;
        if (code == 200) {
          this.dateList = data.time_search;
        }
      });

      getUser().then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.user = user;
          this.role_id = user.role_id;
          this.init();
        }
      });
    },

    // 全部回款
    init() {
      let info = this.dateInfo;
      let timing = info.activeDate;
      if (info.showStartTime && info.showEndTime) {
        timing = [info.showStartTime, info.showEndTime];
      }

      let user_id = this.user_id;
      let department_id = "";
      // 全部
      if (!this.activeMember) {
        user_id = "";
        department_id = "";

        // 主管  自己部门下的
        if (this.user.role_id == 3) {
          department_id = this.user.department_id;
        }

        // 销售
        if (this.user.role_id == 4) {
          user_id = this.user.id;
        }
      }

      // 自定义
      if (this.activeMember == "diy") {
        if (this.chooseMemberTabs == 0) {
          user_id = this.diyMemberInfo.id;
          department_id = "";
        } else {
          user_id = "";
          department_id = this.diyMemberInfo.id;
        }
      }

      getData("/payment_collection/all_payment_list", {
        params: {
          timing,
          user_id,
          department_id,
          page: this.page,
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();

          if (this.page != 1) {
            this.returnList = this.returnList.concat(list.data);
          } else {
            this.returnList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    // 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间
    // 时间默认值
    initDate() {
      const d = new Date();
      const year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;

      this.dateInfo.startTime = `${year}-${month}-${day}`;
      this.dateInfo.endTime = `${year}-${month}-${day}`;
    },
    // 确认 时间选择
    submitDate(v) {
      this.dateInfo = v;
      if (v.activeDate == "diy") {
        this.dateInfo.activeDate = `${v.showStartTime}...`;
      }
      this.hideChooseDate();
      this.page = 1;
      this.init();
    },
    hideChooseDate() {
      this.dateShow = false;
    },
    // 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间 时间

    // 新建
    addReturn() {
      if (this.role_id == 0) {
        return this.$u.toast("暂无企业，无法新建回款");
      }

      this.$Router.push({
        path: `/return_money_create`,
        query: {
          customer_id: this.customer_id,
        },
      });
    },

    detail(v) {
      this.$Router.push({
        path: `/return_money_detail/${v.id}`,
        query: {
          return_id: v.id,
        },
      });
    },

    // 选择成员
    confirmMember(v) {
      this.showActiveMember = v.user.name;
      this.activeMember = v.user.name;
      this.user_id = v.user.id;
      this.memberShow = false;
      this.page = 1;
      this.init();
    },

    // 选择成员 选择成员 选择成员 选择成员  选择成员  选择成员  选择成员 dash
    dashMemberShow() {
      this.memberShow = true;
    },
    chooseMember(val) {
      this.activeMember = val;
      if (!val) {
        this.user_id = "";
      }

      if (val == "仅本人") {
        this.user_id = this.user.id;
      }

      if (val == "diy") {
        this.$Router.push({
          path: "/choose_member",
          query: {
            chooseMemberTabs: this.chooseMemberTabs,
            activeMember: this.activeMember,
            diyMemberInfo: JSON.stringify(this.diyMemberInfo),
            role: this.role_id,
            from_type: "return_money",
          },
        });
      }
    },
    submitChooseMember() {
      this.memberShow = false;
      if (this.activeMember == "diy") {
        this.showActiveMember = this.diyMemberInfo.name;
        this.user_id = this.diyMemberInfo.id;
      } else {
        this.showActiveMember = this.activeMember;
      }

      this.init();
    },
    // 选择成员 选择成员 选择成员 选择成员  选择成员  选择成员  选择成员 dash
  },
  components: {
    choosedate,
  },

  onReachBottom() {
    if (!this.next_page) {
  	  this.$u.toast('暂无更多数据');
  	  return
    };
    uni.showLoading({
    	title: "加载中",
    	mask: true,
    });
    this.page = this.page + 1;
    this.init();
    setTimeout(() =>{
    	uni.hideLoading()
    },1000)
  },
  onPullDownRefresh() {
    this.page = 1;
    this.init();
  },
};
</script>

<style lang="less" scoped>
.tabs_tit {
  font-size: 14px;
  color: #333;
}

.com_top_tit {
  height: 46px;
  padding: 0 15px 0 20px;
  background-color: #f7f8fa;

  /deep/.u-tabs__wrapper__scroll-view {
    margin-left: -12px;
  }

  /deep/.u-tabs__wrapper__nav__item {
    padding: 0 12px;
  }

  .r_select {
    .item {
      margin-left: 20px;
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
      color: #666666;
      white-space: nowrap;

      .iconfont {
        margin-left: 6px;
        font-size: 6px;
      }
    }
    :first-child {
      margin-left: 0;
    }
  }
}

.sell_main {
  .list {
    padding: 0 0 130px;

    .item {
      position: relative;
      margin-bottom: 10px;
      padding: 19px 20px 20px;
      width: 100%;
      height: 206px;
      background-color: #fff;
      overflow: hidden;

      .number_box {
        margin-bottom: 14px;

        .name {
          width: 200px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
          color: #333333;
        }

        .moeny {
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
          color: #ff9d00;

          text {
            font-size: 14px;
          }
        }
      }

      .info_mian {
        padding: 0 10px;

        .item_li {
          margin-bottom: 14px;
        }

        .label {
          font-size: 13px;
          line-height: 1;
          color: #999999;
        }

        .content {
          font-size: 13px;
          line-height: 1;
          color: #999999;
        }
      }
    }
  }
}

.slogan {
  width: 100%;
  height: calc(100vh - 46px);
  background: #fff;
  padding: 160px 0 0;
  text-align: center;

  /deep/.u-avatar {
    margin: 0 auto;
  }

  .txt {
    margin: 13px 0;
    font-size: 13px;
    color: #333333;
  }

  .create {
    justify-content: center;
    color: #316ec3;
    font-size: 13px;
    .iconfont {
      margin-right: 5px;
    }
  }
}
</style>