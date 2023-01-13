<template>
  <view class="invoice">
    <u-form
      class="invoice_form"
      :model="form"
      ref="uForm"
      :error-type="['toast']"
      label-width="160"
      :border-bottom="false"
      label-position="left"
    >
      <u-form-item
        label="发票类型"
        prop="invoicType"
        :border-bottom="false"
        v-if="paymentType"
      >
        <view class="choose_invoice_box" @tap="invoiceShow = true">
          {{ invoiceList[invoiceIndex].label }}

          <i class="icon iconfont icon-e-zy"></i>
        </view>
        <u-select
          v-model="invoiceShow"
          :list="invoiceList"
          @confirm="confirm"
        ></u-select>
      </u-form-item>

      <u-form-item label="公司名称" prop="company" :border-bottom="false">
        <u-input v-model="form.company" placeholder="请输入公司名称" />
      </u-form-item>
      <u-form-item label="公司税号" prop="tax_number" :border-bottom="false">
        <u-input v-model="form.tax_number" placeholder="请输入公司税号" />
      </u-form-item>
      <u-form-item label="单位地址" prop="address" :border-bottom="false">
        <u-input
          v-model="form.address"
          type="textarea"
          height="156"
          maxlength="10000"
          placeholder="请输入单位地址"
        />
      </u-form-item>
      <u-form-item label="电话号码" prop="tel" :border-bottom="false">
        <u-input v-model="form.tel" placeholder="请输入电话号码" />
      </u-form-item>
      <u-form-item label="开户行" prop="deposit_bank" :border-bottom="false">
        <u-input v-model="form.deposit_bank" placeholder="请输入开户行" />
      </u-form-item>
      <u-form-item label="银行账号" prop="bank_account" :border-bottom="false">
        <u-input v-model="form.bank_account" placeholder="请输入银行账号" />
      </u-form-item>
      <u-form-item label="电子邮箱" prop="email" :border-bottom="false">
        <u-input v-model="form.email" placeholder="请输入电子邮箱" />
      </u-form-item>
    </u-form>
    <view class="invoice_btn">
      <view class="tip"
        >温馨提示：请确保所填开票信息与贵公司税务登记证一致。</view
      >
      <view class="btn save" @click="submit()">保存</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {
        company: "",
        tax_number: "",
        address: "",
        tel: "",
        deposit_bank: "",
        bank_account: "",
        email: "",
        invoicType: "", // 发票类型  订单选择时 出现
      },
      region: false,
      rules: {
        invoicType: [{ required: false }],
        company: [
          {
            required: true,
            message: "请输入公司名称",
            trigger: ["change", "blur"],
          },
        ],
        tax_number: [
          {
            required: true,
            message: "请输入税号",
            trigger: ["change", "blur"],
          },
        ],
        address: [
          {
            required: false,
            message: "请输入单位地址",
            trigger: ["change", "blur"],
          },
        ],
        tel: [
          {
            required: true,
            message: "请输入电话号码",
            trigger: ["change", "blur"],
          },
          {
            validator: (rule, value, callback) => {
              var re = /^0\d{2,3}-?\d{7,8}$/;
              return this.$u.test.mobile(value) || re.test(value);
            },
            message: "电话号码不正确",
            trigger: ["change", "blur"],
          },
        ],
        deposit_bank: [
          {
            required: false,
            message: "请输入开户行",
            trigger: ["change", "blur"],
          },
        ],
        bank_account: [
          {
            required: false,
            message: "请输入银行账号",
            trigger: ["change", "blur"],
          },
        ],
        email: [
          {
            required: true,
            message: "请输入电子邮箱",
            trigger: ["change", "blur"],
          },
          {
            validator: (rule, value, callback) => {
              return this.$u.test.email(value);
            },
            message: "电子邮箱不正确",
            trigger: ["change", "blur"],
          },
        ],
      },

      paymentType: false, // 下单时 、 选择 发票信息
      car_ids: "",
      invoiceShow: false,
      invoiceIndex: 0,
      invoiceList: [
        {
          value: 0,
          label: "不开票",
        },
        {
          value: 1,
          label: "电子发票",
        },
        {
          value: 2,
          label: "增值税普票",
        },
        {
          value: 3,
          label: "增值税专票",
        },
      ],
    };
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
  onLoad: function (option) {
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
      this.$u.api.invoiceInfo().then((res) => {
        const {
          code,
          data: { info, msg },
        } = res;
        if (code === 200) {
          if (info) {
            this.form = info;
          }
        } else if (code === 422) {
          this.$u.toast({
            title: msg,
            icon: "none",
          });
        }
      });
    },

    //  选择发票类型
    confirm(e) {
      this.invoiceIndex = e[0].value;
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          console.log("验证通过");

          let params = {
            company: this.form.company,
            tax_number: this.form.tax_number,
            address: this.form.address,
            tel: this.form.tel,
            deposit_bank: this.form.deposit_bank,
            bank_account: this.form.bank_account,
            email: this.form.email,
          };
          this.$u.api.editInvoice(params).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$u.toast(msg);

              if (this.paymentType) {
                this.$Router.replace({
                  path: "/payment",
                  query: {
                    car_ids: this.car_ids,
                    invoiceIndex: this.invoiceIndex,
                  },
                });
              } else {
                this.init();
              }
            } else if (code === 422) {
              this.$u.toast({
                title: msg,
                icon: "none",
              });
            }
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
page {
  background-color: #fff !important;
}
.invoice {
  padding: 26rpx 0 0;
}
.invoice_form {
  padding: 0 32rpx 0;
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
.invoice_btn {
  padding: 0 30rpx 40rpx;
  margin-top: 100rpx;
  .tip {
    font-size: 24rpx;
    line-height: 34rpx;
    color: #666;
    margin-bottom: 34rpx;
    text-align: center;
  }
  .btn {
    margin-right: 22rpx;
    height: 88rpx;
    background: #0268fa;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
    line-height: 88rpx;
    text-align: center;
    color: #fff;
  }
}

.choose_invoice_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20rpx;
  width: 376rpx;
  height: 64rpx;
  line-height: 64rpx;
  font-size: 26rpx;
  color: #333333;
  background: #ffffff;
  border: 2rpx solid #c0bdbe;
}
</style>
