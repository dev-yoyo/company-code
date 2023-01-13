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
            <!-- 申请加入企业 -->
            <view class="join_box" v-if="v.content_type == 0">
              <view class="content">{{ v.content }}</view>

              <view class="btm_btns d-flex">
                <view
                  class="btn cancel"
                  @click="join_err(v)"
                  v-if="v.relation.status == 0"
                >
                  拒绝
                </view>
                <view
                  class="btn"
                  @click="join_confirm(v)"
                  v-if="v.relation.status == 0"
                >
                  同意
                </view>

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
            <!-- 申请加入企业 -->

            <!-- 报价申请 -->
            <view class="price_box" v-else-if="v.content_type == 2">
              <view class="content" @click="offerDetail(v)">
                <view class="top">
                  <view class="top_title d-flex"
                    ><i class="icon iconfont icon-sp12"></i>审批</view
                  >
                  <view class="top_give"
                    >{{ v.relation.user.name }}提交的报价申请</view
                  >
                </view>
                <view class="price_item d-flex">
                  <view class="l_label">所在部门：</view>
                  <view class="r_txt">
                    {{ v.relation.user.department_name }}
                  </view>
                </view>
                <view class="price_item d-flex">
                  <view class="l_label">客户名称：</view>
                  <view class="r_txt">
                    {{ v.relation.customer.name }}
                  </view>
                </view>
                <view class="price_item d-flex">
                  <view class="l_label">关联企业：</view>
                  <view class="r_txt">
                    {{ v.relation.customer.company }}
                  </view>
                </view>
              </view>

              <view class="btm_btns d-flex">
                <view
                  class="btn cancel"
                  @click="offer_err(v)"
                  v-if="v.relation.status == 1"
                >
                  拒绝
                </view>
                <view
                  class="btn"
                  @click="offer_confirm(v)"
                  v-if="v.relation.status == 1"
                >
                  同意
                </view>

                <view class="btn is_confirm" v-else>
                  {{ v.relation.examine_name }}
                </view>
              </view>
            </view>
            <!-- 报价申请 -->

            <!-- 跟进时效 -->
            <view class="join_box" v-else-if="v.content_type == 11">
              <view class="content">{{ v.content }}</view>

              <view class="btm_btns d-flex">
                <view
                  class="btn cancel"
                  @click="follow_confirm(v)"
                  v-if="v.relation.status == 0"
                >
                  继续跟进
                </view>
                <view
                  class="btn"
                  @click="follow_err(v)"
                  v-if="v.relation.status == 0"
                >
                  放弃跟进
                </view>

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
            <!-- 跟进时效 -->
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
      first: true,
      scrollTop: 0,
      next_page: true,
      company_id: "", // 同意 拒绝 加入我的公司id
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/4tK3hwfCtGseYX6QcxriYsFTAzmpZS841642647136330.png",
      slogan:
        "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/yfKS2XWyKxY5HwynQRDxz66zdc4de2ZM1642734415658.png",
    };
  },
  onShow() {
    this.init();
    console.log("show");

    postData("/message", {
      type: 0,
    }).then((res) => {});
  },
  methods: {
    init() {
      // 产品信息
      getData("/message/agency_assistant", {
        params: {
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { list, company_id },
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
          this.company_id = company_id;
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
    },

    // 同意 加入企业
    join_confirm(v) {
      console.log(v);
      this.$Router.push({
        path: "/task_member",
        query: {
          content_id: v.relation.id,
          user_id: v.relation.user.id,
          phone: v.relation.user.phone,
          name: v.relation.user.name,
          abbreviation: v.relation.user.abbreviation,
        },
      });
    },
    // 拒绝 加入企业
    join_err(v) {
      postData("/company/agree_company", {
        content_id: v.relation.id,
        user_id: v.relation.user.id,
        company_id: this.company_id,
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

    // 继续 跟进
    follow_confirm(v) {
      postData("/customer/continue_follow_customer", {
        customer_id: v.relation.customer_id,
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
    // 放弃 跟进
    follow_err(v) {
      postData("/customer/give_up_customer", {
        customer_id: v.relation.customer_id,
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

    offerDetail(v) {
      this.$Router.push({
        path: `/offer_detail/${v.relation.id}`,
        query: {
          offer_id: v.relation.id,
        },
      });
    },
    // 报价 同意
    offer_confirm(v) {
      postData("/offer/examine_offer_record/" + v.relation.id, {
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
    // 报价 拒绝
    offer_err(v) {
      postData("/offer/examine_offer_record/" + v.relation.id, {
        status: 4,
      }).then((res) => {
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
    align-items: flex-start;
    width: 100%;

    .img_box {
      flex-shrink: 0;
      width: 44px;
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

      .join_box {
        .content {
          text-align: center;
        }
      }

      // 报价申请
      .price_box {
        .content {
          padding: 10px 20px 20px;
          :last-child {
            margin-bottom: 0;
          }
        }

        .top_title {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #faa443;
          margin-bottom: 8px;
          .iconfont {
            font-size: 14px;
            font-weight: 400;
            margin-right: 3px !important;
          }
        }

        .top_give {
          font-size: 14px;
          font-weight: 600;
          line-height: 20px;
          color: #333333;
          margin-bottom: 8px !important;
        }

        .price_item {
          align-items: flex-start;
          margin-bottom: 8px;

          .l_label {
            width: 70px;
            font-size: 14px;
            font-weight: 400;
            color: #999999;
            flex-shrink: 0;
          }

          .r_txt {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #333333;
            white-space: pre-wrap;
          }
        }
      }
    }
  }
}

.slogan {
  padding: 237px 0 0;
}
</style>