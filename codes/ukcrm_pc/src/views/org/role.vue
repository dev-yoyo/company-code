<template>
  <div class="com_body_main">
    <div class="com_left_detail">
      <setting-menu :activeMenu="activeMenu"></setting-menu>
      <top-nav active_title="角色权限" type="2"></top-nav>

      <div class="content_main">
      </div>
    </div>
  </div>
</template>

<script>
import { delData, getData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      activeMenu: "role",
    };
  },
  components: {

  },
  created() {

  },
  methods: {
    
  },
};
</script>

<style lang="less" scoped>

</style>
