<template>
  <div class="">
    <el-dialog
      :visible.sync="dialogShow"
      width="533px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      class="dialog_box"
    >
      <div class="">
        <div class="dialog_title d-between">
          <div class="title">放弃跟进</div>
          <i class="iconfont icon-ykbx" @click="hideDialog()"></i>
        </div>

        <div class="dialog_content">
          <div class="item">
            <div class="tit">现有负责人</div>
            <div>
              <el-input
                placeholder="请输入"
                v-model="personCustomer"
                readonly
                disabled
              >
              </el-input>
            </div>
          </div>

          <div class="item">
            <div class="tit">放弃原因：</div>
            <div>
              <el-input type="textarea" v-model="visitContent"></el-input>
            </div>
          </div>
        </div>

        <div class="dialog_footer d-flex">
          <el-button class="btn_item cancel" @click="hideDialog()">
            取 消
          </el-button>
          <el-button
            class="btn_item"
            type="primary"
            @click="submitMove"
            :loading="createLoading"
            :disabled="createLoading"
          >
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { postData } from "@/api/user";
import store from "@/store";

export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: false,
    },
    activeCustomer: {
      // 要移交的客户
      type: Object,
      default: () => {
        return {};
      },
    },
    personCustomer: {
      // 客户 负责人
      type: String,
      default: store.state.userInfo.name,
    },
  },
  data() {
    return {
      activeMember: {}, // 选中移交成员
      createLoading: false,

      visitContent: "",
    };
  },
  created() {
    this.user = store.state.userInfo;
  },
  methods: {
    // 确定 放弃
    submitMove() {
      // console.log(this.activeCustomer, this.visitContent);
      this.createLoading = true;
      postData({
        url: "/customer/give_up_customer",
        data: {
          customer_id: this.activeCustomer.id,
          visit_content: this.visitContent,
        },
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.hideDialog(true);
        } else if (code === 422) {
          this.$err(msg);
          this.createLoading = false;
        }
      });
    },

    hideDialog(update = false) {
      this.createLoading = false;
      this.$emit("hideDialog", update);

      this.activeMember = {};
      this.visitContent = "";
    },
  },
};
</script>

<style lang="less" scoped>
</style>