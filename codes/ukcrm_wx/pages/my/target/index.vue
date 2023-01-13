<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="year_list" v-if="list.length > 0">
      <view
        class="item d-between"
        v-for="(v, i) of list"
        :key="i"
        @click="detail(v)"
      >
        {{ v.year }}年{{ user.role_id > 2 ? "部门业绩" : "业绩" }}目标
        <i class="icon iconfont icon-you"></i>
      </view>
    </view>

    <view class="slogan" v-else>
      <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

      <view class="txt"> 暂无数据 </view>
    </view>

    <view class="new_fixed_btm" v-if="user.role_id < 3">
      <view class="item" @click="addTarget">
        <view class="icon_box">
          <i class="icon iconfont icon-xjssjl"></i>
        </view>
        新建目标
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      user: {},
      list: [],
      noData: store.state.no_data,
    };
  },
  onShow() {
    let query = this.$Route.query;
    console.log(query);

    this.init();
  },
  methods: {
    init() {
      this.getList();

      getUser().then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.user = user;
        }
      });
    },
    getList() {
      getData("/achievement/achievement_year_director", {}).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.list = list;
        }
      });
    },

    detail(v) {
      if (this.user.role_id < 3) {
        this.$Router.push({
          path: `/company_target_admin_detail`,
          query: {
            year: v.year,
          },
        });
      } else {
        this.$Router.push({
          path: "/company_target_detail",
          query: {
            year: v.year,
          },
        });
      }
    },
    addTarget() {
      this.$Router.push({
        path: "/company_target_admin_detail",
        query: {
          add: true,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 10px 0 120px;
}

.year_list {
  .item {
    margin-bottom: 1px;
    padding: 0 20px;
    width: 100%;
    height: 75px;
    background: #fff;

    .label {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }

    .iconfont {
      font-size: 14px;
      color: #c3c3c3;
    }
  }
}

.slogan {
  width: 100%;
  height: calc(100vh - 46px);
  background: #fff;
  padding: 160px 0 0;
}
</style>