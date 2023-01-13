<template>
  <view class="detail">
    <view v-if="msgList.length > 0">
      <view class="item" v-for="(v, i) in msgList" :key="i">
        <view class="top_time d-flex" v-if="v.date_time">
          <view class="time"> {{ v.date_time }} </view>
        </view>

        <view class="msg_item d-flex">
          <view class="img_box">
            <u-avatar
              :src="img"
              :size="44"
              bg-color="#4D6FFF"
              mode="aspectFit"
            ></u-avatar>
          </view>

          <view class="r_main">
            <view class="content">{{ v.content }}</view>

            <view class="btm_btns d-flex" v-if="v.content_type == 10">
              <view class="btn is_confirm" @click="offerDetail(v)">
                查看详情
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="slogan" v-else>
      <u-avatar :src="slogan" :size="128" mode="aspectFit"></u-avatar>
      <view class="txt"> 暂无消息 </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
export default {
  data() {
    return {
      msgList: [],
      page: 1,
      next_page: true,
      scrollTop: 0,
      first: true,

      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/rNsAcBsfGZHmZ6cfn67Ct3aC6ypriFxC1642647208438.png",
      slogan:
        "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/yfKS2XWyKxY5HwynQRDxz66zdc4de2ZM1642734415658.png",
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      // 产品信息
      getData("/message/workflow_remind", {
        params: {
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          let arr = list.data.reverse();

          if (this.page != 1) {
            this.msgList = arr.concat(this.msgList);
          } else {
            this.msgList = arr;
          }

          this.page++;
          this.next_page = list.next_page_url ? true : false;

          if (this.first) {
            this.$nextTick(function () {
              uni.pageScrollTo({
                scrollTop: 99999999,
              });
            });
            this.first = false;
          }
        }
      });

      postData("/message", {
        type: 2,
      }).then((res) => {});
    },

    addClient() {
      if (!this.role_id) {
        this.$u.toast("暂无企业");
        return;
      }

      this.$Router.push({
        name: "create_client",
      });
    },

    offerDetail(v) {
      this.$Router.push({
        path: `/offer_detail/${v.content_id}`,
        query: {
          offer_id: v.content_id,
        },
      });
    },

    onPageScroll(e) {
      if (!this.next_page) return uni.stopPullDownRefresh();
      if (e.scrollTop <= 0) {
        uni.showLoading({
          title: "加载中",
          mask: true,
        });
        this.init();
        setTimeout(() => {
          uni.hideLoading()
        }, 1000)
      }
    },
    onPullDownRefresh() {
      if (!this.next_page) return uni.stopPullDownRefresh();
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 18px 15px;
}

.item {
  margin-bottom: 30px;

  .top_time {
    margin-bottom: 30px;
    justify-content: center;

    .time {
      padding: 0 17px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      background-color: #fff;
      border-radius: 20px;

      font-size: 12px;
      font-weight: 400;
      color: #999999;
    }
  }

  .msg_item {
    .img_box {
      flex-shrink: 0;
    }

    .r_main {
      margin-left: 11px;
      width: 100%;
      background-color: #fff;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.04);
      border-radius: 10px;
      font-size: 14px;
      font-weight: 400;
      line-height: 20px;
      color: #333333;

      .content {
        padding: 20px 15px;
      }

      .btm_btns {
        height: 40px;
        line-height: 40px;
        border-top: 1px solid #e8e8e8;
        text-align: center;

        .btn {
          width: 100%;
          font-size: 14px;
          font-weight: 400;
          color: #316ec3;
        }

        .cancel {
          border-right: 1px solid #e8e8e8;
        }

        .is_confirm {
          color: #666666;
        }
      }
    }
  }
}

.slogan {
  padding: 237px 0 0;
}
</style>