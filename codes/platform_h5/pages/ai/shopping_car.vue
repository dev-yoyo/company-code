<template>
  <!-- 商品列表 -->
  <view class="car_detail">
    <view v-if="goodsList.length > 0">
      <view class="cart-list">
        <u-swipe-action
          :show="goods.show"
          :index="index"
          v-for="(goods, index) in goodsList"
          :key="goods.id"
          @click="click"
          @open="open"
          :options="options"
          btn-width="150"
        >
          <view class="goods_li">
            <!-- <view
            class="goods_li"
            v-for="(goods, index) in goodsList"
            :key="goods.id"
          > -->
            <u-checkbox
              @change="selectedSole(index)"
              class="select_checkbox"
              shape="circle"
              v-model="goods.selected"
              :disabled="goods.store <= 0"
            />

            <view class="select_item" @tap.stop>
              <u-image
                :src="goods.thumb"
                class="img"
                width="228"
                height="228"
              ></u-image>

              <view class="goods-info">
                <view class="info_name">
                  <view class="name">{{ goods.items.name }}</view>
                  <view class="summary">
                    {{ goods.name }}
                  </view>
                </view>

                <view class="data_num">
                  <view class="price"
                    >￥<text>{{ goods.unit_price }}</text>
                  </view>

                  <view>
                    <u-number-box
                      v-model="goods.num"
                      :min="1"
                      :max="goods.store"
                      @change="numChange(goods)"
                      :disabled="goods.store <= 0"
                    ></u-number-box>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </u-swipe-action>
      </view>

      <view class="navigation">
        <view class="left">
          <u-checkbox
            v-model="all"
            :disabled="!goodsList.length"
            shape="circle"
            @change="selectedAll"
          >
            全选
          </u-checkbox>
        </view>

        <view class="right">
          <view class="r_main">
            <view class="money_info">
              <view class="is_select"> 已选{{ selectedAllLength }}件，</view>

              <view class="total-cost">
                合计：<text class="price"
                  ><text>￥</text>{{ (totalMoney*100 - sale*100)/100 }}</text
                >
              </view>
            </view>

            <view class="vip_sale" v-if="sale && selectedAllLength > 0">
              VIP会员，已优惠<text>{{ sale }}</text
              >元
            </view>
          </view>

          <view
            class="buy"
            :class="selectedAllLength > 0 ? '' : 'un_buy'"
            @tap="buy"
          >
            结算</view
          >
        </view>
      </view>
    </view>

    <lack v-else></lack>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";

export default {
  props: ["index"],
  data() {
    return {
      goodsList: [],
      isSelectedAll: false, // 全选所有商品
      selectedAllRowList: [], // 储存一个已经选择的数据
      selectedAllRowLength: 0, // 已经选择了的数据的长度
      ai_discount: 0,
      freight: 0, // 运费

      current_id: "", // 选择的商品 id
      scrollTop: 0,
      options: [
        {
          text: "删除",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
    };
  },
  onLoad: function (option) {
    this.current_id = this.$Route.query.current_id;
  },
  created() {
    this.init();
  },
  onShow() {
    if (!authStatus()) return;
  },
  computed: {
    // 总价
    totalMoney() {
      let total = 0;
      let list = this.goodsList;
      list.map((e) => {
        if (e.store > 0) {
          if (e.selected) {
            total += ((e.unit_price*100) * e.num)/100;
          }
        }
      });

      return total.toFixed(2).toString();
      // return total.toString().replace(/\B(?=(\d{3})+$)/g, ",");
    },
    // 优惠金额
    sale() {
      let money = 0,
        total = this.totalMoney;

      if (this.ai_discount) {
        money = (total * (1 - this.ai_discount)).toFixed(2);
      }

      return money;
    },
    // 全选按钮 状态
    all: {
      get() {
        let num = 0,
          disNum = 0,
          arr = this.goodsList;

        arr.map((e) => {
          if (e.store <= 0) {
            disNum++;
          }

          if (e.selected) {
            num++;
          }
        });
        return num === arr.length - disNum;
      },
      set(val) {
        console.log("set >>>>", val);
        let num = 0,
          disNum = 0,
          arr = this.goodsList;

        arr.map((e) => {
          if (e.store <= 0) {
            disNum++;
          }

          if (e.selected) {
            num++;
          }
        });
        return num === arr.length - disNum;
      },
    },
    // 选中的 商品数量
    selectedAllLength() {
      let num = 0,
        arr = this.goodsList;

      arr.map((e) => {
        if (e.selected) {
          num++;
        }
      });

      return num;
    },
    selecetGoods() {
      let ids = [],
        arr = this.goodsList;

      arr.map((e) => {
        if (e.selected) {
          ids.push(e.id);
        }
      });

      return ids.join(",");
    },
  },
  methods: {
    async init() {
      await this.$u.api
        .shopList({
          current_id: this.current_id,
        })
        .then((res) => {
          const { code, data } = res;

          if (code === 200) {
            // this.goodsList = [];
            this.freight = data.freight;
            this.ai_discount = data.ai_discount;

            let arr = data.list;
            arr.map((e) => {
              e.show = false;

              if (this.current_id == e.id) {
                e.selected = true;
              } else {
                e.selected = false;
              }
            });
            this.goodsList = arr;
          }
        });
    },
    async numChange(v) {
      let params = {
        type: v.type,
        shop_id: v.shop_id,
        num: v.num,
        id: v.id,
        from: "",
        item_id: v.id,
      };

      await this.$u.api.shoppingCars(params).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 422) {
          this.$u.toast({
            title: msg,
            icon: "none",
          });
        }
      });
    },

    click(index) {
      let ids = this.goodsList[index].id;

      this.$u.api.delShopCars({ ids }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;

        if (code === 200) {
          this.goodsList.splice(index, 1);
          this.$u.toast(msg);
        } else if (code === 422) {
          this.$u.toast({
            title: msg,
            icon: "none",
          });
        }
      });
    },
    // 如果打开一个的时候，不需要关闭其他，则无需实现本方法
    open(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.goodsList[index].show = true;
      this.goodsList.map((val, idx) => {
        if (index != idx) this.goodsList[idx].show = false;
      });
    },

    /**
     * 选择单个商品
     */
    selectedSole(index) {
      let arr = this.goodsList;
      arr[index].selected = !arr[index].selected;
      this.goodsList = arr;
    },

    // 全选
    selectedAll() {
      let arr = this.goodsList;
      if (this.all) {
        arr.map((e) => {
          e.selected = false;
        });
      } else {
        arr.map((e) => {
          if (e.store > 0) {
            e.selected = true;
          }
        });
      }

      this.goodsList = arr;
    },

    buy() {
      let ids = this.selecetGoods;

      if (!ids) {
        this.$u.toast("请选择商品");
        return;
      }
      console.log("ids", ids);

      this.$u.api
        .buyBefore({
          car_ids: ids,
        })
        .then((res) => {
          const { code, data } = res;

          if (code === 200) {
            if (data.allow) {
              window.location.href = `/payment?car_ids=${ids}`;
              // window.location.replace(`/payment?car_ids=${ids}`);
            } else {
              this.$u.toast(data.msg);
            }
          } else if (code === 422) {
            this.$u.toast({
              title: data,
              icon: "none",
            });
          }
        });
    },

    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
.cart-list {
  position: relative;
  padding-bottom: 174rpx;
  background-color: #f7f7f7;

  /deep/ .u-swipe-action {
    margin-bottom: 12rpx;
  }

  /deep/ .u-swipe-content {
    background-color: #f7f7f7;
  }

  .goods_li {
    display: flex;
    align-items: center;
    padding: 24rpx 30rpx;
    background-color: #fff;
    // margin-bottom: 12rpx;

    .select_checkbox {
      margin-right: 12rpx;
      flex-shrink: 0;
      width: 44rpx;
    }

    .select_item {
      display: flex;

      .img {
        margin-right: 32rpx;
        flex-shrink: 0;
      }

      .goods-info {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .info_name {
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

        .data_num {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .price {
            font-size: 24rpx;
            color: #e50404;
            font-weight: 600;

            text {
              font-size: 32rpx;
            }
          }
        }
      }
    }
  }
}

.navigation {
  position: fixed;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  // padding: 22rpx 30rpx 70rpx;
  padding: 0 30rpx;

  height: 174rpx;
  background-color: #fff;

  .left {
    display: flex;
    font-size: 20rpx;
    flex-shrink: 0;
  }

  .right {
    display: flex;
    font-size: 28rpx;
    align-items: center;

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

    .un_buy {
      background: #f2f2f2;
    }
  }
}
</style>

