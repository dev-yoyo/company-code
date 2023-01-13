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
      <div class="title">{{ isEdit ? "编辑部门" : "创建部门" }}</div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <el-form
        :model="form"
        ref="customerForm"
        label-width="80px"
        class="demo-form"
      >
        <el-form-item
          v-if="isEdit"
          :label="'部门名称'"
          prop="name"
          :rules="{
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur',
          }"
        >
          <el-input v-model="form.name" placeholder="请输入"></el-input>
        </el-form-item>

        <el-form-item
          v-else
          v-for="(item, index) in form.name_list"
          :label="'部门名称'"
          :key="item.key"
          :prop="'name_list.' + index + '.name'"
          :rules="{
            required: true,
            message: '部门名称不能为空',
            trigger: 'blur',
          }"
        >
          <div class="d-flex">
            <el-input v-model="item.name" placeholder="请输入"></el-input>
            <i
              class="iconfont icon-sc234 del"
              @click="del(index)"
              v-if="form.name_list.length > 1"
            ></i>
          </div>
        </el-form-item>

        <div class="btn_box" v-if="!isEdit">
          <div class="btn_add d-center" @click="add()">
            <i class="iconfont icon-ykb-tj"></i> 添加
          </div>
        </div>

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
              确认
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
    return {
      drawer: true,
      isEdit: false,
      createLoading: false,
      form: {
        name_list: [
          {
            name: "",
          },
        ],
        name: "",
        id: "",
      },
    };
  },
  created() {},
  methods: {
    init(v) {
      this.form.id = v.id || 0;
      this.form.name = v.name || "";
      this.isEdit = this.form.id;
      this.$nextTick(() => {
        this.resetForm();
      });
    },

    add() {
      this.form.name_list.push({
        name: "",
        key: Date.now(),
      });
    },

    del(k) {
      this.form.name_list.splice(k, 1);
    },

    // ----------------提交----------------
    submitForm() {
      this.$refs["customerForm"].validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;

          let arr = [];
          if (this.form.name_list.length > 0) {
            this.form.name_list.forEach((v, k) => {
              if (v.name) {
                arr.push(v.name);
              }
            });
          }

          let param = {};
          if (this.isEdit) {
            param = {
              department_name: this.form.name,
              id: this.form.id,
            };
          } else {
            param = {
              department_names: arr,
            };
          }
          postData({
            url: this.isEdit ? "/department/update" : "/department",
            data: param,
          })
            .then((res) => {
              const {
                code,
                data: { msg },
              } = res;
              if (code === 200) {
                this.cancel();
                this.$success(msg);
              } else if (code === 422) {
                this.createLoading = false;
                this.$err(msg);
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

    // ----------------其他----------------
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
      width: 182px;
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
    .iconfont {
      font-size: 14px;
      margin-right: 5px;
    }
  }

  .del {
    margin-left: 5px;
    color: #d7dce6;
    cursor: pointer;
  }
}
</style>
