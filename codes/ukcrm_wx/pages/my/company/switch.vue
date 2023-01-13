<template>
	<view class="switch">
    <u-toast ref="uToast"></u-toast>
    
    <view class="switch_list">
      <view
        class="switch_item d-flex"
        v-for="(v, k) in switch_list"
        :key="k"
        @click="get(v)"
      >
        <image class="logo border" :src="v.company && v.company.logo" v-if="v.company && v.company.logo" mode="aspectFit"></image>
        <image class="logo" src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202203/02/%E9%A3%9E%E4%B9%A620220302-104743.png" mode="aspectFit" v-else></image>
        <view class="switch_info">
          <view class="name u-line-1"> {{ v.company && v.company.name }} </view>
          <view class="job">{{ v.role_name}}</view>
        </view>
      </view>

      <view class="switch_item switch_add d-flex" @click="choose()">
        <view class="icon_add"><i class="icon iconfont icon-tj4"></i></view>
        <view class="add">新建/加入企业</view>
      </view>
    </view>

	</view>
</template>

<script>
  import { getData, postData } from "@/common/api";
	export default {
		data() {
			return {
        switch_list:[],
			}
		},
		onShow() {
      this.init()
		},
		methods: {
      init () {
        getData("/user/swith_company_list", {}).then((res) => {
          const { code,data: { list }} = res;
          if (code === 200) {
            uni.stopPullDownRefresh();
            this.switch_list = list;
          }
        });
      },
      choose() {
        this.$Router.push({
          path: `/choose_company`,
          query: {
            from: 'switch',
          },
        });
      },
      get (v) {
        let that = this
        postData("/user/swith_company", {
            company_id: v.company_id
          }).then((res) => {
            const {
              code,
              data: { msg },
            } = res;
            if (code === 200) {
              this.$refs.uToast.show({
                message: msg,
                complete() {
                  that.$Router.replaceAll({
                    name: "my",
                  });
                },
              });
            } else if (code === 422) {
              this.$u.toast(msg);
            }
          });
      }
    }
  }
</script>

<style lang="scss">
.switch {
  padding: 10px 0 30px;
  .switch_item {
    background: #fff;
    padding: 20px 20px 15px;
    margin-bottom: 1px; 
  }

  .logo {
    width: 45px;
    height: 45px;
    border-radius: 8px;
    margin-right: 13px;
  }

  .border {
    border: 1px solid #EDEDED;
  }

  .switch_info {
    .name {
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      color: #333333;
      margin-bottom: 9px;
    }
    .job {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #666666;
    }
  }

  .icon_add {
    width: 45px;
    height: 45px;
    background: #F4F4F4;
    border-radius: 8px;
    line-height: 45px;
    text-align: center;
    margin-right: 13px;
    .icon {
      color:#C3C3C3;
    }
  }

  .add {
    font-size: 12px;
    font-weight: 400;
    line-height: 17px;
    color: #666666;
  }

}
</style>
