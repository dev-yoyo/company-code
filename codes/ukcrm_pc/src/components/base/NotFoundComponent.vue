<template>
  <div class="main_box">
    <img class="bgc_img" src="../../assets/images/404_bgc.png" alt="" />
    <div class="txtbox">
      <div class="txt_title">404</div>

      <div class="txt_content">哎呀，您访问的页面不见了……</div>
      <div class="txt_content2">
        Sorry, the page you are looking for does not exist!
      </div>

      <a class="homt_btn" href="/">返回首页</a>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    go_back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.main_box {
  display: flex;
  justify-content: center;

  .txtbox {
    color: #fff;

    .txt_title {
      margin: 100px 0 20px;
      font-size: 64px;
      line-height: 1;
    }

    .txt_content {
      margin-block-end: 20px;
      font-size: 25px;
      line-height: 1;
    }

    .txt_content2 {
      font-size: 16px;
      line-height: 1;
    }

    .homt_btn {
      display: block;
      margin-top: 20px;
      width: 118px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      border: 1px solid #fff;
      border-radius: 16px;
      color: #fff;
      font-size: 16px;
    }
  }
}
.bgc_img {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
}
</style>