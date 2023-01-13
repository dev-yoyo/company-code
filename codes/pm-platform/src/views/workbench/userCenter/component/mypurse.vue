<template>
  <div class="info">
    <div class="title" v-if="ceriStatus != '审核通过'" :style="ceriStatus == '审核失败'?{height:'0'}:''">
      <svg v-show="ceriStatus == '待审核'" class="icon" aria-hidden="true"
        style="display: inline-block; margin: 0 10px; font-size: 40px">
        <use xlink:href="#icon-grrz-wdqb-rz"></use>
      </svg>
      <p v-show="ceriStatus == '待审核'" style="color: #666;width: 9rem;">
        为了保证您的资金账户安全，请尽快完成
        <span style="color: #333;font-weight: 700;">实名认证</span>
        ，否则您的账户余额体现将受到限制
      </p>
      <p v-if="ceriStatus == '待审核'" class="goProve" @click="toAuth">去认证</p>
    </div>
    <main class="main">
      <section class="section">
        <div class="card_title">资金总览</div>
        <div class="card_box">
          <div class="card" >
            <img v-if="!wallet.money_info" :src="bg5" alt="" />
            <img v-if="wallet.money_info" :src="wallet.money_info.total_money ? bg1 : bg5" alt="" />
            <span class="cardName">可提现金额</span>
            <span class="cardRules">
              <svg class="icon" aria-hidden="true" style="display: inline-block; margin: 0 2px; font-size: 14px">
                <use xlink:href="#icon-grrz-txgz"></use>
              </svg>
              <el-tooltip class="item" effect="dark" placement="bottom-start">
                <div slot="content">
                  <div class="intro">
                    <h4>提现规则</h4>
                    <p>1.可提现收益是由冻结收入中释放出来的金额，每天仅可提现一次</p>
                    <p>2.收益提现需要先进行实名认真，目前仅支持提现到银行卡</p>
                    <p>3.提现到一行卡，提现金额将会在T+1个工作日入账（部分银行时间会延长）</p>
                  </div>
                </div>
                <span>提现规则</span>
              </el-tooltip>

            </span>
            <span class="cardValue">
              <span style="font-size: 16px">￥</span>
              <span v-if="wallet.money_info">{{ wallet.money_info.total_money }}</span>
            </span>
            <span @click="transfer('申请提现', wallet.money_info.total_money)" class="cardText">申请提现</span>
          </div>
          <div class="card">
            <img :src="bg2" alt="" />
            <span class="cardName">累计提现金额</span>
            <span class="cardValue">
              <span style="font-size: 16px">￥</span>
              <span v-if="wallet.money_info">{{ wallet.money_info.total_out_money }}</span>
            </span>
          </div>
          <div class="card">
            <img :src="bg2" alt="" />
            <span class="cardName">总收益</span>
            <span class="cardRules">
              <svg class="icon" aria-hidden="true" style="display: inline-block; margin: 0 2px; font-size: 14px">
                <use xlink:href="#icon-grrz-txgz"></use>
              </svg>

              <el-tooltip class="item" effect="dark" placement="bottom-start">
                <div slot="content">
                  <div class="intro">
                    <h4>收益说明</h4>
                    <p>当前可提现余额与累计提现金额的总和</p>
                  </div>
                </div>
                <span>收益说明</span>
              </el-tooltip>
            </span>
            <span class="cardValue">
              <span style="font-size: 16px">￥</span>
              <span v-if="wallet.money_info">{{ wallet.money_info.total_in_money }}</span>
            </span>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="card_title">冻结资金</div>
        <div class="card_box">
          <div class="card" style="margin-right: 40px">
            <img v-if="!wallet.margin_info" :src="bg3" alt="" />
            <img v-if="wallet.margin_info" :src="wallet.margin_info.money ? bg6 : bg3" alt="" />
            <span class="cardName">保证金</span>
            <span class="cardRules">
              <svg class="icon" aria-hidden="true" style="display: inline-block; margin: 0 2px; font-size: 14px">
                <use xlink:href="#icon-grrz-txgz"></use>
              </svg>

              <el-tooltip class="item" effect="dark" placement="bottom-start">
                <div slot="content">
                  <div class="intro">
                    <h4>保证金说明</h4>
                    <p>1.用户缴纳的保证金会冻结在平台，项目结束/终止后可提取，研发中的项目保证金不可提现</p>
                    <p>2.保证金仅支持银行卡提现</p>
                    <p>3.保证金金额为所有项目保证金的总和</p>
                  </div>
                </div>
                <span>保证金说明</span>
              </el-tooltip>
            </span>
            <span class="cardValue">
              <span style="font-size: 16px">￥</span>
              <span v-if="wallet.margin_info">{{ wallet.margin_info.money }}</span>
            </span>
            <span @click="transfer('申请提取', wallet.margin_info.money)" class="cardText">申请提取</span>
            <span class="cardStages" v-if="wallet.margin_info && !wallet.margin_info.count">
              <span v-if="wallet.margin_info" style="font-size: 16px; color: #1b385c">{{
                wallet.margin_info.count || 0
              }}</span>
              <span style="font-size: 12px; color: #666">&nbsp;笔</span>
            </span>
            <el-tooltip placement="bottom-start" v-if="wallet.margin_info && wallet.margin_info.count">
              <div slot="content">
                <div class="tips">
                  <div class="item" v-if="margin_infoLog && margin_infoLog.ongoing.length">
                    <div class="item_title">进行中</div>
                    <div class="item_data" v-for="(v, k) in margin_infoLog.ongoing" :key="k">
                      <p>{{ v.project.name }}</p>
                      <p>{{ v.money }}</p>
                    </div>
                  </div>
                  <div class="item" v-if="margin_infoLog && margin_infoLog.ending.length">
                    <div class="item_title">已结束</div>
                    <div class="item_data" v-for="(v, k) in margin_infoLog.ending" :key="k">
                      <p>{{ v.project.name }}</p>
                      <p>{{ v.money }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <span class="cardStages">
                <span v-if="wallet.margin_info" style="font-size: 16px; color: #1b385c">{{
                  wallet.margin_info.count || 0
                }}</span>
                <span style="font-size: 12px; color: #666">&nbsp;笔</span>
              </span>
            </el-tooltip>
          </div>
          <div class="card" style="margin-right: 40px">
            <img :src="bg4" alt="" />
            <span class="cardName">收入冻结</span>
            <span class="cardRules">
              <svg class="icon" aria-hidden="true" style="display: inline-block; margin: 0 2px; font-size: 14px">
                <use xlink:href="#icon-grrz-txgz"></use>
              </svg>

              <el-tooltip class="item" effect="dark" placement="bottom-start">
                <div slot="content">
                  <div class="intro">
                    <h4>冻结说明</h4>
                    <p>1.用户报名成功后，该项目的项目费用将会冻结在收入中</p>
                    <p>2.平台会按照协议规定的时间分期/一次性结算金额到可提现金额中</p>
                    <p>3.收入金额为所参与的项目费用的总和</p>
                  </div>
                </div>
                <span>冻结说明</span>
              </el-tooltip>
            </span>
            <span class="cardValue">
              <span style="font-size: 16px">￥</span>
              <span v-if="wallet.margin_info">{{ wallet.frozen_info.money }}</span>
            </span>
            <span class="cardStages" v-if="wallet.frozen_info && !wallet.frozen_info.count">
              <span v-if="wallet.margin_info"
                style="font-size: 16px; color: #1b385c">{{ wallet.frozen_info.count }}</span>
              <span style="font-size: 12px; color: #666">&nbsp;笔</span>
            </span>
            <el-tooltip placement="bottom-start" v-if="wallet.frozen_info && wallet.frozen_info.count">
              <div slot="content">
                <div class="tips">
                  <div class="item" v-if="frozen_infoLog && frozen_infoLog.ongoing.length">
                    <div class="item_title">进行中</div>
                    <div class="item_data" v-for="(v, k) in frozen_infoLog.ongoing" :key="k">
                      <p>{{ v.project.name }}</p>
                      <p>{{ v.money }}</p>
                    </div>
                  </div>
                  <div class="item" v-if="frozen_infoLog && frozen_infoLog.ending.length">
                    <div class="item_title">已结束</div>
                    <div class="item_data" v-for="(v, k) in frozen_infoLog.ending" :key="k">
                      <p>{{ v.project.name }}</p>
                      <p>{{ v.money }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <span class="cardStages">
                <span v-if="wallet.margin_info"
                  style="font-size: 16px; color: #1b385c">{{ wallet.frozen_info.count }}</span>
                <span style="font-size: 12px; color: #666">&nbsp;笔</span>
              </span>
            </el-tooltip>
          </div>
        </div>
      </section>
      <el-dialog title="提取申请" :visible.sync="dialog1" width="576px">
        <div class="dialog_box">
          <div class="dialog">
            <div class="item" v-if="margin_infoLog && margin_infoLog.ending.length" style="border-width: 1px">
              <div class="item_title">已结束</div>
              <div class="item_data" v-for="(v, k) in margin_infoLog.ending" :key="k">
                <p style="color:#333">{{ v.project.name }}</p>
                <p style="color:#333">{{ v.money }}</p>
              </div>
            </div>
            <div class="item" v-if="margin_infoLog && margin_infoLog.ongoing.length" style="border-width: 0px">
              <div class="item_title">研发中（不可提现）</div>
              <div class="item_data" v-for="(v, k) in margin_infoLog.ongoing" :key="k">
                <p style="color:#999">{{ v.project.name }}</p>
                <p style="color:#999">{{ v.money }}</p>
              </div>
            </div>
          </div>
          <div>
            <div>可提现金额：<span class="totalQuota" v-if="wallet.margin_info">{{
              '￥'+ wallet.margin_info.money_withdraw
            }}</span></div>
            <div style="margin-top: 20px">
              <span>提现方式：</span>
              <span style="color: #409EFF;margin-left:15px;">提现到银行卡</span>
              <!-- <el-radio-group v-model="payWay">
                <el-radio v-for="(v,k) in ['提现到银行卡']" :label="v" :key="k">{{v}}</el-radio>
              </el-radio-group> -->
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog1 = false">取 消</el-button>
          <el-button type="primary" @click="ensure">确 认</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提现申请" :visible.sync="dialog2" width="520px">
        <div class="dialog_box">
          <div>
            <div style="margin-top: 10px">
              <span>提现方式：</span>
              <span style="color: #409EFF;margin-left:15px;">提现到银行卡</span>
              <!-- <el-radio-group v-model="payWay">
                <el-radio v-for="(v,k) in ['提现到银行卡']" :label="v" :key="k">{{v}}</el-radio>
              </el-radio-group> -->
            </div>
            <div style="margin-top:30px;">
              <span>提现金额：</span>
              <el-input type="number" @input="monitor" v-model="money" placeholder="100.00" size="mini"
                style="width: 120px;"></el-input>
              <span>&nbsp;元</span>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog2 = false">取 消</el-button>
          <el-button type="primary" @click="withdraw">确 认</el-button>
        </span>
      </el-dialog>
    </main>
    <footer class="foot_tab">
      <el-tabs v-model="activeName">
        <el-tab-pane label="提现记录" name="first">
          <el-table :data="withdrawal_logs"  stripe class="money-record" border>
            <el-table-column prop="created_at" label="申请时间" min-width="140"></el-table-column>
            <el-table-column prop="money" label="提现金额" min-width="100"></el-table-column>
            <el-table-column label="金额类型" min-width="100">
              <template slot-scope="scope">{{ scope.row.from_type == 'money' ? '收益' : '保证金' }}</template>
            </el-table-column>
            <el-table-column label="到账凭证" min-width="80">
              <template slot-scope="scope">
                <div>
                  <el-image 
                    :src="scope.row.pic" 
                    class="show_img"
                    :preview-src-list="scope.row.picArr">
                  </el-image>
                </div>
              </template>
            </el-table-column>
            
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="收益记录" name="second">
          <el-table :data="money_in_logs"  stripe class="money-record" border>
            <el-table-column prop="created_at" label="入账时间" min-width="160"></el-table-column>
            <el-table-column prop="project.name" label="项目名称" min-width="160"></el-table-column>
            <el-table-column prop="money" label="提现金额" min-width="160"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </footer>
  </div>
</template>

<script>
import { getData, postData } from "@/api/user";
export default {
  name: "personalauth",
  data() {
    return {
      bg1: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/bg1.png',
      bg2: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/bg2.png',
      bg3: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/bg3.png',
      bg4: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/bg4.png',
      bg5: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/bg5.png',
      bg6: 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/dev/direct/resource/202211/22/person/bg6.png',
      activeName: "first",
      dialog1: false,
      dialog2: false,
      payWay: '银行卡',
      money: '',
      totalQuota: 0,
      wallet: {},
      withdrawal_logs: [
        // {
        //   created_at:'41132',
        //   money:'666',
        //   from_type:'money',
        //   pic:'https://ebaina.oss-cn-hangzhou.aliyuncs.com/res/images/dev/202301/05/BhAQk4TiBK8ufIvzKdNzIkJdz7dyIVvzBLQ6Wujj.webp'
        // },
      ],
      money_in_logs: [],
      margin_infoLog: '',
      frozen_infoLog: '',
      ceriStatus: '待审核'
    };
  },
  created() {
  
    this.init();
    this.withdrawLog();
    this.incomeLog();
    this.getUserStatus()
    let num = 0;
    if (this.margin_infoLog && this.margin_infoLog.ending) {
      this.margin_infoLog.ending.map(i => num += i.project.price * 1);
    }
    this.totalQuota = num;
  },
  methods: {
    toAuth() {
      this.$emit("auth", {});
    },
    // 获取用户认证状态
    getUserStatus() {
      let url = '/user/user_certification/index';
      getData({ url }).then(res => {
        if (res.code == 200 && res.data.info != null) {
          this.ceriStatus = res.data.user_info.status
        }
      })
    },
    init() {
      let url = '/user/wallet/index';
      getData({ url }).then(res => {
        this.wallet = res.data;
        this.margin_infoLog = res.data.margin_info.logs;
        this.frozen_infoLog = res.data.frozen_info.logs;
      })
    },
    transfer(v, price) {
      if (!price) {
        this.$err('无可提现金额！');
        return
      }
      if (this.ceriStatus != '审核通过') {
        this.$err('请先完成实名认证！')
        return false
      }
      if (v == '申请提取') {
        this.dialog1 = true
      } else {
        this.dialog2 = true
      }
    },
    ensure() {
      if (!this.wallet.margin_info.money_withdraw) {
        this.$err('不存在可提现的保证金')
        return
      }
      if (!this.payWay) {
        this.$err('请选择提现方式！')
        return
      }
      let url = '/user/wallet/withdrawal_margin';
      let way = this.payWay.includes('支付宝') ? '支付宝' : '银行卡';
      let data = { type: way };
      postData({ url, data }).then(res => {
        if (res.code == 200) {
          this.$success(res.data.msg)
          this.init();
          this.withdrawLog()
          this.incomeLog()
        }
      })
      this.dialog1 = false
    },
    withdraw() {
      if (!this.payWay) {
        this.$err('请选择提现方式！')
        return
      }
      if (!this.money) {
        this.$err('请输入提现金额！')
        return
      }
      if (this.money == 0) {
        this.$err('提现金额不能为0！')
        return
      }
      if (this.money < 0) {
        this.$err('提现金额不能为负数！')
        return
      }
      if (this.money > this.wallet.money_info.total_money) {
        this.$err('体现金额大于可提现金额!')
        return
      }
      let url = '/user/wallet/withdrawal_money';
      let way = this.payWay.includes('支付宝') ? '支付宝' : '银行卡';
      let money = this.money
      let data = {
        type: way,
        money: money
      };
      postData({ url, data }).then(res => {
        if (res.code == 200) {
          this.$success(res.data.msg)
          this.money = '';
          this.init()
        }
      })
      this.dialog2 = false;
    },
    monitor(v) {
      if (v > this.wallet.money_info.total_money) {
        this.$err(`当前最大可提现金额为￥${this.wallet.money_info.total_money}.00元`)
      }
    },
    withdrawLog() {
      let url = '/user/wallet/withdrawal_logs';
      getData({ url }).then(res => {
        if (res.code == 200 && res.data.withdrawal_logs) {
          this.withdrawal_logs = res.data.withdrawal_logs
         
        }
      })
    },
    incomeLog() {
      let url = '/user/wallet/money_in_logs';
      getData({ url }).then(res => {
        if (res.code == 200 && res.data.money_in_logs) {
          this.money_in_logs = res.data.money_in_logs
        }
      })
    }
  },
};
</script>

<style lang="less" scoped>
.info {

  background-color: #fff;
  // border: 1px solid red;
}
.pz_img{
  width: 50px;;
  height: 50px;
  object-fit: cover;
}
.check_more{
  position: relative;
}
.show_img {
  /deep/.el-image__inner{
  width: 0.52rem;
  height: 0.33rem;
  object-fit: cover;
}
}
.title {
  width: 100%;
  height: 0.71rem;
  font-size: 0.15rem;
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(to bottom, #fdf8f2, #ffffff);
  border-bottom: 0.01rem solid #e8e8e8;

  .goProve {
    color: #CB781F;
    font-size: 0.14rem;
    position: absolute;
    right: 0.34rem;
    cursor: pointer;
    text-decoration: underline;
  }
}



.section {
  width: 100%;
  height: 50%;
  padding: 0.05rem 0 0.05rem 0rem;

  .card_title {
    margin: 0.2rem 0;
    font-size: 0.14rem;
    color: #666666;
  }
}

.card_box {
  display: flex;

  .card {
    width: 3rem;
    height: 1.3rem;
    display: inline-block;
    box-sizing: border-box;
    border-radius: 0.15rem;
    position: relative;
    margin-right: 0.4rem;
    >img{
      width: 100%;
      height: 100%;
    }

    >span {
      position: absolute;
      font-weight: 600;
    }

    .cardName {
      top: 0.2rem;
      left: 0.3rem;
      font-size: 0.16rem;
      color: #222226;
    }

    .cardRules {
      top: 0.2rem;
      right: 0.3rem;
      font-size: 0.14rem;
      font-weight: 400;
      color: #666666;

    }

    .cardValue {
      bottom: 0.13rem;
      left: 0.3rem;
      font-size: 0.32rem;
      color: #b8711c;
    }

    .cardText {
      bottom: 0.15rem;
      right: 0.31rem;
      font-size: 0.15rem;
      color: #ffffff;
      cursor: pointer;
    }

    .cardStages {
      top: 0.44rem;
      left: 0.3rem;
    }
  }
}

.main {
  padding-bottom: 0.43rem;
  border-bottom: 1px solid #E8E8E8;
}

.foot_tab {
  margin-top: 0.24rem;
}

.money-record {
  // height: 1rem;
  // overflow-y: auto;
}

.dialog {
  width: 5.25rem;
  max-height: 2.72rem;
  overflow-y: auto;
  border-radius: 0.04rem;
  background: #EAF1F5;
  margin-bottom: 0.25rem;

  .item {
    width: 90%;
    margin: 0 auto;
    border-bottom: 0.01rem solid #fff;

    .item_title {
      margin: 0.16rem 0;
      font-size: 0.14rem;
      font-weight: 700;
      color: #1B4B84;
    }

    .item_data {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.1rem 0;
    }
  }
}

.tips {
  width: 4rem;
  // height: 2.72rem;
  // overflow-y: auto;
  // border-radius: 0.04rem;
  // background: #EAF1F5;
  margin-bottom: 0.25rem;

  .item {
    width: 90%;
    margin: 0 auto;
    // border-bottom: 0.01rem solid #fff;

    .item_title {
      margin: 0.16rem 0;
      font-size: 0.14rem;
      font-weight: 700;
      // color: #1B4B84;
    }

    .item_data {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 0.1rem 0;
    }
  }
}

.intro {
  padding: 0.2rem 0.15rem 0.18rem;
  color: red;

  h4 {
    font-size: 0.16rem;
    margin-bottom: 0.08rem;
    color: #fff;
  }

  p {
    color: #fff;
    font-size: 0.14rem;
    margin-bottom: 0.05rem;
  }

}

.totalQuota {
  color: #FF980B;
  font-size: 0.16rem;
  font-weight: 600;
}

/deep/.el-dialog__body {
  padding: 0.1rem 0.2rem !important;
}
</style>