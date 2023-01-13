<template>
  <div class="change_company">
    <el-popover
      placement="right-start"
      width="332"
      trigger="click"
      popper-class="popover_box"
    >
      <div class="company d-flex" slot="reference" @click="show_choose" >
        <img
          :src="company_logo"
        />
        <div class="txt">
          {{ company_name }}
        </div>
      </div>

      <div class="popup_box">
        <div class="company_list">
          <div
            class="item d-between"
            v-for="(v, i) in list"
            :key="i"
            @click="change(v)"
          >
            <div class="l_name d-flex">
              <img
                :src="
                  v.company
                    ? v.company.logo
                    : 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3brpWtbTWtTRTNdrFhrf4ZAnPNeMaN5P1642730874790.png'
                "
              />
              <div class="txt">
                {{ v.company ? v.company.name : "" }}
                <div class="role_name">{{ v.role_name || "" }}</div>
              </div>
            </div>

            <i class="iconfont icon-ykb-ql"></i>
          </div>
        </div>

        <div class="create_item d-center" @click="create">
          <i class="iconfont icon-a-zu2073"></i>
          创建/加入企业
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script>
// import minLogo from "@/assets/images/logo-min.jpg";
import { getData, postData } from "@/api/user";
import store from "@/store";

export default {
  data() {
    return {
      showChoose: false,
      list: [],
      user: {},
      role_id: 0,
      company:'',
      company_logo:'',
      company_name:'',
    };
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      getData({
        url: "/user",
      }).then((res) => {
        const {
          code,
          data: { user },
        } = res;
        if (code === 200) {
          this.user = user
          this.role_id = this.user.role_id || 0;
          this.$store.commit("setUserInfo", user);
          
          this.company = this.user.company
          if(this.role_id) {
            this.company_logo = this.company.logo || 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3brpWtbTWtTRTNdrFhrf4ZAnPNeMaN5P1642730874790.png'
            this.company_name = this.company.name || '暂无企业'
          }else {
            this.company_logo = 'https://ebaina.oss-cn-hangzhou.aliyuncs.com/direct/resource/202201/21/3brpWtbTWtTRTNdrFhrf4ZAnPNeMaN5P1642730874790.png'
            this.company_name = '暂无企业'
          }

        }
      });
    },
    showList() {
      getData({
        url: "/user/swith_company_list",
        data: {},
      }).then((res) => {
        const {
          code,
          data: { list },
        } = res;
        if (code === 200) {
          this.list = list;

          let id = this.user.company_id;
          list.map((e) => {
            if (id == e.id) {
              this.$store.commit("setCompany", e);
            }
          });
        }
      });
    },

    show_choose() {
      this.showChoose = !this.showChoose;

      if (!this.showChoose) return;
      this.showList();
    },

    change(v) {
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
          getData({ url: "/user" }).then((res) => {
            const {
              code,
              data: { user },
            } = res;
            if (code === 200) {
              // this.$store.commit("setUserInfo", user);
              this.$store.commit("setCompany", v);
              this.$router.push({
                path: "/home",
              });
            }
          });

          this.$success(msg, "", () => {
            window.location.reload();
            this.showChoose = !this.showChoose;
          });
        } else if (code === 422) {
          this.$err(msg);
        }
      });
    },

    create() {
      this.$router.push({
        path: "/company_create",
        query: {
          from: "home",
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.change_company {
  position: fixed;
  left: 23px;
  bottom: 3%;
  z-index: 9999999;

  .company {
    padding: 0 8px;
    width: 193px;
    height: 47px;
    background: #5765a5;
    box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    cursor: pointer;

    img {
      margin-right: 8px;
      width: 31px;
      height: 31px;
      background: #fff;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
      flex-shrink: 0;
    }

    .txt {
      font-size: 12px;
      font-weight: 400;
      color: #ffffff;
    }
  }
}

.popup_box {
  padding: 24px 0;
  padding: 20px 0 !important;
  border-radius: 18px !important;
  box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
  border: 1px solid #d7dde5;
  background: #fff;
  position: absolute;
  width: 100%;
  bottom: 0;

  .company_list {
    padding: 0 24px;
    max-height: 400px;
    overflow-y: auto;
    .item {
      margin-bottom: 18px;
      padding: 0 17px 0 11px;
      // width: 284px;
      height: 61px;
      background: #fff;
      box-shadow: 0px 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      cursor: pointer;

      .l_name {
        img {
          margin-right: 8px;
          width: 48px;
          height: 48px;
          background: #fff;
          border: 1px solid #e8e8e8;
          border-radius: 10px;
        }

        .txt {
          font-size: 12px;
          font-weight: 400;
          color: #657180;

          .role_name {
            margin-top: 5px;
            font-size: 12px;
            font-weight: 400;
            line-height: 17px;
            color: #657180;
          }
        }
      }
    }

    :last-child {
      margin-bottom: 3px;
    }
  }

  .create_item {
    margin: 18px 24px 0;
    height: 61px;
    background: #f2f2f2;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #657180;
    cursor: pointer;

    .iconfont {
      margin-right: 8px;
    }
  }
}
</style>

<style lang="less">
.popover_box {
  background: transparent;
  border-radius: 0 !important;
  box-shadow: none;
  border: none;
  padding: 0;
  min-height: 520px;
}
</style>