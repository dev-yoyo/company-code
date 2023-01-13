<template>
  <div class="add_detail">
    <el-drawer
      :visible.sync="show"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      size="1054px"
      class="drawer_box"
      :close-on-press-escape="false"
      :wrapperClosable="true"
      :append-to-body="true"
    >
      <div class="close_icon d-center" @click="cancel">
        <i class="iconfont icon-ykbx"></i>
      </div>

      <div class="title">报价</div>

      <div class="detail_main">
        <div class="edit_btn d-between">
          <div class="detail_status d-align-center">
            <div class="no">{{ info.offer_num }}</div>

            <div
              class="item"
              :class="{
                pedding: info.examine_name == '审批中',
                refuse: info.examine_name == '已拒审',
              }"
            >
              {{ info.examine_name || "" }}
            </div>
          </div>

          <div class="d-align-center" v-if="belong_status">
            <el-button class="edit" @click="quote"> 引用 </el-button>
            <el-button class="edit" @click="edit" v-if="record_status">
              编辑
            </el-button>
            <el-button class="edit gray" @click="out"> 导出 </el-button>

            <el-button class="edit" @click="repeal" v-if="info.status == 1">
              撤销
            </el-button>
          </div>

          <div class="d-align-center" v-if="!belong_status && !exhibition">
            <el-button class="edit" @click="quote"> 引用 </el-button>
            <el-button class="edit gray" @click="out"> 导出 </el-button>
          </div>

          <div class="d-align-center" v-if="exhibition">
            <!-- 管理员审批 -->
            <el-button class="edit" @click="offer_confirm(2)"> 同意 </el-button>
            <el-button class="edit err" @click="offer_confirm(4)">
              拒绝
            </el-button>
          </div>
        </div>

        <div class="customer_info">
          <div class="item_box d-flex">
            <div class="item">
              关联客户：<span>
                {{ info.customer ? info.customer.name : "" }}
              </span>
            </div>
            <div class="item">
              报价产品：<span>
                {{ info.offer_product ? info.offer_product.length : "" }}
              </span>
            </div>
            <div class="item">
              报价人：<span>{{ info.user ? info.user.name : "" }}</span>
            </div>
            <div class="item">
              报价时间：<span>{{ info.offer_time }}</span>
            </div>
            <div class="item">
              有效期：<span>{{ info.overdue_time || "-" }}</span>
            </div>
          </div>
        </div>

        <el-form
          :model="info"
          ref="returnForm"
          label-width="70px"
          :border="show"
          class="demo-form"
        >
          <div class="form_tit">基础信息</div>

          <div class="d-align-center">
            <el-form-item label="报价编号">
              <el-input v-model="info.offer_num" disabled> </el-input>
            </el-form-item>

            <el-form-item label="关联客户">
              <el-input
                v-model="info.customer.name"
                disabled
                v-if="info.customer"
              ></el-input>
            </el-form-item>
          </div>

          <div class="d-align-center">
            <el-form-item label="关联企业">
              <el-input
                v-model="info.customer.company"
                disabled
                v-if="info.customer"
              ></el-input>
            </el-form-item>

            <el-form-item label="有效日期">
              <el-input v-model="info.overdue_time" disabled> </el-input>
            </el-form-item>
          </div>

          <div class="d-align-center">
            <el-form-item label="报价日期">
              <el-input v-model="info.offer_time" disabled></el-input>
            </el-form-item>

            <el-form-item label="报价人">
              <el-input
                v-model="info.user.name"
                disabled
                v-if="info.user"
              ></el-input>
            </el-form-item>
          </div>

          <div class="form_tit">产品信息</div>
          <el-table
            ref="singleTable"
            :data="tableData"
            style="width: 100%; overflow: auto"
            :header-row-style="{
              color: '#657180',
              'font-size': '12px',
            }"
            :cell-style="{ color: '#657180', 'font-size': '12px' }"
            class="demo_table"
            :border="true"
          >
            <el-table-column
              label="序号"
              type="index"
              min-width="72"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="产品名称"
              min-width="300"
              align="left"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div class="com-line-1">
                  {{ scope.row.product_name }}
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="类别"
              min-width="72"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <div class="com-line-1">
                  <span v-if="scope.row.product.s_classify">
                    {{ scope.row.product.s_classify.name }}
                  </span>
                  <span v-else-if="scope.row.product.f_classify">
                    {{ scope.row.product.f_classify.name }}
                  </span>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="指导报价"
              prop="offer_product"
              min-width="267"
              align="center"
            >
              <template slot-scope="scope">
                <div class="guide_price">
                  <div
                    class="price_box"
                    v-if="scope.row.product.price.length > 0"
                  >
                    <div
                      class="item d-flex"
                      v-for="v in scope.row.product.price"
                      :key="v.num"
                    >
                      <div class="txt">≥{{ v.num }}个</div>
                      <div class="txt">{{ v.price }}元</div>
                    </div>
                  </div>

                  <div class="no_price" v-else></div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              label="预购数量"
              prop="product_num"
              min-width="100"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="产品单价(元)"
              prop="product_price"
              min-width="117"
              sortable
              align="center"
            >
            </el-table-column>
            <template slot="empty">
              <div class="table_empty">
                <img
                  src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
                />
              </div>
            </template>
          </el-table>

          <div class="form_tit">其他</div>
          <el-form-item label="备注" class="remarks_item">
            <el-input
              type="textarea"
              v-model="info.remarks"
              placeholder="无"
              disabled
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <!-- 新建报价 -->
    <add-offer
      v-if="addOfferShow"
      ref="refAddOffer"
      @cancel="hideaddOffer"
    ></add-offer>
  </div>
</template>

<script>
import addOffer from "./add.vue";
import { getData, postData } from "@/api/user";
import store from "@/store";
import config from "@/libs/config";

export default {
  data() {
    return {
      show: true,
      user: {},

      addOfferShow: false,

      offer_id: "",
      info: {},
      belong_status: false, // 是否自己
      record_status: false, // 是否 编辑
      exhibition: false,

      tableData: [],
      baseUrl: "",
    };
  },
  created() {
    this.user = store.state.userInfo;
    this.baseUrl =
      process.env.NODE_ENV === "development"
        ? config.baseUrl.dev
        : config.baseUrl.pro;
  },
  methods: {
    init(offer_id) {
      this.offer_id = offer_id;
      getData({
        url: "/offer/offer_record_detail/" + this.offer_id,
        data: {
          id: this.offer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { data, belong_status, exhibition },
        } = res;
        if (code === 200) {
          this.info = data;
          this.tableData = data.offer_product;
          this.belong_status = belong_status;

          // 是否可以审核
          this.exhibition = exhibition;
        }
      });

      // 是否编辑
      getData({
        url: "/offer/record_belong",
        data: {
          model_name: 2, // 1 跟进 2 报价
          id: this.offer_id,
        },
      }).then((res) => {
        const {
          code,
          data: { record_status },
        } = res;
        if (code === 200) {
          this.record_status = record_status;
        }
      });
    },

    edit() {
      // console.log("edit >> ", this.info);
      this.add(this.info);
    },
    cancel() {
      this.$emit("cancel");
    },

    // 引用
    quote() {
      this.add("", "quote", this.offer_id);
    },
    // 导出
    out() {
      // window.open(`${this.baseUrl}/offer_export?offer_id=${this.offer_id}`);
      location.href = `${this.baseUrl}/offer_export?offer_id=${this.offer_id}`;
    },

    // 撤销
    repeal() {
      postData({
        url: `/offer/revoke_my_offer/${this.offer_id}`,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.init(this.offer_id);
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },

    // 报价 2同意  4拒绝
    offer_confirm(status) {
      postData({
        url: `/offer/examine_offer_record/${this.offer_id}`,
        data: {
          status: status,
        },
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.init(this.offer_id);
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },

    // 新建报价 新建报价 新建报价
    add(row, type, offer_id) {
      // console.log("return_list  list> 新建、编辑报价 >>>", row, type, offer_id);
      this.addOfferShow = true;

      this.$nextTick(() => {
        this.$refs.refAddOffer.init({
          offer_id: row ? row.id : false,
          type,
          offer_record_id: offer_id,
        });
      });
    },
    hideaddOffer({ update_list, offer_id }) {
      if (update_list) {
        this.init(offer_id);
      }

      this.addOfferShow = false;
    },
    // 新建报价 新建报价 新建报价
  },
  components: {
    addOffer,
  },
};
</script>

<style lang="less" scoped>
.add_detail {
  .title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }
}
.form_tit {
  margin: 24px 0 16px;
  font-size: 12px;
  font-weight: 600;
  color: #464c5b;
}

.detail_main {
  padding-left: 24px;
}

.edit_btn {
  margin-bottom: 22px;

  .detail_status {
    .no {
      margin-right: 24px;
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      color: #464c5b;
    }

    .item {
      margin-right: 8px;
      padding: 0 9px;
      height: 24px;
      line-height: 24px;
      background: #f3f3f3;
      border-radius: 4px;

      font-size: 12px;
      font-weight: 400;
      color: #657180;
    }

    .refuse {
      background-color: #ffe0e1;
      color: #ff1400;
    }

    .pedding {
      background-color: #ffeedd;
      color: #ffa629;
    }

    .nope {
      background-color: #e5eaff;
      color: #4d6fff;
    }
  }

  .edit {
    padding: 0;
    width: 68px;
    height: 32px;
    background: #0064f9;
    border-radius: 3px;

    color: #fff;
    font-size: 14px;
    font-weight: 400;
  }

  .gray {
    color: #666666;
    background-color: #fafafa;
    border: 1px solid #dddddd;
  }

  .err {
    color: #fff;
    background-color: #ff1400;
  }
}

.customer_info {
  padding: 25px 24px;
  margin-bottom: 23px;
  background: #f4f6ff;
  border-radius: 4px;

  .item_box {
    .item {
      width: 100%;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #9ea7b4;

      span {
        color: #657180;
      }
    }
  }
}

.el-textarea {
  width: 502px;
  height: 52px;
}

.guide_price {
  padding: 22px 24px;

  .price_box {
    border-left: 1px solid #d7dce6;

    .item {
      .txt {
        padding-left: 12px;
        width: 109px;
        height: 27px;
        line-height: 27px;
        font-size: 12px;
        font-weight: 400;
        color: #657180;
        text-align: left;

        border-right: 1px solid #d7dce6;
        border-top: 1px solid #d7dce6;
        border-bottom: 1px solid #d7dce6;
      }
    }
  }

  .no_price {
    margin: 0 auto;
    width: 24px;
    border: 1px solid #d1d7e2;
  }
}
</style>
