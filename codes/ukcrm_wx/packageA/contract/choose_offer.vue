<template>
  <view class="home">
    <view class="container_main">
      <u-sticky offset-top="0">
        <view class="ser_box">
          <u-search
            v-model="keyword"
            placeholder="请输入搜索内容"
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
        <!-- 我的客户 -->
        <view class="list_box" v-if="offerList.length > 0">
          <view
            class="item"
            v-for="(v, i) in offerList"
            :key="i"
            @click="choose(v)"
          >
            <view class="number d-between">
              <view class="num"> {{ v.offer_num }} </view> 
              <view class="time"> {{ v.offer_time }} </view>
            </view>

            <view class="info_mian">
              <!--<view class="item_li d-flex">
                <view class="label"> 关联客户： </view>
                <view class="content"> {{ v.customer.name || "" }}</view>
              </view>
              <view class="item_li d-flex">
                <view class="label"> 关联公司： </view>
                <view class="content"> {{ v.customer.company || "" }}</view>
              </view>-->
              <view class="item_box" v-if="item.show" v-for="(item, idx) in v.offer_product" :key="idx">
                <view class="item_li d-flex"  >
                  <view class="label"> 报价产品：</view>
                  <view class="content">{{ item.product_name }}</view>
                </view>
                <view class="item_li d-flex"  >
                  <view class="label"> 产品数量：</view>
                  <view class="content">{{ item.product_num }}</view>
                </view>
                <view class="item_li d-flex"  >
                  <view class="label"> 产品价格：</view>
                  <view class="content">￥{{ item.product_price }}</view>
                </view>
              </view>
              <view class="btn_box d-center" v-if="v.offer_product.length >1">
                <view class="btn d-center" v-if="!open"  @click.stop="change(true)">展开({{v.offer_product.length}})<i class="icon iconfont icon-xl"></i></view>
                <view class="btn d-center" v-else  @click.stop="change(false)">收起<i class="icon iconfont icon-sq"></i></view>
              </view>
            </view>
          </view>
        </view>

        <view class="slogan" v-else>
          <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

          <view class="txt"> 暂无数据 </view>
        </view>
      </view>
    </view>
  </view>
</template>


<script>
import { getData } from "@/common/api";
import { navBack } from "@/common/hooks";
import store from "@/store";

export default {
  data() {
    return {
      role_id: null,
      company_id: "",
      keyword: "",
      page: 1,
      next_page: true,
      noData: store.state.no_data,
      offerList: [],

      customer_id: "",
      customer: {},
      type: "",

      open: false
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log("query >>", query);

    this.offer = query.offer;
    this.customer_id = query.customer_id;
    this.type = query.type;

    this.init();
  },
  methods: {
    init() {
      this.getClientele();
    },
    getClientele() {
      getData("/offer/offer_record_list", {
        params: {
          page: this.page,
          search_word: this.keyword,
          customer_id: this.customer_id,
          status: 100,
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
            this.offerList = this.offerList.concat(list.data);
          } else {
            this.offerList = list.data;
          }

          this.change(false)
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },
    search() {
      this.page = 1;
      this.init();
    },
    // 添加客户
    addClient() {
      if (!this.role_id) {
        this.$u.toast("暂无企业");
        return;
      }
      // 我的客户
      this.$Router.push({
        name: "create_client",
      });
    },

    choose(v) {
      let _th = this;
      uni.$emit("updateData", {
        offer: v,
        type: _th.type,
      });
      navBack();
    },

    change(type) {
        this.open = type
        if(this.offerList.length > 0 ) {
          this.offerList.forEach((v,k)=>{
            if(v.offer_product.length > 0) {
              v.offer_product.forEach((a,b)=>{
                if(type) {
                  a.show = true
                }else {
                  if(b == 0) {
                    a.show = true
                  }else {
                    a.show = false
                  }
                }
              })
            }
          })
        }
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
  padding: 0 0 30px;
  z-index: 2;
}

/deep/.u-sticky {
  padding: 10px 15px;
}

.list_main {
  position: relative;

  .list_box {
    .item {
      margin-bottom: 10px;
      padding: 20px;
      background-color: #fff;

      .number {
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
        .time {
          font-size: 13px;
          font-weight: 400;
          line-height: 18px;
          color: #999999;
        }
      }

      .info_mian {
        padding: 0 10px;

        .item_box {
          border-top: 1px solid #F2F2F2;
          padding: 15px 0;
          &:first-child{
            border-top: none;
          }
        }
        .item_li {
          margin-bottom: 4px;
          align-content: center;

          .label,
          .content {
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            color: #999999;
          }

          .content {
            color: #333;
          }
        }
        .btn_box {
          .btn {
            width: 88px;
            height: 32px;
            background: #F4F4F4;
            border-radius: 16px;
            font-size: 13px;
            font-weight: 400;
            line-height: 18px;
            color: #999999;
          }
          .iconfont {
            font-size:11px;
          }
        }
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