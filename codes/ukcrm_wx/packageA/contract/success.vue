<template>
  <view class="ok_main">
    <u-toast ref="uToast"></u-toast>

    <view class="ok_box">
      <image class="img" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/27/%E5%9B%BE%E7%89%87%281%29/tu-chbm-cg.png" />
      <view class="text">合同创建成功</view>
      <view class="create d-center" @click="to_create()">创建回款计划</view>
      <view class="detail" @click="to_detail()">查看详情</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      contract_id: 0,
    };
  },
  onLoad() {
    let query = this.$Route.query;
    if (query.contract_id) {
      this.contract_id = query.contract_id;
    }
  },
  methods: {
    to_create() {
      this.$Router.push({
        path: "/return_money_plan",
        query: {
          contract_id: this.contract_id,
          from:'success'
        },
      });
    },
    to_detail() {
      this.$Router.replaceAll({
        path: `/contract_detail/${this.contract_id}`,
        query: {
          contract_id: this.contract_id,
        },
      });
    }
  },
};
</script>

<style lang="less" scoped>
.ok_box { 
  display:flex;
  flex-direction: column;
  align-items: center;

  .img {
    height: 128.56px;
    width: 136.56px;
    margin-top:100px;
  }
  .text {
    font-size: 15px;
    font-weight: 600;
    line-height: 21px;
    color: #333333;
    margin-top: 18px;
    margin-bottom: 67px;
  }
  .create {
    width: 168px;
    height: 45px;
    background: #4D6FFF;
    border-radius: 23px;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    color: #FFFFFF;
    margin-bottom: 30px;
  }
  .detail {
    font-size: 13px;
    font-weight: 400;
    line-height: 18px;
    color: #666666;
    text-decoration: underline;
  }
}

</style>