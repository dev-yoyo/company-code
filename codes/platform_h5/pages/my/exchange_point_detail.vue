<template>
  <view class="detail">
    <!-- 礼品兑换 -->
    <view class="exchange_list">
      <view class="exchange_item d-flex">
        <image :src="ossUrl + info.thumb"></image>
        <view class="r_main">
          <view class="top_info">
            <view class="name">
              {{ info.name }}
              <view class="txt">x {{ info.inventory }}</view>
            </view>

            <view class="point">
              <text>{{ info.point }} </text> EBC
            </view>
          </view>

          <view class="tips">
            <view>确认兑换后，将扣除相应的EBC。</view>
            商品兑换成功后可在兑换记录中查看相应信息。
          </view>
        </view>
      </view>
    </view>

    <!-- 不是虚拟物品，填写收货地址 -->
    <view class="address_edit" v-if="info.virtual != '是'">
      <u-form
        class="edit_form"
        :model="form"
        ref="uForm"
        :error-type="['toast']"
        label-width="160"
        :border-bottom="false"
        label-position="left"
      >
        <u-form-item label="收货人" prop="name" :border-bottom="false">
          <u-input v-model="form.name" placeholder="请输入收货人" />
        </u-form-item>
        <u-form-item label="手机/电话" prop="tel" :border-bottom="false">
          <u-input v-model="form.tel" placeholder="请输入手机/电话" />
        </u-form-item>
        <u-form-item label="详细地址" prop="address" :border-bottom="false">
          <u-input
            v-model="form.address"
            type="textarea"
            height="156"
            :auto-height="true"
            maxlength="10000"
            placeholder="请输入详细地址"
          />
        </u-form-item>
      </u-form>
    </view>

    <view class="edit_btn">
      <view class="ebc_count">
        消耗
        <view class="ebc">{{ info.point }}EBC</view>
      </view>

      <view class="d-flex">
        <view class="btn cancel" @click="$u.debounce(cancel, 1000)">取消</view>
        <view class="btn save" @click="$u.debounce(submit, 1000)">兑换</view>
      </view>
    </view>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";
export default {
  data() {
    return {
      id: "",
      info: "",
      address: "", // 收货地址
      ossUrl: `${window.location.protocol}//ebaina.oss-cn-hangzhou.aliyuncs.com/`,

      form: {
        name: "",
        tel: "",
        address: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入收货人",
            trigger: ["change", "blur"],
          },
        ],
        tel: [
          {
            required: true,
            message: "请输入手机/电话",
            trigger: ["change", "blur"],
          },
          {
            validator: (rule, value, callback) => {
              var re = /^0\d{2,3}-?\d{7,8}$/;
              return this.$u.test.mobile(value) || re.test(value);
            },
            message: "手机/电话不正确",
            trigger: ["change", "blur"],
          },
        ],
        address: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  onLoad() {
    this.id = this.$route.query.id;
  },
  onShow() {
    if (!authStatus()) return;

    this.init();
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  methods: {
    init() {
      this.$u.api.exchangePointDetail({ id: this.id }).then((res) => {
        const {
          code,
          data: { address, info },
        } = res;

        this.form = address;
        this.form.address = address.district + address.address;
        this.info = info;
      });
    },
    // 兑换
    exchange(v) {
      this.$u.api.getMsgRead({ id: v.id }).then((res) => {});
    },
    cancel() {
      uni.navigateBack();
    },
    submit() {
      if (this.info.virtual == "是") {
        this.setExchange();
      } else {
        this.$refs.uForm.validate((valid) => {
          if (valid) {
            this.setExchange();
          }
        });
      }
    },

    // 提交兑换
    setExchange() {
      this.$u.api
        .setExchangePoint({
          id: this.id,
          name: this.form.name,
          tel: this.form.tel,
          address: this.form.address,
        })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$u.toast(msg);
            this.$Router.replace({
              path: "/user_center/exchange_point",
              query: {
                current: 1,
              },
            });
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
.detail {
  padding: 20rpx 16rpx 194rpx;
}

.exchange_list {
  margin: 28rpx 0;

  .exchange_item {
    margin-bottom: 20rpx;
    padding: 24rpx 34rpx 40rpx 26rpx;
    background: #ffffff;
    border-radius: 16rpx;

    image {
      margin-right: 26rpx;
      width: 204rpx;
      height: 204rpx;
      background: #ededed;
      border: 2rpx solid #e6e6e6;
      border-radius: 18rpx;
      flex-shrink: 0;
    }

    .r_main {
      .top_info {
        display: flex;
        justify-content: space-between;

        .name {
          font-size: 30rpx;
          font-weight: 600;
          line-height: 42rpx;
          color: #333333;

          .txt {
            margin-top: 8rpx;
            font-size: 24rpx;
            font-weight: 400;
            line-height: 34rpx;
            color: #999999;
          }
        }

        .point {
          font-size: 28rpx;
          font-weight: 600;
          line-height: 40rpx;
          color: #0268fa;

          text {
            font-size: 36rpx;
          }
        }
      }

      .tips {
        border-top: 2rpx solid #e2e2e2;
        margin-top: 18rpx;
        padding-top: 18rpx;
        font-size: 22rpx;
        font-weight: 400;
        line-height: 32rpx;
        color: #999999;
      }
    }
  }
}

.edit_form {
  padding: 26rpx 32rpx 0;
  background-color: #fff;
  border-radius: 16rpx;
}

/deep/ .u-form-item {
  padding: 0 0 30rpx;
  .u-form-item--left__content__label {
    font-size: 32rpx;
    color: #333;
    font-weight: bold;
    line-height: 94rpx;
  }

  .u-form-item__body {
    align-items: flex-start;
  }
  .u-input__input {
    box-sizing: border-box;
    height: 94rpx;
    padding: 26rpx 30rpx;
    background: #f6f6f6;
    border-radius: 16rpx;
    font-size: 30rpx;
    color: #333;
  }

  .u-form-item--right {
    min-height: 94rpx;
  }
}

.edit_btn {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  width: 100%;
  height: 174rpx;
  background-color: #fff;

  .ebc_count {
    font-size: 24rpx;
    font-weight: 400;
    line-height: 34rpx;
    color: #999999;

    .ebc {
      font-size: 32rpx;
      font-weight: 600;
      line-height: 44px;
      color: #0268fa;
    }
  }

  .btn {
    margin-left: 16rpx;
    width: 204rpx;
    height: 82rpx;
    line-height: 82rpx;
    background: #0268fa;
    border-radius: 16rpx;

    font-size: 32rpx;
    text-align: center;
    color: #fff;
  }

  .cancel {
    background: #fff;
    border: 2rpx solid #0268fa;
    color: #0268fa;
  }
}
</style>
