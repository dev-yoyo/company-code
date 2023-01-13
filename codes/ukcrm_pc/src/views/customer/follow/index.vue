<template>
  <div class="com_body_main">
    <left-menu></left-menu>
    <top-nav></top-nav>
    
    <div class="com_left_detail">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import mycustomer from "./myCustomer.vue";
import seascustomer from "./seasCustomer.vue";

export default {
  name: "customer",
  data() {
    return {};
  },
  components: {
    mycustomer,
    seascustomer,
  },
  created: function () {},
  methods: {},
  // computed: {
  //   currentName() {
  //     let route_name = this.$store.getters.currentRouteName;
  //     // console.log("route_name", route_name);
  //     return route_name;
  //   },
  // },
};
</script>

<style lang='less' scoped>
.com_right_main {
  justify-content: space-between;
  padding: 0;
  border-top: 1px solid #fff;
}

</style>