<template>
  <view class="search">
    <searchBox page="search"></searchBox>
    <u-tabs
      :list="tabs"
      :is-scroll="false"
      :current="current"
      @change="change"
    ></u-tabs>

    <!-- 问答 -->
    <view v-if="current == 0">
      <view class="quest_ul" v-if="!is_empty">
        <view
          class="quest_li"
          v-for="(v, index) in quest_list"
          :key="index"
          @tap="ask_detail(v.id)"
        >
          <view class="tit">
            <text class="reward" v-if="v.type == 1">【悬赏】</text>
            <text class="share" v-if="v.type == 2">【分享】</text>
            {{ v.title }}
          </view>

          <view class="btm_info">
            <view class="info_tags">
              <view
                class="q_tags"
                v-for="(val, idx) in v.content_tags"
                :key="idx"
              >
                <view class="tags"> {{ val.name }} </view>
              </view>
              <image
                class="jing"
                src="/static/common/img/jing_n.png"
                v-if="v.elite == 1"
              />
              <image
                class="hottest"
                :src="'/static/common/img/hot' + v.hot_level + '.png'"
                v-if="v.hot_level != 0"
              />
            </view>

            <view
              class="reply_count"
              :class="v.best_reply_id != 0 ? 'take' : ''"
            >
              <i class="icon iconfont icon-e-dg3"></i>
              <text>{{ v.reply_count }}</text>
              <i class="icon iconfont icon-e-pli"></i>
            </view>
          </view>
        </view>
      </view>
      <lack v-else></lack>
    </view>

    <!-- AI硬件 -->
    <view v-if="current == 1">
      <view class="ai_list" v-if="!is_empty">
        <view
          class="ai_item d-flex"
          v-for="item in ai"
          :key="item.id"
          @click="to_ai_detail(item.id)"
        >
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

            <view class="money"
              >售价：<text class="unit">￥</text
              ><text class="num">{{ item.price ? item.price : 0 }}</text></view
            >
          </view>
        </view>
      </view>
      <lack v-else></lack>
    </view>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
  </view>
</template>

<script>
import { intervalTime } from "@/common/hooks.js";
import lack from "@/components/lack.vue";
export default {
  data() {
    return {
      tabs: [
        {
          name: "问答",
        },
        {
          name: "AI硬件",
        },
      ],
      current: 0,
      val: "",
      quest_list: [],
      ai: [],
      is_empty: false,
      page: 1,
      next_page: true,
      scrollTop: 0,
      type: "",
    };
  },
  mounted() {
    this.val = this.$Route.query.search || "";
    this.type = this.$Route.query.page || "";
    this.current = this.type == "ai" ? 1 : 0;
    this.get_list();
  },
  methods: {
    change(index) {
      this.current = index;
      this.quest_list = [];
      this.ai = [];
      this.is_empty = false;
      this.page = 1;
      this.get_list();
    },
    get_list() {
      if (this.val == "") {
        this.is_empty = true;
				this.$u.toast('请输入关键词！');
				return;
      } else {
        if (this.current == 0) {
          this.$u.api
            .getSearch({
              q: this.val,
            })
            .then((res) => {
              this.quest_list = res.data.list.data;
              this.is_empty = this.quest_list.length == 0;
              uni.stopPullDownRefresh();
            });
        } else {
          this.$u.api
            .getSearchAi({
              q: this.val,
              page: this.page,
            })
            .then((res) => {
              const {
                code,
                data: { data },
              } = res;

              if (code === 200) {
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
                this.ai = arr;

                this.page == 1 ? data.data : this.ai.concat(data.data);
                this.next_page = data.next_page_url ? true : false;
                this.is_empty = this.ai.length == 0;
              }
              uni.stopPullDownRefresh();
            });
        }
      }
    },
    ask_detail(id) {
      this.$Router.push({
        name: "ask_detail",
        params: {
          id,
        },
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
  },
  components: {
    lack,
  },
  onReachBottom() {
    if (this.current == 1) {
      if (!this.next_page) return;
      this.page = this.page + 1;
      this.get_list();
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
  onPullDownRefresh() {
    this.page = 1;
    this.get_list();
  },
};
</script>

<style lang="scss">
.quest_ul {
  padding: 16rpx 0 60rpx;
  .quest_li {
    position: relative;
    margin-bottom: 2rpx;
    padding: 28rpx 30rpx;
    background: #fff;
    overflow: hidden;

    .tit {
      margin-bottom: 18rpx;
      font-size: 32rpx;
      font-weight: 600;
      line-height: 44rpx;
      color: #333333;
      word-break: break-all;

      .reward {
        color: #ffb612;
      }

      .share {
        color: #0268fa;
      }
    }

    .btm_info {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .info_tags {
        display: flex;

        .q_tags {
          display: flex;

          .tags {
            margin-right: 12rpx;
            padding: 0 8rpx;
            height: 32rpx;
            line-height: 32rpx;
            font-size: 22rpx;
            color: #1462c1;
            background: #dcecff;
          }
        }

        .jing {
          margin-right: 12rpx;
          width: 44rpx;
          height: 32rpx;
        }

        .hottest {
          width: 46rpx;
          height: 32rpx;
        }
      }

      .reply_count {
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;

        text {
          margin: 0 8rpx;
        }

        .icon-e-dg3 {
          display: none;
        }
      }

      .take {
        color: #0268fa !important;

        .icon-e-dg3 {
          display: inline-block;
        }
      }
    }
  }
}

.ai_list {
  padding: 16rpx 0 60rpx;

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
</style>
