<template>
  <view class="detail">
    <u-sticky offset-top="0">
      <view class="com_top_tit d-between">
        <view class="tab_list_box">
          <view class="tabs_tit"> 合同订单 </view>
        </view>

        <view class="r_select d-center">
          <view class="item d-center" @click="dateShow = true">
            {{ dateInfo.activeDate || "本年度" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>

          <!-- 管理员+主管 可以筛选 管理员全部 、 主管只能看本部门的 -->
          <view class="item d-center" @click="memberShow = true" v-if="role_id < 4 || roel_id > 0">
            {{ showActiveMember || "全部" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>

          <view class="item d-center" @click="checkStatusShow = true">
            状态
            <i class="icon iconfont icon-xl2"></i>
          </view>
        </view>
      </view>
    </u-sticky>

    <view class="sell_main">
      <view class="list" v-if="contractList.length > 0">
        <view class="item" v-for="(v, i) in contractList" :key="i" @click="detail(v)">
          <view class="name u-line-1">
            {{ v.contract_no }}
          </view>

          <view class="status" :class="{
              under_way: v.contract_status == '执行中',
              under_way: v.contract_status == '新签约',
              end: v.contract_status == '终止',
            }">
            {{ v.contract_status }}
          </view>

          <view class="info_mian">
            <view class="item_li d-between">
              <view class="label"> 合同名称： </view>
              <view class="content"> {{ v.contract_name }}</view>
            </view>
            <view class="item_li d-between">
              <view class="label"> 合同金额： </view>
              <view class="content"> {{ v.money }}元</view>
            </view>
            <view class="item_li d-between">
              <view class="label"> 待回款额： </view>
              <view class="content money"> {{ v.return_money }}元</view>
            </view>
            <view class="item_li d-between">
              <view class="label"> 签订人： </view>
              <view class="content"> {{ v.sign_user }}</view>
            </view>
            <view class="item_li d-between">
              <view class="label"> 签订日期： </view>
              <view class="content"> {{ v.sign_time }} </view>
            </view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

        <view class="txt"> 暂无数据 </view>
        <view class="create d-flex" @click="addAgreement" v-if="from != 'com_detail'">
          <i class="icon iconfont icon-tjx"></i>
          新建销售合同
        </view>
      </view>

      <view class="new_fixed_btm d-flex" v-if="contractList.length > 0 && from != 'com_detail'">
        <view class="item" @click="addAgreement">
          <view class="icon_box">
            <!-- <i class="icon iconfont icon-xjssjl"></i> -->
            <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjht%402x.png" mode="aspectFit"></image>
          </view>
          新建销售合同
        </view>
      </view>
    </view>

    <!-- 选择时间 -->
    <choosedate :dateShow="dateShow" :dateList="dateList" :dateInfo="dateInfo" @chooseTime="chooseTime"
      @submitDate="submitDate" @hideChooseDate="hideChooseDate"></choosedate>

    <!-- 全部成员 部门选择 -->
    <u-popup :show="memberShow" :round="10" mode="bottom" :safeAreaInsetBottom="false" @close="memberShow = false">
      <view class="home_choose_member">
        <view class="propup_main">
          <view class="tit"> 请选择 </view>

          <view class="choose_list">
            <view class="item_li d-between" :class="!activeMember ? 'active' : ''" @click="chooseMember('')">
              <view class="label">
                {{ role_id > 2 ? "本部门" : "全公司" }}
              </view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>

            <view class="item_li d-between" :class="activeMember == '仅本人' ? 'active' : ''" @click="chooseMember('仅本人')">
              <view class="label">仅本人</view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>

            <view class="item_li d-between" :class="activeMember == 'diy' ? 'active' : ''" @click="chooseMember('diy')">
              <view class="label">自定义</view>
              <view class="r_ipt d-center">
                <u-input v-model="diyMemberInfo.name" placeholder="去设置" placeholderStyle="#999999" fontSize="13"
                  border="none" inputAlign="right" readonly></u-input>

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

    <!-- 状态 -->
    <u-popup :show="checkStatusShow" :round="10" mode="bottom" :safeAreaInsetBottom="false"
      @close="checkStatusShow = false">
      <view class="choose_status">
        <view class="propup_main">
          <view class="tit"> 请选择 </view>

          <view class="list">
            <view class="item d-between" :class="activeStatus == v ? 'active' : ''" v-for="(v, i) in statusList"
              :key="i" @click="chooseStatus(v)">
              <view class="label">{{ v }}</view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>
          </view>
        </view>

        <view class="popup_btns">
          <view class="btn cancel" @click="checkStatusShow = false">
            取消
          </view>
          <view class="btn" @click="submitStatus"> 确定 </view>
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
      from: "", // home  detail com_detail 首页过来的展示所又合同 客户详情过来的 只展示这个客户的
      noData: store.state.no_data,
      next_page: true,
      page: 1,
      contractList: [], //我的合同订单
      allcontractList: [], // 全部订单   管理员+主管 可以看

      activeTab: 0,
      inactiveStyle: {
        // 非选中
        color: "#333",
        "font-size": "14",
      },
      activeStyle: {
        // 选中
        color: "#4D6FFF",
        "font-size": "14",
      },
      tabList: [
        {
          name: "我负责的",
        },
        {
          name: "全部合同",
        },
      ],

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

      checkStatusShow: false, // 装谈
      statusList: [
        // "全部", "新签约", "执行中", "完毕", "终止"
      ],
      activeStatus: "全部",
    };
  },
  onLoad() {
    let query = this.$Route.query;
    this.from = query.from;
    this.customer_id = query.customer_id;
    this.initDate();

    let _th = this;
    uni.$on("contractChooseMember", function (data) {
      _th.activeMember = data.activeMember;
      _th.chooseMemberTabs = data.chooseMemberTabs;
      _th.diyMemberInfo = JSON.parse(data.info);
    });
  },
  onShow() {
    this.present();
  },
  methods: {
    present () {
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
            this.init()
          }
        });
    },
    // 全部合同
    init() {
      let info = this.dateInfo;
      let timing = info.activeDate;
      let status = this.activeStatus == "全部" ? "" : this.activeStatus;
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

      getData("/contract/all_contract_list", {
        params: {
          timing,
          status,
          department_id,
          user_id,
          page: this.page,
          customer_id:this.customer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { contract_status, list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.statusList = contract_status;
          this.statusList.unshift("全部");

          if (this.page != 1) {
            this.contractList = this.contractList.concat(list.data);
          } else {
            this.contractList = list.data;
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

    // 选择状态 选择状态 选择状态 选择状态 选择状态 选择状态
    chooseStatus(v) {
      this.activeStatus = v;
    },
    submitStatus() {
      this.checkStatusShow = false;
      this.page = 1;
      this.init();
    },
    // 选择状态 选择状态 选择状态 选择状态 选择状态 选择状态

    // 新建销售合同
    addAgreement() {
      if (this.role_id == 0) {
        return this.$u.toast("暂无企业，无法新建合同");
      }
      this.$Router.push({
        path: `/contract_create`,
        query: {
          customer_id: this.customer_id,
        },
      });
    },

    detail(v) {
      this.$Router.push({
        path: `/contract_detail/${v.id}`,
        query: {
          contract_id: v.id,
        },
      });
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
            from_type: "contract",
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

      .name {
        margin-bottom: 16px;
        width: 200px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
      }

      .info_mian {
        padding: 0 10px;

        .item_li {
          margin-bottom: 14px;
        }

        .label {
          font-size: 13px;
          min-width: 65px;
          line-height: 1;
          color: #999999;
        }

        .content {
          font-size: 14px;
          line-height: 1;
          color: #333333;
        }

        .money {
          color: #ff9d00;
        }
      }

      .status {
        position: absolute;
        top: 14px;
        right: 20px;
        padding: 0 8px;
        height: 25px;
        line-height: 25px;
        background: #ebebeb;
        border-radius: 2px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #666666;
      }

      // 执行中
      .under_way {
        color: #4d6fff;
        background-color: #f0f5ff;
      }

      // 终止
      .end {
        color: #ff4500;
        background-color: #ffebe3;
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

.choose_status {
  margin-bottom: 22px;

  .propup_main {
    padding: 11px 0 0;
    .tit {
      padding: 0 20px;
      margin-bottom: 16px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #999999;
    }
  }

  .list {
    margin-bottom: 16px;
  }

  .item {
    position: relative;
    padding: 16px 26px 16px;
    height: 49px;
    border-bottom: 1px solid #f4f4f4;

    .label {
      font-size: 14px;
      font-weight: 400;
      line-height: 1;
      color: #666666;
    }

    .t-icon {
      display: none;
    }

    .r_ipt {
      line-height: 1;

      .iconfont {
        margin-left: 16px;
        color: #c3c3c3;
        font-size: 13px;
        flex-shrink: 0;
      }
    }
  }

  .item:last-child {
    border-bottom: none;
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
</style>