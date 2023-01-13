<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <left-menu></left-menu>
      <top-nav active_title="个人中心"></top-nav>

      <div class="content_main">
        <div class="basic">
          <div class="title">基本信息</div>
          <el-form
            :model="form"
            ref="customerForm"
            :rules="rules"
            label-width="80px"
            class="demo-form"
          >
            <el-form-item label="头像" prop="avatar">
              <div class="thumbs_box">
                <el-upload
                  ref="lup"
                  action=""
                  list-type="picture"
                  :file-list="fileList"
                  :show-file-list="false"
                  :before-upload="handleBeforeUpload"
                  :http-request="img_upload"
                  accept=".jpg,.jpeg,.png"
                >
                  <div class="nick">{{ form.abbreviation }}</div>
                </el-upload>

                <div
                  class="view_img"
                  v-show="form.avatar"
                  @mouseover="mouseOver"
                  @mouseleave="mouseLeave"
                  @click="upload"
                >
                  <img :src="form.avatar" alt="" />
                  <div class="again_upload" v-show="again_box">重新上传</div>
                </div>
              </div>
            </el-form-item>

            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="手机号">
              <div class="text">{{ form.phone || "暂无" }}</div>
            </el-form-item>

            <el-form-item label="角色">
              <div class="text">
                {{ form.role && form.role.name ? form.role.name : "暂无" }}
              </div>
            </el-form-item>

            <el-form-item label="企业">
              <div class="text">
                {{
                  form.company && form.company.name ? form.company.name : "暂无"
                }}
              </div>
            </el-form-item>

            <el-form-item>
              <div class="btns">
                <el-button
                  class="btn"
                  @click="submitForm"
                  :loading="createLoading"
                  :disabled="createLoading"
                >
                  保存
                </el-button>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { postData, getData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    let checkname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("姓名不能为空"));
      } else if (value && value.length > 4) {
        callback(new Error("姓名限制4个字符"));
      } else {
        callback();
      }
    };

    return {
      createLoading: false,
      form: {
        name: "",
        avatar: "",
      },
      rules: {
        avatar: [
          {
            required: true,
            message: "请上传头像",
            trigger: ["blur", "change"],
          },
        ],
        name: [{ validator: checkname, trigger: ["blur", "change"] }],
      },
      // 上传图片
      uploadHost: "", // 附件上传路径
      fileList: [],
      again_box: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      getData({
        url: "/user",
      }).then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.form = user;
          this.$store.commit("setUserInfo", user);
        }
      });
    },
    // ----------------图片----------------
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$err("上传图片大小不能超过 1MB!");
        return false;
      }
    },
    img_upload(e) {
      const formData = new FormData();
      formData.append("file", e.file);
      formData.append("prefix", "b_admin");

      postData({
        url: "/single",
        data: formData,
      }).then((res) => {
        const {
          code,
          data: { path_url, msg },
        } = res;
        if (code === 200) {
          this.form.avatar = path_url;
          this.$store.commit("setAvatar", this.form.avatar);
        } else if (code === 422) {
            this.$err(msg);
        }
      });
    },
    mouseOver() {
      if (this.form.avatar) {
        this.again_box = true;
      }
    },
    mouseLeave() {
      this.again_box = false;
    },
    upload() {
      this.$refs.lup.clearFiles();
      this.$refs.lup.$children[0].$refs.input.click();
    },

    submitForm() {
      this.$refs["customerForm"].validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url: "/user",
            data: {
              name: this.form.name,
              avatar: this.form.avatar,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg },
              } = res;
              if (code === 200) {
                this.$success(msg);
                this.init()
                this.createLoading = false;
              } else if (code === 422) {
                this.$err(msg);
                this.createLoading = false;
              }else  {
                this.createLoading = false;
              }
            })
            .catch(() => {
              this.createLoading = false;
            });
        } else {
          this.createLoading = false;
          return false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content_main {
  padding: 25px 24px;
  .basic {
    min-height: 85vh;
    padding: 26px 24px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
    border-radius: 18px;
    background: #fff;
  }

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

  /deep/.demo-form {
    .el-input {
      line-height: 32px !important;
      width: 350px !important;
    }
  }

  /deep/.el-form-item {
    margin-bottom: 24px;
  }

  .text {
    width: 350px;
    height: 32px;
    line-height: 32px;
    background: #f7f7f7;
    border: 1px solid #d7dce6;
    border-radius: 4px;
    padding: 0 15px;
    font-size: 12px;
    font-weight: 400;
    color: #9ea7b4;
  }

  .btns {
    margin-top: 34px;
    .btn {
      width: 182px;
      height: 42px !important;
      background: #4d6fff !important;
      border-radius: 8px !important;
      font-size: 14px !important;
      font-weight: 400 !important;
      color: #ffffff !important;
      width: 350px;
    }
  }

  /* 上传图片 */
  .thumbs_box {
    position: relative;
    width: 56px;
    height: 56px;
    text-align: center;
    /*border: 1px dashed #D4DDE5;*/

    i {
      margin-top: 6px;
      font-size: 19px;
      color: #d7dce6;
      display: block;
    }

    .el-upload__text {
      line-height: 1;
    }

    .el-upload-dragger {
      width: 54px !important;
      height: 54px !important;
    }

    .view_img {
      position: absolute;
      top: 0;
      left: 0;
      width: 54px;
      height: 54px;
      background: #ffffff;
      // border: 1px solid #999999;
      border-radius: 4px;
      z-index: 1;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .again_upload {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        line-height: 54px;
        text-align: center;
        font-size: 12px;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.5);
        cursor: pointer;
        z-index: 2;
      }
    }
  }

  .nick {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background: #4d6fff;
    color: #fff;
    line-height: 50px;
    font-size: 16px;
    text-align: center;
  }
}
</style>
