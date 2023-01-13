<template>
  <view class="system">
    <view class="pdf_box" v-for="(v,k) in list" :key="k">
      <view class="pdf_title" @click="change(v)">
        <span>{{v.name}}</span>
        <u-icon name="arrow-down" v-if="v.show"></u-icon>
        <u-icon name="arrow-up" v-else></u-icon>
      </view>
      <view class="pdf_list" v-if="v.show">
        <view class="pdf_item" v-for="(item) in v.children"
      :key="item.id" @click="to(item)">{{item.name}}</view>
      </view>
    </view>
    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>
  </view>
</template>

<script>
import store from "@/store";
import { intervalTime } from "@/common/hooks.js";

export default {
  data() {
    return {
      scrollTop: 0,
      list:[],
      idx_list:[]
    };
  },
  onShow() {
    this.get_list();
  },
  methods: {
    get_list() {
      this.$u.api.getSystemList().then((res) => {
        const {
          code,
          data: { data },
        } = res;
        if (code === 200) {
          this.list = []
          this.idx_list = []
          for(var i in data){
            this.idx_list.push(i)
            this.list.push({
              name:i,
              children: data[i],
              show:true
            })
          }
        }
        uni.stopPullDownRefresh();
      });
    },
    change(v) {
      v.show = !v.show
    },
    to(v) {
      this.$Router.push({
        path: "/system_view",
        query:{
          url: v.url
        }
      });
    }
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop;
  },
};
</script>

<style lang="scss">
  .system {
    .pdf_box {
      margin-bottom: 10rpx;
    }

    .pdf_title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff!important;
      padding:0 68rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #333333;
      height: 90rpx;
      line-height: 90rpx;
      margin-bottom: 2rpx;
    }

    .pdf_list {
      width:100%;
      background-color: #fff!important;
      font-size: 28rpx;
      padding:20rpx 0;
      color: #4A94FF;
      .pdf_item {
        padding:0 64rpx;
        height: 90rpx;
        line-height: 90rpx;
        cursor: pointer;
      }
    }
  }

</style>