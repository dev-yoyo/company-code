<template>
  <view class="content_detail">
    <u-toast ref="uToast"></u-toast>

    <view class="top_txt d-flex">
      <view class="login_txt"> 加入企业 </view>
    </view>

    <view class="ser_box">
      <u-search
        v-model="serkeyword"
        placeholder="输入搜索的企业名称"
        shape="square"
        :showAction="false"
        borderColor="#E8E8E8"
        height="56"
        @search="search"
      ></u-search>
    </view>

    <view class="slogan" v-if="containerStatus === 0">
      <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
      <view class="txt">好用易用的CRM</view>
    </view>

    <view class="slogan" v-if="containerStatus === 1">
      <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
      <view class="txt">
        未找到该企业，<text @click="nav">前往创建</text>
      </view>
    </view>

    <view v-else-if="containerStatus === 2">
      <view class="list_box">
        <view
          class="item d-flex"
          v-for="(v, i) in companyList"
          :key="i"
        >
          <view class="l_info d-flex">
            <u-avatar
              :src="v.logo"
              :size="48"
              shape="square"
              mode="aspectFit"
            ></u-avatar>
            <view class="name">{{ v.name }}</view>
          </view>

          <view
            class="join"
            :class="v.apply_status != '申请加入' ? 'gray' : ''"
            @click="join(v)"
          >
            {{ v.apply_status }}
          </view>
        </view>
      </view>
    </view>

    <u-popup
      :show="popupShow"
      :round="10"
      mode="center"
      :safeAreaInsetBottom="false"
      @close="popupShow = false"
    >
      <view class="popup_box">
        <view class="avatar">
          <u-avatar :src="img" :size="128" mode="aspectFit"></u-avatar>
        </view>

        <view class="content">
          是否确定加入 <br />
          “{{ companyName }}”
        </view>

        <view class="btm_btns d-flex">
          <view class="btn cancel" @click="popupShow = false"> 取消 </view>
          <view class="btn" @click="confirm"> 确定 </view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";

export default {
  data() {
    return {
      from: "login",
      serkeyword: "",
      containerStatus: 0, // 0 slogan  1 缺省  2列表
      companyList: [],

      popupShow: false,
      companyName: "",
      companyId: "",
      img: "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/A44ijh8Nj24AfF7DchCHNa7dFrQCTEnk1642733518337.png",
      slogan:
        "https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/20/w6bAhD6d7NKKjfbmnjWji6Gbya2fdSht1642661092457.png",
    };
  },
  onShow() {
    let query = this.$Route.query;
    if (query.from) {
      this.from = query.from;
    }
  },
  methods: {
    search() {
      if (!this.serkeyword) {
        this.containerStatus = 0;
      } else {
        this.page = 1;
        this.getList();
      }
    },
    getList() {
      getData("/company/search_company", {
        params: {
          page: this.page,
          company_name: this.serkeyword,
        },
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          uni.stopPullDownRefresh();

          console.log(list.data);
          if (this.page != 1) {
            this.companyList = this.companyList.concat(list.data);
          } else {
            if (list.data.length <= 0) {
              this.containerStatus = 1;
            } else {
              this.containerStatus = 2;
            }

            this.companyList = list.data;
          }

          this.next_page = list.next_page_url ? true : false;
        }
      });
    },
    join(v) {
      if (v.apply_status != "申请加入") return;

      this.companyName = v.name;
      this.companyId = v.id;
      this.popupShow = true;
    },
    confirm() {
      postData("/company/join_company", {
        company_id: this.companyId,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          this.popupShow = false;
          let _th = this;
          this.$refs.uToast.show({
            message: "已申请加入，等待管理员同意",
            complete() {
              if (_th.from == "login") {
                _th.$Router.replaceAll({
                  name: "home",
                });
              } else if (_th.from == "my") {
                _th.$Router.replaceAll({
                  name: "my",
                });
              } else {
                uni.navigateBack({ delta: 2 });
              }
            },
          });
        } else if (code === 422) {
          this.$u.toast(msg);
        }else {
          this.$u.toast(msg);
        }
      });
    },
    nav() {
      this.$Router.push({
        path: "/create_company",
        query: {
          from: this.from,
        },
      });
    },

    onReachBottom() {
      if (!this.next_page) {
        this.$u.toast('暂无更多数据');
        return
      };
      uni.showLoading({
        title: "加载中",
        mask: true,
      });
      this.page = this.page + 1;
      this.init();
      setTimeout(() => {
        uni.hideLoading()
      }, 1000)
    },
    onPullDownRefresh() {
      this.page = 1;
      this.getList();
    },
    onPageScroll(e) {
      this.scrollTop = e.scrollTop;
    },
  },
};
</script>

<style lang="less" scoped>
page {
  background-color: #fff !important;
}

.content_detail {
  padding: 33px 20px 0;
  min-height: 100%;
  background-color: #fff;
}

.top_txt {
  margin-bottom: 30px;
  justify-content: space-between;

  .login_txt {
    font-size: 28px;
    font-weight: 600;
    line-height: 40px;
    color: #333333;
  }
}

.ser_box {
  margin-bottom: 20px;

  /deep/.u-search__content {
    background-color: #fff !important;
  }

  /deep/input {
    background-color: transparent !important;
  }
}

.slogan {
  padding: 106px 0 0;

  .txt {
    margin-top: 13px;
    text-align: center;

    text {
      color: #316ec3;
    }
  }
}

// 弹框
.popup_box {
  padding-bottom: 35px;
  width: 321px;
  text-align: center;

  .avatar {
    padding-top: 48px;
    height: 201px;
    background: linear-gradient(180deg, #f0f5ff 0%, #ffffff 100%);
    border-radius: 8px 8px 0px 0px;

    /deep/.u-avatar {
      margin: 0 auto;
    }
  }

  .tit {
    margin-bottom: 33px;
    font-size: 15px;
    font-weight: 400;
    line-height: 1;
    color: #666666;
  }

  .content {
    margin-bottom: 34px;
    padding: 0 30px;
    font-size: 16px;
    font-weight: 600;
    color: #333;
    line-height: 22px;
  }

  .btm_btns {
    justify-content: center;
    width: 100%;
    padding: 0 40px;

    .btn {
      width: 110px;
      height: 40px;
      line-height: 40px;
      font-size: 17px;
      color: #ffffff;
      text-align: center;
      background-color: #4d6fff;
      border-radius: 2px;
    }

    .cancel {
      margin-right: 25px;
      color: #333;
      background: #fff;
      border: 1px solid #d8d8d8;
    }
  }
}

.list_box {
  .item {
    justify-content: space-between;
    margin-bottom: 30px;

    /deep/ .u-avatar {
      border: 1px solid #e8e8e8;
      border-radius: 10px;
      overflow: hidden;
    }

    .l_info {
      .name {
        margin-left: 8px;
        font-size: 14px;
        font-weight: 400;
        line-height: 20px;
        color: #333333;
      }
    }

    .join {
      margin-left: 30px;
      width: 80px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background: #4d6fff;
      border-radius: 4px;

      font-size: 14px;
      font-weight: 400;
      color: #ffffff;
      flex-shrink: 0;
    }

    .gray {
      background-color: #e8e8e8 !important;
    }
  }
}
</style>