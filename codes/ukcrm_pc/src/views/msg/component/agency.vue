<template>
  <div class="agency" id="dom">
    <div class="title">待办助手</div>
    <div v-if="msgList.length > 0" v-infinite-scroll="load">
      <div class="item" v-for="(v, i) in msgList" :key="i">
        <div class="top_time d-flex" v-if="v.date_time">
          <div class="time">{{ v.date_time }}</div>
        </div>

        <div class="msg_item d-flex">
          <div class="img_box">
            <img class="img" :src="img" />
          </div>

          <div class="r_main">
            <!-- 申请加入企业 -->
            <div class="join_box" v-if="v.content_type == 0">
              <div class="content">{{ v.content }}</div>

              <div class="btm_btns d-flex">
                <div
                  class="btn cancel"
                  @click="join_err(v)"
                  v-if="v.relation && v.relation.status == 0"
                >
                  拒绝
                </div>
                <div
                  class="btn"
                  @click="join_confirm(v)"
                  v-if="v.relation && v.relation.status == 0"
                >
                  同意
                </div>

                <div class="btn is_confirm" v-if="v.relation && v.relation.status == 1">
                  已同意
                </div>
                <div class="btn is_confirm" v-if="v.relation && v.relation.status == 2">
                  已拒绝
                </div>
                <div class="btn is_confirm" v-if="v.relation && v.relation.status == 4">
                  已失效
                </div>
              </div>
            </div>
            <!-- 申请加入企业 -->

            <!-- 报价申请 -->
            <div class="price_box" v-else-if="v.content_type == 2">
              <div class="content" @click="showDetail(v)">
                <div class="top">
                  <div class="top_title d-flex">
                    <i class="icon iconfont icon-sp12"></i>审批
                  </div>
                  <div class="top_give">
                    {{ v.relation.user.name }}提交的报价申请
                  </div>
                </div>
                <div class="price_item d-flex">
                  <div class="l_label">所在部门：</div>
                  <div class="r_txt">
                    {{ v.relation.user.department_name }}
                  </div>
                </div>
                <div class="price_item d-flex">
                  <div class="l_label">客户名称：</div>
                  <div class="r_txt">
                    {{ v.relation.customer.name }}
                  </div>
                </div>
                <div class="price_item d-flex">
                  <div class="l_label">关联企业：</div>
                  <div class="r_txt">
                    {{ v.relation.customer.company }}
                  </div>
                </div>
              </div>

              <div class="btm_btns d-flex">
                <div
                  class="btn cancel"
                  @click="offer_err(v)"
                  v-if="v.relation && v.relation.status == 1"
                >
                  拒绝
                </div>
                <div
                  class="btn"
                  @click="offer_confirm(v)"
                  v-if="v.relation && v.relation.status == 1"
                >
                  同意
                </div>

                <div class="btn is_confirm" v-else>
                  {{ v.relation.examine_name }}
                </div>
              </div>
            </div>
            <!-- 报价申请 -->

            <!-- 跟进时效 -->
            <div class="join_box" v-else-if="v.content_type == 11">
              <div class="content">{{ v.content }}</div>

              <div class="btm_btns d-flex">
                <div
                  class="btn cancel"
                  @click="follow_confirm(v)"
                  v-if="v.relation && v.relation.status == 0"
                >
                  继续跟进
                </div>
                <div
                  class="btn"
                  @click="follow_err(v)"
                  v-if="v.relation && v.relation.status == 0"
                >
                  放弃跟进
                </div>

                <div class="btn is_confirm" v-if="v.relation && v.relation.status == 1">
                  已同意
                </div>
                <div class="btn is_confirm" v-if="v.relation && v.relation.status == 2">
                  已拒绝
                </div>
                <div class="btn is_confirm" v-if="v.relation && v.relation.status == 4">
                  已失效
                </div>
              </div>
            </div>
            <!-- 跟进时效 -->
          </div>
        </div>
      </div>
    </div>

    <div class="page_empty" v-else>
      <img
        src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png"
      />
    </div>

    <!-- 调整 -->
    <adjust ref="adjust" v-if="adjustShow" @cancel="hideadjust"></adjust>

    <!-- 详情 -->
    <offer-detail
      v-if="offerDetailShow"
      ref="refOfferDetail"
      @cancel="hideDetail"
    ></offer-detail>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import adjust from "@/views/org/component/frame_adjust.vue";
import offerDetail from "@/views/transaction_management/offer/component/detail.vue";

export default {
  data() {
    return {
      msgList: [],
      page: 1,
      last_page: 1,
      first: true,

      company_id: "", // 同意 拒绝 加入我的公司id
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/4tK3hwfCtGseYX6QcxriYsFTAzmpZS841642647136330.png",

      adjustShow: false,
      offerDetailShow: false,
      department_list:[]
    };
  },
  created() {
    this.page = 1
    this.init();
    this.get_department()
  },
  updated() {
    if (this.first) {
      this.$nextTick(function () {
        let dom = document.getElementById('dom')
        dom.scrollTop = dom.scrollHeight
      });
      this.first = false;
    }
  },

  methods: {
    init() {
      // 产品信息
      getData({
        url:"/message/agency_assistant", 
        data: {
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { list, company_id },
        } = res;
        if (code === 200) {

          let arr = list.data.reverse();
          if (this.page != 1) {
            this.msgList = arr.concat(this.msgList);
          } else {
            this.msgList = arr;
          }
          this.company_id = company_id;
          this.last_page = list ? list.last_page : 1;
        }
      });

      postData({
        url:"/message",
        data:{
          type: 0,
        }
      }).then((res) => {});
    },

    // 同意 加入企业  
    get_department() {
      getData({
        url: "/department/list ",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { department_list, msg },
        } = res;
        if (code === 200) {
          this.department_list = department_list;
        } else {
          this.department_list = [];
          this.$err(msg);
        }
      });
    },
    join_confirm(v) {
      if(this.department_list.length > 0) { 
        let user_id = v.relation ? v.relation.user_id : 0
        this.adjustShow = true;
        this.$nextTick(() => {
          this.$refs.adjust.handleOpen(user_id,v.relation.id);
        });
      }else {
        this.$warning('请先创建部门~')
      }
    },
    hideadjust() {
      this.adjustShow = false
      this.init()
    },
    // 拒绝 加入企业
    join_err(v) {
      postData({
        url:"/company/agree_company", 
        data:{
          content_id: v.relation.id,
          user_id: v.relation.user.id,
          company_id: this.company_id,
          status: 2,
        }
      })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            this.init();
          } else if (code === 422) {
            this.$err(msg);
          }
        })
    },

    // 继续 跟进
    follow_confirm(v) {
      postData({
        url: "/customer/continue_follow_customer", 
        data:{
          customer_id: v.relation.customer_id,
        }
      })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            this.init();
          } else if (code === 422) {
            this.$err(msg);
          }
        })
    },
    // 放弃 跟进
    follow_err(v) {
      postData({
        url:"/customer/give_up_customer", 
        data:{
          customer_id: v.relation.customer_id,
        }
      })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            this.init();
          } else if (code === 422) {
            this.$err(msg);
          }
        })
    },
    // 报价 同意
    offer_confirm(v) {
      postData({
        url:"/offer/examine_offer_record/" + v.relation.id,
        data:{
          status: 2,
        }
      })
        .then((res) => {
          const {
            code,
            data: { msg },
          } = res;
          if (code === 200) {
            this.$success(msg);
            this.init();
          } else if (code === 422) {
            this.$err(msg);
          }
        })
    },
    // 报价 拒绝
    offer_err(v) {
      postData({
        url:"/offer/examine_offer_record/" + v.relation.id, 
        data:{
          status: 4,
        }
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.$success(msg);
          this.init();
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },
  
    showDetail(row) {
      this.offerDetailShow = true;
      this.$nextTick(() => {
        this.$refs.refOfferDetail.init(row.relation.id);
      });
    },
    hideDetail() {
      this.offerDetailShow = false;
      this.init()
    },
    load() {
      if (this.page < this.last_page) {
        this.page += 1;
        this.init();
      }
    },
  },
  components: {
    offerDetail,
    adjust,
  },
};
</script>

<style lang="less" scoped>
.agency {
  height: 100vh;
  width: 436px;
  padding: 48px 48px 48px 24px;
  overflow-y: auto;
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  .item {
    margin-bottom: 25px;

    .top_time {
      margin-bottom: 20px;
      justify-content: center;

      .time {
        padding: 0 17px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background-color: #fff;
        border-radius: 20px;

        font-size: 12px;
        font-weight: 400;
        color: #999999;
      }
    }

    .msg_item {
      align-items: flex-start;
      width: 100%;

      .img_box {
        flex-shrink: 0;
        width: 44px;
        .img {
          height: 44px;
          width: 44px;
        }
      }

      .r_main {
        margin-left: 11px;
        width: 100%;
        background-color: #fff;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
        border-radius: 10px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333333;

        .content {
          padding: 20px 15px;
        }

        .btm_btns {
          height: 40px;
          line-height: 40px;
          border-top: 1px solid #e8e8e8;
          text-align: center;

          .btn {
            width: 100%;
            font-size: 14px;
            font-weight: 400;
            color: #316ec3;
            cursor: pointer;
          }

          .cancel {
            border-right: 1px solid #e8e8e8;
          }

          .is_confirm {
            color: #666666;
            cursor: default;
          }
        }

        .join_box {
          .content {
            text-align: center;
          }
        }

        // 报价申请
        .price_box {
          .content {
            padding: 10px 20px 20px;
            :last-child {
              margin-bottom: 0;
            }
          }

          .top_title {
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            color: #faa443;
            margin-bottom: 8px;
            .iconfont {
              font-size: 14px;
              font-weight: 400;
              margin-right: 3px !important;
            }
          }

          .top_give {
            font-size: 14px;
            font-weight: 600;
            line-height: 20px;
            color: #333333;
            margin-bottom: 8px !important;
          }

          .price_item {
            align-items: flex-start;
            margin-bottom: 8px;

            .l_label {
              width: 70px;
              font-size: 14px;
              font-weight: 400;
              color: #999999;
              flex-shrink: 0;
            }

            .r_txt {
              font-size: 14px;
              font-weight: 400;
              line-height: 20px;
              color: #333333;
              white-space: pre-wrap;
            }
          }
        }
      }
    }
  }
  .page_empty {
    background: #fff !important;
    border: none !important;
  }
}
</style>