<template>
  <view class="home">
    <view class="container_main">
      <u-sticky offset-top="0">
        <view class="ser_box">
          <u-search
            v-model="keyword"
            placeholder="搜索合同"
            shape="square"
            :showAction="false"
            bgColor="#fff"
            borderColor="#EDEDED"
            height="36"
            @search="search"
            animation
          ></u-search>
        </view>
      </u-sticky>

      <view class="list_main">
        <view class="list" v-if="contractList.length > 0">
          <view
            class="item"
            v-for="(v, i) in contractList"
            :key="i"
            @click="choose(v)"
          >
            <view class="name u-line-1">
              {{ v.contract_no }}
            </view>

            <view
              class="status"
              :class="{
                under_way: v.contract_status == '执行中',
                under_way: v.contract_status == '新签约',
                end: v.contract_status == '终止',
              }"
            >
              {{ v.contract_status }}
            </view>

            <view class="info_mian">
              <view class="item_li d-between">
                <view class="label"> 合同名称： </view>
                <view class="content"> {{ v.contract_name }}</view>
              </view>
              <view class="item_li d-between">
                <view class="label"> 合同金额： </view>
                <view class="content"> {{ v.money }}</view>
              </view>
              <view class="item_li d-between">
                <view class="label"> 待回款额： </view>
                <view class="content money"> {{ v.return_money }}</view>
              </view>
              <view class="item_li d-between">
                <view class="label"> 签订人： </view>
                <view class="content"> {{ v.sign_user }}</view>
              </view>
              <view class="item_li d-between">
                <view class="label"> 签订日期： </view>
                <view class="content"> {{ v.sign_time }} </view>
              </view>
            </view>
          </view>
        </view>

        <view class="slogan" v-else>
          <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

          <view class="txt"> 暂无数据 </view>
          <!-- <view class="create d-flex" @click="addClient">
            <i class="icon iconfont icon-tjx"></i>
            立即添加
          </view> -->
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import store from "@/store";
import { getData } from "@/common/api";
import { navBack } from "@/common/hooks";

export default {
  data() {
    return {
      role_id: null,
      keyword: "",
      page: 1,
      next_page: true,
      noData: store.state.no_data,

      contractList: [],

      customer_id: "",
      customer: {},
      type: "",
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);
    this.customer_id = query.customer_id;
    this.type = query.type;
    this.init();
  },
  computed: {
    // 展示添加按钮
    showFixedAdd() {
      let flag = false;
      if (this.contractList.length > 0) {
        flag = true;
      }
      return flag;
    },
  },
  methods: {
    init() {
      this.getMycontract();
    },
    // 我的回款
    getMycontract() {
      getData("/contract/my_contract_list", {
        params: {
          timing: this.activeDate || "",
          customer_id: this.customer_id || "",
          use_status: 1,
          page: this.page,
          search_word: this.keyword,
        },
      }).then((res) => {
        const {
          code,
          data: { list, role_id },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.role_id = role_id;

          if (this.page != 1) {
            this.contractList = this.contractList.concat(list.data);
          } else {
            this.contractList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    search() {
      this.page = 1;
      this.init();
    },

    choose(v) {
      let _th = this;
      uni.$emit("updateData", {
        contract: v,
        type: _th.type,
      });
      navBack();
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
      setTimeout(() =>{
      	uni.hideLoading()
      },1000)
    },
    onPullDownRefresh() {
      this.page = 1;
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.u-navbar {
  z-index: 9;

  .u-navbar__content__title {
    color: #fff;
  }
}

.container_main {
  padding: 0;
  z-index: 2;
}

/deep/.u-sticky {
  padding: 10px 15px;
}

.list_main {
  .list {
    padding: 0 0 130px;

    .item {
      position: relative;
      margin-bottom: 10px;
      padding: 19px 20px 20px;
      width: 100%;
      height: 206px;
      background-color: #fff;
      overflow: hidden;

      .name {
        margin-bottom: 16px;
        width: 200px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
      }

      .info_mian {
        padding: 0 10px;

        .item_li {
          margin-bottom: 14px;
        }

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

        .money {
          color: #ff9d00;
        }
      }

      .status {
        position: absolute;
        top: 14px;
        right: 20px;
        padding: 0 8px;
        height: 25px;
        line-height: 25px;
        background: #ebebeb;
        border-radius: 2px;
        text-align: center;
        font-size: 12px;
        font-weight: 600;
        color: #666666;
      }

      // 执行中
      .under_way {
        color: #4d6fff;
        background-color: #f0f5ff;
      }

      // 终止
      .end {
        color: #ff4500;
        background-color: #ffebe3;
      }
    }
  }
}

.add_client_btn {
  position: fixed;
  right: 20px;
  bottom: 117px;
  width: 38px;
  height: 38px;
  line-height: 38px;
  text-align: center;
  background: linear-gradient(180deg, #4d6fff 0%, #214cff 100%);
  box-shadow: 0px 3px 6px rgba(77, 111, 250, 0.47);
  border-radius: 50%;
  color: #fff;
}
</style>