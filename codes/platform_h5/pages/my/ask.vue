<template>
  <view class="collcet">
    <u-tabs
      :list="tabs"
      :is-scroll="false"
      :current="current"
      @change="change"
    ></u-tabs>

    <view v-if="current == 0">
      <view class="collcet_list" v-if="!is_empty">
        <view
          class="collcet_item"
          v-for="(v, index) in list"
          :key="index"
          @tap="ask_detail(v.id)"
        >
          <view class="title">
            <text class="reward" v-if="v.type == 1">【悬赏】</text>
            <text class="share" v-if="v.type == 2">【分享】</text>
            {{ v.title }}
          </view>

          <view class="info">
            <view class="time">{{ v.show_time }}</view>
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

    <!-- 回答 -->
    <view v-if="current == 1">
      <view class="collcet_list" v-if="!is_empty">
        <view
          class="collcet_item"
          v-for="(v, index) in list"
          :key="index"
          @tap="ask_detail(v.questions.id)"
        >
          <view class="title">{{ v.summary }}</view>

          <view class="content d-flex">
            <text class="other">问题："</text>
            <view class="txt text-ellipsis-one" v-if="v.questions">
              {{ v.questions && v.questions.title ? v.questions.title : "" }}
              "
            </view>
            <text class="txt text-ellipsis-one" v-else> 该提问已被删除 </text>
          </view>

          <view class="info">
            <view class="time">{{ v.show_time }}</view>
            <view
              class="best"
              v-if="v.questions && v.questions.best_reply_id == v.id"
              ><image
                src="/static/common/img/beast_reply.png"
                alt="易百纳技术社区"
              ></image
              >最佳答案</view
            >
          </view>
        </view>
      </view>
      <lack v-else></lack>
    </view>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

    <login></login>
    <!-- 创建提问 -->
    <image
      class="ask_create_btn"
      src="/static/common/img/ask_create.png"
      @tap="ask_create()"
    />
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";
export default {
  data() {
    return {
      tabs: [
        {
          name: "提问",
        },
        {
          name: "回答",
        },
      ],
      current: 0,
      type: "ask",
      list: [],
      is_empty: false,
      page: 1,
      next_page: true,
      scrollTop: 0,
    };
  },
  onShow() {
    this.get_list();
    if (!authStatus()) return;
  },
  methods: {
    change(index) {
      this.current = index;
      this.list = [];
      this.is_empty = false;
      this.page = 1;
      this.get_list();
    },
    get_list() {
      this.type = this.current == 0 ? "ask" : "replies";
      this.$u.api
        .getUserAsk({
          page: this.page,
          type: this.type,
        })
        .then((res) => {
          let data = res.data;
          this.list = this.page == 1 ? data.data : this.list.concat(data.data);
          this.next_page = data.next_page_url ? true : false;
          this.is_empty = this.list.length == 0;
        });
    },
    ask_detail(id) {
      this.$Router.push({
        name: "ask_detail",
        params: {
          id,
        },
      });
    },
    ask_create() {
      this.$Router.push({
        name: "ask_create",
      });
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

<style lang="scss">
.collcet_list {
  .collcet_item {
    margin-bottom: 2rpx;
    padding: 28rpx 30rpx;
    background: #fff;

    .title {
      margin-bottom: 16rpx;
      font-size: 30rpx;
      font-weight: 600;
      line-height: 44rpx;
      color: #333;
      word-break: break-all;

      .reward {
        font-size: 32rpx;
        color: #ffb612;
      }

      .share {
        font-size: 32rpx;
        color: #0268fa;
      }
    }
    .content {
      padding: 18rpx;
      background: #f2f2f2;
      margin-bottom: 24rpx;
      font-size: 28rpx;
      line-height: 48rpx;
      color: #666;

      .other {
        width: 100rpx;
        white-space: nowrap;
      }

      .txt {
        width: 100%;
      }
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      font-size: 28rpx;

      .reply_count {
        text {
          margin: 0 8rpx;
        }

        .iconfont {
          font-size: 20rpx;
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

    .best {
      display: flex;
      align-items: center;
      padding: 5rpx 7rpx;
      background: #effff4;
      border-radius: 8rpx;
      white-space: nowrap;
      font-size: 24rpx;
      line-height: 34rpx;
      color: #368d00;

      image {
        height: 28rpx;
        width: 26rpx;
        margin-right: 8rpx;
      }
    }
  }
}

.ask_create_btn {
  display: block;
  position: fixed;
  top: 834rpx;
  right: 12rpx;
  width: 132rpx;
  height: 132rpx;
}
</style>
