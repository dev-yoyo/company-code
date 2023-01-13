<template>
  <view class="battery">
    <view class="wave1"></view>
    <view
      class="wave2"
      :style="{
        top: percent + '%',
      }"
    ></view>
    <view
      class="wave3"
      :style="{
        top: percent + '%',
      }"
    ></view>
  </view>
</template>

<script>
export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
};
</script>


<style lang="less" scoped>
.battery {
  position: relative;
  border: 1px solid silver;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  line-height: 50px;
  margin: 0 auto;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
  transform:rotate(0deg);
  -webkit-transform:rotate(0deg);
  animation: water-wave linear infinite;
   background: #fff7f0;
}

.wave1 {
  position: absolute;
  top: 40%;
  left: -50%;
  background: rgba(246, 181, 77, 0.4);
  // background-color: rgba(91, 122, 250, 0.6);
  width: 200%;
  border-radius: 40%;
  animation: inherit;
  animation-duration: 5s;
  overflow: hidden;
}
.wave2 {
  position: absolute;
  top: 40%;
  left: -52%;
  background: rgba(246, 181, 77, 0.4);
  // background-color: rgba(91, 122, 250, 0.4);
  width: 200%;
  height: 200%;
  border-radius: 35%;
  animation: inherit;
  animation-duration: 7s;
}
.wave3 {
  position: absolute;
  top: 50%;
  left: -35%;
  background: rgba(246, 181, 77, 0.4);
  // background-color: rgba(91, 122, 250, 0.2);
  width: 200%;
  height: 200%;
  border-radius: 33%;
  animation: inherit;
  animation-duration: 11s;
}
@keyframes water-wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>