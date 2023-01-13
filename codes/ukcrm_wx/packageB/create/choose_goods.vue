<template>
  <view class="home">
    <view class="container_main">
      <u-sticky offset-top="0">
        <view class="ser_box">
          <u-search
            v-model="keyword"
            placeholder="搜索产品名称"
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
        <view class="list_box" v-if="productList.length > 0">
          <view
            class="item d-between"
            :class="v.already? 'grey':''"
            v-for="(v, i) in productList"
            :key="i"
            @click="choose(v)"
          >
            <view class="name u-line-1"> {{ v.name }} </view>
            <view class="selct" v-if="v.already">已选</view>
          </view>
        </view>

        <view class="slogan" v-else>
          <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
          <view class="txt"> 暂无产品 </view>
          <view class="create d-flex" @click="addProduct" v-if="role_id < 3">
            <i class="icon iconfont icon-tjx"></i>
            立即添加
          </view>
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
      keyword: "",
      page: 1,
      next_page: true,

      role_id: null,
      productList: [],
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/kZm4yGDxGsecszcz4FcZGs3sW5QFSG3E1642734316515.png",

      ids:[],
      index:0,
    };
  },
  onShow() {
    let query = this.$Route.query;
    this.index = query.index || 0
    this.ids = query.ids || [];

    this.init();
    
  },
  onLoad() {
    // 数据监听
    let _th = this;
    uni.$on("updateGoods", function (data) {
      console.log("updateData >>>", data);

      switch (data.type) {
        case "create_offer":
          _th.index = data.index;
          _th.ids = data.ids || [];
          break;
          
        default:
          break;
      }
    });
  },
  computed: {
    // 展示添加按钮
    showFixedAdd() {
      let flag = false;
      if (this.productList.length > 0) {
        flag = true;
      }
      return flag;
    },
  },
  methods: {
    init() {
      this.getClientele();
    },
    getClientele() {
      getData("/product/business_product_list", {
        params: {
          page: this.page,
          search_word: this.keyword,
        },
      }).then((res) => {
        const {
          code,
          data: { list,role_id },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.role_id = role_id;

          if (this.page != 1) {
            this.productList = this.productList.concat(list.data);
          } else {
            this.productList = list.data;
          }
          // this.productList = [];
          this.next_page = list.next_page_url ? true : false;

          let arr = this.productList;
          if (arr.length > 0) {
            arr.map((e) => {
            
              e.already = this.ids.indexOf(e.id) > -1
              console.log(e.already)
            });
          }

        }
      });
    },

    search() {
      this.page = 1;
      this.init();
    },

    // 一维
    choose(v) {
      if(!v.already){
        let _th = this;
        uni.$emit("updateData", {
          value: v,
          index: _th.index,
          type: 'create_offer',
        });
        navBack();
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
  background:#fff!important;
}

.list_main {
  position: relative;

  .list_box {
    .item {
      margin-bottom: 1px;
      padding: 16px 26px 15px 29px;
      background-color: #fff;
      font-size: 15px;
      font-weight: 400;
      line-height: 21px;
      color: #333333;
    }
    .item.grey {
      color: #C3C3C3;  
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