<template>
  <div class="cate_add">
    <el-dialog
      class="modal_join"
      :title="title"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose">
        <el-form ref="form" class="demo-form" :model="form" :rules="rules" label-width="0">
          <el-form-item prop="name">
            <div class="label">分类名称</div>
            <div class="d-flex">
              <el-input
                v-model="form.name"
                placeholder="请输入分类名称"
                maxlength="15"
              ></el-input>
              <div class="tag">最大限制15个字符</div>
            </div>
          </el-form-item>
        </el-form>
      

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose()" :disabled="createLoading">取 消</el-button>
        <el-button type="primary" @click="confirm" :loading="createLoading" :disabled="createLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getData,postData } from "@/api/user";

export default {
  name: "cate_add",
  data() {
    
    let checkname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("分类名称不能为空"));
      } else if (value && value.length > 15) {
        callback(new Error("分类名称限制15个字符"));
      } else {
        callback();
      }
    }

    return {
      visible: false,
      createLoading: false,
      level:1,
      fid: 0,
      id: 0,
      title:'',
      type: 1,// 1 新增 2 重命名

      form: {
        name: "",
      },
      rules:{
        name:[{ validator: checkname, trigger: ['blur','change'] }],
      },
    };
  },
  methods: {
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          if(this.type == 1) {
            postData({
              url: "/classify",
              data: {
                level: this.level,
                fid: this.fid,
                name: this.form.name
              }
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
              } else if (code === 422) {
                this.$err(msg);
                this.createLoading = false;
              }else {
                this.createLoading = false;
              }
            });
        } else {
            postData({
              url: "/classify/update",
              data: {
                classify_id: this.id,
                name: this.form.name
              }
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
              } else if (code === 422) {
                this.$err(msg);
                this.createLoading = false;
              }else {
                this.createLoading = false;
              }
            });

        }
        }else{
          this.createLoading = false;
          return false;
        }
      });
    },

    handleOpen(id) {
      this.fid = id || 0
      this.title = id ?  '添加子分类' :'添加一级分类'
      this.level = id ? 2 : 1
      this.type = 1
      this.visible = true
    },

    handleClose() {
      this.visible = false
      this.$emit('cancel')
    },

    handleName(id,name) {
      this.id = id || 0
      this.form.name = name || ''
      this.title = '重命名'
      this.type = 2
      this.visible = true
    },
  },
};
</script>

<style lang="less">
.cate_add {
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