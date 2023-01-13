<template>
  <view class="search_box d-flex">
    <image
      class="logo"
      src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202110/16/h5%E5%9B%BE%E7%89%87/ebn.png"
      alt="易百纳技术社区"
    ></image>

    <view class="box d-flex">
      <u-search
        class="content"
        placeholder="请输入搜索内容"
        v-model="val"
        shape="square"
        bg-color="#fff"
        border-color="#D3D3D3"
        placeholder-color="#D6D6D6"
        :show-action="false"
      ></u-search>
      <view class="btn" @click="to_search()"
        ><i class="icon iconfont icon-ssk"></i
      ></view>
    </view>

    <view class="menus_box">
      <i class="icon iconfont icon-wuxupailie menu_icon" @tap="showList"></i>

      <view class="m_list" v-if="menuShow">
        <view class="item" @tap="route('home')">
          <i class="icon iconfont icon-icon-sy-off"></i>
          回到首页
        </view>

        <view class="item" @tap="route('my')">
          <i class="icon iconfont icon-icon-wd2-off"></i>
          个人中心
        </view>

        <view class="item" @tap="route('msg')">
          <i class="icon iconfont icon-wdxx"></i>
          消息中心
        </view>

        <view class="item" @tap="route('my_gift')">
          <i class="icon iconfont icon-lpdh"></i>
          礼品兑换
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";

export default {
  props: ["page"],
  name: "search_box",
  data() {
    return {
      val: "",
      is_empty: false,
      menuShow: false,
    };
  },
  mounted() {
    if (this.page == "search") {
      this.val = this.$Route.query.search || "";
    }
  },
  methods: {
    to_search() {
      if (this.page == "search") {
        this.$Router.replace({
          name: "search",
          params: {
            search: this.val || "",
            page: this.page || "",
          },
        });
      } else {
        this.$Router.push({
          name: "search",
          params: {
            search: this.val || "",
            page: this.page || "",
          },
        });
      }
    },

    showList() {
      this.menuShow = !this.menuShow;
    },
    route(name) {
      if (name != "home") {
        if (!authStatus()) return;
      }

      this.$Router.push({ name });
    },
  },
};
</script>

<style lang="scss">
.search_box {
  padding: 22rpx 30rpx;
  background: #fff;
  border-bottom: 4rpx solid #f4f4f4;
  .logo {
    height: 44rpx;
    width: 68rpx;
    margin-right: 26rpx;
  }
  .box {
    flex: 1;
    /deep/ .u-content {
      border-radius: 8rpx 0 0 8rpx !important;
    }
    /deep/ .u-icon-wrap {
      display: none;
    }
  }

  .btn {
    height: 64rpx;
    width: 68rpx;
    line-height: 64rpx;
    text-align: center;
    background: #0268fa;
    border-radius: 0 8rpx 8rpx 0;
    color: #fff;
  }

  .menus_box {
    position: relative;
    .menu_icon {
      margin-left: 25rpx;
      font-size: 40rpx;
      color: #333;
    }

    .m_list {
      position: absolute;
      right: 0;
      top: 70rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20rpx;
      background-color: #fff;
      box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
      z-index: 1;

      .item {
        padding: 10rpx 0;
        display: flex;
        align-items: center;
        white-space: nowrap;
        line-height: 1;
        font-size: 26rpx;
        color: #333;

        .iconfont {
          margin-right: 10rpx;
        }
      }
    }
  }
}
</style>
