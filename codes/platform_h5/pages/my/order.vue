<template>
  <view class="order">
    <!-- <view class="order_title">我的订单</view> -->
    <view class="order_list" v-if="!is_empty">
      <view class="order_item" v-for="(item, index) in list" :key="index">
        <view class="no">订单编号：{{ item.serial_number }}</view>
        <view class="info" v-for="(v, k) in item.order_details" :key="v.id">
          <image class="product" :src="v.thumb" alt="易百纳技术社区"></image>
          <view class="txt">
            <view class="title d-flex"
              ><text class="title_txt text-ellipsis-one">{{
                v.items.name
              }}</text>
              <text
                class="type blue"
                v-if="v.status == '已发货' || v.status == '已完成'"
                @click.stop="look(v.id)"
                >查看物流</text
              >
              <text class="type" v-else>{{ v.status }}</text>
            </view>
            <view class="summay d-flex"
              ><text class="summay_txt text-ellipsis-one">{{ v.name }}</text
              ><text class="num">x{{ v.num }}</text></view
            >
            <view class="money">￥{{ v.money }}</view>
          </view>
        </view>
        <view class="detail">
          <view class="price_box d-flex">
            总价：<text class="price">￥{{ item.total_money }}</text
            ><text class="tip"
              >({{ item.invoice_status == "未申请" ? "未税" : "含税" }})</text
            >
          </view>
          <view class="train_box d-flex">
            <view class="time">{{ item.created_at }}</view>
            <view class="train">含运费：￥{{ item.freight }}</view>
          </view>
        </view>
      </view>
    </view>
    <lack v-else></lack>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

    <!-- 创建提问 -->
    <image
      class="service"
      src="/static/common/img/service.png"
      @tap="service()"
    />

    <!-- 物流信息 -->
    <u-mask class="log_mask" :show="show" @click="show = false" :zoom="false">
      <view class="log_box">
        <i class="close t-icon t-icon-e-qx41"></i>
        <view class="express"
          >{{
            info.express && info.express.company ? info.express.company : ""
          }}
          {{
            info.express && info.express.number ? info.express.number : ""
          }}</view
        >
        <u-time-line>
          <u-time-line-item v-for="(v, k) in info.data" :key="k">
            <template v-slot:content>
              <view>
                <view class="order_desc">{{ v.context }}</view>
                <view class="order_time">{{ v.time }}</view>
              </view>
            </template>
          </u-time-line-item>
        </u-time-line>
      </view>
    </u-mask>

    <!-- 客服 -->
    <u-mask
      class="log_mask"
      :show="show_service"
      @click="show_service = false"
      :zoom="false"
    >
      <view class="service_box">
        <view>
          <i class="close t-icon t-icon-e-qx41"></i>
          <view class="service_title">售前/售后微信客服</view>
          <view class="servie_num">x460910098</view>
        </view>
      </view>
    </u-mask>
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
      show: false,
      info: {},
      show_service: false,
    };
  },
  onShow() {
    this.get_list();
  },
  methods: {
    get_list() {
      this.$u.api
        .getUserOrder({
          page: this.page,
        })
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            this.list =
              this.page == 1 ? data.data : this.list.concat(data.data);
            this.next_page = data.next_page_url ? true : false;
            this.is_empty = this.list.length == 0;
          }
        });
    },
    look(id) {
      this.$u.api
        .getOrderLog({
          id,
        })
        .then((res) => {
          this.info = res.data.info;
          if (this.info.code == 200) {
            this.show = true;
          } else {
            this.$u.toast(this.info.msg);
          }
        });
    },
    service() {
      this.show_service = true;
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

<style lang="scss">
// .order_title {
//     padding:32rpx 30rpx;
//     font-size: 32rpx;
//     font-weight: 600;
//     line-height: 44rpx;
//     color: #333;
// }

.order_list {
  padding: 32rpx 16rpx;

  .order_item {
    margin-bottom: 2rpx;
    padding: 26rpx 24rpx 30rpx 32rpx;
    background: #fff;
    margin-bottom: 20rpx;
    border-radius: 16rpx;

    .no {
      margin-bottom: 28rpx;
      font-size: 28rpx;
      line-height: 40rpx;
      color: #333;
    }

    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40rpx;
    }

    .product {
      width: 176rpx;
      height: 176rpx;
      margin-right: 26rpx;
    }

    .txt {
      flex: 1;
    }

    .title {
      margin-bottom: 16rpx;
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
      word-break: break-all;

      .title_txt {
        flex: 1;
      }

      .type {
        width: 120rpx;
        text-align: right;
        font-size: 24rpx;
        font-weight: 400;
        color: #999;
      }
      .type.blue {
        color: #4a94ff;
      }
    }

    .summay {
      margin-bottom: 16rpx;
      word-break: break-all;

      .summay_txt {
        overflow: hidden;
        flex: 1;
        line-height: 40rpx;
        background: #f2f2f2;
        border-radius: 8rpx;
        font-size: 24rpx;
        color: #999;
        padding: 12rpx 6rpx 10rpx 16rpx;
      }

      .num {
        width: 120rpx;
        text-align: right;
        font-size: 24rpx;
        font-weight: 400;
        color: #999;
      }
    }

    .money {
      font-size: 28rpx;
      font-weight: 600;
      line-height: 40rpx;
      color: #333;
    }

    .price_box {
      justify-content: flex-end;
      font-size: 24rpx;
      font-weight: 400;
      color: #666;
      line-height: 34rpx;
      margin-bottom: 6rpx;

      .price {
        font-size: 28rpx;
        color: #333;
        margin: 0 10rpx 0 0;
      }

      .tip {
        color: #999;
      }
    }

    .train_box {
      justify-content: space-between;
      font-size: 24rpx;

      .time {
        color: #999;
      }

      .train {
        color: #666;
      }
    }
  }
}

.log_mask {
  padding: 0 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.log_box {
  position: relative;
  height: 80vh;
  width: 100%;
  background: #fff;
  border: 2rpx solid #707070;
  border-radius: 8rpx;
  padding: 44rpx;
  overflow-y: auto;

  .close {
    position: absolute;
    right: 0;
    top: -60rpx;
  }

  .express {
    font-size: 28rpx;
    font-weight: 600;
    line-height: 40rpx;
    color: #333;
    margin-bottom: 38rpx;
  }
}

.service {
  display: block;
  position: fixed;
  top: 834rpx;
  right: 12rpx;
  width: 132rpx;
  height: 132rpx;
}

.service_box {
  position: relative;
  padding: 20rpx;
  height: 20vh;
  width: 70vw;
  background: #fff;
  border-radius: 8rpx;
  font-size: 28rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .close {
    position: absolute;
    right: 15rpx;
    top: 15rpx;
  }
  .service_title {
    color: #999;
    margin-bottom: 20rpx;
  }
  .service_num {
    color: #333;
  }
}
</style>
