<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>

    <view class="form_main">
      <u-form labelPosition="left" labelWidth="100">
        <u-form-item label="年度时间" borderBottom @click="selectShow">
          <view class="year_time d-flex">
            <u-input
              v-model="selectYear.activeDate"
              placeholder=""
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
              inputAlign="right"
              readonly
            ></u-input>

            <i class="icon iconfont icon-you" v-if="isAdd"></i>
          </view>
        </u-form-item>

        <u-form-item label="年度目标" borderBottom>
          <view class="target_money d-flex">
            <u-input
              v-model="totalMoney"
              placeholder=""
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
              color="#ff9d00"
              inputAlign="right"
              readonly
            ></u-input>
            <text>元</text>
          </view>
        </u-form-item>
      </u-form>
    </view>

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit other_msg d-flex">
      <view class="txt"> 部门目标 </view>
    </view>

    <!-- 报价产品 -->
    <view v-if="!isEdit && !isAdd">
      <view class="show_box" v-for="(v, i) in branchList" :key="i">
        <view class="item d-between">
          <view class="label"> {{ v.depart.name }} </view>
          <view class="price"> {{ v.money }}元 </view>
        </view>
      </view>
    </view>

    <!-- 编辑 -->
    <view class="form_main" v-else>
      <!-- 报价产品 -->
      <view v-if="branchList.length > 0">
        <view class="product_info_box" v-for="(v, i) in branchList" :key="i">
          <u-form labelWidth="100">
            <u-form-item>
              <view class="d-between">
                <view class="l_label"> {{ v.depart.name }} </view>

                <view class="price_box d-center">
                  <u-input
                    v-model="v.money"
                  type="digit"
                    placeholder="请输入"
                    placeholderStyle="#999999"
                    fontSize="14"
                    inputAlign="right"
                    @input="moneyIpt($event, i)"
                  ></u-input>
                  <text>元</text>
                </view>
              </view>
            </u-form-item>
          </u-form>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="noData" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无部门 </view>
      </view>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <view
      class="new_fixed_btm"
      v-if="isEdit || (isAdd && branchList.length > 0)"
    >
      <u-button type="default" @click="hideEdit" :customStyle="cancelStyle">
        取消
      </u-button>

      <u-button
        @click="create"
        color="#4D6FFF"
        :loading="createLoading"
        :disabled="createLoading"
      >
        保存
      </u-button>
    </view>

    <view class="new_fixed_btm" v-else-if="branchList.length > 0">
      <view class="item" @click="showEdit">
        <view class="icon_box">
          <i class="icon iconfont icon-bj"></i>
        </view>

        编辑
      </view>
    </view>

    <u-picker
      :show="yearShow"
      :columns="selectYear.signColumns"
      :defaultIndex="selectYear.defaultIndex"
      keyName="label"
      @confirm="signConfirm"
      @cancel="selectShow"
    ></u-picker>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import { navback } from "@/common/hooks";
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      isEdit: false, // 编辑
      isAdd: false, // 新增
      cancelStyle: store.state.cancelStyle,
      branchList: [], // 选择 产品列表
      info: {
        year: "",
        money: "0.00",
      },
      user: {},
      departmentList: [],

      yearShow: false,
      selectYear: {
        activeDate: "",
        signColumns: [],
        defaultIndex: [0],
      },
      noData: store.state.no_data,
    };
  },
  computed: {
    totalMoney() {
      let arr = this.branchList;
      let money = 0;
      arr.map((e) => {
        let num = e.money ? Number(e.money) : 0;
        money += num;
      });
      return money;
    },
    // 创建按钮状态
    is_create() {
      let flag = false;
      const { visitTime } = this.info;

      if (visitTime && this.customer) {
        flag = true;
      }
      return flag;
    },
  },
  onLoad() {
    let query = this.$Route.query;
    if (query.add) {
      this.isAdd = query.add;
    }

    if (query.year) {
      this.selectYear.activeDate = query.year;
    }

    this.init();
  },
  methods: {
    init() {
      // 编辑 新增
      if (this.isAdd || this.isEdit) {
        this.getDepartment();
        this.initYear();
      } else {
        this.getInfo();
      }
    },
    getInfo() {
      getData("/achievement/achievement_year_department", {
        params: {
          year: this.selectYear.activeDate,
        },
      }).then((res) => {
        const {
          code,
          data: { list, year_detail },
        } = res;
        if (code === 200) {
          this.branchList = list;
          this.info = year_detail;
        }
      });
    },
    initYear() {
      const d = new Date();
      let year = d.getFullYear();
      this.selectYear.activeDate = year;

      let arr = [];
      for (let i = 0; i < 30; i++) {
        arr.push({
          label: `${year}年`,
          val: year,
        });

        year++;
      }
      this.selectYear.signColumns[0] = arr;
    },
    getDepartment() {
      getData("/department/list", {}).then((res) => {
        const {
          code,
          data: { department_list },
        } = res;

        if (code === 200) {
          uni.stopPullDownRefresh();
          let arr = department_list;
          // if (department_list.length <= 0) {
          //   return this.$u.toast("即将上线");
          // }
          arr.map((e) => {
            e.depart = {
              name: e.name,
            };
            e.money = "0";
          });
          this.branchList = arr;
        }
      });
    },
    // 时间默认值
    selectShow() {
      if (this.isAdd) {
        this.yearShow = !this.yearShow;
      }
    },

    showEdit() {
      this.branchList.map((e) => {
        e.money = parseInt(e.money);
      });
      this.isEdit = true;
    },

    hideEdit() {
      if (this.isAdd) {
        navback();
      } else {
        this.getInfo();
        this.isEdit = false;
      }
    },

    // 筛选
    signConfirm({ value }) {
      let year = value[0].val;
      this.selectYear.activeDate = year;
      this.yearShow = false;
    },

    moneyIpt(e,i) {
      e = e.replace(/[^\d]/g, "");

      //重新赋值给input
      this.$nextTick(() => {
        this.branchList[i].money = e;
      });
    },

    // 创建
    create() {
      let arr = this.branchList;
      let newArr = [];
      let flag = true;
      if (arr.length > 0) {
        arr.map((e) => {
          if (e.money === "") {
            flag = false;
            return this.$u.toast("金额不能为空");
          }

          newArr.push({
            id: e.id,
            money: e.money,
          });
        });
      }

      if (!flag) return;

      this.createLoading = !this.createLoading;

      let url = "/achievement/store";
      if (this.isEdit) {
        url = "/achievement/update_year";
      }

      let params = {
        achievement_id: this.info.id,
        members: newArr,
        money: this.totalMoney,
        year: this.selectYear.activeDate,
      };
      postData(url, params)
        .then((res) => {
          let _th = this;
          const { code, data } = res;
          if (code === 200) {
            this.$refs.uToast.show({
              message: data.msg,
              complete() {
                _th.isEdit = false;
                _th.isAdd = false;
                _th.init();
                _th.createLoading = !_th.createLoading;
                // uni.navigateBack({ delta: 1 });
              },
            });
          } else if (code === 422) {
            this.$u.toast(data.msg);
            this.createLoading = !this.createLoading;
          }
        })
        .catch(() => {
          this.createLoading = !this.createLoading;
          //   uni.$u.toast("创建失败，请重试");
        });
    },

    cancel() {
      uni.navigateBack({ delta: 1 });
    },
  },
};
</script>

<style lang="less" scoped>
.detail_main {
  padding: 0 0 130px;
}

.tit {
  justify-content: space-between;
  padding: 10px 26px;
  padding-right: 15px;

  .txt {
    font-size: 13px;
    font-weight: 400;
    line-height: 1;
    color: #999999;
  }
}

.other_msg {
  padding: 10px 26px;
}

.l_label {
  position: relative;
  font-size: 14px;
  color: #666;
  line-height: 20px;

  text {
    position: absolute;
    left: -11px;
    color: #f56c6c;
    line-height: 20px;
    font-size: 20px;
    top: 3px;
  }
}

.target_money {
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: #ff9d00;
}

.disabledLabel {
  color: #c3c3c3;
}

.form_main {
  /deep/.u-form-item__body {
    padding: 14px 20px !important;
    padding-left: 26px !important;
  }

  /deep/.item__body__right__content__icon {
    margin-left: 10px;
  }
}

.new_fixed_btm {
  justify-content: space-around;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}

// 展示
.show_box {
  background-color: #fff;

  .item {
    padding: 0 20px 0 26px;
    margin-bottom: 1px;
    height: 52px;

    .label {
      font-size: 14px;
      color: #666666;
    }
    .txt {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
  }
}

// 部门列表
.product_info_box {
  margin-bottom: 1px;
  padding: 0 20px;
  background-color: #fff;

  /deep/.u-form-item {
    border-bottom: 1px solid #f7f8fa;

    .u-form-item__body {
      padding-left: 7px !important;
      padding-right: 0 !important;
    }

    .u-input {
      width: 110px;
    }
  }

  .price_box {
    line-height: 1;

    text {
      margin-left: 3px;
      font-size: 14px;
      color: #333;
    }
  }
}

.year_time {
  .iconfont {
    font-size: 14px;
    color: #666;
  }
}
</style>