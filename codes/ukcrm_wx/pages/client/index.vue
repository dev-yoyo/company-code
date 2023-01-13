<template>
  <view class="detail">
    <u-toast ref="uToast"></u-toast>

    <view class="container_main">
      <u-sticky offset-top="0">
        <u-navbar bgColor="transparent" title="客户" leftIcon=" " placeholder />

        <view class="ser_box">
          <u-search v-model="keyword" placeholder="搜索客户名称" shape="square" :showAction="false" bgColor="#F6F7F9"
            borderColor="#F6F7F9" height="36" @search="search" @focus="focus" animation></u-search>
        </view>

        <view class="tab_list_box d-between">
          <view class="l_title d-center" @click="showCustomer">
            {{ customerList[activeCustomer].name }}

            <i class="icon iconfont" :class="customerShow ? 'icon-sq' : 'icon-xl'"></i>
          </view>

          <view class="r_items d-flex">
            <view class="item d-center" :class="area_active ? 'active' : ''" @click="chooseArea">
              地区
              <i class="icon iconfont" :class="area_show ? 'icon-sq' : 'icon-xl'"></i>
            </view>

            <view class="item d-center" :class="sort_active ? 'active' : ''" @click="showSort">
              排序
              <i class="icon iconfont" :class="sortShow ? 'icon-sq' : 'icon-xl'"></i>
            </view>

            <view class="item d-center" :class="select_active ? 'active' : ''" @click="showSelect">
              筛选
              <i class="icon iconfont" :class="selectShow ? 'icon-sq' : 'icon-xl'"></i>
            </view>

            <view class="item d-center" @click="showBatch" v-if="activeTab != 'all'">
              批量
              <i class="icon iconfont" :class="batchShow ? 'icon-plyg' : 'icon-plwg'"></i>
            </view>
          </view>
        </view>
      </u-sticky>

      <!-- 列表 -->
      <view class="list_main" :class="batchShow ? 'paddingBtm' : ''">
        <view class="list_bgc"></view>

        <!-- 我的客户 -->
        <view v-if="activeTab === 'my'">
          <view class="list_box" v-if="clientList.length > 0">
            <view class="item d-flex avatar_box" v-for="(v, i) in clientList" :key="i" @click="detail(v.id, 'my')">
              <u-checkbox-group v-if="v.showCheck">
                <u-checkbox :checked="v.check" @change="checkChange(i)" :size="22" />
              </u-checkbox-group>

              <u-avatar :text="v.abbreviation" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit"></u-avatar>

              <view class="r_info d-flex">
                <view class="user_info d-flex">
                  <view class="info d-flex">
                    <view class="name u-line-1"> {{ v.name }} </view>
                    <view class="phone">{{ v.phone || v.wechat }}</view>
                  </view>
                  <view class="status" v-if="v.deal_status">
                    <view class="status_route">

                    </view>
                    已成交
                  </view>
                </view>
                <view class="company_name">{{ v.company }}
                  <view class="time" v-if="!batchShow">
                    {{ v.update_time ? v.update_time : '无' }}
                  </view>
                </view>
              </view>
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
        </view>

        <!-- 公海池 -->
        <view v-else-if="activeTab === 'com'">
          <view class="list_box" v-if="comClientList.length > 0">
            <view class="item d-flex avatar_box" v-for="(v, i) in comClientList" :key="i" @click="detail(v.id)">
              <u-checkbox-group v-if="v.showCheck">
                <u-checkbox :checked="v.check" @change="comCheckChange(i)" :size="22" />
              </u-checkbox-group>

              <u-avatar :text="v.abbreviation" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit"></u-avatar>

              <view class="r_info d-flex">
                <view class="user_info d-flex">
                  <view class="info d-flex">
                    <view class="name u-line-1"> {{ v.name }} </view>
                    <view class="phone">{{ v.phone || v.wechat }}</view>
                  </view>
                  <view class="status" v-if="v.deal_status">
                    <view class="status_route">

                    </view>
                    已成交
                  </view>
                </view>
                <view class="company_name">{{ v.company }}</view>
              </view>
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
        </view>

        <!-- 全部客户 -->
        <view v-else-if="activeTab === 'all'">
          <view class="list_box all_list_box" v-if="allList.length > 0">
            <view class="item" v-for="(v, i) in allList" :key="i" @click="detail(v.id, 'my')">
              <view class="d-flex avatar_box">
                <u-avatar :text="v.abbreviation" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit">
                </u-avatar>

                <view class="r_info d-flex">
                  <view class="user_info d-flex">
                    <view class="info d-flex">
                      <view class="name u-line-1"> {{ v.name }} </view>
                      <view class="phone">{{ v.phone || v.wechat }}</view>
                    </view>
                    <view class="status" v-if="v.deal_status">
                      <view class="status_route">

                      </view>
                      已成交
                    </view>
                  </view>
                  <view class="company_name">{{ v.company }}</view>
                </view>
              </view>

              <view class="btm_info d-between">
                <view class="b_item">
                  负责人：<text>{{ v.user_name.user.name || "" }}</text>
                </view>

                <view class="b_item">
                  近期更新：<text>{{ v.update_time ? v.update_time : '无' }}</text>
                </view>
              </view>
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
        </view>

        <view class="add_client_btn" @click="addClient" v-if="showFixedAdd">
          <i class="icon iconfont icon-tj4"></i>
        </view>
      </view>
      <!-- 列表 -->
    </view>

    <u-back-top :scroll-top="scrollTop" bottom="50" />

    <view class="sort_popup">
      <!-- 客户 -->
      <u-popup :show="customerShow" mode="top" :safeAreaInsetBottom="false" @close="customerShow = false">
        <view class="choose_sort">
          <view class="item d-center" :class="activeTab == v.type ? 'active' : ''" v-for="(v, i) in customerList"
            :key="i" @click="chooseCustomer(i)">
            <view class="label d-center"> {{ v.name }} </view>
          </view>
        </view>
      </u-popup>
      <!-- 客户 -->

      <!-- 排序 -->
      <u-popup :show="sortShow" mode="top" :safeAreaInsetBottom="false" @close="sortShow = false">
        <view class="choose_sort">
          <view class="item d-between" :class="activeSort == i + 1 ? 'active' : ''" v-for="(v, i) in sortList" :key="i"
            @click="chooseSort(i)">
            <view class="label"> {{ v }} </view>
            <i class="t-icon iconfont t-icon-guo-l"></i>
          </view>
        </view>
      </u-popup>
      <!-- 排序 -->

      <!-- 筛选 -->
      <u-popup :show="selectShow" mode="top" :safeAreaInsetBottom="false" @close="selectShow = false">
        <view class="choose_select">
          <view class="select_box">
            <view class="com_tit">客户状态</view>
            <view class="item_box">
              <view class="item" :class="selectInfo.activeStatus === i ? 'active' : ''" v-for="(v, i) in statusList"
                :key="i" @click="chooseStatus(i)">
                {{ v }}
              </view>
            </view>

            <view class="com_tit">客户标签</view>
            <view class="item_box">
              <view class="item" :class="selectInfo.activeTag === i ? 'active' : ''" v-for="(v, i) in tagList" :key="i"
                @click="chooseTag(i)">
                {{ v }}
              </view>
            </view>

            <view v-if="activeTab != 'com'">
              <view class="com_tit">成交状态</view>
              <view class="item_box">
                <view class="item" :class="selectInfo.activeDeal === i ? 'active' : ''" v-for="(v, i) in dealStatusList"
                  :key="i" @click="chooseDeal(i)">
                  {{ v }}
                </view>
              </view>
            </view>

            <view class="com_tit">客户来源</view>
            <view class="item_box">
              <view class="item" :class="selectInfo.activeFrom === i ? 'active' : ''" v-for="(v, i) in fromList"
                :key="i" @click="chooseFrom(i)">
                {{ v }}
              </view>
            </view>

            <view class="com_tit">客户级别</view>
            <view class="item_box">
              <view class="item" :class="selectInfo.activeLevel === i ? 'active' : ''" v-for="(v, i) in levelList"
                :key="i" @click="chooseLevel(i)">
                {{ v }}
              </view>
            </view>

            <view class="com_tit">企业角色</view>
            <view class="item_box">
              <view class="item" :class="selectInfo.activeRole === i ? 'active' : ''" v-for="(v, i) in roleList"
                :key="i" @click="chooseRole(i)">
                {{ v }}
              </view>
            </view>
          </view>

          <view class="btm_btns d-flex">
            <view class="item" @click="cancelSelect"> 重置 </view>

            <view class="item confirm" @click="confirmSelect"> 确定 </view>
          </view>
        </view>
      </u-popup>
    </view>

    <!-- 省市区-->
    <!-- <u-picker :show="area_show" ref="uPicker" keyName="name" :columns="areaColumns" @cancel="cancel_area" @confirm="confirm_area" @change="changeHandler"></u-picker> -->
    <area-selection :show="area_show" ref="uPicker" :columns="areaColumns" @confirm="confirm_area"
      @cancel="cancel_area">
    </area-selection>
    <!-- 省市区-->

    <!-- 批量 -->
    <view class="batch_btm_btns d-between" v-if="batchShow">
      <view class="batch_box d-center">
        <u-checkbox-group>
          <u-checkbox :checked="chooseAllBtn" @change="checkAll" :size="22">
            <!-- <u-checkbox :checked="allCheck" @change="checkAll" :size="22"> -->
          </u-checkbox>
        </u-checkbox-group>
        <view class="txt"> 全选 </view>
      </view>

      <view class="r_btns d-flex" v-if="activeTab === 'my'">
        <view class="item confirm" @click="showTransfer"> 移交 </view>
      </view>

      <view class="r_btns d-flex" v-if="activeTab === 'com'">
        <view class="item" @click="showFollow"> 跟进 </view>
        <view class="item confirm" @click="showDistribution" v-if="role_id < 4 && role_id > 0">
          分配
        </view>
      </view>
    </view>
    <!-- 批量 -->

    <!-- 移交 客户给 企业成员 -->
    <u-popup mode="bottom" :show="memberShow" @close="memberShow = false" round="12" :safe-area-inset-bottom="true">
      <view class="btm_member_popup">
        <view class="tit">企业成员</view>

        <view class="user_list_box">
          <view class="item d-flex avatar_box" v-for="(v, i) in userList" :key="i" @click="chooseMember(v)">
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
        <view class="cancel_txt" @click="cancelMove">取消</view>
      </view>
    </u-popup>

    <u-popup :show="transConfirmShow" :round="10" mode="center" :safeAreaInsetBottom="false" @close="cancelMovePopShow">
      <view class="popup_box">
        <view class="tit">确认</view>
        <view class="content">
          是否确定{{ isTrans ? "移交" : "分配" }}给 {{ getUserName }}
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="cancelMovePopShow"> 取消 </view>
          <view class="btn" @click="confirmTransfer"> 确定 </view>
        </view>
      </view>
    </u-popup>
    <!-- 移交客户给 成员 -->

    <!-- 跟进客户  跟进客户  跟进客户  跟进客户  跟进客户 -->
    <u-popup mode="bottom" :show="followPopupShow" @close="cancelFollow" round="12" :safe-area-inset-bottom="true">
      <view class="follow_popup">
        <view class="content" v-if="comCustomerCheckIds.length > 1">
          确定跟进客户
        </view>
        <view class="content" v-else>
          确定跟进客户“<text>{{ followCustomer || "" }}</text>”
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="cancelFollow"> 取消 </view>
          <view class="btn" @click="confirmFollow"> 确定 </view>
        </view>
      </view>
    </u-popup>
    <!-- 跟进客户  跟进客户  跟进客户  跟进客户  跟进客户 -->

    <!-- 管理员  分配 客户给 成员 -->
    <u-popup mode="bottom" :show="dicMemberShow" @close="cancelDicMember" round="12" :safe-area-inset-bottom="true">
      <view class="btm_member_popup">
        <view class="tit">选择成员</view>

        <view class="user_list_box">
          <view class="item d-flex avatar_box" v-for="(v, i) in departmentUserList" :key="i" @click="chooseMember(v)">
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
        <view class="cancel_txt" @click="cancelMove">取消</view>
      </view>
    </u-popup>
    <!-- 管理员  分配 客户给 成员 -->
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
import store from "@/store";
import areaSelection from "@/components/areaSelection";

export default {
  data() {
    return {
      role_id: null,
      keyword: "",
      page: 1,
      next_page: true,
      scrollTop: 0,
      user: {},

      channelId: 0,
      contentType: 100, // 100 全部   10 101 102 103
      clientList: [],
      comClientList: [],
      slogan: `${store.state.ossBaseUrl}direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png`,

      activeTab: "my", // my 我的客户 all 全部客户 com公海池客户
      activeCustomer: 0,
      customerShow: false,
      customerList: [
        {
          name: "我的客户",
          type: "my",
        },
        {
          name: "公海池客户",
          type: "com",
        },
      ],
      allList: [], // 全部客户

      area_show: false,
      areaColumns: [], // 省市区列表
      province: "",
      city: "",
      area: "",

      sortShow: false, // 排序
      activeSort: 0,
      sortList: [
        "更新时间倒序",
        "更新时间正序",
        "创建时间倒序",
        "创建时间正序",
        "跟进时间正序",
		"跟进时间倒序",
      ],
      selectShow: false,
      statusList: [],
      tagList: [],
      fromList: [],
      dealStatusList: ['已成交','未成交'], // 成交状态
      levelList: [], // 级别
      roleList: [], // 角色
      selectInfo: {
        // 前端展示的值
        activeStatus: "",
        activeTag: "",
        activeFrom: "",
        activeLevel: "",
        activeRole: "",
        activeDeal: "",
      },
      realSelectInfo: {
        // 接口世界请求的 值
        activeStatus: "",
        activeTag: "",
        activeFrom: "",
        activeLevel: "",
        activeRole: "",
        activeDeal: "",
      },
      batchShow: false, // 批量操作 底部 按钮
      allCheck: false, // 全选按钮

      memberShow: false, // 企业全部成员
      transConfirmShow: false, // 二次确认弹框
      userList: [], // 企业成员列表
      getUserId: "",
      getUserName: "",

      followPopupShow: false, // 跟进
      followCustomer: "", // 跟进客户
      isTrans: true, // 移交  --- 分配
      departmentUserList: [],

      dicMemberShow: false, //分配成员弹框
    };
  },
  onLoad() {
    getUser().then((res) => {
      const {
        code,
        data: { user },
      } = res;
      if (code === 200) {
        this.user = user;
        this.role_id = user.role_id;
        if (user.role_id > 0 && user.role_id < 3 && this.customerList.length < 3) {
          this.customerList.unshift({
            name: "全部客户",
            type: "all",
          });
          this.activeTab = "all";
        }
        if (user.role_id == 3 && (user.role_id != 1 || user.role_id != 2)) {
          this.customerList.splice(1,0,{
            name: "下属负责的客户",
            type: "all",
          });
        }
      }
    });

    let _th = this;
    uni.$on("updateCustomerList", function (data) {
      _th.activeTab = data.activeTab || "my";
      _th.customerList.map((e, i) => {
        if (e.type == data.activeTab) {
          _th.activeCustomer = i;
        }
      });
      _th.keyword = "";
      _th.page = 1;
      _th.init();
      _th.close_batch();
    });
  },
  onShow() {
    getUser().then((res) => {
      const {
        code,
        data: { user },
      } = res;
      if (code === 200) {
        this.user = user;
        this.role_id = user.role_id;
        if (
          user.role_id > 0 &&
          user.role_id < 3 &&
          this.customerList.length < 3
        ) {
          this.customerList.unshift({
            name: "全部客户",
            type: "all",
          });
          this.activeTab = "all";
        }
        this.init();
      }
    });
  },
  methods: {
    init() {
      if (this.activeTab == "all") {
        this.getAllCustomer();
      } else if (this.activeTab == "my") {
        this.getClientele();
      } else if (this.activeTab == "com") {
        this.getComClientele();
      }
    },
    // 省
    get_area() {
      let url_area =
        this.activeTab == "my"
          ? `/index/customer_area`
          : this.activeTab == "all"
          ? `/index/customer_area?search_type=1`
          : `/index/customer_area?customer_type=1`;
      getData(url_area).then((res) => {
        const {
          code,
          data: { area_list },
        } = res;
        if (code === 200) {
          this.areaColumns = area_list ? area_list : [];
          // let province_id = province && province[0] && province[0].id ? province[0].id : 0
          // this.change_province(province_id,1)
        }
      });
    },
    // 标签
    preset() {
      getData("/customer/tag").then((res) => {
        const {
          code,
          data: { company_role, customer_tag, customer_from, customer_status,customer_role },
        } = res;
        if (code === 200) {
          this.statusList = customer_status;
          this.tagList = customer_tag;
          this.fromList = customer_from;
          this.roleList = company_role;
          this.levelList = customer_role;
        }
      });
    },

    // 我的客户
    getClientele() {
      // search_word ：关键词，
      // province：省，
      // city 市
      // area:区，
      // update_modify  1，2，3，4，
      // customer_status：新/老用户，
      // tag：标签，
      // from：客户来源，
      // company_role：企业角色，
      // level：客户级别

      let tagIndex = this.realSelectInfo.activeTag;
      let fromIndex = this.realSelectInfo.activeFrom;

      let params = {
        type: '',
        page: this.page,
        search_word: this.keyword,
        province: this.province,
        city: this.city,
        area: this.area,
        update_modify: this.activeSort,
        customer_status: this.statusList[this.realSelectInfo.activeStatus],
        tag: tagIndex === "" ? "" : tagIndex + 1,
        from: fromIndex === "" ? "" : fromIndex + 1,
        company_role: this.roleList[this.realSelectInfo.activeRole],
        level: this.levelList[this.realSelectInfo.activeLevel],
        deal: this.realSelectInfo.activeDeal === 0 ? 1 : this.realSelectInfo.activeDeal === 1 ? 2 : '',
      };
      getData("/index/customer", {
        params,
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          let arr = list.data;
          arr.map((e) => {
            // 批量操作中
            if (this.batchShow) {
              e.check = this.allCheck;
              e.showCheck = true;
            } else {
              e.check = false;
              e.showCheck = false;
            }
          });

          if (this.page != 1) {
            this.clientList = this.clientList.concat(arr);
          } else {
            this.clientList = arr;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },
    // 公海池客户
    getComClientele() {
      // let tagIndex = this.tagList.indexOf(this.realSelectInfo.activeTag);
      // let fromIndex = this.fromList.indexOf(this.realSelectInfo.activeFrom);
      let tagIndex = this.realSelectInfo.activeTag;
      let fromIndex = this.realSelectInfo.activeFrom;

      let params = {
        type: 'sea',
        page: this.page,
        search_word: this.keyword,
        province: this.province,
        city: this.city,
        area: this.area,
        update_modify: this.activeSort,
        customer_status: this.statusList[this.realSelectInfo.activeStatus],
        tag: tagIndex === "" ? "" : tagIndex + 1,
        from: fromIndex === "" ? "" : fromIndex + 1,
        company_role: this.roleList[this.realSelectInfo.activeRole],
        level: this.levelList[this.realSelectInfo.activeLevel],
        deal: this.realSelectInfo.activeDeal === 0 ? 1 : this.realSelectInfo.activeDeal === 1 ? 2 : '',
      };
      getData("/index/customer", {
        params,
      }).then((res) => {
        const {
          code,
          data: { list, user },
        } = res;

        if (code === 200) {
          uni.stopPullDownRefresh();
          let arr = list.data;
          arr.map((e) => {
            // 批量操作中
            if (this.batchShow) {
              e.check = this.allCheck;
              e.showCheck = true;
            } else {
              e.check = false;
              e.showCheck = false;
            }
          });

          if (this.page != 1) {
            this.comClientList = this.comClientList.concat(arr);
          } else {
            this.comClientList = arr;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },
    // 全部客户
    getAllCustomer() {
      // let tagIndex = this.tagList.indexOf(this.realSelectInfo.activeTag);
      // let fromIndex = this.fromList.indexOf(this.realSelectInfo.activeFrom);
      let tagIndex = this.realSelectInfo.activeTag;
      let fromIndex = this.realSelectInfo.activeFrom;

      let params = {
        type: 'all',
        page: this.page,
        search_word: this.keyword,
        province: this.province,
        city: this.city,
        area: this.area,
        update_modify: this.activeSort,
        customer_status: this.statusList[this.realSelectInfo.activeStatus],
        tag: tagIndex === "" ? "" : tagIndex + 1,
        from: fromIndex === "" ? "" : fromIndex + 1,
        company_role: this.roleList[this.realSelectInfo.activeRole],
        level: this.levelList[this.realSelectInfo.activeLevel],
        deal: this.realSelectInfo.activeDeal === 0 ? 1 : this.realSelectInfo.activeDeal === 1 ? 2 : '',
      };
      getData("/index/customer", {
        params,
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          if (this.page != 1) {
            this.allList = this.allList.concat(list.data);
          } else {
            this.allList = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
        }
      });
    },

    // 根据id值去重
    // setArr(arr) {
    //   let newArr = [];
    //   arr.forEach(el => {
    //     if (!newArr.some(e => e.id == el.id)) {
    //       newArr.push(el);
    //     }
    //   });
    //   return newArr
    // },

    search() {
      this.page = 1;
      this.init();
    },

    focus() {
      this.area_show = false;
      this.sortShow = false;
      this.selectShow = false;
      this.close();
      this.close_batch();
    },

    // 我的客户
    detail(id, type) {
      if (this.batchShow) return;

      if (type == "my") {
        this.$Router.push({
          path: "/client/" + id,
          query: {
            id,
          },
        });
      } else {
        this.$Router.push({
          path: "/com_client/" + id,
          query: {
            id,
          },
        });
      }
    },

    // 添加客户
    addClient() {
      if (!this.role_id) {
        this.$u.toast("暂无企业，无法添加客户");
        return;
      }

      this.$Router.push({
        name: "create_client",
      });
    },

    close() {
      this.memberShow = false; // 企业全部成员
      this.transConfirmShow = false; // 二次确认弹框
      this.followPopupShow = false; // 公海池客户跟进
      this.dicMemberShow = false; // 公海池客户分配
    },

    // 批量
    close_batch() {
      this.batchShow = false;
      this.allCheck = false;

      if (!this.batchShow) {
        uni.showTabBar();
      } else {
        uni.hideTabBar();
      }

      if (this.activeTab == "my") {
        let arr = this.clientList;
        arr.map((e) => {
          e.showCheck = false;
        });
        this.clientList = arr;
      } else if (this.activeTab == "com") {
        let arr = this.comClientList;
        arr.map((e) => {
          e.showCheck = false;
        });
        this.comClientList = arr;
      }
    },

    // 省市区 省市区 省市区 省市区 省市区 省市区
    chooseArea() {
      if (!this.area_show) {
        this.get_area();
      }

      this.sortShow = false;
      this.selectShow = false;
      this.close();
      this.close_batch();
      this.area_show = !this.area_show;
    },
    changeHandler(e) {
      const {
        columnIndex,
        value,
        values, // values为当前变化列的数组内容
        index,
      } = e;
      let picker = this.$refs.uPicker;
      // 当第一列值发生变化时，变化第二列(后一列)对应的选项
      let val = (value && value[0] && value[0].id) || 0;
      if (columnIndex === 0) {
        this.change_province(val, 1);
      } else if (columnIndex === 1) {
        this.change_province(val, 2);
      }
    },
    change_province(id, type) {
      let picker = this.$refs.uPicker;
      getData(`/index/customer_area?area_id=${id}&level=${type}`).then(
        (res) => {
          const {
            code,
            data: { return_area },
          } = res;
          if (code === 200) {
            let list = return_area || [];
            picker.setColumnValues(type, list);

            if (type == 1) {
              let city_id = (list && list[0] && list[0].id) || 0;
              this.change_province(city_id, 2); // 获取区
            }
          }
        }
      );
    },
    cancel_area() {
      this.area_show = false;
    },
    confirm_area(e) {
      const { ids } = e;
      this.province = ids && ids[0] ? ids[0] : 0;
      this.city = ids && ids[1] ? ids[1] : 0;
      this.area = ids && ids[2] ? ids[2] : 0;
      this.page = 1;
      this.init();
      this.area_show = false;
    },
    // 省市区 省市区 省市区 省市区 省市区 省市区

    // 筛选客户
    showCustomer() {
      this.area_show = false;
      this.selectShow = false;
      this.close();
      this.close_batch();
      this.customerShow = !this.customerShow;
      this.selectShow = false;
    },
    chooseCustomer(i) {
      this.activeCustomer = i;
      this.activeTab = this.customerList[i].type;
      this.customerShow = !this.customerShow;
      this.page = 1;
      this.init();
    },

    // 排序
    showSort() {
      this.area_show = false;
      this.selectShow = false;
      this.close();
      this.close_batch();
      this.sortShow = !this.sortShow;
      this.selectShow = false;
    },
    chooseSort(i) {
	  this.activeSort = i + 1;
      this.sortShow = !this.sortShow;
      this.page = 1;
      this.init();
    },

    // 筛选 筛选 筛选 筛选 筛选 筛选 筛选 筛选
    showSelect() {
      if (!this.selectShow) {
        this.preset();
      }

      this.area_show = false;
      this.sortShow = false;
      this.close();
      this.close_batch();
      this.selectShow = !this.selectShow;
      if (!this.selectShow) {
        uni.showTabBar();
      } else {
        uni.hideTabBar();
      }
    },
    chooseStatus(i) {
      this.selectInfo.activeStatus =
        this.selectInfo.activeStatus === i ? "" : i;
    },
    chooseTag(i) {
      this.selectInfo.activeTag = this.selectInfo.activeTag === i ? "" : i;
    },
    chooseFrom(i) {
      this.selectInfo.activeFrom = this.selectInfo.activeFrom === i ? "" : i;
    },
    chooseLevel(i) {
      this.selectInfo.activeLevel = this.selectInfo.activeLevel === i ? "" : i;
    },
    chooseRole(i) {
      this.selectInfo.activeRole = this.selectInfo.activeRole === i ? "" : i;
    },
    // 成交状态
    chooseDeal(i) {
      this.selectInfo.activeDeal = this.selectInfo.activeDeal === i ? "" : i;
    },
    cancelSelect() {
      // this.selectShow = !this.selectShow;
      // this.selectInfo = this.realSelectInfo;
      // uni.showTabBar();

      this.selectInfo.activeStatus = "";
      this.selectInfo.activeTag = "";
      this.selectInfo.activeFrom = "";
      this.selectInfo.activeLevel = "";
      this.selectInfo.activeRole = "";
      this.selectInfo.activeDeal = "";
    },
    confirmSelect() {
      this.selectShow = !this.selectShow;
      let info = JSON.parse(JSON.stringify(this.selectInfo));
      this.realSelectInfo = info;

      uni.showTabBar();
      this.page = 1;
      this.init();
    },
    // 筛选 筛选 筛选 筛选 筛选 筛选 筛选 筛选

    // 批量操作
    showBatch() {
      this.area_show = false;
      this.sortShow = false;
      this.selectShow = false;
      this.close();
      this.batchShow = !this.batchShow;
      if (!this.batchShow) {
        uni.showTabBar();
      } else {
        uni.hideTabBar();
      }

      if (this.activeTab == "my") {
        let arr = this.clientList;
        arr.map((e) => {
          e.showCheck = !e.showCheck;
        });
        this.clientList = arr;
      } else {
        let arr = this.comClientList;
        arr.map((e) => {
          e.showCheck = !e.showCheck;
        });
        this.comClientList = arr;
      }
    },
    // 全选
    checkAll() {
      if (this.activeTab == "my") {
        let flag = false;
        let arr = this.clientList;
        arr.map((e) => {
          if (!e.check) {
            // 没有全选 全选操作
            flag = true;
          }
        });

        // 全选
        if (flag) {
          arr.map((e) => {
            e.check = true;
          });
        } else {
          // 取消 全选
          arr.map((e) => {
            e.check = false;
          });
        }
        this.clientList = arr;
      } else {
        let flag = false;
        let arr = this.comClientList;
        arr.map((e) => {
          if (!e.check) {
            // 没有全选 全选操作
            flag = true;
          }
        });

        // 全选
        if (flag) {
          arr.map((e) => {
            e.check = true;
          });
        } else {
          // 取消 全选
          arr.map((e) => {
            e.check = false;
          });
        }
        this.comClientList = arr;
      }
    },

    // 客户 单选
    checkChange(i) {
      this.clientList[i].check = !this.clientList[i].check;
    },
    // 公海池客户 单选
    comCheckChange(i) {
      this.comClientList[i].check = !this.comClientList[i].check;
    },

    // 移交
    showTransfer() {
      if (this.myCustomerCheckIds.length <= 0)
        return this.$u.toast("请选择客户");

      // 企业所有成员
      getData("/company/company_member").then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          this.userList = user_list.data;

          if (user_list.data.length <= 0) {
            return this.$u.toast("企业暂无成员，无法移交客户");
          }

          this.memberShow = true;
          this.isTrans = true;
        }
      });
    },
    cancelMove() {
      this.memberShow = false;
    },
    chooseMember(v) {
      this.getUserId = v.user.id;
      this.getUserName = v.user.name;
      this.transConfirmShow = true;

      // // 移交
      if (this.isTrans) {
        this.memberShow = false;
      } else {
        // 分配
        this.dicMemberShow = false;
      }
    },
    // 最后移交 确认框
    cancelMovePopShow() {
      this.transConfirmShow = false;
    },
    // 确定 移交  -- 分配
    confirmTransfer() {
      // 我的客户  移交
      if (this.isTrans) {
        postData(`/customer/transfer_customer`, {
          user_id: this.getUserId,
          customer_ids: this.myCustomerCheckIds,
        }).then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            let _th = this;
            _th.batchShow = false;
            _th.transConfirmShow = false;
            this.$refs.uToast.show({
              message: msg,
              complete() {
                _th.page = 1;
                _th.init();
              },
            });
          }else {
            this.$u.toast(msg);
          }
        });
      } else {
        // 公海池 管理员 分配
        postData(`/customer/distribution_customer`, {
          user_id: this.getUserId,
          customer_ids: this.comCustomerCheckIds,
        }).then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            let _th = this;
            _th.batchShow = false;
            _th.transConfirmShow = false;
            this.$refs.uToast.show({
              message: msg,
              complete() {
                _th.page = 1;
                _th.init();
              },
            });
          }else {
            this.$u.toast(msg);
          }
        });
      }
    },

    // 公海池 跟进
    confirmFollow() {
      if (this.comCustomerCheckIds.length <= 0) {
        return this.$u.toast("请选择客户");
      }

      postData(`/customer/follow_customer`, {
        customer_ids: this.comCustomerCheckIds,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          let _th = this;
          _th.followPopupShow = false;
          _th.batchShow = false;
          this.$refs.uToast.show({
            message: msg,
            complete() {
              _th.page = 1;
              _th.init();
            },
          });
        } else if (code === 422) {
          this.$u.toast(msg);
        } else {
          this.$u.toast(msg);
        }
      });
    },
    showFollow() {
      if (this.comCustomerCheckIds.length <= 0) {
        return this.$u.toast("请选择客户");
      }
      this.followPopupShow = true;
    },
    cancelFollow() {
      this.followPopupShow = false;
    },
    // 公海池 跟进

    // 分配
    showDistribution() {
      if (this.comCustomerCheckIds.length <= 0) {
        return this.$u.toast("请选择客户");
      }

      // 根据角色 部门 管理员  分配用
      getData("/company/company_department_member").then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          this.departmentUserList = user_list ? user_list.data : [];

          if (this.departmentUserList.length <= 0) {
            return this.$u.toast("暂无成员，无法分配");
          }

          this.dicMemberShow = true;
          this.isTrans = false;
        }
      });
    },

    cancelDicMember() {
      this.dicMemberShow = false;
    },
    // 分配

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
  components: {
    areaSelection,
  },
  computed: {
    // 展示添加按钮
    showFixedAdd() {
      let flag = false;
      if (
        this.activeTab == "my" &&
        this.clientList.length > 0 &&
        !this.batchShow
      ) {
        flag = true;
      }

      if (
        this.activeTab == "com" &&
        this.comClientList.length > 0 &&
        !this.batchShow
      ) {
        flag = true;
      }

      if (
        this.activeTab == "all" &&
        this.allList.length > 0 &&
        !this.batchShow
      ) {
        flag = true;
      }

      return flag;
    },
    // 选中的客户
    myCustomerCheckIds() {
      let arr = this.clientList;
      let ids = [];
      arr.map((e) => {
        if (e.check) {
          ids.push(e.id);
        }
      });
      return ids;
    },
    // 选中的 公海池客户
    comCustomerCheckIds() {
      let arr = this.comClientList;
      let ids = [];
      let checkUser = [];
      arr.map((e) => {
        if (e.check) {
          checkUser.push(e);
          ids.push(e.id);
        }
      });

      if (checkUser.length > 0) {
        this.followCustomer = checkUser[0].name;
      }
      return ids;
    },
    area_active() {
      if (this.province) {
        return true;
      } else {
        return false;
      }
    },
    sort_active() {
      if (this.activeSort) {
        return true;
      } else {
        return false;
      }
    },
    select_active() {
      let status = this.statusList[this.selectInfo.activeStatus];
      let tag = this.selectInfo.activeTag;
      let from = this.selectInfo.activeFrom;
      let level = this.levelList[this.selectInfo.activeLevel];
      let role = this.roleList[this.selectInfo.activeRole];

      if (
        status ||
        typeof tag == "number" ||
        typeof from == "number" ||
        level ||
        role
      ) {
        return true;
      } else {
        return false;
      }
    },

    // 全选按钮状态
    chooseAllBtn() {
      if (this.activeTab == "my") {
        let flag = false;
        let arr = this.clientList;
        let num = 0;
        arr.map((e) => {
          if (e.check) {
            num++;
          }
        });

        if (num === arr.length) {
          flag = true;
        }
        return flag;
      }

      if (this.activeTab == "com") {
        let flag = false;
        let arr = this.comClientList;
        let num = 0;
        arr.map((e) => {
          if (e.check) {
            num++;
          }
        });

        if (num === arr.length) {
          flag = true;
        }
        return flag;
      }
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
  height: 180px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/18/487KhfeQyEE878FJ65nMWJ4rmjFmCP5f1645156964710.png");
  background-color: #4d6fff !important;
  background-size: 100% 100%;
  z-index: 99999 !important;
}

.list_bgc {
  position: absolute;
  top: 0;
  left: 0;

  width: 100%;
  height: 49px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202202/18/x2jieh2mfAQrFtHDeMcjktWkhEAXtPwS1645156986620.png");
  background-size: 100% 100%;
  z-index: -1;
}

.tab_list_box {
  padding: 19px 0;

  .l_title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #ffffff;

    .iconfont {
      margin-left: 5px;
    }
  }

  .r_items {
    .item {
      margin-left: 15px;
      font-size: 12px;
      line-height: 1;
      color: #ffffff;

      .iconfont {
        font-size: 13px;
      }
    }
    .item.active {
      color: #ffbd40;
    }

    :first-child {
      margin-left: 0;
    }
  }
}

.list_main {
  position: relative;
  padding: 0 15px;

  .list_box {
    .item {
      margin-bottom: 10px;
      padding: 23px 20px 20px;
      background-color: #fff;
      border-radius: 10px;

      .r_info {
        flex-direction: column;
        align-items: flex-start;

        margin-left: 8px;
        width: 100%;

        .user_info {
          justify-content: space-between;
          margin-bottom: 3px;
          width: 100%;

          .info {
            .name {
              max-width: 64px;
              margin-right: 12px;
              font-size: 16px;
              font-weight: 600;
              color: #333333;
              overflow: hidden;
            }

            .phone {
              font-size: 14px;
              font-weight: 400;
              color: #666666;
            }
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
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;

          .time {
            font-size: 12px;
            font-weight: 400;
            line-height: 1;
            color: #999999;
            flex-shrink: 0;
          }
        }
      }

      /deep/.u-checkbox-group {
        margin-right: 16px;
      }
    }
  }
  .all_list_box {
    .btm_info {
      margin-top: 15px;
      padding-top: 15px;
      border-top: 1px solid #f2f2f2;

      .b_item {
        font-size: 13px;
        color: #999999;

        text {
          font-weight: 600;
          color: #333333;
        }
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
  padding: 115px 0 0;
}

.sort_popup {
  /deep/.u-popup__content {
    margin-top: 180px;
  }

  .choose_sort {
    width: 100%;
    padding: 0 20px;

    .item {
      padding: 15px 0;
      border-bottom: 1px solid #f4f4f4;

      .label {
        font-size: 14px;
        font-weight: 400;
        color: #666666;
      }

      .iconfont {
        display: none;
        color: #4d6ffa;
        font-size: 18px;
      }
    }

    :last-child {
      border-bottom: none;
    }

    .active {
      .label {
        color: #4d6fff;
        font-weight: 600;
      }

      .iconfont {
        display: block;
      }
    }
  }

  .choose_select {
    position: relative;
    padding-bottom: 80px;
    height: calc(100vh - 180px);

    .com_tit {
      margin-bottom: 16px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #999999;
    }

    .select_box {
      padding: 11px 20px 24px;
      height: 100%;
      overflow-y: scroll;
      overflow-x: hidden;

      .item_box {
        margin-bottom: 10px;
        display: flex;
        flex-wrap: wrap;
        width: 110%;

        .item {
          margin: 0 10px 10px 0;
          padding: 0 25px;
          height: 42px;
          line-height: 42px;
          text-align: center;
          background: #f4f4f4;
          border-radius: 8px;

          font-size: 13px;
          font-weight: 400;
          color: #333333;
        }

        .active {
          color: #ffffff;
          background-color: #4d6fff;
        }
      }
    }

    .btm_btns {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      padding: 17px 20px;
      justify-content: space-around;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);

      .item {
        width: 100%;
        height: 45px;
        line-height: 45px;
        background: #ebebeb;
        border-radius: 23px;
        font-size: 16px;
        font-weight: 600;
        color: #666666;
        text-align: center;
      }

      .confirm {
        margin-left: 10px;
        color: #fff;
        background-color: #4d6fff;
      }
    }
  }
}

.batch_btm_btns {
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 16px 14px 16px 24px;
  width: 100%;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  background-color: #fff;

  .batch_box {
    .txt {
      margin-left: 8px;
      font-size: 13px;
      font-weight: 400;
      color: #666666;
    }
  }

  .r_btns {
    .item {
      width: 112px;
      height: 45px;
      line-height: 45px;
      background: #e6efff;
      border-radius: 23px;
      font-size: 16px;
      font-weight: 600;
      color: #4d6fff;
      text-align: center;
    }

    .confirm {
      margin-left: 10px;
      color: #fff;
      background-color: #4d6fff;
    }
  }
}

.paddingBtm {
  padding-bottom: 60px;
}

// 弹框 确定移交
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

.follow_popup {
  padding: 22px 15px 10px;

  .content {
    margin-bottom: 40px;
    font-size: 16px;
    font-weight: 400;
    color: #333333;
    text-align: center;

    text {
      color: #4d6fff;
    }
  }

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
</style>