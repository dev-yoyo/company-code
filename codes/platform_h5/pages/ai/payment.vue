<template>
  <!-- 订单结算-->
  <view class="payment_detail">
    <view class="no_address" v-if="addressList.length <= 0" @tap="to_address">
      <view class="l_txt">
        <i class="icon iconfont icon-sj-icon"></i>
        暂无地址
      </view>

      <view class="r_txt">
        去添加收货地址
        <i class="icon iconfont icon-e-zy"></i>
      </view>
    </view>

    <view class="address_list" v-else>
      <view class="address_item d-flex" v-if="addressId == addressInfo.id">
        <i class="t-icon t-icon-sjdz-icon2"></i>

        <view class="info">
          <view class="base d-flex">
            <view class="name">{{ addressInfo.name }}</view>
            <view class="phone">{{ addressInfo.tel }}</view>
            <view class="normal" v-if="addressInfo.default == '是'">默认</view>
          </view>
          <view class="adr">{{
            addressInfo.district + addressInfo.address
          }}</view>
        </view>

        <view class="edit" @tap="go_address">选择</view>
      </view>
    </view>

    <view class="cart-list">
      <view class="goods_li" v-for="goods in goodsList" :key="goods.id">
        <view class="select_item" @tap.stop>
          <u-image
            :src="goods.thumb"
            class="img"
            width="228"
            height="228"
          ></u-image>

          <view class="goods-info">
            <view class="info_name">
              <view class="goods_num">
                <view class="name">{{ goods.items.name }}</view>
                <view class="r_count">x{{ goods.num }}</view>
              </view>

              <view class="summary">
                {{ goods.name }}
              </view>
            </view>

            <view class="price"
              >￥<text>{{ goods.money }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 订单信息 -->
    <view class="info_box">
      <view class="item" v-if="info.discount_money != 0">
        <view class="l_txt">VIP优惠</view>
        <view class="r_txt vip_sale">- ¥{{ info.discount_money }}</view>
      </view>
      <view class="item">
        <view class="l_txt">运费</view>
        <view class="r_txt">¥23</view>
      </view>
      <view class="item">
        <view class="l_txt">发票信息</view>
        <view class="r_txt invoice" @tap="toInvoice">
          {{ invoice }}
          <i class="icon iconfont icon-e-zy"></i>
        </view>
      </view>
      <view class="item">
        <view class="l_txt">应付金额</view>
        <view class="r_txt money">
          <text>¥</text>
          {{ info.total_money }}
          <text class="taxes" v-if="invoiceIndex != 0">
            （含税费¥{{ info.taxes_money }}）
          </text>
        </view>
      </view>
    </view>

    <u-modal
      v-model="payShow"
      :show-title="false"
      :show-confirm-button="false"
      :show-cancel-button="true"
    >
      <view class="slot-content">
        <view class="pay_query">
          <view class="title">点击查询订单是否已完成</view>

          <view class="btns">
            <view class="item check" @tap="paylog"> 已完成支付 </view>
            <view class="item" @tap="buy"> 支付失败，重新支付 </view>
          </view>
        </view>
      </view>
    </u-modal>

    <view class="navigation">
      <view class="r_main">
        <view class="money_info">
          <view class="is_select"> 共{{ info.shop_num }}件，</view>

          <view class="total-cost">
            合计：<text class="price"
              ><text>￥</text>{{ info.total_money }}</text
            >
          </view>
        </view>

        <view class="vip_sale" v-if="sale">
          VIP会员，已优惠<text>{{ sale }}</text
          >元
        </view>
      </view>

      <view class="buy" @tap="buy"> 去支付</view>
    </view>

    <login></login>
  </view>
</template>

<script>
import { authStatus, isWxBrowser } from "@/common/hooks.js";
import wx from "jweixin-module";

export default {
  props: ["index"],
  data() {
    return {
      info: {},
      goodsList: [],
      addressList: [],
      invoiceInfo: null, // 发票信息
      car_ids: "", // 选中的商品

      addressId: "", // 选中的地址id
      addressInfo: {},

      sale: 0,

      choose_invoice: 0, // 是否开票
      invoiceIndex: 0, // 不开票 电子发票 增值税普票 增值税专票

      payShow: false,
    };
  },
  onLoad: function (option) {
    let query = this.$Route.query;
    console.log("query >>>>>>>>>", query);

    this.car_ids = query.car_ids;
    if (query.invoiceIndex) {
      this.invoiceIndex = query.invoiceIndex;
    }
    if (query.addressId) {
      this.addressId = query.addressId;
    }
  },
  onShow() {
    if (!authStatus()) return;
    this.init();
    let _th = this;
    uni.getStorage({
      key: "payShow",
      success(res) {
        console.log(res, res.data);
        _th.payShow = res.data;
        if (res.data) {
          uni.removeStorage({
            key: "payShow",
          });
        }
      },
    });
  },
  computed: {
    // 发票类型
    invoice() {
      let type = this.invoiceIndex,
        str = "";

      if (type == 0) {
        str = "不开票";
      } else if (type == 1) {
        str = "电子发票";
      } else if (type == 2) {
        str = "增值税普票";
      } else if (type == 3) {
        str = "增值税专票";
      }

      return str;
    },
  },
  methods: {
    async init() {
      console.log(this.car_ids);
      await this.$u.api
        .goPayment({
          car_ids: this.car_ids,
          choose_invoice: this.invoiceIndex == 0 ? 0 : 1,
        })
        .then((res) => {
          const { code, data } = res;

          if (code === 200) {
            this.addressList = data.addressList;
            this.info = data.baseInfo;
            this.invoiceInfo = data.invoiceInfo;
            this.goodsList = data.shoppingCarList;

            if (data.addressList.length > 0) {
              let arr = data.addressList;
              arr.map((e, i) => {
                if (this.addressId) {
                  if (this.addressId == e.id) {
                    this.addressId = e.id;
                    this.addressInfo = e;
                  }
                } else {
                  if (e.default == "是") {
                    this.addressId = e.id;
                    this.addressInfo = e;
                  } else {
                    if (i === 0) {
                      this.addressId = e.id;
                      this.addressInfo = e;
                    }
                  }
                }
              });
            } else {
							this.addressId = "";
						}
          } else if (code == 422) {
            this.$u.toast({
              title: data.msg,
              icon: "none",
            });
          }
        });
    },
    // 选择地址 地址列表
    go_address() {
      this.$Router.push({
        path: "/user_center/address",
        query: {
          type: true,
          car_ids: this.car_ids,
          invoiceIndex: this.invoiceIndex,
        },
      });
    },
    // 创建 地址
    to_address() {
      this.$Router.push({
        path: "/user_center/address/create",
        query: {
          type: "add",
        },
      });
    },
    // 选择发票信息
    toInvoice() {
      this.$Router.push({
        path: "/user_center/invoice",
        query: {
          type: true,
          car_ids: this.car_ids,
          invoiceIndex: this.invoiceIndex,
        },
      });
    },

    async buy() {
      if (!this.addressId) {
        this.$u.toast("请选择收货地址");
        return;
      }

      if (!this.invoiceInfo && this.invoiceIndex != 0) {
        this.$u.toast("请填写发票信息");
        return;
      }

      let params = {
        car_ids: this.car_ids,
        address_id: this.addressId,
        money: this.info.total_money,
        invoice_type: this.invoice,
        invoice_id: this.invoiceInfo ? this.invoiceInfo.id : "",
        pay_type: "wechat",
        wechat_pay_type: isWxBrowser() ? 1 : 0,
      };

      await this.$u.api.payMoney(params).then((res) => {
        const {
          code,
          data: { config, result, msg },
        } = res;

        if (code === 200) {
          if (isWxBrowser()) {
            this.fetchJsSdk(config);
          } else {
            this.webPay(result);
          }
        } else if (code === 422) {
          this.$u.toast({
            title: msg,
            icon: "none",
          });
        }
      });
    },
    // 微信 内部浏览器支付
    async fetchJsSdk(config) {
      let ios = false;
      let ios_url = "";

      let userAgent = navigator.userAgent;
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        ios = true;
        uni.getStorage({
          key: "originUrl",
          success(res) {
            ios_url = res.data;
          },
        });
      }

      await this.$u.api
        .getJsSdk({
          url: ios ? ios_url : window.location.href,
        })
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            this.pay(data, config);
          }
        });
    },
    pay(sdkData, config) {
      let _th = this;
      // console.log(sdkData);

      wx.config(sdkData);
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ["chooseWXPay"],
          success: function (res) {
            console.log(res);
            if (res.checkResult.chooseWXPay === true) {
              wx.chooseWXPay({
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                package: config.package,
                signType: config.signType,
                paySign: config.paySign,
                success: function (res) {
                  // 支付成功后的回调函数
                  console.log(res);

                  // 我的订单
                  _th.$Router.replace({
                    name: "my_order",
                  });
                },
                fail(res) {
                  console.log(res);
                  _th.$u.toast("支付失败");
                },
              });
            }
          },
        });
      });

      /* 处理失败验证 */
      wx.error(function (res) {
        // config 信息验证失败会执行error函数,如签名过期导致验证失败,具体错误信息可以打开config的debug模式查看,也可以在返回的res参数中查看,对于SPA可以在这里更新签名
        alert("配置验证失败: " + res.errMsg);
      });
    },

    // 移动端 外部浏览器支付
    webPay(result) {
      uni.setStorage({
        key: "payShow",
        data: true,
      });
      // this.$u.toast("外部浏览器支付");

      location.replace(
        `${result.mweb_url}&redirect_url=${window.location.href}`
      );
    },
    // 查询支付结果
    paylog() {
      // this.$u.toast("正在查询支付结果");
      uni.showLoading({
        title: "正在查询",
        mask: true,
      });

      let _th = this;

      _th.$u.api.payLog().then((res) => {
        const {
          code,
          data: { status },
        } = res;

        if (code === 200) {
          if (status) {
            uni.hideLoading();
            // 我的订单
            _th.$Router.replace({
              name: "my_order",
            });
          } else {
            this.$u.toast("支付失败，请重新查询");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.payment_detail {
  padding: 18rpx 16rpx 194rpx;
}

// 暂无收货地址
.no_address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 38rpx 28rpx;
  background: #ffffff;
  border-radius: 16rpx;

  .l_txt {
    display: flex;
    align-items: center;

    font-size: 28rpx;
    font-weight: 400;
    line-height: 1;
    color: #666666;

    .icon {
      margin-right: 22rpx;
      font-size: 64rpx;
      color: #999;
    }
  }

  .r_txt {
    display: flex;
    align-items: center;

    font-size: 24rpx;
    font-weight: 400;
    color: #999999;
    line-height: 1;

    .icon {
      margin-left: 10rpx;
      font-size: 22rpx;
    }
  }
}

// 收货地址
.address_list {
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

.cart-list {
  margin: 20rpx 0;
  position: relative;
  background-color: #fff;
  border-radius: 16rpx;
  overflow: hidden;

  .goods_li {
    padding: 20rpx 30rpx;
    background-color: #fff;

    .select_item {
      display: flex;

      .img {
        margin-right: 32rpx;
        flex-shrink: 0;
      }

      .goods-info {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .info_name {
          .goods_num {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .name {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 1;
              overflow: hidden;

              margin-bottom: 8rpx;
              font-size: 30rpx;
              font-weight: 600;
              color: #333333;
            }

            .r_count {
              margin-left: 15rpx;
              font-size: 24rpx;
              font-weight: 400;
              color: #999999;
              flex-shrink: 0;
            }
          }

          .summary {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            overflow: hidden;

            padding: 0 15rpx;
            width: 374rpx;
            height: 56rpx;
            background: #f2f2f2;
            border-radius: 8rpx;

            font-size: 24rpx;
            font-weight: 400;
            line-height: 56rpx;
            color: #999999;
          }
        }

        .price {
          font-size: 24rpx;
          color: #333333;
          font-weight: 600;

          text {
            font-size: 32rpx;
          }
        }
      }
    }
  }
}

.info_box {
  padding: 34rpx 24rpx 34rpx 68rpx;
  background: #ffffff;
  opacity: 1;
  border-radius: 16rpx;

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    line-height: 1;

    .l_txt {
      width: 105rpx;
      font-size: 26rpx;
      color: #333333;
      text-align: right;
    }

    .r_txt {
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
    }

    .vip_sale {
      color: #e50404;
    }

    .invoice {
      font-size: 26rpx;
      font-weight: 400;
      color: #999999;
    }

    .money {
      font-size: 36rpx;
      font-weight: 600;
      color: #e50404;

      text {
        font-size: 26rpx;
      }

      .taxes {
        font-size: 26rpx;
        color: #999;
      }
    }
  }
}

.navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  // padding: 22rpx 30rpx 70rpx;
  padding: 0 30rpx;
  display: flex;
  align-items: center;

  width: 100%;
  height: 174rpx;
  box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
  background-color: #fff;

  display: flex;
  font-size: 28rpx;
  align-items: center;
  justify-content: space-between;

  .r_main {
    margin-right: 12rpx;
    .money_info {
      display: flex;
      align-items: center;

      .is_select {
        font-size: 26rpx;
        font-weight: 400;
        color: #999999;
      }

      .total-cost {
        font-size: 26rpx;
        font-weight: 400;
        color: #333333;

        .price {
          font-size: 36rpx;
          font-weight: 600;
          line-height: 1;
          color: #e50404;

          text {
            font-size: 24rpx;
          }
        }
      }
    }

    .vip_sale {
      text-align: right;
      margin-top: 10rpx;
      font-size: 24rpx;
      font-weight: 400;
      line-height: 1;
      color: #999999;

      text {
        color: #ffb612;
      }
    }
  }

  .buy {
    width: 204rpx;
    height: 82rpx;
    line-height: 82rpx;
    font-size: 32rpx;
    color: #ffffff;
    text-align: center;
    background: #0268fa;
    border-radius: 42rpx;
  }
}

.pay_query {
  padding: 20rpx;
  text-align: center;

  .iconfont {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
  }

  .title {
    margin: 30rpx 0 50rpx;
    font-size: 32rpx;
    color: #333;
  }

  .btns {
    .item {
      padding: 20rpx 0;
      font-size: 28rpx;
      color: #999;
      line-height: 1;
    }

    .check {
      color: #e50404;
      border-bottom: 1rpx solid #999;
    }
  }
}
</style>

