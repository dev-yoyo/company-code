<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="company_info d-flex">
      <u-avatar
        :src="info.company.logo"
        :size="48"
        shape="square"
        bg-color="#4D6FFF"
        mode="aspectFit"
      ></u-avatar>

      <view class="name">{{ info.company.name || "暂无" }}</view>
    </view>

    <view class="top_txt d-flex">
      <view class="txt">组织架构</view>

      <view class="r_main d-flex" @click="endCompany" v-if="role_id === 1">
        <i class="icon iconfont icon-tcqy"></i>
        解散企业
      </view>

      <view class="r_main d-flex" @click="outCompany" v-else>
        <i class="icon iconfont icon-tcqy"></i>
        退出企业
      </view>
    </view>

    <!-- 解散企业 -->
    <view class="diss_modal">
      <u-modal :show="dissolveShow" :showConfirmButton="false">
        <view class="end_company_box slot-content">
          <view class="title">确定解散企业吗</view>
          <view class="content"> 确认后将正式进入解散流程， </view>
          <view class="content"> 您企业下的所有数据将全部丢失 </view>

          <view class="btm_btns d-center">
            <view class="btn cancel" @click="dissolveShow = false"> 取消 </view>
            <view class="btn" @click="confirmEnd"> 确定 </view>
          </view>
        </view>
      </u-modal>

      <u-modal :show="is_dissShow" :showConfirmButton="false" width="240">
        <view class="is_diss_box slot-content"> 企业解散成功 </view>
      </u-modal>
    </view>

    <view class="department_list_box">
      <view
        class="item d-flex"
        v-for="(v, i) in departmentList"
        :key="i"
        @click="departmentDetail(v)"
      >
        <view class="name"> {{ v.name }} </view>

        <u-icon name="arrow-right"></u-icon>
      </view>
    </view>

    <!-- 管理员 -->
    <view class="admin_list_box">
      <view
        class="item d-flex avatar_box"
        v-for="(v, i) in adminList"
        :key="i"
        @click="userDetail(v)"
      >
        <u-avatar
          :src="v.admin.avatar"
          :size="46"
          shape="square"
          bg-color="#4D6FFF"
          mode="aspectFit"
          v-if="v.admin.avatar"
        ></u-avatar>
        <u-avatar
          :text="v.admin.abbreviation"
          :size="46"
          shape="square"
          bg-color="#4D6FFF"
          mode="aspectFit"
          v-else
        ></u-avatar>

        <view class="r_info">
          <view class="name_info d-flex">
            <view class="name"> {{ v.admin.name }} </view>
            <view class="role" v-if="v.role_id == 1">管理员</view>
            <view class="role" v-else-if="v.role_id == 2">子管理员</view>
          </view>

          <view class="phone">{{ v.admin.phone }}</view>
        </view>
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

    <!-- 退出企业  退出企业  退出企业  退出企业 -->
    <u-modal
      :show="outShow"
      @confirm="confirmOut"
      @cancel="outShow = false"
      showCancelButton
    >
      <view class="slot-content">
        {{ content }}
      </view>
    </u-modal>

    <u-modal
      :show="confirmGiveMemberShow"
      @confirm="confirmGiveMmber"
      @cancel="confirmGiveMemberShow = false"
      showCancelButton
    >
      <view class="slot-content">
        {{ confirmGiveContent }}
      </view>
    </u-modal>

    <u-popup
      mode="bottom"
      :show="memberShow"
      @close="memberShow = false"
      round="12"
      :safe-area-inset-bottom="true"
    >
      <view class="choose_member_popup">
        <view class="tit">客户交接给</view>

        <view class="user_list_box">
          <view
            class="item d-flex avatar_box"
            v-for="(v, i) in memberList"
            :key="i"
            @click="confirmMember(v)"
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

        <!-- <view class="btm_btns d-flex">
          <view class="btn cancel" @click="memberShow = false"> 取消 </view>
          <view
            class="btn"
            @click="
              memberShow = false;
              comClientShow = true;
            "
          >
            确定
          </view>
        </view> -->
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
export default {
  data() {
    return {
      role_id: null,
      info: {},
      user: {},
      departmentList: [],
      adminList: [],
      userList: [], // 企业成员

      outShow: false,
      dissolveShow: false,
      outtitle: "加载中",
      content: "",
      is_dissShow: false,

      memberList: [], // 部门成员
      memberShow: false, // 企业成员
      noCustomer: false, // 没有客户的销售 直接退出企业
      confirmGiveMemberShow: false,
      confirmGiveContent: "",
      receive_id: "", // 移交成员的 user_id
    };
  },
  created() {},
  onShow() {
    this.init();
  },
  methods: {
    init() {
      getData("/user/admin_list").then((res) => {
        const {
          code,
          data: { admin_user, company_name, department_list, role_id },
        } = res;
        if (code === 200) {
          this.info = company_name;
          this.adminList = admin_user;
          this.departmentList = department_list;
          this.role_id = role_id;
        }
      });

      getData("/user/user_has_customer").then((res) => {
        const {
          code,
          data: { has_customer_status },
        } = res;
        if (code === 200) {
          this.noCustomer = has_customer_status;
        }
      });

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

    // 成员信息
    userDetail(v) {
      if (this.user.id == v.user_id || this.role_id == 0 || this.role_id > 2) {
        return;
      }

      this.$Router.push({
        path: "/member_detail",
        query: {
          member_user_id: v.user_id,
        },
      });
    },

    // 退出企业
    outCompany() {
      // 有客户
      if (this.noCustomer) {
        this.outShow = true;
        this.content = "退出企业前需要交接客户，请先选择交接人";
      } else {
        this.outShow = true;
        this.content = "确认退出企业？";
      }
    },
    confirmOut() {
      // 有客户 移交客户
      if (this.noCustomer) {
        getData("/company/company_member", {
          params: {
            user_id: this.member_user_id,
          },
        }).then((res) => {
          const {
            code,
            data: { user_list },
          } = res;
          if (code === 200) {
            this.memberList = user_list.data;

            this.outShow = false;
            this.memberShow = true;
          }
        });
      } else {
        this.exitCompany();
      }
    },
    confirmMember(v) {
      console.log(v);
      this.confirmGiveMemberShow = true;
      this.memberShow = false;
      this.receive_id = v.user.id;
      this.confirmGiveContent = `确定将客户移交给${v.user.name}吗？`;
    },
    confirmGiveMmber() {
      this.exitCompany();
    },
    // 退出企业 接口
    exitCompany() {
      postData("/user/exit_company", {
        receive_id: this.receive_id,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.outShow = false;
          this.confirmGiveMemberShow = false;
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

    // 解散企业
    endCompany() {
      this.dissolveShow = true;
    },
    confirmEnd() {
      this.$Router.push({
        path: "/dissolition_company",
      });
    },

    // 部门详情
    departmentDetail(v) {
      this.$Router.push({
        path: "/branch_list",
        query: {
          department_id: v.id,
          department_name: v.name,
        },
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

.company_info {
  padding: 15px 15px;
  width: 100%;
  height: 75px;
  background: #fff;

  /deep/ .u-avatar {
    border: 1px solid #e8e8e8;
    border-radius: 10px;
    overflow: hidden;
  }

  .name {
    margin-left: 16px;
    font-size: 16px;
    font-weight: 600;
    color: #333333;
  }
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

    .iconfont {
      font-size: 12px;
      margin-right: 5px;
    }
  }
}

.department_list_box {
  .item {
    justify-content: space-between;
    padding: 20px;
    background-color: #fff;

    .name {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }

    /deep/.u-icon__icon {
      font-size: 14px !important;
      color: #666666 !important;
      font-weight: 600 !important;
    }
  }
}

.admin_list_box {
  margin-top: 17px;
  height: 300px;
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

      .phone {
        margin-top: 5px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #666666;
      }
    }
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

// 确认删除
.del_popup {
  .del_txt {
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    text-align: center;
    padding-bottom: 14px;

    text {
      color: #4d6fff;
    }
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

.diss_modal {
  /deep/.u-modal__content {
    padding: 0 !important;
  }

  .end_company_box {
    padding: 34px 30px 20px;
    width: 100%;
    text-align: center;

    .title {
      margin-bottom: 22px;
      font-size: 15px;
      font-weight: 600;
      line-height: 21px;
      color: #333333;
    }

    .content {
      color: #333;
      font-size: 15px;
    }

    .btm_btns {
      margin-top: 24px;
      width: 100%;

      .btn {
        width: 100%;
        height: 40px;
        line-height: 40px;
        font-size: 17px;
        color: #ffffff;
        text-align: center;
        background: #4d6fff;
        border-radius: 8px;
      }

      .cancel {
        margin-right: 25px;
        color: #333;
        background: #fff;
        border: 1px solid #d8d8d8;
      }
    }
  }
}

// 选择成员 弹框
.choose_member_popup {
  padding: 11px 0 0;

  .tit {
    padding: 0 20px;
    margin-bottom: 37px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
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
}

.slot-content {
  font-size: 14px;
  line-height: 18px;
  color: #666666;
  text-align: center;
}
</style>