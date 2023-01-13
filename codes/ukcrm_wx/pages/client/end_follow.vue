<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item>
          <view class="form_item d-between">
            <view class="l_label"> 客户 </view>
            <view class="r_info">{{ customer.name || "" }}</view>
          </view>
        </u-form-item>
        <u-form-item>
          <view class="form_item d-between">
            <view class="l_label"> 企业 </view>
            <view class="r_info">{{ customer.company || "" }}</view>
          </view>
        </u-form-item>

        <u-form-item>
          <view class="l_label"> 放弃原因 </view>
          <view>
            <u--textarea
              v-model="info.remarks"
              placeholder="请输入"
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
            ></u--textarea>
          </view>
        </u-form-item>
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <view class="fixed_btm btm_btns d-flex">
      <u-button type="default" @click="cancel" :customStyle="cancelStyle">
        取消
      </u-button>

      <u-button
        @click="overFollow"
        color="#4D6FFF"
        :loading="createLoading"
        :disabled="createLoading"
      >
        提交
      </u-button>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      cancelStyle: store.state.cancelStyle,
      customer_id: "",
      customer: {},
      info: {
        remarks: "",
      },
      rules: {
        // remarks: {
        //   type: "string",
        //   required: true,
        //   message: "请输入",
        //   trigger: ["blur", "change"],
        // }
      },
    };
  },
  onLoad() {
    let query = this.$Route.query;
    console.log("query >>>>", query);
    if (query.customer_id) {
      this.customer_id = query.customer_id;
      this.customer = query.customer;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  methods: {
    // 放弃跟进
    overFollow() {
      postData(`/customer/give_up_customer`, {
        customer_id: this.customer_id,
        visit_content: this.info.remarks,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 2 });
              uni.$emit("updateData", {});
            },
          });
        } else if (code === 422) {
          this.$u.toast(msg);
        }else {
          this.$u.toast(msg);
        }
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
}

.form_item {
  .l_label {
    position: relative;
    font-size: 14px;
    color: #666;
    line-height: 20px;

    text {
      position: absolute;
      left: -11px;
      color: #f56c6c;
      line-height: 20px;
      font-size: 20px;
      top: 3px;
    }
  }

  .r_info {
    font-size: 14px;
    font-weight: 600;
    color: #333333;
    text-align: right;
  }
}

.form_main {
  /deep/.u-form-item__body {
    padding: 14px 20px !important;
    padding-left: 26px !important;
  }

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
    font-size: 16px;
    font-weight: 600;
  }
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}

/deep/.u-textarea {
  padding: 10px 0 !important;
}
</style>