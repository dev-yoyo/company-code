<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
    <view class="com_tit">请选择解散原因 </view>
    <view class="check_main">
      <u-radio-group v-model="radiovalue" placement="column">
        <u-radio
          :customStyle="{ marginBottom: '15px' }"
          v-for="(v, i) in radiolist"
          :key="i"
          :label="v.value"
          :name="v.name"
          labelColor="#333"
          :labelSize="14"
        >
        </u-radio>
      </u-radio-group>
    </view>

    <view class="com_tit">补充说明 </view>
    <view class="supplement_main">
      <u--textarea
        v-model="supplement"
        placeholder="请填写补充说明，帮助友客做的更好…"
        placeholderStyle="#999999"
        fontSize="14"
        border="none"
      ></u--textarea>
    </view>

    <view class="new_fixed_btm">
      <u-button :customStyle="cancelStyle" @click="navback"> 取消 </u-button>
      <u-button @click="pwdShow = true"> 确定 </u-button>
    </view>

    <!-- 密码确认 -->
    <view class="pwd_modal">
      <u-modal :show="pwdShow" :showConfirmButton="false">
        <view class="end_company_box slot-content">
          <view class="content">
            为了保障企业数据安全，操作前需要 验证您的友客登录密码
          </view>

          <u-input
            type="password"
            v-model="pwd"
            placeholder="请输入密码"
            placeholderStyle="#999999"
            fontSize="14"
          ></u-input>

          <view class="btm_btns d-center">
            <view class="btn cancel" @click="pwdShow = false"> 取消 </view>
            <view class="btn" @click="confirmPwd"> 确定 </view>
          </view>
        </view>
      </u-modal>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import { navback } from "@/common/hooks";
import store from "@/store";

export default {
  data() {
    return {
      cancelStyle: store.state.cancelStyle,
      createLoading: false,
      radiolist: [
        {
          name: 0,
          value: "不知道如何使用",
        },
        {
          name: 1,
          value: "使用其他crm软件",
        },
        {
          name: 2,
          value: "功能不符合公司业务",
        },
        {
          name: 3,
          value: "创建错误",
        },
        {
          name: 4,
          value: "其他",
        },
      ],
      radiovalue: 0,
      reason: "",
      supplement: "", // 补充说明

      pwdShow: false,
      pwd: "",
    };
  },
  methods: {
    // 解散企业
    confirmPwd() {
      postData("/company/dissolution_company", {
        dissolution_reason: this.radiolist[this.radiovalue].value,
        supplement: this.supplement,
        password: this.pwd,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.dissolveShow = false;
          uni.navigateBack({ delta: 2 });
          uni.$emit("updateData", {
            type: "diss_company",
          });
        } else if (code === 422) {
          this.$u.toast(msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 120px;
}

.com_tit {
  padding: 16px 20px 9px;
  font-size: 13px;
  font-weight: 400;
  line-height: 18px;
  color: #333333;
}

.check_main {
  padding: 26px 20px;
  background-color: #fff;

  /deep/.u-radio {
    margin-bottom: 15px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f4f4f4;
  }
}

.supplement_main {
  padding: 20px;
  background-color: #fff;
}

/deep/.u-textarea {
  padding: 0;
  height: 264px;
}

.new_fixed_btm {
  /deep/.u-button {
    width: 100%;
    height: 45px;
    font-size: 16px;
    color: #fff;
    background: #4d6fff;
    border-radius: 23px;
  }
}

.pwd_modal {
  /deep/.u-modal__content {
    padding: 0 !important;
  }

  .end_company_box {
    padding: 34px 30px 20px;
    width: 100%;
    text-align: center;

    .content {
      padding: 0 19px;
      font-size: 14px;
      font-weight: 400;
      line-height: 18px;
      color: #666666;
      text-align: center;
    }

    /deep/.u-input {
      margin: 15px 0;
      height: 34px;
      border: 1px solid #f2f2f2;
      border-radius: 8px;
    }

    .btm_btns {
      margin-top: 24px;
      width: 100%;

      .btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 17px;
        color: #ffffff;
        text-align: center;
        background: #4d6fff;
        border-radius: 8px;
      }

      .cancel {
        margin-right: 25px;
        color: #333;
        background: #fff;
        border: 1px solid #d8d8d8;
      }
    }
  }
}
</style>