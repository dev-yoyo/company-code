<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <setting-menu :activeMenu="activeMenu"></setting-menu>
      <top-nav active_title="企业信息" type="2"></top-nav>

      <div class="content_main">
        <div class="d-flex">
          <div class="company_info">
            <div class="title">企业基本信息设置</div>

            <el-form ref="form" :model="form" :rules="rules" label-width="0">
              <el-form-item>
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
                    @click="upload('lup')"
                  >
                    <img :src="form.thumb" alt="" />
                    <div class="again_upload" v-show="again_box">重新上传</div>
                  </div>
                </div>
              </el-form-item>

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

              <el-form-item prop="scale">
                <div class="label">
                  <span>企业电子公章 &emsp;</span>
                  <el-tooltip class="item" effect="dark" content="上传后用于导出报价单签章，建议尺寸 160*160px，png格式" placement="bottom-start">
                    <svg t="1672907362845" class="icon" style="margin-bottom: -3px;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3552" width="16" height="16"><path d="M463.99957 784.352211c0 26.509985 21.490445 48.00043 48.00043 48.00043s48.00043-21.490445 48.00043-48.00043c0-26.509985-21.490445-48.00043-48.00043-48.00043S463.99957 757.842226 463.99957 784.352211z" fill="#999999" p-id="3553"></path><path d="M512 960c-247.039484 0-448-200.960516-448-448S264.960516 64 512 64 960 264.960516 960 512 759.039484 960 512 960zM512 128.287273c-211.584464 0-383.712727 172.128262-383.712727 383.712727 0 211.551781 172.128262 383.712727 383.712727 383.712727 211.551781 0 383.712727-172.159226 383.712727-383.712727C895.712727 300.415536 723.551781 128.287273 512 128.287273z" fill="#999999" p-id="3554"></path><path d="M512 673.695256c-17.664722 0-32.00086-14.336138-32.00086-31.99914l0-54.112297c0-52.352533 39.999785-92.352318 75.32751-127.647359 25.887273-25.919957 52.67249-52.67249 52.67249-74.016718 0-53.343368-43.07206-96.735385-95.99914-96.735385-53.823303 0-95.99914 41.535923-95.99914 94.559333 0 17.664722-14.336138 31.99914-32.00086 31.99914s-32.00086-14.336138-32.00086-31.99914c0-87.423948 71.775299-158.559333 160.00086-158.559333s160.00086 72.095256 160.00086 160.735385c0 47.904099-36.32028 84.191695-71.424378 119.295794-27.839699 27.776052-56.575622 56.511974-56.575622 82.3356l0 54.112297C544.00086 659.328155 529.664722 673.695256 512 673.695256z" fill="#999999" p-id="3555"></path></svg>
                  </el-tooltip>
                </div>
                <el-upload
                  :style="{'display':!form.quotation_seal?'block':'none'}"
                  ref="chapter"
                  action=""
                  list-type="picture"
                  :file-list="fileList"
                  :show-file-list="false"
                  :before-upload="handleBeforeUpload"
                  :http-request="chapter_upload"
                  accept=".png"
                >
                  <div class="up_chapter">
                    <i class="el-icon-plus"></i>
                  </div>
                </el-upload>
                <div class="view_chapter" :style="{'display':form.quotation_seal?'flex':'none'}">
                  <!-- <el-image class="chapter_img" :src="form.thumb"  :preview-src-list="[form.thumb]"></el-image> -->
                  <img class="chapter_img" :src="form.quotation_seal" alt="">
                  <span class="del_chapter" @click="delChapter"><i class="el-icon-error"></i></span>
                  <span class="up_again" @click="upload('chapter')"><i class="el-icon-upload"></i>重新上传</span>
                </div>
              </el-form-item>

              <el-button
                type="primary"
                @click="create"
                class="com_btn"
                :loading="createLoading"
                :disabled="createLoading"
              >
                保存
              </el-button>
            </el-form>
          </div>

          <div class="data_statistics">
            <div class="title">企业平台数据统计</div>

            <div class="v_info">
              当前使用版本
              <div class="current_v d-flex">
                <div class="v d-center">
                  {{ company_edition.level || 0 }}版本
                </div>
              </div>
            </div>

            <div class="title">企业使用时间</div>
            <div class="item_box d-flex">
              <div class="item_pro ">
                <div class="back_pie">
                  <el-progress
                    :show-text="false"
                    :width="144"
                    :stroke-width="12"
                    type="circle"
                    :percentage="info.day_percent"
                    color="#4D6FFF"
                  >
                  </el-progress>
                  <div class="circleCenter">
                    <div class="num">
                      <span>{{ info.surplus_days }}</span> 天
                    </div>
                    <div class="text">剩余天数</div>
                  </div>
                </div>

                <div class="r_time">
                  <div class="itme">
                    开始时间： <span>{{ company.created_at }}</span>
                  </div>
                  <div class="itme">
                    结束时间： <span>{{ company_edition.end_time }}</span>
                  </div>
                </div>
              </div>

              <div class="item_pro days">
                <div class="back_pie">
                  <el-progress
                    :show-text="false"
                    :width="144"
                    :stroke-width="12"
                    type="circle"
                    :percentage="info.position_percent"
                    color="#FFA629"
                  >
                  </el-progress>
                  <div class="circleCenter">
                    <div class="num">
                      <span>{{ company_edition.surplus_position || 0 }}</span>
                      个
                    </div>
                    <div class="text">剩余可用</div>
                  </div>
                </div>

                <div class="r_time">
                  <div class="itme">
                    坐席数：
                    <span>{{ company_edition.has_position || 0 }}个</span>
                  </div>
                  <div class="itme">
                    已使用：
                    <span>{{ company_edition.current_position || 0 }}个</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
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
      activeMenu: "company",
      createLoading: false,
      user: {},
      company_edition: {},
      company: {},
      info: {},
      form: {
        name: "",
        industry: "",
        scale: "",
        thumb: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3brpWtbTWtTRTNdrFhrf4ZAnPNeMaN5P1642730874790.png",
        quotation_seal: ""
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
      industry_list: [], // 行业
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
    };
  },
  created() {
    this.user = store.state.userInfo;

    this.init();
    this.get_industry();
  },
  methods: {
    init() {
      getData({
        url: "/company/company_info",
        data: {
          id: this.user.company_id,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.form.thumb = data.company.logo;
          this.form.name = data.company.name;
          this.form.industry = data.company.industry;
          this.form.scale = data.company.scale;
          this.form.quotation_seal = data.company.quotation_seal;

          this.info = data;
          this.company = data.company;
          this.company_edition = data.company_edition;
        } else {
          this.$err(data.msg);
        }
      });
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
    chapter_upload(e) {
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
          this.form.quotation_seal = path_url;
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },
    delChapter(){
      this.$refs.chapter.clearFiles();
      this.form.quotation_seal = "";
    },
    mouseOver() {
      if (this.form.thumb) {
        this.again_box = true;
      }
    },
    mouseLeave() {
      this.again_box = false;
    },
    upload(s) {
      this.$refs[s].clearFiles();
      this.$refs[s].$children[0].$refs.input.click();
    },
    create() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.createLoading = !this.createLoading;
          postData({
            url: "/company/update_company",
            data: {
              id: this.user.company_id,
              name: this.form.name,
              industry: this.form.industry,
              scale: this.form.scale,
              logo: this.form.thumb,
              quotation_seal: this.form.quotation_seal
            },
          }).then((res) => {
            const {
              code,
              data: { msg, industry, scale, logo },
            } = res;
            if (code === 200) {
              this.$success(msg);

              location.reload();
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
  },
};
</script>

<style lang="less" scoped>
.title {
  margin-bottom: 14px;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #464c5b;
}

.content_main > .d-flex{
  align-items: flex-start !important;
}
.company_info {
  margin-right: 25px;
  padding: 26px 24px 24px;
  width: 368px;
  height: 650px;
  background-color: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 18px;
  flex-shrink: 0;

  .label {
    font-size: 12px;
    font-weight: 400;
    line-height: 1;
    color: #657180;
    margin-bottom: 12px;
  }

  .up_chapter{
    width: 80px;
    height: 80px;
    position: relative;
    border-radius: 8px;
    background: #f8f8f8ff;
    border: 1px dashed #DADCE2;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    i {
      color: #929DAA;
      font-weight: bold;
      font-size: 16px;
    }
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

  .view_chapter {
    width: 80px;
    height: 102px;
    display: flex;
    position: relative;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    .del_chapter{
      position: absolute;
      top: 0;right: 0;
      z-index: 999;
      font-size: 24px;
      color: #cdcdcd;
      cursor: pointer;
      display: none;
    }
    .chapter_img{
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 8px;
    }
    .chapter_img:hover ~ .del_chapter{
      display: block;
    }
    .del_chapter:hover{
      display: block;
    }
    .up_again{
      color: #4D6FFF;
      cursor: pointer;
      i {
        font-size: 16px;
      }
    }
  }
  .com_btn {
    width: 100% !important;
  }
}

/deep/.el-form-item {
  margin-bottom: 24px !important;
}

/deep/.el-select {
  width: 100%;
}

.data_statistics {
  padding: 26px 24px 24px;
  width: 100%;
  height: 504px;

  background-color: #fff;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.04);
  border-radius: 18px;

  .v_info {
    .tit {
      margin-bottom: 14px;
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 17px;
      color: #464c5b;
    }

    .current_v {
      .v {
        margin: 14px 0 24px;
        padding: 0 15px;
        height: 32px;
        background: #f7f7f7;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #657180;
      }
    }
  }

  .item_box {
    display: flex;
    justify-content:center;
    align-content:center;
    align-items:stretch;
  }

  .item_pro {
    display:flex;
    align-items: center;
    padding: 22px 24px;
    width: 100%;
    border-radius: 8px;
    background: #fff;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);

    @media only screen and (max-width: 1280px) {
      display:flex;
      align-items: center;
      flex-direction: column;
    }

    .back_pie {
      position: relative;
      text-align: center;
      width: 144px;

      .circleCenter {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;

        .num {
          margin-bottom: 4px;

          span {
            color: #4d6fff;
            font-size: 28px;
            font-weight: 600;
          }
        }
        .text {
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #657180;
        }
      }
    }

    .r_time {
      margin-left: 18px;
      .itme {
        margin-bottom: 24px;
        font-size: 12px;
        font-weight: 400;
        color: #657180;

        span {
          font-weight: 600;
          color: #464c5b;
        }
      }

      @media only screen and (max-width: 1280px) {
        margin-top: 20px;
      }
    }
  }

  .days {
    margin-left: 25px;

    .num {
      span {
        color: #ffa629 !important;
      }
    }
  }
}
</style>
