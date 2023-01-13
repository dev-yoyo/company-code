<template>
  <view class="need_detail" v-if="show">
    <view class="n_li">
      <view class="li_title"> {{ info.title }} </view>

      <view class="info_box d-flex">
        <view class="info_li">
          <view class="tit">外包预算</view>
          <view class="content money">
            <text v-if="info.budget">￥</text>
            {{ info.budget ? info.budget : "商议" }}
          </view>
        </view>

        <view class="info_li padd_left">
          <view class="tit">业务区域</view>
          <view class="content">{{ info.area ? info.area.name : "全国" }}</view>
        </view>

        <view class="info_li">
          <view class="tit">截止日期</view>
          <view class="content">
            {{ info.closing_timing ? info.closing_timing : "暂无" }}</view
          >
        </view>

        <view class="info_li padd_left">
          <view class="tit">需求分类</view>
          <view class="content"> {{ info.type ? info.type : "暂无" }}</view>
        </view>

        <view class="info_li">
          <view class="tit">
            <i class="icon iconfont icon-yj"></i>
          </view>
          {{ info.view_count ? info.view_count : 0 }}
        </view>
      </view>

      <view class="dashed_line"></view>

      <view class="content_box">
        <view class="content_tit">
          <i class="t-icon t-icon-xqms"></i>
          需求描述
        </view>

        <view class="content">
          {{ info.content }}
        </view>

        <view class="imgs_box">
          <image
            :src="item"
            v-for="(item, index) in info.thumbs"
            :key="index"
            mode="aspectFit"
          />
        </view>
      </view>
    </view>

    <view class="btm_btns" v-if="!isSelf">
      <view class="btn is_down" v-if="info.status == '已下线'"> 已下线 </view>
      <view class="btn" @tap="contact_user" v-else> 立即沟通 </view>
    </view>

    <view class="btm_btns self_btns" v-else>
      <view class="btn" @tap="$u.throttle(edit, 2000)"> 编辑 </view>
      <view class="btn unline"
      :class="info.status == '已下线' ? 'is_unline' : '' "  @tap="$u.throttle(checkUnline, 2000)">
        {{ info.status == "已下线" ? "已下线" : "下线" }}
      </view>
    </view>

    <!-- 提示 -->
    <u-popup
      v-model="noVipShow"
      mode="center"
      border-radius="16"
      :mask-close-able="true"
    >
      <view class="tips_popup">
        <view class="top_tit">
          <text>提示</text>

          <i class="icon iconfont icon-e-cha1" @click="noVipShow = false"></i>
        </view>

        <view class="tips_main">
          你还不是社区会员，无法查看联系方式， <br />
          可前往PC端充值
        </view>
      </view>
    </u-popup>

    <u-popup
      v-model="telShow"
      mode="center"
      border-radius="16"
      :mask-close-able="true"
    >
      <view class="tips_popup">
        <view class="top_tit">
          <text>立即沟通</text>

          <i class="icon iconfont icon-e-cha1" @click="telShow = false"></i>
        </view>

        <view class="tips_main">
          {{ info.contact_type }}：{{ info.contact_detail }}
        </view>
      </view>
    </u-popup>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";

export default {
  data() {
    return {
      id: "", // 详情 id
      userInfo: {},
      info: {},
      noVipShow: false,
      telShow: false,
      show: false,
    };
  },
  onLoad: function (option) {
    this.id = this.$Route.query.id;
  },
  created() {
    this.init();
  },
  onShow() {
    let store_info = this.$store.state;
    let vuex_user = store_info.vuex_user;
    if (vuex_user.id) {
      this.$u.api.getUser().then((res) => {
        if (res.code === 200) {
          this.userInfo = res.data;
        }
      });
    }
  },
  computed: {
    isSelf: {
      get() {
        let info_user_id = this.info.user_id;
        let user_id = this.userInfo.id;
        console.log(info_user_id, user_id);

        return info_user_id == user_id;
      },
      set() {
        let info_user_id = this.info.user_id;
        let user_id = this.userInfo.id;
        console.log(info_user_id, user_id);

        return info_user_id == user_id;
      },
    },
  },
  methods: {
    async init() {
      await this.$u.api
        .getDemandDetail({
          id: this.id,
        })
        .then((res) => {
          const {
            code,
            data: { demand_pc },
          } = res;

          if (code === 200) {
            this.info = demand_pc;
            this.show = true;
          }
        });
    },

    // 立即沟通、vip提示
    contact_user() {
      if (!authStatus()) return;

      if (this.userInfo.vip) {
        this.telShow = true;
      } else {
        this.noVipShow = true;
      }
    },

    edit() {
      let item_id = this.info.id;
      this.$Router.push({
        name: "needs_edit",
        params: { id: item_id },
      });
    },

    // 下线
    async checkUnline(id) {
      if (!authStatus()) return;

      if (this.info.status == "已下线") return;

      await this.$u.api
        .demandDetailStatus({
          status: "已下线",
          id: this.info.id,
        })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;

          if (code === 200) {
            this.$u.toast(msg);
            this.init();
          } else if (code === 422) {
            this.$u.toast({
              title: msg,
              icon: "none",
            });
          }
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.need_detail {
  padding: 60rpx 30rpx 182rpx;
  background-color: #fff;
}

/* 项目需求 */
.n_li {
  position: relative;

  .li_title {
    margin-bottom: 30rpx;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 44rpx;
    color: #333333;
  }

  .info_box {
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-between;

    .info_li {
      display: flex;
      align-items: center;
      margin-bottom: 32rpx;
      width: 50%;
      line-height: 1;
      white-space: nowrap;

      .tit {
        margin-right: 24rpx;
        font-size: 22rpx;
        font-weight: 400;
        color: #666666;

        .icon {
          color: #999;
          font-size: 24rpx;
        }
      }

      .content {
        font-size: 32rpx;
        font-weight: 400;
        color: #0051cb;
      }

      .money {
        color: #ff6c47 !important;

        text {
          font-size: 28rpx !important;
        }
      }
    }

    :last-child {
      margin-bottom: 0;
    }

    .padd_left {
      padding-left: 100rpx;
    }
  }

  .dashed_line {
    margin: 30rpx 0 40rpx;
    width: 100%;
    border-top: 2rpx solid #ededed;
  }
}

.content_box {
  .content_tit {
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    font-size: 26rpx;
    font-weight: 400;
    color: #666666;

    .t-icon {
      margin-right: 14rpx;
    }
  }

  .content {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 40rpx;
    color: #333333;
  }

  .imgs_box {
    display: flex;
    flex-direction: column;
    image {
      margin-bottom: 20rpx;
    }
  }
}

// 底部购买固定按钮
.btm_btns {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16rpx;

  width: 100%;
  height: 182rpx;
  background: #ffffff;
  box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);

  .btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    background: #0268fa;
    border-radius: 48rpx;
  }

  .is_down {
    width: 100%;
    color: #c7c5c5;
    background: #f0f0f0;
  }
}

.self_btns {
  .unline {
    margin-left: 20rpx;
    color: #0268fa;
    background-color: #fff;
    border: 2rpx solid #0268fa;
  }

  .is_unline {
    color: #cbcbcb;
    background: #e6e6e6;
    border: 2rpx solid #e6e6e6;
  }
}

.tips_popup {
  position: relative;
  max-width: 638rpx;
  padding: 38rpx 54rpx 60rpx;

  .top_tit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 64rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    line-height: 1;

    .iconfont {
      position: absolute;
      top: 26rpx;
      right: 32rpx;
      font-size: 28rpx;
      color: #999999;
    }
  }

  // 提示
  .tips_main {
    font-size: 30rpx;
    font-weight: 400;
    line-height: 42rpx;
    color: #333333;
    text-align: center;
  }
}
</style>
