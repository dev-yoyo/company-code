<template>
  <router-view></router-view>
</template>

<script>
import frame from "./frame.vue";
import role from "./role.vue";

export default {
  name: "org",
  data() {
    return {};
  },
  components: {
    frame,
    role,
  },
};
</script>
