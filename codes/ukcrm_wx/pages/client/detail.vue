<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="top_bgc" :class="clientInfo.customer_status == 0 ? 'new_client' : ''">
      <view class="client_info_main">
        <view class="info_box">
          <view class="client_tag" v-if="clientInfo.tag_name">
            <view class="txt">{{ clientInfo.tag_name }}</view>
          </view>

          <!-- 客户信息 -->
          <view class="info_main  avatar_box" @click="clientData">
            <view class="ava_head">
              <u-avatar :text="clientInfo.abbreviation" :size="46" bg-color="#4D6FFF" shape="square" mode="aspectFit">
              </u-avatar>
              <u-rate readonly size="12" gutter="2" :count="levelValue" activeColor="#FFA400" :value="levelValue" />
            </view>
            <view class="r_info d-flex">
              <view class="user_info d-flex">
                <view class="info d-flex">
                  <view class="time">
                    <i class="icon iconfont icon-grzl"></i>
                  </view>
                  <view class="name"> {{ clientInfo.name || "" }} </view>
                </view>

                <view class="status" v-if="info.contract_num > 0">
                  <view class="status_route">

                  </view>
                  已成交
                </view>

              </view>
              <view class="info d-flex">
                <view class="phone">{{ clientInfo.phone || clientInfo.wechat }}</view>
              </view>
              <view class="company_name">{{ clientInfo.company || "" }}</view>
            </view>
          </view>

          <view class="btm_counts d-center">
            <view class="item" @click="getOffer">
              <view class="tit">报价单</view>
              <view class="count">{{ info.offer_record }}</view>
            </view>

            <view class="item back" @click="getContract">
              <view class="tit">合同订单</view>
              <view class="count">{{ info.contract_num }}</view>
            </view>

            <view class="item" @click="getReturn">
              <view class="line"></view>
              <view class="r_line"></view>
              <view class="tit">回款单</view>
              <view class="count">{{ info.payment_collection }}</view>
            </view>
          </view>
        </view>

        <view class="new_get_client d-flex" v-if="
          clientInfo.customer_status == 0 && clientInfo.customer_prescription
        ">
          <view class="new">新获取</view>
          <view>跟进时效：{{ clientInfo.customer_prescription.end_time }}</view>
        </view>
      </view>

      <!-- 拜访计划 -->
      <view class="visit_plan_box" v-if="info.visit_plan">
        <view class="item d-between">
          <view class="l_info">
            <view class="info">
              <view class="label">拜访目的：</view>
              <view class="txt">{{ info.visit_plan.visit_type_name }}</view>
            </view>
            <view class="info">
              <view class="label">拜访备注：</view>
              <view class="txt u-line-1">
                {{ info.visit_plan.remarks || "" }}
              </view>
            </view>
          </view>
          <view class="r_info">
            <view class="type">
              {{ info.visit_plan.visit_type == 0 ? "线上拜访" : "线下拜访" }}
            </view>
            <view class="time">{{ info.visit_plan.visit_time_m }}</view>
          </view>
        </view>

        <view class="more" @click="morePlan" v-if="info.visit_plan_status">
          更多计划>
        </view>
      </view>

      <!--  回款详情 -->
      <view class="contract_box">
        <view class="pending_price">
          <view class="pending_label">
            <image class="pending_img" src="../../static/images/icon-whk.png" mode="aspectFit"></image>
            未回款
          </view>
          <view class="pending_value">
            ￥{{ info.pending_money }}
          </view>
        </view>
        <view class="contract_price">
          <view class="all_price">
            <view class="all_price_text">
              回款总额
            </view>
            <view class="all_price_value">
              ￥{{ info.payment_money }}
            </view>
          </view>
          <view class="pay_price">
            <view class="pay_price_text">
              合同总额
            </view>
            <view class="pay_price_value">
              ￥{{ info.contract_money }}
            </view>
          </view>
        </view>
      </view>
    </view>


    <!-- 跟进记录 -->
    <view class="follow_box">
      <view class="top_tit d-flex">
        <view class="l_tit d-flex">
          <i class="icon iconfont icon-ywwl"></i>
          跟进记录
        </view>

        <view class="r_tit">
          负责人：<text>{{ chargeInfo.user.name || "暂无" }}</text>
        </view>
      </view>

      <view class="follow_list" v-if="followList.length > 0">
        <view
          class="item d-flex"
          v-for="(v, i) in followList"
          :key="i"
          @click="followRecord(v)"
        >
          <view class="left_time">
            <!-- 同一天只展示一个  今天 -->
            <view class="name" v-if="v.add_name != followList[i - 1].add_name">
              {{ v.add_name }}
            </view>
            <view class="time">{{ v.add_at }}</view>
          </view>

          <view class="r_main" v-if="v.visit_type != 2">
            <view class="tit">
				<text> {{ v.user.name }} 的跟进记录</text>
				<text class="bubble">{{v.comment_count}}</text>
			</view>
            <view class="type">
              跟进方式：
              {{ v.visit_type == 0 ? "线上拜访" : "线下拜访" }}</view>
            <view class="type">跟进时间： {{ v.visit_time }}</view>
            <view class="content u-line-2">{{ v.visit_content || "" }} </view>

            <view class="line"></view>
          </view>

          <view class="r_main" v-else>
            <view class="tit"> {{ v.user.name }} 放弃跟进</view>
            <view class="type">放弃原因：</view>
            <view class="content u-line-2">{{ v.visit_content || "" }} </view>
            <view class="line"></view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无记录 </view>
      </view>
    </view>
    <!-- 跟进记录 -->

    <view class="new_fixed_btm" v-if="customer_belong && queryType != 'revoke'">
      <view class="item" @click="callUser">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-hjkh1"></i> -->
          <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/hjkh%402x.png" mode="aspectFit"></image>
		  <!-- <iconpark-icon class="icon iconfont" name="hjkh"></iconpark-icon> -->
		  <!-- <mail class="icon iconfont" theme="outline" size="24" fill="#333"/> -->
        </view>
        呼叫客户
      </view>

      <view class="item" @click="createFollow">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-xjgj1"></i> -->
          <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjgj%402x.png" mode="aspectFit"></image>
        </view>
        新建跟进
      </view>

      <view class="item" @click="addOffer">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-xjbj1"></i> -->
          <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjbj%402x.png" mode="aspectFit"></image>
        </view>
        新建报价
      </view>

      <view class="item" @click="addContract">
        <view class="icon_box">
          <!-- <i class="icon iconfont icon-xjht1"></i> -->
          <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjht%402x.png" mode="aspectFit"></image>
        </view>
        新增合同
      </view>

      <view class="item" @click="moreShow = true">
        <view class="icon_box more"> ... </view>
        更多内容
      </view>
    </view>

    <view class="new_fixed_btm" v-if="queryType == 'revoke'">
      <view class="item" @click="revokeShow = true">
        <view class="icon_box">
          <i class="icon iconfont icon-cx"></i>
        </view>

        撤销删除
      </view>
    </view>

    <!-- 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 底部弹框 -->

    <!-- 更多操作 弹框-->
    <u-popup
      :show="moreShow"
      :round="10"
      mode="bottom"
      :safeAreaInsetBottom="false"
      @close="moreShow = false"
    >
      <view class="more_popup_box">
        <view class="new_fixed_btm more_btns">
          <view class="item" @click="callUser">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-hjkh1"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/hjkh%402x.png" mode="aspectFit"></image>
            </view>
            呼叫客户
          </view>

          <view class="item" @click="createFollow">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-xjgj1"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjgj%402x.png" mode="aspectFit"></image>
            </view>
            新建跟进
          </view>

          <view class="item" @click="addOffer">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-xjbj1"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjbj%402x.png" mode="aspectFit"></image>
            </view>
            新建报价
          </view>

          <view class="item" @click="addContract">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-xjht1"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjht%402x.png" mode="aspectFit"></image>
            </view>
            新增合同
          </view>

          <view class="item" @click="addReturn">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-xjhkd1"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjhk%402x.png" mode="aspectFit"></image>
            </view>
            新增回款
          </view>

          <view class="item" @click="addPlan">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-xjjh1"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/xjjh%402x.png" mode="aspectFit"></image>
            </view>
            新建计划
          </view>

          <view class="item" @click="showGive">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-yjkh1"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/yjkh%402x.png" mode="aspectFit"></image>
            </view>
            移交客户
          </view>

          <view class="item" @click="overFollow" v-if="clientInfo.customer_status == 0">
            <view class="icon_box">
              <!-- <i class="icon iconfont icon-fqgz2"></i> -->
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/fqgj%402x.png" mode="aspectFit"></image>
            </view>
            放弃跟进
          </view>

          <view class="item" @click="changeLevel">
            <view class="icon_box">
              <image class="icon iconfont" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/developer/crm/iconfont/gbjb%402x.png" mode="aspectFit"></image>
            </view>
            变更级别
          </view>
        </view>

        <view class="cancel" @click="moreShow = false">取消</view>
      </view>
    </u-popup>

    <!-- 企业成员 -->
    <u-popup mode="bottom" :show="popupShow" @close="popupShow = false" round="12" :safe-area-inset-bottom="true">
      <view class="btm_member_popup">
        <view class="tit">企业成员</view>

        <view class="user_list_box">
          <view
            class="item d-flex avatar_box"
            v-for="(v, i) in userList"
            :key="i"
            @click="
              popupShow = false;
              moreShow = false;
              confirmShow = true;
              getUserId = v.user.id;
              getUserName = v.user.name;
            "
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
        <view class="cancel_txt" @click="popupShow = false">取消</view>
      </view>
    </u-popup>

    <!-- 更改列表 -->
    <u-popup mode="bottom" :show="levelShow" @close="levelShow = false" round="12" :safe-area-inset-bottom="true">
      <view class="btm_member_popup">
        <view class="tit">客户级别</view>

        <view class="user_list_box box_rate " v-for="(v, i) in levelList" :key="i" @click="chooseLevel(i)">
          <view class="item rate_item d-flex avatar_box">
            <view class="rate">
              <u-rate readonly size="12" gutter="2" activeColor="#FFA400" :count="3 - i" :value="3 - i" />
            </view>

            <view class="r_info d-flex" :class="v.select ? 'r_info_active' : ''">
              <view> {{ v.name }} </view>
            </view>

            <view class="item_select" v-if="v.select">
              <image src="../../static/images/djxz.png" mode="aspectFit"></image>
            </view>
          </view>
        </view>
        <u-gap height="10" bgColor="#f7f7f7"></u-gap>
        <!-- <view class="confirmText " @click="levelShow = false">确定</view> -->
        <!-- <view class="cancel_txt" @click="submitLevel">确定</view> -->
        <!-- <view class="cancel_txt" @click="levelShow = false">取消</view> -->
		<view class="confirm_box">
			<view class="cancel_btn" @click="levelShow = false">取消</view>
			<view class="submit_btn" @click="submitLevel">确定</view>
		</view>
      </view>
    </u-popup>

    <!-- 移交确认框 -->
    <u-popup :show="confirmShow" :round="10" mode="center" :safeAreaInsetBottom="false" @close="confirmShow = false">
      <view class="popup_box">
        <view class="content"> 是否确定移交给 {{ getUserName }} </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="confirmShow = false"> 取消 </view>
          <view class="btn" @click="confirmTransfer"> 确定 </view>
        </view>
      </view>
    </u-popup>
    <!-- 移交确认框 -->


    <!-- 撤销 确认框 -->
    <u-popup
      :show="revokeShow"
      :round="10"
      mode="center"
      :safeAreaInsetBottom="false"
      @close="revokeShow = false"
    >
      <view class="popup_box">
        <view class="content"> 撤销后，该客户将进入公海池 </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="revokeShow = false"> 取消 </view>
          <view class="btn" @click="revokeCustomer"> 确定 </view>
        </view>
      </view>
    </u-popup>
    <!-- 撤销 确认框 -->
  </view>
</template>

<script>
import { getData, postData, isSelfClient } from "@/common/api";
import store from "@/store";
// import { Home,Mail } from "@icon-park/vue"; // 导入iconpark


export default {
 //  components: {
 //  	Home,
	// Mail
 //  },
  data() {
    return {
      role_id: null,
      customer_id: "",
      customer_belong: false,
      page: 1,
      next_page: true,
      noData: store.state.no_data,
      info: {},
      clientInfo: {},
      chargeInfo: {},
      levelValue: '', // 客户级别
      levelShow: false, // 弹框展示等级
      levelList: [{ name: 'A类(重要客户)', select: false }, { name: 'B类(普通客户)', select: false }, { name: 'C类(非优先客户)', select: false },], // 客户等级
      levelName: '',


      popupShow: false, // 移交
      confirmShow: false, // 二次确认弹框
      getUserName: "", //转移用户
      getUserId: "", //转移用户
      userList: [], // 企业成员列表
      followList: [],

      moreShow: false, // 更多 弹框
      queryType: "", // revoke 客户回收站来的 展示撤销删除
      revokeShow: false, // 移交
    };
  },
  onShow() {
    let query = this.$Route.query;
    // console.log(query);
    if (query.id) {
      this.queryType = query.type;
      this.customer_id = query.id;
      this.init();

      isSelfClient(this.customer_id).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.customer_belong = data.customer_belong;
        }
      });
    }
  },
  methods: {
	onload() {
		var script = document.createElement('script');
		script.src = "https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_17659_200.5db74c9023c319fb7cc9e6332136f8e5.js";
		document.head.appendChild(script);
	},
    init() {
      getData("/customer/customer_detail", {
        params: {
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.info = data;
          this.role_id = data.role_id;
          this.clientInfo = data.customer;
          this.chargeInfo = data.user_customer;
          if (data.customer.level == 'A类(重要客户)') {
            this.levelValue = 3;
            this.chooseLevel(0);
          } else if (data.customer.level == 'B类(普通客户)') {
            this.levelValue = 2;
            this.chooseLevel(1);
          } if (data.customer.level == 'C类(非优先客户)') {
            this.levelValue = 1;
            this.chooseLevel(2);
          }
        }
      });

      this.getFollowList();
    },

    // 跟进记录
    getFollowList() {
      getData("/follow/follow_record_list", {
        params: {
          page: this.page,
          customer_id: this.customer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();

          if (this.page != 1) {
            this.followList = this.followList.concat(list.data);
          } else {
            this.followList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    // 更多计划
    morePlan() {
      this.$Router.push({
        path: "/visit_plan_list",
        query: {
          customer_id: this.customer_id,
        },
      });
    },

    // 查看客户资料
    clientData() {
      console.log(this.customer_id);
      this.$Router.push({
        path: "/client_data/" + this.customer_id,
        query: {
          id: this.customer_id,
        },
      });
    },
    // 合同订单
    getContract() {
      this.$Router.push({
        path: "/contract",
        query: {
          customer_id: this.customer_id,
          from: this.customer_belong ? "detail" : "com_detail",
        },
      });
    },
    // 回款单
    getReturn() {
      this.$Router.push({
        path: "/return_money",
        query: {
          customer_id: this.customer_id,
          from: this.customer_belong ? "detail" : "com_detail",
        },
      });
    },
    // 报价单
    getOffer() {
      this.$Router.push({
        path: "/offer",
        query: {
          customer_id: this.customer_id,
          customer_name: this.clientInfo.name,
          from: this.customer_belong ? "detail" : "com_detail",
        },
      });
    },

    // 放弃跟进
    overFollow() {
      this.moreShow = false;

      this.$Router.push({
        path: "/end_follow/" + this.customer_id,
        query: {
          customer_id: this.customer_id,
          customer: JSON.stringify(this.clientInfo),
        },
      });
    },

    // 更改等级
    changeLevel() {
      this.levelShow = true;
      this.moreShow = false;
    },

    // 打电话
    callUser() {
      uni.makePhoneCall({
        phoneNumber: this.clientInfo.phone, //仅为示例
      });
      this.moreShow = false;
    },
    // 新建 跟进记录
    createFollow() {
      this.$Router.push({
        path: "/create_follow/" + this.customer_id,
        query: {
          customer_id: this.customer_id,
        },
      });
      this.moreShow = false;
    },
    followRecord(v) {
      this.$Router.push({
        path: "/follow_record/" + v.id,
        query: {
          follow_id: v.id,
        },
      });
      this.moreShow = false;
    },

    // 新建销售合同
    addContract() {
      this.$Router.push({
        path: `/contract_create`,
        query: {
          customer_id: this.customer_id,
        },
      });
      this.moreShow = false;
    },
    // 新建 回款
    addReturn() {
      this.$Router.push({
        path: `/return_money_create`,
        query: {
          customer_id: this.customer_id,
        },
      });
      this.moreShow = false;
    },
    // 新建 报价
    addOffer() {
      this.$Router.push({
        path: "/offer_create",
        query: {
          customer_id: this.customer_id,
          customer_name: this.clientInfo.name,
        },
      });
      this.moreShow = false;
    },
    // 新建 拜访计划
    addPlan() {
      this.$Router.push({
        path: "/visit_create",
        query: {
          customer_id: this.customer_id,
        },
      });
      this.moreShow = false;
    },
    // 移交
    showGive() {
      getData("/company/company_member").then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.userList = user_list.data;

          if (this.userList.length <= 0) {
            return this.$u.toast("企业暂无成员，无法移交客户");
          }

          this.popupShow = true;
        }
      });
    },
    // 确定移交
    confirmTransfer() {
      postData(`/customer/transfer_customer`, {
        user_id: this.getUserId,
        customer_ids: [this.customer_id],
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.confirmShow = false;
          this.$refs.uToast.show({
            message: msg,
            complete() {
              uni.navigateBack({ delta: 1 });
              uni.$emit("updateData", {});
            },
          });
        } else {
          this.$u.toast(msg);
        }
      });
    },

    // 恢复 客户
    revokeCustomer() {
      postData(`/customer/revoke_customer`, {
        id: this.customer_id,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.revokeShow = false;
          let _th = this;
          this.$refs.uToast.show({
            message: msg,
            complete() {
              _th.$Router.replace({
                path: `/com_client/${_th.customer_id}`,
                query: {
                  id: _th.customer_id,
                },
              });
            },
          });
        } else {
          this.$u.toast(msg);
        }
      });
    },

    // 选择客户
    chooseLevel(i) {
      let arr = this.levelList;
      arr.forEach((v, i) => {
        v.select = false
      })

      arr[i].select = true;
      this.levelName = arr[i].name
    },

    // 用户等级修改
    submitLevel() {
      postData(`/customer/update_customer`, {
        id: this.customer_id,
        level: this.levelName,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.levelShow = false;
          let _th = this;
          this.init();
          this.$u.toast('更改成功');
        } else {
          this.$u.toast(msg);
        }
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

  .top_bgc {
    padding: 28px 15px 10px 20px;
    width: 100%;
    background: linear-gradient(180deg, #ffffff 0%, #e6efff 100%);

    .client_info_main {
      border-radius: 10px;
      overflow: hidden;
    }

    .info_box {
      position: relative;
      padding: 23px 15px 16px;
      width: 100%;
      background: #fff;
      box-shadow: 0px 0px 4px #f3f3f8;

      // 客户标签 潜在
      .client_tag {
        position: absolute;
        top: 0;
        left: 0;
        width: 58px;
        height: 58px;
        background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/14/WKiTQK7BWbzT8RANWHP6APhGFsQ8CZEG1642143015841.png");
        background-size: 100% 100%;

        .txt {
          position: absolute;
          top: 10px;
          left: 6px;
          font-size: 12px;
          color: #fff;
          transform: rotate(-45deg);
        }
      }

      // 客户信息
      .info_main {
        margin-bottom: 20px;
		display: flex;

        .r_info {
          flex-direction: column;
          align-items: flex-start;
		  
		  justify-content: space-between;
          margin-left: 12px;
          width: 100%;

          .phone {
            font-size: 14px;
            font-weight: 400;
            color: #666666;
          }

          .user_info {
            justify-content: space-between;
            margin-bottom: 3px;
            width: 100%;

            .info {
              .name {
                margin-right: 12px;
                font-size: 16px;
                font-weight: 600;
                color: #333333;
              }

            }

            .time {
              font-size: 12px;
              font-weight: 400;
              line-height: 1;
              color: #999999;
              flex-shrink: 0;
              margin-right: 12px;
            }

            .status {
              float: right;
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
          }

          .company_name {
            font-size: 13px;
            font-weight: 400;
            color: #999999;
          }
        }
      }

      .btm_counts {
        padding-top: 20px;
        border-top: 1px solid #f2f2f2;

        .item {
          position: relative;
          width: 100%;
          text-align: center;

          .tit {
            margin-bottom: 5px;
            font-size: 13px;
            line-height: 18px;
            color: #333333;
          }

          .count {
            font-size: 16px;
            font-weight: 600;
            line-height: 22px;
            color: #4d6fff;
          }
        }

        .back {
          .line {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            height: 25px;
            width: 1px;
            background-color: #f0f0f0;
          }

          .r_line {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            height: 25px;
            width: 1px;
            background-color: #f0f0f0;
          }
        }
      }
    }

    .new_get_client {
      justify-content: space-between;

      padding: 0 20px;
      width: 100%;
      height: 36px;
      background-color: #fff;
      border-radius: 0px 0px 10px 10px;

      font-size: 12px;
      font-weight: 400;
      line-height: 1;
      color: #333333;

      .new {
        color: #4d6fff;
      }
    }
  }

  .follow_box {
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
          font-size: 12px;
        }
      }

      .r_tit {
        font-size: 12px;
        font-weight: 400;
        color: #999;

        text {
          color: #333333;
          font-size: 14px;
        }
      }
    }

    .follow_list {
      .item {
        position: relative;
        align-items: flex-start;
        margin-bottom: 12px;

        .left_time {
          background-color: #f7f8fa;
          margin-right: 8px;
          width: 56px;
          z-index: 1;
          flex-shrink: 0;

          .name {
            font-size: 20px;
            font-weight: 600;
            line-height: 28px;
            color: #333333;
          }

          .time {
            padding-bottom: 5px;
            font-size: 10px;
            font-weight: 400;
            line-height: 14px;
            color: #333333;
          }
        }

        .line {
          position: absolute;
          top: 0;
          left: 22px;
          width: 1px;
          height: 100%;
          background-color: #bbbbbb;
        }

        .r_main {
          padding: 19px 25px 20px;
          width: 100%;
          background-color: #fff;
          box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.06);
          border-radius: 6px;

          .tit {
            margin-bottom: 6px;
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            color: #333333;
			display: flex;
			align-items: center;
			justify-content: space-between;
			.bubble{
				color: #FFF;
				padding: 0 24rpx;
				height: 44rpx;
				font-size: 30rpx;
				font-weight: 600;
				line-height: 42rpx;
				background: #FCAC4E;
				border-radius: 24rpx 24rpx 24rpx 0px;
			}
          }

          .type {
            margin-bottom: 3px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: #999999;
          }

          .content {
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: #333333;
          }
        }
      }

      :last-child {
        margin-bottom: 0;
      }
    }

    .slogan {
      padding: 94px 0 0;
    }
  }
}

.visit_plan_box {
  margin-top: 10px;
  width: 100%;
  // background: linear-gradient(to right, #fff 0%, #FFE7C6 100%);
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/aEx2NanfnHNXrcGxhmQhhbxjh3QQzHaS1646187903646.png");
  background-size: 100% 100%;

  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.06);
  border-radius: 6px;

  .item {
    padding: 20px 16px;

    .l_info {
      .info {
        display: flex;
        margin-bottom: 4px;
        width: 204px;

        .label {
          font-size: 12px;
          color: #999;
          flex-shrink: 0;
        }
        .txt {
          font-size: 12px;
          color: #666;
        }
      }
      :last-child {
        margin-bottom: 0;
      }
    }

    .r_info {
      .type {
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #333333;
      }

      .time {
        font-size: 13px;
        font-weight: 600;
        line-height: 18px;
        color: #4d6fff;
      }
    }
  }

  .more {
    margin: 0 16px;
    padding: 6px 0 10px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #999999;
    text-align: center;
    border-top: 1px solid #f0f0f0;
  }
}

// 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框

.new_fixed_btm {
  .more {
    font-size: 35px;
    color: #707070;
    background-color: #f2f2f2;
    line-height: 15px;
  }
}

// 弹框
.popup_box {
  width: 321px;
  padding: 18px 20px;
  text-align: center;

  .content {
    margin: 34px 0;
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

// 更多操作 弹框
.more_popup_box {
  padding-bottom: 20px;

  .more_btns {
    position: relative;
    padding: 28px 0 0 18px;
    width: 120%;
    flex-wrap: wrap;
    align-items: flex-start !important;
    justify-content: flex-start !important;

    .item {
      margin-bottom: 20px;
      margin-right: 50px;
      width: initial;
    }
  }

  .cancel {
    border-top: 10px solid #f6f6f6;
    padding: 17px 0;
    text-align: center;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
  }
}

.contract_box {
  width: 100%;
  min-height: 72px;
  background-image: url("@/static/images/whkbj.png");
  background-size: 120% 120%;
  background-position: center center; 
  box-shadow: 0px -1px 4px #F3F3F8;
  opacity: 1;
  border-radius: 10px;
  padding: 14px 21px;
  display: flex;
  margin: 10px auto 0 auto;

  .pending_price {
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    border-right: 1px solid #E6E6E6;

    .pending_label {
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 18px;
      color: #666666;
      opacity: 1;
      display: flex;
      align-items: center;

      .pending_img {
        width: 10px;
        height: 12px;
        margin-right: 6px;
      }
    }

    .pending_value {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 20px;
      color: #F6874D;
      opacity: 1;
    }
  }

  .contract_price {
    width: 197px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .all_price {
      display: flex;
      padding-left: 20px;
      justify-content: space-between;
      align-items: center;

      .all_price_text {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 18px;
        color: #666666;
        opacity: 1;
      }

      .all_price_value {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
        opacity: 1;
      }
    }

    .pay_price {
      display: flex;
      padding-left: 20px;
      justify-content: space-between;
      align-items: center;

      .pay_price_text {
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 400;
        line-height: 18px;
        color: #666666;
        opacity: 1;
      }

      .pay_price_value {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
        opacity: 1;
      }
    }
  }
}

.rate_item {
  .rate {
    width: 70px;
  }

  .r_info {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 400;
    line-height: 20px;
    color: #666666;
    opacity: 1;
  }

  .r_info_active {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 600;
    line-height: 20px;
    color: #4D6FFF;
    opacity: 1;
  }
}

.box_rate {
  padding-top: 16px;
}

.item_select {
  float: right;
  width: 18px;
  height: 18px;

  image {
    width: 100%;
    height: 100%;
  }
}

.ava_head {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  /deep/ .u-rate {
  	margin-top: 6px;
  }
}

.confirm_box {
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding-top: 20px;
	
	.cancel_btn {
		width: 168px;
		height: 45px;
		background: rgba(235,235,235,1);
		opacity: 1;
		border-radius: 23px;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		color: #666666;
		line-height: 45px;
		text-align: center;
	}
	
	.submit_btn {
		width: 168px;
		height: 45px;
		background: rgba(77,111,255,1);
		opacity: 1;
		border-radius: 23px;
		font-size: 16px;
		font-weight: 600;
		line-height: 22px;
		color: #FFFFFF;
		line-height: 45px;
		text-align: center;
	}
}


</style>