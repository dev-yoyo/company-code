<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="item d-flex" @click="nav('set_account')">
      <view class="l_name"> 账号设置 </view>
      <u-icon slot="right" name="arrow-right"></u-icon>
    </view>

    <view class="item d-flex" @click="nav('set_pwd')">
      <view class="l_name"> 密码设置 </view>
      <u-icon slot="right" name="arrow-right"></u-icon>
    </view>

    <view class="fixed_btm logout_btn" @click="logout"> 退出登录 </view>
  </view>
</template>

<script>
export default {
  data() {
    return {};
  },
  onShow() {},
  methods: {
    nav(name) {
      this.$Router.push({
        name: name,
      });
    },

    logout() {
      this.$u.vuex("vuex_user", "");
      this.$u.vuex("vuex_token", "");
      let _th = this;

      this.$refs.uToast.show({
        message: "退出成功",
        complete() {
          _th.$Router.replace({
            name: "login",
          });

          // uni.removeStorage({
          //   key: "start_ani",
          //   success: function (res) {
          //     console.log("success");
          //   },
          // });
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 130px;
}

.item {
  margin-bottom: 1px;
  justify-content: space-between;
  padding: 20px;
  background-color: #fff;

  .l_name {
    font-size: 14px;
    font-weight: 400;
    color: #333333;
  }

  .u-icon {
    font-size: 14px;
    color: #666666;
    font-weight: 600;
  }
}

.logout_btn {
  width: 100%;
  text-align: center;

  font-size: 15px;
  font-weight: 400;
  color: #333333;
}
</style>