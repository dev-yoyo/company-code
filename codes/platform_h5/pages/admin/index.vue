<template>
  <view class="search">
    <u-tabs
      :list="tabs"
      :is-scroll="false"
      :current="current"
      @change="change"
    ></u-tabs>

    <!-- 专栏 -->
    <view v-if="current == 0">
      <view class="top_tit">
        <view class="line"></view>
        <view class="tit">共{{ artTotal }}篇专栏待审核</view>
        <view class="line"></view>
      </view>
      <view class="quest_ul" v-if="!art_is_empty">
        <view
          class="quest_li"
          v-for="(v, index) in articleList"
          :key="index"
          @tap="art_detail(v.id)"
        >
          <view class="tit"> {{ v.title }} </view>
          <view class="time"> {{ v.time }} </view>
        </view>
      </view>
      <lack v-else></lack>
    </view>

    <!-- AI硬件 -->
    <view v-if="current == 1">
      <view class="top_tit down_tit">
        <view class="line"></view>
        <view class="tit">共{{ downTotal }}篇资料待审核</view>
        <view class="line"></view>
      </view>
      <view class="dwon_top_tit"> 建议资料去pc端进行审核 </view>

      <view class="quest_ul" v-if="!down_is_empty">
        <view
          class="quest_li"
          v-for="(v, index) in downList"
          :key="index"
          @tap="down_detail(v.id)"
        >
          <view class="resource_tit">
            <i :class="'t-icon iconfont t-icon-E-' + v.suffix"></i>
            <view class="tit">
              <view class="type" v-if="v.resource_form">
                【{{ v.resource_form }}】
              </view>
              {{ v.title }}
            </view>
          </view>

          <view class="time"> {{ v.time }} </view>
        </view>
      </view>
      <lack v-else></lack>
    </view>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
    <login></login>
  </view>
</template>

<script>
import lack from "@/components/lack.vue";
import { authStatus } from "@/common/hooks.js";

export default {
  data() {
    return {
      current: 0,
      tabs: [
        {
          name: "专栏",
        },
        {
          name: "资料",
        },
      ],
      page: 1,

      articleList: [],
      downList: [],

      art_is_empty: false,
      down_is_empty: false,

      art_next_page: true,
      down_next_page: true,

      artTotal: 0,
      downTotal: 0,

      scrollTop: 0,
    };
  },
  onShow() {
    this.page = 1;
    this.get_list();
  },
  mounted() {
    // this.type = this.$Route.query.page || "";
    // this.current = this.type == "ai" ? 1 : 0;
  },
  methods: {
    change(index) {
      this.current = index;
      this.is_empty = false;
      this.page = 1;
      this.get_list();
    },
    get_list() {
      if (this.current == 0) {
        this.$u.api
          .adminList({
            page: this.page,
            type: 1,
          })
          .then((res) => {
            const {
              code,
              data: { content },
            } = res;
            if (code === 200) {
              uni.stopPullDownRefresh();
              if (this.page != 1) {
                this.articleList = this.articleList.concat(content.data);
              } else {
                this.articleList = content.data;
                this.art_is_empty = content.data.length <= 0;
              }
              this.art_next_page = content.next_page_url ? true : false;
              this.artTotal = content.total;
            }
          });
      } else {
        this.$u.api
          .adminList({
            page: this.page,
            type: 2,
          })
          .then((res) => {
            const {
              code,
              data: { content },
            } = res;
            if (code === 200) {
              uni.stopPullDownRefresh();
              if (this.page != 1) {
                this.downList = this.downList.concat(content.data);
              } else {
                this.downList = content.data;
                this.down_is_empty = content.data.length <= 0;
              }
              this.down_next_page = content.next_page_url ? true : false;
              this.downTotal = content.total;
            }
          });
      }
    },
    art_detail(id) {
      if (!authStatus()) return;

      this.$Router.push({
        name: "art_detail",
        params: { id },
      });
    },
    down_detail(id) {
      if (!authStatus()) return;

      this.$Router.push({
        name: "down_detail",
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
    if (this.current == 0) {
      if (!this.art_next_page) return this.$u.toast("已经到底啦~");
    } else {
      if (!this.down_next_page) return this.$u.toast("已经到底啦~");
    }

    this.page = this.page + 1;
    this.get_list();
  },
  onPullDownRefresh() {
    this.page = 1;
    this.get_list();
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
};
</script>

<style lang="scss">
.top_tit {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 28rpx 32rpx;

  .tit {
    margin: 0 32rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    white-space: nowrap;
  }

  .line {
    height: 1rpx;
    width: 214rpx;
    background-color: #e3e3e3;
  }
}
.down_tit {
  padding-bottom: 0;
}

.dwon_top_tit {
  margin-block: 28rpx;
  font-size: 24rpx;
  font-weight: 400;
  color: #999999;
  white-space: nowrap;
  text-align: center;
}

.quest_ul {
  .quest_li {
    margin-bottom: 2rpx;
    padding: 30rpx 34rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;

    .tit {
      font-size: 28rpx;
      font-weight: 600;
      color: #333333;

      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      overflow: hidden;
      word-break: break-all;
    }

    .time {
      margin-left: 30rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #999999;
      flex-shrink: 0;
    }
  }
}

.resource_tit {
  display: flex;
  align-items: center;

  .t-icon {
    margin-right: 5rpx;
  }

  .type {
    display: inline-block;
    color: #4a94ff;
  }
}
</style>
