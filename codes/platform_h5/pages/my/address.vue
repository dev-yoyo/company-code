<template>
  <view class="address">
    <view class="address_list" v-if="!is_empty">
      <view
        class="address_item d-flex"
        v-for="(item, index) in list"
        :key="index"
      >
        <i class="t-icon t-icon-sjdz-icon2"></i>

        <view class="info" @tap="check_addr(item)">
          <view class="base d-flex">
            <view class="name">{{ item.name }}</view>
            <view class="phone">{{ item.tel }}</view>
            <view class="normal" v-if="item.default == '是'">默认</view>
          </view>
          <view class="adr">{{ item.district + item.address }}</view>
        </view>
        <view class="edit" @tap="to_edit(item.id)">编辑</view>
      </view>
    </view>
    <lack v-else></lack>

    <view class="btn_box">
      <view class="btn" @click="to_edit()"
        ><i class="icon iconfont icon-e-cha"></i> 添加收货地址</view
      >
    </view>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
  </view>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      is_empty: false,
      page: 1,
      next_page: true,
      scrollTop: 0,

      paymentType: false, // true  结算页面 选择地址
      car_ids: "",
      invoiceIndex: 0,
    };
  },
  onLoad: function () {
    console.log(this.$Route);
    this.paymentType = this.$Route.query.type;
    this.car_ids = this.$Route.query.car_ids;
    this.invoiceIndex = this.$Route.query.invoiceIndex;
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      this.$u.api
        .getUserAddress({
          page: this.page,
        })
        .then((res) => {
          let data = res.data;
          this.list = this.page == 1 ? data.data : this.list.concat(data.data);
          this.next_page = data.next_page_url ? true : false;
          this.is_empty = this.list.length == 0;
        });
    },
    check_addr(v) {
      if (this.paymentType) {
        this.$Router.replace({
          path: "/payment",
          query: {
            car_ids: this.car_ids,
            invoiceIndex: this.invoiceIndex,
            addressId: v.id,
          },
        });
      }
    },
    to_edit(id) {
      if (id) {
        this.$Router.push({
          path: "/user_center/address/create",
          query: {
            id,
          },
        });
      } else {
        this.$Router.push({
          path: "/user_center/address/create",
          query: {
            type: "add",
          },
        });
      }
    },
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
};
</script>

<style lang="scss">
.address_list {
  padding: 18rpx 16rpx 180rpx;
  .address_item {
    position: relative;
    margin-bottom: 20rpx;
    padding: 24rpx 24rpx 40rpx 28rpx;
    background: #fff;
    border-radius: 16px;

    .t-icon-sjdz-icon2 {
      height: 64rpx;
      width: 64rpx;
      margin-right: 22rpx;
    }

    .info {
      flex: 1;
    }

    .base {
      padding-right: 78rpx;
      margin-bottom: 8rpx;
    }

    .name {
      margin-right: 14rpx;
      font-size: 30rpx;
      color: #333;
    }

    .phone {
      margin-right: 16rpx;
      font-size: 24rpx;
      color: #999;
    }

    .normal {
      font-size: 20rpx;
      line-height: 28rpx;
      color: #4a94ff;
      padding: 0 8rpx;
      border: 2rpx solid #2e89fa;
      border-radius: 6rpx;
    }

    .adr {
      font-size: 24rpx;
      line-height: 30rpx;
      color: #333;
      padding-right: 78rpx;
    }

    .edit {
      position: absolute;
      top: 24rpx;
      right: 24rpx;
      font-size: 24rpx;
      line-height: 34rpx;
      color: #999;
      text-decoration: underline;
    }
  }
}
.btn_box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 24rpx 32rpx 64rpx;
  background: #fff;
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 88rpx;
    background: #0268fa;
    border-radius: 44rpx;
    font-size: 32rpx;
    color: #fff;
  }
}
</style>
