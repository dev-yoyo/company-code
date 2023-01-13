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
          <div class="title">批量导入</div>
          <i class="iconfont icon-ykbx" @click="hideDialog()"></i>
        </div>

        <div class="dialog_content">
          <div class="setp_box d-center">
            <div class="s_item d-between">
              <div class="txt d-center">
                <i class="iconfont icon-scwj1"></i>
                上传文件
              </div>

              <i class="iconfont icon-xa"></i>
            </div>

            <div class="s_item d-between">
              <div class="txt d-center">
                <i class="iconfont icon-drsj"></i>
                导入数据
              </div>

              <i class="iconfont icon-xa"></i>
            </div>

            <div class="s_item last">
              <i class="iconfont icon-druwc"></i>
              导入完成
            </div>
          </div>

          <div class="upload_box">
            <div class="tit">请选择需要导入的文件</div>

            <div class="d-between">
              <el-input
                class="show_ipt"
                v-model="file_name"
                readonly
              ></el-input>

              <el-upload
                action=""
                :file-list="fileList"
                :show-file-list="false"
                :before-upload="handleBeforeUpload"
                :http-request="img_upload"
                accept=".xls,.xlsx,.xlsb,.xlsm,.xlst"
              >
                <el-button class="recourse_btn"> 选择文件 </el-button>
              </el-upload>
            </div>
          </div>

          <div class="tips_box d-flex">
            <div class="label">注意事项：</div>
            <div class="r_info">
              <div class="txt">
                请按照数据模版的格式准备要导入的数据，<a
                  :href="`${baseUrl}/customer_template`"
                  >点击下载《客户导入模版》</a
                >
              </div>
              <div class="txt">导入文件请勿超过2MB（约10000条数据）</div>
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
import config from "@/libs/config";
export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      createLoading: false,
      baseUrl: "",
      uploadHost: "", // 附件上传路径

      // 资料
      file_name: "",
      fileList: [],
      file: "",
    };
  },

  created() {
    this.user = store.state.userInfo;
    this.baseUrl =
      process.env.NODE_ENV === "development"
        ? config.baseUrl.dev
        : config.baseUrl.pro;
  },
  methods: {
    handleBeforeUpload(file) {
      // console.log(file);
      this.file = file;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
        return false;
      }
    },
    img_upload(e) {
      // console.log(e.file);
      this.file_name = e.file.name;
      this.file = e.file;
    },

    // 确定 移交
    submitMove() {
      if (!this.file_name) {
        return this.$warning("请选择导入的文件");
      }

      this.createLoading = true;

      const formData = new FormData();
      formData.append("customer", this.file);
      formData.append("prefix", "customer");
      // console.log(formData, this.file);
      postData({
        url: "/customer/import",
        data: formData,
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
        } else {
          this.createLoading = false;
        }
      });
    },

    hideDialog(update = false) {
      this.createLoading = false;
      this.$emit("hideDialog", update);

      this.file_name = "";
      this.fileList = [];
      this.file = "";
    },
  },
};
</script>

<style lang="less" scoped>
.setp_box {
  margin-bottom: 16px;
  padding: 0 30px;
  width: 100%;
  height: 64px;
  background: #f7f7f7;
  border-radius: 4px;

  .s_item {
    margin-right: 40px;
    width: 100%;
    font-size: 13px;
    font-weight: 400;
    color: #464c5b;

    .iconfont {
      margin-right: 7px;
      color: #9ea7b4;
    }
  }
  .last {
    margin-right: 0;
  }
}

.tips_box {
  margin-top: 20px;
  align-items: flex-start;

  .label {
    margin-right: 9px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #333333;
    flex-shrink: 0;
  }

  .r_info {
    .txt {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #9ea7b4;

      a {
        text-decoration: none;
        color: #3399ff;
      }
    }
  }
}

.dialog_footer {
  margin-top: 30px;
}

.upload_box {
  .tit {
    margin-bottom: 8px;
    font-size: 13px;
    font-weight: 400;
    line-height: 18px;
    color: #333333;
  }

  .show_ipt {
    width: 100%;
    height: 38px;
    border-radius: 4px;

    /deep/.el-input__inner {
      height: 100%;
      border: 1px solid #f3f3f3;
      background-color: #f3f3f3;
    }
  }

  .recourse_btn {
    margin-left: 12px;
    width: 112px;
    height: 38px;
    border: 1px solid #458fff;
    border-radius: 3px;

    font-size: 14px;
    font-weight: 400;
    color: #4d6fff;
  }
}
</style>