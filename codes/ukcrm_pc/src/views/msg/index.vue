<template>
  <div class="msg_index">
    <el-drawer
      :visible.sync="drawer"
      direction="rtl"
      :before-close="cancel"
      :show-close="false"
      :withHeader="false"
      :close-on-press-escape="false"
      :wrapperClosable="true"
      class="drawer_box drawer_msg"
    >
      <div class="d-between">
        <div class="msg_other" v-if="idx > 0">
          <agency v-if="idx == 1"></agency>
          <system v-if="idx == 2"></system>
          <workflow v-if="idx == 3" @cancel="to_offer"></workflow>
          <comment v-if="idx == 4"></comment>
        </div>

        <div class="msg_list">
          <div class="title">消息</div>
          <div class="close_icon d-center" @click="cancel">
            <i class="iconfont icon-ykbx"></i>
          </div>

          <div class="list">
            <div
              class="item d-flex"
              v-for="(v, i) in msgList"
              :key="i"
              @click="detail(i)"
            >
              <div class="imgs">
                <img class="img" :src="v.img" />
              </div>

              <div class="r_main">
                <div class="info_txt d-flex">
                  <div class="name">{{ v.name }}</div>

                  <div class="time">{{ v.created_at }}</div>
                </div>

                <div class="tips d-between">
                  <div
                    class="content_html"
                    v-html="v.content"
                    v-if="v.content_type == 17"
                  ></div>
                  <div v-else class="content">{{ v.content }}</div>
                  <!-- <div  class="content">{{ v.content }}</div> -->
                  <el-badge
                    :value="v.count"
                    class="badge"
                    v-if="v.count > 0"
                  ></el-badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
import store from "@/store";
import agency from "./component/agency.vue";
import system from "./component/system.vue";
import workflow from "./component/workflow.vue";
import comment from "./component/comment.vue";

export default {
  data() {
    return {
      drawer: true,
      // 列表
      msgList: [],
      img0: `https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/4tK3hwfCtGseYX6QcxriYsFTAzmpZS841642647136330.png`,
      img1: `https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/FjPMNjN2GQT6mBm5WH5YBzncbh4BScGB1642647188600.png`,
      img2: `https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/rNsAcBsfGZHmZ6cfn67Ct3aC6ypriFxC1642647208438.png`,
      img3: `https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/202210/31/1Sc8uYLOL8VIWC9qfyMlBr4ze7YJv0iOuxuUHgA7.png`,
      idx: 0,
    };
  },
  components: {
    agency,
    system,
    workflow,
    comment
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let _th = this;
      getData({
        url: "/message",
      }).then((res) => {
        const { code, data } = res;
        if (code === 200) {
          let arr = data.list;
          arr.map((e, i) => {
            if (i == 0) {
              e.img = _th.img0;
              e.name = "待办助手";
            } else if (i == 1) {
              e.img = _th.img1;
              e.name = "友客帮小助手";
            } else if (i == 2) {
              e.img = _th.img2;
              e.name = "业务流提醒";
            } else if (i == 3) {
              e.img = _th.img3;
              e.name = "跟进评论";
            }
          });
          this.msgList = arr;
        }
      });
    },

    detail(i) {
      this.idx = i + 1;
      this.init();
    },
    // ----------------其他----------------
    cancel() {
      this.$emit("cancel");
    },
    to_offer(v) {
      this.$emit("cancel", v);
    },
  },
};
</script>

<style lang="less" scoped>
/deep/.drawer_msg .el-drawer__body {
  padding: 0 !important;
}

.msg_index {
  .title {
    margin-bottom: 23px;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #464c5b;
  }

  // /deep/.drawer_msg{
  /deep/.el-drawer {
    width: auto !important;
    overflow: initial !important;

    .msg_other {
      box-shadow: 0px 6px 6px rgba(0, 0, 0, 0.16);
    }

    .msg_list {
      height: 100vh;
      width: 516px;
      padding: 48px 48px 48px 24px;

      .list {
        padding: 0 0 0 14px;
      }

      .item {
        padding: 25px;
        height: 93px;
        background: #fff;
        box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
        border-radius: 8px;
        margin-bottom: 24px;
        cursor: pointer;

        .img {
          height: 44px;
          width: 44px;
        }

        .r_main {
          margin-left: 16px;
          width: 100%;
          overflow: hidden;

          .info_txt {
            margin-bottom: 8px;
            justify-content: space-between;
            line-height: 1;

            .name {
              font-size: 12px;
              font-weight: 600;
              color: #464c5b;
            }

            .time {
              font-size: 12px;
              font-weight: 400;
              color: #9ea7b4;
            }
          }

          .tips {
            font-size: 12px;
            font-weight: 400;
            line-height: 18px;
            color: #657180;
          }

          .content {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            padding-right: 10px;
          }

          .content_html {
            width: 200px;
            height: 35px;
            overflow: hidden;

            ol {
              padding-left: 20px;
            }
          }
        }
      }
    }
  }
}
</style>
