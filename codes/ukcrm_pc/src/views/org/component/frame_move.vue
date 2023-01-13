<template>
  <div class="move">
    <el-dialog
      class="modal_join"
      title="移交权限"
      width="533px"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose">

      <div class="grey d-between">
        <p>员工名称：<span>{{name}}</span></p>
        <p>员工角色：<span>{{role}}</span></p>
      </div>
      <div class="tip"><i class="iconfont icon-ykb-zy"></i>移交后该成员将成为企业管理员，你的角色将变为子管理员是否移交管理员权限</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getData,postData } from "@/api/user";

export default {
  name: "move",
  data() {
    return {
      visible: false,
      createLoading: false,
      user_id:'',
      name:'',
      role:''
    };
  },
  methods: {
    // ----------------提交----------------
    confirm() {
      this.createLoading = !this.createLoading;
      postData({
        url: "/user/transfer_admin_jurisdiction ",
        data: {
          user_id: this.user_id,
        }
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.handleClose()
        } else if (code === 422) {
            this.createLoading = false;
            this.$err(msg);
        }else {
          this.createLoading = false;
        }
      })
    },

    handleOpen(id,name,role) {
      this.user_id = id || 0
      this.name = name || '',
      this.role = role || ''
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