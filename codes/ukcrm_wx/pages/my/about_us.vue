<template>
  <view class="about">
    <u-avatar :src="logo" :size="76" shape="square" mode="aspectFit"></u-avatar>

    <view class="name">友客帮 v.1.0</view>
    <view class="about_list">
      <view
        class="about_item"
        v-for="(item, index) in list"
        :key="index"
        @click="to(item)"
      >
        <view>{{ item.text }}</view>
        <view class="iconfont icon-e-zy"></view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      logo: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/26/dFPtyz5XFZffi4XTkrh7wynbAYC6pA281643179068015.png",
      list: [
        {
          text: "隐私政策",
          name: "privacy",
        },
        {
          text: "服务协议",
          name: "agreement",
        },
      ],
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    to(item) {
      this.$Router.push({
        name: item.name,
      });
    },
  },
};
</script>

<style lang="less" scoped>
.about {
  height: 100vh;
  width: 100vw;
  background: #fff;
  padding: 44px 0 0;

  /deep/.u-avatar {
    display: block;
    border-radius: 16px;
    margin: 0 auto 12px;
  }

  .name {
    font-size: 15px;
    font-weight: 400;
    line-height: 21px;
    color: #333333;
    text-align: center;
    margin-bottom: 44px;
  }
  .about_list {
    .about_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
      padding: 0 20px;
      border-bottom: 1px solid #f5f5f7;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #333333;
    }
    .iconfont {
      margin-right: 10px;
      color: #4d6fff;
      font-size: 22px;
    }
    .icon-e-zy {
      font-size: 14px;
      color: #666666;
      margin-right: 0;
    }
  }
}
</style>