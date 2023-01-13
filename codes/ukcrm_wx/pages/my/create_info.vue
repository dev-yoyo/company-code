<template>
  <view class="login_detail">
    <view class="login_txt"> 基本信息 </view>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item label="头像" prop="avatar" borderBottom>
          <view class="info_item d-flex avatar_box" slot="right">
            <u-avatar
              class="avatar"
              v-if="info.avatar"
              :src="info.avatar"
              :size="34"
              shape="square"
              bg-color="#4D6FFF"
              mode="aspectFit"
            ></u-avatar>
            <u-avatar
              class="avatar"
              v-else
              :text="info.abbreviation"
              :size="34"
              font-size="14"
              shape="square"
              bg-color="#4D6FFF"
              mode="aspectFit"
            ></u-avatar>
            <u-upload
              class="up"
              :fileList="fileList"
              @delete="deletePic"
              @afterRead="afterRead"
              maxCount="1"
              width="34"
              height="34"
            >
              <view class="upload_box d-flex">
                <i class="icon iconfont icon-tj4"></i>
              </view>
            </u-upload>

            <u-icon name="arrow-right"></u-icon>
          </view>
        </u-form-item>

        <u-form-item
          label="姓名"
          prop="name"
          borderBottom
          @click="change_name()"
        >
          <view class="d-flex" slot="right">
            <view class="name">{{ info.name }}</view>
            <u-icon name="arrow-right"></u-icon>
          </view>
        </u-form-item>

        <u-form-item label="手机号" borderBottom>
          <view class="grey" slot="right">{{ info.phone || "无" }}</view>
        </u-form-item>

        <u-form-item label="部门" borderBottom v-if="info.department && info.department.name">
          <view class="grey" slot="right">{{
            info.department && info.department.name
              ? info.department.name
              : "无"
          }}</view>
        </u-form-item>

        <u-form-item label="角色" borderBottom>
          <view class="grey" slot="right">{{
            info.role && info.role.name
              ? info.role.name
              : "无"
          }}</view>
        </u-form-item>

        <u-form-item label="企业">
          <view class="grey" slot="right">{{
            info.company && info.company.name ? info.company.name : "无"
          }}</view>
        </u-form-item>
      </u-form>
    </view>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
import config from "@/common/config";

export default {
  data() {
    return {
      info: {},
      rules: {
        name: {
          type: "string",
          required: true,
          message: "请输入产品名称",
          trigger: ["blur", "change"],
        },
        thumb: {
          type: "array",
          required: true,
          message: "请上传产品图",
          trigger: ["blur", "change"],
        },
      },
      fileList: [],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      getUser().then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.info = user;
        }
      });
    },
    change_name() {
      this.$Router.push({
        path: "/change_name",
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
      await this.uploadFilePromise(event.file);
    },
    uploadFilePromise(file, index) {
      let that = this;
      uni.uploadFile({
        url: `${config.baseUrl}/api/single`,
        filePath: file.url,
        name: "file",
        fileType: "image",
        success: (uploadFileRes) => {
          const {
            code,
            data: { path_url, msg },
          } = JSON.parse(uploadFileRes.data);
          if (code === 200) {
            postData("/user", {
              avatar: path_url,
            }).then((res) => {
              const {
                code,
                data: { msg },
              } = res;
              if (code === 200) {
                uni.$u.toast(msg);
                // uni.navigateBack({ delta: 1 });
                this.init();
              } else {
                uni.$u.toast(msg);
              }
            });
          } else {
            uni.$u.toast(msg);
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.$u.toast("上传失败，请重试！");
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_detail {
  padding: 0 0 130px;
}

.login_txt {
  padding: 14px 26px 9px;
  font-size: 13px;
  color: #999;
}

.form_main {
  background-color: #fff;

  /deep/ .u-avatar--square {
    border-radius: 10px;
  }

  .u-line {
    border-color: #f4f4f4;
  }

  /deep/.u-form-item__body {
    padding-left: 26px !important;
    padding-right: 20px !important;
  }

  /deep/.u-icon--right {
    margin-left: 10px;
  }

  /deep/.u-upload {
    position: absolute;
    top: 0;
    right: 16px;
    opacity: 0;
  }

  .name {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }

  .grey {
    font-size: 14px;
    font-weight: 400;
    color: #c3c3c3;
  }
}

.info_item {
  position: relative;
}

.add_product {
  justify-content: center;
  width: 73px;
  height: 30px;
  background: rgba(255, 255, 255, 0.39);
  border: 1px solid #aabdff;
  border-radius: 15px;

  font-size: 13px;
  font-weight: 600;
  color: #4d6fff;
}

.document_box {
  justify-content: space-between;
  padding: 10px 0;
  line-height: 1;
  color: #333;
  font-size: 15px;

  .iconfont {
    margin-left: 20px;
    font-size: 18px;
    flex-shrink: 0;
  }
}

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
</style>