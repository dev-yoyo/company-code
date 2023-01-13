<template>
  <view class="feedback">
    <u-toast ref="uToast"></u-toast>
    <view class="title">请选择反馈类型</view>
    <view class="feed_list">
      <view class="item d-between" @click="to_use()">
        <text class="label">应用功能BUG</text>
        <i class="icon iconfont icon-you"></i>
      </view>
      <view class="item d-between" @click="to_need()">
        <text class="label">产品需求</text>
        <i class="icon iconfont icon-you"></i>
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);
  },
  methods: {
    to_use() {
      this.$Router.push({
          path: `/feedback_use`,
        });
    },
    to_need() {
      this.$Router.push({
          path: `/feedback_need`,
        });
    }
  },
};
</script>

<style lang="less" scoped>
.title {
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: #333333;
  padding: 16px 20px 9px;
}
.feed_list {
  .item {
    margin-bottom: 1px;
    padding: 16px 20px 16px 26px;
    background: #fff;

    .label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #666666;
    }

    .iconfont {
      font-size: 14px;
      color: #c3c3c3;
    }
  }
}
</style>