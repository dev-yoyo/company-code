<template>
  <div class="add_detail">
    <el-drawer
      :visible="show"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="1054px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">{{ isEdit ? "编辑报价" : "新建报价" }}</div>
      <div class="close_icon d-center" @click="cancel()">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div class="detail_main">
        <div class="tips d-align-center">
          <i class="el-message__icon el-icon-warning"></i>
          审核通过/无需审核的报价单，有效期为7天；报价单失效后，无法进行关联合同
        </div>

        <el-form
          :model="info"
          ref="offerForm"
          label-width="70px"
          class="demo-form"
        >
          <div class="form_tit">基础信息</div>

          <div class="d-align-center">
            <el-form-item label="关联客户">
              <div @click="chooseCustomer()">
                <el-input
                  v-model="customer.name"
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

            <el-form-item label="关联企业">
              <el-input v-model="customer.company" disabled></el-input>
            </el-form-item>
          </div>

          <div class="d-align-center">
            <el-form-item label="报价日期">
              <el-date-picker
                v-model="form.offer_time"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions1"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="报价人">
              <el-input v-model="form.offer_user.name" disabled></el-input>
            </el-form-item>
          </div>

          <div class="d-between">
            <div class="form_tit">产品信息</div>
            <el-dropdown
              trigger="hover"
              placement="bottom"
              class="edit"
              @command="productCommand"
            >
              <el-button class="com_btn add_pro" icon="el-icon-plus">
                添加产品
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="addProduct">产品库</el-dropdown-item>
                <el-dropdown-item command="otherProduct"
                  >其他产品</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </div>

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
            :border="show"
          >
            <el-table-column
              label="序号"
              type="index"
              min-width="72"
              align="center"
            >
            </el-table-column>

            <el-table-column label="产品名称" min-width="250" align="left">
              <template slot-scope="scope">
                <div class="d-center">
                  <el-input
                    v-model="scope.row.product_name"
                    placeholder="请输入"
                    :disabled="scope.row.product.type === 1"
                  ></el-input>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="类别" min-width="72" align="center">
              <template slot-scope="scope">
                <div class="com-line-1">
                  <span v-if="scope.row.product.s_classify">
                    {{ scope.row.product.s_classify.name }}
                  </span>
                  <span v-else-if="scope.row.product.f_classify">
                    {{ scope.row.product.f_classify.name }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="指导报价"
              prop="offer_product.length"
              min-width="260"
              align="center"
            >
              <template slot-scope="scope">
                <div class="guide_price">
                  <div
                    class="price_box"
                    v-if="scope.row.product.price.length > 0"
                  >
                    <div
                      class="item d-flex"
                      v-for="v in scope.row.product.price"
                      :key="v.num"
                    >
                      <div class="txt">≥{{ v.num }}个</div>
                      <div class="txt">{{ v.price }}元</div>
                    </div>
                  </div>

                  <div class="no_price" v-else></div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="预购数量"
              prop="product_num"
              min-width="100"
              align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.product_num"
                  class="price_ipt"
                  @input="moneyNum($event, scope.$index)"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column
              label="产品单价(元)"
              prop="product_price"
              min-width="110"
              sortable
              align="center"
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.product_price"
                  class="price_ipt price_num"
                  @input="moneyIpt($event, scope.$index)"
                ></el-input>
              </template>
            </el-table-column>

            <el-table-column
              label="操作"
              prop="product_price"
              min-width="110"
              align="center"
            >
              <template slot-scope="scope">
                <div
                  class="customer_name"
                  @click="delProduct(scope.$index, scope.row)"
                >
                  删除
                </div>
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

          <div class="form_tit">其他</div>
          <el-form-item label="备注" class="remarks_item">
            <el-input
              type="textarea"
              v-model="form.remarks"
              placeholder="请输入内容(内容限制在150个字以内)"
              maxlength="150"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="是否需要审批"
            class="need_examine"
            v-if="user.role_id > 2 || user.role_id == 0"
          >
            <el-switch
              v-model="form.check"
              active-color="#4D6FFF"
              inactive-color="#D7DCE6"
            >
            </el-switch>
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

    <!-- 客户列表 -->
    <customer-list
      v-if="customerListShow"
      ref="listRef"
      @confirm="customerConfirm"
      @cancel="customerCancel"
    ></customer-list>

    <!-- 产品列表 -->
    <product-list
      v-if="productListShow"
      ref="productRef"
      @confirm="productConfirm"
      @cancel="productCancel"
    >
    </product-list>
  </div>
</template>

<script>
import customerList from "./choose_customer_list.vue";
import productList from "@/views/product/component/product_list.vue";

import { getData, postData } from "@/api/user";
import store from "@/store";
import { getNowDate } from "@/libs/util";

export default {
  data() {
    return {
      show: true,
      isEdit: false,
      createLoading: false,

      customerListShow: false, // 选择客户
      user: {},
      offer_id: "",

      productListShow: false,

      info: {},
      tableData: [],
      customer: {},

      form: {
        offer_user: {},
        offer_time: "",

        remarks: "",
        check: true,
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      // rules: {
      //   contract_name: {
      //     required: true,
      //     message: "请选择关联合同",
      //     trigger: ["blur", "change"],
      //   },
      // },
    };
  },
  created() {
    this.user = store.state.userInfo;
    this.form.offer_user = store.state.userInfo;

    const { y, m, d } = getNowDate();
    this.form.offer_time = `${y}-${m}-${d}`;
  },
  methods: {
    init({ offer_id, type, offer_record_id, customer }) {
      // console.log("创建报价 >>", offer_id, type, offer_record_id, customer);

      this.offer_id = offer_id;
      if (customer) {
        this.customer = customer;
      }

      this.$nextTick(() => {
        this.resetForm();
        // 编辑  报价id
        if (offer_id) {
          this.isEdit = true;
          // 报价详情 数据回显
          getData({
            url: `/offer/offer_record_detail/${offer_id}`,
            data: {
              id: offer_id,
            },
          }).then((res) => {
            const {
              code,
              data: { data },
            } = res;
            if (code === 200) {
              // console.log("detail >>>", data.offer_product);
              this.customer = data.customer;
              this.tableData = data.offer_product;

              this.form.offer_time = data.offer_time;
              this.form.check = data.status == 1 ? true : false;
              this.form.remarks = data.remarks;
            }
          });
        }

        // 引用
        if (type == "quote") {
          getData({
            url: "/offer/quote_offer_record",
            data: {
              offer_record_id: offer_record_id,
            },
          }).then((res) => {
            const {
              code,
              data: { offer_record_procuct },
            } = res;
            if (code === 200) {
              this.tableData = offer_record_procuct;
            }
          });
        }
      });
    },

    // 选择客户 选择客户 选择客户 选择客户 选择客户 选择客户
    chooseCustomer() {
      // 编辑不能更换
      if (this.isEdit) return;

      this.customerListShow = true;
      this.$nextTick(() => {
        this.$refs.listRef.init(this.customer);
      });
    },
    // 选择客户  确认
    customerConfirm(row) {
      // console.log("选择客户  确认 >>", row);
      this.customer = row;
    },
    customerCancel() {
      this.customerListShow = false;
    },
    // 选择客户 选择客户 选择客户 选择客户 选择客户 选择客户
    productCommand(command) {
      switch (command) {
        case "addProduct":
          this.addProduct();
          break;
        case "otherProduct":
          this.otherProduct();
          break;
      }
    },

    // 添加产品 添加产品 添加产品 添加产品
    addProduct() {
      this.productListShow = true;
      // console.log(this.tableData, this.tableData.length);

      this.$nextTick(() => {
        this.$refs.productRef.init(this.tableData);
      });
    },

    // 其他产品
    otherProduct() {
      getData({
        url: "/product/other_product",
      }).then((res) => {
        const {
          code,
          data: { product },
        } = res;
        if (code === 200) {
          // console.log("detail >>>", data.offer_product);
          this.tableData.push({
            product: product,
            product_name: product.name,
            product_num: 0,
            product_price: 0,
          });
        }
      });
    },

    // 选择产品 确认
    productConfirm(row) {
      // console.log("选择产品  确认 >>", row);
      let product = this.tableData;

      // console.log(product.length);
      let arr = [];
      if (product.length > 0) {
        product.map((e) => {
          arr.push(e.product.id);
        });
      }

      // console.log("arr", arr);
      if (row.length <= 0) return;
      row.map((v) => {
        if (arr.includes(v.id)) return;

        product.push({
          product: v,
          product_name: v.name,
          product_num: 0,
          product_price: 0,
        });
      });

      this.tableData = product;
    },
    productCancel() {
      this.productListShow = false;
    },
    delProduct(i, row) {
      // console.log(i, row);
      // if (this.tableData.length <= 1) return;

      this.tableData.splice(i, 1);
    },
    // 添加产品 添加产品 添加产品 添加产品

    moneyNum(e, i) {
      e = e.replace(/[^\d]/g, "");

      //重新赋值给input
      this.$nextTick(() => {
        this.tableData[i].product_num = Number(e);
      });
    },
    moneyIpt(e, i) {
      e = e.match(/\d+\.?\d{0,5}/) ? e.match(/\d+\.?\d{0,5}/)[0] : "";
      // console.log("tableData >>", e - 0);

      //重新赋值给input
      this.$nextTick(() => {
        this.tableData[i].product_price = e;
      });
    },

    submitForm() {
      // console.log(this.customer);
      if (!this.customer.id) {
        return this.$warning("请选择关联客户");
      }
      if (this.tableData.length <= 0) {
        return this.$warning("请添加产品");
      }

      this.$refs["offerForm"].validate((valid) => {
        if (valid) {
          let flag = false;
          let productName = false;
          let producNametOnly = false;
          let proArr = [];
          this.tableData.map((e) => {
            if (!e.product_num || !e.product_price) {
              flag = true;
            }

            if (e.product_name == "") {
              productName = true;
            }
            if (
              this.tableData.some(
                (citem) => citem !== e && citem.product_name === e.product_name
              )
            ) {
              producNametOnly = true;
            }

            proArr.push({
              product_id: e.product.id,
              product_name: e.product_name,
              product_price: e.product_price,
              product_num: e.product_num,
            });
          });

          if (productName) {
            this.$warning("产品名称不能为空");
            return;
          }

          if (producNametOnly) {
            this.$warning("产品名称不能重复");
            return;
          }

          if (flag) {
            this.$warning("预购数量，产品单价不能为0");
            return;
          }

          this.createLoading = !this.createLoading;
          let info = this.form;
          let url = this.isEdit ? "/offer/update" : "/offer/store";
          postData({
            url,
            data: {
              off_record_id: this.offer_id,
              customer_id: this.customer.id,
              offer_time: info.offer_time,
              status: this.user.role_id > 2 && this.form.check ? 1 : 0,
              remarks: info.remarks,
              product: proArr,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg, id },
              } = res;
              if (code === 200) {
                this.$success(msg);
                this.cancel(true, this.isEdit ? this.offer_id : id);
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

    cancel(update_list, offer_id) {
      // console.log("update_list", update_list, offer_id);

      this.$emit("cancel", { update_list, offer_id });
      this.resetForm();
    },
    resetForm() {
      this.$refs["offerForm"].resetFields();
    },
  },
  components: {
    customerList,
    productList,
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

  .tips {
    margin-bottom: 30px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #9ea7b4;

    i {
      margin-right: 7px;
      color: #ff9025;
      font-size: 18px;
    }
  }
}

.add_pro {
  width: 88px;
  height: 34px !important;
  font-size: 12px !important;
  &:hover {
    background: #849bfd !important;
  }
}

.guide_price {
  padding: 22px 24px;

  .price_box {
    border-left: 1px solid #d7dce6;

    .item {
      .txt {
        padding-left: 12px;
        width: 109px;
        height: 27px;
        line-height: 27px;
        font-size: 12px;
        font-weight: 400;
        color: #657180;
        text-align: left;

        border-right: 1px solid #d7dce6;
        border-top: 1px solid #d7dce6;
        border-bottom: 1px solid #d7dce6;
      }
    }
  }

  .no_price {
    margin: 12px auto;
    width: 24px;
    border: 1px solid #d1d7e2;
  }
}

.remarks_item {
  /deep/ .el-textarea {
    width: 502px;
    height: auto;
  }
  /deep/ .el-textarea__inner {
    width: 502px;
    height: auto;
  }
}
.need_examine {
  /deep/.el-form-item__label {
    text-align: center !important;
    width: 100px !important;
  }
}

.el-textarea {
  width: 502px;
  height: 52px;
}

.price_ipt {
  padding: 0 !important;
  width: 50px !important;

  /deep/.el-input__inner {
    padding: 0;
    text-align: center;
  }
}
.price_num {
  width: 70px !important;
}

/deep/.el-table {
  .cell {
    overflow: initial;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>