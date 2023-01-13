<template>
  <view>
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
import store from "@/store";
export default {
  data() {
    return {
      fileUrl:'',
      viewerUrl: '/hybrid/html/web/viewer.html',
      url:''
    };
  },
  mounted() {
      this.fileUrl = this.$Route.query.url || ''
      this.url = `${this.viewerUrl}?file=${encodeURIComponent(this.fileUrl)}`
  },

};
</script>

<style>
</style>