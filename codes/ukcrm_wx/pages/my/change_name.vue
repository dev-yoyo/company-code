<template>
  <view class="login_detail">
    <view class="form_main">
      <u-form ref="uForm" :model="info" :rules="rules" :error-type="['toast']">
        <u-form-item prop="name">
          <u--input
            placeholder="请输入内容"
            border="none"
            v-model="info.name"
            @confirm="confirm"
            clearable
          ></u--input>
        </u-form-item>
      </u-form>
    </view>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";

export default {
  data() {
    return {
      info: {
        name: "",
      },
      rules: {
        name: [
          {
            type: "string",
            required: true,
            message: "请输入姓名",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              if (value.length > 4) {
                return false;
              }
            },
            message: "姓名限制4个字符",
            trigger: ["change", "blur"],
          },
        ],
      },
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
    confirm(e) {
      this.$refs.uForm.validate().then((res) => {
        postData("/user", {
          name: this.info.name,
        }).then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            uni.$u.toast(msg);
            uni.navigateBack({ delta: 1 });
          } else if (code === 422) {
            uni.$u.toast(msg);
          } else {
            uni.$u.toast(msg);
          }
        });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.form_main {
  padding-top: 10px;

  /deep/.u-form-item__body {
    padding-left: 26px !important;
    padding-right: 20px !important;
  }

  .name {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }

  .grey {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #666666;
  }
}
</style>