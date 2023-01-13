<template>
  <div class="com_body_main">
    <left-menu></left-menu>
    <top-nav :active_title="currentName"></top-nav>

    <div class="com_left_detail">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "return",
  data() {
    return {};
  },
  created: function () {},
  methods: {},
  computed: {
    currentName() {
      let route_name = this.$store.getters.currentRouteName;
      // console.log("route_name <<<<<<<<<<", route_name);
      let name = "交易管理";
      switch (route_name) {
        case "offer":
          name = "交易管理 / 报价";
          break;

        case "contract":
          name = "交易管理 / 合同";
          break;

        case "returnMoney":
          name = "交易管理 / 回款";
          break;

        default:
          break;
      }

      return name;
    },
  },
};
</script>

<style lang='less' scoped>
.com_right_main {
  justify-content: space-between;
  padding: 0;
  border-top: 1px solid #fff;
}
</style>