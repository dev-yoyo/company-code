<template>
  <view class="detail">
    <u-sticky offset-top="0">
      <u-navbar bgColor="transparent" placeholder />
      <u-navbar
        bgColor="transparent"
        title="销售排行"
        titleStyle="color:#fff;"
        leftIconColor="#fff"
        @leftClick="leftClick"
      />

      <view class="com_top_tit d-center">
        <view class="tit">销售排行</view>
        <view class="r_select d-center">
          <view class="item d-center" @click="dateShow = true">
            {{ dateInfo.activeDate || "本年度" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>
        </view>
      </view>
    </u-sticky>

    <view class="sell_main">
      <view class="list_bgc"></view>
      <view class="list" v-if="sellList.length > 0">
        <view
          class="item"
          v-for="(v, i) in sellList"
          :key="i"
        >
          <view class="top_count" v-if="i < 3">
            <view class="txt"> N0{{ i + 1 }}</view>
            <image :src="top1" v-if="i == 0"></image>
            <image :src="top2" v-if="i == 1"></image>
            <image :src="top3" v-if="i == 2"></image>
          </view>

          <view class="top_info d-flex">
            <u-avatar
              :src="v.product"
              :size="42"
              shape="square"
              bg-color="#4D6FFF"
              mode="aspectFit"
            ></u-avatar>

            <view class="name u-line-2">
              {{ v.product_name }}
            </view>
          </view>

          <view class="btm_counts d-between">
            <view class="count"> 销量 {{ v.product_num }} </view>
            <view class="money d-center">
              <view class="label"> 销售金额： </view>
              <text>¥</text> {{ v.t_price || "" }}
            </view>
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
import choosedate from "@/components/chooseDate.vue"; // 选择时间
import { navBack } from "@/common/hooks";

export default {
  data() {
    return {
      role_id: null,
      noData: store.state.no_data,
      next_page: true,
      page: 1,
      sellList: [], // 销售排行
      top1: `${store.state.ossBaseUrl}direct/resource/202202/24/HRH4ejj2XQNrk5MtSf2Jxd5cNi58cGdS1645674159705.png`,
      top2: `${store.state.ossBaseUrl}direct/resource/202202/24/7fF2Y6rYepaSzEERKSh2Ajb8Ec4BMp8N1645674220709.png`,
      top3: `${store.state.ossBaseUrl}direct/resource/202202/24/y3rM4RwpypRBs5PMHkMQ2PsrrFxFr3Bn1645674234223.png`,

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

      getData("/index/sale_product", {
        params: {
          timing,
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { contract_product },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          let list = contract_product;

          if (this.page != 1) {
            this.sellList = this.sellList.concat(list.data);
          } else {
            this.sellList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    leftClick() {
      navBack();
    },

    // detail(v) {
    //   this.$Router.push({
    //     path: `/detail_product/${v.product_id}`,
    //     query: {
    //       product_id: v.product_id,
    //     },
    //   });
    // },

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
      console.log("确认时间选择", v);
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
/deep/.u-navbar {
  z-index: 9;

  .u-navbar__content__title {
    color: #fff;
  }

  .u-icon__icon {
    color: #fff !important;
  }
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

.sell_main {
  position: relative;
  padding: 0 15px 30px;

  .item {
    position: relative;
    margin-bottom: 10px;
    padding: 22px 20px 0;
    width: 100%;
    height: 123px;
    background: #ffffff;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
    border-radius: 10px;
    overflow: hidden;

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

    .top_info {
      margin-bottom: 18px;
      .name {
        margin-left: 12px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
      }
    }

    .btm_counts {
      .count {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }

      .money {
        color: #ff9d00;
        font-size: 14px;
        line-height: 1;

        .label {
          font-size: 12px;
          color: #333333;
        }

        text {
          font-size: 12px;
        }
      }
    }
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