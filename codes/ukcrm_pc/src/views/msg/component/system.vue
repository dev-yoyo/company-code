<template>
  <div class="system" id="dom">
    <div class="title">友客帮小助手</div>

    <div v-if="msgList.length > 0" v-infinite-scroll="load">
      <div class="item" v-for="(v, i) in msgList" :key="i">
        <div class="top_time d-flex" v-if="v.date_time">
          <div class="time"> {{ v.date_time }} </div>
        </div>

        <div class="msg_item">
          <div class="img_box">
            <img class="img" :src="img">
          </div>

          <div class="r_main">
            <!-- 邀请你加入企业 -->
            <div class="join_box" v-if="v.content_type == 1">
              <div class="content">{{ v.content }}</div>

              <div class="btm_btns d-flex" v-if="v.relation">
                <div class="btn cancel" @click="invite_err(v)" v-if="v.relation.status == 0">
                  拒绝
                </div>
                <div class="btn" @click="invite_confirm(v)" v-if="v.relation.status == 0">同意</div>

                <div class="btn is_confirm" v-if="v.relation.status == 1">
                  已同意
                </div>
                <div class="btn is_confirm" v-if="v.relation.status == 2">
                  已拒绝
                </div>
                <div class="btn is_confirm" v-if="v.relation.status == 4">
                  已失效
                </div>
              </div>
            </div>
            <!-- 邀请你加入企业 -->



            <div class="content" v-html="v.content" v-else-if="v.content_type == 17"></div>
            <div class="content" v-else>{{ v.content }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="page_empty" v-else>
      <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png">
    </div>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      msgList: [],
      page: 1,
      last_page: 1,
      first: true,

      img: `https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/FjPMNjN2GQT6mBm5WH5YBzncbh4BScGB1642647188600.png`,
    };
  },
  created() {
    this.page = 1
    this.init();
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
        url: "/message/system_notice",
        data: {
          page: this.page,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          let arr = list.data.reverse();
          // console.log(arr, '转化前');
          arr.forEach((i, t) => {
            if (i.content_type == 17) {
              this.showHtml(i.content)
            }
          });
          // console.log(arr, '转化后');
          if (this.page != 1) {
            this.msgList = arr.concat(this.msgList);
          } else {
            this.msgList = arr;
          }

          this.last_page = list.last_page;
        }
      });

      postData({
        url: "/message",
        data: {
          type: 1,
        }
      }).then((res) => { });
    },

    // 富文本替换
    showHtml(str) {
      return str
        .replace(str ? /&(?!#?\w+;)/g : /&/g, '&amp;')
        .replace(/&amp;nbsp;/g, "")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, "\"")
        .replace(/&#39;/g, "\'")
    },

    // 同意 邀请企业
    invite_confirm(v) {
      postData({
        url: "/company/agree_join_company",
        data: {
          company_id: v.relation.company_id,
          content_id: v.relation.id,
          status: 1,
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
    // 拒绝 邀请企业
    invite_err(v) {
      postData({
        url: "/company/agree_join_company",
        data: {
          company_id: v.relation.company_id,
          content_id: v.relation.id,
          status: 2
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

    load() {
      if (this.page < this.last_page) {
        this.page += 1
        this.init()
      }
    }
  },
};
</script>

<style lang="less" scoped>
.system {
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
      display: flex;

      .img_box {
        flex-shrink: 0;

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
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #333333;

          /deep/ ol {
            padding-left: 20px;
            li {
              list-style-type: decimal;
              list-style-position: inside;
            }
          }

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
      }
    }
  }

  .page_empty {
    background: #fff !important;
    border: none !important;
  }
}
</style>