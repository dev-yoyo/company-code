<template>
  <div class="cate_del">
    <el-dialog
      class="modal_join"
      title="提示"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose">
      <span>{{content}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getData,postData,delData } from "@/api/user";

export default {
  name: "cate_del",
  data() {
    return {
      id: 0,
      name: '',
      visible: false,
      createLoading: false,
      content:'',
      bol: true,
    };
  },
  methods: {
    confirm() {
      if(this.bol) {
        this.createLoading = !this.createLoading;
        delData({
          url: `/classify/${this.id}`,
          data: {}
        }).then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            setTimeout(()=>{
              this.handleClose()
            },1500)
            this.bol = true
          } else {
            this.createLoading = false;
            this.bol = false
            this.content = msg
            this.visible = true
          }
        });
      }else {
        this.handleClose()
      }
    },

    handleOpen(id,name) {
      this.id = id || 0
      this.content = `是否确认删除当前分类“${name}”？`
      
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
.cate_del {
  .label {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #464C5B;
    margin-bottom: 12px;
  }

  .demo-form {
    .el-input {
      height: 38px!important;
      width: 250px!important;
      line-height: 38px!important;
    }
  }

  .tag {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #FF9025;
    padding: 2px 6px;
    background:#FFEFDE;
    margin-left: 10px;
  }
}
</style>s