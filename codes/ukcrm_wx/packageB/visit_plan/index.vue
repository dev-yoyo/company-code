<template>
  <view class="visit">
    <u-sticky offset-top="0">
      <u-navbar bgColor="transparent" placeholder />
      <u-navbar
        bgColor="transparent"
        title="拜访计划"
        titleStyle="color:#fff;"
        leftIconColor="#fff"
        @leftClick="leftClick"
      />

      <view class="visit_choose">
        <view class="choose_item d-flex" @click="show = true"
          >{{ date }}<i class="icon iconfont icon-xl2"></i
        ></view>
        <view class="choose_item d-flex" @click="add()"
          ><i class="icon iconfont icon-tj4"></i>新增</view
        >
      </view>
    </u-sticky>

    <view class="visit_content">
      <view class="top_bgc"></view>
      <u-datetime-picker
        ref="datetimePicker"
        :show="show"
        v-model="time"
        mode="year-month"
        :formatter="formatter"
        @confirm="confirm"
        @cancel="cancel"
      ></u-datetime-picker>
      <ren-calendar
        ref="ren"
        :markDays="markDays"
        @onDayClick="onDayClick"
        :date="date"
      ></ren-calendar>

      <view class="visit_sub">当天拜访</view>

      <view class="visit_list" v-if="visit_show">
        <view class="visit_item" v-for="(v, k) in visit_list" :key="k" @click="add(v)">
          <view class="visit_top d-flex">
            <view class="visit_info d-flex avatar_box">
              <u-avatar
                :src="v.customer && v.customer.avatar"
                :size="46"
                shape="square"
                bg-color="#4D6FFF"
                mode="aspectFit"
                v-if="v.avatar"
              ></u-avatar>
              <u-avatar
                :text="v.customer && v.customer.abbreviation"
                :size="46"
                shape="square"
                bg-color="#4D6FFF"
                mode="aspectFit"
                v-else
              ></u-avatar>

              <view class="user_info">
                <view class="name u-line-1">
                  {{ v.customer && v.customer.name }}
                </view>
                <view class="type" v-if="v.visit_type_name"
                  >拜访目的：{{ v.visit_type_name }}</view
                >
              </view>
            </view>
            <view class="note">
              <view class="note_type"> 线下拜访 </view>
              <view class="note_time"> {{ v.visit_time_m }} </view>
            </view>
          </view>
          <view class="remarks" v-if="v.remarks"
            >备注：<text class="txt">{{ v.remarks }}</text></view
          >
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无数据 </view>
      </view>
    </view>
  </view>
</template>

<script>
import RenCalendar from "@/packageB/ren-calendar/ren-calendar.vue";
import { getData, postData } from "@/common/api";
import { navBack } from "@/common/hooks";

export default {
  components: {
    RenCalendar,
  },
  data() {
    return {
      // 日历
      curDate: "",
      markDays: [],
      // 当前年月
      visit_time: "",
      start_time: "",
      end_time: "",
      show: false,
      time: Number(new Date()),
      date: "",
      // 列表
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/kZm4yGDxGsecszcz4FcZGs3sW5QFSG3E1642734316515.png",
      visit_list: [],
      visit_show: true,
      page: 1,
      next_page: true,
    };
  },
  onReady() {
    // 日期选择器
    this.$refs.datetimePicker.setFormatter(this.formatter);
    //日历
    this.curDate = this.$refs.ren.getToday().date;
    // 第一天和最后一天
    let y = new Date().getFullYear();
    let m = new Date().getMonth() + 1;
    this.start_time = `${y}-${this.formatNum(m)}-${this.formatNum(
      new Date(y, m - 1, 1).getDate()
    )}`; // 当月第一天星期几
    this.end_time = `${y}-${this.formatNum(m)}-${this.formatNum(
      new Date(y, m, 0).getDate()
    )}`; // 当月最后一天
    // 当前年月
    let arr = this.curDate && this.curDate.split("-");
    this.date = arr && `${arr[0]}年${arr[1]}月`;
    this.init();
  },
  onShow() {
    console.log(1111)
    this.init();
  },
  methods: {
    init() {
      getData("/visit/visit_plan_list", {
        params: {
          page: this.page,
          start_time: this.start_time,
          end_time: this.end_time,
          visit_time: this.curDate,
        },
      }).then((res) => {
        const {
          code,
          data: { list, date_status },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          if (this.page != 1) {
            this.visit_list = this.visit_list.concat(list.data);
          } else {
            this.visit_list = list.data;
          }
          this.next_page = list.next_page_url ? true : false;
          this.visit_show = this.visit_list.length > 0;

          // 蓝点标记
          this.markDays = [];
          if (date_status.length > 0) {
            date_status.forEach((item, index) => {
              if (item.status) {
                this.markDays.push(`${item.year}-${item.month}-${item.day}`);
              }
            });
          }
        }
      });
    },
    onDayClick(data) {
      this.curDate = data.date;
      this.init();
    },
    formatter(type, value) {
      if (type === "year") {
        return `${value}年`;
      }
      if (type === "month") {
        return `${value}月`;
      }
      return value;
    },
    formatNum(num) {
      let res = Number(num);
      return res < 10 ? "0" + res : res + "";
    },
    confirm(data) {
      this.show = false;
      this.date = this.$u.timeFormat(data.value, "yyyy年mm月");
      let y = this.$u.timeFormat(data.value, "yyyy");
      let m = this.$u.timeFormat(data.value, "mm");
      this.start_time = `${y}-${this.formatNum(m)}-${this.formatNum(
        new Date(y, m - 1, 1).getDate()
      )}`; // 当月第一天
      this.end_time = `${y}-${this.formatNum(m)}-${this.formatNum(
        new Date(y, m, 0).getDate()
      )}`; // 当月最后一天
      let y_today = new Date().getFullYear();
      let m_today = new Date().getMonth() + 1;
      let d_today = new Date().getDate();
      // 当前年月，定到今天，其他就没有访问时间
      if (y == y_today && m == m_today) {
        this.curDate = `${y}-${this.formatNum(m_today)}-${this.formatNum(
          d_today
        )}`;
      } else {
        this.curDate = "";
      }
      this.page = 1;
      this.init();
    },
    cancel() {
      this.show = false;
    },
    add(v) {
      if(v) {
        this.$Router.push({
          path: `/visit_create`,
          query: {
            customer: v.customer,
            id: v.id || 0
          },
        });
      }else {
        this.$Router.push({
          path: `/visit_create`,
          query: {},
        });
      }
    },
    leftClick() {
      navBack();
    },
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
};
</script>

<style lang="scss">
page {
  background-color: #f7f8fa;
}
/deep/.u-navbar {
  z-index: 9;
}

/deep/.u-sticky {
  padding: 0 20px 14px;
  // height: 100px;

  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/%E9%A3%9E%E4%B9%A620220303-104617.png");
  background-size: 100% 100%;
}
.visit {
  position: relative;
  padding: 0 0 30px;
}
.top_bgc {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 124px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/%E9%A3%9E%E4%B9%A620220303-104740.png");
  background-size: 100% 100%;
  z-index: -1;
}
.visit_choose {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  font-weight: 400;
  line-height: 17px;
  color: #fff;

  .choose_item {
    padding: 10px 0 0;
    color: #fff;
  }

  .icon-xl2 {
    font-size: 8px;
    margin-left: 3px;
    color: #fff;
  }

  .icon-tj4 {
    font-size: 10px;
    margin-right: 3px;
    color: #fff;
  }
}
.visit_content {
  position: relative;
  padding: 0 15px;

  .visit_sub {
    margin: 22px 0 23px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #333333;
  }
}
.visit_list {
  .visit_item {
    background: #fff;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 14px;
  }

  .visit_top {
    justify-content: space-between;
  }

  .visit_info {
    align-items: center;
  }

  .user_info {
    margin-left: 10px;
    .name {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: #333333;
      margin-bottom: 3px;
    }
    .type {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #666666;
    }
  }

  .note_type {
    font-size: 13px;
    font-weight: 400;
    line-height: 18px;
    color: #333333;
  }

  .note_time {
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    color: #4d6fff;
  }
  .remarks {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #999;
    .txt {
      color: #666666;
    }
  }
}
</style>
