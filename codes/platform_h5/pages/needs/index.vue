<template>
  <view class="wrap">
    <view class="search_box d-flex">
      <i
        class="t-icon t-icon-sx icon_classify"
        @click="classifylShow = true"
      ></i>

      <view class="box d-flex">
        <u-search
          class="content"
          placeholder="请输入搜索内容"
          v-model="serVal"
          shape="square"
          bg-color="#fff"
          border-color="#D3D3D3"
          placeholder-color="#D6D6D6"
          :show-action="false"
          @search="getList()"
        ></u-search>
        <view class="btn" @click="getList()">
          <i class="icon iconfont icon-ssk"></i>
        </view>
      </view>
    </view>

    <!-- 列表数据 -->
    <view class="n_ul" v-if="needsProList.length > 0">
      <view
        class="n_li"
        :class="item.status == '已下线' ? 'is_down_bgc' : '' "
        v-for="item in needsProList"
        :key="item.id"
        @tap="to_detail(item.id)"
      >
        <view class="li_title">
          <view class="tit_type yellow">
            {{ item.type ? item.type : "暂无" }}
          </view>
          {{ item.title }}
        </view>

        <view class="info_box d-flex">
          <view class="info_li">
            <view class="tit">需求预算：</view>
            <view class="content money">{{
              item.budget ? "￥" + item.budget : "商议"
            }}</view>
          </view>
          <view class="info_li">
            <view class="tit">业务区域：</view>
            <view class="content">{{
              item.area ? item.area.name : "全国"
            }}</view>
          </view>
        </view>

        <view class="dashed_line"></view>

        <view class="info_box d-flex">
          <view class="info_li">
            <view class="tit">截止日期：</view>
            <view class="content">{{
              item.closing_timing ? item.closing_timing : "暂无"
            }}</view>
          </view>
          <view class="info_li">
            <i class="icon iconfont icon-yj"></i>

            {{ item.view_count ? item.view_count : 0 }}
          </view>
        </view>

        <view class="is_down" v-if="item.status == '已下线'"> 已下线 </view>
      </view>
    </view>
    <lack v-else></lack>

    <u-popup
      v-model="classifylShow"
      mode="left"
      width="636rpx"
      height="100%"
      :closeOnClickOverlay="true"
    >
      <view class="classify_popup">
        <view class="selecet_box">
          <!-- 分类 -->
          <view class="choose_area">
            <view class="com_tit">分类</view>
            <view class="area_list d-flex">
              <view
                class="area_li"
                :class="classifyActive === '' ? 'active' : ''"
                @tap="check_classify('')"
              >
                不限
              </view>
              <view
                class="area_li"
                :class="classifyActive == item ? 'active' : ''"
                v-for="(item, index) in classifyList"
                :key="index"
                @tap="check_classify(item)"
              >
                {{ item }}
              </view>
            </view>
          </view>

          <!-- 类型 -->
          <view class="choose_area">
            <view class="com_tit">类型</view>
            <view class="area_list d-flex">
              <view
                class="area_li"
                :class="typActive === '' ? 'active' : ''"
                @tap="check_type('')"
              >
                不限
              </view>
              <view
                class="area_li"
                :class="typActive == item ? 'active' : ''"
                v-for="(item, index) in typeList"
                :key="index"
                @tap="check_type(item)"
              >
                {{ item }}
              </view>
            </view>
          </view>

          <!-- 区域 -->
          <view class="choose_area">
            <view class="com_tit">业务区域</view>
            <view class="area_list d-flex">
              <view
                class="area_li"
                :class="areaActive === '' ? 'active' : ''"
                @tap="check_area('0')"
              >
                全国
              </view>
              <view
                class="area_li"
                :class="areaActive === item.id ? 'active' : ''"
                v-for="(item, index) in areaList"
                :key="index"
                @tap="check_area(item.id)"
              >
                {{ item.name }}
              </view>
            </view>
          </view>
        </view>

        <view class="bottom_btn d-flex">
          <view class="btn_li cancel" @tap="again_choose">重置</view>
          <view class="btn_li confirm" @tap="search_confirm">确认</view>
        </view>
      </view>
    </u-popup>

    <u-back-top :scroll-top="scrollTop" top="600"></u-back-top>

    <view class="create_btn" @tap="create">
      <image src="@/static/common/img/create_icon.png" />
      发布
    </view>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";
export default {
  data() {
    return {
      page: 1,
      list_show: true,
      needsProList: [],
      next_page: true,
      scrollTop: 0,
      serVal: "",

      classifylShow: false,
      classifyList: [], // 分类
      typeList: [], // 类型
      areaList: [], // 区域
      classifyActive: "", // 分类 高亮
      typActive: "", // 类型 高亮
      areaActive: "", // 默认全部
    };
  },
  onLoad: function () {
    let query = this.$Route.query;
    console.log(query);
    const { search_word, classify, type, area_id } = query;
    this.serVal = search_word
    this.classifyActive = classify
    this.typActive = type
    this.areaActive = area_id
  },
  onShow() {
    this.getList();
    this.getTypeList();

    // search_word=123&classify=&type=采购&area_id=3
  },
  methods: {
    async getList() {
      await this.$u.api
        .demandList({
          search_word: this.serVal,
          classify: this.classifyActive,
          type: this.typActive,
          area_id: this.areaActive,
          page: this.page,
        })
        .then((res) => {
          const { code, data } = res;

          if (code === 200) {
            uni.stopPullDownRefresh();
            let list = data.data.list;
            if (this.page != 1) {
              this.needsProList = this.needsProList.concat(list.data);
            } else {
              this.needsProList = list.data;
            }
            this.next_page = list.next_page_url ? true : false;
          }
        });
    },
    async getTypeList() {
      await this.$u.api.demandCreate().then((res) => {
        const {
          code,
          data: {
            data: { area, demand_pc_classify, demand_pc_type },
          },
        } = res;

        if (code === 200) {
          this.areaList = area;
          this.classifyList = demand_pc_classify;
          this.typeList = demand_pc_type;
        }
      });
    },

    //  分类
    check_classify(name) {
      this.classifyActive = !name ? "" : name;
    },
    //  类型
    check_type(name) {
      this.typActive = !name ? "" : name;
    },
    // 地区
    check_area(id) {
      this.areaActive = id == "" ? "" : id;
    },

    search_confirm() {
      this.getList();
      this.classifylShow = false;
    },
    again_choose() {
      this.classifyActive = "";
      this.typActive = "";
      this.areaActive = "";
    },

    to_detail(id) {
      if (!authStatus()) return;

      this.$Router.push({
        name: "needs_detail",
        params: { id },
      });
    },
    create() {
      if (!authStatus()) return;

      this.$Router.push({
        name: "needs_create",
      });
    },

    onReachBottom() {
      if (!this.next_page) return;
      this.page = this.page + 1;
      this.getList();
    },
    onPullDownRefresh() {
      this.page = 1;
      this.getList();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
.create_btn {
  position: fixed;
  top: 834rpx;
  right: 12rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 96rpx;
  height: 96rpx;
  background: #0268fa;
  box-shadow: 0px 6rpx 12rpx rgba(7, 54, 213, 0.38);
  border-radius: 50%;
  font-size: 20rpx;
  color: #fff;
  text-align: center;

  image {
    width: 40rpx;
    height: 38rpx;
  }
}

.search_box {
  padding: 22rpx 30rpx;
  background: #fff;
  border-bottom: 4rpx solid #f4f4f4;

  .icon_classify {
    font-size: 45rpx;
    margin-right: 26rpx;
  }

  .box {
    flex: 1;
    /deep/ .u-content {
      border-radius: 8rpx 0 0 8rpx !important;
    }
    /deep/ .u-icon-wrap {
      display: none;
    }
  }

  .btn {
    height: 64rpx;
    width: 68rpx;
    line-height: 64rpx;
    text-align: center;
    background: #0268fa;
    border-radius: 0 8rpx 8rpx 0;
    color: #fff;
  }
}

/* 项目需求 */
.n_ul {
  padding: 24rpx 16rpx;

  .n_li {
    position: relative;
    margin-bottom: 20rpx;
    padding: 30rpx 30rpx 40rpx;
    background: #ffffff;
    border-radius: 6rpx;
    overflow: hidden;

    .li_title {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      text-overflow: ellipsis;
      overflow: hidden;
      padding-right: 35rpx;

      margin-bottom: 25rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;

      .tit_type {
        position: relative;
        top: -6rpx;
        display: inline-block;
        margin-right: 10rpx;
        padding: 0 9rpx;
        height: 34rpx;
        line-height: 34rpx;
        border-radius: 6rpx;
        font-size: 20rpx;
        color: #fefefe;
        text-align: center;
        white-space: nowrap;
      }

      .yellow {
        background: #fe9f17;
      }
    }

    .info_box {
      justify-content: space-between;

      .info_li {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        line-height: 1;
        white-space: nowrap;

        .tit {
          color: #1b4fa8;
        }

        .content {
          color: #333333;
        }

        .icon-yj {
          margin-right: 10rpx;
          color: #999;
          font-size: 24rpx;
        }
      }

      .money {
        color: #ff0101 !important;
      }
    }

    .dashed_line {
      margin: 30rpx 0;
      width: 100%;
      border-top: 1rpx dashed #cccccc;
    }

    .is_down {
      transform: rotate(45deg);
      position: absolute;
      top: 10rpx;
      right: -68rpx;
      width: 200rpx;
      height: 45rpx;
      line-height: 45rpx;
      font-size: 20rpx;
      font-weight: 500;
      color: #cbcbcb;
      text-align: center;
      background: #e6e6e6;
    }
  }

  .is_down_bgc {
    opacity: 0.6;
  }
}

.classify_popup {
  position: relative;
  height: 100vh;
  overflow-y: auto;

  .selecet_box {
    position: relative;
    padding: 32rpx 30rpx 100rpx;
    height: 100vh;
    overflow-y: auto;

    .com_tit {
      margin-bottom: 32rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #181818;
    }

    /* 选择区域 */
    .choose_area {
      margin-bottom: 48rpx;
      .area_list {
        flex-wrap: wrap;
        width: 105%;

        .area_li {
          margin: 0 18rpx 18rpx 0;
          width: 180rpx;
          height: 70rpx;
          line-height: 70rpx;
          background: #ffffff;
          border: 2rpx solid #e6e6e6;
          border-radius: 8rpx;

          font-size: 28rpx;
          font-weight: 400;
          color: #181818;
          text-align: center;
        }

        .active {
          color: #0268fa;
          border: 2rpx solid #0268fa;
        }
      }
    }
  }

  /* 底部 确认按钮 */
  .bottom_btn {
    position: absolute;
    left: 0;
    bottom: 25rpx;
    width: 100%;
    justify-content: center;
    align-items: center;

    .btn_li {
      height: 73rpx;
      line-height: 73rpx;
      font-size: 32rpx;
      font-weight: bold;
      color: #fff;
      text-align: center;
      background: #ffffff;
      border-radius: 37rpx;
    }

    .cancel {
      margin-right: 15rpx;
      width: 210rpx;
      color: #999999;
      border: 1rpx solid #e6e6e6;
    }

    .confirm {
      width: 316rpx;
      background: #fe9f17;
    }
  }
}
</style>
