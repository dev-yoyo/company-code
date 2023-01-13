<template>
  <view class="login_detail">
    <u-toast ref="uToast"></u-toast>

    <view class="login_txt"> 创建企业 </view>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="top"
        labelWidth="100"
      >
        <u-form-item label="企业名称" prop="name" borderBottom required>
          <u-input
            v-model="info.name"
            placeholder="请输入企业名称（必填）"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
          ></u-input>
        </u-form-item>

        <u-form-item
          label="企业行业"
          prop="industry"
          borderBottom
          required
          @click="industry_list"
        >
          <u-input
            v-model="info.industry"
            placeholder="请选择企业行业（必填）"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item
          label="企业规模"
          prop="scale"
          borderBottom
          required
          @click="scale_list"
        >
          <u-input
            v-model="info.scale"
            placeholder="请选择企业规模（必填）"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item label="上传企业logo" prop="thumb">
          <view class="add_logo">
            <u-upload
              :fileList="fileList"
              @delete="deletePic"
              @afterRead="afterRead"
              multiple
              :maxCount="1"
              width="44"
              height="44"
            >
              <view class="upload_box d-flex">
                <i class="icon iconfont icon-tj4"></i>
              </view>
            </u-upload>
          </view>
        </u-form-item>
      </u-form>

      <view class="login_btn_box" :class="is_submit ? 'lightBtn' : 'btn'">
        <u-button
          @click="submit"
          :loading="createLoading"
          :disabled="createLoading"
        >
          创建
        </u-button>
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import config from "@/common/config";

export default {
  data() {
    return {
      from: "login",
      createLoading: false,
      info: {
        name: "",
        industry: "",
        scale: "",
        thumb:
          "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3brpWtbTWtTRTNdrFhrf4ZAnPNeMaN5P1642730874790.png",
      },
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "请输入企业名称",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 16) {
                return false;
              }
            },
            message: "企业名称限制16个字符",
            trigger: ["change", "blur"],
          },
        ],
        industry: {
          type: "string",
          required: true,
          message: "请选择企业行业",
          trigger: ["blur", "change"],
        },
        scale: {
          type: "string",
          required: true,
          message: "请选择企业规模",
          trigger: ["blur", "change"],
        },
      },
      industryShow: false, // 行业
      industryList: [],

      scaleShow: false, // 规模
      columns: [
        "0-9人",
        "10-20人",
        "21-50人",
        "101-200人",
        "201-500人",
        "501-1000人",
        "1000+人",
      ],
      fileList: [
        {
          url: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3brpWtbTWtTRTNdrFhrf4ZAnPNeMaN5P1642730874790.png",
        },
      ],
    };
  },
  computed: {
    is_submit() {
      const { name, industry, scale } = this.info;
      if (name && industry && scale) {
        return true;
      }
      return false;
    },
    // 弹框时 无法点击input
    iptFocus() {
      if (this.industryShow || this.scaleShow) {
        return true;
      }

      return false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  onLoad() {
    this.init();
    let query = this.$Route.query;
    if (query.from) {
      this.from = query.from;
    }
    let _th = this;
    uni.$on("updateData", function (data) {
      console.log("updateData >>>", data);
      switch (data.type) {
        case "industry":
          _th.info.industry = data.value;
          break;
        case "scale":
          _th.info.scale = data.value;
          break;

        default:
          break;
      }
    });
  },
  methods: {
    // 行业列表
    init() {
      getData("/company/industry").then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          this.industryList = list;
        }
      });
    },

    industry_list() {
      this.$Router.push({
        path: "/choose_list",
        query: {
          list: this.industryList,
          type: "industry",
        },
      });
    },
    scale_list() {
      this.$Router.push({
        path: "/choose_list",
        query: {
          list: this.columns,
          type: "scale",
        },
      });
    },

    // 删除图片
    deletePic(event) {
      this.fileList.splice(event.index, 1);
    },
    // 新增图片
    async afterRead(event) {
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      uni.showLoading({
        title: "上传中",
        mask: true,
      });

      let lists = [].concat(event.file);
      await this.uploadFilePromise(lists[0].thumb);
    },
    uploadFilePromise(url) {
      let _th = this;
      uni.uploadFile({
        url: `${config.baseUrl}/api/single`,
        filePath: url,
        name: "file",
        fileType: "image",
        success: (uploadFileRes) => {
          const {
            code,
            data: { path_url, msg },
          } = JSON.parse(uploadFileRes.data);

          if (code === 200) {
            _th.fileList.push({
              name: "logo",
              url: path_url,
            });
            this.info.thumb = path_url;
            uni.hideLoading();
          } else if (code === 422) {
            uni.hideLoading();
            this.$u.toast(msg);
          } else {
            uni.hideLoading();
          }
        },
        fail: () => {
          uni.hideLoading();
          this.$u.toast("图片上传失败，请重试！");
        },
      });
    },

    submit() {
      if (!this.is_submit) return;

      this.$refs.uForm
        .validate()
        .then((res) => {
          this.createLoading = !this.createLoading;

          postData("/company/store ", {
            name: this.info.name,
            industry: this.info.industry,
            scale: this.info.scale,
            logo: this.info.thumb,
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              if (this.from == "login") {
                this.$Router.push({
                  path: "/create_branch",
                });
              } else if (this.from == "my") {
                let _th = this;
                this.$refs.uToast.show({
                  message: msg,
                  complete() {
                    _th.$Router.replaceAll({
                      name: "my",
                    });
                  },
                });
              } else {
                uni.navigateBack({ delta: 2 });
              }
            } else if (code === 422) {
              this.$u.toast(msg);
              this.createLoading = !this.createLoading;
            }else {
              this.$u.toast(msg);
            }
          });
        })
        .catch(() => {
          this.createLoading = !this.createLoading;
        //   uni.$u.toast("创建失败，请重试");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.login_detail {
  padding: 0 20px;
  height: 100%;
  background-color: #fff;
}

/deep/ .u-form-item__body__right__message {
  padding-left: 26px;
}

.login_txt {
  padding: 68px 0 20px;
  font-size: 28px;
  font-weight: 600;
  line-height: 40px;
  color: #333333;
}

.login_btn_box {
  margin-top: 170px;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

// 上传logo
.upload_box {
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #f4f4f4;
  border-radius: 4px;
  color: #666666;
  font-size: 17px;

  .iconfont {
    font-weight: 400;
    color: #c3c3c3;
  }
}

/deep/.u-form-item__body__left__content__label {
  color: #333 !important;
}
</style>