<template>
  <div class="add_detail">
    <el-drawer
      :visible="addFollowShow"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      :close-on-press-escape="false"
      size="667px"
      class="drawer_box"
      :wrapperClosable="true"
    >
      <div class="title">{{ isEdit ? "编辑跟进" : "创建跟进" }}</div>
      <div class="close_icon d-center" @click="cancel()">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <el-form
        :model="form"
        ref="addFollowForm"
        :rules="rules"
        label-width="80px"
        class="demo-form"
      >
        <div class="form_tit">基础信息</div>

        <el-form-item label="负责人">
          <el-input
            placeholder="请输入"
            v-model="personCustomer"
            readonly
            disabled
          >
          </el-input>
        </el-form-item>

        <el-form-item label="跟进时间" required prop="time">
          <el-date-picker
            v-model="form.time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            :picker-options="datePicker"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="跟进方式" required prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="(v, i) in typeList"
              :key="i"
              :label="v"
              :value="i"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="跟进内容" prop="content">
          <el-input type="textarea" v-model="form.content"></el-input>
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
    </el-drawer>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";
import { getNowDate } from "@/libs/util";

export default {
  props: {
    addFollowShow: {
      type: Boolean,
      default: true,
    },
    personCustomer: {
      // 客户 负责人
      type: String,
      default: store.state.userInfo.name,
    },
  },
  data() {
    return {
      isEdit: false,
      createLoading: false,
      customer_id: "",
      follow_id: "",
      form: {
        time: "", // 今天时间
        type: 0,
        content: "", // 详细地址
      },
      rules: {
        time: [
          { required: true, message: "请选择跟进时间", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择拜访方式", trigger: "change" },
        ],
        content: [
          {
            required: true,
            message: "请输入跟进内容",
            trigger: ["blur", "change"],
          },
        ],
      },
      typeList: ["线上拜访", "线下拜访"],
      // 时间限制
      datePicker: {
        disabledDate(time) {
          //选择今天以及今天之前的日期
          return time.getTime() > Date.now(); //如果没有后面的-8.64e7就是不可以选择今天的
        },
      },
    };
  },
  created() {
    // this.init();
  },
  methods: {
    init({ customer_id, follow_id }) {
      // console.log("follow_info >>", customer_id, follow_id);

      this.customer_id = customer_id;
      this.follow_id = follow_id;
      this.$nextTick(() => {
        this.resetForm();

        // 编辑
        if (follow_id) {
          this.isEdit = true;
          getData({
            url: "/follow/follow_record_detail/" + follow_id,
            data: {},
          }).then((res) => {
            const {
              code,
              data: { data },
            } = res;
            if (code === 200) {
              this.form.time = data.visit_time;
              this.form.type = data.visit_type;
              this.form.content = data.visit_content;
            }
          });
        } else {
          this.isEdit = false;
          const { y, m, d } = getNowDate();
          this.form.time = `${y}-${m}-${d}`;
        }
      });
    },

    submitForm() {
      this.$refs["addFollowForm"].validate((valid) => {
        if (valid) {
          this.createLoading = true;

          let info = this.form;
          let url = `follow/${this.isEdit ? "update" : "store"}`;
          postData({
            url,
            data: {
              customer_id: this.customer_id,
              follow_id: this.follow_id,
              visit_time: info.time,
              visit_type: info.type,
              visit_content: info.content,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg, customer_type, visit_content },
              } = res;
              if (code === 200) {
                this.cancel(true);
                this.$success(msg);
              } else if (code === 422) {
                if (visit_content) {
                  this.$err(visit_content[0]);
                } else if (msg) {
                  this.$err(msg);
                }

                this.createLoading = false;
              }
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

    cancel(flag) {
      this.$emit("cancel", flag);
      this.resetForm();
      this.createLoading = false;
    },
    resetForm() {
      this.$refs["addFollowForm"].resetFields();
    },
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
</style>
