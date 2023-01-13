<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit d-flex">
      <view class="txt"> 基本信息 </view>
    </view>
    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item label="合同编号" prop="no" required>
          <u-input
            v-model="info.no"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>

        <u-form-item label="合同名称" prop="name" required>
          <u-input
            v-model="info.name"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>

        <u-form-item>
          <view class="d-between">
            <view class="l_label disabledLabel"> 签订人 </view>
            <u-input
              v-model="user.name"
              placeholder="请输入"
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
              inputAlign="right"
              color="#C3C3C3"
              readonly
            ></u-input>
          </view>
        </u-form-item>

        <u-form-item
          label="签订日期"
          prop="dateTime"
          required
          @click="dateShow = true"
        >
          <u-input
            v-model="info.visitTime"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>

          <u-datetime-picker
            :show="dateShow"
            v-model="info.dateTime"
            mode="date"
            :formatter="formatter"
            @confirm="dateConfirm"
            @cancel="dateShow = false"
          ></u-datetime-picker>

          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
		<u-form-item label="质保期限" prop="warranty" required>
		  <u-input
		    v-model="info.warranty"
		    placeholder="请输入"
		    placeholderStyle="#999999"
		    fontSize="14"
		    border="none"
			type="number"
			maxlength="2"
		    inputAlign="right"
		  ></u-input>
		</u-form-item>

        <!--<u-form-item label="合同金额">
          <u-input
            v-model="totalMoney"
            placeholder="0.00"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            color="#C3C3C3"
            readonly
          ></u-input>
        </u-form-item>-->
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit other_msg d-flex">
      <view class="txt"> 客户信息 </view>
    </view>
    <view class="form_main">
      <u-form :model="info" labelPosition="left" labelWidth="100">
        <u-form-item label="客户名称" @click="checkCustomer" required>
          <u-input
            v-model="customer.name"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item>
          <view class="d-between">
            <view class="l_label disabledLabel"> 关联企业 </view>
            <u-input
              v-model="customer.company"
              placeholder=" "
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
              inputAlign="right"
              readonly
              color="#C3C3C3"
            ></u-input>
          </view>
        </u-form-item>
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit other_msg d-flex">
      <view class="txt"> 产品信息 </view>
    </view>
    <view class="form_main">
      <u-form labelPosition="left" labelWidth="100">
        <u-form-item label="关联报价单" required @tap="checkOffer">
          <u-input
            v-model="offer.offer_num"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>

      <!-- 报价单下面的产品 -->
      <view
        class="product_info_box"
        v-for="(v, i) in offer.offer_product"
        :key="i"
      >
        <u-form>
          <u-form-item>
            <view class="d-between">
              <view class="l_label disabledLabel">
                <text>*</text> 产品{{ i + 1 }}名称
              </view>

              <u-input
                v-model="v.product_name"
                placeholder="请选择"
                placeholderStyle="#999999"
                fontSize="14"
                border="none"
                inputAlign="right"
                readonly
              ></u-input>
              <u-icon slot="right" name="arrow-right"></u-icon>
            </view>
          </u-form-item>

          <u-form-item>
            <view class="d-between">
              <view class="l_label disabledLabel">
                <text>*</text> 产品单价
              </view>

              <view class="producr_price_box d-center">
                <u-input
                  type="number"
                  v-model="v.product_price"
                  placeholder="请输入"
                  placeholderStyle="#999999"
                  color="#C3C3C3"
                  fontSize="14"
                  border="none"
                  inputAlign="right"
                  readonly
                ></u-input>
                <text>元</text>
              </view>
            </view>
          </u-form-item>

          <u-form-item>
            <view class="d-between">
              <view class="l_label"> <text>*</text> 产品数量 </view>

              <view class="producr_price_box d-center">
                <u-input
                  type="number"
                  v-model="v.product_num"
                  placeholder="请输入"
                  placeholderStyle="#999999"
                  fontSize="14"
                  border="none"
                  inputAlign="right"
                ></u-input>
                <!-- <text class="count">元</text> -->
              </view>
            </view>
          </u-form-item>
        </u-form>
      </view>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit other_msg d-flex">
      <view class="txt"> 其他信息 </view>
    </view>
    <view class="form_main">
      <u-form>
        <u-form-item>
          <view class="l_label"> 备注</view>
          <view>
            <u--textarea
              v-model="info.remarks"
              placeholder="请输入"
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
            ></u--textarea>
          </view>
        </u-form-item>
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <view class="new_fixed_btm btm_btns d-flex" v-if="isEdit">
      <u-button type="default" @click="cancel" :customStyle="cancelStyle">
        取消
      </u-button>

      <u-button
        @click="create"
        color="#4D6FFF"
        :loading="createLoading"
        :disabled="createLoading"
      >
        保存
      </u-button>
    </view>

    <view
      class="new_fixed_btm btm_btns d-flex"
      :class="is_create ? 'lightBtn' : 'btn'"
      v-else
    >
      <view class="price_box">
        合同金额：<text class="price">{{totalMoney || 0.00}}</text>
      </view>
      <u-button
        @click="create"
        :loading="createLoading"
        :disabled="createLoading"
      >
        {{ isEdit ? "提交" : "创建" }}
      </u-button>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      isEdit: false,
      infoId: "",
      dateShow: false,
      cancelStyle: store.state.cancelStyle,
      user: {},
      customer: {},
      offer: {},
      customer_id: "",
      productList: [], // 关联报价单 下面的产品

      info: {
        no: "",
        name: "",
        dateTime: "",
        visitTime: "",
        remarks: "",
		warranty: ""
      },
      rules: {
        no: {
          type: "string",
          required: true,
          message: "请输入合同编号",
          trigger: ["blur", "change"],
        },
        name: {
          type: "string",
          required: true,
          message: "请输入合同名称",
          trigger: ["blur", "change"],
        },
        warranty: {
          type: "number",
          required: true,
          message: "请输入质保期限",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  computed: {
    // 创建按钮状态
    is_create() {
      let flag = false;
      const { no, name, visitTime } = this.info;
      let customer = this.customer;
      let offer = this.offer;

      if (
        no &&
        name &&
        visitTime &&
        customer &&
        customer.name &&
        offer &&
        offer.id
      ) {
        flag = true;
      }
      return flag;
    },
    totalMoney() {
      let arr = this.offer ? this.offer.offer_product : [];
      let num = 0;
      if (arr && arr.length > 0) {
        arr.map((e) => {
          num += e.product_num * e.product_price;
        });
      }
      return num;
    },
  },
  onLoad() {
    this.inintDate();

    let query = this.$Route.query;
    if (query.customer_id) {
      this.customer.id = query.customer_id;
    }
    this.init();

    // 数据监听
    let _th = this;
    uni.$on("updateData", function (data) {

      switch (data.type) {
        case "customer":
          _th.customer = data.customer;
          _th.offer = {};
          _th.init();
          break;
        case "offer":
          _th.offer = data.offer;
          _th.init();
          break;

        default:
          break;
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  methods: {
    init() {
      getData("/contract/relation_contract", {
        params: {
          customer_id: this.customer ? this.customer.id : "",
          offer_id: this.offer ? this.offer.id : "",
        },
      }).then((res) => {
        const {
          code,
          data: { user, customer, offer },
        } = res;
        if (code === 200) {
          this.user = user;
          this.customer = customer;
          this.offer = offer;
        }
      });
    },

    // 选择客户
    checkCustomer() {
      this.$Router.push({
        path: "/choose_customer",
        query: {
          customer: this.customer,
          type: "customer",
        },
      });
    },
    // 选择 报价单
    checkOffer() {
      if (!this.customer) {
        this.$u.toast("请先选择客户");
        return;
      }

      this.$Router.push({
        path: "/choose_offer",
        query: {
          offer: JSON.stringify(this.offer),
          customer_id: this.customer.id,
          type: "offer",
        },
      });
    },
    inintDate() {
      const d = new Date();
      const year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;

      this.info.visitTime = `${year}-${month}-${day}`;
      this.info.dateTime = `${year}-${month}-${day}`;
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}`;
      }
      if (type === "month") {
        return `${value}`;
      }
      if (type === "day") {
        return `${value}`;
      }
      return value;
    },
    dateConfirm(e) {
      let time = new Date(e.value);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m < 10 ? `0${m}` : m;
      d = d < 10 ? `0${d}` : d;

      let valueTime = `${y}-${m}-${d}`;

      this.info.dateTime = valueTime;
      this.info.visitTime = valueTime;
      this.dateShow = false;
    },

    // 创建
    create() {
      this.$refs.uForm.validate().then((res) => {
        if (!this.customer) {
          return this.$u.toast("请选择客户");
        }

        if (!this.offer) {
          return this.$u.toast("请选择关联报价单");
        }

        let arr = this.offer.offer_product || [];
        if (arr.length > 0) {
          arr.map((e) => {
            if (!e.product_num) {
              return this.$u.toast("数量不能为空");
            }
          });
        }

        let info = this.info;
        this.createLoading = !this.createLoading;

        let url = "/contract";
        if (this.isEdit) {
          url = "/contract/update";
        }

        let params = {
			warranty: info.warranty,
          contract_no: info.no,
          contract_name: info.name,
          offer_record_id: this.offer.id,
          offer_product: this.offer.offer_product,
          sign_time: info.visitTime,
          money: this.totalMoney,
          customer_id: this.customer.id,
          customer_name: this.customer.name,
          phone: this.customer.phone,
          customer_company_name: this.customer.company,
          remarks: this.info.remarks,
        };

        // return;
        postData(url, params)
          .then((res) => {
            const { code, data } = res;
            if (code === 200) {
              if(this.isEdit) {
                this.$refs.uToast.show({
                  message: data.msg,
                  complete() {
                    uni.navigateBack({ delta: 1 });
                  },
                });
              }else {
                this.$Router.replace({
                  path: "/contract_success",
                  query:{
                    contract_id: data.id
                  }
                });
              }
            } else if (code === 422) {
              // if (data.contract_no) {
              //   this.$u.toast(contract_no[0]);
              // }
              // if (data.contract_name) {
              //   this.$u.toast(contract_name[0]);
              // }
              this.$u.toast(data.msg);

              this.createLoading = !this.createLoading;
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
            // uni.$u.toast("创建失败，请重试");
          });
      });
    },

    cancel() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="less" scoped>
.detail_main {
  padding: 0 0 130px;
}

.tit {
  justify-content: space-between;
  padding: 10px 26px;
  padding-right: 15px;

  .txt {
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
    color: #999999;
  }
}

.other_msg {
  padding: 10px 26px;
}

.l_label {
  position: relative;
  font-size: 14px;
  color: #666;
  line-height: 20px;

  text {
    position: absolute;
    left: -11px;
    color: #f56c6c;
    line-height: 20px;
    font-size: 20px;
    top: 3px;
  }
}

.disabledLabel {
  color: #c3c3c3;
}

.form_main {
  /deep/.u-form-item__body {
    padding: 14px 20px !important;
    padding-left: 26px !important;
  }

  /deep/.item__body__right__content__icon {
    margin-left: 10px;
  }
}

.product_info_box {
  margin: 10px 0;

  .producr_price_box {
    line-height: 1;
    text {
      font-size: 14px;
      color: #c3c3c3;
    }

    .count {
      color: #333;
    }
  }
}

.btm_btns {
  justify-content: space-between;

  .price_box {
    font-size: 13px;
    font-weight: 400;
    line-height: 22px;
    color: #333;
    .price {
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      color: #FF9D00;
    }
  }
  /deep/.u-button {
    width: 130px;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
    margin:0;
  }
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}

/deep/.u-textarea {
  padding: 10px 0 !important;
}
</style>