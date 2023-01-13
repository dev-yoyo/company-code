<template>
  <div class="add_detail">
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="667px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
    >
      <div class="title">{{ isEdit ? "编辑产品" : "创建产品" }}</div>
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>
      <div class="kuang">
        <el-form
          :model="form"
          ref="customerForm"
          :rules="rules"
          label-width="80px"
          class="demo-form"
        >
          <div class="form_tit">基础信息</div>

          <div class="d-between">
            <el-form-item label="产品名称" required prop="name">
              <el-input v-model="form.name" placeholder="请输入"></el-input>
            </el-form-item>

            <el-form-item label="产品编号" prop="no">
              <el-input v-model="form.no" placeholder="请输入"></el-input>
            </el-form-item>
          </div>

          <div class="d-between">
            <el-form-item label="产品分类" required prop="cate">
              <el-cascader
                :options="cate_list"
                :props="{ checkStrictly: true }"
                @change="change_cate"
                v-model="form.cate"
                clearable
              >
              </el-cascader>
            </el-form-item>

            <el-form-item label="产品状态" required prop="is_online">
              <el-select v-model="form.is_online" placeholder="请选择">
                <el-option label="上架" value="1"></el-option>
                <el-option label="下架" value="0"></el-option>
              </el-select>
            </el-form-item>
          </div>

          <el-form-item label="基本参数" prop="address">
            <mavon-editor
              ref="md"
              :toolbars="markdownOption"
              :boxShadow="false"
              v-model="form.content"
              @change="markdownChange"
              @imgAdd="imgAdd"
            />
          </el-form-item>

          <el-form-item label="产品图" prop="thumb">
            <div class="thumbs_wrap">
              <div
                class="thumbs_img"
                v-for="(item, index) in form.thumb"
                :key="index"
              >
                <img :src="item" />
                <i
                  class="el-icon-error clear"
                  @click="mouseOver(item, index)"
                ></i>
              </div>
              <div class="thumbs_box" v-if="form.thumb.length < 3">
                <el-upload
                  ref="lup"
                  action=""
                  list-type="picture"
                  :file-list="fileList"
                  :show-file-list="false"
                  :before-upload="handleBeforeUpload"
                  :http-request="img_upload"
                  :limit="3"
                  accept=".jpg,.jpeg,.png"
                >
                  <i class="iconfont icon-xj"></i>
                </el-upload>
              </div>
            </div>
          </el-form-item>

          <!-- <el-form-item label="产品手册" prop="address">
          <div class="about_document d-flex">
            <div
              v-if="form.file_name" class="left_doucment_ipt">
              {{ form.file_name }}

              <i
                class="iconfont icon-ykbx"
                @click="pdf_remove"
                v-if="form.file_name !== ''"
              ></i>
            </div>
            <el-upload
              class="upload_btn"
              :action="uploadHost"
              :data="pdf_uploadData"
              :file-list="pdf_fileList"
              :before-upload="pdf_BeforeUpload"
              :on-success="pdf_success"
              :show-file-list="false"
              accept=".pdf,.ppt,.pptx"
              v-else
            >
              <el-button size="small" class="recourse_btn">
                <i class="iconfont icon-scwj"></i>
                上传文件
              </el-button>
            </el-upload>
          </div>
        </el-form-item> -->

          <div class="form_tit d-between">
            产品报价
            <el-button size="small" class="price_btn" @click="add_price">
              <i class="iconfont icon-ykb-tj"></i>添加
            </el-button>
          </div>
          <div class="d-between" v-for="(v, k) in price_list" :key="k">
            <el-form-item label="数量（个）">
              <el-input
                v-model="v.num"
                placeholder="请输入"
                @input="numIpt($event, k)"
              ></el-input>
            </el-form-item>

            <el-form-item label="单价（元）" prop="from">
              <el-input
                v-model="v.price"
                placeholder="请输入"
                @input="moneyIpt($event, k)"
              ></el-input>
            </el-form-item>

            <i class="iconfont icon-sc234 del_price" @click="del_price(k)"></i>
          </div>

          <el-form-item>
            <div class="form_btns">
              <el-button class="com_btn cancel_btn" @click="cancel">
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
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";
import { getNowDate } from "@/libs/util";
import { oss } from "@/api/oss_upload";

export default {
  data() {
    return {
      drawer: true,
      isEdit: false,
      createLoading: false,
      user: {},
      product_id: "", // 详情 id
      form: {
        id: "",
        name: "",
        no: "",
        cate: "",
        f_classify: "",
        s_classify: "",
        is_online: "1",
        content: "",
        html_content: "",
        thumb: [],
        task_id: "",
        dir: "",
        file_name: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入产品名称",
            trigger: ["blur", "change"],
          },
        ],
        cate: [
          {
            required: true,
            message: "请选择产品分类",
            trigger: ["blur", "change"],
          },
        ],
        thumb: [
          {
            required: true,
            message: "请上传图片",
            trigger: ["blur", "change"],
          },
        ],
      },
      // 分类
      cate_list: [],
      // 富文本
      markdownOption: {
        bold: true, // 粗体
        italic: true, // 斜体
        strikethrough: true, // 中划线
        code: true, // code
        ol: true, // 有序列表
        ul: true, // 无序列表
        imagelink: true, // 图片链接
        trash: true, // 清空
        subfield: true, // 单双栏模式
      },

      // 上传图片
      uploadHost: "", // 附件上传路径
      fileList: [],
      again_box: false,

      // 资料
      pdf_uploadData: {}, // 资料 pdf
      pdf_fileList: [], // 资料 pdf
      pdf_flag: false,

      // 报价
      price_list: [
        {
          num: "",
          price: "",
        },
      ],
    };
  },
  created() {
    this.init();
    this.get_cate();
  },
  methods: {
    init(product_id) {
      this.$nextTick(() => {
        this.resetForm();

        // 编辑
        if (product_id) {
          this.product_id = product_id;
          this.isEdit = true;

          getData({
            url: "/product/edit",
            data: {
              product_id: product_id,
            },
          }).then((res) => {
            const {
              code,
              data: { product },
            } = res;
            if (code === 200) {
              this.form.name = product.name;
              this.form.no = product.product_no;
              this.form.price = product.price;
              this.form.is_online = product.is_online + "";
              this.form.thumb = product.thumb;

              this.form.content = product.content;
              this.form.html_content = product.parameter;
              if (product.file_name) {
                this.form.file_name = product.file_name;
              }
              this.price_list = product.price;

              if (product.f_classify) {
                this.form.f_classify = product.f_classify.id;
                this.form.s_classify = "";
                this.form.cate = [product.f_classify.id];
              }
              if (product.s_classify) {
                this.form.f_classify = product.f_classify.id;
                this.form.s_classify = product.s_classify.id;
                this.form.cate = [product.f_classify.id, product.s_classify.id];
              }
            }
          });
        } else {
          this.user = store.state.userInfo;
          const { y, m, d } = getNowDate();
          this.time = `${y}-${m}-${d}`;
        }
      });
    },

    // ----------------分类----------------
    get_cate() {
      getData({
        url: "/classify",
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          if (list.length > 0) {
            this.cate_list = this.dg(list);
          }
        }
      });
    },

    dg(list) {
      list.forEach((v) => {
        v.value = v.id;
        v.label = v.name;
        if (v.children) {
          this.dg(v.children);
        }
      });
      return list;
    },

    change_cate(e) {
      this.form.f_classify = e[0];
      if (e.length > 1) {
        this.form.s_classify = e[1];
      } else {
        this.form.s_classify = "";
      }
      this.form.cate = e[e.length - 1];
    },

    // ----------------编辑器---------------
    markdownChange(val, render) {
      this.form.content = val;
      this.form.html_content = render;
    },

    imgAdd(pos, file) {
      const formData = new FormData();
      formData.append("file", file);
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
          this.$refs.md.$img2Url(pos, path_url);
        } else if (code === 422) {
          this.$err(msg);
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
          this.form.thumb.push(path_url);
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },
    mouseOver(item, index) {
      this.form.thumb.splice(index, 1);
    },
    upload() {
      this.$refs.lup.clearFiles();
      this.$refs.lup.$children[0].$refs.input.click();
    },

    // ------------pdf 上传 文档转换---------------------
    pdf_BeforeUpload(file) {
      this.pdf_flag = true;
      const isLt2M = file.size / 1024 / 1024 < 50;
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 50MB!");
        this.pdf_flag = false;
        return false;
      }

      const url = "oss_direct/sign_key?dir=project";
      return oss(file.name, url).then((res) => {
        this.uploadHost = res.host;
        this.pdf_uploadData = res;

        this.$notify.info({
          title: "消息",
          message: "文件上传中",
        });
      });
    },
    pdf_success(res, file, fileList) {
      this.pdf_fileList = fileList;
      if (res.code === 200) {
        this.form.file_name = file.name;
        this.pdf_updata_change(res.filename);

        this.$notify({
          title: "成功",
          message: "上传成功",
          type: "success",
        });
      } else {
        this.$warning({
          title: "上传失败",
          desc: "请重新上传",
        });
      }
    },
    pdf_remove() {
      this.pdf_fileList = [];
      this.form.file_name = "";
    },
    pdf_updata_change(file_name) {
      postData({
        url: `/document_type_convert`,
        data: {
          oss_path: file_name,
        },
      })
        .then((res) => {
          let data = res.data;
          const {
            code,
            data: { info },
          } = res;
          if (code === 200) {
            if (info.Status == "Running" || info.Status == "Finished") {
              this.form.task_id = info.TaskId;
              this.form.dir = info.dir;
            } else if (info.Status == "Failed") {
              this.$err({
                title: "转换失败",
                desc: "请重新上传",
              });
              this.form.file_name = "";
            }
          }
          this.pdf_flag = false;
        })
        .catch(() => {
          this.pdf_flag = false;
        });
    },

    // ----------------报价----------------
    moneyIpt(e, i) {
      e = e.match(/\d+\.?\d{0,5}/) ? e.match(/\d+\.?\d{0,5}/)[0] : "";
      this.$nextTick(() => {
        this.price_list[i].price = e;
      });
    },

    numIpt(e, i) {
      e = e.match(/^\d*$/g) ? e.match(/^\d*$/g)[0] : null;
      this.$nextTick(() => {
        this.price_list[i].num = e;
      });
    },

    add_price() {
      this.price_list.push({
        num: "",
        price: "",
      });
    },

    del_price(i) {
      if (this.price_list.length > 1) {
        this.price_list.splice(i, 1);
      }
    },

    // ----------------提交----------------
    submitForm() {
      this.$refs["customerForm"].validate((valid) => {
        if (valid) {
          let arr = this.price_list;
          let proArr = [];
          let flag = true;
          if (arr.length > 0) {
            arr.map((e) => {
              if (!e.num) {
                flag = false;
                // return this.$err("数量不能为空");
              }
              if (!e.price) {
                flag = false;
                // return this.$err("单价不能为空");
              }

              proArr.push({
                num: e.num,
                price: e.price,
              });
            });
          }

          if (!flag) {
            this.$err("数量不能为空");
            return;
          }

          this.createLoading = !this.createLoading;

          let url = this.isEdit ? "/product/update" : "/product/store";
          postData({
            url,
            data: {
              product_id: this.product_id,
              product_no: this.form.no,
              name: this.form.name,
              thumb: this.form.thumb,
              f_classify: this.form.f_classify,
              s_classify: this.form.s_classify,
              content: this.form.content,
              parameter: this.form.html_content,
              price: this.price_list,
              is_online: this.form.is_online,

              file_name: this.form.file_name,
              task_id: this.form.task_id,
              dir: this.form.dir,
            },
          })
            .then((res) => {
              const {
                code,
                data: { msg, name, thumb, price },
              } = res;
              if (code === 200) {
                this.cancel(true);
                this.$success(msg);
              } else if (code === 422) {
                if (name) {
                  this.$err(name[0]);
                } else if (thumb) {
                  this.$err(thumb[0]);
                } else if (price) {
                  this.$err(price[0]);
                } else {
                  this.$err(msg);
                }

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

    // ----------------其他----------------
    cancel(update) {
      let product_id = this.product_id;
      this.$emit("cancel", { update, product_id });
      this.resetForm();
    },
    resetForm() {
      this.$refs["customerForm"].resetFields();
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
.kuang {
  margin-left: 25px;
}

/* 上传图片 */
.thumbs_wrap {
  display: flex;
  align-items: center;
}
.thumbs_img {
  position: relative;
  width: 56px;
  height: 56px;
  text-align: center;
  border: 1px dashed #d4dde5;
  font-size: 0;
  margin: 0 10px 0 0;
  i {
    display: inline-block;
    position: absolute;
    top: -10px;
    right: -10px;
    height: 20px;
    width: 20px;
    font-size: 20px;
    cursor: pointer;
  }
  img {
    height: 100%;
    width: 100%;
  }
}
/deep/.thumbs_box {
  position: relative;
  width: 56px;
  height: 56px;
  text-align: center;
  border: 1px dashed #d4dde5;
  display: inline-block;
  padding-top: 8px!important;
  margin-bottom: 10px!important;
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

/*------------------文件--------------*/
/* 文档转换 */
.about_document {
  .recourse_btn {
    .iconfont {
      font-size: 13px;
    }
  }

  .left_doucment_ipt {
    width: 100%;

    .iconfont {
      font-size: 13px;
      color: 999;
      margin-left: 20px;
    }
  }
}

/*------------------富文本编辑器--------------*/
.v-note-wrapper .v-note-op .v-left-item .op-icon-divider {
  display: none !important;
}

/*------------------产品报价--------------*/
.price_btn {
  width: 65px;
  height: 32px;
  background: #e5eafe;
  border: 1px solid #e7e7e7;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  line-height: 32px;
  padding: 0;
  color: #4d6fff;
  .iconfont {
    font-size: 12px;
    margin-right: 3px;
  }
}
.del_price {
  margin-left: 5px;
  margin-top: -30px;
  color: #d7dce6;
  cursor: pointer;
}
.el-cascader{
    line-height:18px;
}
 /deep/.el-form-item__error{
        top: 86% !important;
  }
  /deep/.el-form-item__content{
    line-height: 25px!important;
}
</style>
