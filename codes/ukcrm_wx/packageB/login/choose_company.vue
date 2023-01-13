<template>
  <view class="login_detail">
    <u-sticky offset-top="0" v-if="from != 'login'">
      <u-navbar bgColor="transparent" title=" " :autoBack="true" fixed />
    </u-sticky>
    <view class="top_bgc">
      <view class="login_txt"> 创建/加入企业 </view>
    </view>

    <view class="form_main">
      <view class="join_box">
        <view class="item" @click="create()">
          <u-avatar
            :src="create_img"
            :size="60"
            shape="square"
            mode="aspectFit"
          ></u-avatar>

          <view class="r_main">
            <view class="tit">创建企业 </view>
            <view class="content">
              创建一个企业，邀请成员加入。创建企业后不可再加入其他企业
            </view>
          </view>
        </view>

        <view class="item" @click="nav()">
          <u-avatar
            :src="join_img"
            :size="60"
            shape="square"
            mode="aspectFit"
          ></u-avatar>

          <view class="r_main">
            <view class="tit">加入企业 </view>
            <view class="content">
              加入一个企业，邀请成员加入。创建企业后不可再加入其他企业
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="skip_btn" @click="skip" v-if="showSkip">跳过</view>
  </view>
</template>

<script>
import store from "@/store";

export default {
  data() {
    return {
      from:'login',
      showSkip: true,
      create_img: `${store.state.ossBaseUrl}direct/resource/202201/21/b67yNhQdaMdCDHwarktGeRZp4CSbJmkE1642729032479.png`,
      join_img: `${store.state.ossBaseUrl}direct/resource/202201/21/2CAEbd7GA3wybbSmJB5QbSnM8F6WEyGx1642729045355.png`,
    };
  },
  onShow() {
    let query = this.$Route.query;
    if (query.from) {
      this.from = query.from
      this.showSkip = this.from == 'login';
    }
  },
  methods: {
    create() {
      this.$Router.push({
        path: "/create_company",
        query: {
          from: this.from,
        },
      });
    },
    nav() {
      this.$Router.push({
        path:'/join_company',
        query: {
          from: this.from,
        },
      });
    },
    skip() {
      this.$Router.replaceAll({
        name: "home",
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_detail {
  padding: 0 20px;
  height: 100%;
  background-color: #fff;
}

.top_bgc {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 253px;
  background: #fff;
  z-index: 1;
  padding: 149px 20px 24px;

  .login_txt {
    font-size: 28px;
    font-weight: 600;
    line-height: 40px;
    color: #333333;
  }
}

.form_main {
  position: relative;
  padding-top: 253px;
  z-index: 2;

  .join_box {
    .item {
      display: flex;

      margin-bottom: 30px;
      padding: 45px 6px 0 26px;
      width: 100%;
      height: 158px;
      background: #f7f8fa;
      border-radius: 10px;

      .r_main {
        margin-left: 19px;
      }

      .tit {
        margin-bottom: 10px;
        font-size: 16px;
        font-weight: 600;
        line-height: 22px;
        color: #333333;
      }

      .content {
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #666666;
      }
    }
  }
}

.skip_btn {
  margin-top: 80px;
  font-size: 14px;
  font-weight: 400;
  color: #666666;
  text-align: center;
  text-decoration: underline;
}
</style>