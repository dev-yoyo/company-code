<template>
  <view class="main">
    <!-- auth 页面 -->
  </view>
</template>

<script>
import { getUrlParam } from "@/common/hooks.js";

export default {
  data() {
    return {
      code: "",
      info: "",
    };
  },
  created() {
    this.code = getUrlParam("code");

    this.getUInfo();
  },
  methods: {
    async getUInfo() {
      await this.$u.api
        .getUserInfo({
          code: this.code,
        })
        .then((res) => {
          const {
            code,
            data: { data },
          } = res; 

          if (code === 200) {
            this.$u.vuex("vuex_user", data.userInfo);
            this.$u.vuex("vuex_token", data.jwt_token);
            this.$u.vuex("status", data.status);
            this.$u.vuex("openid", data.openid);
            this.$u.vuex("provider", data.provider);

            let href = uni.getStorageSync("href");
            // console.log("之前的路由地址 href >>>>>>>", href);
            location.href = href;
          }
        });
    },

    // import { mapActions } from "vuex";
    // this.handleLogin(data);
    // ...mapActions(["handleLogin"]),
  },
};
</script>

<style lang="scss" scoped>
.main {
  width: 100vw;
  height: 100vh;
  background-color: #fff;
}
</style>