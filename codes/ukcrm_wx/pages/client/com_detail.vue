<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="top_bgc">
      <view class="client_info_main">
        <view class="info_box">
          <view class="client_tag" v-if="clientInfo.tag_name">
            <view class="txt">{{ clientInfo.tag_name }}</view>
          </view>

          <!-- 客户信息 -->
          <view class="info_main d-flex avatar_box" @click="clientData">
            <u-avatar
              :text="clientInfo.abbreviation"
              :size="46"
              bg-color="#4D6FFF"
              shape="square"
              mode="aspectFit"
            ></u-avatar>

            <view class="r_info d-flex">
              <view class="user_info d-flex">
                <view class="info d-flex">
                  <view class="time">
                    <i class="icon iconfont icon-grzl"></i>
                  </view>
                  <view class="name"> {{ clientInfo.name || "" }} </view>
                </view>
              </view>
              <view class="info d-flex">
                <view class="phone">{{ clientInfo.phone || "" }}</view>
              </view>
              <view class="company_name">{{ clientInfo.company || "" }}</view>
            </view>
          </view>

          <view class="btm_counts d-center">
            <view class="item" @click="getOffer">
              <view class="tit">报价单</view>
              <view class="count">{{ info.offer_record }}</view>
            </view>

            <view class="item back" @click="getContract">
              <view class="tit">合同订单</view>
              <view class="count">{{ info.contract_num }}</view>
            </view>

            <view class="item" @click="getReturn">
              <view class="line"></view>
              <view class="r_line"></view>
              <view class="tit">回款单</view>
              <view class="count">{{ info.payment_collection }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
	
	

    <!-- 跟进记录 -->
    <view class="follow_box">
      <view class="top_tit d-flex">
        <view class="l_tit d-flex">
          <i class="icon iconfont icon-ywwl"></i>
          跟进记录
        </view>
      </view>

      <view class="follow_list" v-if="followList.length > 0">
        <view
          class="item d-flex"
          v-for="(v, i) in followList"
          :key="i"
          @click="followRecord(v)"
        >
          <view class="left_time">
            <!-- 同一天只展示一个  今天 -->
            <view class="name" v-if="v.add_name != followList[i - 1].add_name">
              {{ v.add_name }}
            </view>
            <view class="time">{{ v.add_at }}</view>
          </view>

          <view class="r_main" v-if="v.visit_type != 2">
            <view class="tit"> {{ v.user.name }} 的跟进记录</view>
            <view class="type">
              跟进方式：
              {{ v.visit_type == 0 ? "线上拜访" : "线下拜访" }}</view
            >
            <view class="type">跟进时间： {{ v.visit_time }}</view>
            <view class="content u-line-2">{{ v.visit_content || '' }} </view>

            <view class="line"></view>
          </view>

          <view class="r_main" v-else>
            <view class="tit"> {{ v.user.name }} 放弃跟进</view>
            <view class="type">放弃原因：</view>
            <view class="content u-line-2">{{ v.visit_content || '' }} </view>
            <view class="line"></view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无记录 </view>
      </view>
    </view>
    <!-- 跟进记录 -->

    <view class="new_fixed_btm">
      <view class="item" @click="followPopupShow = true">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-gj"></i> -->
		  <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjgj%402x.png" mode="aspectFit"></image>
        </view>
        跟进
      </view>

      <!-- 管理员，主管 -->
      <view class="item" @click="showGive" v-if="isAdmin < 4">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-fp"></i> -->
		  <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/fp%402x.png" mode="aspectFit"></image>
        </view>
        分配
      </view>

      <!-- 管理员 -->
     <view class="item" @click="delPopupShow = true" v-if="isAdmin < 3">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-sc"></i> -->
		  <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/sc%402x.png" mode="aspectFit"></image>
        </view>
        删除
      </view>
    </view>

    <!-- 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 -->
    <u-popup
      mode="bottom"
      :show="popupShow"
      @close="popupShow = false"
      round="12"
      :safe-area-inset-bottom="true"
    >
      <view class="btm_ppopup">
        <view class="tit">分配给</view>

        <view class="user_list_box">
          <view
            class="item d-flex avatar_box"
            v-for="(v, i) in userList"
            :key="i"
            @click="
              popupShow = false;
              confirmShow = true;
              getUserId = v.user.id;
              getUserName = v.user.name;
            "
          >
            <u-avatar
              :src="v.user.avatar"
              :size="46"
              shape="square"
              bg-color="#4D6FFF"
              mode="aspectFit"
              v-if="v.user.avatar"
            ></u-avatar>
            <u-avatar
              :text="v.user.abbreviation"
              :size="46"
              shape="square"
              bg-color="#4D6FFF"
              mode="aspectFit"
              v-else
            ></u-avatar>

            <view class="r_info d-flex">
              <view class="name"> {{ v.user.name }} </view>
              <view class="phone">{{ v.user.phone }}</view>
            </view>
          </view>
        </view>
        <u-gap height="10" bgColor="#f7f7f7"></u-gap>
        <view class="cancel_txt" @click="popupShow = false">取消</view>
      </view>
    </u-popup>

    <u-popup
      :show="confirmShow"
      :round="10"
      mode="center"
      :safeAreaInsetBottom="false"
      @close="confirmShow = false"
    >
      <view class="popup_box">
        <view class="tit">确认</view>
        <view class="content"> 是否确定分配给 {{ getUserName }} </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="confirmShow = false"> 取消 </view>
          <view class="btn" @click="confirmTransfer"> 确定 </view>
        </view>
      </view>
    </u-popup>

    <!-- 跟进客户  跟进客户  跟进客户  跟进客户  跟进客户 -->
    <u-popup
      mode="bottom"
      :show="followPopupShow"
      @close="followPopupShow = false"
      round="12"
      :safe-area-inset-bottom="true"
    >
      <view class="follow_popup">
        <view class="content">
          确定跟进客户“<text>{{ clientInfo.name }}</text
          >”
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="followPopupShow = false">
            取消
          </view>
          <view class="btn" @click="confirmFollow"> 确定 </view>
        </view>
      </view>
    </u-popup>
    <!-- 跟进客户  跟进客户  跟进客户  跟进客户  跟进客户 -->

    <!-- 删除客户 -->
    <u-popup
      mode="bottom"
      :show="delPopupShow"
      @close="delPopupShow = false"
      round="12"
      :safe-area-inset-bottom="true"
    >
      <view class="follow_popup">
        <view class="content">
          确定删除客户“<text>{{ clientInfo.name }}</text
          >”
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="delPopupShow = false">
            取消
          </view>
          <view class="btn" @click="confirmDel"> 确定 </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getData, postData, delData, isSelfClient } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      customer_id: "", // 客户id
      customer_belong: false,
      isAdmin: true,
      page: 1,
      next_page: true,
      noData: store.state.no_data,

      info: {},
      clientInfo: {},
      followList: [],

      popupShow: false, // 分配
      confirmShow: false, // 二次确认弹框
      getUserName: "", //转移用户
      getUserId: "", //转移用户
      userList: [], // 转移用户列表
      delPopupShow: false, // 删除用户弹框
      delClientName: "范玮琪", // 删除用户名

      followPopupShow: false, // 跟进
    };
  },
  onLoad() {
    let query = this.$Route.query;
    if (query.id) {
      this.customer_id = query.id;
      this.getUserList();
      this.getFollowList();
    }
  },
  onShow() {
    this.customer_id = this.$Route.query.id;

    isSelfClient(this.customer_id).then((res) => {
      const { code, data } = res;
      if (code === 200) {
        this.customer_belong = data.customer_belong;
      }
    });
    this.init();
  },
  methods: {
    init() {
      getData("/customer/customer_detail", {
        params: {
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.info = data;
          this.clientInfo = data.customer;
          this.isAdmin = data.role_id;
        }
      });
    },
    // 跟进记录
    getFollowList() {
      getData("/follow/follow_record_list", {
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
    // 企业成员
    getUserList() {
      getData("/company/company_department_member").then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.userList = user_list ? user_list.data : [];
        }
      });
    },

    // 分配
    showGive() {
      if (this.userList.length <= 0) {
        this.$u.toast("暂无部门成员，无法分配");
        return;
      } else {
        this.popupShow = true;
      }
    },

    // 确定分配
    confirmTransfer() {
      postData(`/customer/distribution_customer`, {
        user_id: this.getUserId,
        customer_ids: [this.customer_id],
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.confirmShow = false;
          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 1 });
            },
          });
        }else {
          this.$u.toast(msg);
        }
      });
    },

    // 跟进
    confirmFollow() {
      let id = this.customer_id;
      postData(`/customer/follow_customer`, {
        customer_ids: [this.customer_id],
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.followPopupShow = false;
          let _th = this;
          this.$refs.uToast.show({
            message: msg,
            complete() {
              _th.$Router.replace({
                path: "/client/" + id,
                query: { id },
              });
              // uni.navigateBack({ delta: 1 });
            },
          });
        } else if (code === 422) {
          this.$u.toast(msg);
        } else {
          this.$u.toast(msg);
        }
      });
    },

    // 确定 删除客户
    confirmDel() {
      postData(`/customer/${this.customer_id}`).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.delPopupShow = false;
          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 1 });
            },
          });
        }else {
          this.$u.toast(msg);
        }
      });
    },

    // 打电话
    callUser() {
      uni.makePhoneCall({
        phoneNumber: this.clientInfo.phone, //仅为示例
      });
    },

    // 客户资料
    clientData() {
      this.$Router.push({
        path: "/client_data/" + this.clientInfo.id,
        query: {
          id: this.clientInfo.id,
        },
      });
    },
    // 合同订单
    getContract() {
      this.$Router.push({
        path: "/contract",
        query: {
          customer_id: this.customer_id,
          from: "com_detail",
        },
      });
    },
    // 回款单
    getReturn() {
      this.$Router.push({
        path: "/return_money",
        query: {
          customer_id: this.customer_id,
          from: "com_detail",
        },
      });
    },
    // 报价单
    getOffer() {
      this.$Router.push({
        path: "/offer",
        query: {
          customer_id: this.customer_id,
          customer_name: this.clientInfo.name,
          from: "com_detail",
        },
      });
    },
    followRecord(v) {
      this.$Router.push({
        path: "/follow_record/" + v.id,
        query: {
          follow_id: v.id,
        },
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
  },
};
</script>

<style lang="less" scoped>

.detail {
  padding: 0 0 130px;

  .top_bgc {
    padding: 28px 15px 20px;
    width: 100%;
    background: linear-gradient(180deg, #ffffff 0%, #e6efff 100%);

    .client_info_main {
      border-radius: 10px;
      overflow: hidden;
    }

    .info_box {
      position: relative;
      padding: 23px 15px 16px;
      width: 100%;
      background: #fff;
      box-shadow: 0px 0px 4px #f3f3f8;

      // 客户标签 潜在
      .client_tag {
        position: absolute;
        top: 0;
        left: 0;
        width: 58px;
        height: 58px;
        background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/14/WKiTQK7BWbzT8RANWHP6APhGFsQ8CZEG1642143015841.png");
        background-size: 100% 100%;

        .txt {
          position: absolute;
          top: 10px;
          left: 6px;
          font-size: 12px;
          color: #fff;
          transform: rotate(-45deg);
        }
      }

      // 客户信息
      .info_main {
        margin-bottom: 20px;
		
		/deep/.u-avatar--square {
			margin-bottom: 14px;
		}

        .r_info {
          flex-direction: column;
          align-items: flex-start;

          margin-left: 12px;
          width: 100%;

          .phone {
            font-size: 14px;
            font-weight: 400;
            color: #666666;
          }

          .user_info {
            justify-content: space-between;
            margin-bottom: 3px;
            width: 100%;

            .info {
              .name {
                margin-right: 12px;
                font-size: 16px;
                font-weight: 600;
                color: #333333;
              }

            }

            .time {
              font-size: 12px;
              font-weight: 400;
              line-height: 1;
              color: #999999;
              flex-shrink: 0;
              margin-right: 12px;
            }

            .status {
              float: right;
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 17px;
              color: #03C919;
              opacity: 1;
              display: flex;
              justify-content: center;
              align-items: center;

              .status_route {
                width: 5px;
                height: 5px;
                background: rgba(49, 211, 67, 1);
                border-radius: 50%;
                opacity: 1;
                margin-right: 6px;
              }
            }
          }

          .company_name {
            font-size: 13px;
            font-weight: 400;
            color: #999999;
          }
        }
      }

      .btm_counts {
        padding-top: 20px;
        border-top: 1px solid #f2f2f2;

        .item {
          position: relative;
          width: 100%;
          text-align: center;

          .tit {
            margin-bottom: 5px;
            font-size: 13px;
            line-height: 18px;
            color: #333333;
          }

          .count {
            font-size: 16px;
            font-weight: 600;
            line-height: 22px;
            color: #4d6fff;
          }
        }
        .back {
          .line {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            height: 25px;
            width: 1px;
            background-color: #f0f0f0;
          }

          .r_line {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            height: 25px;
            width: 1px;
            background-color: #f0f0f0;
          }
        }
      }
    }
  }

  .follow_box {
    padding: 9px 15px;

    .top_tit {
      justify-content: space-between;
      line-height: 1;
      margin-bottom: 10px;

      .l_tit {
        font-size: 14px;
        font-weight: 600;
        color: #333333;

        .iconfont {
          margin-right: 5px;
          color: #4d6fff;
          font-size: 12px;
        }
      }

      .r_tit {
        font-size: 12px;
        font-weight: 400;
        color: #999;

        text {
          color: #333333;
          font-size: 14px;
        }
      }
    }

    .follow_list {
      .item {
        position: relative;
        align-items: flex-start;
        margin-bottom: 12px;

        .left_time {
          background-color: #f7f8fa;
          margin-right: 8px;
          width: 56px;
          z-index: 1;
          flex-shrink: 0;

          .name {
            font-size: 20px;
            font-weight: 600;
            line-height: 28px;
            color: #333333;
          }

          .time {
            padding-bottom: 5px;
            font-size: 10px;
            font-weight: 400;
            line-height: 14px;
            color: #333333;
          }
        }

        .line {
          position: absolute;
          top: 0;
          left: 22px;
          width: 1px;
          height: 100%;
          background-color: #bbbbbb;
        }

        .r_main {
          padding: 19px 25px 20px;
          width: 100%;
          background-color: #fff;
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.06);
          border-radius: 6px;

          .tit {
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            color: #333333;
          }

          .type {
            margin-bottom: 3px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: #999999;
          }

          .content {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: #333333;
          }
        }
      }

      :last-child {
        margin-bottom: 0;
      }
    }

    .slogan {
      padding: 94px 0 0;
    }
  }
}

.new_fixed_btm {
  .icon {
    font-size: 23px;
  }
}

.btm_ppopup {
  padding: 11px 0 0;

  .tit {
    padding: 0 20px;
    margin-bottom: 20px;
    font-size: 12px;
    font-weight: 400;
    color: #999999;
  }

  .user_list_box {
    padding: 0 20px;
    max-height: 300px;
    overflow-y: scroll;

    .item {
      margin-bottom: 20px;
      padding: 0 20px;
      background-color: #fff;

      .r_info {
        flex-direction: column;
        align-items: flex-start;
        margin-left: 12px;
        width: 100%;

        .name {
          margin-right: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .phone {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }

  .cancel_txt {
    padding: 17px 20px;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
  }
}

// 弹框
.popup_box {
  width: 321px;
  padding: 18px 20px;
  text-align: center;

  .tit {
    margin-bottom: 33px;
    font-size: 15px;
    font-weight: 400;
    line-height: 1;
    color: #666666;
  }

  .content {
    margin-bottom: 34px;
    font-size: 15px;
    font-weight: 600;
    line-height: 21px;
  }

  .btm_btns {
    justify-content: center;
    width: 100%;
    padding: 0 40px;

    .btn {
      width: 110px;
      height: 42px;
      line-height: 42px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      background: #4d6fff;
      border-radius: 21px;
      border: 1px solid #4d6fff;
    }

    .cancel {
      margin-right: 20px;
      color: #666666;
      background: #fff;
      border: 1px solid #707070;
    }
  }
}

.follow_popup {
  padding: 22px 15px 10px;

  .content {
    margin-bottom: 40px;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    text-align: center;

    text {
      color: #4d6fff;
    }
  }

  .btm_btns {
    justify-content: center;
    width: 100%;

    .btn {
      width: 100%;
      height: 42px;
      line-height: 42px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      background: #4d6fff;
      border-radius: 21px;
      border: 1px solid #4d6fff;
    }

    .cancel {
      margin-right: 20px;
      color: #666666;
      background: #fff;
      border: 1px solid #707070;
    }
  }
}

.contract_box {
  width: 345px;
  height: 72px;
  background: linear-gradient(169deg, #FFFFFF 0%, #FFFFFE 39%, #FFF2D5 100%);
  box-shadow: 0px -1px 4px #F3F3F8;
  opacity: 1;
  border-radius: 10px;
  padding: 14px 21px;
  margin: 0 auto;

  .pending_price {
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .pending_label {
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 18px;
      color: #666666;
      opacity: 1;
    }

    .pending_value {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 20px;
      color: #F6874D;
      opacity: 1;
    }
  }
}
</style>