<template>
  <div class="product">
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
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div class="title d-between">
        <div class="product_name">{{ info.name || "" }}</div>
        <div class="product_btn" v-if="user.role_id < 3">
          <el-button class="btn blue" @click="edit()">编辑</el-button>
          <el-button class="btn" @click="down()">{{ type_name }}</el-button>
          <el-button class="btn" @click="del()">删除</el-button>
        </div>
      </div>

      <el-tabs v-model="active">
        <el-tab-pane label="详细资料" name="one">
          <el-form
            :model="info"
            ref="customerForm"
            label-width="80px"
            class="demo-form"
          >
            <div class="form_tit base">基础信息</div>

            <div class="d-between">
              <el-form-item label="产品名称">
                <el-input
                  v-model="info.name"
                  placeholder="暂无"
                  disabled
                ></el-input>
              </el-form-item>

              <el-form-item label="产品编号">
                <el-input
                  v-model="info.product_no"
                  placeholder="暂无"
                  disabled
                ></el-input>
              </el-form-item>
            </div>

            <div class="d-between">
              <el-form-item label="产品分类">
                <el-input v-model="info.cate" disabled></el-input>
              </el-form-item>
              <el-form-item label="产品状态">
                <el-input v-model="info.online" disabled></el-input>
              </el-form-item>
            </div>

            <el-form-item label="产品图">
              <div class="d-flex">
                <div
                  class="thumbs_img"
                  v-for="(item, index) in img_list"
                  :key="index"
                >
                  {{ info.thumb }}
                  <img :src="item" />
                </div>
              </div>
            </el-form-item>
          </el-form>

          <div class="form_tit">基础参数</div>

          <div class="content" v-if="info.parameter">
            <div v-html="info.parameter"></div>
          </div>
          <div class="page_empty" v-else>
            <img
              src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
            />
          </div>

          <!-- 产品手册 -->
          <div class="images_box" v-if="info.content_image">
            <div class="item" v-for="(v, i) in info.content_image" :key="i">
              <img :src="v" />
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="指导报价" name="two">
          <div class="directPrice_table" v-if="info.price">
            <div class="tr">
              <span class="th">数量：（个）</span>
              <span class="th">单价：（元）</span>
            </div>
            <div class="tr" v-for="(a, b) in info.price" :key="b">
              <span class="td">{{ a.num }}+</span>
              <span class="td">{{ a.price }}</span>
            </div>
          </div>
          <div class="page_empty" v-else>
            <img
              src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="产品文档" name="three">
          <div class="product-table" v-if="info.price">
            <div class="table-head">
              <div class="table-left">
                全部文档 <span>{{ tableData.length }}</span>
              </div>
              <el-button class="table-right" @click="updataHandle">
                上传文档
              </el-button>
            </div>
            <el-table
              :data="tableData"
              :cell-style="{ textAlign: 'center' }"
              :header-cell-style="{ textAlign: 'center' }"
              border
              style="width: 100%"
            >
              <el-table-column label="文件名称" width="150">
                <template slot-scope="scope">
                  <!-- <span
                    class="table-product"
                    @click="handleDownload(scope.row.id)"
                    >{{ scope.row.file_name }}</span
                  > -->
                  <span class="table-product">{{ scope.row.file_name }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="created_at" label="上传时间" width="157">
              </el-table-column>
              <el-table-column prop="user.name" label="上传人" width="157">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">新增</el-button> -->
                  <div
                    class="table-delete"
                    @click="handleDelete(scope.$index, tableData)"
                  >
                    删除
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="page_empty" v-else>
            <img
              src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
            />
          </div>

          <el-dialog
            title="上传文档"
            :visible.sync="dialogUpdatakVisible"
            width="533px"
            height="250px"
            append-to-body
          >
            <el-upload
              class="upload-demo"
              drag
              :action="uploadHost"
              :data="pdf_uploadData"
              :file-list="pdf_fileList"
              :before-upload="pdf_BeforeUpload"
              :on-success="pdf_success"
              :show-file-list="false"
              accept=".pdf,.doc,.docx,"
            >
              <div v-if="!file_name">
                <i class="iconfont icon-scwj"></i>
                <span class="el-upload__text"
                  >将文件拖到此处，或<em>点击上传</em></span
                >
              </div>
              <div v-else>
                <span class="el-upload__suctext">{{ this.file_name }}</span>
              </div>
            </el-upload>
            <div class="el-upload__tip">
              <i class="iconfont icon-ykb-zy"></i
              >注意事项：文档格式仅支持word、pdf格式，文件大小不能超过50M
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogUpdatakVisible = false">取 消</el-button>
              <el-button type="primary" @click="uploadFile">确 定</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="操作记录" name="four">
          <el-timeline class="record" v-if="info.product_operation_record">
            <el-timeline-item
              :timestamp="v.created_at"
              placement="top"
              v-for="(v, k) in info.product_operation_record"
              :key="k"
            >
              <template slot="dot">
                <img
                  class="record_dot"
                  src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/20220422-151733.png"
                />
              </template>

              <div class="record_item d-flex">
                <img class="avatar" :src="v.user.avatar" v-if="v.user.avatar" />
                <div class="nick" v-else>{{ v.user.abbreviation }}</div>
                <div class="name">{{ v.user.name }}</div>
                <div class="action">{{ v.content }}</div>
              </div>
            </el-timeline-item>
          </el-timeline>
          <div class="page_empty" v-else>
            <img
              src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
    <el-dialog
      class="modal_join"
      :title="type_name"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <span>是否确定{{ type_name }}“{{ info.name || "" }}”</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>

    <add v-if="addShow" ref="add" @cancel="hideadd"></add>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import add from "./add.vue";
import store from "@/store";
import { oss } from "@/api/oss_upload";

export default {
  data() {
    return {
      drawer: true,
      active: "one",
      info: {},
      role_id: "",
      product_id: "",
      visible: false,
      type: 1, // 1为上下架，2为删除
      type_name: "",
      addShow: false,
      img_list: [],
      user: {},
      tableData: [], // 表格数据
      dialogUpdatakVisible: false, // 上传文件
      // 上传文件
      uploadHost: "", // 附件上传路径
      fileList: [],
      // 资料
      pdf_uploadData: {}, // 资料 pdf
      pdf_fileList: [], // 资料 pdf
      pdf_flag: false,
      file_name: "", //文件名称
      file_path: "", // 文件路径
      file_size: "", // 文件大小
    };
  },
  created() {
    let user = store.state.userInfo;
    this.user = user;
  },
  methods: {
    init(id) {
      this.product_id = id;
      getData({ url: "/product/" + this.product_id }).then((res) => {
        const {
          code,
          data: { product, role_id },
        } = res;
        if (code === 200) {
          this.info = product;
          this.info.online = this.info.is_online == 1 ? "上架" : "下架";
          this.type_name = this.info.is_online == 1 ? "下架" : "上架";
          this.role_id = role_id;
          this.img_list = this.info.thumb ? JSON.parse(this.info.thumb) : [];
          if (this.info.f_classify && this.info.f_classify.name) {
            this.info.cate = `${this.info.f_classify.name}`;
          }
          if (this.info.s_classify && this.info.s_classify.name) {
            this.info.cate = `${this.info.f_classify.name} / ${this.info.s_classify.name}`;
          }
          if (this.info.pruduct_file) {
            console.log("file=====", this.info.pruduct_file);
            this.tableData = this.info.pruduct_file;
          }
        }
      });
    },

    // 上传文件按钮
    updataHandle() {
      this.dialogUpdatakVisible = true;
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

      const url = "oss_direct/sign_key?dir=product";
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
        this.file_name = file.name;
        this.file_path = res.filename;
        this.file_size = res.size;
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

    // 上传文件
    uploadFile() {
      let params = {
        path: this.file_path,
        filesize: this.file_size,
        product_id: this.product_id,
        file_name: this.file_name,
      };
      if (!this.file_path) {
        this.$warning("不能传空文件");
        return;
      }
      postData({
        url: "/product/upload_product_file",
        data: params,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.init(this.product_id);
          this.dialogUpdatakVisible = false;
          this.file_name = "";
        } else {
          this.$err(msg);
        }
      });
    },

    // 删除产品手册表格
    // handleDownload(id) {
    //   this.$confirm("确认下载?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       getData({
    //         url: `/product/downloac_product_file?id=${id}`
    //       }).then((res) => {
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消下载",
    //       });
    //     });
    // },

    // 删除产品手册表格
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          postData({
            url: "/product/del_product_file",
            data: {
              id: row[index].id,
            },
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$success(msg);
              this.tableData.splice(index, 1);
            } else {
              this.$err(msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // -------------------操作----------------
    edit() {
      this.addShow = true;

      this.$nextTick(() => {
        this.$refs.add.init(this.product_id);
      });
    },
    hideadd({ update, product_id }) {
      if (update) {
        this.init(product_id);
      }
      this.addShow = false;
    },

    down() {
      this.visible = true;
      this.type = 1;
      this.type_name = this.info.is_online == 1 ? "下架" : "上架";
    },
    del() {
      this.visible = true;
      this.type = 2;
      this.type_name = "删除";
    },
    handleClose() {
      this.visible = false;
    },
    confirm() {
      if (this.type == 1) {
        postData({
          url: "/product/down",
          data: {
            product_id: this.product_id,
            is_online: this.info.is_online == 1 ? 0 : 1,
          },
        }).then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            this.visible = false;
            this.cancel();
          } else if (code === 422) {
            this.$err(msg);
          }
        });
      } else {
        postData({
          url: "/product/delete",
          data: {
            product_ids: [this.product_id],
          },
        }).then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            setTimeout(() => {
              this.visible = false;
              this.$emit("cancel", true);
            }, 1500);
          } else if (code === 422) {
            this.$err(msg);
          }
        });
      }
    },

    // -------------------其他----------------
    cancel() {
      this.$emit("cancel", true);
    },
  },
  components: {
    add,
  },
};
</script>

<style lang="less" scoped>
.product {
  /deep/.el-drawer {
    overflow: initial !important;

    .el-drawer__body {
      padding: 48px 48px 0 24px;
    }
  }

  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .product_name {
    width: 300px;
    word-break: break-all;
  }

  .product_btn {
    .btn {
      width: 68px;
      height: 32px;
      background: rgba(250, 250, 250, 0.39);
      border: 1px solid #dddddd;
      border-radius: 3px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #666666;
      padding: 0;
    }
    .blue {
      background: #4d6fff;
      border: 1px solid #4d6fff;
      color: #fff;
    }
  }

  /*------------tabs-----------*/
  /deep/.el-tabs__nav-wrap::after {
    background-color: #fff;
  }

  /deep/.el-tabs__nav-scroll {
    padding: 0;
  }

  /deep/.el-tabs__nav {
    width: 100%;
    border-bottom: 1px solid #d7dce6;
  }

  /deep/.el-tabs__item {
    width: 80px;
    text-align: center;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #9ea7b4;
    background: #f4f7fb;
    height: 34px;
    line-height: 34px;
    border: 1px solid #e9ecf2;
    border-bottom: none;
    padding: 0;
  }

  /deep/.el-tabs__item.is-active {
    color: #4d6fff;
    background: #fff;
  }

  /deep/.el-tabs__active-bar {
    background-color: transparent;
  }

  /*------基础信息---*/
  .form_tit {
    margin: 24px 0 16px;
    font-size: 12px;
    font-weight: 600;
    line-height: 17px;
    color: #464c5b;
  }
  /deep/.demo-form {
    .el-form-item {
      margin-bottom: 24px;
    }

    .el-form-item__label {
      font-size: 12px;
      font-weight: 400;
      color: #657180;
    }

    .el-input {
      width: 204px;
    }
  }

  .content {
    border: 1px solid #f3f3f3;
    min-height: 300px;
    padding: 20px;
    font-size: 14px;
  }

  /*-----------指导报价-------------*/
  .directPrice_table {
    text-align: left;
    font-size: 14px;
    border: 1px solid #e5e5e5;
    border-right: 0;
    border-bottom: 0;
    .tr {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .th {
      height: 36px;
      line-height: 36px;
      text-align: center;
      width: 50%;
      border-right: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      color: #333;
    }
    .td {
      height: 36px;
      line-height: 36px;
      text-align: center;
      width: 50%;
      border-right: 1px solid #e5e5e5;
      border-bottom: 1px solid #e5e5e5;
      color: #657180;
    }
  }

  /*---------操作记录------------*/
  .record {
    margin-top: 10px;
  }

  .record_dot {
    height: 8px;
    width: 8px;
    margin-left: 1px;
  }

  /deep/ .el-timeline-item__timestamp.is-top {
    padding: 0;
    font-size: 12px;
    font-weight: 600;
    color: #464c5b;
    margin-bottom: 12px;
  }

  .record_item {
    box-shadow: rgba(0, 0, 0, 0.08) 0px 0px 10px 1px inset;
    border-radius: 8px;
    padding: 12px 12px 14px;
  }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
  }

  .nick {
    width: 34px;
    height: 34px;
    background: #4d6fff;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 400;
    line-height: 34px;
    color: #ffffff;
    text-align: center;
  }

  .name {
    margin-left: 5px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #657180;
    margin-right: 20px;
  }

  .action {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #657180;
  }

  .page_empty {
    background: #fff !important;
    border: none !important;
  }
}

.images_box {
  margin-top: 10px;
  background-color: #fff;

  .item {
    margin-bottom: 10px;
    width: 100%;
  }
}

.thumbs_img {
  position: relative;
  width: 108px;
  height: 108px;
  text-align: center;
  border: 1px dashed #d4dde5;
  font-size: 0;
  margin: 0 20px 20px 0;
  img {
    height: 100%;
    width: 100%;
  }
}

// 产品文档
.product-table {
  .table-head {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1px 0 9px 0;

    .table-left {
      font-size: 12px;
      font-weight: 600;
      line-height: 17px;
      color: #5b5146;
      opacity: 1;

      span {
        color: #ff9505;
      }
    }

    .table-right {
      width: 68px;
      height: 32px;
      background: rgba(244, 245, 248, 1);
      opacity: 1;
      border-radius: 3px;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 32px;
      color: #657180;
      text-align: center;
      padding: 0;

      &:hover {
        background: #e2e5eb;
      }

      &:active {
        background: #e5eafe;
      }
    }
  }

  .table-product {
    font-size: 12px;
    line-height: 17px;
    color: #657180;
    text-decoration: underline;

    &:hover {
      color: #3399ff;
    }

    &:active {
      color: #4d6fff;
    }
  }

  .table-delete {
    font-size: 12px;
    line-height: 17px;
    color: #3399ff;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }

    &:active {
      color: #4d6fff;
    }
  }
}

/deep/ .el-upload-dragger {
  width: 485px;
  height: 63px;
  background: rgba(247, 247, 247, 1);
  opacity: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.el-upload__tip {
  width: 486px;
  height: 27px;
  background: rgba(255, 249, 227, 1);
  font-size: 12px;
  line-height: 17px;
  color: #333333;
  display: flex;
  align-items: center;
  .icon-ykb-zy {
    color: #ff9025;
    margin: 0 12px;
  }
}

.el-upload__text {
  font-size: 13px;
  line-height: 18px;
  color: #657180;
  margin-left: 6px;
}
</style>