<template>
  <div class="visit">
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="370px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">添加员工</div>
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
        <el-form-item label="员工手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入员工手机号"
          ></el-input>
        </el-form-item>

        <el-form-item label="员工姓名" prop="name">
          <el-input
            v-model="form.name"
            placeholder="请输入员工姓名"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item label="员工角色" prop="role_id">
          <el-select v-model="form.role_id" placeholder="请选择">
            <el-option
              v-for="item in role_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="员工部门"
          prop="department_id"
          v-if="form.role_id !== 2"
        >
          <el-select v-model="form.department_id" placeholder="请选择">
            <el-option
              v-for="item in department_list"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <div class="btns">
            <el-button
              class="com_btn cancel_btn"
              @click="cancel"
              :disabled="createLoading"
            >
              取消
            </el-button>

            <el-button
              class="com_btn"
              @click="submitForm"
              :loading="createLoading"
              :disabled="createLoading"
            >
              邀请
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
import { getData, postData, delData } from "@/api/user";
import store from "@/store";
import { oss } from "@/api/oss_upload";

export default {
  data() {
    let checkname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("员工名称不能为空"));
      } else {
        callback();
      }
    };

    let isCellPhone = (val) => {
      if (!/^1[3456789]\d{9}$/.test(val)) {
        return false;
      } else {
        return true;
      }
    };

    let checkphone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("手机号码不能为空"));
      } else if (!isCellPhone(value)) {
        callback(new Error("手机号码格式不正确"));
      } else {
        callback();
        this.get_name();
      }
    };

    let checkrole = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("角色不能为空"));
      } else {
        callback();
      }
    };

    let checkdepartment = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("部门不能为空"));
      } else {
        callback();
      }
    };

    return {
      drawer: true,
      isEdit: false,
      createLoading: false,
      form: {
        phone: "",
        name: "",
        role_id: "",
        department_id: "",
      },
      rules: {
        phone: [
          {
            validator: checkphone,
            trigger: ["blur"],
          },
        ],
        name: [
          {
            validator: checkname,
            trigger: ["blur", "change"],
          },
        ],
        role_id: [
          {
            validator: checkrole,
            trigger: ["blur", "change"],
          },
        ],
        department_id: [
          {
            validator: checkdepartment,
            trigger: ["blur", "change"],
          },
        ],
      },
      department_list: [],
      role_list: [
        { id: 2, name: "子管理员" },
        { id: 3, name: "主管" },
        { id: 4, name: "销售" },
      ],
    };
  },
  created() {
    this.department();
  },
  methods: {
    init(id) {
      this.id = id || 0;
    },

    // ----------------部门----------------
    department() {
      getData({
        url: "/department/list ",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { department_list, msg },
        } = res;
        if (code === 200) {
          this.department_list = department_list;
        } else {
          this.department_list = [];
          this.$err(msg);
        }
      });
    },

    get_name() {
      getData({
        url: "/company/matching_name",
        data: {
          phone: this.form.phone,
        },
      }).then((res) => {
        const {
          code,
          data: { name, msg },
        } = res;
        if (code === 200) {
          this.form.name = name;
        } else {
          this.form.name = "";
          this.$err(msg);
        }
      });
    },

    // ----------------提交----------------
    submitForm() {
      this.$refs["customerForm"].validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url: "company/invitation_join_company",
            data: {
              name: this.form.name,
              phone: this.form.phone,
              department_id: this.form.department_id,
              role_id: this.form.role_id,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg, name, phone, department_id, role_id },
              } = res;
              if (code === 200) {
                this.$emit("cancel", true);
                this.$success(msg);
              } else if (code === 422) {
                if (name) {
                  this.$err(name[0]);
                } else if (phone) {
                  this.$err(phone[0]);
                } else if (department_id) {
                  this.$err(department_id[0]);
                } else if (role_id) {
                  this.$err(role_id[0]);
                } else {
                  this.$err(msg);
                }

                this.createLoading = false;
              }
            })
            .catch(() => {
              this.createLoading = false;
            });
        }
      });
    },

    // ----------------其他----------------
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

  /deep/.btns {
    margin-top: 40px;
    .el-button {
      width: 100%;
      margin: 0 0 16px 0;
    }
  }

  .btn_box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .btn_add {
    width: 280px;
    height: 42px;
    background: #f7f7f7;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #3399ff;
    cursor: pointer;
    margin-top: 10px;
  }

  .del {
    margin-left: 5px;
    color: #d7dce6;
    cursor: pointer;
  }
}
</style>
