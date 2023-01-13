<template>
  <view class="login_detail">
    <u-toast ref="uToast"></u-toast>

    <view class="user_main">
      <view class="user_info d-flex avatar_box">
        <u-avatar
          :text="abbreviation"
          :size="46"
          shape="square"
          bg-color="#4D6FFF"
          mode="aspectFit"
        ></u-avatar>

        <view class="r_main d-flex">
          <view class="name">{{ user_name || "暂无" }}</view>
          <view class="phone">{{ user_phone || "暂无" }}</view>
        </view>
      </view>
    </view>

    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item
          label="成员角色"
          prop="role"
          borderBottom
          @click="roleShow = true"
          required
        >
          <u-input
            v-model="info.role"
            placeholder="请选择"
            placeholderStyle="#999999" fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>

          <u-popup
            mode="right"
            :show="roleShow"
            @close="roleShow = false"
            :safe-area-inset-bottom="true"
          >
            <view class="chooseIndustry">
              <view
                class="item"
                v-for="(v, i) of roleList"
                :key="i"
                @click="
                  roleShow = false;
                  role_id = v.id;
                  info.role = v.name;
                "
              >
                {{ v.name }}
              </view>
            </view>
          </u-popup>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item
          label="分配部门"
          prop="branch"
          borderBottom
          @click="branchShow = true"
          required
          v-if="role_id > 2"
        >
          <u-input
            v-model="info.branch"
            placeholder="请选择"
            placeholderStyle="#999999" fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>

          <u-popup
            mode="right"
            :show="branchShow"
            @close="branchList = false"
            :safe-area-inset-bottom="true"
          >
            <view class="chooseIndustry">
              <view
                class="item"
                v-for="(v, i) of branchList"
                :key="i"
                @click="chooseBranch(v)"
              >
                {{ v.name }}
              </view>
            </view>
          </u-popup>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>

      <view class="fixed_btm">
        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="cancel"> 取消 </view>
          <view
            class="btn"
            :class="is_submit ? 'is_submit' : ''"
            @click="confirm"
            :loading="createLoading"
            :disabled="createLoading"
          >
            确定
          </view>
        </view>
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
      createLoading: false,
      user_id: "",
      user_name: "",
      user_phone: "",
      abbreviation: "",
      content_id: "",

      info: {
        role: "",
        branch: "",
      },
      rules: {
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
      roleShow: false,
      role_id: null,
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

      branchShow: false,
      branch_id: null,
      branchList: [],

      popupShow: false,
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png",
    };
  },
  onShow() {
    let query = this.$Route.query;
    if (query.user_id) {
      this.user_id = query.user_id;
      this.user_name = query.name;
      this.user_phone = query.phone;
      this.abbreviation = query.abbreviation;

      this.content_id = query.content_id;
      this.init();
    }
  },
  computed: {
    is_submit() {
      let flag = false;

      if (this.role_id >= 3 && this.branch_id) {
        flag = true;
      } else if (this.role_id < 3 && this.role_id != null) {
        // 子管理员不需要 分配部门
        flag = true;
      }

      return flag;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
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

          if (department_list.length <= 0) {
            this.popupShow = true;
          } else {
            this.popupShow = false;
          }
        }
      });
    },

    chooseBranch(v) {
      this.branchShow = false;
      this.branch_id = v.id;
      this.info.branch = v.name;
    },

    confirm() {
      if (!this.is_submit) return;

      this.$refs.uForm
        .validate()
        .then((res) => {
          this.createLoading = !this.createLoading;

          postData("/company/agree_company", {
            content_id: this.content_id,
            status: 1,

            user_id: this.user_id,
            role_id: this.role_id,
            department_id: this.branch_id,
          })
            .then((res) => {
              const {
                code,
                data: { msg },
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
                this.$u.toast(msg);
              } else {
                this.createLoading = !this.createLoading;
                this.$u.toast(msg);
              }
            })
            .catch(() => {
            //   uni.$u.toast("操作失败，请重试");
              this.createLoading = !this.createLoading;
            });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    cancel() {
      uni.navigateBack({ delta: 1 });
    },

    createBranch() {
      this.$Router.push({
        path: "/add_branch",
        query: {
          allot: true,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.login_detail {
  padding: 0 0 130px;
  height: 100%;
}

.user_main {
  width: 100%;
  padding: 28px 15px 15px;
  background: linear-gradient(180deg, #ffffff 0%, #e6efff 100%);

  .user_info {
    align-items: flex-start;
    padding: 23px 20px 0;
    height: 100px;
    background-color: #fff;
    box-shadow: 0px -1px 4px #f3f3f8;
    border-radius: 10px;

    .r_main {
      margin-left: 12px;
      width: 100%;
      line-height: 1;

      .name {
        margin-right: 12px;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
      }

      .phone {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
      }
    }
  }
}

.form_main {
  background-color: #fff;

  /deep/.u-form-item__body {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }
}

.btm_btns {
  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

.fixed_btm {
  .btm_btns {
    justify-content: center;
    width: 100%;

    .btn {
      width: 100%;
      height: 42px;
      line-height: 42px;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      background: #e8e8e8;
      border-radius: 21px;
    }

    .cancel {
      margin-right: 20px;
      color: #666666;
      background: #fff;
      border: 1px solid #707070;
    }

    .is_submit {
      background: #4d6fff !important;
    }
  }
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