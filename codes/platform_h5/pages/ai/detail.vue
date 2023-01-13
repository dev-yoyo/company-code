<template>
  <view class="ai_detail">
    <view class="thumbs">
      <u-swiper
        :list="info.thumb"
        :height="520"
        border-radius="0"
        mode="none"
        :circular="false"
				img-mode="aspectFit"
      ></u-swiper>
    </view>

    <view class="info_main">
      <view class="info_summary">
        <view class="money">
          <view class="pre_sale" v-if="info.is_presell === 1"> 预售 </view>

          <view class="real_money">
            <text>¥</text>
            {{ info.is_presell === 1 ? presell_price : price }}
          </view>
          <!-- <view class="del_money" v-if="info.is_presell === 1">¥{{ price }}</view> -->
        </view>

        <!-- 距离预售结束 距离预售结束 距离预售结束 距离预售结束 -->
        <view class="time_end" v-if="endTimeShow">
          <view class="l_txt">
            <i class="t-icon t-icon-E_dshou"></i>
            距离预售结束
          </view>

          <view class="r_interval">
            <view class="item">{{ leftd }}</view
            >天 <view class="item">{{ lefth }}</view
            >: <view class="item">{{ leftm }}</view
            >:
            <view class="item">{{ lefts }}</view>
          </view>
        </view>
        <!-- 距离预售结束 距离预售结束 距离预售结束 距离预售结束 -->

        <view class="title">{{ info.name }}</view>

        <view class="type_box">
          <view class="t_item">
            <view class="l_type">所属品牌：</view>
            <view class="r_txt">{{ info.brand }}</view>
          </view>
          <view class="t_item">
            <view class="l_type">主控芯片：</view>
            <view class="r_txt">{{
              info.main_controller_chip
            }}</view>
          </view>
          <view class="t_item">
            <view class="l_type">应用方向：</view>
            <view class="r_txt">{{ directions.join(",") }}</view>
          </view>
        </view>
      </view>

      <view class="info_shops">
        <view
          class="com_box shops_main"
          v-if="card_specifications.length > 0"
          @tap="cardShow = true"
        >
          <!-- 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 -->
          <view class="l_label">选择</view>
          <view class="com_right">
            <view class="choose_shops">
              <view class="r_main">
                <view class="label">板卡</view>
                <view
                  class="imgs"
                  v-for="(v, index) in card_specifications"
                  :key="v.id"
                >
                  <image :src="v.thumb" v-if="index < 4" mode="aspectFit"></image>
                </view>
                <view class="choose_count" v-if="card_specifications.length > 4"
                  >共{{ card_specifications.length }}种选择</view
                >
              </view>
            </view>

            <i class="icon iconfont icon-e-zy rigth_icon"></i>
          </view>
        </view>
        <!-- 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 板卡 -->

        <!-- 配件 配件 配件 配件 配件 配件 配件 配件 配件 配件 配件 -->
        <view
          class="com_box shops_main"
          @tap="partShow = true"
          v-if="item_parts.length > 0"
        >
          <view class="l_label">{{
            card_specifications.length > 0 ? "" : "选择"
          }}</view>
          <view class="com_right">
            <view class="choose_shops">
              <view class="r_main">
                <view class="label">配件</view>
                <view class="imgs" v-for="(v, index) in item_parts" :key="v.id">
                  <image :src="v.thumb" v-if="index < 4" mode="aspectFit"></image>
                </view>
                <view class="choose_count" v-if="item_parts.length > 4"
                  >共{{ item_parts.length }}种选择</view
                >
              </view>
            </view>

            <i class="icon iconfont icon-e-zy rigth_icon"></i>
          </view>
        </view>
        <!-- 配件 配件 配件 配件 配件 配件 配件 配件 配件 配件 配件 -->

        <!-- <view class="com_box time_main" @tap="timePopupShow = true">
          <view class="l_label">时间</view>

          <view class="com_right">
            <view class="r_main">
              <view class="time_tit">预售时间-研发时间-工厂生产</view>
              <view class="time_date">
                <i class="icon iconfont icon-a-lujing12"></i>
                产品最早{{ peoducDate }}日发货
              </view>
            </view>

            <i class="icon iconfont icon-e-zy rigth_icon"></i>
          </view>
        </view> -->

        <view class="com_box tips" @tap="tipsPopupShow = true">
          <view class="l_label">提示</view>

          <view class="com_right">
            <view class="r_main"> 商品价格为未税单价，如需开票，需加收… </view>
            <i class="icon iconfont icon-e-zy rigth_icon"></i>
          </view>
        </view>
      </view>

      <view class="btm_fixed_buy">
        <view class="cars" @tap="goShopping">
          <view>
            <i class="icon iconfont icon-e-gwc-xjh"></i>
            <u-badge
              type="error"
              :count="count"
              :overflow-count="99"
              :is-center="true"
            ></u-badge>
          </view>
          购物车
        </view>

        <view class="buy_btn" @click="buyNow"> 去购买 </view>
      </view>

      <view class="tabs_box">
        <u-tabs
          :list="tabList"
          :is-scroll="false"
          :current="tabCurrent"
          @change="tabChange"
        ></u-tabs>

        <view class="tabs_main">
          <view class="summary" v-if="tabCurrent === 0">
            <u-parse :html="html_content" v-if="html_content != ''"></u-parse>
            <lack v-else></lack>
          </view>

          <view class="summary" v-if="tabCurrent === 1">
            <u-parse :html="parameter" v-if="parameter != ''"></u-parse>
            <lack v-else></lack>
					</view>
					
					<view class="file_box" v-if="tabCurrent === 2">
					  <view v-if="item_resources.length > 0">
					    <view
					      class="item"
					      v-for="v in item_resources"
					      :key="v.id"
					      @tap="check_file"
					    >
					      <i class="t-icon iconfont t-icon-E-xqy-ysb"></i>
					      <view class="name">{{ v.name || v.title}}</view>
					    </view>
					  </view>
					
					  <lack v-else></lack>
					</view>
					
					<view class="answer_box" v-if="tabCurrent === 3">
						<view class="answer" v-if="item_questions && item_questions.length > 0">
							<view class="answer_item" v-for="(v,k) in item_questions" :key="k" 
								:style="{'margin-bottom': k==item_questions.length-1?'0':'10rpx',
								'border-width': k==item_questions.length-1?'0':'1px'}"
							>
								<view class="a_i_q">
									<text>问：</text>
									<text class="a_i_q_c">{{v.title}}</text>
								</view>
								<view class="a_i_a">
									<text>答：</text>
									<text class="a_i_a_c" v-html="v.content"></text>
								</view>
							</view>
						</view>
						<lack v-else></lack>
					</view>

          <view class="ask_box" v-if="tabCurrent === 4">
            <view class="quest_ul" v-if="questionList.length > 0">
              <view
                class="quest_li"
                v-for="(v, index) in questionList"
                :key="index"
                @tap="ask_detail(v.id)"
              >
                <view class="tit">
                  <text class="reward" v-if="v.type == 1">【悬赏】</text>
                  <text class="share" v-if="v.type == 2">【分享】</text>
                  {{ v.title }}
                </view>

                <view class="btm_info">
                  <view class="info_tags">
                    <view
                      class="q_tags"
                      v-for="(val, idx) in v.content_tags"
                      :key="idx"
                    >
                      <view class="tags"> {{ val.name }} </view>
                    </view>

                    <image
                      class="jing"
                      src="/static/common/img/jing_n.png"
                      v-if="v.elite == 1"
                    />
                    <image
                      class="hottest"
                      :src="'/static/common/img/hot' + v.hot_level + '.png'"
                      v-if="v.hot_level != 0"
                    />
                  </view>

                  <view
                    class="reply_count"
                    :class="v.best_reply_id != 0 ? 'take' : ''"
                  >
                    <!-- <i class="icon iconfont icon-e-dg3"></i> -->
                    <text>{{ v.reply_count }}</text>
                    <i class="icon iconfont icon-e-pli"></i>
                  </view>

                  <view
                    class="top"
                    v-if="v.display_order == 1 && contentType == 100"
                  >
                    置顶
                  </view>
                </view>
              </view>
            </view>

            <lack v-else></lack>
          </view>
        </view>
      </view>
    </view>

    <!-- 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 -->

    <!-- 板卡 -->
    <u-popup
      v-model="cardShow"
      mode="bottom"
      border-radius="16"
      :mask-close-able="true"
    >
      <view class="card_popup">
        <view class="top_tit">
          <view class="l_imgs">
            <image :src="active_card_img" mode="aspectFit"></image>
            <view class="money"> <text>¥</text> {{ active_card_money }}</view>
          </view>
          <i class="icon iconfont icon-e-qx41" @click="cardShow = false"></i>
        </view>

        <view class="choose_tit">选择板卡</view>

        <view class="card_main">
          <view class="cards">
            <view
              class="c_item"
              :class="index === activeCardIndex ? 'active' : ''"
              v-for="(v, index) in card_specifications"
              :key="v.id"
              @tap="check_card(v, index)"
            >
              <image :src="v.thumb" mode="aspectFit"></image>
              <view class="txt">{{ v.name }}</view>
            </view>
          </view>

          <view class="count_box">
            <view class="l_box">
              购买数量
              <view class="inv">库存 {{ card_inv_val }}件</view>
            </view>

            <u-number-box
              v-model="card_choose_inv"
              :min="1"
              :max="card_inv_val"
              @change="cardInvChange"
            ></u-number-box>
          </view>

          <view class="but_btns">
            <view
              class="btns"
              @tap="(type = 'card'), $u.throttle(add_card, 2000)"
            >
              加入购物车
            </view>
            <view
              class="btns buy_car"
              @tap="(type = 'card'), $u.throttle(buy_car, 2000)"
            >
              立即购买
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 配件 -->
    <u-popup
      v-model="partShow"
      mode="bottom"
      border-radius="16"
      :mask-close-able="true"
    >
      <view class="card_popup">
        <view class="top_tit">
          <view class="l_imgs">
            <image :src="active_part_img" v-if="activePartIndex !== ''"></image>
            <view class="money" v-if="activePartIndex !== ''">
              <text>¥</text> {{ active_part_money }}</view
            >
          </view>
          <i class="icon iconfont icon-e-qx41" @click="partShow = false"></i>
        </view>

        <view class="choose_tit">选择配件</view>

        <view class="card_main">
          <view class="cards">
            <view
              class="c_item"
              :class="index === activePartIndex ? 'active' : ''"
              v-for="(v, index) in item_parts"
              :key="v.id"
              @tap="check_part(v, index)"
              :disabled="v.store <= 0"
            >
              <image :src="v.thumb" mode="aspectFit"></image>
              <view class="txt">{{ v.name }}</view>
            </view>
          </view>

          <view class="count_box">
            <view class="l_box">
              购买数量
              <view class="inv">库存 {{ part_inv_val }}件</view>
            </view>

            <u-number-box
              v-model="part_choose_inv"
              :min="1"
              :max="part_inv_val"
              @change="partInvChange"
            ></u-number-box>
          </view>

          <view class="but_btns">
            <view
              class="btns"
              @tap="(type = 'part'), $u.throttle(add_card, 2000)"
            >
              加入购物车
            </view>
            <view
              class="btns buy_car"
              @tap="(type = 'part'), $u.throttle(buy_car, 2000)"
            >
              立即购买
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 时间 -->
    <u-popup
      v-model="timePopupShow"
      mode="bottom"
      border-radius="16"
      :mask-close-able="true"
    >
      <view class="time_popup">
        <view class="top_tit">
          <text>时间</text>

          <i
            class="icon iconfont icon-e-qx41"
            @click="timePopupShow = false"
          ></i>
        </view>

        <view class="time_main">
          <view class="time_li">
            <view class="l_icon">
              <i class="t-icon t-icon-E-xqy-yssj"></i>
              预售时间
            </view>

            <view class="r_txt">
              {{ info.presell_start_date }} - {{ info.presell_end_date }}
            </view>
          </view>

          <view class="time_li">
            <view class="l_icon">
              <i class="t-icon t-icon-E-xqy-yfjd"></i>
              研发阶段
            </view>

            <view class="r_txt">
              {{ info.develop_start_date }} - {{ info.develop_end_date }}
            </view>
          </view>

          <view class="time_li">
            <view class="l_icon">
              <i class="t-icon t-icon-E-xqy-gcsc"></i>
              工厂生产
            </view>

            <view class="r_txt">
              {{ info.production_start_date }} - {{ info.production_end_date }}
            </view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 提示 -->
    <u-popup
      v-model="tipsPopupShow"
      mode="bottom"
      border-radius="16"
      :mask-close-able="true"
    >
      <view class="time_popup">
        <view class="top_tit">
          <text>提示</text>

          <i
            class="icon iconfont icon-e-qx41"
            @click="tipsPopupShow = false"
          ></i>
        </view>

        <view class="tips_main">
          商品价格为未税单价，如需开票，需加收13%个税点，
          社区所有商品均不包邮，默认发顺丰航空件。
          成交价格有可能会上下浮动，交易以当天成交价为准。
          一经售出，无质量问题不予退换！
        </view>
      </view>
    </u-popup>

    <login></login>
  </view>
</template>

<script>
import { authStatus, getDate, intervalTime } from "@/common/hooks.js";
import marked from "@/components/marked";

export default {
  data() {
    return {
      id: "", // 详情 id
      info: {},
      html_content: "", // 产品介绍
      parameter: "", // 参数
      item_resources: [], // 资料列表
      item_questions: [], // 常见问题
      questionList: [], // 技术答疑
      count: 0,
      timePopupShow: false, // 时间进度
      tipsPopupShow: false, // 提示
      cardShow: false, // 板卡
      partShow: false, // 配件

      card_specifications: [], // 板卡
      item_parts: [], // 配件
      directions: [], // 应用方向
      presell_price: "", // 预售价格
      price: "", // 价格

      active_card_img: "", // 板卡
      active_card_money: "",
      activeCardIndex: 0,
      card_inv_val: 0, // 库存数量
      card_choose_inv: 1, // 选择的数量

      active_part_img: "", // 配件
      active_part_money: "",
      activePartIndex: "",
      part_inv_val: 0, // 库存数量
      part_choose_inv: 1, // 选择的数量

      endTimeShow: false, // 预售是否 结束
      inter: "", // 倒计时
      leftd: "00", // 预售倒计时
      lefth: "00", // 预售倒计时
      leftm: "00", // 预售倒计时
      lefts: "00", // 预售倒计时
      peoducDate: "", //  产品最早发货时间

      tabCurrent: 0,
      tabList: [
        {
          name: "介绍",
        },
        {
          name: "参数",
        },
        {
          name: "资料",
        },
        {
          name: "问题",
        },
        {
          name: "答疑",
        },
      ],
    };
  },
  onLoad: function (option) {
    // this.id = option.id;
    this.id = this.$Route.query.id;
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.$u.api
        .getAiDetail({
          id: this.id,
        })
        .then((res) => {
          const {
            code,
            data: { info, questionList, count },
          } = res;
          // console.log("detail >>>>", info, count);

          if (code === 200) {
            this.info = info;
            this.count = count;
            this.questionList = questionList;
            this.item_resources = info.item_resources;
            this.parameter = info.parameter;
            this.item_questions = info.item_questions;
            this.item_parts = info.item_parts;
            this.html_content = info.details_html?marked(info.details_html):'';
            this.parameter = info.parameter?marked(info.parameter):'';

            // 板卡
            if (info.cards) {
              this.card_specifications = info.cards.card_specifications;
              let cards = info.cards.card_specifications;
              if (cards.length > 0 && cards.length == 1) {
                this.check_card(cards[0], 0, true);
              }
							if(cards.length > 1){
								this.check_card(cards[0], 0, true);
								this.presell_price = info.price_range;
								this.price = info.price_range;
							}
            } else if (info.item_parts.length > 0) {
              this.check_part(info.item_parts[0], 0, true);
            }

            let time = getDate(info.production_end_date);
            this.peoducDate = `${time.m}月${time.d}日`;
						if(info.presell_end_date){
							this.startInter(info.presell_end_date);
						}

            let arr = [];
            info.item_use_directions.map((e) => {
              arr.push(e.name);
            });
            this.directions = arr;
          }
        });
    },
    // 倒计时
    startInter(end_date) {
      this.inter = setInterval(() => {
        let time = intervalTime(end_date);
        if (time) {
          this.leftd = time.d;
          this.lefth = time.h;
          this.leftm = time.m;
          this.lefts = time.s;
          this.endTimeShow = true;
        } else {
          clearInterval(this.inter);
        }
      }, 1000);
    },

    // 选择板卡
    check_card(v, index, first = false) {
      if (!first) {
        if (v.store <= 0) {
          this.$u.toast("库存不足");
          return;
        }
      }

      // console.log("选择板卡 >>>", v);
      this.presell_price = v.presell_price;
      this.price = v.price;
      this.active_card_img = v.thumb;
      this.active_card_money =
        this.info.is_presell == 1 ? v.presell_price : v.price;
      this.activeCardIndex = index;
      this.card_inv_val = v.store;
      this.card_choose_inv = v.store > 0 ? 1 : 0;
    },
    cardInvChange(e) {
      // console.log("当前值为: " + e.value);
      this.card_choose_inv = e.value;
    },

    // 选择 配件
    check_part(v, index, first = false) {
      if (!first) {
        if (v.store <= 0) {
          this.$u.toast("库存不足");
          return;
        }
      }

      // console.log("选择配件 >>>", v);
      this.presell_price = v.price;
      this.active_part_img = v.thumb;
      this.active_part_money = v.price;
      this.activePartIndex = index;
      this.part_inv_val = v.store;
      this.part_choose_inv = v.store > 0 ? 1 : 0;
    },
    partInvChange(e) {
      // console.log("当前值为: " + e.value);
      this.part_choose_inv = e.value;
    },

    // 加入购物车
    add_card() {
      if (!authStatus()) return;
      this.shopping(this.type);
    },
    buy_car() {
      if (!authStatus()) return;
      this.shopping(this.type, "buy");
    },
    // 添加 、立即购买
    async shopping(type, from) {
      // console.log("type >>", type);
      let params;
      if (type == "card") {
        if (this.card_specifications[this.activeCardIndex].store <= 0) {
          this.$u.toast("库存不足");
          return;
        }

        params = {
          type: "card_specification",
          shop_id: this.card_specifications[this.activeCardIndex].id,
          num: this.card_choose_inv,
          id: "",
          from,
          item_id: this.info.id,
        };
      } else {
        if (this.activePartIndex === "") {
          this.$u.toast("请选择配件");
          return;
        }

        if (this.item_parts[this.activePartIndex].store <= 0) {
          this.$u.toast("库存不足");
          return;
        }

        params = {
          type: "part",
          shop_id: this.item_parts[this.activePartIndex].id,
          num: this.part_choose_inv,
          id: "",
          from,
          item_id: this.info.id,
        };
      }

      await this.$u.api.shoppingCars(params).then((res) => {
        const {
          code,
          data: { current_id, msg },
        } = res;
        if (code === 200) {
          this.cardShow = false;
          this.$u.toast(msg);
          this.init();

          // 立即购买 跳转
          if (from) {
            this.$Router.push({
              path: "/shopping_cars",
              query: { current_id },
            });
          }
        } else if (code === 422) {
          this.$u.toast({
            title: msg,
            icon: "none",
          });
        }
      });
    },
    buyNow() {
      if (this.card_specifications.length > 0) {
        this.cardShow = true;
      } else {
        this.partShow = true;
      }
    },
    // 跳转 购物车
    goShopping() {
      if (!authStatus()) return;

      this.$Router.push({
        name: "shopping_car",
      });
    },
    check_file() {
      this.$u.toast("请前往www.ebaina.com PC端查看资料");
    },

    // tabs通知swiper切换
    tabChange(index) {
      this.tabCurrent = index;
    },
    ask_detail(id) {
      this.$Router.push({
        name: "ask_detail",
        params: { id },
      });
    },
    onHide() {
      clearInterval(this.inter);
    },
  },
};
</script>

<style lang="scss" scoped>
.ai_detail {
  padding-bottom: 174rpx;

  .thumbs {
    width: 100%;
    //   height: 750rpx;
  }
}

// 硬件详情信息  money title type
.info_main {
  padding: 16rpx;

  // 信息介绍
  .info_summary {
    padding: 26rpx 24rpx 6rpx;
    background-color: #fff;

    .money {
      display: flex;
      align-items: center;
      line-height: 1;

      .pre_sale {
        width: 62rpx;
        height: 36rpx;
        line-height: 36rpx;
        font-size: 22rpx;
        color: #ffffff;
        text-align: center;
        background: #ff9e2c;
        border-radius: 4rpx;
      }

      .real_money {
        margin: 0 12rpx;
        font-size: 44rpx;
        font-weight: 600;
        color: #e50404;

        text {
          font-size: 28rpx;
        }
      }

      .del_money {
        font-size: 28rpx;
        font-weight: 400;
        color: #999999;
        text-decoration: line-through;
      }
    }

    // 预售结束时间
    .time_end {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 36rpx 0 28rpx;
      padding: 20rpx 24rpx;
      font-size: 26rpx;
      font-weight: 600;
      color: #333333;
      background: #e2f0ff;

      .l_txt {
        display: flex;
        align-items: center;
        line-height: 1;

        .t-icon {
          margin-right: 8rpx;
        }
      }

      .r_interval {
        display: flex;
        align-items: center;

        .item {
          margin: 0 10rpx;
          width: 44rpx;
          height: 44rpx;
          line-height: 44rpx;
          font-size: 26rpx;
          font-weight: 600;
          color: #333333;
          text-align: center;
          background: #ffffff;
          border-radius: 6rpx;
        }
      }
    }

    .title {
      margin-bottom: 25rpx;
      font-size: 30rpx;
      font-weight: 600;
      line-height: 42rpx;
      color: #333333;
    }

    .type_box {
      display: flex;
      flex-wrap: wrap;

      .t_item {
        display: flex;
        margin-bottom: 20rpx;
        width: 100%;

        .l_type {
          font-size: 26rpx;
          color: #999999;
          flex-shrink: 0;
        }

        .r_txt {
          font-size: 26rpx;
          color: #333333;
        }
      }
    }
  }

  // 选择商品  商品提示
  .info_shops {
    margin: 20rpx 0;
    padding: 30rpx 24rpx;
    background-color: #fff;
    border-radius: 8rpx;

    .com_box {
      display: flex;
      margin-bottom: 30rpx;

      .l_label {
        width: 52rpx;
        font-size: 26rpx;
        font-weight: 400;
        line-height: 1;
        color: #999999;
        flex-shrink: 0;
      }

      .com_right {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-left: 30rpx;
        width: 100%;

        .rigth_icon {
          font-size: 19rpx;
          color: #8e8e8e;
          flex-shrink: 0;
        }
      }
    }

    .shops_main {
      align-items: center;

      .r_main {
        display: flex;
        align-items: center;
        // width: 565rpx;
        // margin-right: 22rpx;
      }

      .choose_shops {
        display: flex;
        align-items: center;

        .label {
          margin-right: 20rpx;
          font-size: 28rpx;
          line-height: 1;
          color: #333333;
          flex-shrink: 0;
        }

        .imgs {
          display: flex;
          align-items: center;

          image {
            margin-right: 24rpx;
            width: 56rpx;
            height: 56rpx;
            border: 2rpx solid #eaeaea;
          }
        }

        .choose_count {
          //   padding: 0 13rpx;
          width: 146rpx;
          height: 56rpx;
          line-height: 56rpx;
          background: #f4f4f4;
          font-size: 24rpx;
          font-weight: 400;
          color: #999999;
          text-align: center;
        }
      }
    }

    .time_main {
      .time_tit {
        margin-bottom: 12rpx;
        font-size: 28rpx;
        color: #333333;
        line-height: 1;
      }

      .time_date {
        font-size: 24rpx;
        font-weight: 400;
        line-height: 1;
        color: #666666;

        .iconfont {
          margin-right: 10rpx;
          font-size: 21rpx;
          color: #333333;
        }
      }
    }

    .tips {
      align-items: center;
      line-height: 1;

      .r_main {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
        overflow: hidden;

        width: 100%;
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
        line-height: 1;
        white-space: nowrap;
      }
    }
  }
}

// 底部购买固定按钮
.btm_fixed_buy {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 174rpx;
  background: #ffffff;
  box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
  z-index: 1;

  .cars {
    position: relative;
    width: 80rpx;
    font-size: 20rpx;
    font-weight: 400;
    // line-height: 28rpx;
    color: #666666;
    text-align: center;

    .iconfont {
      margin-bottom: 10rpx;
    }
  }

  .buy_btn {
    margin-left: 50rpx;
    width: 566rpx;
    height: 88rpx;
    line-height: 88rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
    text-align: center;
    background: #0268fa;
    border-radius: 48rpx;
  }
}

.tabs_box {
  background-color: #fff;

  .tabs_main {
    padding: 20rpx;
    background-color: #fff;

    .file_box {
      .item {
        padding: 10rpx 20rpx;
        display: flex;
        align-items: center;

        .t-icon {
          margin-right: 10rpx;
        }

        .name {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          word-break: break-all;

          font-size: 32rpx;
          font-weight: 600;
          color: #666;
        }
      }
    }

    .ask_box {
      .quest_ul {
        .quest_li {
          position: relative;
          margin-bottom: 2rpx;
          padding: 28rpx 30rpx;
          background: #fff;
          overflow: hidden;

          .tit {
            margin-bottom: 18rpx;
            font-size: 32rpx;
            font-weight: 600;
            line-height: 44rpx;
            color: #333333;
            word-break: break-all;

            .reward {
              color: #ffb612;
            }

            .share {
              color: #0268fa;
            }
          }

          .btm_info {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .info_tags {
              display: flex;

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

              .jing {
                margin-right: 12rpx;
                width: 44rpx;
                height: 32rpx;
              }

              .hottest {
                width: 46rpx;
                height: 32rpx;
              }
            }

            .reply_count {
              font-size: 28rpx;
              font-weight: 400;
              color: #999999;

              text {
                margin: 0 8rpx;
              }

              .icon-e-dg3 {
                display: none;
              }
            }

            .take {
              color: #0268fa !important;

              .icon-e-dg3 {
                display: inline-block;
              }
            }
          }

          .top {
            position: absolute;
            top: -50rpx;
            right: -50rpx;
            transform: rotate(45deg);
            width: 100rpx;
            height: 100rpx;
            line-height: 160rpx;
            font-size: 24rpx;
            font-weight: 600;
            color: #fff;
            text-align: center;
            background: #ffbb00;
          }
        }
      }
    }
		
		.answer_box{
			color: #999;
			.answer{
				.answer_item{
					background: #fff;
					padding: 20rpx;
					border-bottom: 1px solid #eee;
					.a_i_q{
						display: flex;
						.a_i_q_c{
							color: #333;
							overflow: hidden;
							text-overflow: ellipsis;
							white-space: nowrap;
							flex: 1;
						}
					}
					.a_i_a{
						margin-top: 10rpx;
						display: flex;
						overflow: hidden;
						.a_i_a_c{
							color: #666;
							flex: 1;
						}
					}
					// .ask_q{
					// 	width: 60rpx;
					// 	border: 1px solid red;
					// }
				}
			}
		}

    .summary {
      /deep/ img {
        width: 100% !important;
      }
    }
  }
}
// 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框 弹框

// 弹框顶部标题样式
.top_tit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 64rpx;
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
  line-height: 1;

  .iconfont {
    font-size: 32rpx;
    color: #999999;
  }
}

// time 弹框
.time_popup {
  padding: 30rpx 40rpx;
  background: #fff;
  height: 572rpx;

  .time_main {
    .time_li {
      display: flex;
      align-items: center;
      margin-bottom: 60rpx;
      justify-content: space-between;
      line-height: 1;

      .l_icon {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        font-weight: 400;
        color: #666666;

        .t-icon {
          margin-right: 18rpx;
        }
      }

      .r_txt {
        font-size: 28rpx;
        font-weight: 400;
        color: #333333;
      }
    }
  }
}

// 提示
.tips_main {
  font-size: 28rpx;
  font-weight: 400;
  line-height: 56rpx;
  color: #666666;
}

// 板卡弹框
.card_popup {
  padding: 26rpx 40rpx 60rpx;
  overflow: hidden;

  .top_tit {
    margin-bottom: 0;
    padding-bottom: 26rpx;
    align-items: flex-start;
    border-bottom: 2rpx solid #f2f2f2;

    .l_imgs {
      display: flex;
      align-items: center;

      image {
        margin-right: 18rpx;
        width: 120rpx;
        height: 120rpx;
      }

      .money {
        font-size: 40rpx;
        font-weight: 600;
        color: #e50404;

        text {
          font-size: 28rpx;
        }
      }
    }
  }

  .choose_tit {
    margin: 16rpx 0;
    font-size: 28rpx;
    font-weight: 400;
    line-height: 1;
    color: #333333;
  }

  .card_main {
    .cards {
      display: flex;
      flex-wrap: wrap;
      .c_item {
        margin: 0 24rpx 30rpx 0;
        padding-right: 20rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        line-height: 1;
        border: 2rpx solid transparent;
        background: #f6f6f6;

        image {
          margin-right: 20rpx;
          width: 68rpx;
          height: 68rpx;
        }
        .txt {
          font-size: 24rpx;
          font-weight: 400;
          color: #333333;
        }
      }

      .active {
        background: #dceefe;
        border: 2rpx solid #005ef4;
      }

      .disable {
        background: #f6f6f6;
        color: #c7c5c5;
      }
    }

    .count_box {
      margin-top: 10rpx;
      padding: 54rpx 0 70rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2rpx solid #f2f2f2;

      .l_box {
        display: flex;
        align-items: center;
        font-size: 28rpx;
        font-weight: 400;
        line-height: 1;
        color: #333333;

        .inv {
          margin-left: 22rpx;
          font-size: 22rpx;
          font-weight: 400;
          line-height: 1;
          color: #999999;
        }
      }
    }

    .but_btns {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 48rpx;
      overflow: hidden;
      height: 96rpx;
      line-height: 96rpx;
      text-align: center;

      .btns {
        width: 100%;
        height: 100%;
        font-size: 32rpx;
        font-weight: 600;
        color: #ffffff;
        background: #010101;
      }

      .buy_car {
        background: #0268fa;
      }
    }
  }
}
</style>
