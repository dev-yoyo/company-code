<template>
  <div class="adjust">
    <el-dialog
      class="modal_join"
      title="调整成员"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
        class="demo-form"
      >
        <el-form-item label="员工角色" prop="role_id">
          <el-select
            v-model="form.role_id"
            placeholder="请选择"
            @change="change"
          >
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
          v-if="form.role_id != 2"
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
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          @click="handleClose()"
          :disabled="createLoading"
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
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getData, postData } from "@/api/user";

export default {
  name: "adjust",
  data() {
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
      visible: false,
      type: true, // true 调整， false 消息调整
      createLoading: false,
      user_id: "",
      form: {
        role_id: "",
        department_id: "",
      },
      rules: {
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
      role_list: [
        { id: 2, name: "子管理员" },
        { id: 3, name: "主管" },
        { id: 4, name: "销售" },
      ],
      department_list: [],
      content_id: "",
    };
  },
  methods: {
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

    change(e) {
      this.form.role_id = e;
    },

    // ----------------提交----------------
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          let url = this.type ? "/company/agree_company" : "/user/adjustment_member"
          postData({
            url,
            data: {
              user_id: this.user_id,
              role_id: this.form.role_id,
              department_id: this.form.department_id,

              status: 1,
              content_id: this.content_id,
            },
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$success(msg);
              this.handleClose();
            } else if (code === 422) {
                this.createLoading = false;
                this.$err(msg);
            }else {
              this.createLoading = false;
            }
          });
        } else {
          this.createLoading = false;
          return false;
        }
      });
    },

    handleOpen(user_id, content_id) {
      this.user_id = user_id || 0;
      this.content_id = content_id;
      this.department();
      this.visible = true;
      this.type = Boolean(content_id)
    },

    handleClose() {
      this.visible = false;
      this.$emit("cancel");
    },
  },
};
</script>

<style lang="less">
.adjust {
  .label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #464c5b;
    margin-bottom: 12px;
  }

  .el-form-item {
    margin-bottom: 24px;
  }

  .get_q_code,
  .el-button.is-disabled.el-button--text {
    width: auto;
    height: 32px;
    background: #4d6fff;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    line-height: 32px;
    color: #ffffff;
    padding: 0 10px;
    margin-left: 17px;
  }

  .demo-form {
    .el-input {
      line-height: 32px !important;
      width: 100% !important;
    }

    .el-select {
      line-height: 32px !important;
      width: 100% !important;
    }
  }
}
</style>s