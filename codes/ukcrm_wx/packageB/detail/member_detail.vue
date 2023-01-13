<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="top_bgc">
      <view class="info_box d-flex avatar_box">
        <u-avatar :src="info.user.avatar" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit"
          v-if="info.user.avatar"></u-avatar>
        <u-avatar :text="info.user.abbreviation" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit" v-else>
        </u-avatar>

        <view class="r_info">
          <view class="info d-flex">
            <view class="name"> {{ info.user.name || "暂无" }} </view>
            <view class="phone">{{ info.user.phone || "暂无" }}</view>
          </view>

          <view class="tag d-flex">
            <view class="name"> {{ info.role_name || "暂无" }} </view>
            <view class="txt">{{ info.department.name || "暂无" }}</view>
          </view>
        </view>
      </view>
    </view>

    <!-- 销售简报 -->
    <view class="dash_board">
      <view class="dash_mian">
        <view class="tit">
          <view class="tit_text">
            销售简报
            <i class="t-icon iconfont t-icon-a-lujing420" @click="tipShow = true"></i>

            <u-modal :show="tipShow" width="321px" @confirm="tipShow = false">
              <view class="slot-content">
                <view class="tips">
                  <view class="l_tit">注释说明：</view>
                  <!-- <view class="r_info">
                    <view class="r_txt">
                      1、审核通过/无需审核的报价单，有效期为7天
                    </view>
                    <view class="r_txt">
                      2、报价单失效后，无法进行关联合同
                    </view>
                  </view> -->
                  <ul class="r_info">
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">新增客户：</span>
                          <span class="tip_text">
                            时间区间内，新添加的客户
                          </span>
                        </view>
                        <view class="tip_bottom">
                          <span class="tip_sec">
                            包括从公海池领取/分配的客户以及其他人移交的客户
                          </span>
                        </view>
                      </view>
                    </li>
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">新增跟进：</span>
                          <span class="tip_text">
                            ：时间区间内，添加的新的跟进记录
                          </span>
                        </view>
                        <view class="tip_bottom">
                          <span class="tip_sec">
                            注意是跟进记录
                          </span>
                        </view>
                      </view>
                    </li>
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">新增成交客户：</span>
                          <span class="tip_text">
                            时间区间内，第一次添加合同的客户
                          </span>
                        </view>
                      </view>
                    </li>
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">未更新客户：</span>
                          <span class="tip_text">
                            时间区间内，没有任何添加任何跟进记录、合同、报价、回款的客户
                          </span>
                        </view>
                      </view>
                    </li>
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">放弃客户：</span>
                          <span class="tip_text">
                            时间区间内，放入公海池的客户
                          </span>
                        </view>
                      </view>
                    </li>
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">新增合同：</span>
                          <span class="tip_text">
                            时间区间内，新增的合同订单
                          </span>
                        </view>

                      </view>
                    </li>
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">合同金额：</span>
                          <span class="tip_text">
                            时间区间内，新增合同订单的总金额
                          </span>
                        </view>
                        <view class="tip_bottom">
                          <span class="tip_sec">
                            注：终止的合同，仅计入已回款的金额，未回款的金额不计入合同金额中
                          </span>
                        </view>
                      </view>
                    </li>
                    <li>
                      <view class="tip_box">
                        <view class="tip_top">
                          <span class="tip_name">已回款：</span>
                          <span class="tip_text">
                            时间区间内，新增的回款总额
                          </span>
                        </view>

                      </view>
                    </li>
                  </ul>
                </view>
              </view>
            </u-modal>
          </view>

          <view class="tit_date" @click="dashDateShow">
            {{ dashSelectInfo.activeDate || "本年度" }}
            <i class="icon iconfont icon-xl2"></i>
          </view>
        </view>

        <view class="data_content d-flex">
          <!-- 新增客户 -->
          <view class="item t_item ">
            <view class="top_info d-flex">
              <view class="item_tit">新增客户</view>
            </view>

            <view class="btm_info">
              <text :class="saleInfo.added_customer ? 'num' : ''">
                {{ saleInfo.added_customer || "-" }}
              </text>
              人
            </view>
          </view>
          <!-- 新增合同 -->

          <!-- 新增跟进 -->
          <view class="item t_item">
            <view class="top_info d-flex">
              <view class="item_tit">新增跟进</view>
            </view>

            <view class="btm_info">
              <text :class="
                saleInfo.follow_records ? 'price' : ''
              ">
                {{
                    saleInfo.follow_records
                      ? saleInfo.follow_records
                      : "-"
                }}
              </text>
              条
            </view>
          </view>
          <!-- 合同金额 -->

          <!-- 新增成交用户 -->
          <view class="item e_item">
            <view class="top_info d-flex">
              <view class="item_tit">新增成交客户</view>
            </view>

            <view class="btm_info">
              <text :class="
                saleInfo.newly_added_deal_customer_count ? 'price' : ''
              ">
                {{ saleInfo.newly_added_deal_customer_count || "-" }}
              </text>

              人
            </view>
          </view>
          <!-- 新增成交用户 -->

          <!-- 未更新客户 -->
          <view class="item l_item">
            <view class="top_info d-flex">
              <view class="item_tit">未更新客户</view>
            </view>

            <view class="btm_info">
              <text :class="saleInfo.final_arr ? 'num' : ''">
                {{ saleInfo.final_arr || "-" }}
              </text>
              人
            </view>
          </view>
          <!-- 未更新客户 -->

          <!-- 放弃客户-->
          <view class="item l_item ">
            <view class="top_info d-flex">
              <view class="item_tit">放弃客户</view>
            </view>

            <view class="btm_info">
              <text :class="
                saleInfo.giving_up_customers ? 'num' : ''
              ">
                {{ saleInfo.giving_up_customers || "-" }}
              </text>
              人
            </view>
          </view>
          <!-- 放弃客户-->

          <!-- 新增合同 -->
          <view class="item et_item">
            <view class="top_info d-flex">
              <view class="item_tit">新增合同</view>
            </view>

            <!-- 新增合同 -->
            <view class="btm_info">
              <text :class="saleInfo.new_contract_count ? 'price' : ''">
                {{ saleInfo.new_contract_count || "-" }}
              </text>
              单
            </view>
          </view>

          <!-- 新增合同 -->
          <view class="item bl_item">
            <view class="top_info d-flex">
              <view class="item_tit">合同金额</view>
            </view>

            <!-- 新增合同 -->
            <view class="btm_info">
              <text :class="saleInfo.index_current_contract_money ? 'num' : ''">
                {{ saleInfo.index_current_contract_money || "-" }}
              </text>
              元
            </view>
          </view>

          <!-- 已回款 -->
          <view class="item .br_item">
            <view class="top_info d-flex">
              <view class="item_tit">已回款</view>
            </view>

            <!-- 已回款 -->
            <view class="btm_info">
              <text :class="saleInfo.index_current_payment_collection ? 'price' : ''">
                {{ saleInfo.index_current_payment_collection || "-" }}
              </text>
              元
            </view>
          </view>


        </view>
      </view>
    </view>
    <!-- 仪表盘 -->

    <!-- 跟进客户 -->
    <view class="business_box">
      <view class="top_tit d-flex">
        <view class="l_tit d-flex">
          <i class="icon iconfont icon-gjke"></i>
          跟进客户
        </view>

        <view class="r_tit"> {{ info.customer_count || 0 }}个客户 </view>
      </view>

      <view class="list_box" v-if="customerList.length > 0">
        <view class="item d-flex avatar_box" v-for="(v, i) in customerList" :key="i" @click="clientData(v)">
          <u-avatar :text="v.customer.abbreviation" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit">
          </u-avatar>

          <view class="r_main">
            <view class="info d-flex">
              <view class="title"> {{ v.customer.name }} </view>
              <view class="time">{{ v.customer.phone }}</view>
              <view class="status" v-if="v.deal_status">
                <view class="status_route">

                </view>
                已成交
              </view>
            </view>

            <view class="company_name">{{ v.customer.company }}</view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无客户 </view>
      </view>
    </view>

    <view class="content_box">

    </view>

    <view class="new_fixed_btm">
      <view class="item" @click="showMove" v-if="role_id < 3">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-ycqy"></i> -->
          <image class="icon iconfont"
            src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/ycqy%402x.png" mode="aspectFit">
          </image>
        </view>
        移出企业
      </view>

      <view class="item" @click="taskShow = true" v-if="role_id < 3">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-tzcy"></i> -->
          <image class="icon iconfont"
            src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/tzcy%402x.png" mode="aspectFit">
          </image>
        </view>
        调整成员
      </view>

      <view class="item" @click="transferShow = true" v-if="role_id == 1">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-yjqx"></i> -->
          <image class="icon iconfont"
            src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/yjqx%402x.png" mode="aspectFit">
          </image>
        </view>
        移交权限
      </view>
    </view>

    <u-modal :show="transferShow" @confirm="transferAdmin" @cancel="transferShow = false" showCancelButton>
      <view class="slot-content"> 确定移交权限？ </view>
    </u-modal>

    <u-modal :show="moveMemberShow" @confirm="moveMember" @cancel="moveMemberShow = false" showCancelButton>
      <view class="slot-content"> 确定移出企业？ </view>
    </u-modal>

    <!-- 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 -->
    <!-- 移除企业 -->
    <u-popup mode="bottom" :show="moveShow" @close="moveShow = false" round="12" :safe-area-inset-bottom="true">
      <view class="move_ppopup">
        <view class="tit">确定移除</view>

        <view class="content">
          {{ info.user.name }}跟进了{{
              info.customer_count
          }}个客户，是否将他移出企业
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="moveShow = false"> 取消 </view>
          <view class="btn" @click="showGive"> 移除 </view>
        </view>
      </view>
    </u-popup>

    <u-popup mode="bottom" :show="userShow" @close="userShow = false" round="12" :safe-area-inset-bottom="true">
      <view class="choose_member_popup">
        <view class="tit">客户交接给</view>

        <view class="user_list_box">
          <view class="item d-flex avatar_box" v-for="(v, i) in memberList" :key="i" @click="confirmMember(v)">
            <u-avatar :src="v.user.avatar" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit"
              v-if="v.user.avatar"></u-avatar>
            <u-avatar :text="v.user.abbreviation" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit" v-else>
            </u-avatar>

            <view class="r_info d-flex">
              <view class="name"> {{ v.user.name }} </view>
              <view class="phone">{{ v.user.phone }}</view>
            </view>
          </view>
        </view>
        <u-gap height="10" bgColor="#f7f7f7"></u-gap>

        <!-- <view class="btm_btns d-flex">
          <view class="btn cancel" @click="userShow = false"> 取消 </view>
          <view
            class="btn"
            @click="
              userShow = false;
              comClientShow = true;
            "
          >
            确定
          </view>
        </view> -->
      </view>
    </u-popup>

    <u-popup :show="comClientShow" :round="10" mode="center" :safeAreaInsetBottom="false"
      @close="comClientShow = false">
      <view class="popup_box">
        <u-avatar :src="slogan" :size="128" mode="aspectFit"></u-avatar>

        <view class="content">客户无交接，全部进入企业公海池</view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="comClientShow = false"> 取消 </view>
          <view class="btn" @click="moveConfirm"> 确定 </view>
        </view>
      </view>
    </u-popup>
    <!-- 移除企业 移除企业 移除企业 移除企业 -->

    <!-- 调整成员 -->
    <u-popup :show="taskShow" :round="10" mode="bottom" :safeAreaInsetBottom="false" @close="taskShow = false">
      <view class="task_member_popup">
        <view class="tit">调整成员</view>

        <view class="form_main">
          <u-form ref="uForm" :model="taskInfo" :rules="rules" labelPosition="left" labelWidth="100">
            <u-form-item label="成员角色" prop="role" borderBottom required @click="roleShow = true">
              <u-input v-model="taskInfo.role" placeholder="请输入" placeholderStyle="#999999" fontSize="14" border="none"
                inputAlign="right" readonly></u-input>

              <u-popup mode="right" :show="roleShow" @close="roleShow = false" :safe-area-inset-bottom="true">
                <view class="chooseIndustry">
                  <view class="item" v-for="(v, i) of roleList" :key="i" @click="chooseRole(v)">
                    {{ v.name }}
                  </view>
                </view>
              </u-popup>
              <u-icon slot="right" name="arrow-right"></u-icon>
            </u-form-item>

            <u-form-item label="分配部门" prop="branch" required @click="showBranch" v-if="task_role_id > 2">
              <u-input v-model="taskInfo.branch" placeholder="请输入" placeholderStyle="#999999" fontSize="14"
                inputAlign="right" border="none" readonly></u-input>

              <u-popup mode="right" :show="branchShow" @close="branchShow = false" :safe-area-inset-bottom="true">
                <view class="chooseIndustry">
                  <view class="item" v-for="(v, i) of branchList" :key="i" @click="chooseBranch(v)">
                    {{ v.name }}
                  </view>
                </view>
              </u-popup>
              <u-icon slot="right" name="arrow-right"></u-icon>
            </u-form-item>
          </u-form>
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="taskShow = false"> 取消 </view>
          <view class="btn" :class="is_submit ? 'is_submit' : ''" @click="confirmRole">
            确定
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 选择时间 -->
    <choosedate :dateShow="dateShow" :dateList="dateList" :dateInfo="dateInfo" @chooseTime="chooseTime"
      @submitDate="submitDate" @hideChooseDate="hideChooseDate"></choosedate>
  </view>
</template>

<script>
import { getData, postData, isSelfClient } from "@/common/api";
import choosedate from "@/components/chooseDate.vue"; // 选择时间

export default {
  components: {
    choosedate,
  },
  data() {
    return {
      role_id: "",
      member_user_id: "",
      page: 1,
      next_page: true,
      company_id: '', // 公司id

      tipShow: false, // 提示框

      info: {},
      saleInfo: {}, // 销售简报数据

      dateShow: false, // 时间选择
      dateList: ["今天", "昨天"],
      dateInfo: {
        selectType: "dash", // 当前是哪个筛选日期  dash 仪表盘 sell 销售
        activeDate: 0, // i 后端arr diy 自定义
        startTime: "",
        endTime: "",
        showStartTime: "",
        showEndTime: "",
      },

      dashSelectInfo: {
        selectType: "dash", // 当前是哪个筛选日期  dash 仪表盘 sell 销售
        activeDate: "本年度", // i 后端arr diy 自定义
        startTime: "",
        endTime: "",
        showStartTime: "",
        showEndTime: "",
        showTxt: true, // 展示 较上月 等
      }, //仪表盘筛 选时间

      customerList: [], // 客户列表
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png",

      member_page: 1,
      member_next_page: true,
      memberList: [], // 企业成员

      moveShow: false, // 移除企业
      userShow: false, // 选择企业成员
      comClientShow: false,
      moveUserId: "", // 移交的 user_id
      slogan:
        "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png",

      taskShow: false, // 调整成员
      taskInfo: {
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
      task_role_id: null,
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

      transferShow: false,

      moveMemberShow: false, // 直接移出成员
    };
  },
  onShow() {
    let query = this.$Route.query;
    if (query.member_user_id) {
      this.member_user_id = query.member_user_id;
      this.init();
      this.initDate();
    }

    // 部门列表
    getData("/department/list").then((res) => {
      const {
        code,
        data: { department_list },
      } = res;
      if (code === 200) {
        this.branchList = department_list;
      }
    });
  },
  computed: {
    is_submit() {
      let flag = false;
      if (this.task_role_id >= 3 && this.branch_id) {
        flag = true;
      } else if (this.task_role_id < 3 && this.task_role_id != null) {
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
      getData("/user/member_info", {
        params: {
          user_id: this.member_user_id,
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { customer_list, member_info, role_id, time_search },
        } = res;
        if (code === 200) {
          this.info = member_info;
          this.role_id = role_id;

          let list = customer_list;
          if (this.page != 1) {
            this.customerList = this.customerList.concat(list.data);
          } else {
            this.customerList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
          this.dateList = time_search;
          this.company_id = member_info.company_id;
        }
        this.getUserList();
        this.getSaleData();
      });
    },
    // 企业成员
    getUserList() {
      getData("/company/company_department_member", {
        params: {
          user_id: this.member_user_id,
        },
      }).then((res) => {
        const {
          code,
          data: { user_list, role_id },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.memberList = user_list.data;
        }
      });
    },

    showMove() {
      // 没有客户 直接移出
      if (this.info.customer_count <= 0) {
        this.moveMemberShow = true;
      } else {
        this.moveShow = true;
      }
    },
    // 直接移出 成员
    moveMember() {
      postData(`/company/remove_company`, {
        user_id: this.info.user.id,
        receive_user_id: "",
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.moveMemberShow = false;

          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 1 });
            },
          });
        } else {
          this.$u.toast(msg);
        }
      });
    },

    chooseMember(v) {
      this.userShow = false;
      this.moveUserId = v.id;
    },
    // 移交
    showGive() {
      this.moveShow = false;
      this.userShow = true;
    },
    // 确定把客户 移交给某个成员
    confirmMember(v) {
      if (this.info.user.id == v.user.id) {
        uni.$u.toast("不能移交给自己");
        return;
      }

      postData(`/company/remove_company`, {
        user_id: this.info.user.id,
        receive_user_id: v.user.id,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.userShow = false;

          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 1 });
            },
          });
        }
      });
    },
    // 确定移除，客户转入公共池
    moveConfirm() {
      postData(`/company/remove_company`, {
        user_id: this.getUserId,
        receive_user_id: "",
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.userShow = false;
          this.comClientShow = false;

          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 1 });
            },
          });
        } else {
          this.$u.toast(msg);
        }
      });
    },

    // 查看客户资料
    clientData(v) {
      this.$Router.push({
        path: "/client/" + v.customer_id,
        query: {
          id: v.customer_id,
        },
      });
    },

    // 移交权限
    transferAdmin() {
      postData(`/user/transfer_admin_jurisdiction`, {
        user_id: this.info.user_id,
      }).then((res) => {
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
        } else {
          this.$u.toast(msg);
        }
      });
    },

    chooseRole(v) {
      this.roleShow = false;
      this.task_role_id = v.id;
      this.taskInfo.role = v.name;

    },
    chooseBranch(v) {
      this.branchShow = false;
      this.branch_id = v.id;
      this.taskInfo.branch = v.name;
    },

    showBranch() {
      if (this.branchList.length <= 0) {
        uni.$u.toast("暂无部门，请先添加部门");
        return;
      }
      this.branchShow = true;
    },

    confirmRole() {
      if (!this.is_submit) return;

      this.$refs.uForm
        .validate()
        .then((res) => {
          this.createLoading = !this.createLoading;

          postData("/user/adjustment_member", {
            user_id: this.info.user_id,
            role_id: this.task_role_id,
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
              uni.$u.toast("操作失败，请重试");
              this.createLoading = !this.createLoading;
            });
        })
        .catch((e) => {
          uni.$u.toast("操作失败，请重试");
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

    // 展示用户销售简报
    getSaleData() {
      let params = {};
      if (this.dashSelectInfo.showStartTime && this.dashSelectInfo.showEndTime) {
        params = {
          user_id: this.member_user_id,
          company_id: this.company_id,
          timing: [this.dashSelectInfo.showStartTime, this.dashSelectInfo.showEndTime],
        }
      } else {
        params = {
          user_id: this.member_user_id,
          company_id: this.company_id,
          timing: this.dashSelectInfo.activeDate,
        }
      }
      getData("/user/member_statistics", {
        params
      }).then((res) => {
        const {
          code,
          data,
        } = res;
        if (code === 200) {
          this.saleInfo = data
        }

      });
    },

    // 选择时间 ----------- 选择时间 -----------选择时间 -----------
    // 时间默认值
    initDate() {
      const d = new Date();
      const year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;

      let val = `${year}-${month}-${day}`;
      this.dateInfo.startTime = val;
      this.dateInfo.endTime = val;

      this.dashSelectInfo.startTime = val;
      this.dashSelectInfo.endTime = val;
    },
    dashDateShow() {
      this.dateInfo = this.dashSelectInfo;
      this.dateShow = true;
    },

    // 确认 时间选择
    submitDate(v) {
      // 仪表盘
      if (v.selectType == "dash") {
        // 自定义
        if (v.activeDate == "diy" || !v.showTxt) {
          if (!v.showStartTime) {
            return this.$u.toast("请选择开始时间");
          }
          if (!v.showEndTime) {
            return this.$u.toast("请选择结束时间");
          }

          v.activeDate = `${v.showStartTime}...`;
        }

        this.dashSelectInfo = v;
        this.getSaleData();
      }

      this.dateShow = false;
    },

    hideChooseDate() {
      this.dateShow = false;
    },
    // 选择时间 ----------- 选择时间 -----------选择时间 -----------
  },
};
</script>

<style lang="less" scoped>
.detail {
  padding: 0 0 130px;
  height: 100%;

  .top_bgc {
    width: 100%;
    height: 143px;
    background: linear-gradient(180deg, #ffffff 0%, #e6efff 100%);
    padding: 28px 15px 0;

    .info_box {
      padding: 0 20px;
      width: 100%;
      height: 100px;
      background: rgba(255, 255, 255, 0.39);
      box-shadow: 0px -1px 4px #f3f3f8;
      border-radius: 10px;

      .r_info {
        margin-left: 12px;
        width: 100%;

        .info {
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

        .tag {
          .name {
            margin-right: 12px;
            height: 22px;
            line-height: 22px;
            text-align: center;
            background: #f0f5ff;
            border-radius: 4px;

            font-size: 12px;
            font-weight: 400;
            color: #316ec3;
          }

          .txt {
            font-size: 13px;
            color: #666666;
          }
        }
      }
    }
  }

  .business_box {
    padding: 9px 15px;

    .top_tit {
      justify-content: space-between;
      line-height: 1;
      margin-bottom: 10px;

      .l_tit {
        font-size: 14px;
        font-weight: 600;
        color: #333333;

        .iconfont {
          margin-right: 5px;
          color: #4d6fff;
          font-size: 14px;
        }
      }

      .r_tit {
        font-size: 12px;
        color: #333;
      }
    }

    .list_box {
      .item {
        margin-bottom: 10px;
        padding: 19px 19px 20px;
        background-color: #fff;
        border-radius: 10px;

        .r_main {
          margin-left: 12px;
          width: 100%;
          position: relative;

          .info {
            // justify-content: space-between;
            margin-bottom: 6px;
            width: 100%;

            .status {
              // float: right;
              position: absolute;
              right: 0;
              font-size: 12px;
              font-family: PingFang SC;
              font-weight: 400;
              line-height: 17px;
              color: #03C919;
              opacity: 1;
              display: flex;
              justify-content: center;
              align-items: center;

              .status_route {
                width: 5px;
                height: 5px;
                background: rgba(49, 211, 67, 1);
                border-radius: 50%;
                opacity: 1;
                margin-right: 6px;
              }
            }

            .title {
              margin-right: 12px;
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }

            .time {
              font-size: 12px;
              color: #999;
            }
          }

          .company_name {
            font-size: 13px;
            color: #999999;
          }
        }
      }
    }

    .slogan {
      padding: 94px 0 0;
    }
  }
}

// 底部 移除 弹框
.move_ppopup {
  padding: 11px 20px 38px;

  .tit {
    margin-bottom: 37px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #999999;
  }

  .content {
    font-size: 15px;
    font-weight: 600;
    line-height: 21px;
    color: #333333;
  }

  .btm_btns {
    margin-top: 48px;
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
      background: #4d6fff;
      border-radius: 21px;
    }

    .cancel {
      margin-right: 20px;
      color: #666666;
      background: #fff;
      border: 1px solid #707070;
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

  .btm_btns {
    padding: 7px 15px 15px;
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
      background: #4d6fff;
      border-radius: 21px;
    }

    .cancel {
      margin-right: 20px;
      color: #666666;
      background: #fff;
      border: 1px solid #707070;
    }
  }
}

// 客户流入公海池 确认弹框
.popup_box {
  width: 321px;
  padding: 0 30px 35px;
  text-align: center;

  /deep/.u-avatar {
    margin: 43px auto 54px;
  }

  .content {
    margin-bottom: 30px;
    font-size: 15px;
    font-weight: 600;
    line-height: 21px;
  }

  .btm_btns {
    justify-content: center;
    width: 100%;

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

.task_member_popup {
  padding: 11px 0 0;

  .tit {
    padding: 0 20px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #999999;
  }

  .form_main {
    padding: 0 20px;
    background-color: #fff;
  }

  .btm_btns {
    padding: 0 20px;
    margin: 20px 0;
    justify-content: center;
    width: 100%;

    .btn {
      width: 100%;
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

    .is_submit {
      background: #4d6fff !important;
    }
  }
}

// 销售简报
.dash_board {
  margin-bottom: 20px;

  .dash_mian {
    padding: 25px 25px 0;
    width: 100%;
    height: 297px;
    background: #fff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;

    .tit {
      margin-bottom: 20px;
      font-size: 14px;
      font-weight: 600;
      line-height: 18px;
      color: #333333;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .tit_text {
        display: flex;
        align-items: center;

        .iconfont {
          margin-left: 6px;
          font-size: 13px;
          color: #333333;
        }
      }

      .tit_date {
        min-width: 68px;
        padding: 0 6px;
        height: 30px;
        background: rgba(248, 248, 248, 1);
        opacity: 1;
        border-radius: 15px;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 17px;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: center;

        .iconfont {
          font-size: 6px;
        }
      }
    }

    .data_content {
      flex-wrap: wrap;

      .item {
        padding: 20px 0px 20px 19px;
        width: 33%;
        border-bottom: 1px solid #f2f2f2;

        .top_info {
          justify-content: space-between;
          align-items: baseline;

          .item_tit {
            font-size: 13px;
            font-weight: 400;
            color: #333;
          }

          .t_r_info {
            text-align: right;
            font-size: 12px;
            font-weight: 400;
            line-height: 16px;
            color: #999999;

            .count {
              color: #999999;
            }

            .add {
              color: #ff4500 !important;
            }

            .sub {
              color: #2ab22a !important;
            }
          }
        }

        .btm_info {
          font-size: 12px;
          color: #666666;
          line-height: 1;
          margin-top: 6px;

          text {
            font-size: 16px;
            color: #999999;
            margin-right: 3px;
          }

          .price {
            font-size: 16px;
            font-weight: 600;
            color: #ff9d00;
          }

          .num {
            font-size: 16px;
            font-weight: 600;
            color: #4d6fff;
          }
        }
      }

      .t_item {
        padding-top: 0;
        border-right: 1px solid #f2f2f2;

      }

      .l_item {
        border-right: 1px solid #f2f2f2;
      }

      .btm_tiem {
        border-bottom: none;
      }

      .e_item {
        padding-top: 0;
      }

      .et_item {}

      .bl_item {
        width: 50%;
        border-right: 1px solid #f2f2f2;
      }

      .br_item {
        width: 50%;
      }
    }
  }
}

/deep/.u-modal {
  width: 350px !important;

  .u-modal__content {
    padding-right: 15px;
  }

  .u-modal__content__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #666666;
  }

  .u-modal__button-group__wrapper__text {
    font-size: 17px;
    font-weight: 400;
    color: #4d6fff;
  }

  .tips {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #333333;
    align-items: flex-start;

    .l_tit {
      margin-bottom: 15px;
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
      color: #333333;
    }

    .r_info {
      padding-left: 15px;

      li {
        margin-bottom: 20px;

        &::market {
          color: #4D6FFF !important;
        }

        &:last-child {
          margin: 0;
        }
      }

      .tip_box {
        margin-left: -5px;

        .tip_top {
          .tip_name {
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            color: #333333;
          }

          .tip_text {
            font-size: 14px;
            font-weight: 400;
            line-height: 20px;
            color: #333333;
          }
        }

        .tip_bottom {
          .tip_sec {
            font-size: 12px;
            font-weight: 400;
            line-height: 20px;
            color: #9A9A9A;
          }
        }
      }
    }
  }
}

.content_box {
  width: 100%;
  height: 120px;
}
</style>