<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>

    <view class="info_main">
      <view class="tit">{{ info.company.year || "" }}年部门业绩目标</view>

      <view class="item">
        <view class="label">年度总目标：</view>
        <view class="meony">{{ info.company.money || "" }}元</view>
      </view>
      <view class="item">
        <view class="label">部门目标：</view>
        <view class="meony">{{ info.company.department.money || "" }}元</view>
      </view>
    </view>

    <view class="can_moeny d-between">
      <view class="label">当前可分配</view>
      <view class="money">
        {{ info.company.department.distributable || "0" }}元
      </view>
    </view>

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="com_tit">
      <view class="txt"> 成员目标</view>
    </view>

    <!-- 静态展示 成员目标 -->
    <view v-if="!isEdit">
      <view v-if="memberList.length > 0">
        <view class="show_box" v-for="(v, i) in memberList" :key="i">
          <view
            class="item item_look"
            :class="{
              out_member: v.status != '在职',
            }"
          >
            <view class="d-between">
              <view class="l_info d-flex avatar_box">
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

                <view class="r_info">
                  <view class="name">
                    {{ v.user.name }}

                    <text class="me" v-if="v.user_status && v.status == '在职'">
                      我
                    </text>
                    <text class="me" v-else-if="v.status != '在职'">
                      {{ v.status }}
                    </text>
                  </view>

                  <view class="finish"
                    >完成额：<text class="num"
                      >¥{{ v.completion_money }}</text
                    ></view
                  >
                </view>
              </view>
              <view class="price_look"
                >总额：<text class="money"><text>￥</text>{{ v.money }}</text>
              </view>
            </view>

            <view class="progress" v-if="v.status != '在职'">
              <u-line-progress
                :percentage="0"
                :showText="false"
                height="10"
                inactiveColor="#cbcbcb"
              ></u-line-progress>
            </view>

            <view class="progress" v-else>
              <u-line-progress
                :percentage="v.percent"
                :showText="false"
                height="10"
                activeColor="#4D6FFF"
                inactiveColor="#F2F2F2"
              ></u-line-progress>
            </view>
          </view>
        </view>
      </view>

      <view class="slogan" v-else>
        <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
        <view class="txt"> 暂无成员 </view>
      </view>
    </view>

    <!-- 编辑 -->
    <view class="form_main" v-else>
      <!-- 成员目标 -->
      <view class="user_list_box" v-for="(v, i) in memberList" :key="i">
        <u-form labelWidth="100" v-if="v.status == '在职'">
          <u-form-item>
            <view class="d-between">
              <view class="l_info d-flex avatar_box">
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
                  <view class="finish">完成额：¥{{ v.completion_money }}</view>
                </view>
              </view>

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
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <view class="new_fixed_btm" v-if="isEdit">
      <u-button
        type="default"
        @click="isEdit = false"
        :customStyle="cancelStyle"
      >
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

    <view class="new_fixed_btm" v-else-if="memberList.length > 0">
      <view class="item" @click="showEdit">
        <view class="icon_box">
          <i class="icon iconfont icon-bj"></i>
        </view>

        编辑
      </view>
    </view>

    <u-modal
      :show="modalShow"
      @confirm="modalShow = false"
      @cancel="modalShow = false"
    >
      <view class="slot-content modal_content">
        <view class="content">
          您设置的成员目标总和高（低）于 部门目标，请重新输入
        </view>
      </view>
    </u-modal>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      isEdit: false, // 编辑
      cancelStyle: store.state.cancelStyle,
      img: `${store.state.ossBaseUrl}direct/resource/202201/21/3E7CRCRakn2EDinGk4NwCN3EximEf8zm1642726401961.png`,

      memberList: [], // 部门成员列表
      info: {
        company: {},
      },
      modalShow: false,
    };
  },
  computed: {
    totalMoney() {
      let arr = this.memberList;
      let money = 0;
      arr.map((e) => {
        money += Number(e.money);
      });
      return money;
    },
  },
  onLoad() {
    let query = this.$Route.query;
    this.type == query.type;
    console.log(query);
    if (query.year) {
      this.info.company.year = query.year;
    }
    this.init();
  },
  methods: {
    init() {
      this.getInfo();
    },
    getInfo() {
      getData("/achievement/achievement_year_detail", {
        params: {
          year: this.info.company.year,
        },
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          this.info = data;
          this.memberList = data.member_list;
        }
      });
    },
    showEdit() {
      this.memberList.map((e) => {
        e.money = parseInt(e.money);
      });
      this.isEdit = true;
    },
    hideEdit() {
      this.init();
      this.isEdit = false;
    },

    moneyIpt(e, i) {
      e = e.replace(/[^\d]/g, "");

      //重新赋值给input
      this.$nextTick(() => {
        this.memberList[i].money = e;
      });
    },

    // 创建
    create() {
      let arr = this.memberList;

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

      // console.log(
      //   this.totalMoney,
      //   Number(this.info.company.department.distributable)
      // );
      // if (
      //   this.totalMoney > Number(this.info.company.department.distributable)
      // ) {
      //   flag = false;
      //   this.modalShow = !this.modalShow;
      //   return;
      // }

      if (!flag) return;

      this.createLoading = !this.createLoading;

      let url = "/achievement/update";

      let params = {
        members: newArr,
        year: this.info.company.year,
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

.com_tit {
  padding: 10px 26px;
  font-size: 13px;
  font-weight: 400;
  color: #999999;
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

.year_time {
  .iconfont {
    font-size: 14px;
    color: #666;
  }
}

.info_main {
  padding: 30px 20px 10px;
  width: 100%;
  background: #fff;

  .tit {
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: #333333;
  }

  .item {
    margin-bottom: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .label {
      font-size: 14px;
      font-weight: 400;
      color: #666666;
    }

    .meony {
      font-size: 14px;
      font-weight: 400;
      color: #333333;
    }
  }
}

.show_box {
  .item {
    margin-bottom: 1px;
    padding: 14px 20px;
    background-color: #fff;

    .l_info {
      background-color: #fff;

      .r_info {
        flex-direction: column;
        align-items: flex-start;
        margin-left: 12px;
        width: 100%;
        flex: 1;

        .name {
          display: flex;
          align-items: center;
          margin-bottom: 2px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #666666;

          .me {
            margin-left: 3px;
            display: inline-block;
            padding: 0 10px;
            height: 20px;
            line-height: 20px;
            border-radius: 10px 10px 10px 0px;
            font-size: 12px;
            color: #4d6fff;
            background: #f0f5ff;
          }
        }

        .finish {
          font-size: 12px;
          font-weight: 400;
          line-height: 17px;
          color: #cbcbcb;
        }
      }
    }

    .progress {
      padding-left: 58px;
      margin-top: 8px;
    }

    .price {
      font-size: 14px;
      font-weight: 400;
      line-height: 1;
      color: #333333;
    }
  }
  .item_look {
    position: relative;
    .name {
      color: #333;
    }

    .finish {
      color: #666;
      .num {
        color: #4d6fff;
      }
    }

    .price_look {
      position: absolute;
      top: 14px;
      right: 25px;
      font-size: 12px;
      font-weight: 400;
      color: #333;

      .money {
        color: #ff9d00;
        font-size: 14px;

        text {
          font-size: 12px;
        }
      }
    }
  }

  // 转岗 离职
  .out_member {
    .me {
      color: #999999 !important;
      background-color: #f4f4f4 !important;
    }

    .price_look {
      display: none;
    }

    /deep/.u-avatar {
      background-color: #cbcbcb !important;
      color: #fff !important;
    }
  }
}
.can_moeny {
  padding: 16px 20px;
  margin-top: 1px;
  background-color: #fff;

  .label {
    font-size: 14px;
    font-weight: 400;
    color: #666666;
  }

  .money {
    font-size: 14px;
    font-weight: 600;
    color: #ff9d00;
  }
}

.user_list_box {
  margin-bottom: 1px;
  padding: 0 20px;
  background-color: #fff;

  /deep/.u-form-item {
    border-bottom: 1px solid #f7f8fa;

    .u-form-item__body {
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .u-input {
      width: 110px;
    }
  }

  .l_info {
    background-color: #fff;

    .r_info {
      flex-direction: column;
      align-items: flex-start;
      margin-left: 12px;
      width: 100%;

      .name {
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #666666;
      }

      .finish {
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #cbcbcb;
      }
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

/deep/.u-modal {
  border-radius: 18px;
}
/deep/.u-modal__content {
  padding: 37px 55px 30px;
}

.modal_content {
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
  color: #666666;
  text-align: center;
}

.slogan {
  padding: 94px 0 0;
  text-align: center;

  /deep/.u-avatar {
    margin: 0 auto;
  }

  .txt {
    margin: 13px 0 0;
    font-size: 13px;
    font-weight: 400;
    color: #333333;
  }
}
</style>