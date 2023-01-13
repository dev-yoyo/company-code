<template>
  <view class="detail">
    <u-sticky offset-top="0">
      <view class="com_top_tit d-between">
        <view class="tab_list_box">
          <view class="tabs_tit d-center">
            报价单
            <i class="t-icon iconfont t-icon-a-lujing420" @click="tipShow = true"></i>

            <u-modal :show="tipShow" width="321px" @confirm="tipShow = false">
              <view class="slot-content">
                <view class="tips">
                  <view class="l_tit">报价时效：</view>
                  <view class="r_info">
                    <view class="r_txt">
                      1、审核通过/无需审核的报价单，有效期为7天
                    </view>
                    <view class="r_txt">
                      2、报价单失效后，无法进行关联合同
                    </view>
                  </view>
                </view>
              </view>
            </u-modal>
          </view>
        </view>

        <view class="r_select d-center">
          <view class="item d-center" @click="dateShow = true">
            {{ dateInfo.activeDate || "本年度" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>

          <!-- 管理员+主管 可以筛选 管理员全部 、 主管只能看本部门的 -->
          <view class="item d-center" @click="memberShow = true" v-if="(role_id < 4 || roel_id > 0) && from == 'home'">
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
      <view class="list" v-if="offerList.length > 0">
        <view class="item" v-for="(v, i) in offerList" :key="i" @click="detail(v)">
          <view class="number_box d-between">
            <view class="name u-line-1">
              {{ v.offer_num }}
            </view>

            <view class="status" :class="{
                pedding: v.examine_name == '审批中',
                success: v.examine_name == '已审批',
                err: v.examine_name == '已拒审',
              }">
              {{ v.examine_name }}
            </view>
          </view>

          <view class="info_mian">
            <view class="item_li give d-flex">
              <view class="label"> 申请人： </view>
              <view class="content"> {{ v.user && v.user.name ? v.user.name :'' }}</view>
            </view>
            <view class="item_li d-flex">
              <view class="label"> 关联客户： </view>
              <view class="content"> {{ v.customer.name }}</view>
            </view>
            <view class="item_li d-flex">
              <view class="label"> 关联公司： </view>
              <view class="content"> {{ v.customer.company }}</view>
            </view>

            <block v-for="(item, index) in v.offer_list" :key="index">
              <view class="item_li d-flex">
                <view class="label"> 报价产品： </view>
                <view class="content"> {{ item.product_name }}</view>
              </view>
              <view class="item_li d-flex">
                <view class="label"> 产品价格： </view>
                <view class="content"> ￥{{ item.total_price }} </view>
              </view>
            </block>

            <view class="item_li d-flex">
              <view class="label"> 报价日期： </view>
              <view class="content"> {{ v.offer_time }} </view>
            </view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

        <view class="txt"> 暂无数据 </view>
        <view class="create d-flex" @click="addReturn" v-if="from != 'com_detail'">
          <i class="icon iconfont icon-tjx"></i>
          新建报价单
        </view>
      </view>

      <view class="new_fixed_btm" v-if="offerList.length > 0 && from != 'com_detail'">
        <view class="item" @click="addReturn">
          <view class="icon_box">
            <!-- <i class="icon iconfont icon-xjbj1"></i> -->
            <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjbj%402x.png" mode="aspectFit"></image>
          </view>
          新建报价单
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
    <u-popup :show="checkStatusShow" :round="10" mode="bottom" :safeAreaInsetBottom="false" @close="
        checkStatusShow = false;
        activeStatus = showActiveStatus;
      ">
      <view class="choose_status">
        <view class="propup_main">
          <view class="tit"> 请选择 </view>

          <view class="list">
            <view class="item d-between" :class="activeStatus == i ? 'active' : ''" v-for="(v, i) in statusList"
              :key="i" @click="chooseStatus(v, i)">
              <view class="label">{{ v }}</view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>
          </view>
        </view>

        <view class="popup_btns">
          <view class="btn cancel" @click="
              checkStatusShow = false;
              activeStatus = showActiveStatus;
            ">
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
      customer_id: "", // 客户id
      customer_name: "", // 客户id
      user_id: "", //
      user: {},
      from: "",
      noData: store.state.no_data,
      next_page: true,
      page: 1,
      offerList: [], //我的合同订单
      dateShow: false,
      dateList: [],
      dateInfo: {
        activeDate: "本年度", // i 后端arr diy 自定义
        startTime: "",
        endTime: "",
        showStartTime: "",
        showEndTime: "",
      },

      tipShow: false,
      tipTit: "报价时效",
      tipContent:
        "审核通过/无需审核的报价单有7天时效，若超过7天未关联合同，将会失效，失效的报价单不可在进行关联，需重新进行报价",

      memberShow: false,
      showActiveMember: "", // 员工
      activeMember: "", //  全公司  仅本人 自定义 diy
      chooseMemberTabs: 0, // 0 员工 、1 部门
      diyMemberInfo: {},

      checkStatusShow: false, // 装谈
      statusList: [
        // （0：无需审批，1：审批中，2：已审批，3：已撤销，4：已拒审）
      ],
      activeStatus: 0,
      showActiveStatus: "",
    };
  },
  onLoad() {
    let _th = this;
    uni.$on("contractChooseMember", function (data) {
      _th.activeMember = data.activeMember;
      _th.chooseMemberTabs = data.chooseMemberTabs;
      _th.diyMemberInfo = JSON.parse(data.info);
    });

    this.initDate();
    this.present();

    uni.$on("updateOfferList", function (data) {
      _th.keyword = "";
      _th.page = 1;
      _th.init();
    });
  },
  onShow() {
    let query = this.$Route.query;

    this.from = query.from;
    if (query.customer_id) {
      this.customer_id = query.customer_id;
      this.customer_name = query.customer_name;
    }

    // this.init(); // 报价单
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

    // 报价单
    init() {
      let info = this.dateInfo;
      let timing = info.activeDate;
      let status = this.showActiveStatus == 0 ? "" : this.showActiveStatus - 1;
      let customer_id = this.customer_id || "";
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

      getData("/offer/offer_record_list", {
        params: {
          timing,
          customer_id,
          status,
          department_id,
          user_id,
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { list, offer_status, role_id },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.role_id = role_id;
          this.statusList = offer_status;
          this.statusList.unshift("全部");

          if (this.page != 1) {
            this.offerList = this.offerList.concat(list.data);
          } else {
            this.offerList = list.data;
          }

          if (this.offerList.length > 0) {
            this.offerList.forEach((v) => {
              v.offer_list =
                v.offer_product && v.offer_product[0]
                  ? [v.offer_product[0]]
                  : [];
            });
          }

          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    // 新建
    addReturn() {
      this.$Router.push({
        path: `/offer_create`,
        query: {
          customer_id: this.customer_id,
          customer_name: this.customer_name,
        },
      });
    },

    detail(v) {
      this.$Router.push({
        path: `/offer_detail/${v.id}`,
        query: {
          offer_id: v.id,
        },
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
    chooseStatus(v, i) {
      this.activeStatus = i;
    },
    submitStatus() {
      this.showActiveStatus = this.activeStatus;
      this.checkStatusShow = false;
      this.page = 1;
      this.init();
    },
    // 选择状态 选择状态 选择状态 选择状态 选择状态 选择状态

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
  font-weight: 600;

  .iconfont {
    margin-left: 7px;
    width: 15px;
    height: 15px;
  }

  /deep/.u-modal {

    .u-modal__content__text {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #666666;
    }

    .u-modal__button-group__wrapper__text {
      font-size: 17px;
      font-weight: 400;
      color: #4d6fff;
    }

    .tips {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #333333;
      align-items: flex-start;

      .l_tit {
        margin-bottom: 15px;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #333333;
      }

      .r_info {
        .r_txt {
          margin-bottom: 4px;
          font-size: 13px;
          font-weight: 400;
          line-height: 18px;
          color: #333333;
        }
      }
    }
  }
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

        .status {
          padding: 0 8px;
          height: 25px;
          line-height: 25px;
          text-align: center;
          background: #f2f2f2;
          border-radius: 2px;
          font-size: 12px;
          font-weight: 600;
          color: #999999;
        }

        .pedding {
          background-color: #f0f5ff;
          color: #4d6fff;
        }

        .success {
          background-color: #fff4e3;
          color: #ff9d00;
        }

        .err {
          background-color: #ffe0d5;
          color: #ff4500;
        }
      }

      .info_mian {
        padding: 0 10px;

        .item_li {
          margin-bottom: 14px;
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

        .give {
          .label {
            font-size: 14px;
            line-height: 1;
            color: #333;
            font-weight: 600;
            line-height: 20px;
          }

          .content {
            font-size: 14px;
            line-height: 1;
            color: #333;
            font-weight: 600;
            line-height: 20px;
          }
        }

        :last-child {
          margin-bottom: 0;
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
    border-bottom: 1px solid #f4f4f4;

    .label {
      font-size: 14px;
      font-weight: 400;
      line-height: 1;
      color: #666666;
    }

    .t-icon {
      display: none;
      position: absolute;
      right: 20px;
      top: 5px;
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