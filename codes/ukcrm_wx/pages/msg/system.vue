<template>
  <view class="detail">
    <view v-if="msgList.length > 0">
      <view class="item" v-for="(v, i) in msgList" :key="i">
        <view class="top_time d-flex" v-if="v.date_time">
          <view class="time"> {{ v.date_time }} </view>
        </view>

        <view class="msg_item ">
          <view class="img_box">
            <u-avatar
              :src="img"
              :size="44"
              bg-color="#4D6FFF"
              mode="aspectFit"
            ></u-avatar>
          </view>

          <view class="r_main">
            <!-- 邀请你加入企业 -->
            <view class="join_box" v-if="v.content_type == 1">
              <view class="content">{{ v.content }}</view>

              <view class="btm_btns d-flex">
                <view
                  class="btn cancel"
                  @click="invite_err(v)"
                  v-if="v.relation.status == 0"
                >
                  拒绝
                </view>
                <view
                  class="btn"
                  @click="invite_confirm(v)"
                  v-if="v.relation.status == 0"
                  >同意</view
                >

                <view class="btn is_confirm" v-if="v.relation.status == 1">
                  已同意
                </view>
                <view class="btn is_confirm" v-if="v.relation.status == 2">
                  已拒绝
                </view>
                <view class="btn is_confirm" v-if="v.relation.status == 4">
                  已失效
                </view>
              </view>
            </view>
            <!-- 邀请你加入企业 -->
			
			<view class="content" v-else-if="v.content_type == 17">
				<rich-text :nodes="v.content"></rich-text>
			</view>
            <view class="content" v-else>{{ v.content }}</view>
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
import store from "@/store";

export default {
  data() {
    return {
      msgList: [],
      page: 1,
      next_page: true,
      scrollTop: 0,
      first: true,

      img: `${store.state.ossBaseUrl}direct/resource/202201/20/FjPMNjN2GQT6mBm5WH5YBzncbh4BScGB1642647188600.png`,
      slogan: `${store.state.ossBaseUrl}direct/resource/202201/21/yfKS2XWyKxY5HwynQRDxz66zdc4de2ZM1642734415658.png`,
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      // 产品信息
      getData("/message/system_notice", {
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
        type: 1,
      }).then((res) => {});
    },

    // 添加客户
    addClient() {
      if (!this.role_id) {
        this.$u.toast("暂无企业，无法添加");
        return;
      }

      this.$Router.push({
        name: "create_client",
      });
    },

    // 同意 邀请企业
    invite_confirm(v) {
      postData("/company/agree_join_company", {
        company_id: v.relation.company_id,
        content_id: v.relation.id,
        status: 1,
      })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$u.toast(msg);
            this.init();
          } else if (code === 422) {
            this.$u.toast(msg);
          }
        })
        .catch(() => {
          //   uni.$u.toast("操作失败，请重试");
        });
    },
    // 拒绝 邀请企业
    invite_err(v) {
      postData("/company/agree_join_company", {
        company_id: v.relation.company_id,
        content_id: v.relation.id,
        status: 2,
      })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$u.toast(msg);
            this.init();
          } else if (code === 422) {
            this.$u.toast(msg);
          }
        })
        .catch(() => {
          //   uni.$u.toast("操作失败，请重试");
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
	  display: flex;
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
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333333;
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

      .join_box {
        .content {
          text-align: center;
        }
      }
    }
  }
}

.slogan {
  padding: 237px 0 0;
}
</style>