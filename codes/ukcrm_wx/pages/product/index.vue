<template>
  <view class="product_detail">
    <!-- <view class="top_bgc"> </view> -->

    <view class="container_main">
      <u-sticky offset-top="0">
        <u-navbar
          bgColor="transparent"
          title="产品列表"
          leftIcon=" "
          placeholder
        />

        <view class="ser_box">
          <u-search
            v-model="keyword"
            placeholder="输入产品名称"
            shape="square"
            :showAction="false"
            bgColor="#F6F7F9"
            borderColor="#F6F7F9"
            height="36"
            @search="search"
          ></u-search>
        </view>

        <view class="top_tab d-flex">
          <i class="icon iconfont icon-cp-on"></i>
          企业产品
        </view>
      </u-sticky>

      <view class="list_main">
        <view class="list_box" v-if="productList.length > 0">
          <view
            class="item d-flex"
            v-for="(v, i) in productList"
            :key="i"
            @click="detail(v.id)"
          >
            <u-avatar
              :src="v.thumb ? v.thumb[0] : ''"
              :size="46"
              shape="square"
              bg-color="#4D6FFF"
              mode="aspectFit"
            ></u-avatar>

            <view class="name">{{ v.name }}</view>
          </view>
        </view>

        <view class="slogan" v-else>
          <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
          <view class="txt"> 暂无产品 </view>
          <!-- <view class="create d-flex" @click="addProduct" v-if="role_id < 3">
            <i class="icon iconfont icon-tjx"></i>
            立即添加
          </view> -->
        </view>

        <!-- <view
          class="add_client_btn"
          @click="addProduct"
          v-if="showFixedAdd && role_id < 3"
        >
          <i class="icon iconfont icon-tj4"></i>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
export default {
  data() {
    return {
      keyword: "",
      role_id: null,
      productList: [],
      page: 1,
      next_page: true,
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/kZm4yGDxGsecszcz4FcZGs3sW5QFSG3E1642734316515.png",
    };
  },
  onShow() {
    this.init();
  },
  onLoad() {
    // 数据监听
    let _th = this;
    uni.$on("updateData", function (data) {
      _th.page = 1;
      _th.init();
    });
  },
  computed: {
    // 超管 管理员 可以创建产品
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
      this.getList();
    },
    getList() {
      getData("/product/product_list", {
        params: {
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
            this.productList = this.productList.concat(list.data);
          } else {
            this.productList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    search() {
      this.page = 1;
      this.init();
    },

    // addProduct() {
    //   if (!this.role_id) {
    //     this.$u.toast("暂无企业,无法添加产品");
    //     return;
    //   }

    //   this.$Router.push({
    //     name: "create_product",
    //   });
    // },

    // 产品详情
    detail(id) {
      this.$Router.push({
        path: "/detail_product/" + id,
        query: {
          product_id: id,
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
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
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
  padding: 0 15px;
  width: 100%;
  height: auto;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/18/k8MdXP2tZPAhJQjmFEhpdYG3CmyW4TQZ1645165099977.png");
  background-size: 100% 100%;
  z-index: -1;

  .top_tab {
    padding: 20px 0;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #ffffff;

    .iconfont {
      margin-right: 5px;
    }
  }
}


.list_main {
  position: relative;
  padding: 15px 15px 0;

  .list_box {
    .item {
      align-items: center;
      margin-bottom: 10px;
      padding: 17px 20px;
      background-color: #fff;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.05);
      border-radius: 8px;

      .name {
        margin-left: 12px;
        font-size: 16px;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
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

.slogan {
  padding: 183px 0 0;
}
</style>