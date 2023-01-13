<template>
  <view class="detail">
    <!-- 拜访计划 -->
    <view class="visit_plan_box" v-if="followList.length > 0">
      <view class="item d-between" v-for="(v, i) in followList" :key="i">
        <view class="l_info">
          <view class="info">
            <view class="label">拜访目的：</view>
            <view class="txt">{{ v.visit_type_name }}</view>
          </view>
          <view class="info">
            <view class="label">拜访备注：</view>
            <view class="txt u-line-1">
              {{ v.remarks || "" }}
            </view>
          </view>
        </view>
        <view class="r_info">
          <view class="type">{{
            v.visit_type == 0 ? "线上拜访" : "线下拜访"
          }}</view>
          <view class="time">{{ v.visit_time_m }}</view>
        </view>
      </view>
    </view>

    <view class="slogan" v-else>
      <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

      <view class="txt"> 暂无数据 </view>
    </view>
  </view>
</template>

<script>
import { getData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      customer_id: "",
      page: 1,
      next_page: true,
      followList: [],
      followImg: `${store.state.ossBaseUrl}direct/resource/202201/24/RZQxHKKk4QQNiP5r2Xzw2tFQGbwddW7r1643006142167.png`,
      noData: store.state.no_data,
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);
    if (query.customer_id) {
      this.customer_id = query.customer_id;
      this.init();
    }
  },
  methods: {
    init() {
      this.getFollowList();
    },
    // 跟进记录
    getFollowList() {
      getData("/visit/visit_list", {
        params: {
          page: this.page,
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();

          if (this.page != 1) {
            this.followList = this.followList.concat(list.data);
          } else {
            this.followList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    onReachBottom() {
      if (!this.next_page) {
        this.$u.toast('暂无更多数据');
        return
      };
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      this.page = this.page + 1;
      this.init();
      setTimeout(() => {
        uni.hideLoading()
      }, 1000)
    },
    onPullDownRefresh() {
      this.page = 1;
      this.init();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 130px;
}

.visit_plan_box {
  padding: 20px 15px;
  .item {
    margin-bottom: 14px;
    padding: 20px 16px;
    width: 100%;
    background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/aEx2NanfnHNXrcGxhmQhhbxjh3QQzHaS1646187903646.png");
    background-size: 100% 100%;

    box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.06);
    border-radius: 6px;

    .l_info {
      .info {
        display: flex;
        margin-bottom: 4px;
        width: 204px;

        .label {
          font-size: 12px;
          color: #999;
          flex-shrink: 0;
        }
        .txt {
          font-size: 12px;
          color: #666;
        }
      }
    }

    .r_info {
      .type {
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #333333;
      }

      .time {
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        color: #4d6fff;
      }
    }
  }
}

.slogan {
  padding: 94px 0 0;
}
</style>