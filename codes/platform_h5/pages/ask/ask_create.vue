<template>
  <view class="wrap">
    <view class="com_box">
      <view class="com_tit"> 问答类型 </view>

      <u-radio-group v-model="askType" @change="radioChange">
        <u-radio
          v-for="(item, index) in list"
          :key="index"
          :name="item.value"
          :disabled="item.disabled"
        >
          {{ item.name }}
        </u-radio>
      </u-radio-group>

      <view class="reward_box" v-if="askType == 1">
        <view class="title">请选择悬赏金额</view>

        <view class="moeny_list_box">
          <view class="list">
            <view
              class="item"
              :class="moneyActive === index ? 'active' : ''"
              v-for="(v, index) in moneyList"
              :key="index"
              @tap="checkMoney(v, index)"
            >
              <text>¥</text> {{ v }}

              <image src="/static/common/img/active_money.png" />
            </view>
          </view>

          <view class="money_ipt">
            <u-input
              v-model="ebcValue"
              type="number"
              placeholder="或输入5-500元金额"
              :custom-style="customStyle"
              @focus="moneyFocus"
              @input="ebcIpt"
              :disabled="createType === 'edit'"
            />
          </view>
        </view>

        <view class="end_time">
          <view class="l_tit"> 有效期: </view>

          <view class="r_main">
            <u-dropdown>
              <u-dropdown-item
                v-model="expiration"
                :title="expiration"
                :options="dateOptions"
                :disabled="createType === 'edit'"
              ></u-dropdown-item>
            </u-dropdown>
          </view>
        </view>
      </view>
    </view>

    <view class="com_box">
      <view class="com_tit"> 标题 </view>
      <view>
        <u-input
          class="ask_title"
          v-model="title"
          type="text"
          placeholder="请输入标题（5-50字）"
          maxlength="50"
          :custom-style="titleCustomStyle"
        />
      </view>

      <view class="editor_md_box">
        <view class="com_tit"> 内容 </view>
        <!-- 
        <my-editor
          v-if="editorShow"
          ref="myEditor"
          @getHtml="getHtml"
          :content="content"
        ></my-editor> -->

        <ly-markdown
          v-if="editorShow"
          :textareaData="content"
          :textareaHtml="html_content"
          :showPreview="false"
          @updateData="getText"
          @updateHtml="getHtml"
        ></ly-markdown>
      </view>

      <view class="plate_box">
        <view class="tit">板块</view>

        <view class="p_ipt" @click="channelShow = true">
          <view class="l_val"> {{ channelVal ? channelVal : "选择板块" }}</view>

          <i class="icon iconfont icon-e-zy"></i>
        </view>
      </view>

      <view class="plate_box">
        <view class="tit">标签</view>

        <view class="p_ipt" @click="tagShow = true">
          <view class="l_val"> {{ tagVal ? tagVal : "选择标签" }}</view>

          <i class="icon iconfont icon-e-zy"></i>
        </view>
      </view>
    </view>

    <view class="submitBtn" @tap="$u.throttle(submitAsk, 3000)">提问</view>

    <!-- 板块 - 板块 - 板块 - 板块 - 板块 - 板块 - 板块 - 板块 - 板块 -->
    <u-popup
      v-model="channelShow"
      mode="bottom"
      height="auto"
      :mask-close-able="false"
    >
      <view class="channel_popup popup_box">
        <view class="top_tit">
          <text>板块</text>

          <i class="icon iconfont icon-e-qx41" @click="channelShow = false"></i>
        </view>

        <view class="classify_tags_box">
          <view
            class="tags"
            :class="channelId == v.id ? 'active' : ''"
            v-for="(v, idx) in channelList"
            :key="idx"
            @tap="choose_channel(v)"
          >
            {{ v.name }}
          </view>
        </view>
      </view>
    </u-popup>
    <!-- 板块 - 板块 - 板块 - 板块 - 板块 - 板块 - 板块 - 板块 - 板块 -->

    <!-- 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签  -->
    <u-popup
      v-model="tagShow"
      mode="bottom"
      height="716"
      :mask-close-able="false"
    >
      <view class="popup_box">
        <view class="top_tit">
          <text>标签</text>

          <i class="icon iconfont icon-e-qx41" @click="tagShow = false"></i>
        </view>

        <view class="classify_tags_box">
          <view
            class="tags"
            :class="v.active ? 'active' : ''"
            v-for="(v, idx) in tagList"
            :key="idx"
            @tap="choose_tag(v)"
          >
            {{ v.tags ? v.tags.name : "" }}
          </view>
        </view>

        <view class="submitBtn" @tap="addTags">添加</view>
      </view>
    </u-popup>
    <!-- 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签 - 标签  -->

    <u-modal
      v-model="payShow"
      :show-title="false"
      :show-confirm-button="false"
      :show-cancel-button="true"
    >
      <view class="slot-content">
        <view class="pay_query">
          <view class="title">点击查询悬赏问题支付是否已完成</view>

          <view class="btns">
            <view class="item check" @tap="paylog"> 已完成支付 </view>
            <view class="item" @tap="buy"> 支付失败，重新支付 </view>
          </view>
        </view>
      </view>
    </u-modal>

    <login></login>
  </view>
</template>

<script>
import myEditor from "@/components/editor";
import lyMarkdown from "@/components/markdown.vue";
import { authStatus, isWxBrowser } from "@/common/hooks.js";
import wx from "jweixin-module";

export default {
  data() {
    return {
      show: false,
      createType: "add",
      id: "",
      list: [
        {
          name: "普通问题",
          value: 0,
          disabled: false,
        },
        {
          name: "悬赏问题",
          value: 1,
          disabled: false,
        },
      ],
      askType: 0, // 0 普通问题 、 1 悬赏问题
      moneyList: [],
      moneyActive: 0,
      money: 0, // 悬赏金额
      ebcValue: "", // 悬赏问题 输入的 ebc
      payShow: false,

      expiration: 7, // 有效日期
      dateOptions: [
        {
          label: "1",
          value: 1,
        },
        {
          label: "3",
          value: 3,
        },
        {
          label: "7",
          value: 7,
        },
        {
          label: "15",
          value: 15,
        },
        {
          label: "30",
          value: 30,
        },
      ],

      title: "",
      content: "",
      html_content: "",
      editorShow: false,

      customStyle: {
        // ebc
        "box-sizing": "border-box",
        height: "68rpx",
        padding: "0 30rpx",
        "placeholder-style": "#C7C5C5",
      },

      titleCustomStyle: {
        "box-sizing": "border-box",
        height: "68rpx",
        padding: "0 30rpx",
        "placeholder-style": "#C7C5C5",
      },

      channelShow: false,
      channelId: "",
      channelVal: "",
      channelList: [],

      tagShow: false,
      tagList: [],
      checkTagIds: [], // 选择的标签 ids
      checktTagNames: [], // 选择的标签 name
    };
  },

  components: {
    myEditor,
    lyMarkdown,
  },
  onShow() {
    this.id = this.$Route.query.id;
    if (this.id) {
      this.createType = "edit";
    }
    if (!authStatus()) return;

    let _th = this;
    uni.getStorage({
      key: "askReward",
      success(res) {
        console.log(res, res.data);
        _th.payShow = res.data;
        if (res.data) {
          uni.removeStorage({
            key: "askReward",
          });
        }
      },
    });
  },
  created() {
    if (this.id) {
      this.getEdit(this.id);
    } else {
      this.editorShow = true;
      this.getCreate();
    }
  },
  computed: {
    tagVal() {
      return this.checktTagNames.join(",");
    },
  },
  methods: {
    radioChange(e) {
      console.log(e);
    },
    getText(e) {
      this.content = e;
    },
    getHtml(e) {
      this.html_content = e;
    },
    // 创建页面 编辑数据回显
    async getEdit() {
      await this.$u.api.getAskEdit({ id: this.id }).then((res) => {
        const {
          code,
          data: { channel_tag, channels, question, ebc },
        } = res;

        console.log(channel_tag, channels, question, ebc);

        if (code === 200) {
          this.askType = question.type;
          this.title = question.title;
          this.ebcValue = question.ebc;
          this.expiration = question.expiration;

          this.content = question.content;
          this.html_content = question.html_content;
          this.editorShow = true;

          let arr = this.list;
          arr.map((e, i) => {
            e.disabled = e.value != question.type ? true : false;
          });
          this.list = arr;

          let tags = question.content_tags;
          let ids = [],
            names = [];
          tags.map((e) => {
            ids.push(e.id);
            names.push(e.name);
          });
          this.checkTagIds = ids;
          this.checktTagNames = names;

          this.channelId = channel_tag.id;
          this.channelVal = channel_tag.name;
          this.channelList = channels;

          this.getAllTags(channel_tag.id);
        }
      });
    },
    // 创建页面 数据
    async getCreate() {
      await this.$u.api.getAskCreate().then((res) => {
        const {
          code,
          data: { channels, money },
        } = res;

        if (code === 200) {
          this.channelList = channels;
          this.moneyList = money;
          this.money = money[0];

          if (channels.length > 0) {
            this.channelId = channels[0].id;
            this.channelVal = channels[0].name;
            this.getAllTags(channels[0].id);
          }
        }
      });
    },
    // 板块下的 标签列表
    async getAllTags(id) {
      await this.$u.api.getAllTagsFromChannel({ id }).then((res) => {
        const {
          code,
          data: { channel_tags },
        } = res;

        if (code === 200) {
          let arr = channel_tags;
          arr.map((e) => (e.active = false));
          this.tagList = arr;
          this.mapTags();
        }
      });
    },

    checkMoney(v, index) {
      this.money = v;
      this.moneyActive = index;
      this.ebcValue = "";
    },
    moneyFocus() {
      this.moneyActive = "";
      this.money = "";
    },
    // 金额 整数
    ebcIpt(e) {
      var val = Number(e.replace(/[^0-9]/g, ""));

      if (val > 500) {
        val = 500;
        this.$u.toast("金额不能超过500");
      }

      this.ebcValue = val;
      this.money = val;
    },

    // 选择板块 单选
    choose_channel(v) {
      this.channelId = v.id;
      this.channelVal = v.name;
      this.channelShow = false;

      this.getAllTags(v.id);

      this.tagShow = true;
      this.checkTagIds = [];
      this.checktTagNames = [];
    },
    // 选择标签 多选
    choose_tag(v) {
      let ids = this.checkTagIds;
      let names = this.checktTagNames;
      let index = ids.indexOf(v.tags.id);

      if (index == -1) {
        if (ids.length >= 3) {
          this.$u.toast("标签最多选择3个");
          return;
        }

        ids.push(v.tags.id);
        names.push(v.tags.name);
        this.checkTagIds = ids;
        this.checktTagNames = names;
      } else {
        ids.splice(index, 1);
        names.splice(index, 1);
      }

      this.checkTagIds = ids;
      this.checktTagNames = names;
      this.mapTags();
    },
    mapTags() {
      let arr = this.tagList;
      let ids = this.checkTagIds;

      arr.map((e) => {
        e.active = ids.includes(e.tag_id);
      });

      this.tagList = arr;
    },
    // 添加 标签
    addTags() {
      this.tagShow = false;
    },

    // 提问
    async submitAsk() {
      let type = this.askType,
        content = this.content,
        html_content = this.html_content,
        title = this.title,
        tags = this.checkTagIds,
        expiration = this.expiration,
        params = {};

      if (title.trim() == "") {
        this.$u.toast("标题不能为空");
        return;
      }

      if (content.trim() == "") {
        this.$u.toast("内容不能为空");
        return;
      }

      if (tags.length <= 0) {
        this.$u.toast("请选择标签");
        return;
      }

      // if ((type == 1 && this.money < 5) || this.money > 500) {
      //   this.$u.toast("悬赏金额在5-500之间");
      //   return;
      // }

      params = {
        id: this.id ? this.id : "",
        content,
        html_content,
        title,
        tags,
        expiration,
        type,
        // ebc: type == 1 ? 0.1 : 0,
        ebc: type == 1 ? this.money : 0,
      };

      // 编辑
      if (this.createType == "edit") {
        await this.$u.api.AskPut(params).then((res) => {
          const {
            code,
            data: { msg, question_id, title, content },
          } = res;

          if (code === 200) {
            this.$u.toast(msg);
            this.$Router.replace({
              name: "ask_detail",
              params: {
                id: question_id,
              },
            });
          } else if (code == 422) {
            if (title) {
              this.$u.toast(title[0]);
              return;
            }

            if (content) {
              this.$u.toast(content[0]);
              return;
            }
          } else if (code == 421) {
            this.$u.toast(msg);
          }
        });
      } else {
        uni.showLoading({
          title: "发布中...",
          mask: true,
        });

        await this.$u.api.AskCreate(params).then((res) => {
          const {
            code,
            data: { msg, question_id, ebc, title, content },
          } = res;

          if (code === 200) {
            // this.$refs.myEditor.clear();
            uni.hideLoading();

            if (type == 1) {
              this.id = question_id;
              this.money = ebc;
              this.buy();
            } else {
              this.$u.toast(msg);
              this.$Router.replace({
                name: "ask_detail",
                params: {
                  id: question_id,
                },
              });
            }
          } else if (code == 422) {
            if (title) {
              this.$u.toast(title[0]);
              return;
            }

            if (content) {
              this.$u.toast(content[0]);
              return;
            }
          } else if (code == 421) {
            this.$u.toast(msg);
          }
        });
      }
    },
    async buy() {
      let params = {
        question_id: this.id,
        money: this.money,
        pay_type: "wechat",
        wechat_pay_type: isWxBrowser() ? 1 : 0,
      };

      await this.$u.api.rewardAsk(params).then((res) => {
        const {
          code,
          data: { config, result, msg },
        } = res;

        if (code === 200) {
          if (isWxBrowser()) {
            this.fetchJsSdk(config);
          } else {
            this.webPay(result);
          }
        } else if (code === 422) {
          this.$u.toast({
            title: msg,
            icon: "none",
          });
        }
      });
    },
    // 微信 内部浏览器支付
    async fetchJsSdk(config) {
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

      await this.$u.api
        .getJsSdk({
          url: ios ? ios_url : window.location.href,
        })
        .then((res) => {
          const { code, data } = res;
          if (code === 200) {
            this.pay(data, config);
          }
        });
    },
    pay(sdkData, config) {
      let _th = this;
      // console.log(sdkData);

      wx.config(sdkData);
      wx.ready(function () {
        wx.checkJsApi({
          jsApiList: ["chooseWXPay"],
          success: function (res) {
            console.log(res);
            if (res.checkResult.chooseWXPay === true) {
              wx.chooseWXPay({
                timestamp: config.timestamp,
                nonceStr: config.nonceStr,
                package: config.package,
                signType: config.signType,
                paySign: config.paySign,
                success: function (res) {
                  // 支付成功后的回调函数
                  console.log(res);

                  _th.$Router.replace({
                    name: "ask_detail",
                    params: {
                      id: _th.id,
                    },
                  });
                },
                fail(res) {
                  console.log(res);
                  _th.$u.toast("支付失败");
                },
              });
            }
          },
        });
      });

      /* 处理失败验证 */
      wx.error(function (res) {
        // config 信息验证失败会执行error函数,如签名过期导致验证失败,具体错误信息可以打开config的debug模式查看,也可以在返回的res参数中查看,对于SPA可以在这里更新签名
        alert("配置验证失败: " + res.errMsg);
      });
    },

    // 移动端 外部浏览器支付
    webPay(result) {
      uni.setStorage({
        key: "askReward",
        data: true,
      });
      // this.$u.toast("外部浏览器支付");

      location.replace(
        `${result.mweb_url}&redirect_url=${window.location.href}`
      );
    },
    // 查询支付结果
    paylog() {
      // this.$u.toast("正在查询支付结果");
      uni.showLoading({
        title: "正在查询",
        mask: true,
      });

      let _th = this;

      _th.$u.api.askRewardPayLog().then((res) => {
        const {
          code,
          data: { status, id },
        } = res;

        if (code === 200) {
          if (status) {
            uni.hideLoading();
            // 问答详情
            _th.$Router.replace({
              name: "ask_detail",
              params: {
                id,
              },
            });
          } else {
            this.$u.toast("支付失败，请重新查询");
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.com_box {
  margin-bottom: 20rpx;
  padding: 32rpx 30rpx 40rpx;
  background-color: #fff;

  .com_tit {
    margin-bottom: 20rpx;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1;
    color: #333333;
  }
}

.u-radio-group {
  margin-top: 10rpx;
}

// 悬赏
.reward_box {
  margin-top: 40rpx;
  .title {
    margin-block: 40rpx;
    font-size: 30rpx;
    font-weight: 600;
    line-height: 1;
    color: #333333;
  }

  .moeny_list_box {
    margin-top: 40rpx;
    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .item {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 156rpx;
        height: 68rpx;
        background: #ffffff;
        border: 2rpx solid #dbdbdb;
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;

        text {
          font-size: 22rpx;
        }

        image {
          display: none;
          position: absolute;
          bottom: 0;
          right: 0;
          width: 32rpx;
          height: 32rpx;
        }
      }

      .active {
        border: 2rpx solid #0060f4;
        image {
          display: block;
        }
      }
    }
  }

  .money_ipt {
    margin: 20rpx 0;
    /deep/ .u-input {
      width: 100%;
      flex: initial;
      border: 2rpx solid #e2e2e2;
    }
  }

  .end_time {
    margin-bottom: 24rpx;
    display: flex;
    align-items: center;

    .l_tit {
      margin-right: 26rpx;
      width: 120rpx;
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
      line-height: 1;
      flex-shrink: 0;
    }

    .r_main {
      width: 100%;
      display: flex;
      align-items: center;

      /deep/ .u-dropdown__menu__item {
        padding: 0 30rpx;
        color: #c7c5c5;
        border: 2rpx solid #e2e2e2;

        .u-flex {
          width: 100%;
          justify-content: space-between;
        }
      }

      /deep/ .u-dropdown__content {
        position: fixed;
        left: 0;
        width: 100vw;
        height: 100vh !important;
      }
    }
  }
}

.editor_md_box {
  margin: 40rpx 0;
}

.plate_box {
  .tit {
    margin-bottom: 20rpx;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 1;
    color: #666666;
  }

  .p_ipt {
    margin-bottom: 36rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30rpx;
    border-bottom: 2rpx solid #e2e2e2;

    .l_val {
      font-size: 28rpx;
      font-weight: 400;
      color: #333333;
    }

    .iconfont {
      font-size: 16rpx;
      color: #8e8e8e;
    }
  }
}

/deep/ .ask_title {
  border: 2rpx solid #e2e2e2;
}

// 分类 弹框
// /deep/ .u-drawer-content {
//   padding: 50rpx 30rpx 50rpx 0;
//   border-radius: 16rpx 16rpx 0 0;
//   background: #fff !important;
// }

.top_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 24rpx;
  margin-bottom: 54rpx;
  font-size: 36rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1;

  .iconfont {
    color: #999999;
  }
}

.classify_tags_box {
  display: flex;
  flex-wrap: wrap;
  height: 400rpx;
  overflow: scroll;

  .tags {
    margin-left: 40rpx;
    margin-bottom: 36rpx;
    padding: 0 24rpx;
    min-width: 104rpx;
    height: 60rpx;
    line-height: 60rpx;
    font-size: 28rpx;
    color: #c7c5c5;
    text-align: center;
    background: #f2f2f2;
    border: 2rpx solid transparent;
    flex-shrink: 0;
  }

  .active {
    color: #1462c1;
    background: #dcecff;
    border: 2rpx solid #0268fa;
  }
}

// 分类弹框 公共样式
.popup_box {
  padding: 50rpx 30rpx 50rpx 0;
  border-radius: 16rpx 16rpx 0 0;
  background: #fff !important;
}

// 板块
.channel_popup {
  .classify_tags_box {
    height: auto;
  }
}

.submitBtn {
  margin: 30rpx 30rpx;
  height: 88rpx;
  line-height: 88rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  background: #0268fa;
  border-radius: 44rpx;
}

// 支付结果查询
.pay_query {
  padding: 20rpx;
  text-align: center;

  .iconfont {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
  }

  .title {
    margin: 30rpx 0 50rpx;
    font-size: 32rpx;
    color: #333;
  }

  .btns {
    .item {
      padding: 20rpx 0;
      font-size: 28rpx;
      color: #999;
      line-height: 1;
    }

    .check {
      color: #e50404;
      border-bottom: 1rpx solid #999;
    }
  }
}
</style>
