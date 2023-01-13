<template>
  <view>
    <!-- 时间选择 -->
    <u-popup
      :show="dateShow"
      :round="10"
      :safeAreaInsetBottom="false"
      @close="hideChooseDate"
    >
      <view class="choose_date">
        <view class="propup_main">
          <view class="tit"> 时间筛选 </view>
          <view class="list d-flex">
            <view
              class="item"
              :class="info.activeDate == v ? 'active' : ''"
              v-for="(v, i) in dateList"
              :key="i"
              @click="chooseTime(v, i)"
            >
              {{ v }}
            </view>
          </view>

          <view class="tit"> 自定义时间 </view>
          <view class="definition_box d-center">
            <view @click="startDatePicker = true">
              <view class="item_ipt">
                <i class="icon iconfont icon-rl"></i>
                <u-input
                  v-model="info.showStartTime"
                  placeholder="开始日期"
                  placeholderStyle="#999999"
                  fontSize="14"
                  readonly
                ></u-input>
              </view>

              <u-datetime-picker
                :show="startDatePicker"
                v-model="info.startTime"
                mode="date"
                :formatter="formatter"
                @confirm="startConfirm"
                @cancel="startDatePicker = false"
              ></u-datetime-picker>
            </view>

            <view class="txt">至</view>

            <view @click="endDatePicker = true">
              <view class="item_ipt">
                <i class="icon iconfont icon-rl"></i>

                <u-input
                  v-model="info.showEndTime"
                  placeholder="结束日期"
                  placeholderStyle="#999999"
                  fontSize="14"
                  readonly
                ></u-input>
              </view>

              <u-datetime-picker
                :show="endDatePicker"
                v-model="info.endTime"
                mode="date"
                :formatter="formatter"
                @confirm="endConfirm"
                @cancel="endDatePicker = false"
              ></u-datetime-picker>
            </view>
          </view>
        </view>

        <view class="popup_btns">
          <view class="btn cancel" @click="hideChooseDate"> 取消 </view>
          <view class="btn" @click="submitDate"> 确定 </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>
 
<script>
export default {
  name: "choose_date",
  props: {
    dateShow: {
      type: Boolean,
      default: false,
    },
    dateList: {
      type: Array,
      default: [],
    },
    dateInfo: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      startDatePicker: false,
      endDatePicker: false,
      info: {},
    };
  },

  // created() {
  // },
  mounted() {
    this.info = this.dateInfo;
    // this.initDate();
  },
  watch: {
    dateInfo: function (newValue, oldValue) {
      this.info = newValue;
      // return newValue;
    },
  },
  methods: {
    // initDate() {
    //   const d = new Date();
    //   const year = d.getFullYear();
    //   let month = d.getMonth() + 1;
    //   let day = d.getDate();
    //   month = month < 10 ? `0${month}` : month;
    //   day = day < 10 ? `0${day}` : day;

    //   this.info.startTime = `${year}-${month}-${day}`;
    //   this.info.endTime = `${year}-${month}-${day}`;
    // },
    formatter(type, value) {
      if (type === "year") {
        return `${value}`;
      }
      if (type === "month") {
        return `${value}`;
      }
      if (type === "day") {
        return `${value}`;
      }
      return value;
    },
    startConfirm(e) {
      let time = new Date(e.value);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m < 10 ? `0${m}` : m;
      d = d < 10 ? `0${d}` : d;

      let val = `${y}-${m}-${d}`;
      this.info.activeDate = "diy";
      this.info.startTime = val;
      this.info.showStartTime = val;
      this.info.showTxt = false;
      this.startDatePicker = false;
    },
    endConfirm(e) {
      let time = new Date(e.value);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m < 10 ? `0${m}` : m;
      d = d < 10 ? `0${d}` : d;
      let val = `${y}-${m}-${d}`;
      this.info.activeDate = "diy";
      this.info.endTime = val;
      this.info.showEndTime = val;
      this.info.showTxt = false;
      this.endDatePicker = false;
    },
    // 选择时间
    chooseTime(v, i) {
      this.info.activeDate = v;
      this.info.showStartTime = "";
      this.info.showEndTime = "";
      this.info.showTxt = true;
    },
    // 确认时间选择
    submitDate() {
      this.$emit("submitDate", this.info);
    },

    hideChooseDate() {
      this.$emit("hideChooseDate", false);
    },
  },
};
</script>

<style lang="less" scoped>
.choose_date {
  .propup_main {
    padding: 11px 20px 0;

    .tit {
      margin-bottom: 16px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #999999;
    }

    .list {
      margin-bottom: 15px;
      width: 105%;
      flex-wrap: wrap;

      .item {
        margin: 0 10px 14px 0;
        width: 76px;
        height: 42px;
        line-height: 42px;
        background: #f4f4f4;
        border-radius: 8px;
        font-size: 13px;
        font-weight: 400;
        color: #333333;
        text-align: center;
      }

      .active {
        background-color: #4d6fff;
        color: #fff;
      }
    }

    // 自定义日期
    .definition_box {
      margin-bottom: 60px;

      .item_ipt {
        position: relative;
        .iconfont {
          position: absolute;
          top: 50%;
          left: 10px;
          transform: translateY(-50%);
          font-size: 14px;
          color: #c3c3c3;
        }
      }

      .txt {
        margin: 0 12px;
        font-size: 14px;
        font-weight: 400;
        color: #999999;
      }
    }
  }

  .popup_btns {
    padding-bottom: 28px;
  }
}
</style>
