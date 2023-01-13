<template>
  <view class="wrap">
    <searchBox page="ask" v-if="isSearch"></searchBox>

    <view class="top_tabs_box">
      <u-tabs
        :list="tabList"
        :is-scroll="false"
        :current="current"
        @change="tabChange"
      ></u-tabs>

      <view class="classify" @click="classifyShow = true">
        分类
        <i class="icon iconfont icon-e-fl4"></i>
      </view>
    </view>

    <u-popup
      v-model="classifyShow"
      mode="bottom"
      :mask-close-able="false"
      border-radius="16"
    >
      <view class="channel_popup">
        <view class="top_tit">
          <text>分类</text>

          <i
            class="icon iconfont icon-e-cha1"
            @click="classifyShow = false"
          ></i>
        </view>

        <view class="classify_tags_box">
          <view
            class="tags"
            :class="channelId == 0 ? 'active' : ''"
            @tap="change_channel(0)"
          >
            全部
          </view>

          <view
            class="tags"
            :class="channelId == v.id ? 'active' : ''"
            v-for="(v, idx) in channelList"
            :key="idx"
            @tap="change_channel(v.id)"
          >
            {{ v.name }}
          </view>
        </view>
      </view>
    </u-popup>

    <view>
      <view class="quest_ul">
        <view
          class="quest_li"
          v-for="(v, index) in questList"
          :key="index"
          @tap="ask_detail(v.id)"
        >
          <view class="tit">
            <text class="reward" v-if="v.type == 1">【悬赏】</text>
            <text class="share" v-if="v.type == 2">【分享】</text>
            {{ v.title }}
						<image class="new" v-if="v.isToday" src="../../static/common/img/new_n.png" mode=""></image>
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

            <view class="top" v-if="v.display_order == 1 && contentType == 100">
              置顶
            </view>
          </view>
        </view>
      </view>
    </view>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

    <!-- 创建提问 -->
    <image
      class="ask_create_btn"
      src="/static/common/img/ask_create.png"
      @tap="ask_create()"
    />

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";

export default {
  data() {
    return {
      isSearch: true,
      page: 1,
      next_page: true,
      current: 0,
      contentType: 100, // 100 全部   10 101 102 103
      tabList: [
        {
          name: "全部",
          id: 100,
        },
        {
          name: "最新",
          id: 10,
        },
        {
          name: "最热",
          id: 101,
        },
        {
          name: "悬赏",
          id: 103,
        },
        {
          name: "等我来答",
          id: 102,
        },
      ],
      questList: [],
      classifyShow: false, // 分类
      channelList: [],
      channelId: 0, // 分类 id
      scrollTop: 0,
    };
  },
  onLoad() {
    this.page = 1;
    this.askList();
  },
  onShow() {
    this.isSearch = false;
    this.$nextTick(() => {
      this.isSearch = true;
    });

    this.getChannel();

    this.page = 1;
    this.contentType = 100
    this.askList();

    let query = this.$Route.query;
    if (query.current == 2) {
      this.channelId = 0;
    }

    this.current = query.current || 0;
    this.contentType = this.tabList[this.current].id;
  },
  methods: {
    async askList() {
      await this.$u.api
        .getAskList({
          page: this.page,
          contentType: this.contentType,
          channelId: this.channelId,
        })
        .then((res) => {
          console.log(res);
          const {
            code,
            data: { data },
          } = res;
          if (code === 200) {
            uni.stopPullDownRefresh();

            if (this.page != 1) {
              this.questList = this.questList.concat(data.data);
            } else {
              this.questList = data.data;
            }
						let date = new Date().getDate();
						this.questList.map(i=>{
							i.isToday = false;
							if(i.created_at_format.split(' ')[0].substring(8) == date){
								i.isToday = true
							}
						})
            this.next_page = data.next_page_url ? true : false;
          }
        });
    },
    // 分类列表
    async getChannel() {
      await this.$u.api.getAskChannel().then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.channelList = data;
        }
      });
    },
    // tabs通知swiper切换
    tabChange(index) {
      this.current = index;
      this.contentType = this.tabList[index].id;
      this.page = 1;
      this.askList();
    },
    change_channel(id) {
      this.channelId = id;
      this.page = 1;
      this.classifyShow = false;
      this.askList();
    },
    ask_detail(id) {
      this.$Router.push({
        name: "ask_detail",
        params: { id },
      });
    },
    ask_create() {
      if (!authStatus()) return;

      this.$Router.push({
        name: "ask_create",
      });
    },

    onReachBottom() {
      if (!this.next_page) return;
      this.page = this.page + 1;
      this.askList();
    },
    onPullDownRefresh() {
      this.page = 1;
      this.askList();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
.top_tabs_box {
  margin-block: 10rpx;
  display: flex;
  padding: 0 30rpx;
  align-items: center;
  justify-content: space-between;
  background: #fff;

  .classify {
    font-size: 28rpx;
    font-weight: 400;
    color: #666666;
    flex-shrink: 0;
    .iconfont {
      margin-left: 5rpx;
      font-size: 28rpx;
    }
  }
}

/deep/ .u-tab-scroll-box {
  justify-content: flex-start !important;
}

/deep/ .u-tab-item {
  margin-right: 36rpx;
  padding: 0 !important;
  flex: none !important;
}

.quest_ul {
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
			.new {
				width: 64rpx;
				height: 20rpx;
				margin-left: 20rpx;
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

    .top {
      position: absolute;
      top: -50rpx;
      right: -50rpx;
      transform: rotate(45deg);
      width: 100rpx;
      height: 100rpx;
      line-height: 160rpx;
      font-size: 24rpx;
      font-weight: 600;
      color: #fff;
      text-align: center;
      background: #ffbb00;
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

// 分类 弹框
.channel_popup {
  padding: 50rpx 30rpx 50rpx 0;
  background: #f4f4f4;
  overflow: hidden;
}

.top_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 24rpx;
  margin-bottom: 54rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1;
  .iconfont {
    font-size: 16rpx;
    color: #999999;
  }
}

.classify_tags_box {
  display: flex;
  flex-wrap: wrap;

  .tags {
    margin-left: 24rpx;
    margin-bottom: 32rpx;
    padding: 0 18rpx;
    min-width: 154rpx;
    height: 72rpx;
    line-height: 72rpx;
    font-size: 30rpx;
    color: #333333;
    text-align: center;
    background: #fff;
    border-radius: 8rpx;
    flex-shrink: 0;
  }

  .active {
    color: #fff;
    background: #0268fa;
  }
}
</style>
