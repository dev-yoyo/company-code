<template>
  <div class="add_detail">
    <el-drawer
      :visible="returnShow"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="667px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">{{ isEdit ? "编辑回款计划" : "新建回款计划" }}</div>
      <div class="close_icon d-center" @click="cancel()">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <el-form
        :model="form"
        ref="returnPlanForm"
        :rules="rules"
        label-width="100px"
        class="demo-form"
      >
        <div class="form_tit">基础信息</div>

        <div class="d-between">
          <el-form-item label="关联合同" required prop="contract_name">
            <div @click="chooseContract()">
              <el-input
                v-model="contract.contract_name"
                placeholder="请选择"
                :disabled="isEdit"
              >
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-caret-bottom"
                ></i>
              </el-input>
            </div>
          </el-form-item>

          <el-form-item label="关联客户">
            <el-input
              v-model="contract.customer_name"
              placeholder="请输入"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="d-between">
          <el-form-item label="关联企业">
            <el-input
              v-model="contract.customer_company_name"
              placeholder="请输入"
              disabled
            ></el-input>
          </el-form-item>
          <el-form-item label="创建人">
            <el-input
              v-model="contract.sign_user"
              placeholder="请输入"
              disabled
            ></el-input>
          </el-form-item>
        </div>

        <div class="d-between">
          <el-form-item label="创建时间">
            <el-input v-model="contract.sign_time" disabled></el-input>
          </el-form-item>

          <el-form-item label="支付方式" prop="tag">
            <el-select
              v-model="form.pay_type"
              placeholder="请选择"
              class="force_select"
            >
              <el-option
                v-for="(v, i) in payTypeList"
                :key="i"
                :label="v"
                :value="v"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <el-form-item label="汇款银行">
          <el-input v-model="form.pay_bank" placeholder="请输入"></el-input>
        </el-form-item>

        <div class="base_info d-between">
          <div class="form_tit">回款信息</div>

          <el-button
            class="com_btn add_pro"
            icon="el-icon-plus"
            @click="addPlan"
          >
            添加
          </el-button>
        </div>

        <div v-for="(v, i) in planArr" :key="i">
          <div class="plan_tit">{{ i + 1 }}期</div>

          <div class="d-between">
            <el-form-item label="计划回款金额">
              <el-input
                v-model="v.money"
                @input="moneyIpt($event, i)"
                :disabled="v.status == '1'"
              ></el-input>
            </el-form-item>

            <el-form-item label="计划回款日期">
              <el-date-picker
                v-model="v.time"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :disabled="v.status == '1'"
              >
              </el-date-picker>
            </el-form-item>

            <i class="iconfont icon-sc234 del_plan" @click="delPlan(i, v)"></i>
          </div>
        </div>

        <el-form-item>
          <div class="form_btns">
            <el-button class="com_btn cancel_btn" @click="cancel()">
              取消
            </el-button>

            <el-button
              class="com_btn"
              @click="submitForm"
              :loading="createLoading"
              :disabled="createLoading"
            >
              保存
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>

    <!-- 合同列表 -->
    <contract-list
      v-if="contractListShow"
      ref="contractListRef"
      @confirm="contractConfirm"
      @cancel="contractCancel"
    ></contract-list>
  </div>
</template>

<script>
import contractList from "./contract_list.vue";

import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    let checkMoney = (rule, value, callback) => {
      // console.log(value);

      let arr = this.planArr;
      // let flag = true;
      if (arr.length > 0) {
        arr.map((e) => {
          if (!e.money) {
            // flag = false;
            callback(new Error("计划回款金额不能为空"));
          }
        });
      }

      callback();
    };

    let checkDate = (rule, value, callback) => {
      // console.log(rule, value);
      let arr = this.planArr;
      // let flag = true;
      if (arr.length > 0) {
        arr.map((e) => {
          if (!e.time) {
            // flag = false;
            callback(new Error("计划回款日期不能为空"));
          }
        });
      }

      // if (!flag) {
      callback();
      // }
    };

    return {
      returnShow: true,
      isEdit: false,
      createLoading: false,

      contractListShow: false, // 选择合同

      customer_id: "",
      contract_id: "",

      user: {},
      contract: {}, // 合同
      payTypeList: [], // 支付方式

      planArr: [
        {
          money: "",
          time: "",
        },
      ],

      form: {
        contract_name: "",
        pay_type: "",
        pay_bank: "",

        returnMoney: "",
      },
      rules: {
        contract_name: {
          required: true,
          message: "请选择关联合同",
          trigger: ["blur", "change"],
        },
        money: [{ validator: checkMoney, trigger: ["blur", "change"] }],
        returnDate: [{ validator: checkDate, trigger: ["blur", "change"] }],
      },
    };
  },
  created() {},
  methods: {
    init({ contract_id }) {
      // console.log("contract_id >>", contract_id);
      this.contract_id = contract_id;

      // 创建 初始数据
      getData({
        url: "/payment_collection/relation_payment",
        data: {
          contract_id: contract_id || "",
        },
      }).then((res) => {
        const {
          code,
          data: { contract },
        } = res;
        if (code === 200) {
          this.contract = contract;
          this.form.contract_name = contract.contract_name;
        }
      });

      this.$nextTick(() => {
        this.resetForm();
        getData({
          url: "/payment_plan",
          data: {
            contract_id: this.contract_id || 0,
          },
        }).then((res) => {
          const {
            code,
            data: { money, pay_type, list, reveal_money, customer_id, pay },
          } = res;
          if (code === 200) {
            this.customer_id = customer_id;
            this.reveal_money = reveal_money;
            this.money = money;
            this.form.pay_bank = pay ? pay[0] : "";
            this.form.pay_type = pay ? pay[1] : "";
            this.payTypeList = pay_type;

            if (list.length > 0) {
              list.forEach((v) => {
                v.money = v.return_money;
                v.time = v.return_time;
              });
              this.planArr = list;
            }
            // console.log(this.planArr);
          }
        });
      });
    },

    moneyIpt(e, i) {
      // console.log(e, i, e.match(/\d+\.?\d{0,2}/));
      e = e.match(/\d+\.?\d{0,2}/) ? e.match(/\d+\.?\d{0,2}/)[0] : "";

      //重新赋值给input
      this.$nextTick(() => {
        this.planArr[i].money = e;
      });
    },

    // 选择合同
    chooseContract() {
      // 编辑不能更换合同
      if (this.isEdit) return;

      this.contractListShow = true;
      this.$nextTick(() => {
        this.$refs.contractListRef.init(this.contract);
      });
    },
    // 选择合同  确认
    contractConfirm(row) {
      // console.log(row);
      this.contract = row;
      this.form.contract_name = row.contract_name;
    },
    contractCancel() {
      this.contractListShow = false;
    },

    addPlan() {
      this.planArr.push({
        money: "",
        time: "",
      });
    },

    delPlan(i, v) {
      if (this.planArr.length > 1 && v.status != "1") {
        this.planArr.splice(i, 1);
      }
    },

    submitForm() {
      this.$refs["returnPlanForm"].validate((valid) => {
        // console.log(valid);
        if (valid) {
          let arr = this.planArr;
          let proArr = [];
          let flag = true;
          if (arr.length > 0) {
            arr.map((e, i) => {
              if (!e.money) {
                flag = false;
                return this.$warning("计划回款金额不能为空");
              }

              if (!e.time) {
                flag = false;
                return this.$warning("计划回款日期不能为空");
              }

              proArr.push({
                period: i + 1,
                return_money: e.money,
                return_time: e.time,
              });
            });
          }

          if (!flag) return;

          this.createLoading = !this.createLoading;
          let info = this.form;
          postData({
            url: "/payment_plan",
            data: {
              payment_plan: proArr,
              contract_id: this.contract_id || 0,
              customer_id: this.customer_id || 0,
              pay_type: info.pay_type,
              pay_bank: info.pay_bank,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg },
              } = res;
              if (code === 200) {
                this.cancel(true, true, this.contract_id);
                this.$success(msg);
              } else if (code === 422) {
                this.$err(msg);
              }

              this.createLoading = false;
            })
            .catch(() => {
              this.createLoading = false;
            });
        } else {
          // console.log("error submit!!");
          this.createLoading = false;
          return false;
        }
      });
    },

    cancel(update_list, updateEdit, contract_id) {
      // console.log("update_list", update_list, updateEdit);

      this.$emit("cancel", {
        update_list,
        isEdit: updateEdit,
        contract_id,
      });
      this.resetForm();
    },
    resetForm() {
      this.$refs["returnPlanForm"].resetFields();
    },
  },
  components: {
    contractList,
  },
};
</script>

<style lang="less" scoped>
.add_detail {
  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .form_tit {
    margin: 24px 0 16px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
    color: #464c5b;
  }
}

.plan_tit {
  margin: 5px 0;
  display: inline-block;
  padding: 0 15px;
  height: 22px;
  line-height: 22px;
  background: #f0f2f6;
  border-radius: 4px;

  font-size: 12px;
  font-weight: 400;
  color: #464c5b;
  text-align: center;
}

.base_info {
  margin: 24px 0 16px;

  .form_tit {
    margin: 0;
  }

  .add_pro {
    width: auto !important;
    padding: 0 12px !important;
    height: 34px !important;
    font-size: 12px !important;
    color: #4d6fff !important;
    border: 1px solid #e7e7e7 !important;
    background-color: #e5eafe !important;
    border-radius: 4px !important;
  }
}

.del_plan {
  line-height: 50px;
  margin-left: 5px;
  margin-top: -16px;
  color: #d7dce6;
  cursor: pointer;
}

.el-input {
  width: 180px !important;
}
/deep/.el-form-item__error {
  top: 86% !important;
}
/deep/.el-form-item__content {
  line-height: 25px !important;
}

/deep/ .force_select {
  width: 180px !important;
  div {
    width: 180px !important;
    input {
      width: 180px !important;
    }
  }
}
</style>