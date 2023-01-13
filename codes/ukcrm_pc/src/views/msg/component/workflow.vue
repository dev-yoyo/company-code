<template>
  <div class="workflow" id="dom">
    <div class="title">业务流提醒</div>
    <div v-if="msgList.length > 0" v-infinite-scroll="load">
      <div class="item" v-for="(v, i) in msgList" :key="i">
        <div class="top_time d-flex" v-if="v.date_time">
          <div class="time"> {{ v.date_time }} </div>
        </div>

        <div class="msg_item d-flex">
          <div class="img_box">
            <img class="img" :src="img">
          </div>

          <div class="r_main">
            <div class="content">{{ v.content }}</div>

            <div class="btm_btns d-flex" v-if="v.content_type == 10">
              <div class="btn is_confirm" @click="offerDetail(v)">
                查看详情
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="visit_line" v-else>
      <div class="page_empty">
        <img src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resources/%E9%A3%9E%E4%B9%A620220516-145029.png">
      </div>
    </div>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
export default {
  data() {
    return {
      msgList: [],
      page: 1,
      last_page: 1,
      first: true,

      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/rNsAcBsfGZHmZ6cfn67Ct3aC6ypriFxC1642647208438.png",

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
        url:"/message/workflow_remind",
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

          if (this.page != 1) {
            this.msgList = arr.concat(this.msgList);
          } else {
            this.msgList = arr;
          }

          this.last_page = list.last_page
        }
      });

      postData({
        url:"/message",
        data:{
          type: 2,
        }
      }).then((res) => {});
    },

    load () {
      if(this.page < this.last_page) {
        this.page += 1
        this.init()
      }
    },

    offerDetail(v) {
      this.$emit("cancel",v);
    },
  },
};
</script>

<style lang="less" scoped>
.workflow {
  height: 100vh;
  width: 436px;
  padding: 48px 48px 48px 24px;
  overflow-y:auto;
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
          }
        }
      }
    }
  }

  .page_empty {
    background: #fff!important;
    border:none!important;
  }
}
</style>