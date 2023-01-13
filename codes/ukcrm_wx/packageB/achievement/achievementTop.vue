<template>
  <view class="detail">
    <u-sticky offset-top="0">
      <u-navbar bgColor="transparent" placeholder />
      <u-navbar
        bgColor="transparent"
        title="业绩排行"
        titleStyle="color:#fff;"
        leftIconColor="#fff"
        @leftClick="leftClick"
      />

      <view class="com_top_tit d-center">
        <view class="tit">业绩排行</view>
        <view class="r_select d-center">
          <view class="item d-center" @click="dateShow = true">
            {{ dateInfo.activeDate || "本年度" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>
        </view>
      </view>
    </u-sticky>



    <view class="per_main">
      <view class="list_bgc"></view>
      <view class="list" v-if="achievementList.length > 0">
        <view
          class="item d-between"
          v-for="(v, i) in achievementList"
          :key="i"
        >
          <view class="l_info d-center">
            <view class="top_count" v-if="i < 3">
              <view class="txt"> N0{{ i + 1 }}</view>
              <image :src="top1" v-if="i == 0"></image>
              <image :src="top2" v-if="i == 1"></image>
              <image :src="top3" v-if="i == 2"></image>
            </view>

            <view class="count" v-else>{{ i + 1 }}</view>

            <view class="user_info avatar_box d-center">
              <u-avatar
                :src="v.user.avatar"
                :size="46"
                shape="square"
                bg-color="#4D6FFF"
                mode="aspectFit"
                v-if="v.user.avatar"
              ></u-avatar>
              <u-avatar
                :text="v.user.abbreviation"
                :size="42"
                shape="square"
                bg-color="#4D6FFF"
                mode="aspectFit"
                v-else
              ></u-avatar>

              <view class="info">
                <view class="name u-line-1">{{ v.user.name || "" }}</view>
                <view class="branch_name"> {{ v.user.department.name || "" }}</view>
              </view>
            </view>
          </view>

          <view class="r_info">
            <view class="count">{{ v.contract_num || "" }}笔</view>
            <view class="pirce"> <text>¥</text> {{ v.total_money || "" }}</view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

        <view class="txt"> 暂无数据 </view>
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
  </view>
</template>

<script>
import store from "@/store";
import { getData, timeSearch } from "@/common/api";
import { navBack } from "@/common/hooks";
import choosedate from "@/components/chooseDate.vue"; // 选择时间

export default {
  data() {
    return {
      role_id: null,
      next_page: true,
      page: 1,
      noData: store.state.no_data,
      achievementList: [], // 业绩排行
      top1:`${store.state.ossBaseUrl}direct/resource/202202/24/HRH4ejj2XQNrk5MtSf2Jxd5cNi58cGdS1645674159705.png`,
      top2:`${store.state.ossBaseUrl}direct/resource/202202/24/7fF2Y6rYepaSzEERKSh2Ajb8Ec4BMp8N1645674220709.png`,
      top3:`${store.state.ossBaseUrl}direct/resource/202202/24/y3rM4RwpypRBs5PMHkMQ2PsrrFxFr3Bn1645674234223.png`,

      dateShow: false,
      dateList: [],
      dateInfo: {
        activeDate: "本年度", // i 后端arr diy 自定义
        startTime: "",
        endTime: "",
        showStartTime: "",
        showEndTime: "",
      },
    };
  },
  onLoad() {
    this.init();
  },
  onShow() {},
  methods: {
    init() {
      this.getList();
      this.initDate();
      // 今日、本周等数组
      timeSearch().then((res) => {
        const { code, data } = res;
        if (code == 200) {
          this.dateList = data.time_search;
        }
      });
    },
    getList() {
      let info = this.dateInfo;
      let timing = info.activeDate;
      if (info.showStartTime && info.showEndTime) {
        timing = [info.showStartTime, info.showEndTime];
      }

      getData("/index/performance_ranking", {
        params: {
          timing,
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { performance_ranking },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          let list = performance_ranking;

          if (this.page != 1) {
            this.achievementList = this.achievementList.concat(list.data);
          } else {
            this.achievementList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },
    leftClick() {
      navBack();
    },

      // 成员信息
    userDetail(v) {
      // if (this.user_id == v.id || !this.customer_num_exhibition) return;

      this.$Router.push({
        path: "/member_detail",
        query: {
          member_user_id: v.id,
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
    selectDateShow() {
      this.dateShow = true;
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
    setTimeout(() => {
      uni.hideLoading()
    }, 1000)
  },
  onPullDownRefresh() {
    this.page = 1;
    this.init();
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 30px;
}

/deep/.u-navbar {
  z-index: 9;
}

/deep/.u-sticky {
  padding: 0 15px;
  // height: 120px;

  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/%E9%A3%9E%E4%B9%A620220303-104617.png");
  background-size: 100% 100%;
}

.list_bgc {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 124px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/%E9%A3%9E%E4%B9%A620220303-104740.png");
  background-size: 100% 100%;
  z-index: -1;
}

.com_top_tit {
  margin-top: 10px;
  padding: 0 5px 15px;
  justify-content: space-between;

  .tit {
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    color: #ffffff;
  }

  .r_select {
    .item {
      margin-left: 20px;
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
      color: #fff;

      .iconfont {
        margin-left: 6px;
        font-size: 6px;
      }
    }
  }
}

.per_main {
  position: relative;
  padding: 0 15px;
  width: 100%;

  .item {
    position: relative;
    margin-bottom: 10px;
    padding: 0 22px 0 44px;
    width: 100%;
    height: 82px;
    background: #ffffff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;

    .l_info {
      .top_count {
        position: absolute;
        top: 0;
        left: 0;
        padding: 9px 7px;
        width: 83px;
        height: 78px;

        .txt {
          position: relative;
          font-size: 12px;
          font-weight: 600;
          color: #ffffff;
          z-index: 2;
        }

        image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }
      }

      .count {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        width: 18px;
        height: 18px;
        line-height: 18px;
        background: #c3c3c3;
        border-radius: 50%;
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
        text-align: center;
      }

      .user_info {
        .info {
          margin-left: 10px;

          .name {
            margin-bottom: 3px;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            color: #333333;
          }
          .branch_name {
            font-size: 12px;
            font-weight: 400;
            line-height: 1;
            color: #666666;
          }
        }
      }
    }

    .r_info {
      text-align: right;

      .count {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #999999;
      }

      .pirce {
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #ff9d00;

        text {
          font-size: 13px;
        }
      }
    }
  }
  .item:last-child {
    border-bottom: none;
  }
}

.slogan {
  width: 100%;
  height: 661px;
  background: #fff;
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
  border-radius: 10px;

  padding: 194px 0 0;
}
</style>