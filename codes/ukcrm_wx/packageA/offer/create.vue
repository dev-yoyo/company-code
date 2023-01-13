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

          <u-form-item label="报价产品"  @click="showProduct(i)" required>
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
                <view class="tr" v-for="(a, b) in v.price" :key="b">
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
                  inputAlign="right"
                  @input="moneyIpt($event, i)"
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

    <view class="new_fixed_btm" :class="is_create ? 'lightBtn' : 'btn'">
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

        <u-button
          @click="create"
          :loading="createLoading"
          :disabled="createLoading"
        >
          创建
        </u-button>
      </view>
    </view>
        <!-- 状态 -->
    <u-popup
      :show="productTypeShow"
      :round="10"
      mode="bottom"
      :safeAreaInsetBottom="false"
      @close="productTypeShow = false"
    >
      <view class="choose_status">
        <view class="propup_main">
          <!-- <view class="tit"> 请选择 </view> -->

          <view class="list">
            <view
              class="item d-between"
              :class="activeStatus == v ? 'active' : ''"
              v-for="(v, i) in productTypes"
              :key="i"
              @click="chooseProduct(v)"
            >
              <view class="label">{{ v }}</view>
              <i class="t-icon iconfont t-icon-guo-l"></i>
            </view>
          </view>
        </view>

        <!-- <view class="popup_btns">
          <view class="btn cancel" @click="checkStatusShow = false">
            取消
          </view>
          <view class="btn" @click="submitStatus"> 确定 </view>
        </view> -->
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
import store from "@/store";

export default {
  data() {
    return {
      createLoading: false,
      tipShow: false,
      tipMsg: "",
      isEdit: false,
      infoId: "",
      dateShow: false,
      cancelStyle: store.state.cancelStyle,
      user: {},
      customer: {},
      productList: [], // 选择 产品列表
      activeProductList: [{}], // 已选择的产品列表
      productTypes: ['产品库','其他产品'],
      productIndex: '', // 产品索引
      productTypeShow: false, // 产品菜单栏
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
    this.inintDate();

    let query = this.$Route.query;
    if (query.customer_id) {
      this.customer.id = query.customer_id;
      this.customer.name = query.customer_name;
    }

    if (query.type && query.type == "quote") {
      getData("/offer/quote_offer_record", {
        params: {
          offer_record_id: query.offer_record_id,
        },
      }).then((res) => {
        const {
          code,
          data: { offer_record_procuct },
        } = res;
        if (code === 200) {
          let arr = [];
          if (offer_record_procuct.length > 0) {
            offer_record_procuct.map((e) => {
              e.product.num = e.product_num;
              e.product.money = e.product_price;
              // 其他产品
              if (e.product.type == 2) {
                e.product.otherName = e.product.name;
              }
              arr.push(e.product);
            });

            this.activeProductList = arr;
          }
        }
      });
    }

    this.init();

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
    init() {
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
    inintDate() {
      const d = new Date();
      const year = d.getFullYear();
      let month = d.getMonth() + 1;
      let day = d.getDate();
      month = month < 10 ? `0${month}` : month;
      day = day < 10 ? `0${day}` : day;

      this.info.visitTime = `${year}-${month}-${day}`;
      this.info.dateTime = `${year}-${month}-${day}`;
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

    moneyIpt(e, i) {
      e = e.match(/\d+\.?\d{0,5}/) ? e.match(/\d+\.?\d{0,5}/)[0] : "";

      //重新赋值给input
      this.$nextTick(() => {
        this.activeProductList[i].money = e;
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
    
    // 展示产品栏
    showProduct(i) {
      this.productIndex = i;
      this.productTypeShow = true;
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
    },

    // 选择产品类别
    chooseProduct(v) {
      if(v === '产品库') {
        this.checkProduct(this.productIndex);
        this.productTypeShow = false;
      }else {
        this.getOtherProduct();
      }
    },

    // 其他产品请求
    getOtherProduct() {
      let url = "/product/other_product";

      getData(url)
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            let arr = this.activeProductList;
            let obj = data.product;
            obj['num'] = 0;
            obj['money'] = 0;
            obj['otherName'] = '';
            arr[this.productIndex] = obj;
            this.productTypeShow = false;
          } else if (code === 422) {

          }
        })
        .catch(() => {

          // uni.$u.toast("创建失败，请重试");
        });
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
              return this.$u.toast("单价不能为空");
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
                  uni.$emit("updateOfferList", {});
                },
              });
            } else if (code === 422) {
              this.tipShow = true;
              this.tipMsg = data.msg;

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
  /deep/.item__body__right__content__icon {
    margin-left: 10px;
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
    position: relative;
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
.directPrice {
  white-space: pre-wrap;
}

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
  border: 1px solid #e5e5e5;
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
    border-right: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
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

.new_fixed_btm {
  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
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
.choose_status {
  margin-bottom: 22px;

  .propup_main {
    padding: 11px 0 0;

    .tit {
      padding: 0 20px;
      margin-bottom: 16px;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #999999;
    }
  }

  .list {
    margin-bottom: 16px;
  }

  .item {
    position: relative;
    padding: 16px 26px 16px;
    height: 49px;
    border-bottom: 1px solid #f4f4f4;
    display: flex;
    justify-content: center;

    .label {
      font-size: 16px;
      font-weight: 400;
      line-height: 1;
      color: #333333;
    }

    .t-icon {
      display: none;
    }

    .r_ipt {
      line-height: 1;

      .iconfont {
        margin-left: 16px;
        color: #c3c3c3;
        font-size: 13px;
        flex-shrink: 0;
      }
    }
  }

  .item:last-child {
    border-bottom: none;
  }

  .active {
    .label {
      color: #4d6fff !important;
    }

    .iconfont {
      display: block;
    }
  }
}
</style>