<template>
  <view class="content_detail">
    <view class="top_txt d-flex">
      <view class="login_txt"> 创建部门 </view>

      <view class="add_btn d-flex" @click="add">
        <i class="icon iconfont icon-tj11"></i>
        添加
      </view>
    </view>

    <view class="form_main">
      <u-form ref="uForm" labelPosition="left" labelWidth="100">
        <u-form-item
          label="部门名称"
          :prop="item.name"
          borderBottom
          v-for="(item, index) in branchs"
          :key="index"
        >
          <u-input
            v-model="item.name"
            placeholder="部门名称"
            placeholderStyle="#999999" fontSize="14"
            border="none"
            inputAlign="right"
          ></u-input>
        </u-form-item>
      </u-form>
    </view>

    <view class="fixed_btm btm_btn_box" :class="is_submit ? 'lightBtn' : 'btn'">
      <u-button @click="submit"> 创建 </u-button>
    </view>
  </view>
</template>

<script>
import { getData, postData } from "@/common/api";

export default {
  data() {
    return {
      allot: false, // 从分配成员跳转过来的  返回上一页
      branchs: [
        {
          name: "",
        },
      ],
    };
  },
  computed: {
    is_submit() {
      let arr = this.branchs;
      let flag = false;
      arr.map((e) => {
        if (e.name) {
          flag = true;
        }
      });
      return flag;
    },
  },
  mounted() {},
  onShow() {
    let query = this.$Route.query;
    console.log(query);
    if (query.allot) {
      this.allot = true;
    }
  },
  methods: {
    add() {
      this.branchs.push({
        name: this.next++,
      });
    },
    skip() {
      this.$Router.replaceAll({
        name: "home",
      });
    },
    submit() {
      if (!this.is_submit) {
        uni.$u.toast("部门名称不能为空");
        return;
      }

      let arr = [];
      this.branchs.map((e) => {
        if(e.name) {
          arr.push(e.name);
        }
      });

      postData("/department", {
        department_names: arr,
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          uni.$u.toast(msg);

          // 分配角色过来的，返回上一页
          if (this.allot) {
            uni.navigateBack({ delta: 1 });
          } else {
            this.$Router.replaceAll({
              name: "home",
            });
          }
        } else if (code === 422) {
          this.$u.toast(msg);
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.content_detail {
  padding: 0 0 130px;
  // min-height: 100%;
  // background-color: #fff;
}

.top_txt {
  padding: 13px 20px 11px;
  justify-content: space-between;

  .login_txt {
    font-size: 13px;
    font-weight: 400;
    color: #999999;
  }

  .add_btn {
    font-size: 14px;
    font-weight: 400;
    color: #666666;

    .iconfont {
      margin-right: 5px;
    }
  }
}

.form_main {
  height: 100%;
  background-color: #fff;
}

/deep/.u-form-item__body {
  padding-left: 20px!important;
  padding-right: 20px!important;
}

/deep/.u-form-item__body__right__message {
  text-align: right;
}

.btm_btn_box {
  background-color: transparent !important;

  /deep/.u-button {
    width: 100%;
    height: 45px;
    background: #e8e8e8;
    border-radius: 23px;
    color: #fff;
  }
}
</style>