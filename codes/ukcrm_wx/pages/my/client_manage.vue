<template>
  <view class="detail">
    <u-sticky offset-top="0">
      <view class="ser_box">
        <u-search
          v-model="keyword"
          placeholder="搜索客户名称"
          shape="square"
          :showAction="false"
          bgColor="#F6F7F9"
          borderColor="#F6F7F9"
          height="36"
          @search="search"
        ></u-search>
      </view>

      <view class="tab_list_box d-between">
        <view class="l_title"> 回收站 </view>

        <view class="r_items d-flex">
          <view class="item d-center" :class="area_active ? 'active' : ''" @click="chooseArea">
            地区
            <i class="icon iconfont" :class="areaShow ? 'icon-sq' : 'icon-xl'"></i>
          </view>

          <view class="item d-center" :class="sort_active ? 'active' : ''" @click="showSort">
            排序
            <i class="icon iconfont" :class="sortShow ? 'icon-sq' : 'icon-xl'"></i>
          </view>

          <view class="item d-center" :class="select_active ? 'active' : ''" @click="showSelect">
            筛选
            <i class="icon iconfont" :class="selectShow ? 'icon-sq' : 'icon-xl'"></i>
          </view>
        </view>
      </view>
    </u-sticky>

    <view class="client_main">
      <view class="client_list" v-if="clientList.length > 0">
        <view class="client_item d-flex avatar_box" v-for="(v, i) in clientList" :key="i" @click="detail(v)">
          <u-avatar v-if="v.avatar" :src="v.avatar" :size="46" shape="square" bg-color="#4D6FFF" mode="aspectFit">
          </u-avatar>
          <u-avatar v-else :text="v.abbreviation" :size="46" shape="square" bg-color="#4D6FFF" font-size="14"
            mode="aspectFit"></u-avatar>

          <view class="r_info d-flex">
            <view class="info d-flex">
              <view class="name u-line-1"> {{ v.name }} </view>
              <view class="phone">{{ v.phone }}</view>
            </view>
            <view class="company">{{ v.company }}</view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="slogan" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无客户 </view>
      </view>
    </view>
    <u-back-top :scroll-top="scrollTop" top="600" />

    <view class="sort_popup">
      <!-- 排序 -->
      <u-popup :show="sortShow" mode="top" :safeAreaInsetBottom="false" @close="sortShow = false">
        <view class="choose_sort">
          <view class="item d-between" :class="activeSort == i ? 'active' : ''" v-for="(v, i) in sortList" :key="i"
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
            <view class="com_tit">客户标签</view>
            <view class="item_box">
              <view class="item" :class="selectInfo.activeTag === i ? 'active' : ''" v-for="(v, i) in tagList" :key="i"
                @click="chooseTag(i)">
                {{ v }}
              </view>
            </view>

            <view class="com_tit">成交状态</view>
            <view class="item_box">
              <view class="item" :class="selectInfo.activeDeal === i ? 'active' : ''" v-for="(v, i) in dealStatusList"
                :key="i" @click="chooseDeal(i)">
                {{ v }}
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
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";
import areaSelection from "@/components/areaSelection";

export default {
  data() {
    return {
      keyword: "",
      page: 1,
      next_page: true,
      scrollTop: 0,
      clientList: [],
      slogan: `${store.state.ossBaseUrl}direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png`,

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
        "跟进时间倒序",
        "跟进时间正序",
      ],
      selectShow: false,
      tagList: [],
      fromList: [],
      dealStatusList: ['已成交','未成交'], // 成交状态
      levelList: [], // 级别
      roleList: [], // 角色
      selectInfo: {
        // 前端展示的值
        activeTag: "",
        activeFrom: "",
        activeLevel: "",
        activeRole: "",
        activeDeal: "",
      },
      realSelectInfo: {
        // 接口世界请求的 值
        activeTag: "",
        activeFrom: "",
        activeLevel: "",
        activeRole: "",
        activeDeal: "",
      },
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      this.getClientele();
    },
    // 省
    get_area() {
      getData(`/index/customer_area?search_type=1`).then((res) => {
        const {
          code,
          data: { area_list },
        } = res;
        if (code === 200) {
          this.areaColumns = area_list ? area_list : [];
        }
      });
    },
    // 标签
    preset() {
      getData("/customer/tag").then((res) => {
        const {
          code,
          data: { company_role, customer_tag, customer_from, customer_status, customer_role },
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
    getClientele() {
      let tagIndex = this.realSelectInfo.activeTag;
      let fromIndex = this.realSelectInfo.activeFrom;

      let params = {
        page: this.page,
        search_word: this.keyword,
        province: this.province,
        city: this.city,
        area: this.area,
        update_modify: this.activeSort,
        tag: tagIndex === "" ? "" : tagIndex + 1,
        from: fromIndex === "" ? "" : fromIndex + 1,
        company_role: this.roleList[this.realSelectInfo.activeRole],
        level: this.levelList[this.realSelectInfo.activeLevel],
        deal: this.realSelectInfo.activeDeal === 0 ? 1 : this.realSelectInfo.activeDeal === 1 ? 2 : '',
      };

      getData("/user/customer_manage", {
        params,
      }).then((res) => {
        const {
          code,
          data: { user_list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          if (this.page != 1) {
            this.clientList = this.clientList.concat(user_list.data);
          } else {
            this.clientList = user_list.data;
          }

          this.next_page = user_list.next_page_url ? true : false;
        }
      });
    },
    search() {
      this.page = 1;
      this.init();
    },
    // 我的客户
    detail(v) {
      this.$Router.push({
        path: `/client/${v.id}`,
        query: {
          id: v.id,
          type: "revoke",
        },
      });
    },
    // 省市区 省市区 省市区 省市区 省市区 省市区
    chooseArea() {
      if (!this.area_show) {
        this.get_area();
      }

      this.sortShow = false;
      this.selectShow = false;
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

    // 排序
    showSort() {
      this.area_show = false;
      this.selectShow = false;
      this.sortShow = !this.sortShow;
      this.selectShow = false;
    },
    chooseSort(i) {
      if(i == 4){
        this.activeSort = 6;
      } else if(i == 5){
        this.activeSort = 5;
      }
      
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
      this.selectShow = !this.selectShow;
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
      this.selectInfo.activeTag = "";
      this.selectInfo.activeFrom = "";
      this.selectInfo.activeLevel = "";
      this.selectInfo.activeRole = "";
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
      let tag = this.selectInfo.activeTag;
      let from = this.selectInfo.activeFrom;
      let level = this.levelList[this.selectInfo.activeLevel];
      let role = this.roleList[this.selectInfo.activeRole];

      if (typeof tag == "number" || typeof from == "number" || level || role) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.u-sticky {
  height: 95px;
  background: #fff !important;
  z-index: 99999 !important;
}

.ser_box {
  padding: 0 15px;
  background: #fff;
}

.tab_list_box {
  padding: 20px 20px 0;

  .l_title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #333;

    .iconfont {
      margin-left: 5px;
    }
  }

  .r_items {
    .item {
      margin-left: 15px;
      font-size: 12px;
      line-height: 1;
      color: #333;

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

.client_main {
  padding: 9px 15px 30px;

  /deep/ .u-avatar--square {
    border-radius: 10px;
  }

  .client_item {
    align-items: flex-start;
    margin-bottom: 13px;
    padding: 23px 20px 20px;
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);

    .r_info {
      flex-direction: column;
      align-items: flex-start;
      margin-left: 12px;
      width: 100%;
      .info {
        line-height: 22px;
        margin: 2px 0;

        .name {
          max-width: 65px;
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

      .company {
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #666;
        margin-bottom: 10px;
      }
    }
  }
}

.sort_popup {
  /deep/.u-popup__content {
    margin-top: 95px;
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
    height: calc(100vh - 95px);

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
</style>