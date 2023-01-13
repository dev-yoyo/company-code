<template>
  <view class="home">
    <u-navbar bgColor="transparent" title="我的" leftIcon=" " placeholder>
    </u-navbar>

    <view class="top_bgc"> </view>

    <view class="user_main">
      <view class="user_info">
        <view class="user_top d-flex">
          <u-avatar
            v-if="info.avatar"
            :src="info.avatar"
            :size="60"
            shape="circle"
            bg-color="#4D6FFF"
            mode="aspectFit"
          ></u-avatar>
          <u-avatar
            v-else
            :text="info.abbreviation"
            :size="60"
            shape="circle"
            bg-color="#4D6FFF"
            mode="aspectFit"
          ></u-avatar>

          <view class="r_main d-flex">
            <view class="name_box">
              <view class="name">{{ info.name }}</view>
              <view
                class="join_btn d-flex"
                v-if="company_id == 0"
                @click="joinCompany"
              >
                <i class="icon iconfont icon-tj4"></i>
                创建/加入企业
              </view>
              <view class="company_name d-flex" v-else>
                {{ company.name }}
              </view>
            </view>

            <view class="edit d-flex" @click="edit()">
              <i class="icon iconfont icon-bj2"></i>
              编辑
            </view>
          </view>
        </view>
        <view class="user_bottom d-between">
          <text class="verion" @click="to_up()">基础版</text>
          <view class="up d-flex" @click="to_up()"><i class="icon iconfont icon-kjsj" ></i>立即升级</view>
        </view>
      </view>
    </view>

    <view class="user_list">
      <view v-for="(item, index) in list" :key="index">
        <view class="user_item" v-if="item.show" @click="to(item)">
          <view class="d-flex">
            <view class="iconfont" :class="item.icon"></view>
            <view>{{ item.text }}</view>
          </view>
          <view class="iconfont icon-e-zy"></view>
        </view>
      </view>
    </view>

    <!-- 解散企业 -->
    <view class="diss_modal">
      <u-modal :show="is_dissShow" :showConfirmButton="false" width="240">
        <view class="is_diss_box slot-content"> 企业解散成功 </view>
      </u-modal>
    </view>
  </view>
</template>

<script>
import { getData, postData, getUser } from "@/common/api";
export default {
  data() {
    return {
      role_id: null,
      company_id: 0,
      company: {},
      info: {},
      list: [],
      is_dissShow: false,
    };
  },
  onLoad() {
    let _th = this;
    uni.$on("updateData", function (data) {
      if (data.type == "diss_company") {
        _th.is_dissShow = true;
        setTimeout(() => {
          _th.is_dissShow = false;
        }, 2000);
      }
    });
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
          this.info = user;
          this.role_id = user.role_id;
          (this.company_id = user.company_id),
            (this.company = user.company_id != 0 ? user.company : {});
          this.list = [
            {
              icon: "icon-gywm1",
              text: "我的名片",
              show: this.company_id != 0,
              path: "/card",
            },
            {
              icon: "icon-zjjg",
              text: "组织架构",
              show: this.company_id != 0,
              path: "/organization",
            },
            {
              icon: "icon-khgl",
              text: "客户回收站",
              show: this.role_id == 1 || this.role_id == 2,
              path: "/client_manage",
            },
            {
              icon: "icon-qhqy",
              text: "切换企业",
              show: true,
              path: "/switch_company",
            },
            // {
            //   icon: "icon-qymbgl",
            //   text: "企业目标管理",
            //   show: this.role_id < 4 && this.role_id != 0,
            //   path: "/company_target",
            // },
            {
              icon: "icon-yjgl",
              text: "意见反馈",
              show: true,
              path: "/feedback",
            },
            {
              icon: "icon-gywm",
              text: "关于我们",
              show: true,
              path: "/about_us",
            },
            {
              icon: "icon-sz",
              text: "设置",
              show: true,
              path: "/setting",
            },
          ];
        }
      });
    },
    joinCompany() {
      this.$Router.push({
        path: "/choose_company",
        query: {
          from: "my",
        },
      });
    },
    edit() {
      this.$Router.push({
        path: "/create_info",
      });
    },
    to(item) {
      this.$Router.push({
        path: item.path,
      });

    
    },
    to_up () {
      this.$Router.push({
        path: '/up',
      });
    },
    onPullDownRefresh() {
      this.init();
    },
  },
};
</script>

<style lang="less" scoped>
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
  /*height: 144px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/18/X4wJhi2Qe7AarRKD2CFYt7rrnxWpRYWM1642489460553.png");*/
  height: 245px;
  background: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E5%9B%BE/dbj2.png");
  background-size: 100% 100%;
  border-radius: 0px 0px 18px 18px;
  z-index: 1;
}

.user_main {
  position: relative;
  padding: 30px 15px 12px;
  z-index: 2;

  /deep/ .u-avatar--square {
    border-radius: 10px;
  }

  .user_info {
    padding: 33px 20px 20px;
    width: 100%;
    height: auto;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    background:#fff url(https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/10/%E9%A3%9E%E4%B9%A620220310-143511.png) no-repeat left top;
    background-size: 101px 128px;

    .r_main {
      justify-content: space-between;
      align-items: flex-start;
      margin-left: 12px;
      width: 100%;

      .name_box {
        flex: 1;

        .name {
          margin-bottom: 6px;
          font-size: 18px;
          font-weight: 600;
          line-height: 25px;
          color: #333333;
        }

        .join_btn {
          justify-content: center;
          width: 134px;
          height: 30px;
          background: #f0f5ff;
          border-radius: 15px;
          font-size: 13px;
          font-weight: 600;
          line-height: 30px;
          color: #4d6fff;
          .iconfont {
            margin-right: 10px;
            font-size: 10px;
          }
        }

        .company_name {
          font-size: 14px;
          font-weight: 400;
          line-height: 18px;
          color: #666;
        }
      }

      .edit {
        margin-left: 10px;
        align-items: center;
        justify-content: center;
        width: 57px;
        height: 28px;
        background: #fff;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 400;
        color: #666666;
        flex-shrink: 0;

        .iconfont {
          margin-right: 4px;
          font-size: 12px;
        }
      }
    }
  }
  .user_bottom {
    margin-top: 20px;
    border-top: 1px solid #F0F0F0;
    padding-top: 14px;
    .verion {
      width: 62px;
      height: 30px;
      background: #F2F2F2;
      border-radius: 4px;
      font-size: 13px;
      font-weight: 600;
      line-height: 30px;
      color: #666666;
      text-align: center;
    }
    .up {
      align-items: center;
      justify-content: center;
      width: 90px;
      height: 30px;
      background: #FFF1DB;
      border-radius: 15px;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 18px;
      color: #FF9D00;
      .iconfont {
        font-size: 12px;
      }
    }
  }
}

.user_list {
  position: relative;
  margin-top: 2px;
  background: #fff;
  z-index: 2;

  .user_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    padding: 0 20px;
    border-bottom: 1px solid #f5f5f7;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    color: #333333;
  }

  .iconfont {
    margin-right: 10px;
    color: #4d6fff;
    font-size: 22px;
  }

  .icon-e-zy {
    font-size: 14px;
    color: #666666;
    margin-right: 0;
  }
}

.diss_modal {
  /deep/.u-modal__content {
    padding: 0 !important;
  }

  .is_diss_box {
    height: 90px;
    line-height: 90px;
    font-size: 15px;
    font-weight: 600;
    color: #333333;
    text-align: center;
  }
}
</style>