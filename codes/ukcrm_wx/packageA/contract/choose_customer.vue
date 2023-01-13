<template>
  <view class="home">
    <view class="container_main">
      <u-sticky offset-top="0">
        <view class="ser_box">
          <u-search
            v-model="keyword"
            placeholder="搜索客户名称"
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
        <view class="list_box" v-if="clientList.length > 0">
          <view
            class="item"
            v-for="(v, i) in clientList"
            :key="i"
            @click="choose(v)"
          >
            <view class="user_info d-flex">
              <view class="name u-line-1"> {{ v.name }} </view>
              <view class="phone">{{ v.phone }}</view>
            </view>
            <view class="company_name"> 企业： {{ v.company }} </view>
          </view>
        </view>

        <view class="slogan" v-else>
          <u-avatar :src="slogan" :size="128" mode="aspectFit"></u-avatar>

          <view class="txt"> 暂无客户 </view>
          <view class="create d-flex" @click="addClient">
            <i class="icon iconfont icon-tjx"></i>
            立即添加
          </view>
        </view>

        <!-- <view class="add_client_btn" @click="addClient" v-if="showFixedAdd">
          <i class="icon iconfont icon-tj4"></i>
        </view> -->
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
      keyword: "",
      page: 1,
      next_page: true,

      clientList: [],
      slogan: `${store.state.ossBaseUrl}direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png`,

      customer_id: "",
      customer: {},
      type: "",
    };
  },
  onShow() {
    let query = this.$Route.query;
    this.customer_id = query.customer_id;
    this.type = query.type;
    this.init();
  },
  computed: {
    // 展示添加按钮
    showFixedAdd() {
      let flag = false;
      if (this.clientList.length > 0) {
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
      getData("/index/customer", {
        params: {
          page: this.page,
          search_word: this.keyword,
        },
      }).then((res) => {
        const {
          code,
          data: { list, user },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.role_id = user.role_id;

          if (this.page != 1) {
            this.clientList = this.clientList.concat(list.data);
          } else {
            this.clientList = list.data;
          }
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

    // 一维
    choose(v) {
      console.log(v);

      let _th = this;
      uni.$emit("updateData", {
        customer: v,
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
      margin-bottom: 1px;
      padding: 19px 20px 20px 40px;
      background-color: #fff;

      .user_info {
        align-content: center;
        margin-bottom: 5px;
        width: 100%;

        .name {
          margin-right: 20px;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          overflow: hidden;
        }

        .phone {
          font-size: 13px;
          color: #666666;
        }
      }

      .company_name {
        font-size: 12px;
        line-height: 17px;
        color: #666666;
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