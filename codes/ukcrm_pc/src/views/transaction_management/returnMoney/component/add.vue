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
      <div class="title">{{ isEdit ? "编辑回款" : "新建回款" }}</div>
      <div class="close_icon d-center" @click="cancel()">
        <i class="iconfont icon-ykbx"></i>
      </div>
      <div class="kuang">
        <el-form
          :model="form"
          ref="returnForm"
          :rules="rules"
          label-width="100px"
          class="demo-form"
        >
          <div class="form_tit">基础信息</div>

          <div class="d-between">
            <el-form-item label="关联合同" required prop="contract_no">
              <div @click="chooseContract()">
                <el-input
                  v-model="contract.contract_no"
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
          <el-form-item label="创建时间">
            <el-input v-model="contract.sign_time" disabled></el-input>
          </el-form-item>

          <div class="form_tit">回款信息</div>
          <div class="d-between">
            <el-form-item label="回款计划期数">
              <el-select
                v-model="form.contract_period_id"
                placeholder="请选择"
                @change="planSelect"
              >
                <el-option
                  v-for="(v, i) in period"
                  :key="i"
                  :label="v.period"
                  :value="v.id"
                  :disabled="v.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="回款金额" required prop="returnMoney">
              <el-input v-model="form.returnMoney" @input="moneyIpt"></el-input>
            </el-form-item>
          </div>

          <div class="d-between">
            <el-form-item label="回款日期" required prop="returnDate">
              <el-date-picker
                v-model="form.returnDate"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="支付方式" prop="tag">
              <el-select v-model="form.pay_type" placeholder="请选择">
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
      </div>
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
import { getNowDate } from "@/libs/util";

export default {
  data() {
    return {
      id: '',
      returnShow: true,
      isEdit: false,
      createLoading: false,

      contractListShow: false, // 选择合同

      contract_id: "",
      return_id: "",

      user: {},
      contract: {}, // 合同
      payTypeList: [], // 支付方式
      period: [], //期数

      form: {
        contract_no: "",
        customer_company_name: "",
        returnDate: "",

        returnMoney: "",
        pay_type: "",
        pay_bank: "",
        remarks: "",

        contract_period_id: "", // 计划期数
        plan: "",
      },
      rules: {
        contract_no: {
          required: true,
          message: "请选择关联合同",
          trigger: ["blur", "change"],
        },
        returnMoney: {
          required: true,
          message: "请输入回款金额",
          trigger: ["blur", "change"],
        },
        returnDate: {
          required: true,
          message: "请选择回款日期",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  methods: {
    init({ return_id, contract_id }) {
      // console.log("创建回款 >>", return_id, contract_id);

      this.return_id = return_id;
      this.id = contract_id;

      // 创建 初始数据
      getData({
        url: "/payment_collection/relation_payment",
        data: {
          contract_id: contract_id || "",
        },
      }).then((res) => {
        const {
          code,
          data: { contract, pay_type, period },
        } = res;
        if (code === 200) {
          this.payTypeList = pay_type;
          this.period = period;

          if (contract) {
            this.contract = contract;
            this.form.contract_no = contract.contract_no;
          }
        }
      });

      this.$nextTick(() => {
        this.resetForm();
        // 编辑  回款id
        if (return_id) {
          this.isEdit = true;
          // 回款详情 数据回显
          getData({
            url: "/payment_collection/payment_detail",
            data: {
              id: return_id,
            },
          }).then((res) => {
            const {
              code,
              data: { detail },
            } = res;
            if (code === 200) {
              // console.log("detail >>> 2", detail);
              this.contract = detail.contract;
              if (detail.contract) {
                this.form.contract_no = detail.contract.contract_no;
                this.form.contract_name = detail.contract.contract_name;
              }
              this.form.returnDate = detail.return_time;
              this.form.returnMoney = detail.return_money;
              this.form.contract_period_id = detail.payment_plan_id;
              this.form.pay_type = detail.pay_type;
              this.form.pay_bank = detail.pay_bank;
              this.form.remarks = detail.remarks;
            }
          });
        } else {
          const { y, m, d } = getNowDate();
          this.form.returnDate = `${y}-${m}-${d}`;
        }
      });
    },

    moneyIpt(e) {
      e = e.match(/\d+\.?\d{0,5}/) ? e.match(/\d+\.?\d{0,5}/)[0] : "";

      //重新赋值给input
      this.$nextTick(() => {
        this.form.returnMoney = e;
      });
    },

    // 选择合同
    chooseContract() {
      // 编辑不能更换合同
      if (this.isEdit) return;

      this.contractListShow = true;
      this.$nextTick(() => {
        this.$refs.contractListRef.init(this.contract, this.id);
      });
    },
    // 选择合同  确认
    contractConfirm(row) {
      // console.log(row);
      this.contract = row;
      this.form.contract_no = row.contract_no;

      this.form.contract_period_id = "";
      this.init({ contract_id: this.contract.id });
    },
    contractCancel() {
      this.contractListShow = false;
    },

    planSelect(v) {
      // console.log(v);
      let arr = this.period;
      arr.map((e, i) => {
        if (e.id == v) {
          this.form.returnMoney = e.return_money;
        }
      });
    },

    submitForm() {
      this.$refs["returnForm"].validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;

          let info = this.form;
          let url = this.isEdit
            ? "/payment_collection/update"
            : "/payment_collection";
          postData({
            url,
            data: {
              primary_contract_id: this.contract.id || "",
              payment_collertion_id: this.return_id,
              return_money: info.returnMoney,
              return_time: info.returnDate,
              pay_type: info.pay_type,
              pay_bank: info.pay_bank,
              payment_plan_id: info.contract_period_id,
              remarks: info.remarks,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg, id },
              } = res;
              if (code === 200) {
                this.cancel(true, id, this.contract.id);
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

    cancel(update_list, return_id, contract_id) {
      // console.log("update_list", update_list, return_id);

      this.$emit("cancel", {
        update_list,
        return_id,
        contract_id,
      });
      this.resetForm();
    },
    resetForm() {
      this.$refs["returnForm"].resetFields();
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
  .kuang {
    margin-left: 25px;
  }
  .form_tit {
    margin: 24px 0 16px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
    color: #464c5b;
  }
   /deep/.el-form-item__error{
        top: 86% !important;
  }
  /deep/.el-form-item__content{
    line-height: 25px!important;
}
}
</style>
