<template>
  <view class="detail">
    <view
      class="item d-flex"
      v-for="(v, i) in msgList"
      :key="i"
      @click="detail(i)"
    >
      <view class="imgs">
        <u-avatar
          :src="v.img"
          :size="44"
          bg-color="#4D6FFF"
          mode="aspectFit"
        ></u-avatar>

        <view class="badge_box">
          <u-badge type="error " max="99" :value="v.count"></u-badge>
        </view>
      </view>

      <view class="r_main">
        <view class="info_txt d-flex">
          <view class="name"> {{ v.name }} </view>

          <view class="time">{{ v.created_at }}</view>
        </view>
		
		<view class="tips u-line-1" v-if="v.content_type == 17">
			<rich-text :nodes="v.content"></rich-text>
		</view>
        <view v-else class="tips u-line-1">{{ v.content }}</view>
      </view>
    </view>

    <!-- XXX小助手 -->
    <!-- 业务流提醒 -->
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      role_id: null,
      info: {},
      msgList: [],
      img0: `${store.state.ossBaseUrl}direct/resource/202201/20/4tK3hwfCtGseYX6QcxriYsFTAzmpZS841642647136330.png`,
      img1: `${store.state.ossBaseUrl}direct/resource/202201/20/FjPMNjN2GQT6mBm5WH5YBzncbh4BScGB1642647188600.png`,
      img2: `${store.state.ossBaseUrl}direct/resource/202201/20/rNsAcBsfGZHmZ6cfn67Ct3aC6ypriFxC1642647208438.png`,
      img3: `${store.state.ossBaseUrl}res/images/202210/31/1Sc8uYLOL8VIWC9qfyMlBr4ze7YJv0iOuxuUHgA7.png`,
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      let _th = this;
      getData("/message").then((res) => {
        const { code, data } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();

          let arr = data.list;
          arr.map((e, i) => {
            if (i == 0) {
              e.img = _th.img0;
              e.name = "待办助手";
            } else if (i == 1) {
              e.img = _th.img1;
              e.name = "友客帮小助手";
            } else if (i == 2) {
              e.img = _th.img2;
              e.name = "业务流提醒";
            } else if (i == 3) {
              e.img = _th.img3;
              e.name = "跟进评论";
            }
          });
          this.msgList = arr;
        }
      });
    },

    detail(i) {
      if (i == 0) {
        this.$Router.push({
          name: "agency",
        });
      } else if (i == 1) {
        this.$Router.push({
          name: "system",
        });
      } else if (i == 2) {
        this.$Router.push({
          name: "workflow",
        });
      } else if (i == 3) {
        this.$Router.push({
          name: "follow",
        });
      }
    },

    onPullDownRefresh() {
      this.page = 1;
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.item {
  padding: 20px 15px;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;

  .imgs {
    position: relative;

    .badge_box {
      position: absolute;
      top: -5px;
      right: -10px;
    }
  }

  .r_main {
    margin-left: 16px;
    width: 100%;
    overflow: hidden;

    .info_txt {
      margin-bottom: 8px;
      justify-content: space-between;
      line-height: 1;

      .name {
        font-size: 15px;
        font-weight: 600;
        color: #333333;
      }

      .time {
        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
    }

    .tips {
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
      color: #999999;
    }
  }
}
</style>