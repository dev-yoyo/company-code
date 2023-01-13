<template>
  <div class="add_detail">
    <el-drawer
      :visible="show"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="667px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">{{ isEdit ? "编辑合同" : "新建合同" }}</div>
      <div class="close_icon d-center" @click="cancel()">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div class="detail_main">
        <el-form
          :model="form"
          :rules="rules"
          ref="contractForm"
          label-width="70px"
          class="demo-form"
        >
          <div class="form_tit">基础信息</div>

          <div class="d-align-center">
            <el-form-item label="合同编号" prop="no" required>
              <el-input v-model="form.no" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="合同名称" prop="name" required>
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </div>

          <div class="d-align-center">
            <el-form-item label="签订人">
              <el-input v-model="form.sign_user.name" disabled></el-input>
            </el-form-item>

            <el-form-item label="签订日期">
              <el-date-picker
                v-model="form.sign_time"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
          </div>

          <div class="d-align-center">
            <el-form-item label="客户名称" prop="customer_name" required>
              <div @click="chooseCustomer()">
                <el-input
                  v-model="form.customer_name"
                  placeholder="请选择"
                  readonly
                >
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-caret-bottom"
                  ></i>
                </el-input>
              </div>
            </el-form-item>

            <el-form-item label="关联企业">
              <el-input v-model="form.customer_company" disabled></el-input>
            </el-form-item>
          </div>
          <div class="d-align-center">
            <el-form-item label="质保期限" prop="warranty" required>
              <el-input v-model="form.warranty" type="number"></el-input>
            </el-form-item>
          </div>

          <el-form-item label="备注" class="remarks_item">
            <el-input
              type="textarea"
              v-model="form.remarks"
              placeholder="请输入内容（内容限制在150个字以内）"
              maxlength="150"
            ></el-input>
          </el-form-item>

          <div class="form_tit">产品信息</div>

          <el-form-item label="关联报价" prop="offer_num" required>
            <div @click="chooseOffer()" style="display: inline-block">
              <el-input v-model="form.offer_num" placeholder="请选择" readonly>
                <i
                  slot="suffix"
                  class="el-input__icon el-icon-caret-bottom"
                ></i>
              </el-input>
            </div>
          </el-form-item>

          <el-table
            ref="singleTable"
            :data="tableData"
            style="width: 100%; overflow: auto"
            :header-row-style="{
              color: '#657180',
              'font-size': '12px',
            }"
            :cell-style="{ color: '#657180', 'font-size': '12px' }"
            class="demo_table"
          >
            <el-table-column
              label="序号"
              type="index"
              min-width="72"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="产品名称"
              min-width="250"
              align="left"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.product_name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="产品单价"
              min-width="120"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div class="com-line-1">{{ scope.row.product_price }} 元</div>
              </template>
            </el-table-column>

            <el-table-column
              label="产品数量"
              prop="product_num"
              min-width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.product_num"
                  class="price_num"
                  @input="moneyNum($event, scope.$index)"
                ></el-input>
              </template>
            </el-table-column>
            <template slot="empty">
              <div class="table_empty">
                <img
                  src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
                />
              </div>
            </template>
          </el-table>

          <div class="btns d-between">
            <div class="price_box">
              合同金额：<span class="price">{{ totalMoney || 0.0 }}</span>元
            </div>

            <div class="form_btns">
              <el-button
                class="com_btn"
                @click="submitForm"
                :loading="createLoading"
                :disabled="createLoading"
              >
                {{ isEdit ? "保存" : "创建" }}
              </el-button>
            </div>
          </div>
        </el-form>
      </div>
    </el-drawer>

    <!-- 客户列表 -->
    <customer-list
      v-if="customerListShow"
      ref="customerRef"
      @confirm="customerConfirm"
      @cancel="customerCancel"
    ></customer-list>

    <!-- 报价列表 -->
    <offer-list
      v-if="offerListShow"
      ref="offerRef"
      @confirm="offerConfirm"
      @cancel="offerCancel"
    >
    </offer-list>
  </div>
</template>

<script>
import customerList from "@/views/transaction_management/offer/component/choose_customer_list.vue";
import offerList from "./offer_list.vue";

import { getData, postData } from "@/api/user";
import store from "@/store";
import { getNowDate } from "@/libs/util";

export default {
  data() {
    return {
      show: true,
      isEdit: false,
      createLoading: false,

      user: {},
      contract_id: "",

      tableData: [],
      customer: {},
      customerListShow: false,

      offer: {},
      offerListShow: false,

      form: {
        no: "",
        name: "",
        customer_name: "",
        customer_company: "",
        sign_user: {}, // 签订人
        sign_time: "",
        remarks: "",
        offer_num: "",
        warranty: ""
      },
      rules: {
        no: {
          required: true,
          message: "请输入合同编号",
          trigger: ["blur", "change"],
        },
        name: {
          required: true,
          message: "请输入合同名称",
          trigger: ["blur", "change"],
        },
        customer_name: {
          required: true,
          message: "请选择客户",
          trigger: ["blur", "change"],
        },
        offer_num: {
          required: true,
          message: "请选择关联报价",
          trigger: ["blur", "change"],
        },
        warranty: {
          required: true,
          message: "请输入质保期限",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  created() {
    this.user = store.state.userInfo;
    this.form.sign_user = store.state.userInfo;

    const { y, m, d } = getNowDate();
    this.form.sign_time = `${y}-${m}-${d}`;
  },
  methods: {
    init({ contract_id, customer }) {
      // console.log("创建合同 >>", contract_id, customer);
      this.contract_id = contract_id;

      this.$nextTick(() => {
        this.resetForm();

        if (customer && customer.name) {
          // console.log(111, customer, customer.name);
          this.customer = customer;
          this.form.customer_name = customer.name;
          this.form.customer_company = customer.company;
        }

        // 编辑  报价id
        if (contract_id) {
          this.isEdit = true;
          // 报价详情 数据回显
          getData({
            url: `/contract/contract_detail`,
            data: {
              id: contract_id,
            },
          }).then((res) => {
            const {
              code,
              data: { list },
            } = res;
            if (code === 200) {
              this.form.no = list.contract_no;
              this.form.name = list.contract_name;
              this.form.sign_time = list.sign_time;
              this.form.remarks = list.remarks;
              this.customer = {
                id: list.customer_id,
                name: list.customer_name,
                company: list.customer_company_name,
                phone: list.phone,
              };
              this.form.customer_name = list.customer_name;
              this.form.customer_company = list.customer_company_name;
              this.sign_user = {
                name: list.sign_user,
              };
              this.tableData = list.contract_product;
              this.offer = list.offer_record;
              this.form.offer_num = list.offer_record.offer_num;
            }
          });
        }
      });
    },

    // 选择报价 选择报价 选择报价 选择报价 选择报价 选择报价 选择报价
    chooseOffer() {
      if (!this.customer.id) {
        return this.$warning("请先选择客户");
      }
      this.offerListShow = true;

      this.$nextTick(() => {
        this.$refs.offerRef.init(this.customer.id, this.offer);
      });
    },
    // 选择 确认
    offerConfirm(row) {
      // console.log(row);
      this.offer = row;
      this.form.offer_num = row.offer_num;
      this.tableData = row.offer_product;
    },
    offerCancel() {
      this.offerListShow = false;
    },
    // 选择报价 选择报价 选择报价 选择报价 选择报价 选择报价 选择报价

    // 选择客户 选择客户 选择客户 选择客户 选择客户 选择客户
    chooseCustomer() {
      // 编辑不能更换
      if (this.isEdit) return;

      this.customerListShow = true;
      this.$nextTick(() => {
        this.$refs.customerRef.init(this.customer);
      });
    },
    // 选择客户  确认
    customerConfirm(row) {
      // console.log(row);
      this.customer = row;
      this.form.customer_name = row.name;
      this.form.customer_company = row.company;
      this.offer = {};
      this.form.offer_num = "";
      this.tableData = [];
    },
    customerCancel() {
      this.customerListShow = false;
    },
    // 选择客户 选择客户 选择客户 选择客户 选择客户 选择客户

    moneyNum(e, i) {
      e = e.replace(/[^\d]/g, "");

      //重新赋值给input
      this.$nextTick(() => {
        this.tableData[i].product_num = Number(e);
      });
    },

    submitForm() {
      this.$refs["contractForm"].validate((valid) => {
        if (valid) {
          let flag = false;
          let arr = this.tableData;
          if (arr.length > 0) {
            arr.map((e) => {
              if (!e.product_num) {
                flag = true;
                this.$warning("产品数量不能为0");
              }
            });
          }
          if (flag) return;

          this.createLoading = !this.createLoading;

          // console.log(this.contract_id);
          let info = this.form;
          let url = this.isEdit ? "/contract/update" : "/contract";
          postData({
            url,
            data: {
              id: this.contract_id,
              contract_no: info.no,
              contract_name: info.name,
              warranty: info.warranty,
              offer_record_id: this.offer.id,
              offer_product: this.tableData,
              sign_time: info.sign_time,
              money: this.totalMoney,
              customer_id: this.customer.id,
              customer_name: this.customer.name,
              customer_company_name: this.customer.company,
              phone: this.customer.phone,
              remarks: info.remarks,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg, id },
              } = res;
              if (code === 200) {
                this.cancel(true, id);
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

    cancel(update_list, contract_id) {
      // console.log("update_list", update_list, contract_id);

      this.$emit("cancel", { update_list, contract_id });
      this.resetForm();
    },
    resetForm() {
      this.$refs["contractForm"].resetFields();
    },
  },
  computed: {
    totalMoney() {
      let arr = this.tableData || [];
      let num = 0;
      if (arr && arr.length > 0) {
        arr.map((e) => {
          num += e.product_num * e.product_price;
        });
      }
      return num;
    },
  },
  components: {
    customerList,
    offerList,
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

.el-form-item {
  margin-right: 20px;
}

.detail_main {
  padding-left: 24px;
}

.add_pro {
  width: 88px;
  height: 34px !important;
  font-size: 12px !important;
}

.el-textarea {
  width: 502px;
  height: 52px;
}

.price_num {
  padding: 0 !important;
  width: 70px !important;

  /deep/.el-input__inner {
    padding: 0;
    text-align: center;
  }
}

.price_box {
  font-size: 12px;
  font-weight: 400;
  color: #657180;

  .price {
    font-size: 16px;
    font-weight: 600;
    color: #ffa629;
  }
}

.btns {
  position: absolute;
  left: 0;
  bottom: 0;
  padding: 19px 48px;
  width: 100%;
  box-shadow: 0px -3px 6px rgba(0, 0, 0, 0.05);
  background-color: #fff;

  .form_btns {
    margin-top: 0;
  }
}

/deep/.el-drawer__body {
  padding-bottom: 200px;
}
/deep/.el-form-item__error {
  top: 86% !important;
}
/deep/.el-form-item__content {
  line-height: 25px !important;
}
</style>