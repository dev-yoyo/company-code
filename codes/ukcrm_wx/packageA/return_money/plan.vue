<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item>
          <view class="d-between">
            <view class="l_label disabledLabel"> 合同金额 </view>
            <view class="price">￥{{ reveal_money }}</view>
          </view>
        </u-form-item>
      </u-form>
    </view>

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit d-flex">
      <view class="txt"> 回款计划 </view>
    </view>
    <view class="form_main">
      <!-- 报价产品 -->
      <view
        class="product_info_box"
        v-for="(v, i) in activeProductList"
        :key="i"
      >
        <u-form labelWidth="100">
          <u-form-item>
            <view class="d-between">
              <view class="l_label l_title"> {{ v.period }} 期 </view>

              <!--<view class="del d-center" @click="del(i)" v-if="activeProductList.length > 1">
                <i class="icon iconfont icon-sc"></i>
                删除
              </view>-->
            </view>
          </u-form-item>
          <u-form-item>
            <view class="d-between">
              <view class="l_label"> <text>*</text> 计划回款金额 </view>

              <view class="producr_price_box d-center">
                <u-input
                  v-model="v.money"
                  type="digit"
                  placeholder="请输入"
                  placeholderStyle="#999999"
                  fontSize="14"
                  border="none"
                  inputAlign="right"
                  :focus="v.focus"
                  @focus="focusIpt($event, i)"
                  @blur="blurIpt($event, i)"
                  @input="moneyIpt($event, i)"
                  v-if="v.edit"
                ></u-input>
                <view class="grey" v-else>{{ v.money }}</view>
                <view :class="v.edit ? '' : 'grey'">元</view>
              </view>
            </view>
          </u-form-item>
          <u-form-item
            label="计划回款日期"
            required
            @click="dateChange(e, i, v)"
          >
            <view class="return_time">
              <u-input
                v-model="v.time"
                placeholder="请选择"
                placeholderStyle="#999999"
                fontSize="14"
                border="none"
                inputAlign="right"
                readonly
                v-if="v.edit"
              ></u-input>
              <view class="grey" v-else>{{ v.time }}</view>
              <view
                ><u-icon v-if="v.edit" slot="right" name="arrow-right"></u-icon
              ></view>
            </view>

            <u-datetime-picker
              :show="dateShow"
              v-model="v.dateTime"
              mode="date"
              :formatter="formatter"
              @confirm="dateConfirm($event)"
              @cancel="dateShow = false"
            ></u-datetime-picker>
          </u-form-item>
        </u-form>

        <view
          class="create d-center"
          @click="addProduct"
          v-if="i == activeProductList.length - 1"
        >
          <i class="icon iconfont icon-tjx"></i>
          添加回款计划
        </view>
      </view>
    </view>
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
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <view class="fixed_btm btm_btns d-flex">
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
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";

export default {
  data() {
    return {
      createLoading: false,
      cancelStyle: {
        "margin-right": "20px",
        color: "#333",
        "background-color": " #fff",
        border: "1px solid #333",
      },
      isContract: true,
      typeList: [], // 支付方式
      contract_id: 0, // 合同
      customer_id: 0,
      money: 0,
      reveal_money: 0,
      activeProductList: [],
      index: 0,
      dateShow: false,
      info: {
        pay_type: "",
        pay_bank: "",
      },
      rules: {
        visitTime: {
          type: "string",
          required: true,
          message: "请选择报价日期",
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
    let query = this.$Route.query;
    if (query.contract_id) {
      this.contract_id = query.contract_id;
    }
    if (query.from) {
      this.isContract = query.from == "contract";
    }
    this.init();

    // 数据监听
    let _th = this;
    uni.$on("updateData", function (data) {
      switch (data.type) {
        case "payType":
          _th.info.pay_type = data.value;
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
      getData("/payment_plan", {
        params: {
          contract_id: this.contract_id || 0,
        },
      }).then((res) => {
        const {
          code,
          data: { money, pay_type, list, reveal_money, customer_id, pay },
        } = res;
        if (code === 200) {
          this.reveal_money = reveal_money;
          this.money = money;
          (this.info = {
            pay_type: pay ? pay[1] : "",
            pay_bank: pay ? pay[0] : "",
          }),
            (this.customer_id = customer_id || 0),
            (this.payTypeList = pay_type);
          if (list.length > 0) {
            list.forEach((v) => {
              v.money = v.return_money;
              v.time = v.return_time;
              (v.dateTime = v.return_time), (v.edit = false);
              v.focus = false;
            });
            this.activeProductList = list;
          } else {
            this.activeProductList = [
              {
                period: 1,
                edit: true,
                focus: false,
              },
            ];
            this.initDate();
          }
          console.log(this.activeProductList);
        }
      });
    },

    addProduct() {
      let period = 1;
      let len = this.activeProductList.length;
      if (len > 0) {
        period = this.activeProductList[len - 1].period;
      }
      this.activeProductList.push({
        period: period + 1,
        edit: true,
        focus: false,
      });
      this.initDate();
    },

    del(i) {
      this.activeProductList.splice(i, 1);
    },

    moneyIpt(e, i) {
      e = e.match(/\d+\.?\d{0,2}/) ? e.match(/\d+\.?\d{0,2}/)[0] : "";

      this.$nextTick(() => {
        this.activeProductList[i].money = e;
      });
    },

    focusIpt(e, i) {
      this.activeProductList[i].focus = true;
    },

    blurIpt(e, i) {
      this.activeProductList[i].focus = false;
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

    initDate() {
      const d = new Date();
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;

      this.activeProductList.forEach((v, k) => {
        v.dateTime = `${year}-${month}-${day}`;
      });
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

    dateChange(e, i, v) {
      this.index = i;

      this.activeProductList.forEach((v, k) => {
        v.focus = false;
      });
      if (v.edit) {
        this.dateShow = true;
      }
    },

    dateConfirm(e) {
      console.log(e);
      let time = new Date(e.value);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m < 10 ? `0${m}` : m;
      d = d < 10 ? `0${d}` : d;

      let valueTime = `${y}-${m}-${d}`;
      this.activeProductList[this.index].dateTime = valueTime;
      this.activeProductList[this.index].time = valueTime;
      this.dateShow = false;
    },

    // 创建
    create() {
      this.$refs.uForm.validate().then((res) => {
        let arr = this.activeProductList;
        let proArr = [];
        let flag = true;
        if (arr.length > 0) {
          arr.map((e, f) => {
            if (!e.money) {
              flag = false;
              return this.$u.toast("计划回款金额不能为空");
            }

            if (!e.time) {
              flag = false;
              return this.$u.toast("计划回款日期不能为空");
            }

            proArr.push({
              period: e.period,
              return_money: e.money,
              return_time: e.time,
            });
          });
        }

        if (!flag) return;
        let info = this.info;
        this.createLoading = !this.createLoading;

        let url = "/payment_plan";

        let params = {
          payment_plan: proArr,
          contract_id: this.contract_id || 0,
          customer_id: this.customer_id || 0,
          pay_type: info.pay_type,
          pay_bank: info.pay_bank,
        };

        console.log("params >>", params);

        postData(url, params)
          .then((res) => {
            const { code, data } = res;
            if (code === 200) {
              let that = this;
              this.$refs.uToast.show({
                message: data.msg,
                complete() {
                  if (that.isContract) {
                    uni.navigateBack({ delta: 1 });
                  } else {
                    that.$Router.replaceAll({
                      path: `/contract_detail/${that.contract_id}`,
                      query: {
                        contract_id: that.contract_id,
                      },
                    });
                  }
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

.l_input {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.price {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #ff9d00;
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

.product_info_box {
  margin-bottom: 1px;
  padding: 0 20px;
  background-color: #fff;

  /deep/.u-form-item {
    position: relative;
    border-bottom: 1px solid #f7f8fa;

    .u-form-item__body {
      padding-left: 7px !important;
      padding-right: 0 !important;
    }
  }

  .l_title {
    font-size: 13px;
    font-weight: 600;
    color: #333333;
  }

  .del {
    font-size: 12px;
    color: #4d6fff;

    .iconfont {
      margin-right: 5px;
    }
  }

  .producr_price_box {
    line-height: 1;

    text {
      margin-left: 3px;
      font-size: 14px;
      color: #333;
    }
  }

  .create {
    height: 52px;
    background-color: #fff;
    color: #316ec3;
    font-size: 13px;

    .iconfont {
      margin-right: 5px;
    }
  }
}

.grey {
  color: #c3c3c3;
  text-align: right;
}

.return_time {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>