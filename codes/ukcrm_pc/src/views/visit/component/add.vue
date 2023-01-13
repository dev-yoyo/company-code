<template>
  <div class="visit">
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="667px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">拜访计划</div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <el-form
        :model="form"
        ref="customerForm"
        :rules="rules"
        label-width="80px"
        class="demo-form"
      >
        <el-form-item label="拜访时间" required prop="visit_time">
          <el-date-picker
            v-model="form.visit_time"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="客户名称" required prop="customer_name">
          <div @click="chooseCustomer()">
            <el-input
              v-model="form.customer_name"
              placeholder="请选择"
              readonly
              :disabled="customer_disable"
            >
              <i slot="suffix" class="el-input__icon el-icon-caret-bottom"></i>
            </el-input>
          </div>
        </el-form-item>

        <el-form-item label="拜访目的" required prop="visit_type">
          <el-select
            v-model="form.visit_type"
            placeholder="请选择"
            @change="change_type"
          >
            <el-option
              v-for="(item, i) in type_list"
              :key="item"
              :label="item"
              :value="i"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remarks">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入内容(内容限制在150个字以内)"
            v-model="form.remarks"
            maxlength="150"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <div class="form_btns">
            <el-button
              class="com_btn cancel_btn"
              @click="del"
              :disabled="createLoading"
              v-if="isEdit"
            >
              删除
            </el-button>
            <el-button
              class="com_btn cancel_btn"
              @click="cancel"
              :disabled="createLoading"
              v-else
            >
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
    <el-dialog
      class="modal_join"
      title="删除"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <span>确定删除当前拜访计划吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false" :disabled="createLoading"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="confirm"
          :loading="createLoading"
          :disabled="createLoading"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 客户列表 -->
    <customer-list
      v-if="customerListShow"
      ref="listRef"
      @confirm="customerConfirm"
      @cancel="customerCancel"
    ></customer-list>
  </div>
</template>

<script>
import customerList from "@/views/transaction_management/offer/component/choose_customer_list.vue";
import { getData, postData, delData } from "@/api/user";
import store from "@/store";

export default {
  props: {
    activeCustomer: {
      // 客户
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    let checkname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("备注不能为空"));
      } else if (value && value.length > 500) {
        callback(new Error("备注限制500个字符"));
      } else {
        callback();
      }
    };

    return {
      drawer: true,
      isEdit: false,
      createLoading: false,
      customerListShow: false, // 选择客户
      customer_disable: false,
      user: {},
      customer: {},
      form: {
        id: "",
        customer_name: "", //
        visit_time: "",
        visit_type: "",
        visit_type_name: "",
        remarks: "",
      },
      rules: {
        visit_time: [
          {
            required: true,
            message: "请选择拜访时间",
            trigger: ["blur", "change"],
          },
        ],
        customer_name: [
          {
            required: true,
            message: "请选择客户",
            trigger: ["blur", "change"],
          },
        ],
        visit_type: [
          {
            required: true,
            message: "请选择拜访目的",
            trigger: ["blur", "change"],
          },
        ],
        // remarks: [
        //   {
        //     validator: checkname,
        //     trigger: ["blur", "change"],
        //   },
        // ],
      },
      type_list: [],
      visible: false,
      id: "",
    };
  },
  created() {
    // console.log("active", this.activeCustomer);
    if (this.activeCustomer) {
      this.form.customer_name = this.activeCustomer.name;
      this.customer_disable = Boolean(this.activeCustomer.name);
      this.customer = {
        id: this.activeCustomer.id,
        name: this.activeCustomer.name,
      };
    }

    this.get_type();
  },
  methods: {
    init(id, customer) {
      this.id = id || 0;

      this.$nextTick(() => {
        this.resetForm();

        //   if (customer) {
        //   this.customer = customer;
        //   this.form.customer_name = customer.name
        //   // console.log(this.form.customer_name);
        // }
        // 编辑
        if (this.id) {
          this.isEdit = true;
          getData({
            url: `/visit/edit?id=${this.id}`,
            data: {},
          }).then((res) => {
            const {
              code,
              data: { info },
            } = res;
            if (code === 200) {
              // console.log("info=>", info);
              this.form = {
                customer_name: info.customer.name,
                visit_time: info.visit_time,
                visit_type: info.visit_type,
                visit_type_name: this.type_list[info.visit_type],
                remarks: info.remarks,
              };
              this.customer = {
                id: info.customer_id,
                name: info.customer.name,
              };
              this.customer_disable = true;
            }
          });
        }
      });
    },
    // ----------------目的----------------
    get_type() {
      getData({ url: "/visit" }).then((res) => {
        const {
          code,
          data: { visit_type },
        } = res;
        if (code === 200) {
          this.type_list = visit_type;
        }
      });
    },

    change_type(e) {
      this.form.visit_type = e;
      this.form.visit_type_name = this.type_list[e];
    },

    // 选择客户 选择客户 选择客户 选择客户 选择客户 选择客户
    chooseCustomer() {
      if (!this.customer_disable) {
        this.customerListShow = true;
        this.$nextTick(() => {
          this.$refs.listRef.init(this.customer);
        });
      }
    },
    // 选择客户  确认
    customerConfirm(row) {
      this.customer = row;
      this.form.customer_name = row.name;
    },
    customerCancel() {
      this.customerListShow = false;
    },
    // 选择客户 选择客户 选择客户 选择客户 选择客户 选择客户

    // ----------------提交----------------
    submitForm() {
      this.$refs["customerForm"].validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url: this.isEdit ? "/visit/update" : "/visit",
            data: {
              id: this.id,
              customer_id: this.customer.id,
              remarks: this.form.remarks,
              visit_time: this.form.visit_time,
              visit_type: this.form.visit_type,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg, customer_id, remarks, visit_time, visit_type },
              } = res;
              if (code === 200) {
                this.$emit("cancel", true);
                this.$success(msg);
              } else if (code === 422) {
                if (customer_id) {
                  this.$err(customer_id[0]);
                }
                // else if (remarks) {
                //   this.$err(remarks[0]);
                // }
                else if (visit_time) {
                  this.$err(visit_time[0]);
                } else if (visit_type) {
                  this.$err(visit_type[0]);
                } else {
                  this.$err(msg);
                }
                this.createLoading = false;
              } else {
                this.createLoading = false;
              }
            })
            .catch(() => {
              this.createLoading = false;
            });
        }
      });
    },

    confirm() {
      this.createLoading = !this.createLoading;
      delData({
        url: `/visit/${this.id}`,
        data: {},
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.$emit("cancel", true);
        } else if (code === 422) {
          this.createLoading = false;
          this.$err(msg);
        } else {
          this.createLoading = false;
          this.$err(msg);
        }
      });
    },

    // ----------------其他----------------
    del(v) {
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },
    cancel() {
      this.$emit("cancel");
      this.resetForm();
    },
    resetForm() {
      this.$refs["customerForm"].resetFields();
    },
  },
  components: { customerList },
};
</script>

<style lang="less" scoped>
.visit {
  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }
  /deep/.el-input {
    line-height: 32px !important;
    width: 100% !important;
  }

  /deep/.el-select {
    line-height: 32px !important;
    width: 100% !important;
  }
}
</style>

<style lang="less">
.el-time-panel__content::before {
  /*top: 55%!important;*/
  border-top: none !important;
}
</style>
