<template>
  <view class="ask_detail">
    <searchBox page="home" v-if="isSearch"></searchBox>

    <view class="top_info_content">
      <view class="info_user_box">
        <image class="avatar" :src="askInfo.user ? askInfo.user.avatar : ''" />

        <view class="user_info">
          <view class="nickname">{{
            askInfo.user ? askInfo.user.nickname : ""
          }}</view>
          <view class="time">
            <text>{{ askInfo.show_time }}</text>
            <text class="take">采纳率{{ askInfo.adopt_pct }}%</text>
          </view>
        </view>
      </view>

      <view class="info_tit">{{ askInfo.title }} </view>

      <view class="info_tags">
        <view class="q_tags">
          <view
            class="tags"
            v-for="(v, idx) in askInfo.content_tags"
            :key="idx"
          >
            {{ v.name }}
          </view>
        </view>

        <!-- 悬赏问答 -->
        <view
          class="reward_money_box"
          :class="askInfo.is_expiration == 2 ? 'over' : ''"
          v-if="askInfo.type == 1"
        >
          <view class="ebc_count">
            <image src="@/static/common/img/reward_money.png" />
            ¥{{ askInfo.ebc }}
          </view>

          <view class="last_end_time" v-if="askInfo.is_expiration == 2">
            已结题
          </view>
          <view class="last_end_time" v-else>
            问题最晚将于{{ askInfo.expire }}结题
          </view>
        </view>
      </view>

      <view class="html_content">
        <u-parse :html="askInfo.html_content"></u-parse>

        <view
          class="file_box"
          v-if="askInfo.resource && askInfo.resource.length > 0"
        >
          <view v-for="v in askInfo.resource" :key="v.id">
            <view class="file_item" v-if="v.type == 1">
              <view class="left_main">
                <image src="@/static/common/img/file_img.png" />
                文件：<text>{{ v.name }}</text>
              </view>
            </view>

            <view class="file_item" v-else>
              <view>
                <image class="web_icon" src="@/static/common/img/web_img.png" />
                <text>{{ v.network_address }}</text>
              </view>
            </view>
          </view>
        </view>

        <view
          class="file_box"
          v-if="askInfo.accessories && askInfo.accessories.length > 0"
        >
          <view v-for="v in askInfo.accessories" :key="v.id">
            <view class="file_item" v-if="v.type == 1">
              <view class="left_main">
                <image src="@/static/common/img/file_img.png" />
                文件：<text>{{ v.file_name }}</text>
              </view>
            </view>

            <view class="file_item" v-else>
              <view class="left_main">
                <image class="web_icon" src="@/static/common/img/web_img.png" />
                <text>{{ v.network_address }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>

      <view class="btm_btns">
        <view class="r_btns">
          <view class="reply_btn" @tap="reply_back(0)">我来回答</view>
          <view
            class="reply_btn end"
            @tap="showEndAskModal"
            v-if="
              userid == askInfo.user_id &&
              askInfo.type == 1 &&
              askInfo.is_expiration != 2
            "
            >结题
          </view>
        </view>

        <view class="info_btns">
          <view
            class="item collcet"
            :class="askInfo.myCollect == 'cancel' ? 'is_collect' : ''"
            @tap="collect_detail(askInfo)"
          >
            <i class="icon iconfont un_icon icon-a-lujing141"></i>
            <i class="icon iconfont is_icon icon-e-sc-on"></i>

            {{ askInfo.collect_count ? askInfo.collect_count : "收藏" }}
          </view>

          <view class="more_btn" @tap="showMore" v-if="moreShow">
            <image class="ellipsis" src="/static/common/img/ellipsis.png" />

            <view class="more" v-if="moreListShow">
              <view class="jtou"></view>
              <view
                class="btn_li"
                v-if="askInfo.type != 1 && replyList.length <= 0"
                @tap="edit_ask"
              >
                编辑
              </view>

              <view class="btn_li" v-if="askInfo.question_del" @tap="del_ask()">
                删除
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view class="reply_tit">回答 {{ replyList.length }}</view>

    <view class="reply_content_box" v-if="replyList.length > 0">
      <view class="reply_li" v-for="(v, idx) in replyList" :key="idx">
        <view class="user_info">
          <view class="l_user">
            <image class="avatar" :src="v.user ? v.user.avatar : ''" />
            <view class="nickname">{{ v.user ? v.user.nickname : "" }}</view>
          </view>

          <view class="time">{{ v.show_time }}</view>
        </view>

        <view class="content">
          <u-parse :html="v.html_content"></u-parse>

          <view class="file_box" v-if="v.resource && v.resource.length > 0">
            1
            <view v-for="item in v.resource" :key="item.id">
              <view class="file_item" v-if="item.type == 1">
                <view class="left_main">
                  <image src="@/static/common/img/file_img.png" />
                  文件：<text>{{ item.file_name }}</text>
                </view>
              </view>

              <view class="file_item" v-else>
                <view>
                  <image
                    class="web_icon"
                    src="@/static/common/img/web_img.png"
                  />
                  <text>{{ item.network_address }}</text>
                </view>
              </view>
            </view>
          </view>

          <view class="file_box" v-if="v.accessory && v.accessory.length > 0">
            <view v-for="item in v.accessory" :key="item.id">
              <view class="file_item" v-if="item.type == 1">
                <view class="left_main">
                  <image src="@/static/common/img/file_img.png" />
                  文件：<text>{{ item.file_name }}</text>
                </view>
              </view>

              <view class="file_item" v-else>
                <view class="left_main">
                  <image
                    class="web_icon"
                    src="@/static/common/img/web_img.png"
                  />
                  <text>{{ item.network_address }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="btm_btns">
          <view class="beast_reply" v-if="v.base_reply == 1">
            <image src="/static/common/img/beast_reply.png" />
            最佳答案
          </view>

          <view class="btns">
            <view class="item" v-if="v.is_del" @tap="del_reply(v)">
              <i class="icon iconfont icon-e-sc"></i>
              删除
            </view>

            <view class="item take" v-if="v.adopt" @tap="take_reply(v)">
              采纳
            </view>

            <view
              class="item"
              :class="v.myVote == 'cancel' ? 'is_vote' : ''"
              @tap="vote_reply(v)"
            >
              <i class="icon iconfont icon-e-z-on"></i>
              {{ v.vote_count ? v.vote_count : "赞" }}
            </view>

            <view class="item" v-if="!v.is_del" @tap="reply_back(1, v)">
              <i class="icon iconfont icon-e-pli"></i>
              回复
            </view>
          </view>
        </view>

        <!-- 评论的评论  评论的评论  评论的评论  评论的评论  评论的评论  评论的评论  评论的评论  评论的评论 -->
        <view class="reply_back_box" v-if="v.children && v.children.length > 0">
          <view
            class="reply_back_ul"
            v-if="v.children && v.children.length > 0"
          >
            <view
              class="reply_back_li"
              v-for="(val, index) in v.children"
              :key="index"
            >
              <view class="reply_user_info">
                <view class="l_user">
                  <view class="nickname">
                    {{ val.user ? val.user.nickname : "" }}
                  </view>
                  <text>回复</text>
                  <view class="nickname">
                    {{ val.reply_user ? val.reply_user.nickname : "" }}
                  </view>
                </view>

                <view class="time">{{ val.show_time }}</view>
              </view>

              <view class="content">
                <u-parse :html="val.html_content"></u-parse>
              </view>

              <view class="btns">
                <view class="item" v-if="val.is_del" @tap="del_reply(v)">
                  <i class="icon iconfont icon-e-sc"></i>
                  删除
                </view>

                <view
                  class="item"
                  :class="val.myVote == 'cancel' ? 'is_vote' : ''"
                  @tap="vote_reply(val)"
                >
                  <i class="icon iconfont icon-e-z-on"></i>
                  {{ val.vote_count ? val.vote_count : "赞" }}
                </view>

                <view class="item" v-if="!val.is_del" @tap="reply_back(1, val)">
                  <i class="icon iconfont icon-e-pli"></i>
                  回复
                </view>
              </view>
            </view>
          </view>
        </view>
        <!-- 评论的评论  评论的评论  评论的评论  评论的评论  评论的评论  评论的评论  评论的评论  评论的评论 -->
      </view>
    </view>

    <view class="no_reply" v-else>
      <i class="icon iconfont icon-e-sf"></i>
      <view class="txt"> 暂无评论，快来抢沙发吧～ </view>

      <view class="reply_btn" @tap="reply_back(0)">我来回答</view>
    </view>

    <u-popup v-model="editorShow" mode="bottom" :mask-close-able="true">
      <view class="editor_main">
        <!-- <my-editor ref="myEditor" @getHtml="getHtml"></my-editor> -->
        <ly-markdown @updateData="getText" @updateHtml="getHtml"></ly-markdown>
        <button class="submit_btn" @tap="beforeSubmit(askInfo)">提交</button>
      </view>
    </u-popup>

    <login></login>

    <u-modal
      v-model="endAskShow"
      ref="uModal"
      title="提醒"
      :content="endAskContent"
      @confirm="endAsk"
      @cancel="showEndAskModal"
      showCancelButton
      :asyncClose="true"
    >
    </u-modal>
    <!-- <view></view> -->
  </view>
</template>

<script>
import { authStatus, isWxBrowser } from "@/common/hooks.js";
import myEditor from "@/components/editor";
import lyMarkdown from "@/components/markdown.vue";
import wx from "jweixin-module";
import store from "@/store";

export default {
  data() {
    return {
      isSearch: false,
      userid: "",
      id: "", // 详情 id
      page: 1,
      next_page: true,
      moreShow: false, // 更多操作
      moreListShow: false, // 更多操作
      askInfo: {},
      replyList: [],
      placeholder: "开始输入...",
      editorShow: false,
      content: "",
      html_content: "",
      editorType: 0, // 0 回答  1 回复
      editorInfo: "", // 获取主键值 ID

      endAskShow: false,
      endAskContent: "",
      vuexState: store.state,
    };
  },
  onLoad: function (options) {
    this.id = this.$Route.query.id;
  },
  components: {
    myEditor,
    lyMarkdown,
  },
  onShow() {
    let vuex_user = this.$store.state.vuex_user;
    if (vuex_user.id) {
      this.userid = vuex_user.id;
    }

    this.$nextTick(() => {
      this.isSearch = true;
    });
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.$u.api
        .getAskDetail({
          id: this.id,
        })
        .then((res) => {
          const {
            code,
            data: { info, replies },
          } = res;
          // console.log("detail >>>>", replies);
          if (code === 200) {
            this.askInfo = info;
            this.replyList = replies.data;
            this.next_page = replies.data.next_page_url ? true : false;

            if (info.question_belong) {
              if (
                replies.data.length <= 0 ||
                (info.is_expiration &&
                  info.is_expiration == 2 &&
                  info.best_reply_id == 0)
              ) {
                this.moreShow = true;
              } else {
                this.moreShow = false;
              }
            }

            if (isWxBrowser()) {
              this.wxShare(info);
            }
          }
        });
    },

    // 微信分享
    async wxShare(info) {
      let ios = false;
      let ios_url = "";
      let userAgent = navigator.userAgent;
      if (userAgent.includes("iPhone") || userAgent.includes("iPad")) {
        ios = true;
        uni.getStorage({
          key: "originUrl",
          success(res) {
            ios_url = res.data;
          },
        });
      }

      let link = window.location.href;
      await this.$u.api
        .getJsSdk({
          url: ios ? ios_url : window.location.href,
        })
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {

            let sdkData = data;
            wx.config(sdkData);
            wx.ready(function () {
              wx.checkJsApi({
                jsApiList: [
                  "updateAppMessageShareData",
                  "updateTimelineShareData",
                  
                ],
                success: function (res) {
                  wx.updateAppMessageShareData({
                    title: info.title,
                    desc: info.content,
                    link: link,
                    imgUrl: "",
                    success: function () {
                      // 设置成功
                      
                    },
                  });


                  wx.updateTimelineShareData({
                    title: info.title,
                    imgUrl: "",
                    success: function () {
                      // 设置成功
                    },
                  });
                },
              });
            });
          }
        });
    },

    // 收藏
    async collect_detail(v) {
      if (!authStatus()) return;

      await this.$u.api
        .checkCollect({
          id: v.id,
          type: v.myCollect,
        })
        .then((res) => {
          const { code } = res;
          console.log("收藏 >>>>", code);
          if (code === 200) {
            if (v.myCollect == "like") {
              v.myCollect = "cancel";
              v.collect_count = v.collect_count + 1;
            } else {
              v.myCollect = "like";
              v.collect_count = v.collect_count - 1;
            }
          }
        });
    },
    // 点赞
    vote_reply(v) {
      if (!authStatus()) return;

      this.$u.api
        .checkVote({
          id: v.id,
          type: v.myVote,
        })
        .then((res) => {
          const { code } = res;
          if (code === 200) {
            if (v.myVote == "like") {
              v.myVote = "cancel";
              v.vote_count = v.vote_count + 1;
            } else {
              v.myVote = "like";
              v.vote_count = v.vote_count - 1;
            }
          }
        });
    },
    // 采纳
    async take_reply(v) {
      if (!authStatus()) return;

      console.log(v);

      await this.$u.api
        .checkAdoption({
          id: this.askInfo.id,
          reply_id: v.id,
        })
        .then((res) => {
          const { code } = res;
          if (code === 200) {
            v.adopt = !v.adopt;
            v.base_reply = 1;
            this.init();
          }
        });
    },
    // 删除 问答
    async del_ask() {
      if (!authStatus()) return;

      await this.$u.api
        .AskDetailDelete({
          id: this.askInfo.id,
        })
        .then((res) => {
          const {
            code,
            data: { message },
          } = res;
          if (code === 200) {
            this.$u.toast(message);
            uni.navigateBack();
          }
        });
    },
    // 删除 评论
    async del_reply(v) {
      if (!authStatus()) return;

      console.log(v);
      await this.$u.api
        .deleteReply({
          id: v.id,
        })
        .then((res) => {
          const {
            code,
            data: { message },
          } = res;
          if (code === 200) {
            this.$u.toast(message);
            this.init();
          }
        });
    },

    showEndAskModal() {
      this.endAskShow = !this.endAskShow;
      this.endAskContent = `你的问题还没有最佳答案，是否结题，结题后将扣除${
        this.replyList.length > 0 ? "20" : "10"
      }%的悬赏金`;
    },
    // 结题
    endAsk() {
      if (!authStatus()) return;

      this.$u.api
        .conclusionAsk({
          id: this.id,
        })
        .then((res) => {
          const { code, data } = res;
          this.showEndAskModal();

          if (code === 200) {
            this.init();
            this.$u.toast(data.msg);
          } else if (code === 422) {
            this.$u.toast(data.msg);
          }
        });
    },

    // 点击 回答 、回复
    reply_back(type, v) {
      if (!authStatus()) return;

      // console.log(v);
      this.editorType = type;
      this.editorInfo = v;
      this.editorShow = !this.editorShow;
    },
    showMore() {
      this.moreListShow = !this.moreListShow;
    },
    getText(e) {
      this.content = e;
    },
    getHtml(e) {
      this.html_content = e;
    },

    // 提交回复 、 回答 防抖节流
    beforeSubmit(v) {
      this.before_v = v;
      this.$u.throttle(this.submit, 2000);
    },
    async submit() {
      if (!authStatus()) return;

      let v = this.before_v;
      console.log(v.id);

      let type = this.editorType,
        content = this.content,
        html_content = this.html_content,
        params = {};

      if (this.content.trim() == "") {
        this.$u.toast("评论内容不能为空");
        return;
      }

      console.log(type);
      if (type == 0) {
        // 回答
        params = {
          id: this.askInfo.id,
          content,
          html_content,
        };
      } else {
        // 回复
        params = {
          id: this.editorInfo.id,
          content,
          html_content,
          reply_user_id: this.editorInfo.user.id,
          belong_reply_id:
            this.editorInfo.belong_reply_id == 0
              ? this.editorInfo.id
              : this.editorInfo.belong_reply_id,
        };
      }

      await this.$u.api.checkReply(params).then((res) => {
        const {
          code,
          data: { msg },
        } = res;

        if (code === 200) {
          console.log(123456);
          this.init();
          this.editorShow = false;
        } else if (code == 422) {
          this.$u.toast({
            title: msg,
            icon: "none",
          });
        }
      });
    },

    edit_ask() {
      this.$Router.push({
        path: "/ask/create",
        query: {
          id: this.askInfo.id,
        },
      });
    },

    navback() {
      uni.navigateBack({ delta: 1 });
    },

    // onReachBottom() {
    //   this.$u.toast("onreachBottom");
    //   if (!this.next_page) return;
    //   this.page = this.page + 1;
    //   this.init();
    // },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
.ask_detail {
  .btns {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;

    .item {
      margin-left: 64rpx;
      display: flex;
      align-items: center;
      font-size: 24rpx;
      color: #333333;
      line-height: 1;
      flex-shrink: 0;

      .iconfont {
        margin-right: 10rpx;
      }
    }

    .take {
      text-decoration: underline;
    }

    :first-child {
      margin-left: 0;
    }
  }

  .top_info_content {
    position: relative;
    margin-bottom: 20rpx;
    padding: 28rpx 30rpx 40rpx;
    background-color: #fff;

    .info_user_box {
      display: flex;
      align-items: center;

      .avatar {
        margin-right: 16rpx;
        width: 64rpx;
        height: 64rpx;
        background: rgba(0, 0, 0, 0);
        border: 2rpx solid #f4f4f4;
        border-radius: 50%;
      }

      .user_info {
        .nickname {
          font-size: 30rpx;
          font-weight: 600;
          line-height: 42rpx;
          color: #333333;
        }

        .time {
          font-size: 22rpx;
          font-weight: 400;
          line-height: 32rpx;
          color: #999999;

          .take {
            margin-left: 10rpx;
          }
        }
      }
    }

    .info_tit {
      margin: 20rpx 0;
      font-size: 36rpx;
      font-weight: 600;
      line-height: 50rpx;
      color: #333333;
    }

    .info_tags {
      display: flex;
      justify-content: space-between;
      // align-items: center;
      line-height: 1;

      .q_tags {
        display: flex;

        .tags {
          margin-right: 12rpx;
          padding: 0 8rpx;
          height: 32rpx;
          line-height: 32rpx;
          font-size: 22rpx;
          color: #1462c1;
          background: #dcecff;
        }
      }

      .reward_money_box {
        display: flex;
        flex-direction: column;

        .ebc_count {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          padding: 0 12rpx;
          height: 46rpx;
          background: #ffebbe;
          border-radius: 8rpx;
          font-size: 28rpx;
          font-weight: 600;
          color: #ff6200;

          image {
            margin-right: 15rpx;
            width: 28rpx;
            height: 28rpx;
          }
        }

        .last_end_time {
          margin-top: 6rpx;
          padding: 0 12rpx;
          height: 46rpx;
          line-height: 46rpx;
          background: #f4f4f4;
          border-radius: 8rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #666666;
          text-align: center;
          white-space: nowrap;
        }
      }

      .over {
        .ebc_count {
          color: #fff;
          background-color: #dddddd;
        }

        .last_end_time {
          background-color: transparent;
          color: #999;
        }
      }
    }

    .html_content {
      margin: 40rpx 0;
      word-break: break-all;

      /deep/ img {
        width: 100% !important;
      }
    }

    .btm_btns {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .r_btns {
        display: flex;
        align-items: center;

        .reply_btn {
          width: 200rpx;
          height: 62rpx;
          line-height: 62rpx;
          text-align: center;
          background: #e2f0ff;
          border-radius: 32rpx;
          font-size: 28rpx;
          font-weight: 600;
          color: #0268fa;
        }

        .end {
          margin-left: 8rpx;
          color: #ff6200;
          background-color: #ffebbe;
        }
      }

      .info_btns {
        display: flex;
        align-items: center;

        .more_btn {
          position: relative;
          display: flex;
          align-items: center;
          margin-left: 40rpx;

          font-size: 24rpx;
          color: #666666;

          .ellipsis {
            width: 30rpx;
            height: 6rpx;
          }

          .more {
            position: absolute;
            top: 50rpx;
            right: 0;
            padding: 0 16rpx;
            width: 192rpx;
            background: #ffffff;
            box-shadow: 0 0 12rpx rgba(71, 89, 118, 0.25);

            .btn_li {
              padding: 26rpx 0;
              text-align: center;
              font-size: 32rpx;
              font-weight: 400;
              color: #333;
              border-bottom: 2rpx solid #f5f5f7;
              background-color: #fff;
            }

            :last-child {
              border-bottom: none;
            }
          }
        }

        .item {
          position: relative;
          display: flex;
          margin-left: 40rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #666666;

          .iconfont {
            margin-right: 8rpx;
            font-size: 30rpx;
          }
        }

        .collcet {
          .un_icon {
            display: block;
          }

          .is_icon {
            display: none;
          }
        }

        .is_collect {
          color: #ffb612;

          .un_icon {
            display: none;
          }

          .is_icon {
            display: block;
          }
        }
      }
    }
  }

  .reply_tit {
    margin-bottom: 2rpx;
    padding-left: 32rpx;
    height: 102rpx;
    line-height: 102rpx;
    background: #ffffff;

    font-size: 30rpx;
    font-weight: 600;
    color: #333333;
  }

  .reply_content_box {
    .reply_li {
      margin: 2rpx 0;
      padding: 30rpx 30rpx 28rpx;
      background-color: #fff;

      .user_info {
        margin-bottom: 28rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .l_user {
          display: flex;
          align-items: center;

          .avatar {
            margin-right: 14rpx;
            width: 44rpx;
            height: 44rpx;
            border: 2rpx solid #f2f2f2;
            border-radius: 50%;

            .nickname {
              font-size: 30rpx;
              font-weight: 600;
              line-height: 1;
              color: #333333;
            }
          }
        }
      }

      .content {
        margin-bottom: 30rpx;
      }

      .btm_btns {
        margin-bottom: 22rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .beast_reply {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 6rpx;
          height: 44rpx;
          font-size: 24rpx;
          font-weight: 400;
          color: #368d00;
          background: #effff4;
          border-radius: 8rpx;
          flex-shrink: 0;

          image {
            margin-right: 8rpx;
            width: 26rpx;
            height: 28rpx;
            flex-shrink: 0;
          }
        }
      }

      .time {
        font-size: 24rpx;
        line-height: 1;
        color: #999999;
      }

      .reply_back_box {
        padding: 34rpx 24rpx 0;
        background: #f4f4f4;

        .reply_back_ul {
          .reply_back_li {
            margin-bottom: 30rpx;
            padding-bottom: 32rpx;
            border-bottom: 2rpx solid #e3e3e3;

            .reply_user_info {
              margin-bottom: 28rpx;
              display: flex;
              justify-content: space-between;
              align-items: center;

              .l_user {
                display: flex;
                align-items: center;

                .nickname {
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 1;
                  overflow: hidden;

                  max-width: 150rpx;
                  font-size: 30rpx;
                  font-weight: 600;
                  color: #333333;
                  word-break: break-all;
                }

                text {
                  margin: 0 10rpx;
                  color: #999999;
                }
              }
            }

            .btns {
              justify-content: flex-end;
            }
          }

          :last-child {
            margin-bottom: 0;
            border-bottom: none;
          }
        }
      }
    }

    .is_vote {
      color: #0268fa !important;
    }
  }

  .no_reply {
    padding: 90rpx 0 222rpx;
    height: 100%;
    text-align: center;
    background-color: #fff;

    .iconfont {
      font-size: 58rpx;
      color: #5b9eef;
    }

    .txt {
      margin: 18rpx 0 30rpx;
      font-size: 26rpx;
      font-weight: 400;
      line-height: 1;
      color: #999999;
    }

    .reply_btn {
      margin: 0 auto;
      width: 200rpx;
      height: 68rpx;
      line-height: 68rpx;
      font-size: 28rpx;
      font-weight: 600;
      color: #0268fa;
      background: #fff;
      border-radius: 40rpx;
      border: 2rpx solid #005ef4;
    }
  }
}

.editor_main {
  padding: 30rpx 30rpx 50rpx;
  // height: 700rpx;

  .submit_btn {
    margin-top: 20rpx;
    width: 686rpx;
    height: 88rpx;
    background: #0268fa;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    border-radius: 44rpx;
  }
}

.file_box {
  margin: 20rpx 0;

  .file_item {
    display: flex;
    margin-right: 50rpx;
    margin-bottom: 20rpx;
    font-size: 26rpx;
    color: #333;

    .left_main {
      display: flex;
      align-items: center;

      image {
        margin-right: 10rpx;
        width: 36rpx;
        height: 36rpx;
        flex-shrink: 0;
      }

      .web_icon {
        width: 26rpx;
        height: 26rpx;
      }
    }

    text {
      word-break: break-all;
    }
  }
}
</style>
