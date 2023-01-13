<template>
  <view class="detail">
    <view class="top_txt d-flex">
      <view class="txt">{{ department_name }}</view>
      <view class="r_main" v-if="customer_num_exhibition">
        共跟进{{ total_num }}个客户
      </view>
    </view>

    <view class="admin_list_box">
      <view v-if="userList.length > 0">
        <view
          class="item d-flex avatar_box"
          v-for="(v, i) in userList"
          :key="i"
          @click="userDetail(v)"
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

          <view class="r_info">
            <view class="name_info d-flex">
              <view class="name"> {{ v.user.name }} </view>
              <view class="role" v-if="v.role_id == 3">主管</view>
            </view>

            <view class="btm_info d-flex">
              <view class="phone">{{ v.user.phone }}</view>
              <view class="count" v-if="customer_num_exhibition">
                {{ v.user.customer_count }}个客户
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无成员 </view>
      </view>
    </view>

    <view class="new_fixed_btm" v-if="role_id < 3">
      <view class="item" @click="inviteMember">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-yqcy"></i> -->
		  <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/yqcy%402x.png" mode="aspectFit"></image>
        </view>
        邀请成员
      </view>

      <view class="item" @click="createBranch">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-cjbm"></i> -->
		  <image src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/cjbm%402x.png" mode="aspectFit"></image>
        </view>
        创建部门
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      customer_num_exhibition: false,
      department_id: "",
      department_name: "",
      role_id: null,
      total_num: 0,
      info: {},
      userList: [],
      page: 1,
      next_page: true,
      user_id: "",
      img: `${store.state.ossBaseUrl}direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png`,
    };
  },
  onShow() {
    let query = this.$Route.query;
    if (query.department_id) {
      this.department_id = query.department_id;
      this.department_name = query.department_name;
      this.init();
    }
  },
  methods: {
    init() {
      getData("/department", {
        params: {
          page: this.page,
          department_id: this.department_id,
        },
      }).then((res) => {
        const {
          code,
          data: { customer_num_exhibition, admin_user, role_id, user_id, total_num },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.customer_num_exhibition = customer_num_exhibition;
          this.role_id = role_id;
          this.user_id = user_id;
          this.total_num = total_num;
          this.next_page = admin_user.next_page_url ? true : false;

          if (this.page != 1) {
            this.userList = this.userList.concat(admin_user.data);
          } else {
            this.userList = admin_user.data;
          }
        }
      });
    },

    // 邀请成员
    inviteMember() {
      this.$Router.push({
        path: "/invite_member",
      });
    },
    createBranch() {
      this.$Router.push({
        path: "/add_branch",
        query: {
          allot: true,
        },
      });
    },
    // 成员信息
    userDetail(v) {
      if (this.user_id == v.user.id || !this.customer_num_exhibition) return;

      this.$Router.push({
        path: "/member_detail",
        query: {
          member_user_id: v.user.id,
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
}

.top_txt {
  justify-content: space-between;
  padding: 14px 20px 9px;

  .txt {
    font-size: 13px;
    font-weight: 400;
    color: #999999;
  }

  .r_main {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
  }
}

.admin_list_box {
  // height: 300px;
  overflow-y: scroll;

  .item {
    margin-bottom: 1px;
    padding: 20px;
    background-color: #fff;

    .r_info {
      margin-left: 12px;
      width: 100%;

      .name_info {
        .name {
          margin-right: 8px;
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .role {
          padding: 0 7px;
          height: 22px;
          line-height: 22px;
          text-align: center;
          background: #f0f5ff;
          border-radius: 4px;

          font-size: 12px;
          font-weight: 400;
          color: #316ec3;
        }
      }

      .btm_info {
        justify-content: space-between;

        .phone {
          margin-top: 5px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #666666;
        }

        .count {
          font-size: 12px;
          font-weight: 400;
          color: #666666;
        }
      }
    }
  }
}

.slogan {
  padding: 115px 0 0;
  text-align: center;

  /deep/.u-avatar {
    margin: 0 auto;
  }

  .txt {
    margin: 13px 0 8px;
    font-size: 13px;
    font-weight: 400;
    color: #333333;
  }

  .create {
    justify-content: center;
    color: #316ec3;
    font-size: 13px;
    .iconfont {
      margin-right: 5px;
    }
  }
}
</style>