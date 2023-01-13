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
        <u-form-item v-if="normal">
          <view class="d-between">
            <view class="l_label disabledLabel"> 关联合同 </view>
            <u-input
              v-model="contract.contract_name"
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

        <u-form-item
          label="关联合同"
          prop="contract"
          @click="checkContract"
          required
          v-else
        >
          <u-input
            v-model="contract.contract_name"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item v-if="contract">
          <view class="d-between">
            <view class="l_label disabledLabel"> 关联客户 </view>
            <u-input
              v-model="contract.customer_name"
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
        <u-form-item v-if="contract">
          <view class="d-between">
            <view class="l_label disabledLabel"> 关联企业 </view>
            <u-input
              v-model="contract.customer_company_name"
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
      <view class="txt"> 回款信息 </view>
    </view>
    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item label="回款计划期数" @click="checkPeriod">
          <u-input
            v-model="info.contract_period"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
        <u-form-item label="回款金额" prop="returnMoney" required>
          <u-input
            v-model="info.returnMoney"
            type="digit"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            @input="moneyIpt"
          ></u-input>
        </u-form-item>

        <u-form-item
          label="回款日期"
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
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit other_msg d-flex">
      <view class="txt"> 其他信息 </view>
    </view>
    <view class="form_main">
      <u-form labelWidth="100">
        <u-form-item label="支付方式" @tap="checkPayType">
          <u-input
            v-model="info.pay_type"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item label="汇款银行">
          <u-input
            v-model="info.pay_bank"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>
        <!--<u-form-item label="负责人" labelWidth="100" required>
          <u-input
            v-model="user.name"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
        </u-form-item>-->

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

    <view class="fixed_btm btm_btns d-flex" v-if="isEdit || normal">
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
      class="fixed_btm btm_btns d-flex"
      :class="is_create ? 'lightBtn' : 'btn'"
      v-else
    >
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
      normal: false,
      infoId: "",
      dateShow: false,
      cancelStyle: store.state.cancelStyle,
      labelStyle: {
        color: "#c3c3c3!important",
      },

      customer_id: "",
      typeList: [], // 支付方式
      period: [], //期数
      user: {},
      contract: {}, // 合同

      info: {
        returnMoney: "",
        dateTime: "",
        visitTime: "",
        pay_type: "",
        pay_bank: "",
        remarks: "",
        contract_period: "",
        contract_period_id: "",
      },
      rules: {
        contract: {
          type: "string",
          required: true,
          message: "请选择关联合同",
          trigger: ["blur", "change"],
        },
        returnMoney: {
          type: "number",
          required: true,
          message: "请输入回款金额",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  computed: {
    // 创建按钮状态
    is_create() {
      let flag = false;
      const { returnMoney, visitTime } = this.info;

      if (returnMoney && visitTime && this.contract) {
        flag = true;
      }
      return flag;
    },
  },
  onLoad() {
    this.inintDate();

    let query = this.$Route.query;
    this.customer_id = query.customer_id || "";
    this.contract.id = query.contract_id || "";

    // 合同详情不能编辑合同
    if (query.from == "contract") {
      this.normal = true;
    }
    this.init();

    // 数据监听
    let _th = this;
    uni.$on("updateData", function (data) {

      switch (data.type) {
        case "contract":
          _th.contract = data.contract;
          _th.info.returnMoney = data.contract.return_money;
          _th.init();
          break;
        case "payType":
          _th.info.pay_type = data.value;
          break;
        case "period":
          _th.info.contract_period = data.text == "无" ? "" : data.text;
          _th.info.contract_period_id = data.value;
          _th.info.returnMoney = data.item.return_money || _th.info.returnMoney;
          _th.info.pay_bank = data.item.pay_bank || _th.info.pay_bank;
          _th.info.pay_type = data.item.pay_type || _th.info.pay_type;
          _th.info.dateTime = data.item.return_time || _th.info.dateTime;
          _th.info.visitTime = data.item.return_time || _th.info.visitTime;
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
      this.getInitInfo();
    },
    getInitInfo() {
      getData("/payment_collection/relation_payment", {
        params: {
          contract_id: this.contract ? this.contract.id : "",
        },
      }).then((res) => {
        const {
          code,
          data: { user, contract, pay_type, period },
        } = res;
        if (code === 200) {
          this.user = user;
          this.contract = contract;
          this.payTypeList = pay_type;
          this.period = period;
        }
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

    moneyIpt(e) {
      e = e.match(/\d+\.?\d{0,2}/) ? e.match(/\d+\.?\d{0,2}/)[0] : "";
      // e = e.replace(/[^\d]/g, "");

      //重新赋值给input
      this.$nextTick(() => {
        if (this.contract) {
          let money = this.contract.return_money;
          if (Number(e) > money) {
            this.info.returnMoney = money;
          } else {
            this.info.returnMoney = e;
          }
        } else {
          this.info.returnMoney = e;
        }
      });
    },

    // 选择合同
    checkContract() {
      this.$Router.push({
        path: "/return_choose_contract",
        query: {
          customer_id: this.contract
            ? this.contract.customer_id
            : this.customer_id,
          type: "contract",
        },
      });
    },

    // 期数
    checkPeriod() {
      if (this.contract && this.contract.contract_name) {
        this.$Router.push({
          path: "/choose_period",
          query: {
            list: this.period ? JSON.stringify(this.period) : "",
            type: "period",
          },
        });
      } else {
        this.$u.toast("请先关联合同");
      }
    },

    // 支付方式
    checkPayType() {
      this.$Router.push({
        path: "/choose_list",
        query: {
          list: this.payTypeList,
          type: "payType",
        },
      });
    },

    // 创建
    create() {
      this.$refs.uForm.validate().then((res) => {
        let info = this.info;
        this.createLoading = !this.createLoading;

        let url = "/payment_collection";
        if (this.isEdit) {
          url = "/contract/update";
        }

        let params = {
          contract_id: this.contract ? this.contract.id : "",
          customer_id: this.contract ? this.contract.customer_id : "",
          return_money: info.returnMoney,
          return_time: info.visitTime,
          pay_type: info.pay_type,
          pay_bank: info.pay_bank,
          payment_plan_id: info.contract_period_id,
          remarks: info.remarks,
        };

        // return;

        postData(url, params)
          .then((res) => {
            const { code, data } = res;
            if (code === 200) {
              this.$refs.uToast.show({
                message: data.msg,
                complete() {
                  uni.navigateBack({ delta: 1 });
                },
              });
            } else if (code === 422) {
              // if (data.contract_id) {
              //   this.$u.toast(contract_id[0]);
              // }
              // if (data.customer_id) {
              //   this.$u.toast(customer_id[0]);
              // }
              this.$u.toast(data.msg);

              this.createLoading = !this.createLoading;
            }else {
              this.$u.toast(msg);
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
    // padding-right: 20px !important;
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
  justify-content: space-around;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}

/deep/.u-textarea {
  padding: 10px 0 !important;
}
</style>