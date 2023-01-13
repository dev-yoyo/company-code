<template>
  <view class="detail_main">
    <u-toast ref="uToast"></u-toast>

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit d-flex">
      <view class="txt"> 基本信息 </view>
    </view>
    <view class="form_main">
      <u-form
        ref="uForm"
        :model="info"
        :rules="rules"
        labelPosition="left"
        labelWidth="100"
      >
        <u-form-item
          label="关联客户"
          prop="customer"
          @click="checkCustomer"
          required
        >
          <u-input
            v-model="customer.name"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>

        <u-form-item
          label="报价日期"
          prop="visitTime"
          required
          @click="dateShow = true"
        >
          <u-input
            v-model="info.visitTime"
            placeholder="请选择"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>

          <u-datetime-picker
            :show="dateShow"
            v-model="info.dateTime"
            mode="date"
            :formatter="formatter"
            @confirm="dateConfirm"
            @cancel="dateShow = false"
          ></u-datetime-picker>

          <u-icon slot="right" name="arrow-right"></u-icon>
        </u-form-item>
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit other_msg d-flex">
      <view class="txt"> 产品信息 </view>
    </view>

    <view class="form_main">
      <!-- 报价产品 -->
      <view
        class="product_info_box"
        v-for="(v, i) in activeProductList"
        :key="i"
      >
        <u-form labelWidth="100">
          <u-form-item v-if="activeProductList.length > 1">
            <view class="d-between">
              <view class="l_label l_title"> 报价信息 </view>

              <view class="del d-center" @click="del(i)">
                <i class="icon iconfont icon-sc"></i>
                删除
              </view>
            </view>
          </u-form-item>

          <u-form-item label="报价产品" @click="checkProduct(i)" required>
            <u-input
              v-model="v.name"
              placeholder="请选择"
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
              inputAlign="right"
              readonly
            ></u-input>
            <u-icon slot="right" name="arrow-right"></u-icon>
          </u-form-item>

          <u-form-item label="产品名称" v-if="v.type == 2" required>
            <u-input
              v-model="v.otherName"
              placeholder="请输入"
              placeholderStyle="#999999"
              fontSize="14"
              inputAlign="right"
              border="none"
            ></u-input>
          </u-form-item>

          <view class="table_item" v-if="v.price && v.price.length > 0">
            <view class="guide_price">
              <view class="p_label">指导报价</view>
              <view class="directPrice_table">
                <view class="tr">
                  <text class="td">数量：（个）</text>
                  <text class="td">单价：（元）</text>
                </view>
                <view  class="tr" v-for="(a, b) in v.price" :key="b">
                  <text class="td">{{ a.num }}+</text>
                  <text class="td">{{ a.price }}</text>
                </view>
              </view>
            </view>
          </view> 
          <u-form-item v-else>
            <view class="d-between guide_price">
              <view class="l_label">指导报价</view>
              <view class="directPrice_grey">暂无指导报价</view>
            </view>
          </u-form-item>

          <u-form-item>
            <view class="d-between">
              <view class="l_label"> <text>*</text> 预购数量 </view>

              <view class="producr_price_box d-center">
                <u-input
                  type="number"
                  v-model="v.num"
                  placeholder="请输入"
                  placeholderStyle="#999999"
                  fontSize="14"
                  border="none"
                  inputAlign="right"
                ></u-input>
              </view>
            </view>
          </u-form-item>

          <u-form-item>
            <view class="d-between">
              <view class="l_label"> <text>*</text> 产品单价 </view>

              <view class="producr_price_box d-center">
                <u-input
                  v-model="v.money"
                  type="digit"
                  placeholder="请输入"
                  placeholderStyle="#999999"
                  fontSize="14"
                  border="none"
                  maxlength="6"
                  inputAlign="right"
                  @input="moneyIpt"
                ></u-input>
                <text>元</text>
              </view>
            </view>
          </u-form-item>
        </u-form>

        <view
          class="create d-center"
          @click="addProduct"
          v-if="i == activeProductList.length - 1"
        >
          <i class="icon iconfont icon-tjx"></i>
          新建报价单
        </view>
      </view>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->
    <view class="tit other_msg d-flex">
      <view class="txt"> 其他信息 </view>
    </view>
    <view class="form_main">
      <u-form>
        <u-form-item label="报价人" labelWidth="100" required>
          <u-input
            v-model="user.name"
            placeholder="请输入"
            placeholderStyle="#999999"
            fontSize="14"
            border="none"
            inputAlign="right"
            readonly
          ></u-input>
        </u-form-item>

        <view class="ab_box" v-if="user.role_id > 2">
          <u-form-item label="是否需要审批" labelWidth="100" required>
            <view class="check_box">
              <u-switch v-model="info.check" @change="checkChange"></u-switch>
            </view>
          </u-form-item>
          <view class="ab">若您的价格低于指导报价，将需要经过上级审批</view>
        </view>

        <u-form-item>
          <view class="l_label"> 备注</view>
          <view>
            <u--textarea
              v-model="info.remarks"
              placeholder="请输入"
              placeholderStyle="#999999"
              fontSize="14"
              border="none"
            ></u--textarea>
          </view>
        </u-form-item>
      </u-form>
    </view>
    <!-- 、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、 -->

    <u-modal
      :show="tipShow"
      width="321px"
      :content="tipMsg"
      @confirm="tipShow = false"
    ></u-modal>

    <view class="new_fixed_btm" v-if="isEdit">
      <view>
        <view class="tips d-flex">
          <view class="l_tit">注：</view>
          <view class="r_info">
            <view class="r_txt">
              1、审核通过/无需审核的报价单，有效期为7天
            </view>
            <view class="r_txt"> 2、报价单失效后，无法进行关联合同 </view>
          </view>
        </view>

        <view class="btns d-flex">
          <u-button type="default" @click="cancel" :customStyle="cancelStyle">
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
      </view>
    </view>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      isEdit: false,
      tipShow: false,
      tipMsg: "",
      infoId: "",
      dateShow: false,
      cancelStyle: store.state.cancelStyle,
      user: {},
      customer: {},
      productList: [], // 选择 产品列表
      activeProductList: [{}], // 已选择的产品列表
      info: {
        dateTime: "",
        visitTime: "",
        remarks: "",
        check: true,
      },
      rules: {
        customer: [
          {
            validator: (rule, value, callback) => {
              return this.customer && this.customer.name ? true : false;
            },
            message: "请选择关联客户",
            trigger: ["change"],
          },
        ],
        visitTime: {
          type: "string",
          required: true,
          message: "请选择报价日期",
          trigger: ["blur", "change"],
        },
      },
    };
  },
  computed: {
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

    if (query.edit) {
      this.isEdit = true;
      this.infoId = query.info_id;
      this.editInit();
      this.init();
    } else {
      this.init();
    }

    // 数据监听
    let _th = this;
    uni.$on("updateData", function (data) {

      switch (data.type) {
        case "customer":
          _th.customer = data.customer;
          break;
        case "create_offer":
          _th.activeProductList.splice(data.index, 1, data.value);
          break;

        default:
          break;
      }
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.uForm.setRules(this.rules);
    });
  },
  methods: {
    editInit() {
      getData("/offer/offer_record_detail/" + this.infoId, {}).then((res) => {
        const {
          code,
          data: { data },
        } = res;
        if (code === 200) {
          this.customer = data.customer;
          this.info.visitTime = data.offer_time;
          this.info.dateTime = data.offer_time;
          this.info.remarks = data.remarks;
          let arr = data.offer_product;
          arr.map((e) => {
            e.id = e.product_id;
            e.name = e.product_name;
            e.num = e.product_num;
            e.money = e.product_price;
            e.price = e.product.price;
            e.type = e.product.type;
            if (e.product.type == 2) {
              e.otherName = e.product_name;
              e.name = "其他产品";
            }
          });
          this.activeProductList = arr;
        }
      });
    },
    init() {
      this.getProduct();
      getUser().then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.user = user;
        }
      });
    },
    getProduct() {
      getData("/product/business_product_list").then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          this.productList = list;
        }
      });
    },
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
    dateConfirm(e) {
      let time = new Date(e.value);
      let y = time.getFullYear();
      let m = time.getMonth() + 1;
      let d = time.getDate();
      m = m < 10 ? `0${m}` : m;
      d = d < 10 ? `0${d}` : d;

      let valueTime = `${y}-${m}-${d}`;

      this.info.dateTime = valueTime;
      this.info.visitTime = valueTime;
      this.dateShow = false;
    },

    moneyIpt(e) {
      e = e.match(/\d+\.?\d{0,5}/) ? e.match(/\d+\.?\d{0,5}/)[0] : "";

      //重新赋值给input
      this.$nextTick(() => {
        this.activeProductList[0].money = e;
      });
    },

    // 选择客户
    checkCustomer() {
      this.$Router.push({
        path: "/choose_customer",
        query: {
          customer: this.customer,
          type: "customer",
        },
      });
    },

    // 选择产品
    checkProduct(i) {
      let arr = this.activeProductList;
      let ids = [];
      if (arr.length > 0) {
        arr.map((e) => {
          ids.push(e.id)
        });
      }

      var r = ids.filter(function (s) {
          return s; 
      });
      
      this.$Router.push({
        path: "/choose_goods",
        query: {
          ids: JSON.stringify(r),
          type: "create_offer",
          index: i,
        },
      });


      // getData("/product/business_product_list").then((res) => {
      //   const {
      //     code,
      //     data: { list },
      //   } = res;
      //   if (code === 200) {
      //     this.$Router.push({
      //       path: "/choose_list",
      //       query: {
      //         list: JSON.stringify(list),
      //         type: "create_offer",
      //         index: i,
      //       },
      //     });
      //   }
      // });
    },

    addProduct() {
      this.activeProductList.push({});
    },

    del(i) {
      this.activeProductList.splice(i, 1);
    },

    checkChange(e) {
      this.info.check = e;
    },

    // 创建
    create() {
      this.$refs.uForm.validate().then((res) => {
        let arr = this.activeProductList;
        let proArr = [];
        let flag = true;
        if (arr.length > 0) {
          arr.map((e) => {
            if (!e.id) {
              flag = false;
              return this.$u.toast("请选择关联产品");
            }

            if (e.type == 2 && !e.otherName) {
              flag = false;
              return this.$u.toast("产品名称不能为空");
            }

            if (!e.money) {
              flag = false;
              return this.$u.toast("数量不能为空");
            }

            if (!e.num) {
              flag = false;
              return this.$u.toast("数量不能为空");
            }

            proArr.push({
              product_id: e.id,
              product_name: e.type == 1 ? e.name : e.otherName,
              product_price: e.money,
              product_num: e.num,
            });
          });
        }

        if (!flag) return;

        let info = this.info;
        this.createLoading = !this.createLoading;

        let url = "/offer/store";
        if (this.isEdit) {
          url = "/offer/update";
        }

        let params = {
          off_record_id: this.infoId,
          customer_id: this.customer.id,
          offer_time: info.visitTime,
          status: this.user.role_id > 2 && this.info.check ? 1 : 0,
          remarks: this.info.remarks,
          product: proArr,
        };

        postData(url, params)
          .then((res) => {
            const { code, data } = res;
            if (code === 200) {
              this.$refs.uToast.show({
                message: data.msg,
                complete() {
                  uni.navigateBack({ delta: 1 });
                },
              });
            } else if (code === 422) {
              this.$u.toast(data.msg);

              this.createLoading = !this.createLoading;
            }
          })
          .catch(() => {
            this.createLoading = !this.createLoading;
            // uni.$u.toast("创建失败，请重试");
          });
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
  padding: 0 0 155px;
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
.p_label {
  position: relative;
  font-size: 14px;
  color: #666;
  line-height: 52px;

  text {
    position: absolute;
    left: -11px;
    color: #f56c6c;
    line-height: 20px;
    font-size: 20px;
    top: 3px;
  }
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
  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }

  .btns {
    justify-content: space-around;
  }

  .tips {
    margin-bottom: 12px;
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #333333;
    align-items: flex-start;

    .l_tit {
      font-size: 13px;
      font-weight: 400;
      line-height: 18px;
      color: #333333;
    }

    .r_info {
      .r_txt {
        margin-bottom: 4px;
        font-size: 13px;
        font-weight: 400;
        line-height: 18px;
        color: #333333;
      }
    }
  }
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}

/deep/.u-textarea {
  padding: 10px 0 !important;
}

// 产品列表
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
  }

  .l_title {
    font-size: 13px;
    font-weight: 600;
    color: #333333;
  }

  .del {
    font-size: 12px;
    color: #4d6fff;

    .iconfont {
      margin-right: 5px;
    }
  }

  .producr_price_box {
    line-height: 1;

    text {
      margin-left: 3px;
      font-size: 14px;
      color: #333;
    }
  }

  .create {
    height: 52px;
    background-color: #fff;
    color: #316ec3;
    font-size: 13px;

    .iconfont {
      margin-right: 5px;
    }
  }
}

.check_box {
  display: flex;
  justify-content: flex-end;
}

// 指导报价
.directPrice_grey {
  text-align: right;
  color: #999;
  .direct {
    margin-left: 5px;
  }
}

.directPrice_table {
  text-align: left;
  color: #333;
  font-size: 14px;
  border: 1px solid #E5E5E5;
  border-right: 0;
  border-bottom: 0;
  .tr {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .td {
    height: 36px;
    line-height: 36px;
    text-align: center;
    width: 50%;
    border-right: 1px solid #E5E5E5;
    border-bottom: 1px solid #E5E5E5;
  }
}

.ab_box {
  position: relative;
  padding-bottom: 14px !important;
  background: #fff;
  margin-bottom: 1px;

  /deep/ .u-form-item__body {
    padding-bottom: 0 !important;
  }
  .ab {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #999999;
    padding-left: 26px;
  }
}

.table_item {
  border-bottom: 1px solid #f7f8fa;
  padding-bottom: 20px;
}

.guide_price {
  align-items: flex-start;
}

/deep/.u-modal {
  .u-modal__content__text {
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    color: #666666;
    text-align: center;
  }

  .u-modal__button-group__wrapper__text {
    font-size: 17px;
    font-weight: 400;
    color: #4d6fff;
  }
}
</style>