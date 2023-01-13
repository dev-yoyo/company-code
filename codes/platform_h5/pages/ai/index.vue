<template>
  <view class="wrap">
    <searchBox page="ai" v-if="isSearch"></searchBox>

    <view class="home_ai">
      <view clas="ai_list" v-for="item in aiList" :key="item.id">
        <view class="ai_item d-flex" @click="to_ai_detail(item.id)">
          <image class="img" :src="item.thumb[0]" mode="aspectFit"></image>
          <view class="info">
            <view class="title text-ellipsis-one">{{ item.name }}</view>
            <view class="chip">
              主控芯片： {{ item.main_controller_chip[0] }}
            </view>

            <view class="use"> 应用方向： {{ item.directions }} </view>

            <view class="sale" :class="!item.endTimeShow ? 'hide' : ''">
              <text class="tag">预售</text>
              <text class="time">{{ item.pEndTime }}</text>
              <!-- <view class="sale" :class="item.is_presell == 1 ? '' : 'hide'"> -->
              <!-- <text class="time">{{ item.presell_end_date }}</text> -->
              结束
            </view>

            <view class="money"
              >售价：<text class="unit">￥</text
              ><text class="num">{{ item.price }}</text></view
            >
          </view>
        </view>
      </view>
    </view>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

    <!-- 购物车 -->
    <image
      class="ask_create_btn"
      src="/static/common/img/ShopCar.png"
      @tap="shopping"
    />
    <login></login>
  </view>
</template>

<script>
import { authStatus, intervalTime } from "@/common/hooks.js";
export default {
  data() {
    return {
      isSearch: true,
      page: 1,
      next_page: true,
      aiList: [],
      scrollTop: 0,
    };
  },
  onShow() {
    this.isSearch = false;
    this.$nextTick(() => {
      this.isSearch = true;
    });

    this.getList();
  },
  methods: {
    async getList() {
      await this.$u.api
        .getAiList({
          page: this.page,
        })
        .then((res) => {
          const { code, data } = res;

          if (code === 200) {
            uni.stopPullDownRefresh();

            let arr = data.data;
            arr.map((e, i) => {
              let dirs = [];
              e.item_use_directions.map((e) => {
                dirs.push(e.name);
              });
              e.directions = dirs.join("、");

              e.endTimeShow = false;
              e.inter = "";
              e.pEndTime = "";

              e.inter = setInterval(() => {
                let time = intervalTime(e.presell_end_date);
                if (time) {
                  e.endTimeShow = true;
                  let r_time = `${time.d}天${time.h}:${time.m}:${time.s}`;

                  console.log(i, r_time);
                  e.pEndTime = r_time;
                } else {
                  e.endTimeShow = false;
                  clearInterval(e.inter);
                }
              }, 1000);
            });
            data.data = arr;

            if (this.page != 1) {
              this.aiList = this.aiList.concat(data.data);
            } else {
              this.aiList = data.data;
            }
            this.next_page = data.next_page_url ? true : false;
          }
        });
    },
    to_ai_detail(id) {
      this.$Router.push({
        name: "ai_detail",
        params: { id },
      });
    },
    shopping() {
      if (!authStatus()) return;

      this.$Router.push({
        path: "/shopping_cars",
      });
    },

    onReachBottom() {
      if (!this.next_page) return;
      this.page = this.page + 1;
      this.getList();
    },
    onPullDownRefresh() {
      this.page = 1;
      this.getList();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
  deactivated: function () {
    let arr = this.aiList;
    arr.map((e) => {
      clearInterval(e.inter);
    });
    this.aiList = arr;
  },
};
</script>

<style lang="scss" scoped>
.ask_create_btn {
  display: block;
  position: fixed;
  top: 834rpx;
  right: 12rpx;
  width: 132rpx;
  height: 132rpx;
}

.home_ai {
  padding: 34rpx 0;

  .ai_list {
    padding-top: 16rpx;
  }

  .ai_item {
    margin-bottom: 16rpx;
    padding: 24rpx 38rpx;
    background: #fff;
    box-shadow: 0 0 6rpx rgba(0, 0, 0, 0.16);
  }

  .img {
    height: 228rpx;
    width: 228rpx;
    margin-right: 32rpx;
  }

  .info {
    flex: 1;
  }

  .title {
    font-size: 30rpx;
    font-weight: 600;
    line-height: 42rpx;
    color: #333;
    margin-bottom: 8rpx;
  }

  .chip,
  .use {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 34rpx;
    color: #666;
    margin-bottom: 8rpx;
  }

  .sale {
    height: 44rpx;
    line-height: 44rpx;
    margin-bottom: 8rpx;
    background: #e2f0ff;
    font-size: 26rpx;
    font-weight: 400;
    color: #333;
    padding: 0 14rpx 0 0;
    border-radius: 4rpx;
    overflow: hidden;
  }

  .sale.hide {
    visibility: hidden;
  }

  .tag {
    width: 62rpx;
    height: 44rpx;
    background: #0268fa;
    font-size: 22rpx;
    color: #fff;
    line-height: 44rpx;
    padding: 6rpx 10rpx;
    margin-right: 14rpx;
  }

  .time {
    color: #0268fa;
    margin-right: 10rpx;
  }

  .money {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 34rpx;
    color: #666;
  }

  .unit {
    font-size: 24rpx;
    font-weight: 600;
    color: #e50404;
  }

  .num {
    font-size: 32rpx;
    font-weight: 600;
    color: #e50404;
  }
}
</style>
