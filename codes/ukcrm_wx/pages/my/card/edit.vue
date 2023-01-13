<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>
    <view class="tit d-flex">
      <view class="txt"> 快速上传名片信息 </view>
      <view class="auto_txt d-flex" @click="auto">
        <i class="icon iconfont icon-sm"></i>
        自动识别
      </view>
    </view>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item label="姓名" prop="name">
          <u-input
            v-model="info.name"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>

        <u-form-item label="联系方式" prop="phone">
          <u-input
            v-model="info.phone"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            type="number"
            maxlength="25"
          ></u-input>
        </u-form-item>

        <u-form-item label="职位" prop="duty">
          <u-input
            v-model="info.duty"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>

        <u-form-item label="企业名称" prop="company">
          <u-input
            v-model="info.company"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>

        <u-form-item label="企业地址" prop="address">
          <u-input
            v-model="info.address"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>
      </u-form>
    </view>

    <view class="fixed_btm btm_btns d-flex">
      <u-button type="default" @click="cancel" :customStyle="cancelStyle">
        取消
      </u-button>

      <u-button
        @click="create"
        color="#4D6FFF"
        :loading="createLoading"
        :disabled="createLoading"
      >
        保存
      </u-button>
    </view>

  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";

export default {
  data() {
    return {
      createLoading: false,
      info: {
        id:"",
        name: "",
        phone: "",
        duty: "", // 职务
        company: "",
        address: "",
      },
      rules: {
        name: [
          {
            type: "string",
            required: false,
            message: "请输入客户姓名",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 4) {
                return false;
              }
            },
            message: "客户姓名限制4个字符",
            trigger: ["change", "blur"],
          },
        ],
        phone: [
          {
            type: "number",
            required: false,
            message: "请输入联系电话",
            trigger: ["blur", "change"],
          },
        ],
        duty: [
          {
            type: "string",
            required: false,
            message: "请输入职位",
            trigger: ["blur", "change"],
          },
        ],
        company: [
          {
            type: "string",
            required: false,
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
        address: [
          {
            type: "string",
            required: false,
            message: "请输入企业名称",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 30) {
                return false;
              }
            },
            message: "企业地址限制30个字符",
            trigger: ["change", "blur"],
          },
        ],
      },

      cancelStyle: {
        "margin-right": "20px",
        color: "#333",
        "background-color": " #fff",
        border: "1px solid #333",
      },
    };
  },
  computed: {
    is_save() {
      let flag = false;
      const {
        name,
        phone,
        duty,
        company,
        address
      } = this.info;

      if (
        name &&
        phone &&
        duty && 
        company &&
        address
      ) {
        flag = true;
      }
      return flag;
    },
  },
  onShow() {
    let query = this.$Route.query;
    this.init();
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  methods: {
    // 行业
    init() {
       getData("/visit_card", {}).then((res) => {
        const { code,data: { visit_card }} = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          let info = visit_card
          this.info.id = info && info.id || ''
          this.info.name = info &&info.name || '';
          this.info.phone = info &&info.phone || '';
          this.info.duty = info &&info.position || '';
          this.info.company = info &&info.company_name || '';
          this.info.address = info &&info.company_address || '';
        }
      });
    },

    // 自动识别名片
    auto() {
      let _th = this;
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], //从相册选择
        success: function (res) {
          uni.showLoading({
            title: "识别中",
            mask: true,
          });

          uni.getFileSystemManager().readFile({
            filePath: res.tempFilePaths[0], // 图片地址 本地or网络
            encoding: "base64",
            success: (res) => {
              let base64Image = res.data;
              postData("/customer/ocr", {
                image: base64Image,
              }).then((res) => {
                const {
                  code,
                  data: { info, msg },
                } = res;
                if (code === 200) {
                  uni.hideLoading();

                  if (info.length > 0) {
                    console.log('识别名片 >>>>>>>',info)
                    info.map((v, i) => {
                      
                      let val = v.Value.trim();

                      switch (v.Name) {
                        case "姓名":
                          _th.info.name = val;
                          break;
                        case "手机":
                          _th.info.phone = val
                          break;
                        case "职位":
                          _th.info.duty = val
                          break;
                        case "公司":
                          _th.info.company = val.substring(0, 16);
                          break;
                        case "地址":
                          _th.info.address = val.substring(0, 30);
                          break;
                        default:
                          break;
                      }
                    });
                  }
                } else if (code === 422) {
                  this.$u.toast(msg);
                  uni.hideLoading();
                }
              });
            },
            error() {
              uni.hideLoading();
            },
          });
        },
      });
    },

    // 创建
    create() {
      this.$refs.uForm.validate().then((res) => {
        let info = this.info;
        this.createLoading = !this.createLoading;
        postData(`/visit_card/update`, {
          id: info.id,
          name: info.name,
          phone: info.phone,
          company_name: info.company,
          company_address: info.address,
          position: info.duty,
        })
          .then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$refs.uToast.show({
                message: msg,
                complete() {
                  uni.navigateBack({ delta: 1 });
                },
              });
            } else {
              this.$u.toast(msg);
              this.createLoading = !this.createLoading;
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
          });
      });
    },

    cancel() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="less" scoped>
.detail_main {
  padding: 0 0 130px;
}

.tit {
  justify-content: space-between;
  padding: 10px 26px;
  padding-right: 15px;

  .txt {
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
    color: #999999;
  }

  .auto_txt {
    justify-content: center;
    width: 85px;
    height: 28px;
    background: linear-gradient(90deg, #4d6fff 0%, #6584ff 100%);
    border-radius: 14px;

    font-size: 12px;
    color: #ffffff;

    .iconfont {
      margin-right: 5px;
      font-size: 12px;
    }
  }
}

.other_msg {
  padding: 10px 26px;
}

.form_main {
  /deep/.item__body__right__content__icon {
    margin-left: 10px;
  }
}

.btm_btns {
  justify-content: space-around;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}

/deep/.u-textarea {
  padding: 10px 0 !important;
}

.right_icon {
  align-content: center;
}
</style>