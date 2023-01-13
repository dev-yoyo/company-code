<template>
  <view class="detail">
    <view class="item_main">
      <view class="tit">
        {{ info.offer_num || "" }}
      </view>

      <view class="info_mian">
        <view class="item d-between">
          <view class="label"> 关联客户： </view>
          <view class="content"> {{ info.customer.name || "" }}</view>
        </view>

        <view class="item d-between">
          <view class="label"> 关联公司： </view>
          <view class="content"> {{ info.customer.company || "" }}</view>
        </view>

        <view class="item d-between">
          <view class="label"> 报价日期： </view>
          <view class="content"> {{ info.offer_time || "" }} </view>
        </view>
      </view>
    </view>

    <view class="item_main contract_status d-between">
      <view class="label d-center">
        <i class="t-icon iconfont t-icon-htzt"></i>
        审核状态
      </view>
      <view class="r_status d-center">
        <view
          class="status"
          :class="{
            pedding: info.examine_name == '审批中',
            success: info.examine_name == '已审批',
            err: info.examine_name == '已拒审',
          }"
        >
          {{ info.examine_name || "" }}
        </view>
      </view>
    </view>

    <view class="item_main" v-for="(v, i) in info.offer_product" :key="i">
      <view class="tit"> 报价信息{{ i + 1 }} </view>

      <view class="info_mian">
        <view class="item d-between">
          <view class="label"> 产品名称： </view>
          <view class="content"> {{ v.product_name || "" }}</view>
        </view>
        <view class="item d-between">
          <view class="label"> 预购数量： </view>
          <view class="content"> {{ v.product_num || "" }}</view>
        </view>
        <view class="item" v-if="v.product.price && v.product.price.length > 0">
          <view class="p_label"> 指导报价： </view>
          <view class="content">
            <view class="directPrice_table">
              <view class="tr">
                <text class="td">数量：（个）</text>
                <text class="td">单价：（元）</text>
              </view>
              <view  class="tr" v-for="(a, b) in v.product.price" :key="b">
                <text class="td">{{ a.num }}+</text>
                <text class="td">{{ a.price }}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="item d-between" v-else>
          <view class="label"> 指导报价： </view>
          <view class="content">
            <view class="directPrice_grey" >暂无</view>
          </view>
        </view>
        <view class="item d-between">
          <view class="label"> 产品单价： </view>
          <view class="content"> {{ v.product_price || "" }} 元</view>
        </view>
      </view>
    </view>

    <view class="item_main">
      <view class="tit"> 备注内容 </view>

      <view class="info_mian">
        <view class="remarks">
          {{ info.remarks || "暂无" }}
        </view>
      </view>
    </view>

    <view class="new_fixed_btm" v-if="belong_status">
      <view class="item" @click="edit" v-if="record_status">
        <view class="icon_box">
          <i class="icon iconfont icon-bj"></i>
        </view>
        编辑
      </view>

      <view class="item" @click="quote">
        <view class="icon_box">
          <i class="icon iconfont icon-a-zu2109"></i>
        </view>
        引用
      </view>

      <view class="item" @click="revocation" v-if="info.status == 1">
        <view class="icon_box">
          <i class="icon iconfont icon-bj"></i>
        </view>
        撤销
      </view>
    </view>

    <view class="new_fixed_btm" v-if="!belong_status && !exhibition">
      <view class="item" @click="quote">
        <view class="icon_box">
          <i class="icon iconfont icon-a-zu2109"></i>
        </view>
        引用
      </view>
    </view>

    <view class="new_fixed_btm" v-if="exhibition">
      <u-button :customStyle="cancelStyle" @click="offer_err"> 拒绝 </u-button>

      <u-button
        @click="offer_confirm"
        color="#4D6FFF"
        :loading="createLoading"
        :disabled="createLoading"
      >
        同意
      </u-button>
    </view>

    <u-popup
      mode="bottom"
      :show="statusShow"
      @close="statusShow = false"
      round="12"
      :safe-area-inset-bottom="true"
    >
      <view class="btm_ppopup del_popup">
        <view class="del_txt" @click="confirmEnd"> 终止 </view>

        <u-gap height="10" bgColor="#f7f7f7"></u-gap>
        <view class="cancel_txt" @click="statusShow = false">取消</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      role_id: "",
      offer_id: "",
      info: {},
      belong_status: false, // 是否自己
      record_status: false, // 是否 编辑
      exhibition: false,
      cancelStyle: store.state.cancelStyle,
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);
    if (query.offer_id) {
      this.offer_id = query.offer_id;
      this.init();
    }
  },
  methods: {
    init() {
      getData("/offer/offer_record_detail/" + this.offer_id, {
        params: {
          id: this.offer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { data, role_id, belong_status, exhibition },
        } = res;
        if (code === 200) {
          this.info = data;
          this.role_id = role_id;
          this.belong_status = belong_status;

          // 是否可以审核
          this.exhibition = exhibition;
        }
      });

      // 是否编辑
      getData("/offer/record_belong", {
        params: {
          model_name: 2, // 1 跟进 2 报价
          id: this.offer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { record_status },
        } = res;
        if (code === 200) {
          this.record_status = record_status;
        }
      });
    },

    // 编辑
    edit() {
      this.$Router.push({
        path: "/offer_edit/" + this.info.id,
        query: {
          info_id: this.info.id,
          edit: true,
        },
      });
    },
    // 引用
    quote() {
      this.$Router.push({
        path: "/offer_create",
        query: {
          offer_record_id: this.info.id,
          type: "quote",
        },
      });
    },

    // 撤销
    revocation() {
      postData(`/offer/revoke_my_offer/${this.offer_id}`).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          uni.$u.toast(msg);
          this.init();
        } else if (code === 422) {
          uni.$u.toast(msg);
        }
      });
    },

    // 报价 同意
    offer_confirm() {
      postData("/offer/examine_offer_record/" + this.offer_id, {
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
    offer_err() {
      postData("/offer/examine_offer_record/" + this.offer_id, {
        status: 4,
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

    onPullDownRefresh() {
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 130px;
}

.item_main {
  margin-top: 10px;
  padding: 20px;
  width: 100%;
  background-color: #fff;
  overflow: hidden;

  .tit {
    margin-bottom: 17px;
    font-size: 13px;
    line-height: 18px;
    color: #333333;
  }

  .info_mian {
    padding: 0 10px;

    .item {
      margin-bottom: 17px;

      .label {
        font-size: 13px;
        line-height: 1;
        color: #999999;
      }

      
      .p_label {
        font-size: 13px;
        line-height: 1;
        color: #999999;
        margin-bottom:14px;
      }


      .content {
        font-size: 14px;
        line-height: 1;
        color: #333333;
        white-space: pre-wrap;
      }
    }
    :last-child {
      margin-bottom: 0;
    }

    .remarks {
      white-space: pre-wrap;
      font-size: 14px;
      line-height: 20px;
      color: #333333;
    }
  }
  .product_main {
    padding-bottom: 20px !important;
    margin-bottom: 20px;
    border-bottom: 1px solid #f0f0f0;
  }

  .product_main:last-child {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    border-bottom: none;
  }
}

.contract_status {
  margin-top: 1px;
  padding: 0 30px 0 20px;
  height: 42px;
  background-color: #fff;

  .label {
    font-size: 13px;
    line-height: 1;
    color: #333333;

    .iconfont {
      margin-right: 3px;
    }
  }

  .status {
    padding: 0 8px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    background: #f2f2f2;
    border-radius: 2px;
    font-size: 12px;
    font-weight: 600;
    color: #999999;
  }

  .pedding {
    background-color: #f0f5ff;
    color: #4d6fff;
  }

  .success {
    background-color: #fff4e3;
    color: #ff9d00;
  }

  .err {
    background-color: #ffe0d5;
    color: #ff4500;
  }
}

.new_fixed_btm {
  justify-content: space-around;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

.directPrice_grey {
  text-align: right;
  .direct_box {
    margin-bottom: 5px;
  }
  .direct {
    margin-left: 5px;
  }
}

.directPrice_table {
  text-align: left;
  color: #333;
  font-size: 14px;
  border: 1px solid #E5E5E5;
  border-right: 0;
  border-bottom: 0;
  .tr {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .td {
    height: 36px;
    line-height: 36px;
    text-align: center;
    width: 50%;
    border-right: 1px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5;
  }
}
</style>