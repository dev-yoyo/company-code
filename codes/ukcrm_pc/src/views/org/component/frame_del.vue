<template>
  <div class="move">
    <el-dialog
      class="modal_join"
      title="提示"
      width="533px"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose">

      <span>是否删除部门“{{name}}”？</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delData } from "@/api/user";

export default {
  name: "move",
  data() {
    return {
      visible: false,
      createLoading: false,
      id:'',
      name:'',
    };
  },
  methods: {
    // ----------------提交----------------
    confirm() {
      this.createLoading = !this.createLoading;
      delData({
        url: `/department/${this.id}`,
        data: {}
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.handleClose()
        } else {
          this.$err(msg);
          this.createLoading = false;
        }
      })
    },

    handleOpen(v) {
      this.id = v.id || 0
      this.name = v.name || '',
      this.visible = true
    },

    handleClose() {
      this.visible = false
      this.$emit('cancel')
    }
  },
};
</script>

<style lang="less">
.move {

  .grey{
    background: #f7f7f7;
    padding: 23px 67px;
    margin-bottom: 20px;
  }

  .tip {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #333333;
    .iconfont {
      color:#FF9025;
      margin-right: 5px;
    }
  }
}
</style>s