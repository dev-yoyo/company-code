<template>
  <view class="msg">
    <view v-if="show">
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

      <!-- 回答/回复 -->
      <view v-if="current == 0">
        <view class="un_read_msg" v-if="tabs[0].count > 0">
          <view class="l_txt">还有{{ tabs[0].count }}条未读消息</view>

          <view class="action">
            <view class="btn" hover-class="none" @click="clear()"
              >全部已读</view
            >
          </view>
        </view>

        <view class="answer_list" v-if="!is_empty">
          <view class="answer_item" v-for="item in list" :key="item.id">
            <view class="reply d-flex" @tap="isRead(item)">
              <text class="dian" v-if="!item.read_at"></text>
              <view class="txt text-ellipsis-two">
                <text class="name">{{ item.data.user_name }}</text
                >{{
                  item.data.content_type == "replies" ? "回复" : "回答"
                }}了你<text class="content"
                  >“{{ item.data.reply_content }}”</text
                >
              </view>
            </view>
            <view class="time">{{ item.create_time }}</view>
          </view>
        </view>
        <lack v-else></lack>
      </view>

      <!-- 系统消息 -->
      <view v-if="current == 1">
        <view class="un_read_msg" v-if="tabs[1].count > 0">
          <view class="l_txt">还有{{ tabs[0].count }}条未读消息</view>

          <view class="action">
            <view class="btn" hover-class="none" @click="clear()"
              >全部已读</view
            >
          </view>
        </view>

        <view class="answer_list" v-if="!is_empty">
          <view class="answer_item" v-for="item in list" :key="item.id">
            <view class="reply d-flex" @tap="isRead(item)">
              <text class="dian" v-if="!item.read_at"></text>
              <view class="txt text-ellipsis-two">
                您发布的<text class="type">{{ item.type }}</text
                ><text class="content">“{{ item.data.content_title }}”</text
                >{{ item.data.desc }}
              </view>
            </view>
            <view class="time">{{ item.create_time }}</view>
          </view>
        </view>
        <lack v-else></lack>
      </view>

      <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
    </view>

    <lack v-else></lack>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";
export default {
  data() {
    return {
      tabs: [
        {
          name: "回答/回复",
          count: 0,
        },
        {
          name: "系统消息",
          count: 0,
        },
      ],
      current: 0,
      type: "question",
      list: [],
      is_empty: false,
      page: 1,
      next_page: true,
      scrollTop: 0,

      show: true,
    };
  },
  onShow() {
    if (this.$store.state.status !== 1) {
      this.show = false;
      return;
    }

    if (!authStatus()) return;

    this.get_list();
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
      this.type = this.current == 0 ? "question" : "system";
      this.$u.api
        .getMsgList({
          page: this.page,
          type: this.type,
        })
        .then((res) => {
          const {
            code,
            data: {
              notifications,
              msg_count: {
                question_notification_count,
                system_notification_count,
              },
            },
          } = res;

          let tab = this.tabs;
          tab[0].count = question_notification_count;
          tab[1].count = system_notification_count;
          this.tabs = tab;

          let data = notifications;
          this.list = this.page == 1 ? data.data : this.list.concat(data.data);
          this.next_page = data.next_page_url ? true : false;
          this.is_empty = this.list.length == 0;

          if (this.current == 1 && this.list.length > 0) {
            this.list.forEach((v, k) => {
              switch (v.data.content_type) {
                case "questions":
                  v.type = "问答";
                  break;
                case "xs_questions":
                  v.type = "悬赏问答";
                  break;
                case "articles":
                  v.type = "专栏";
                  break;
                case "resources":
                  v.type = "资料";
                  break;
              }
            });
          }
        });
    },
    isRead(v) {
      this.$u.api.getMsgRead({ id: v.id }).then((res) => {
        this.$Router.push({
          name: "ask_detail",
          params: {
            id: v.data.content_id,
          },
        });
      });
    },
    clear() {
      this.$u.api.getMsgClear({}).then((res) => {
        if (res.code === 200) {
          // this.$u.toast(res.data.msg);
          this.page = 1;
          this.get_list();
        }
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

<style lang="scss" scoped>
.msg_tabs {
  background: #fff;
  border-bottom: 1rpx solid #f4f4f4;
}

/deep/ .u-badge {
  right: 80rpx !important;
}

.un_read_msg {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 40rpx;

  .l_txt {
    font-size: 24rpx;
    color: #999;
  }
}

.action {
  .btn {
    width: 128rpx;
    height: 44rpx;
    line-height: 44rpx;
    background: #fff;
    border: 2rpx solid #005ef4;
    border-radius: 6rpx;
    font-size: 24rpx;
    font-weight: 400;
    color: #0268fa;
    text-align: center;

    .u-hairline-border:after {
      border: none;
    }
  }
}

.answer_list {
  .answer_item {
    padding: 26rpx 30rpx 20rpx;
    background-color: #fff;
    border-bottom: 2rpx solid #f4f4f4;

    .txt {
      flex: 1;
      font-size: 28rpx;
      line-height: 40rpx;
      color: #333;
      word-wrap: normal;
      word-break: break-all;
    }

    .dian {
      display: inline-block;
      width: 8rpx;
      height: 8rpx;
      background: #e50404;
      border-radius: 50%;
      margin-right: 10rpx;
    }

    .name {
      margin-right: 10rpx;
    }

    .type {
      margin-left: 10rpx;
    }

    .content {
      color: #999;
    }

    .time {
      font-size: 24rpx;
      line-height: 34rpx;
      color: #999;
      text-align: right;
    }
  }
}
</style>
