<template>
  <view class="up">
    <u-navbar bgColor="transparent" title="产品升级" leftIconColor="#fff" @leftClick="leftClick" >
    </u-navbar>

    <view class="top_bgc"></view>

    <view class="up_main">
      <view class="up_info" :class="info.level == 3 ? 'three':(info.level == 1 ? '':'two')">
        <view class="up_top d-between" >
          <view class="current">当前版本：<text class="name">{{info.str}}</text></view>
          <view class="sit" v-if="info.level == 1">坐席{{info.has_position}}个  剩余{{info.surplus_position}}个</view>
        </view>
        <view class="up_bottom d-between">
          <view class="time">到期时间：{{info.end_time}}</view>
          <view class="base_btn" @click="call()">联系我们</view>
        </view>
      </view>

      <view class="up_card base d-between">
        <view>
          <view class="title">基础版</view>
          <view class="tip">基础销售CRM管理及数据分析</view>
        </view>
        <view class="price"><text class="unit">￥</text><text class="money">48</text>/人/月</view>
      </view>

      <view class="up_card vip d-between">
        <view>
          <view class="title">旗舰版</view>
          <view class="tip">可根据您的业务深度自定义的智能销售CRM管理</view>
        </view>
        <view class="btn" @click="call()">联系我们</view>
      </view>

      <view class="up_card best d-between">
        <view>
          <view class="title">私有化部署</view>
          <view class="tip">将数据库存到客户自己的服务器上，保障数据安全</view>
        </view>
        <view class="btn" @click="call()">联系我们</view>
      </view>
    </view>
    
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
import { navBack } from "@/common/hooks";
export default {
  data() {
    return {
      info: {},
      company_id:0
    };
  },
  onShow() {
    this.init();
  },
  methods: {
    init() {
      getUser().then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();
          this.company_id = user.company_id
          this.get_info ()
        }
      });
    },
    get_info() {
      if(this.company_id) {
        getData('/company_edition').then((res) => {
          const {
            code,
            data: {info },
          } = res;
          if (code === 200) {
            this.info = info
            let str = '基础版'
            switch(this.info.level) {
              case 1: str = '基础版';break;
              case 2: str = '旗舰版';break;
              case 3: str = '私有化部署';break;
            }
            this.info.str = str 
          }
        });
      }else {
        this.info = {
          end_time: " - ",
          has_position: " - ",
          level: 1,
          str:"基础版",
          surplus_position: " - ",
        }
      }
    },
    call () {
      uni.makePhoneCall({
        phoneNumber: '17714209983',
      });
    },
    onPullDownRefresh() {
      this.init();
    },
    leftClick() {
      navBack();
    },
  },
};
</script>

<style lang="less" scoped>
.up {
  height: 100vh;
  background:#fff;
  padding-top: 90px;
}
/deep/.u-navbar {
  z-index: 9;

  .u-navbar__content__title {
    color: #fff;
  }
}

.top_bgc {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 212px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/dbg-5.png");
  background-size: 100% 100%;
  z-index: 1;
}

.up_main {
  position: relative;
  padding: 30px 20px 20px;
  z-index: 2;

  .up_info {
    height: 155px;
    border-radius: 12px;
    margin-bottom: 20px;
    background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/bg-kp1.png) no-repeat center center;
    background-size: 100% 100%;
    padding: 24px 26px 14px 20px;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: space-between;
    justify-content: space-between;
  }

  .up_info.two {
    background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/10/%E9%A3%9E%E4%B9%A620220310-153844.png) no-repeat center center;
    background-size: 100% 100%;
  }

  .up_info.three {
    background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/10/%E9%A3%9E%E4%B9%A620220310-153847.png) no-repeat center center;
    background-size: 100% 100%;
  }

  .current {
    font-size: 12px;
  }
  .name {
    font-size: 18px;
    font-weight: 600;
    line-height: 25px;
  }
  .sit {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
  }
  .time {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
  }
  .num {
    font-size: 15px;
  }
  .base_btn {
    font-size: 14px;
    font-weight: 600;
    line-height: 33px;
    color: #333333;
    width: 80px;
    height: 33px;
    background: #fff;
    border-radius: 17px;
    text-align: center;
  }
}

.up_card {
  height: 108px;
  padding: 23px 25px;
  margin-bottom: 10px;
  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    margin-bottom: 6px;
  }
  .tip {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    width: 156px;
  }

  .btn {
    width: 80px;
    height: 33px;
    background: #fff;
    border-radius: 17px;
    font-size: 14px;
    font-weight: 600;
    line-height: 33px;
    text-align: center;
  }

  .price {
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    .unit {
      font-size: 12px;
    }
    .money {
      font-size: 30px;
    }
  }
}

.up_card.base {
  height: 94px;
  padding: 25px;
  background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/bg-jcb.png) no-repeat center center;
  background-size: 100% 100%;
  color: #264AE3;
  .tip {
    width: 165px;
  }
} 

.up_card.vip {
  background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/bg-qjb.png) no-repeat center center;
  background-size: 100% 100%;
  color: #B05F38;
  .btn {
    box-shadow: 0px 2px 8px #FCC8B0;
  }
}

.up_card.best {
  background: url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/bg-jcb-1.png) no-repeat center center;
  background-size: 100% 100%;
  color: #B07438;
  .tip {
    width: 195px;
  }
  .btn {
    box-shadow: 0px 2px 8px #E6C27C;
  }
}

</style>