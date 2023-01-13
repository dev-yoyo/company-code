<template>
  <view class="detail">
    <u-sticky offset-top="0">
      <u-navbar bgColor="transparent" placeholder />
      <u-navbar
        bgColor="transparent"
        title="业绩目标"
        titleStyle="color:#fff;"
        leftIconColor="#fff"
        @leftClick="leftClick"
      />

      <view class="com_top_tit d-center">
        <view class="tit">签订合同 {{ info.contract_count }} 笔</view>

        <view class="r_select d-center">
          <view class="item d-center" @click="selectShow">
            {{ signSelect.activeDate || "" }}年
            <i class="icon iconfont icon-xl2"></i>
          </view>
        </view>
      </view>
    </u-sticky>

    <view class="container_main">
      <view class="list_bgc"></view>
      <!-- 总额度 -->
      <view class="money_total">
        <view class="branch_target d-between">
          <view class="l_money">
            <view class="tit">业绩目标</view>

            <view class="txt d-flex">
              <view class="label">完成额： </view>
              <view class="money" v-if="annual.completion_money">
                <text>¥</text> {{ annual.completion_money || 0 }}
              </view>
              <text class="empty" v-else>-</text>
            </view>

            <view class="txt d-flex">
              <view class="label">目标额： </view>
              <view class="money target_money" v-if="annual.money">
                <text>¥</text> {{ annual.money || 0 }}
              </view>
              <text class="empty" v-else>-</text>
            </view>
          </view>

          <view class="proportion_money d-center">
            <view class="txt">{{ annual.percent || 0 }} %</view>
            <battery
              :percent="annual.percent > 100 ? 0 : 100 - annual.percent"
            ></battery>
          </view>
        </view>
      </view>

      <!-- 部门目标 -->
      <view class="branch_target_box">
        <view class="tit">部门目标</view>

        <view class="branch_main">
          <view class="list" v-if="branchList.length > 0">
            <view
              class="item"
              v-for="(v, i) in branchList"
              :key="i"
              @click="nav(v)"
            >
              <view class="top_info d-between">
                <view class="l_info">
                  <view class="name u-line-1"> {{ v.depart.name || "" }} </view>
                  <view class="money"> ¥{{ v.money || "" }} </view>
                </view>

                <view class="r_pirce">
                  <text>¥</text> {{ v.completion_money || "" }}
                </view>
              </view>

              <view class="progress_bar">
                <view
                  class="bar"
                  :style="[
                    {
                      width: v.percent + '%',
                    },
                  ]"
                ></view>
              </view>
            </view>
          </view>

          <view class="slogan" v-else>
            <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>

            <view class="txt"> 暂无数据 </view>
          </view>
        </view>
      </view>
      <!-- 部门目标 -->

      <!-- 完成额对比 -->
      <view class="sign_contrast">
        <view class="title d-between">
          <view class="tit">完成额对比</view>
          <view class="txt"> 元/月 </view>
        </view>

        <view class="sign_mian">
          <view class="charts-box">
            <qiun-data-charts
              type="line"
              :canvas2d="true"
              :chartData="chartsDataLine1"
            />
          </view>
        </view>
      </view>
      <!-- 完成额对比 -->
    </view>

    <u-picker
      :show="signSelectShow"
      :columns="signSelect.signColumns"
      :defaultIndex="signSelect.defaultIndex"
      keyName="label"
      @confirm="signConfirm"
      @cancel="selectShow"
    ></u-picker>
  </view>
</template>

<script>
import { getData } from "@/common/api";
import { navBack } from "@/common/hooks";
import store from "@/store";
//下面是演示数据，您的项目不需要引用，数据需要您从服务器自行获取
import Battery from "@/components/Battery.vue";

export default {
  data() {
    return {
      role_id: null,
      noData: store.state.no_data,
      info: {},
      chartsDataLine1: {}, // 折线图
      branchList: [],
      annual: {},

      signSelect: {
        activeDate: "",
        defaultIndex: [0],
        signColumns: [],
      },
      signSelectShow: false,
      activeTime: "",
    };
  },
  onLoad() {},
  onShow() {
    this.initDate();
    this.init();
  },
  methods: {
    init() {
      this.getDetail();
      // this.initUcharts();
    },
    getDetail() {
      getData("/index/target_detail", {
        params: {
          year: this.signSelect.activeDate,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.info = data;
          this.annual = data.annual;
          this.branchList = data.department_annual_list;
          let arr = data.departments;
          let days = [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
          ];
          if (arr.length > 0) {
            arr.map((e) => {
              // e.data = e.department_month_value;
              let vals = [];
              e.department_month_value.map((val) => {
                let num = val.split(',').join('');
                vals.push(Number(num));
              });
              e.data = vals;
            });
            this.chartsDataLine1 = {
              categories: days,
              series: arr,
            };
          } else {
            this.chartsDataLine1 = {
              categories: days,
              series: [
                {
                  name: "",
                  data: [],
                },
              ],
            };
          }
        }
      });
    },
    initDate() {
      const d = new Date();
      const year = d.getFullYear();
      this.signSelect.activeDate = year;

      // 获取公司年份
      getData("/achievement/achievement_year_director", {}).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          let yearArr = [];
          list.map((e, i) => {
            if (year == e.year) {
              this.signSelect.defaultIndex[0] = i;
            }

            yearArr.push({
              label: `${e.year}年`,
              val: e.year,
            });
          });
          this.signSelect.signColumns[0] = yearArr;
        }
      });
    },

    // initUcharts() {
    //   let lineData = {
    //     categories: [
    //       "1",
    //       "2",
    //       "3",
    //       "4",
    //       "5",
    //       "6",
    //       "7",
    //       "8",
    //       "9",
    //       "10",
    //       "11",
    //       "12",
    //     ],
    //     series: [
    //       {
    //         name: "成交量A",
    //         data: [35, 8, 25, 37, 4, 20, 1, 35, 8, 25, 37, 4, 20, 1],
    //       },
    //       {
    //         name: "成交量B",
    //         data: [70, 40, 65, 100, 44, 68, 1],
    //       },
    //       {
    //         name: "成交量C",
    //         data: [100, 80, 95, 150, 112, 132, 1],
    //       },
    //       {
    //         name: "成交量D",
    //         data: [10, 20, 30, 40, 0, 10, 5],
    //       },
    //       {
    //         name: "成交量E",
    //         data: [200, 50, 80, 100, 0, 10, 20],
    //       },
    //     ],
    //   };
    //   setTimeout(() => {
    //     this.chartsDataLine1 = lineData;
    //   }, 1500);
    // },

    selectShow() {
      this.signSelectShow = !this.signSelectShow;
    },

    // 筛选
    signConfirm({ value }) {
      this.signSelect.activeDate = value[0].val;
      this.signSelectShow = false;
      this.init();
    },

    leftClick() {
      navBack();
    },

    onPullDownRefresh() {
      this.init();
    },
  },
  components: {
    Battery,
  },
};
</script>

<style lang="less" scoped>
/deep/.u-navbar {
  z-index: 9;
}

/deep/.u-sticky {
  padding: 0 20px 14px;
  // height: 100px;

  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/%E9%A3%9E%E4%B9%A620220303-104617.png");
  background-size: 100% 100%;
}

.list_bgc {
  position: absolute;
  top: 0px;
  left: 0;

  width: 100%;
  height: 124px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/%E9%A3%9E%E4%B9%A620220303-104740.png");
  background-size: 100% 100%;
  z-index: -1;
}

.container_main {
  position: relative;
  padding: 0 15px 30px;
  z-index: 2;
}

.money_total {
  margin: 0 0 24px;
  width: 100%;
  height: 143px;
  background: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  // 部门 + 我的目标
  .branch_target {
    padding: 18px 20px 0;

    .l_money {
      .tit {
        margin-bottom: 10px;
        font-size: 14px;
        font-weight: 600;
        line-height: 20px;
        color: #333333;
      }

      .txt {
        font-size: 12px;
        font-weight: 600;
        line-height: 22px;
        color: #333333;

        .money {
          font-size: 18px;
          color: #fcac4e;

          text {
            font-size: 12px;
          }
        }
        .empty {
          color: #c3c3c3;
        }

        .target_money {
          color: #333;
        }
      }
    }

    .proportion_money {
      position: relative;
      width: 104px;
      height: 104px;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #7c95fb;
      text-shadow: 0px 1px 4px rgba(157, 73, 1, 0.6);

      /deep/.battery {
        position: absolute;
        top: 0;
        left: 0;
        width: 100% !important;
        height: 100% !important;
        background: rgba(246, 181, 77, 0.1) !important;

        .wave1,
        .wave2,
        .wave3 {
          background: rgba(246, 181, 77, 0.4) !important;
        }
      }

      .txt {
        font-size: 26px;
        font-weight: 600;
        color: #ffffff;
        z-index: 3;
      }
    }
  }
}

.com_top_tit {
  margin-top: 10px;
  padding: 0 5px;
  justify-content: space-between;

  .tit {
    font-size: 12px;
    font-weight: 600;
    line-height: 1;
    color: #ffffff;
  }

  .r_select {
    .item {
      margin-left: 20px;
      font-size: 12px;
      font-weight: 400;
      line-height: 1;
      color: #fff;

      .iconfont {
        margin-left: 6px;
        font-size: 6px;
      }
    }
  }
}

// 部门目标
.branch_target_box {
  margin-bottom: 20px;
  padding: 19px 10px 27px;
  width: 100%;
  background-color: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  .tit {
    margin-bottom: 14px;
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
    color: #333333;
  }

  .branch_main {
    padding-left: 10px;

    .list {
      .item {
        margin-bottom: 20px;

        .top_info {
          .l_info {
            .name {
              font-size: 12px;
              font-weight: 400;
              color: #333333;
            }

            .money {
              font-size: 12px;
              font-weight: 400;
              line-height: 17px;
              color: #666666;
            }
          }

          .r_pirce {
            margin-left: 75px;
            font-size: 16px;
            font-weight: 600;
            line-height: 22px;
            color: #ff9d00;
            flex-shrink: 0;

            text {
              font-size: 13px;
            }
          }
        }

        .progress_bar {
          margin-top: 4px;
          position: relative;
          width: 100%;
          height: 10px;
          background: #f2f2f2;
          border-radius: 10px;
          overflow: hidden;

          .bar {
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            background-color: #4d6fff;
            border-radius: 10px;
          }
        }
      }
    }
  }
}

.sign_contrast {
  margin-bottom: 20px;
  padding: 19px 0 20px;
  background-color: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;

  .title {
    padding: 0 10px;
    margin-bottom: 14px;

    .tit {
      font-size: 13px;
      font-weight: 600;
      line-height: 1;
      color: #333333;
    }

    .txt {
      font-size: 11px;
      font-weight: 400;
      line-height: 1;
      color: #999999;
    }
  }

  .sign_mian {
    width: 100%;
  }
}
</style>