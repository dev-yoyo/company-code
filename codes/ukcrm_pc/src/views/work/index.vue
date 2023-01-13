<template>
  <router-view></router-view>
</template>

<script>
import target from "./target.vue";
import flow from "./flow.vue";
import cate from "./cate.vue";

export default {
  name: "work",
  data() {
    return {};
  },
  components: {
    target,
    flow,
    cate,
  },
};
</script>
