<template>
  <view
    class="ask_detail"
    :class="userInfo.fake == '是' && detailInfo.status == 0 ? 'fake_btns' : ''"
  >
    <view
      class="top_tips"
      v-if="userInfo.fake == '是' && detailInfo.status == 0"
    >
      当前用户共发布{{ detailInfo.user_content_all }}篇资料，已审核通过{{
        detailInfo.user_content_public_all
      }}篇，通过率为{{ detailInfo.user_content_public_percent }}% <br />
    </view>

    <view class="top_info_content">
      <view class="info_user_box">
        <image
          class="avatar"
          :src="detailInfo.user ? detailInfo.user.avatar : ''"
        />

        <view class="user_info">
          <view class="nickname">{{
            detailInfo.user ? detailInfo.user.nickname : ""
          }}</view>
          <view class="time">
            <text>{{ detailInfo.show_time }}</text>
          </view>
        </view>
      </view>

      <view class="info_tit">
        <i :class="'t-icon iconfont t-icon-E-' + detailInfo.suffix"></i>
        <view class="type" v-if="detailInfo.resource_form">
          【{{ detailInfo.resource_form }}搜索】
        </view>
        {{ detailInfo.title }}
      </view>

      <view class="info_tags">
        <view class="q_tags">
          <view
            class="tags"
            v-for="(v, idx) in detailInfo.content_tags"
            :key="idx"
          >
            {{ v.name }}
          </view>
        </view>
      </view>

      <view class="html_content">
        <u-parse :html="detailInfo.html_content"></u-parse>
      </view>

      <u-modal
        v-model="show"
        ref="uModal"
        :title="title"
        :content="content"
        @confirm="confirm"
        @cancel="showModal"
        showCancelButton
        :asyncClose="true"
      >
      </u-modal>
      <view
        class="info_btns"
        v-if="userInfo.fake == '是' && detailInfo.status == 0"
      >
        <view class="btn_li" @tap="showModal"> 拉黑用户 </view>
        <view class="btn_li err" @tap="get_status(0)"> 审核不通过 </view>
        <view class="btn_li success" @tap="get_status(1)"> 审核通过 </view>
      </view>
    </view>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";

export default {
  data() {
    return {
      id: "", // 详情 id
      detailInfo: {},
      moreShow: false,
      userInfo: {},
      show: false,
      title: "拉黑用户",
      content: "确认拉黑此用户吗",
    };
  },
  onLoad: function (options) {
    this.id = this.$Route.query.id;
  },
  created() {
    let store_info = this.$store.state;
    let vuex_user = store_info.vuex_user;
    if (vuex_user.id) {
      this.$u.api.getUser().then((res) => {
        if (res.code === 200) {
          this.userInfo = res.data;
        }
      });
    }
    this.init();
  },
  methods: {
    async init() {
      await this.$u.api
        .getDownDetail({
          id: this.id,
        })
        .then((res) => {
          const {
            code,
            data: { content },
          } = res;
          if (code === 200) {
            this.detailInfo = content;
          }
        });
    },

    // 审核操作
    async get_status(type) {
      if (!authStatus()) return;

      let status = this.detailInfo.status;
      if (status != 0) return;

      await this.$u.api
        .getStatusDetail({
          id: this.detailInfo.id,
          method: type == 0 ? "cancel" : "add",
        })
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            this.$u.toast(data[0]);
            this.init();
            setTimeout(() => {
              this.navback();
            }, 2000);
          } else if (code === 422) {
            this.$u.toast({
              title: data[0],
              icon: "none",
            });
          }
        });
    },

    showModal() {
      this.show = !this.show;
    },
    confirm() {
      this.delete_user();
    },
    // 拉黑用户
    async delete_user() {
      if (!authStatus()) return;

      if (!this.detailInfo.user) {
        this.$u.toast("没有该用户");
        return;
      }

      await this.$u.api
        .getDeleteUser({
          id: this.detailInfo.user.id,
        })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$u.toast(msg);
            setTimeout(() => {
              this.navback();
            }, 2000);
          } else if (code === 422) {
            this.$u.toast({
              title: data.msg,
              icon: "none",
            });
          }
        });
    },
    navback() {
      uni.navigateBack({ delta: 1 });
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
.ask_detail {
  .top_tips {
    padding: 20rpx;
    width: 100%;
    // height: 80rpx;
    // line-height: 80rpx;
    font-size: 24rpx;
    color: #ff9d00;
    background: #fff6e3;
  }

  .top_info_content {
    position: relative;
    margin-bottom: 20rpx;
    padding: 28rpx 30rpx 40rpx;
    background-color: #fff;

    .info_user_box {
      display: flex;
      align-items: center;

      .avatar {
        margin-right: 16rpx;
        width: 64rpx;
        height: 64rpx;
        background: rgba(0, 0, 0, 0);
        border: 2rpx solid #f4f4f4;
        border-radius: 50%;
      }

      .user_info {
        .nickname {
          font-size: 30rpx;
          font-weight: 600;
          line-height: 42rpx;
          color: #333333;
        }

        .time {
          font-size: 22rpx;
          font-weight: 400;
          line-height: 32rpx;
          color: #999999;
        }
      }
    }

    .info_tit {
      margin: 20rpx 0;
      font-size: 36rpx;
      font-weight: 600;
      line-height: 50rpx;
      color: #333333;

      .t-icon {
        margin-right: 5rpx;
      }

      .type {
        display: inline-block;
        color: #4a94ff;
      }
    }

    .info_tags {
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 1;

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
    }

    .html_content {
      margin: 40rpx 0;
      word-break: break-all;

       /deep/ img {
        width: 100% !important;
      }
    }
  }

  .info_btns {
    position: fixed;
    bottom: 0;
    left: 0;
    padding: 0 30rpx;
    width: 100%;
    height: 174rpx;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;

    .btn_li {
      margin-right: 10rpx;
      width: 224rpx;
      height: 82rpx;
      line-height: 82rpx;
      border: 2rpx solid #2d2d2d;

      border-radius: 16rpx;
      text-align: center;
      font-size: 32rpx;
      font-weight: 400;
      color: #333;
    }

    .err {
      color: #fff;
      background-color: #333;
    }
    .success {
      color: #fff;
      background: #0268fa;
      border: 2rpx solid #0268fa;
    }
  }
}

.fake_btns {
  padding-bottom: 190rpx;
}
</style>
