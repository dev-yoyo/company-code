<template>
  <div class="company_create">
    <div class="main_box">
      <div class="company_box">
        <div class="company_title" @click="back()">
          <i class="iconfont icon-ykb-fh"></i>返回
        </div>
        <el-tabs v-model="active" @tab-click="handleClick">
          <el-tab-pane label="创建企业" name="create">
            <p class="txt">创建一个企业，邀请成员加入</p>
            <el-form ref="form" :model="form" :rules="rules" label-width="0">
              <el-form-item prop="name" class="company_name">
                <div class="label">企业名称</div>
                <el-input
                  v-model="form.name"
                  placeholder="请输入企业名称"
                ></el-input>
              </el-form-item>
              <el-form-item prop="industry">
                <div class="label">所属行业</div>
                <el-select v-model="form.industry" placeholder="请选择所属行业">
                  <el-option
                    v-for="item in industry_list"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="scale">
                <div class="label">企业规模</div>
                <el-select v-model="form.scale" placeholder="请选择企业规模">
                  <el-option
                    v-for="item in scale_list"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item prop="pwd">
                <div class="label">企业logo</div>
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
                    <i class="iconfont icon-xj"></i>
                  </el-upload>

                  <div
                    class="view_img"
                    v-show="form.thumb"
                    @mouseover="mouseOver"
                    @mouseleave="mouseLeave"
                    @click="upload"
                  >
                    <img :src="form.thumb" alt="" />
                    <div class="again_upload" v-show="again_box">重新上传</div>
                  </div>
                </div>
              </el-form-item>
              <el-button
                type="primary"
                @click="create"
                class="btn"
                :loading="createLoading"
                :disabled="createLoading"
                >创建企业</el-button>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="加入企业" name="join">
            <p class="txt">加入已有企业，和同事一起开拓市场</p>
            <el-input
              class="search"
              prefix-icon="el-icon-search"
              v-model="search"
              placeholder="输入搜索的企业名称"
              type="text"
              autocomplete="off"
              @input="change"
            ></el-input>

            <div class="company_list" v-if="company_show">
              <div
                class="company_item d-between"
                :class="item.apply_status != '申请加入' ? 'gray' : ''"
                v-for="(item, index) in company_list"
                :key="index"
                @click="join(item)"
              >
                <img :src="item.logo" alt="友客帮" />
                <div class="name">{{ item.name }}</div>
                <div class="join">{{ item.apply_status }}</div>
              </div>
            </div>
            <div class="page_empty" v-else>
              <img
                src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
              />
            </div>
          </el-tab-pane>
        </el-tabs>
        <p class="link" v-if="from == 'login'" @click="link()">跳过</p>
      </div>
      <div class="company_agree">
        登录即代表同意<router-link class="action" to="/agreement"
          >《用户协议》</router-link
        >及<router-link class="action" to="/policy">《隐私政策》</router-link>
      </div>
    </div>

    <el-dialog
      class="modal_join"
      title="确认加入"
      :modal-append-to-body="false"
      :visible.sync="visible"
      :before-close="handleClose"
    >
      <span>是否确定加入“{{ company_name }}”</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { company, getData, postData } from "@/api/user";
import store from "@/store";

export default {
  name: "company_create",
  data() {
    let checkname = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("企业名称不能为空"));
      } else if (value && value.length > 16) {
        callback(new Error("企业名称限制16个字符"));
      } else {
        callback();
      }
    };

    return {
      createLoading: false,
      active: "create",
      form: {
        name: "",
        industry: "",
        scale: "",
        thumb:
          "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3brpWtbTWtTRTNdrFhrf4ZAnPNeMaN5P1642730874790.png",
      },
      rules: {
        name: [{ validator: checkname, trigger: ["blur", "change"] }],
        industry: [
          { required: true, message: "行业不能为空", trigger: "change" },
        ],
        scale: [{ required: true, message: "规模不能为空", trigger: "change" }],
      },
      // 上传图片
      uploadHost: "", // 附件上传路径
      fileList: [],
      again_box: false,
      // 加入企业
      search: "",
      // 行业
      industry_list: [],
      // 规模
      scale_list: [
        "0-9人",
        "10-20人",
        "21-50人",
        "101-200人",
        "201-500人",
        "501-1000人",
        "1000+人",
      ],
      // 企业列表
      company_show: false,
      company_list: [],
      company_name: "",
      company_id: "",
      //确定加入
      visible: false,
      from:'',
      company_new: {},
      user_new: {},
    };
  },
  created() {
    this.get_industry();
    this.from = this.$route.query && this.$route.query.from
  },
  methods: {
    handleClick(tab, event) {},

    back() {
      this.$router.go(-1);
    },

    // ---------------------------------创建企业---------------------------------
    get_industry() {
      getData({
        url: "/company/industry",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { list, msg },
        } = res;
        if (code === 200) {
          this.industry_list = list;
        } else {
          this.$err(msg);
        }
      });
    },
    // ----------图片---------------------
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
          this.form.thumb = path_url;
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },
    mouseOver() {
      if (this.form.thumb) {
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
    create() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url: "/company/store",
            data: {
              name: this.form.name,
              industry: this.form.industry,
              scale: this.form.scale,
              logo: this.form.thumb,
            },
          }).then((res) => {
            const {
              code,
              data: { msg, industry, scale, logo, company, user },
            } = res;
            if (code === 200) {
              this.company_new = company
              this.user_new = user
              this.$success(msg);
              setTimeout(() => {
                if(this.from == 'home') {
                  this.change_company()
                }else {
                  this.create_company()
                }
              }, 1500);
            } else if (code === 422) {
              this.createLoading = false;
              if (scale) {
                this.$err(scale[0]);
              } else if (industry) {
                this.$err(industry[0]);
              } else if (logo) {
                this.$err(logo[0]);
              } else {
                this.$err(msg);
              }
            } else {
              this.createLoading = false;
            }
          });
        }
      });
    },
    change_company() {
      postData({
        url: "/user/swith_company",
        data: {
          company_id: this.company_new.id,
        },
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.create_company()
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },
    create_company () {
      let company = this.company_new
      // this.$store.commit("setUserInfo", this.user_new);
      this.$store.commit("setCompany", {company});
      let d = store.state.userInfo
      setTimeout(() => {
        // this.$router.push({
        //   path: "/home",
        // });
        window.location.href='/home'
        window.scrollTo(100, 0);
      }, 1500);
    },
    // ---------------------------------加入企业---------------------------------
    change(e) {
      if(e != '') {
        getData({
          url: "/company/search_company",
          data: {
            company_name: e,
          },
        }).then((res) => {
          const {
            code,
            data: { list },
          } = res;
          if (code === 200) {
            this.company_list = list;
            this.company_show = list && list.length > 0;
          }else {
            this.company_list = [];
            this.company_show = false;
          }
        });
      }else {
        this.company_list = [];
        this.company_show = false;
      }
    },
    join(v) {
      if (v.apply_status != "申请加入") return;
      this.visible = true;
      this.company_name = v.name;
      this.company_id = v.id;
    },
    handleClose() {
      this.visible = false;
    },
    confirm() {
      postData({
        url: "/company/join_company",
        data: {
          company_id: this.company_id,
        },
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          setTimeout(() => {
            // this.$router.replace({ path: "/home" });
            window.location.href='/home'
            window.scrollTo(100, 0);
          }, 1500);
        } else if (code === 422) {
          this.$err(msg);
        } 
      });
    },
    link () {
      // this.$router.replace({ path: "/home" });
      window.location.href='/home'
      window.scrollTo(100, 0);
    }
  },
};
</script>

<style lang="less">
.company_create {
  width: 100%;
  height: 100vh;
  background-image: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/dly-bg.png");
  background-size: cover;
  background-position: center;
  position: relative;

  .main_box {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);

    .company_box {
      width: 455px;
      height: auto;
      min-height: 640px;
      background: #fff;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 18px;
      padding: 30px 79px;
    }

    .company_title {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #464c5b;
      margin-bottom: 24px;
      margin-left: -38px;

      .iconfont {
        margin-right: 8px;
        cursor: pointer;
      }
    }

    .label {
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #464c5b;
      margin-bottom: 12px;
    }

    .el-form-item {
      margin-bottom: 40px;
    }

    .company_name {
      .el-input__inner,
      .el-input__inner:focus,
      .el-input__inner:hover {
        border-top: none !important;
        border-left: none !important;
        border-right: none !important;
        border-radius: 0;
        padding: 0;
        box-shadow: none;
      }
    }

    .el-select {
      width: 100%;
    }

    .txt {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #9ea7b4;
      margin-bottom: 17px;
    }

    .link {
      text-align: center;
      margin-top: 10px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #4d6fff;
      text-decoration: underline;
    }

    .company_list {
      height: 341px;
      overflow-x: hidden;
      overflow-y: auto;
      margin-top: 32px;
      padding: 2px 7px 4px 2px;
    }

    .company_item {
      height: 61px;
      background: #fff;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      margin-bottom: 18px;
      padding: 8px 17px 5px 11px;
      cursor: pointer;

      img {
        width: 48px;
        height: 48px;
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        margin-right: 8px;
      }

      .name {
        width: 134px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;
        padding: 0 10px;
      }

      .join {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #3399ff;
      }
    }

    .company_item.gray {
      cursor: default;

      .join {
        color: #999 !important;
      }
    }

    .btn {
      width: 100%;
      height: 42px;
      background: #4d6fff;
      border-color: #4d6fff;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #ffffff;
    }

    .company_agree {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
      margin-top: 30px;
    }

    .action {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #3399ff;
      cursor: pointer;
      text-decoration: none;
    }

    .el-tabs__nav-wrap::after {
      background-color: #fff;
    }

    .el-tabs__nav-scroll {
      padding: 0 35px;
    }

    .el-tabs__nav {
      width: 100%;
    }

    .el-tabs__item {
      width: 100px;
      text-align: center;
      font-size: 16px;
    }

    .el-tabs__item.is-active {
      color: #4d6fff;
    }
    .el-tabs__item:hover {
      color: #4d6fff;
    }

    .el-tabs__active-bar {
      background-color: #3965f9;
    }

    .thumbs_box {
      position: relative;
      width: 56px;
      height: 56px;
      text-align: center;
      border: 1px dashed #d4dde5;

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
  }

  .page_empty {
    background: #fff !important;
    border: none !important;
    padding: 77.5px  0 !important;
  }
}
</style>