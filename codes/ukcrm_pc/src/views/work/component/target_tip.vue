<template>
  <div class="tip_box">
    <el-dialog
      class="modal_join"
      title="提示"
      width="533px"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose">

      <span>新员工的业绩目标只能从入职当月开始设置，离职以及调岗的员工数据仍展示，但不会计入总计值中</span>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="handleClose()" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { delData } from "@/api/user";

export default {
  name: "tip_box",
  data() {
    return {
      visible: false,
      createLoading: false,
      id:'',
      name:'',
    };
  },
  methods: {
    handleOpen() {
      this.visible = true
    },

    handleClose() {
      this.visible = false
    }
  },
};
</script>

<style lang="less">
.tip_box {

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