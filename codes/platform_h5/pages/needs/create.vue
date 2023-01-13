<template>
  <view class="create_main">
    <view class="com_box">
      <view class="com_tit"> <view class="must">*</view> 外包名称 </view>
      <view class="r_main">
        <u-input
          class="title"
          v-model="title"
          type="text"
          placeholder="请输入需求名称"
          inputAlign="right"
        />
      </view>
    </view>

    <view class="com_box">
      <view class="com_tit"> <view class="must">*</view> 外包预算 </view>
      <view class="r_main budget_main">
        <u-input
          class="budget"
          v-model="budget"
          type="number"
          placeholder="输入"
          inputAlign="right"
        />
        元
      </view>
    </view>

    <view class="com_box">
      <view class="com_tit"> <view class="must">*</view> 外包分类 </view>

      <view class="r_main type_main" @tap="showClassify = true">
        <view class="type_box">
          <view class="ipt" :class="classifyActive ? '' : 'gary'">
            {{ classifyActive ? classifyActive : "请选择" }}
          </view>

          <i class="icon iconfont icon-zu742"></i>
        </view>

        <u-select
          v-model="showClassify"
          :list="classifyList"
          @confirm="classify_confirm"
          :safe-area-inset-bottom="true"
        ></u-select>
      </view>
    </view>

    <view class="com_box">
      <view class="com_tit"> <view class="must">*</view> 外包类型 </view>

      <view class="r_main type_main" @tap="showType = true">
        <view class="type_box">
          <view class="ipt" :class="typeActive ? '' : 'gary'">
            {{ typeActive ? typeActive : "请选择" }}
          </view>

          <i class="icon iconfont icon-zu742"></i>
        </view>

        <u-select
          v-model="showType"
          :list="typeList"
          @confirm="type_confirm"
          :safe-area-inset-bottom="true"
        ></u-select>
      </view>
    </view>

    <view class="com_box">
      <view class="com_tit"> <view class="must">*</view> 截止日期 </view>

      <view class="r_main type_main" @tap="showEndTime = true">
        <view class="type_box">
          <view class="ipt" :class="endTime ? '' : 'gary'">
            {{ endTime ? endTime : "请选择" }}
          </view>

          <i class="icon iconfont icon-zu742"></i>
        </view>

        <u-picker
          v-model="showEndTime"
          mode="time"
          @confirm="time_confirm"
          :safe-area-inset-bottom="true"
        ></u-picker>
      </view>
    </view>

    <view class="com_box">
      <view class="com_tit"> <view class="must">*</view> 业务区域 </view>

      <view class="r_main type_main" @tap="showArea = true">
        <view class="type_box">
          <view class="ipt" :class="areaActive ? '' : 'gary'">
            {{ areaActive ? areaActive : "请选择" }}
          </view>

          <i class="icon iconfont icon-zu742"></i>
        </view>

        <u-select
          v-model="showArea"
          :list="areaList"
          @confirm="area_confirm"
          :safe-area-inset-bottom="true"
        ></u-select>
      </view>
    </view>

    <view class="com_box summary_box">
      <view class="com_tit"> <view class="must">*</view> 外包描述 </view>
      <view class="r_main summary">
        <textarea
          v-model="content"
          placeholder-style="color:#CBCBCB"
          placeholder="请输入外包描述"
        />
      </view>
    </view>

    <view class="com_box imgs_box">
      <view class="com_tit"> 图片 </view>
      <view class="r_main">
        <view class="imgs_list" v-if="thumbs.length > 0">
          <view class="item" v-for="(item, idx) in thumbs" :key="idx">
            <image :src="item" />

            <i class="icon iconfont icon-e-qx41" @tap="deleteImg(idx)"></i>
          </view>
        </view>

        <view class="upload_imgs" @tap="upload_img" v-if="thumbs.length < 6">
          <i class="icon iconfont icon-e-cha"></i>
        </view>
      </view>
    </view>

    <view class="com_box user_row">
      <view class="com_tit"> <view class="must">*</view> 联系方式 </view>

      <view class="r_main user_tel_box">
        <u-radio-group v-model="userTelType">
          <u-radio
            v-for="(item, index) in redioList"
            :key="index"
            :name="item.value"
          >
            {{ item.name }}
          </u-radio>
        </u-radio-group>

        <u-input
          class="user_tel"
          v-model="user_tel"
          type="text"
          placeholder="请输入"
          :custom-style="customStyle"
        />
      </view>
    </view>

    <view class="btm_btns">
      <view class="btn" @tap="$u.throttle(navback, 2000)">取消</view>
      <view class="btn submit" @tap="$u.throttle(submitAsk, 2000)">发布</view>
    </view>

    <!-- 提示 -->
    <u-popup
      v-model="tipsPopupShow"
      mode="center"
      border-radius="16"
      :mask-close-able="true"
    >
      <view class="tips_popup">
        <view class="top_tit">
          <text>发布小贴士</text>

          <i
            class="icon iconfont icon-e-qx41"
            @click="tipsPopupShow = false"
          ></i>
        </view>

        <view class="tips_main">
          1.请勿在外包描述中透露您的联系方式， 一经发现，平台将立即删除该需求。

          <br />
          <br />

          2.您发布的外包，社区会以官方发布至 小程序-云方案的需求广场中，为您带来
          更多渠道。
        </view>

        <view class="is_ok" @click="tipsPopupShow = false">我已了解 </view>
      </view>
    </u-popup>

    <login></login>
  </view>
</template>

<script>
import { authStatus } from "@/common/hooks.js";
import store from "@/store";

export default {
  data() {
    return {
      show: false,
      tipsPopupShow: false,
      type: "add",
      id: "",
      redioList: [
        {
          name: "手机号",
          value: 0,
          disabled: false,
        },
        {
          name: "微信号",
          value: 1,
          disabled: false,
        },
        {
          name: "QQ号",
          value: 2,
          disabled: false,
        },
      ],
      customStyle: {
        "box-sizing": "border-box",
        height: "74rpx",
        padding: "0 24rpx",
        "placeholder-style": "#CBCBCB",
      },
      classifylShow: true,
      showClassify: false,
      showType: false,
      showEndTime: false,
      showArea: false,

      classifyList: [], // 分类
      typeList: [], // 类型
      areaList: [], // 区域

      classifyActive: "", // 分类 高亮
      typeActive: "", // 类型 高亮
      areaActiveId: 0,
      endTime: "",
      // defaultTime: new Date().toLocaleDateString(),

      title: "",
      content: "",
      budget: "",
      content: "",
      userTelType: 0,
      user_tel: "",
      thumbs: [],
    };
  },
  onShow() {
    this.id = this.$Route.query.id;
    if (this.id) {
      this.type = "edit";
    }
    console.log("onShow >>>", this.id);
    if (!authStatus()) return;

    this.getTypeList();
  },
  created() {
    if (this.id) {
      this.getEdit(this.id);
    } else {
      this.tipsPopupShow = true;
    }
  },
  computed: {
    areaActive: {
      get() {
        let val = "";
        this.areaList.map((e) => {
          if (this.areaActiveId == e.id) {
            val = e.name;
          }
        });
        return val;
      },
      set() {
        let val = "";
        this.areaList.map((e) => {
          if (this.areaActiveId == e.id) {
            val = e.name;
          }
        });
        return val;
      },
    },
  },
  methods: {
    async getTypeList() {
      await this.$u.api.demandCreate().then((res) => {
        const {
          code,
          data: {
            data: { area, demand_pc_classify, demand_pc_type },
          },
        } = res;

        let area_arr = area;
        let classity_arr = [];
        let type_arr = [];

        area_arr.map((e) => {
          e.value = e.id;
          e.label = e.name;
        });
        demand_pc_classify.map((e) => {
          let obj = {
            value: e,
            label: e,
          };
          classity_arr.push(obj);
        });
        demand_pc_type.map((e) => {
          let obj = {
            value: e,
            label: e,
          };
          type_arr.push(obj);
        });

        if (code === 200) {
          this.areaList = area_arr;
          this.classifyList = classity_arr;
          this.typeList = type_arr;
        }
      });
    },
    // 分类
    classify_confirm(e) {
      let item = e[0];
      this.classifyActive = item.label;
    },
    // 类型
    type_confirm(e) {
      let item = e[0];
      this.typeActive = item.label;
    },
    // 截止日期
    time_confirm(e) {
      const { year, month, day } = e;
      this.endTime = `${year}-${month}-${day}`;
    },
    // 区域选择
    area_confirm(e) {
      let item = e[0];
      this.areaActive = item.label;
      this.areaActiveId = item.value;
    },

    // 上传图片
    upload_img() {
      let _th = this;
      uni.chooseImage({
        count: 6 - this.thumbs.length,
        success: (res) => {
          uni.showLoading({
            title: "图片上传中",
            mask: true,
          });
          _th.upload(res.tempFilePaths, 0);

          uni.hideLoading();
        },
      });
    },
    upload(list, index) {
      let _th = this;

      if (index > list.length - 1) return uni.hideLoading();

      uni.showLoading({
        title: "图片上传中",
        mask: true,
      });

      uni.uploadFile({
        url: `${store.state.httpUrl}/api/m/upload/single`,
        filePath: list[index],
        name: "file",
        success: (uploadFileRes) => {
          const {
            code,
            data: { path_url, msg },
          } = JSON.parse(uploadFileRes.data);

          if (code === 200) {
            _th.thumbs.push(path_url);
            _th.upload(list, index + 1);
          } else if (code === 422) {
            console.log("422 >>>>>", list, index);

            if (index < list.length - 1) {
              _th.upload(list, index + 1);
            } else {
              uni.showToast({
                title: msg,
                icon: "none",
              });
            }
          }
        },
        fail: () => {
          uni.hideLoading();
          uni.showLoading({
            title: "图片上传失败，请重试！",
            mask: true,
          });
        },
      });
    },
    deleteImg(index) {
      this.thumbs.splice(index, 1);
    },

    navback() {
      uni.navigateBack({ delta: 1 });
    },
    // 创建页面 编辑数据回显
    async getEdit() {
      await this.$u.api.demandEdit({ id: this.id }).then((res) => {
        const {
          code,
          data: {
            data: {
              demand_pc: {
                title,
                budget,
                classify,
                type,
                closing_timing,
                area_id,
                content,
                contact_type,
                contact_detail,
                thumbs,
              },
            },
          },
        } = res;

        if (code === 200) {
          this.title = title;
          this.budget = budget;
          this.classifyActive = classify;
          this.typeActive = type;
          this.endTime = closing_timing;
          this.areaActiveId = area_id;
          this.content = content;
          this.userTelType = contact_type;
          this.user_tel = contact_detail;
          this.thumbs = thumbs ?? [];

          if (contact_type == "手机号") {
            this.userTelType = 0;
          } else if (contact_type == "微信号") {
            this.userTelType = 1;
          } else {
            this.userTelType = 2;
          }
        }
      });
    },

    // 发布
    async submitAsk() {
      let title = this.title,
        budget = this.budget,
        classify = this.classifyActive,
        type = this.typeActive,
        closing_timing = this.endTime,
        area_id = this.areaActiveId,
        content = this.content,
        userTelType = this.userTelType,
        contact_type = "",
        contact_detail = this.user_tel,
        thumbs = this.thumbs,
        params = {};

      if (title.trim() == "") {
        this.$u.toast("标题不能为空");
        return;
      }

      if (budget - 0 <= 0) {
        this.$u.toast("预算最小不能为0");
        return;
      }

      if (!classify) {
        this.$u.toast("请选择外包分类");
        return;
      }

      if (!type) {
        this.$u.toast("请选择外包类型");
        return;
      }

      if (!closing_timing) {
        this.$u.toast("请选择截止时间");
        return;
      }

      if (!area_id) {
        this.$u.toast("请选择业务区域");
        return;
      }

      if (content.trim() == "") {
        this.$u.toast("请输入内容描述");
        return;
      }

      if (userTelType == 0) {
        contact_type = "手机号";
      } else if (userTelType == 1) {
        contact_type = "微信号";
      } else {
        contact_type = "qq";
      }

      if (userTelType == 0) {
        if (!this.$u.test.mobile(contact_detail)) {
          return this.$u.toast("手机号格式不正确");
        }
      }

      if (!contact_detail) {
        this.$u.toast("请输入联系方式");
        return;
      }

      params = {
        id: this.id ? this.id : "",
        title,
        budget,
        classify,
        type,
        closing_timing,
        content,
        contact_type,
        contact_detail,
        area_id,
        thumbs,
      };

      if (this.id) {
        await this.$u.api.demandEditUpdata(params).then((res) => {
          const {
            code,
            data: { msg, title, content },
          } = res;

          if (code === 200) {
            this.$u.toast(msg);
            this.$Router.replace({
              name: "needs_detail",
              params: {
                id: this.id,
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
        await this.$u.api.demandCreateBtn(params).then((res) => {
          const {
            code,
            data: { msg, demand_id, title, content },
          } = res;

          if (code === 200) {
            this.$u.toast(msg);
            this.$Router.replace({
              name: "needs_detail",
              params: {
                id: demand_id,
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
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.create_main {
  padding: 0 0 182rpx;
}
.com_box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 30rpx;
  height: 112rpx;
  border-bottom: 1rpx solid #ebebeb;
  background-color: #fff;

  .com_tit {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    font-weight: 500;
    color: #333333;

    .must {
      font-size: 28rpx;
      color: #e50404;
    }
  }

  .r_main {
    .title {
      border: none;
    }
  }

  .budget_main {
    display: flex;
    align-items: center;
    font-size: 28rpx;
    color: #333333;
    .budget {
      margin-right: 10rpx;
    }
  }

  .type_main {
    .type_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20rpx !important;
      // width: 290rpx;
      height: 74rpx;
      border: none;
      font-size: 28rpx;
      color: #333;

      .iconfont {
        margin-left: 20rpx;
        // font-size: 20rpx;
        color: #989898;
      }
    }

    .gary {
      color: #cbcbcb;
    }
  }
}

.summary_box {
  display: block;
  height: auto !important;
  padding: 16rpx 30rpx 22rpx !important;
  overflow: hidden;

  .com_tit {
    margin-bottom: 30rpx;
  }

  .summary {
    textarea {
      width: 100%;
      height: 150rpx;
      font-size: 28rpx;
      color: #333;
    }
  }
}

.user_row {
  height: auto !important;
  align-items: baseline;
  padding: 16rpx 30rpx 22rpx !important;

  .user_tel_box {
    .u-radio__label {
      color: #333333;
      font-size: 28rpx;
      font-weight: 600;
    }

    .user_tel {
      margin-top: 36rpx;
      width: 462rpx;
      height: 74rpx;
      border: 2rpx solid #e2e2e2;
    }
  }
}

.imgs_box {
  height: auto !important;
  padding: 16rpx 30rpx 22rpx !important;

  .com_tit {
    margin-right: 50rpx;
    flex-shrink: 0;
  }

  .r_main {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 460rpx;
  }

  .imgs_list {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 105%;

    .item {
      position: relative;
      margin-right: 20rpx;
      margin-bottom: 20rpx;
      width: 100rpx;
      height: 100rpx;

      image {
        width: 100%;
        height: 100%;
      }

      .iconfont {
        position: absolute;
        top: -10rpx;
        right: -10rpx;
        font-size: 40rpx;
        color: #333;
      }
    }
  }
  .upload_imgs {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 72rpx;
    height: 72rpx;
    background: #f5f5f5;
    border-radius: 4rpx;
    font-size: 32rpx;
    color: #c1c1c1;
    flex-shrink: 0;
  }
}

.btm_btns {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 16rpx;
  height: 182rpx;
  box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
  background-color: #fff;

  .btn {
    width: 348rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #ffffff;
    border: 2rpx solid #0268fa;
    border-radius: 44rpx;

    font-size: 32rpx;
    font-weight: 600;
    color: #0268fa;
  }

  .submit {
    margin-left: 22rpx;
    color: #fff;
    background-color: #0268fa;
  }
}

.tips_popup {
  padding: 38rpx 54rpx 0;
  width: 638rpx;
  height: 608rpx;

  .top_tit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 44rpx;
    font-size: 32rpx;
    font-weight: 600;
    color: #333333;
    line-height: 1;

    .iconfont {
      font-size: 32rpx;
      color: #999999;
    }
  }

  // 提示
  .tips_main {
    font-size: 30rpx;
    font-weight: 400;
    line-height: 42rpx;
    color: #333333;
  }

  .is_ok {
    margin: 84rpx auto 0;
    width: 348rpx;
    height: 88rpx;
    line-height: 88rpx;
    text-align: center;
    background: #0268fa;
    border-radius: 44rpx;

    font-size: 32rpx;
    font-weight: 600;
    color: #ffffff;
  }
}
</style>
