<template>
  <view class="detail">
    <view class="item_main">
      <view class="tit">
        {{ info.return_num || "" }}
      </view>

      <view class="info_mian">
        <view class="item d-between">
          <view class="label"> 关联客户： </view>
          <view class="content"> {{ info.contract.customer_name || "" }}</view>
        </view>

        <view class="item d-between">
          <view class="label"> 关联公司： </view>
          <view class="content">
            {{ info.contract.customer_company_name || "" }}</view
          >
        </view>
        <view class="item d-between">
          <view class="label"> 关联合同： </view>
          <view class="content"> {{ info.contract.contract_name || "" }} </view>
        </view>
        <view class="item d-between">
          <view class="label"> 合同金额： </view>
          <view class="content"> ¥{{ info.contract.money || "0" }} </view>
        </view>
        <view class="item d-between">
          <view class="label"> 已回款额： </view>
          <view class="content"> ¥{{ info.contract.has_return_money }} </view>
        </view>
      </view>
    </view>

    <view class="item_main">
      <view class="tit"> 回款信息 </view>

      <view class="info_mian">
        <view class="item d-between">
          <view class="label"> 回款计划期数： </view>
          <view class="content">
             {{ info.payment_plan && info.payment_plan.period ? info.payment_plan.period + '期':"" }}</view>
        </view>
        <view class="item d-between">
          <view class="label"> 回款金额： </view>
          <view class="content"> {{ info.return_money || "" }}</view>
        </view>
        <view class="item d-between">
          <view class="label"> 回款日期： </view>
          <view class="content"> {{ info.return_time || "" }}</view>
        </view>
        <view class="item d-between">
          <view class="label"> 支付方式： </view>
          <view class="content"> {{ info.pay_type || "" }}</view>
        </view>
        <view class="item d-between">
          <view class="label"> 汇款银行： </view>
          <view class="content"> {{ info.pay_bank || "" }}</view>
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

    <view class="new_fixed_btm" v-if="is_belong">
      <view class="item" @click="edit">
        <view class="icon_box">
          <i class="icon iconfont icon-bj"></i>
        </view>
        编辑
      </view>
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
import { getData } from "@/common/api";

export default {
  data() {
    return {
      role_id: "",
      return_id: "",
      info: {},
      is_belong: false,
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);
    if (query.return_id) {
      this.return_id = query.return_id;
      this.init();
    }
  },
  methods: {
    init() {
      getData("/payment_collection/payment_detail", {
        params: {
          id: this.return_id,
        },
      }).then((res) => {
        const {
          code,
          data: { detail, exists },
        } = res;
        if (code === 200) {
          this.info = detail;
          this.is_belong = exists;
          // this.role_id = role_id;
        }
      });
    },

    // 编辑
    edit() {
      this.$Router.push({
        path: "/return_money_edit/" + this.info.id,
        query: {
          info_id: this.info.id,
          contract_id: this.info.contract_id,
          edit: true,
        },
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

      .content {
        font-size: 14px;
        line-height: 1;
        color: #333333;
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
</style>