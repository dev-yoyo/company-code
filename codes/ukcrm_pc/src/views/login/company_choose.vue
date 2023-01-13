<template>
  <div class="company_choose">
    <div class="main_box">
      <img
        class="company_logo"
        src="https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/ykb-logo.png"
      />
      <div class="company_box">
        <div class="company_title" @click="back()">
          <i class="iconfont icon-ykb-fh"></i>选择你登录的企业
        </div>
        <div class="company_list">
          <div
            class="company_item d-between"
            v-for="(item, index) in company_list"
            :key="index"
            @click="to(item)"
            v-if="company_show"
          >
            <img :src="item.company && item.company.logo" alt="友客帮" />
            <div class="name">{{ item.company && item.company.name }}</div>
            <i class="iconfont icon-ykb-ql"></i>
          </div>
        </div>
      </div>
      <div class="company_agree">
        登录即代表同意<router-link class="action" to="/agreement"
          >《用户协议》</router-link
        >及<router-link class="action" to="/policy">《隐私政策》</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { getData, postData } from "@/api/user";

export default {
  name: "company_choose",
  data() {
    return {
      company_list: [],
      company_show: false,
    };
  },
  created() {
    this.get_list();
  },
  methods: {
    get_list() {
      getData({
        url: "/user/swith_company_list",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { msg, list },
        } = res;
        if (code === 200) {
          this.company_list = list;
          this.company_show = true
        } else {
          this.company_show = false
          this.$err(msg);
        }
      });
    },
    to(v) {
      postData({
        url: "/user/swith_company",
        data: {
          company_id: v.company_id,
        },
      }).then((res) => {
        const {
          code,
          data: { msg },
        } = res;
        if (code === 200) {
          // this.$success(msg);
          // setTimeout(()=>{
          this.$store.commit("setCompany", v);
          // this.$router.replace({ path: "/home" });
          window.location.href='/home'
          
          window.scrollTo(100, 0);
          

          // },1500)
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less">
.company_choose {
  width: 100%;
  height: 100vh;
  background-image: url("https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202204/18/%E5%9B%BE%E7%89%87/dly-bg.png");
  background-size: cover;
  background-position: center;
  position: relative;

  .main_box {
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);

    .company_logo {
      display: block;
      margin: 0 auto 24px;
      text-align: center;
    }

    .company_box {
      width: 455px;
      height: auto;
      background: #fff;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 18px;
      padding: 68px 79px 64px;
    }

    .company_title {
      font-size: 20px;
      font-weight: 600;
      line-height: 28px;
      color: #464c5b;
      margin-bottom: 4px;

      .iconfont {
        margin-right: 8px;
        cursor: pointer;
      }
    }

    .company_list {
      height: 380px;
      overflow-x: hidden;
      overflow-y: auto;
      margin-top: 42px;
      padding: 2px 7px 4px 2px;
    }

    .company_item {
      height: 61px;
      background: #fff;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      margin-bottom: 18px;
      padding: 8px 17px 5px 11px;
      cursor: pointer;

      img {
        width: 48px;
        height: 48px;
        border: 1px solid #e8e8e8;
        border-radius: 10px;
        margin-right: 8px;
      }

      .name {
        width: 134px;
        font-size: 12px;
        font-weight: 400;
        line-height: 17px;
        color: #657180;
      }

      .iconfont {
        font-size: 18px;
        color: #464c5b;
      }
    }

    .company_agree {
      text-align: center;
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #657180;
      margin-top: 30px;
    }

    .action {
      font-size: 12px;
      font-weight: 400;
      line-height: 17px;
      color: #3399ff;
      cursor: pointer;
      text-decoration: none;
    }

    .get_q_code {
      width: auto;
      height: 32px;
      background: #4d6fff;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 400;
      line-height: 32px;
      color: #ffffff;
      padding: 0 10px;
      margin-left: 17px;
    }
  }
}
</style>s