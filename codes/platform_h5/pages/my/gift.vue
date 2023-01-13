<template>
  <view class="exchange_detail">
    <view class="msg_tabs">
      <u-tabs
        class="tabs"
        :list="tabs"
        :is-scroll="false"
        :current="current"
        @change="change"
        height="96"
        font-size="28"
        active-color="#0268FA"
        inactive-color="#333"
        bold
        bar-width="72"
        bar-height="4"
        gutter="10"
      ></u-tabs>
    </view>

    <!-- 礼品兑换 -->
    <view v-if="current == 0">
      <view class="exchange_list" v-if="exchangeList.length > 0">
        <view
          class="exchange_item d-flex"
          v-for="v in exchangeList"
          :key="v.id"
        >
          <image :src="ossUrl + v.thumb"></image>
          <view class="r_main">
            <view class="name">
              {{ v.name }}
              <view class="txt">限量 {{ v.inventory }}</view>
            </view>

            <view class="point">
              <view class="point_count d-flex">
                {{ v.point }}EBC
                <view class="unline"> {{ v.previous_point }}EBC </view>
              </view>

              <view
                class="change_btn"
                :class="v.inventory <= 0 ? 'un_get' : ''"
                :disabled="v.inventory <= 0"
                @tap="exchange(v)"
                >申请兑换</view
              >
            </view>
          </view>
        </view>
      </view>
      <lack v-else></lack>
    </view>

    <!-- 兑换记录 -->
    <view v-if="current == 1">
      <view class="record_list" v-if="recordList.length > 0">
        <view class="record_item" v-for="v in recordList" :key="v.id">
          <image :src="ossUrl + v.exchange_good.thumb"></image>

          <view class="r_main">
            <view class="name"> {{ v.exchange_good.name }} </view>

            <view class="price">
              价格：<text>{{ v.exchange_good.point }}EBC</text>
            </view>
            <view class="status">
              状态：
              <text class="going" v-if="v.status != '已兑换'">{{
                v.status
              }}</text>
              <text v-else>{{ v.status }}</text>
            </view>

            <view
              class="check"
              @tap="check_record(v)"
              v-if="v.status != '待兑换'"
              >查看</view
            >
          </view>
        </view>
      </view>

      <lack v-else></lack>
    </view>

    <!-- 查看兑换记录 -->
    <u-modal
      v-model="recordShow"
      :show-title="false"
      :show-confirm-button="false"
    >
      <view class="slot-content">
        <view class="record_main">
          <i class="icon iconfont icon-e-cha1" @click="recordShow = false"></i>
          <view class="title">查看</view>

          <view class="item">{{ record_title }}</view>
          <view class="item">{{ record_number }}</view>
        </view>
      </view>
    </u-modal>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";
export default {
  data() {
    return {
      ossUrl: `${window.location.protocol}//ebaina.oss-cn-hangzhou.aliyuncs.com/`,
      tabs: [
        {
          name: "礼品兑换",
        },
        {
          name: "兑换记录",
        },
      ],
      current: 0,
      page: 1,
      next_page: false,

      exchangeList: [],
      recordList: [],

      recordShow: false,
      record_title: "",
      record_number: "",

      scrollTop: 0,
    };
  },
  onShow() {
    if (!authStatus()) return;

    let query = this.$route.query;
    if (query.current) {
      this.current = query.current;
    }

    if (this.current == 0) {
      this.point_list();
    } else {
      this.record_list();
    }
  },
  methods: {
    change(index) {
      this.current = index;
      this.page = 1;

      if (this.current == 1) {
        this.record_list();
      } else {
        this.point_list();
      }
    },
    // 兑换列表
    point_list() {
      this.$u.api.exchangePoint().then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.exchangeList =
            this.page == 1 ? data.data : this.exchangeList.concat(data.data);
          this.next_page = data.next_page_url ? true : false;
        }
      });
    },
    // 兑换记录
    record_list() {
      this.$u.api.pointExchangeEecord().then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.recordList =
            this.page == 1 ? data.data : this.recordList.concat(data.data);
          this.next_page = data.next_page_url ? true : false;
        }
      });
    },

    // 兑换
    exchange(v) {
      console.log(v);
      if (v.inventory <= 0) return;

      this.$Router.push({
        path: "/user_center/exchange_point_detail",
        query: {
          id: v.id,
        },
      });
    },

    // 查看兑换记录
    check_record(v) {
      console.log(v);
      this.recordShow = true;
      if (v.exchange_good.virtual == "是") {
        this.record_title = `卡号：${v.card}`;
        this.record_number = `密码：${v.password}`;
      } else {
        this.record_title = `快递公司：${v.logistics_com}`;
        this.record_number = `物流单号：${v.logistics_number}`;
      }
    },
  },
  onReachBottom() {
    if (!this.next_page) return;
    this.page = this.page + 1;
    this.get_list();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
};
</script>

<style lang="scss" scoped>
.msg_tabs {
  background: #fff;
  border-bottom: 1rpx solid #f4f4f4;
}

.exchange_list {
  margin: 28rpx 16rpx;

  .exchange_item {
    margin-bottom: 20rpx;
    padding: 24rpx 14rpx 34rpx 26rpx;
    background: #ffffff;
    border-radius: 16rpx;

    image {
      margin-right: 26rpx;
      width: 204rpx;
      height: 204rpx;
      background: #ededed;
      border: 2rpx solid #e6e6e6;
      border-radius: 18rpx;
      flex-shrink: 0;
    }

    .r_main {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 100%;
      height: 204rpx;

      .name {
        font-size: 30rpx;
        font-weight: 600;
        line-height: 1;
        color: #333333;

        .txt {
          margin-top: 10rpx;
          font-size: 24rpx;
          font-weight: 400;
          line-height: 1;
          color: #999999;
        }
      }

      .point {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .point_count {
          font-size: 36rpx;
          font-weight: 600;
          color: #0268fa;

          .unline {
            margin-left: 10rpx;
            font-size: 24rpx;
            font-weight: 400;
            color: #999999;
            text-decoration: line-through;
          }
        }

        .change_btn {
          width: 196rpx;
          height: 72rpx;
          line-height: 72rpx;
          text-align: center;
          font-size: 28rpx;
          font-weight: 400;
          color: #0268fa;
          background: #ffffff;
          border: 2rpx solid #005ef4;
          border-radius: 36rpx;
        }

        .un_get {
          background-color: #f2f2f2;
          border: 2rpx solid #f2f2f2;
          color: #fff;
        }
      }
    }
  }
}

// 兑换记录
.record_list {
  margin: 28rpx 16rpx;

  .record_item {
    display: flex;
    margin-bottom: 20rpx;
    padding: 24rpx 38rpx 34rpx 26rpx;
    background: #ffffff;
    border-radius: 16rpx;

    image {
      margin-right: 26rpx;
      width: 204rpx;
      height: 204rpx;
      background: #ededed;
      border: 2rpx solid #e6e6e6;
      border-radius: 18rpx;
      flex-shrink: 0;
    }

    .r_main {
      width: 100%;

      .name {
        margin-bottom: 18rpx;
        font-size: 30rpx;
        font-weight: 600;
        line-height: 1;
        color: #333333;
      }

      .price {
        font-size: 28rpx;
        font-weight: 600;
        line-height: 1;
        color: #999999;

        text {
          color: #333333;
        }
      }

      .price {
        margin-bottom: 16rpx;
        font-size: 28rpx;
        font-weight: 600;
        line-height: 1;
        color: #999999;

        .txt {
          color: #333333;
        }
      }

      .status {
        font-size: 28rpx;
        font-weight: 600;
        line-height: 1;
        color: #999999;

        .going {
          color: #0268fa;
        }
      }

      .check {
        margin-top: 5rpx;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 1;
        color: #0268fa;
        text-align: right;
        text-decoration: underline;
      }

    }
  }
}

.record_main {
  padding: 38rpx 40rpx 90rpx;

  .iconfont {
    position: absolute;
    top: 38rpx;
    right: 40rpx;
  }

  .title {
    font-size: 32rpx;
    color: #333;
    font-weight: 600;
  }

  .item {
    padding-left: 34rpx;
    margin-top: 34rpx;
    font-size: 30rpx;
    font-weight: 400;
    line-height: 42rpx;
    color: #666666;
  }
}
</style>
