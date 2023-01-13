<template>
  <view class="wrap">
    <!-- 列表数据 -->
    <view class="n_ul" v-if="needsProList.length > 0">
      <u-swipe-action
        :show="item.show"
        :index="index"
        v-for="(item, index) in needsProList"
        :key="item.id"
        :btn-width="120"
        :options="options"
        @click="click"
        @open="open"
      >
        <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
        <view
          class="n_li title-wrap"
          :class="item.disabled ? 'is_down_bgc' : ''"
          @tap="to_detail(item.id)"
        >
          <view class="li_title">
            <view class="tit_type yellow">
              {{ item.type ? item.type : "暂无" }}
            </view>
            {{ item.title }}
          </view>

          <view class="info_box d-flex">
            <view class="info_li">
              <view class="tit">需求预算：</view>
              <view class="content money">{{
                item.budget ? "￥" + item.budget : "商议"
              }}</view>
            </view>
            <view class="info_li">
              <view class="tit">业务区域：</view>
              <view class="content">{{
                item.area ? item.area.name : "全国"
              }}</view>
            </view>
          </view>

          <view class="dashed_line"></view>

          <view class="info_box d-flex">
            <view class="info_li">
              <view class="tit">截止日期：</view>
              <view class="content">{{
                item.closing_timing ? item.closing_timing : "暂无"
              }}</view>
            </view>
            <view class="info_li">
              <i class="icon iconfont icon-yj"></i>
              {{ item.view_count ? item.view_count : 0 }}
            </view>
          </view>

          <view class="is_down" v-if="item.disabled"> 已下线 </view>
        </view>
      </u-swipe-action>
    </view>
    <lack v-else></lack>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

    <view class="create_btn" @tap="create">
      <image src="@/static/common/img/create_icon.png" />
      发布
    </view>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";
export default {
  data() {
    return {
      page: 1,
      list_show: true,
      needsProList: [],
      next_page: true,
      scrollTop: 0,
      options: [
        {
          text: "编辑",
          style: {
            backgroundColor: "#0268fa",
          },
        },
        {
          text: "下线",
          style: {
            backgroundColor: "#dd524d",
          },
        },
      ],
    };
  },
  onShow() {
    this.getList();
  },
  methods: {
    click(index, index1) {
      if (index1 == 1) {
        this.needsProList[index].show = false;
        // this.$u.toast(`下线成功`);
        if (this.needsProList[index].n_status == "已下线") return;
        this.changeStatus(this.needsProList[index].id);
      } else {
        console.log("编辑");
        if (!authStatus()) return;
        let item_id = this.needsProList[index].id;
        this.$Router.push({
          name: "needs_edit",
          params: { id: item_id },
        });
      }
    },
    // 如果打开一个的时候，不需要关闭其他，则无需实现本方法
    open(index) {
      // 先将正在被操作的swipeAction标记为打开状态，否则由于props的特性限制，
      // 原本为'false'，再次设置为'false'会无效
      this.needsProList[index].show = true;
      this.needsProList.map((val, idx) => {
        if (index != idx) this.needsProList[idx].show = false;
      });
    },
    async getList() {
      await this.$u.api
        .getUserDemand({
          page: this.page,
        })
        .then((res) => {
          const { code, data } = res;

          if (code === 200) {
            let list = data.data;
            let arr = list.data;
            arr.forEach((e) => {
              e.show = false;
              e.disabled = e.n_status != "进行中" ? true : false;
            });
            console.log(arr);
            list.data = arr;

            if (this.page != 1) {
              this.needsProList = this.needsProList.concat(arr);
            } else {
              this.needsProList = arr;
            }
            this.next_page = list.next_page_url ? true : false;
          }
        });
    },

    // 下线
    async changeStatus(id) {
      if (!authStatus()) return;

      await this.$u.api
        .demandDetailStatus({
          status: "已下线",
          id,
        })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;

          if (code === 200) {
            this.$u.toast(msg);
            this.getList();
          } else if (code === 422) {
            this.$u.toast({
              title: msg,
              icon: "none",
            });
          }
        });
    },

    to_detail(id) {
      if (!authStatus()) return;

      this.$Router.push({
        name: "needs_detail",
        params: { id },
      });
    },
    create() {
      if (!authStatus()) return;

      this.$Router.push({
        name: "needs_create",
      });
    },

    onReachBottom() {
      if (!this.next_page) return;
      this.page = this.page + 1;
      this.getList();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
.create_btn {
  position: fixed;
  top: 834rpx;
  right: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  background: #0268fa;
  box-shadow: 0px 6rpx 12rpx rgba(7, 54, 213, 0.38);
  border-radius: 50%;
  font-size: 20rpx;
  color: #fff;
  text-align: center;

  image {
    width: 40rpx;
    height: 38rpx;
  }
}

/* 项目需求 */
.n_ul {
  padding: 24rpx 16rpx;

  .n_li {
    position: relative;
    // margin-bottom: 20rpx;
    padding: 30rpx 30rpx 40rpx;
    background: #ffffff;
    border-radius: 6rpx;
    overflow: hidden;

    .li_title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: 35rpx;

      margin-bottom: 25rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;

      .tit_type {
        position: relative;
        top: -6rpx;
        display: inline-block;
        margin-right: 10rpx;
        padding: 0 9rpx;
        height: 34rpx;
        line-height: 34rpx;
        border-radius: 6rpx;
        font-size: 20rpx;
        color: #fefefe;
        text-align: center;
        white-space: nowrap;
      }

      .yellow {
        background: #fe9f17;
      }
    }

    .info_box {
      justify-content: space-between;

      .info_li {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        line-height: 1;
        white-space: nowrap;

        .tit {
          color: #1b4fa8;
        }

        .content {
          color: #333333;
        }

        .icon {
          color: #999;
          font-size: 24rpx;
        }
      }

      .money {
        color: #ff0101 !important;
      }
    }

    .dashed_line {
      margin: 30rpx 0;
      width: 100%;
      border-top: 1rpx dashed #cccccc;
    }

    .is_down {
      transform: rotate(45deg);
      position: absolute;
      top: 10rpx;
      right: -68rpx;
      width: 200rpx;
      height: 45rpx;
      line-height: 45rpx;
      font-size: 24rpx;
      font-weight: 500;
      color: #cbcbcb;
      text-align: center;
      background: #e6e6e6;
    }
  }

  .is_down_bgc {
    opacity: 0.6;

    .yellow {
      color: #cbcbcb !important;
      background: #e6e6e6 !important;
    }
  }
}

/deep/ .u-swipe-action {
  margin-bottom: 20rpx;
}
</style>
