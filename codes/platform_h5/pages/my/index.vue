<template>
  <view class="my">
    <!-- 头部 -->
    <view class="top">
      <view class="wrap login d-flex" v-if="is_login">
        <image
          class="avatar"
          :src="info.avatar"
          alt="易百纳技术社区"
          mode="aspectFit"
        ></image>
        <view class="info">
          <view class="name">{{ info.nickname }}</view>
          <view class="vip d-flex">
            <image
              class="flag"
              :src="'/static/common/img/vip_' + info.vip_level + '.png'"
              alt="易百纳技术社区"
            ></image>
            <view class="txt" v-if="info.vip"
              >会员于
              <text class="time">{{ info.vip_endtime.substring(0, 10) }}</text
              >到期</view
            >
          </view>
        </view>
      </view>
      <view class="wrap unlogin d-flex" v-else>
        <view class="d-flex">
          <image
            class="avatar"
            src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202110/16/h5%E5%9B%BE%E7%89%87/etx%403x.png"
            alt="易百纳技术社区"
            mode="aspectFit"
            v-if="user_status != 0"
          ></image>
          <image
            class="avatar"
            :src="info.avatar"
            alt="易百纳技术社区"
            mode="aspectFit"
            v-else
          ></image>
          <text class="no">{{
            user_status == 0 ? info.nickname : "未登录"
          }}</text>
        </view>

        <u-button class="btn" @click="go_login()">
          {{ user_status == 0 ? "去绑定" : "点击授权" }}</u-button
        >
      </view>
    </view>
    <!-- 积分EBC -->
    <view class="ebc_wrap">
      <view class="ebc">
        <view class="ebc_item d-flex">
          <i class="t-icon t-icon-e-jf"></i>
          <view
            ><text class="num">{{ is_login ? info.points : "—" }}</text
            >积分
          </view>
        </view>
        <view class="line"></view>
        <view class="ebc_item d-flex">
          <i class="t-icon t-icon-e-ebc2"></i>
          <view
            ><text class="num">{{ is_login ? info.ebc : "—" }}</text
            >EBC</view
          >
        </view>
      </view>
    </view>

    <!-- 操作 -->
    <view class="action">
      <view class="item" @click="to('my_ask')">
        <i class="icon iconfont icon-wdwd"></i>我的问答
      </view>
      <view class="item" @click="to('my_collect')">
        <i class="icon iconfont icon-wdsc"></i>我的收藏
      </view>
      <view class="item" @click="to('msg')">
        <i class="icon iconfont icon-wdxx"></i>我的消息
      </view>
      <view class="item" @click="to('my_demand')">
        <i class="icon iconfont icon-wdwb"></i>我的外包
      </view>
      <view class="item" @click="to('my_order')">
        <i class="icon iconfont icon-wddd"></i>我的订单
      </view>
      <view class="item" @click="to('my_address')">
        <i class="icon iconfont icon-dzgl"></i>地址管理
      </view>
      <view class="item" @click="to('my_invoice')">
        <i class="icon iconfont icon-fpxx"></i>发票信息
      </view>
      <view class="item" @click="to('my_gift')">
        <i class="icon iconfont icon-lpdh"></i>礼品兑换
      </view>
      <view class="item" @click="to('admin')" v-if="info.fake == '是'">
        <i class="icon iconfont icon-icon-wd2-off"></i>社区管理
      </view>
      <view
        class="item logout"
        @click="logOut"
        v-if="user_status == 0 || is_login"
      >
        <i class="icon iconfont icon-e-tcdl"></i>退出登录
      </view>
    </view>

    <!-- <login @closePopup="closePopup"></login> -->
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";

export default {
  data() {
    return {
      is_login: false,
      info: {},
      user_status: false,
    };
  },
  onShow() {
    let store_info = this.$store.state;
    this.user_status = store_info.status;

    if (store_info.status == 0) {
      this.info = store_info.vuex_user;
    }

    if (store_info.status == 1) {
      this.$u.api.getUser().then((res) => {
        if (res.code === 200) {
          this.info = res.data;
          this.is_login = true;
        }
      });
    }
  },
  methods: {
    closePopup() {
      location.reload();
    },
    to(name) {
      if (!authStatus()) return;

      this.$Router.push({ name });
    },
    go_login() {
      // 去登录
      if (!authStatus()) return;
    },
    logOut() {
      this.$u.vuex("vuex_user", "");
      this.$u.vuex("vuex_token", "");
      this.$u.vuex("status", undefined);
      location.reload();
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  height: 342rpx;
  background: linear-gradient(180deg, #ffffff 0%, #f2f2f2 100%);

  .wrap {
    height: 100%;
    padding: 76rpx 30rpx 122rpx 42rpx;
    background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202110/16/h5%E5%9B%BE%E7%89%87/e-bg-db%403x.png)
      no-repeat;
    background-size: 100% 100%;
  }

  .unlogin {
    justify-content: space-between;

    .no {
      font-size: 32rpx;
      font-weight: 600;
      line-height: 44rpx;
      color: #333;
    }

    .btn {
      width: 200rpx;
      height: 72rpx;
      border: 2rpx solid #005ef4;
      border-radius: 36rpx;
      margin: 0;
      background: transparent;
      font-size: 28rpx;
      line-height: 72rpx;
      color: #0268fa;
    }

    .u-hairline-border:after {
      border: none;
    }
  }
  .login {
    .info {
      flex: 1;
    }

    .name {
      font-size: 44rpx;
      font-weight: 600;
      line-height: 60rpx;
      color: #333;
      margin-bottom: 14rpx;
    }

    .flag {
      height: 40rpx;
      width: 100rpx;
      margin-right: 22rpx;
    }

    .txt {
      font-size: 26rpx;
      color: #999;
    }

    .time {
      color: #0268fa;
      margin: 0 10rpx;
    }
  }

  .avatar {
    height: 144rpx;
    width: 144rpx;
    margin-right: 34rpx;
    border-radius: 50%;
  }
}
.ebc_wrap {
  padding: 0 30rpx;
  margin-top: -66rpx;

  .ebc {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 132rpx;
    background: linear-gradient(90deg, #4d84ff 0%, #1d5ef0 100%);
    box-shadow: 0 6rpx 12rpx rgba(0, 0, 0, 0.16);
    border-radius: 16rpx;
    color: #fff;

    .num {
      margin-right: 12rpx;
    }

    .t-icon {
      font-size: 16rpx;
      margin-right: 10rpx;
    }

    .line {
      height: 33rpx;
      border-right: 2rpx solid #f0f0f0;
    }
  }
}
.action {
  background: #fff;
  margin-top: 28rpx;

  .item {
    display: flex;
    align-items: center;
    height: 100rpx;
    line-height: 100rpx;
    padding: 0 44rpx;
    border-bottom: 2rpx solid #f4f4f4;

    &:last-child {
      border-bottom: none;
    }

    .iconfont {
      font-size: 48rpx;
      color: #333;
      margin-right: 20rpx;
    }
  }

  .logout {
    .iconfont {
      font-size: 40rpx;
    }
  }
}
</style>
