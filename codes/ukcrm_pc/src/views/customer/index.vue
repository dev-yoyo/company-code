<template>
  <div class="com_body_main">
    <left-menu></left-menu>
    <top-nav :active_title="active"></top-nav>

    <div class="com_left_detail">
      <router-view @change="change"></router-view>
    </div>
  </div>
</template>

<script>
import store from "@/store";

export default {
  name: "customer",
  data() {
    return {
      menuList: [],
      active: "",
    };
  },
  created() {
    // this.menuList = store.state.menuList;
    this.change()
  },
  methods: {
    change(detail, v) {
      if (detail) {
        this.active = v;
      } else {
        this.active = this.currentName;
      }
    },
  },
  computed: {
    currentName() {
      let route_name = this.$store.getters.currentRouteName;
      // console.log("route_name <<<<<<<<<<", route_name);
      let name = "客户管理";
      switch (route_name) {
        case "my_customer":
          name = "客户管理 / 我的客户";
          break;

        case "seas_customer":
          name = "客户管理 / 公海池";
          break;

        case "recycle_customer":
          name = "客户管理 / 回收站";
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