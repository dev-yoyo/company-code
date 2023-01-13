<template>
  <view class="home">
    <searchBox page="home" v-if="isSearch"></searchBox>

    <!-- 热门回答 -->
    <view class="home_title d-flex" @click="to_ask(2)">
      <view>
        <i class="icon iconfont icon-e-rmhd"></i>
        热门回答
      </view>
      <text class="more">更多</text>
    </view>
    <view class="home_talk">
      <view clas="talk_list" v-for="item in hot" :key="item.id">
        <view class="talk_item d-flex" @click="to_ask_detail(item.id)">
          <text class="txt text-ellipsis-one">{{ item.title }}</text>
          <text class="view"
            >{{ item.reply_count }}<i class="icon iconfont icon-e-plno"></i
          ></text>
        </view>
      </view>
    </view>

    <!-- 悬赏问答 -->
    <view class="home_title d-flex" @click="to_ask(3)">
      <view>
        <i class="icon iconfont icon-e-xshd"></i>
        悬赏问答
      </view>
      <text class="more">更多</text>
    </view>
    <view class="home_talk">
      <view clas="talk_list" v-for="item in offer" :key="item.id">
        <view class="talk_item d-flex" @click="to_ask_detail(item.id)">
          <text class="ebc d-flex">
            <!-- <i class="t-icon t-icon-e-ebc"></i> -->
            <i class="t-icon t-icon-e-xjaaa"></i>
            {{ item.ebc > 99 ? "99+" : item.ebc }}</text
          >
          <text class="txt text-ellipsis-one">{{ item.title }}</text>
          <text class="view"
            >{{ item.reply_count }}<i class="icon iconfont icon-e-plno"></i
          ></text>
        </view>
      </view>
    </view>

    <!-- AI硬件 -->
    <view class="home_title d-flex" @click="to_ai()">
      <view>
        <i class="icon iconfont icon-e-aiyj"></i>
        AI硬件
      </view>
      <text class="more">更多</text>
    </view>
    <view class="home_ai">
      <view clas="ai_list" v-for="item in ai" :key="item.id">
        <view class="ai_item d-flex" @click="to_ai_detail(item.id)">
          <image class="img" :src="item.thumb[0]" mode="aspectFit"></image>
          <view class="info">
            <view class="title text-ellipsis-one">{{ item.name }}</view>
            <view class="chip">
              主控芯片：{{ item.main_controller_chip[0] }}
            </view>

            <view class="use"> 应用方向： {{ item.directions }} </view>

            <view class="sale" :class="!item.endTimeShow ? 'hide' : ''">
              <text class="tag">预售</text>
              <text class="time">{{ item.pEndTime }}</text>
              结束
            </view>

            <view class="money">
              售价：<text class="unit">￥</text
              ><text class="num">{{ item.price }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="home_title demand_tit d-flex" @click="to_demand()">
      <view>
        <i class="icon iconfont icon-e-sy-wb"></i>
        外包
      </view>
      <text class="more">更多</text>
    </view>

    <view class="home_demand">
      <view
        class="n_li"
        v-for="item in needsProList"
        :key="item.id"
        @tap="to_demand_detail(item.id)"
      >
        <view class="li_title">
          <view class="tit_type yellow">
            {{ item.type ? item.type : "暂无" }}
          </view>
          {{ item.title }}
        </view>

        <view class="info_box d-flex">
          <view class="info_li">
            <view class="tit">需求预算：</view>
            <view class="content money">{{
              item.budget ? "￥" + item.budget : "商议"
            }}</view>
          </view>
          <view class="info_li">
            <view class="tit">业务区域：</view>
            <view class="content">{{
              item.area ? item.area.name : "全国"
            }}</view>
          </view>
        </view>

        <view class="dashed_line"></view>

        <view class="info_box d-flex">
          <view class="info_li">
            <view class="tit">截止日期：</view>
            <view class="content">{{
              item.closing_timing ? item.closing_timing : "暂无"
            }}</view>
          </view>
          <view class="info_li">
            <i class="icon iconfont icon-yj"></i>
            {{ item.view_count ? item.view_count : 0 }}
          </view>
        </view>

        <view class="is_down" v-if="item.status !== '进行中'"> 已下线 </view>
      </view>
    </view>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
  </view>
</template>

<script>
import { intervalTime } from "@/common/hooks.js";

export default {
  data() {
    return {
      isSearch: true,
      scrollTop: 0,
      hot: [], // 热门回答
      offer: [], // 悬赏问答
      ai: [], // AI硬件
      needsProList: [],
    };
  },
  onShow() {
    // 刷新
    this.isSearch = false;
    this.$nextTick(() => {
      this.isSearch = true;
    });
    // 获取所有列表
    this.get_list();
  },
  methods: {
    get_list() {
      this.$u.api.getHomeList().then((res) => {
        const {
          code,
          data: { data },
        } = res;
        if (code === 200) {
          this.hot = data.hot_question || [];
          this.offer = data.xs_question || [];
          this.needsProList = data.demand_list;

          // ai  倒计时
          let arr = data.items;
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

                // console.log(i, r_time);
                e.pEndTime = r_time;
              } else {
                e.endTimeShow = false;
                clearInterval(e.inter);
              }
            }, 1000);
          });
          this.ai = arr;
        }

        uni.stopPullDownRefresh();
      });
    },
    to_ask(current) {
      this.$Router.push({
        path: "/ask",
        query: {
          current,
        },
      });
    },
    to_ask_detail(id) {
      this.$Router.push({
        name: "ask_detail",
        params: {
          id,
        },
      });
    },
    to_ai() {
      this.$Router.push({
        name: "ai",
      });
    },
    to_ai_detail(id) {
      this.$Router.push({
        name: "ai_detail",
        params: {
          id,
        },
      });
    },
    to_demand() {
      this.$Router.push({
        name: "needs",
      });
    },
    to_demand_detail(id) {
      this.$Router.push({
        name: "needs_detail",
        params: {
          id,
        },
      });
    },
    onPullDownRefresh() {
      this.get_list();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
  deactivated: function () {
    let arr = this.ai;
    arr.map((e) => {
      clearInterval(e.inter);
    });
    this.ai = arr;
  },
};
</script>

<style lang="scss">
page {
  background: #fff;
}

.home_title {
  justify-content: space-between;
  padding: 30rpx 30rpx 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  color: #666;

  .iconfont {
    font-size: 30rpx;
    color: #333;
    margin-right: 10rpx;
  }

  .more {
    font-weight: 400;
    color: #4a94ff;
  }
}

.home_talk {
  padding: 0 32rpx;
  border-bottom: 2rpx solid #f4f4f4;

  .talk_item {
    justify-content: space-between;
    margin-bottom: 32rpx;
  }

  .ebc {
    font-size: 24rpx;
    font-weight: 600;
    color: #FF6200;
    min-width: 80rpx;
    margin-right: 4rpx;
    /deep/ span {
      display: flex;
      align-items: center;
    }
    .t-icon {
      margin-right: 4rpx;
    }
  }

  .txt {
    flex: 1;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 40rpx;
    color: #333;
  }

  .view {
    font-size: 28rpx;
    font-weight: 400;
    line-height: 40rpx;
    color: #999;
    margin-left: 34rpx;

    .iconfont {
      font-size: 26rpx;
      margin-left: 10rpx;
    }
  }
}

.home_ai {
  padding: 0 16rpx 34rpx;

  .ai_list {
    padding-top: 16rpx;
  }

  .ai_item {
    padding: 24rpx 38rpx;
    margin-bottom: 16rpx;
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

.demand_tit {
  border-top: 1rpx solid #f4f4f4;
}

.home_demand {
  /* 项目需求 */
  padding: 0 16rpx;

  .n_li {
    position: relative;
    margin-bottom: 18rpx;
    padding: 30rpx 30rpx 40rpx;
    background-color: #fff;
    box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
    border-radius: 6rpx;
    overflow: hidden;

    .li_title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: 35rpx;

      margin-bottom: 25rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;

      .tit_type {
        position: relative;
        top: -6rpx;
        display: inline-block;
        margin-right: 10rpx;
        padding: 0 9rpx;
        height: 34rpx;
        line-height: 34rpx;
        border-radius: 6rpx;
        font-size: 20rpx;
        color: #fefefe;
        text-align: center;
        white-space: nowrap;
      }

      .yellow {
        background: #fe9f17;
      }
    }

    .info_box {
      justify-content: space-between;

      .info_li {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        line-height: 1;
        white-space: nowrap;

        .tit {
          color: #1b4fa8;
        }

        .content {
          color: #333333;
        }

        .icon-yj {
          margin-right: 10rpx;
          color: #999;
          font-size: 24rpx;
        }
      }

      .money {
        color: #ff0101 !important;
      }
    }

    .dashed_line {
      margin: 30rpx 0;
      width: 100%;
      border-top: 1rpx dashed #cccccc;
    }

    .is_down {
      transform: rotate(45deg);
      position: absolute;
      top: 10rpx;
      right: -68rpx;
      width: 200rpx;
      height: 45rpx;
      line-height: 45rpx;
      font-size: 20rpx;
      font-weight: 500;
      color: #cbcbcb;
      text-align: center;
      background: #e6e6e6;
    }
  }

  .is_down_bgc {
    opacity: 0.6;
  }
}
</style>
