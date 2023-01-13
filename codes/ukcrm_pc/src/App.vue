<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import store from '@/store'
export default {
  name: "app",
  data() {
    return {
      login: false,
      cr_params: ''
    };
  },
  created() {
    this.$store.commit('msgShow', false)
    // 打包生产时可以执行以下代码
    this.cr_params = process.env.NODE_ENV === "development"
      ? 'crm_dev_'
      : 'crm_production_';
      // 打包测试服需手动更改
      // this.cr_params='crm_dev_'
      // console.log(this.cr_params);
  },


  computed: {
    islogin() {
      let flag = localStorage.getItem("isLogin");
      return true
      // return flag === "1" ? true : false;
    },
  },
  
  sockets: {
    connecting() { console.log('正在连接') },
    connect() {
      console.log('连接成功');
      // console.log('当前用户ID：', store.state?.userInfo?.id);
      // console.log('当前用户所在公司ID：', store.state?.company?.company?.id);
      if (store.state?.userInfo?.id) {
        this.$socket.emit('login', this.cr_params + store.state?.userInfo?.id);
      }
    },
    disconnect() { console.log('断开连接') },
    connect_failed() { console.log('连接失败') },
    error() { console.log('错误发生，并且无法被其他事件类型所处理') },
    reconnecting() { console.log('正在重连') },
    reconnect_failed() { console.log('重连失败') },
    reconnect() {
      console.log('重连成功');
      if (store.state?.userInfo?.id) {
        this.$socket.emit('login', this.cr_params + store.state?.userInfo?.id);
      }
    },
    new_msg(data) {//全局监听订阅事件，名字需要与后端约定好
      var msg = JSON.parse(data)
      // console.log('推送过来的数据：',msg);
      // socket 类型 要弹窗
      this.$store.commit('SocketMsg', msg)
      // console.log('当前用户所在公司ID：', store.state?.company?.company?.id);
      // ------1---- 判断当前用户的公司是否与socket 推送的公司id 一致
      if (msg.company_id == store.state?.company?.company?.id) {

        //14 移交客户 0 申请加入企业  1 邀请加入企业 20 跟进评论 9 指派客户提醒 2 报价申请
        let popArr = ['14', '0', '20', '9', '2', '10']

        if (popArr.includes(msg.content_type)) {

          this.socketM1(msg)
        }
        // if (msg.content_type == '14' || msg.content_type == '0' || msg.content_type == '20' || msg.content_type == '9' || msg.content_type == '2' || msg.content_type == '10') {
        //   this.socketM1(msg)
        // }

      }
      //-----2---- 未加入企业 无需匹配公司
      // 4  申请加入企业被拒绝 16 成功加入企业提醒 3 邀请加入企业被拒绝 7 移除企业 无需跳转
      if (msg.content_type == '4' || msg.content_type == '16' || msg.content_type == '3' || msg.content_type == '7') {

        this.socketM2(msg)
      }
      // 1 邀请加入企业 需要跳转
      if (msg.content_type == '1') {
        this.socketM1(msg)

      }


    }
  },
  methods: {
    socketM2(msg) {
      let title = ''
      if (msg.content_type == '4') {
        title = '申请加入企业被拒绝'
      } else if (msg.content_type == '16') {
        title = '成功加入企业'
      } else if (msg.content_type == '3') {
        title = '您的邀请已被拒绝'
      } else if (msg.content_type == '7') {
        title = '移除企业'
      }

      this.$notify({
        title: title,
        dangerouslyUseHTMLString: true,
        customClass: 'socket-message socket-message-nc',
        message: `<p class="desc">` + msg.content + `</p>`,
        duration: 0,
        position: 'bottom-right',
      });
    },
    socketM1(msg) {
      let title = ''
      if (msg.content_type == '20') {
        title = '跟进评论'
      } else if (msg.content_type == '9') {
        title = '分配客户'
      } else if (msg.content_type == '14') {
        title = '移交客户'
      } else if (msg.content_type == '0') {
        title = '申请加入企业'
      } else if (msg.content_type == '1') {
        title = '邀请加入企业'
      } else if (msg.content_type == '2') {
        title = '报价申请'
      } else if (msg.content_type == '10') {
        title = '报价申请通过'
      }

      var this_ = this
      this.$notify({
        title: title,
        dangerouslyUseHTMLString: true,
        customClass: 'socket-message',
        message: `<p class="desc">` + msg.content + `</p><p class="check"><a href="#">查看>></a></p>`,
        duration: 0,
        position: 'bottom-right',
        onClick() {
          this_.jump(msg)

        }
      });
    },
    jump(msg) {
      if (msg.id) {
        if (msg.content_type == '20' || msg.content_type == '14' || msg.content_type == '9') {
          window.location.href = '/my_customer_detail?customer_id=' + msg.id
        }
        // 报价申请通过
        if (msg.content_type == '10') {
          window.location.href = '/offer?offerShow=' + msg.id
        }
      } else {
        //14  移交客户  9 分配客户
        if ((msg.content_type == '14' || msg.content_type == '9')) {
          window.location.href = '/my_customer'
        }
        // msg.content_type == '0' && msg.message_type == '0' 该类型消息为每天定时推送的消息  1 邀请加入企业 2 报价申请
        if ((msg.content_type == '0' && msg.message_type == '0') || msg.content_type == '1' || msg.content_type == '2') {
          this.$store.commit('msgShow', true)
          // console.log(store.state.msgShow);
        }
      }
      this.$notify.closeAll()
    }


  }
};
</script>

<style lang="less">
#app {
  width: 100%;
  min-height: 100vh;
}

// 筛选时间 窗口宽度  公共
.popover_date {
  width: 390px !important;
}
</style>


