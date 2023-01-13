<template>
  <view class="login_detail">
    <u-toast ref="uToast"></u-toast>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item label="成员手机号" prop="phone" borderBottom required>
          <u-input
            v-model="info.phone"
            type="number"
            maxlength="11"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            inputAlign="right"
            border="none"
            @input="phoneIpt"
          ></u-input>
        </u-form-item>

        <u-form-item label="成员姓名" prop="name" borderBottom required>
          <u-input
            v-model="info.name"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            inputAlign="right"
            border="none"
          ></u-input>
        </u-form-item>

        <u-form-item
          label="成员角色"
          prop="role"
          borderBottom
          required
          @click="role_list"
        >
          <u-input
            v-model="info.role"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item
          label="分配部门"
          prop="branch"
          required
          @click="branch_list"
          v-if="roleId && roleId !== 2"
        >
          <u-input
            v-model="info.branch"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            inputAlign="right"
            border="none"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>

      <view
        class="fixed_btm btm_btns_box"
        :class="is_submit ? 'lightBtn' : 'btn'"
      >
        <u-button
          @click="confirmRole"
          :loading="createLoading"
          :disabled="createLoading"
        >
          邀请
        </u-button>
      </view>
    </view>

    <u-popup
      :show="popupShow"
      :round="10"
      mode="center"
      :safeAreaInsetBottom="false"
      @close="popupShow = false"
    >
      <view class="popup_box">
        <view class="avatar">
          <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
        </view>

        <view class="content">
          暂无部门

          <view class="txt d-flex" @click="createBranch">
            <i class="icon iconfont icon-tjx"></i>
            创建部门
          </view>
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="popupShow = false"> 取消 </view>
          <view class="btn" @click="createBranch"> 确定 </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";

export default {
  data() {
    return {
      role_id: "",
      createLoading: false,
      popupShow: false,
      info: {
        phone: "",
        name: "",
        role: "",
        branch: "",
      },
      rules: {
        phone: [
          {
            type: "number",
            required: true,
            message: "请输入成员手机号",
            trigger: ["blur", "change"],
          },
          {
            validator: (rule, value, callback) => {
              return this.$u.test.mobile(value);
            },
            message: "手机号码不正确",
            trigger: ["blur"],
          },
        ],
        name: {
          type: "string",
          required: true,
          message: "请输入成员姓名",
          trigger: ["blur", "change"],
        },
        role: {
          type: "string",
          required: true,
          message: "请选择成员角色",
          trigger: ["blur", "change"],
        },
        branch: {
          type: "string",
          required: true,
          message: "请选择成员部门",
          trigger: ["blur", "change"],
        },
      },

      roleId: "", // 角色
      roleShow: false, // 角色
      roleList: [
        {
          id: 2,
          name: "子管理员",
        },
        {
          id: 3,
          name: "主管",
        },
        {
          id: 4,
          name: "销售",
        },
      ],

      branchId: "", // 部门
      branchList: [], // 部门

      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png",
    };
  },
  onLoad() {
    let _th = this;
    uni.$on("updateData", function (data) {
      console.log("updateData >>>", data);
      switch (data.type) {
        case "role":
          _th.roleId = data.value.id;
          _th.info.role = data.value.name;
          break;
        case "branch":
          _th.branchId = data.value.id;
          _th.info.branch = data.value.name;
          break;

        default:
          break;
      }
    });
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      // 部门列表
      getData("/department/list").then((res) => {
        const {
          code,
          data: { department_list },
        } = res;
        if (code === 200) {
          this.branchList = department_list;
          this.popupShow = department_list.length <= 0 ? true : false;
        }
      });
    },

    phoneIpt() {
      if (this.info.phone.length < 11) return;

      getData("/company/matching_name", {
        params: {
          phone: this.info.phone,
        },
      }).then((res) => {
        const {
          code,
          data: { msg, name },
        } = res;
        if (code === 200) {
          this.info.name = name;
        } else if (code === 422) {
          this.$u.toast(msg);
        }
      });
    },

    role_list() {
      this.$Router.push({
        path: "/choose_list",
        query: {
          list: this.roleList,
          type: "role",
          secondLeveShow: true,
        },
      });
    },
    branch_list() {
      this.$Router.push({
        path: "/choose_list",
        query: {
          list: this.branchList,
          type: "branch",
          secondLeveShow: true,
        },
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

    confirmRole() {
      if (!this.is_submit) return;

      this.$refs.uForm.validate().then((res) => {
        this.createLoading = !this.createLoading;

        postData("/company/invitation_join_company", {
          phone: this.info.phone,
          role_id: this.roleId,
          department_id: this.branchId,
        })
          .then((res) => {
            const {
              code,
              data: { msg, phone, role_id, department_id },
            } = res;
            if (code === 200) {
              this.$refs.uToast.show({
                message: msg,
                complete() {
                  uni.navigateBack({ delta: 1 });
                },
              });
            } else if (code === 422) {
              this.createLoading = !this.createLoading;

              if (phone) {
                return this.$u.toast(phone[0]);
              }

              if (role_id) {
                return this.$u.toast(role_id[0]);
              }

              if (department_id) {
                return this.$u.toast(department_id[0]);
              }

              this.$u.toast(msg);
            }else {
              this.$u.toast(msg);
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
          });
      });
    },
  },
  computed: {
    is_submit() {
      const { phone, name, role, branch } = this.info;
      if (phone && name) {
        if (this.roleId === 2) {
          return true;
        } else {
          if (branch && role) {
            return true;
          }
        }
      }
      return false;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
};
</script>

<style lang="less" scoped>
.login_detail {
  padding: 0 0 130px;
}

.form_main {
  background-color: #fff;

  /deep/.u-form-item__body {
    padding: 14px 20px !important;
  }
}

.btm_btns_box {
  margin-top: 170px;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}

// 弹框
.popup_box {
  padding-bottom: 35px;
  width: 321px;
  text-align: center;

  .avatar {
    padding-top: 48px;
    height: 201px;
    background: linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%);
    border-radius: 8px 8px 0px 0px;

    /deep/.u-avatar {
      margin: 0 auto;
    }
  }

  .content {
    margin-bottom: 34px;
    padding: 0 30px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 22px;

    .txt {
      margin-top: 4px;
      justify-content: center;
      font-size: 13px;
      font-weight: 400;
      color: #316ec3;

      .iconfont {
        margin-right: 5px;
      }
    }
  }

  .btm_btns {
    justify-content: center;
    width: 100%;
    padding: 0 30px;

    .btn {
      width: 110px;
      height: 40px;
      line-height: 40px;
      font-size: 17px;
      color: #ffffff;
      text-align: center;
      background-color: #4d6fff;
      border-radius: 2px;
    }

    .cancel {
      margin-right: 25px;
      color: #333;
      background: #fff;
      border: 1px solid #d8d8d8;
    }
  }
}
</style>