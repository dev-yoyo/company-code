<template>
  <div id="app">
    <!-- <transition :name="transitionName"> -->
    <router-view class="child-view" v-if="isRouterAlive"></router-view>
    <!-- </transition> -->
  </div>
</template>
<script>
import store from './store'
import { postData, getData } from "@/api/user";

export default {
  name: "app",
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      login: false,
      transitionName: 'slide-left',
      isRouterAlive: true,
      cr_environment:''
    };
  },

  created(){
    //  this.cr_environment=  process.env.NODE_ENV === "development"
    //     ? 'project_dev_'
    //     : 'project_production_';
        this.cr_environment='project_dev_'
  },

  sockets: {
    connecting() { console.log('正在连接') },
    connect() {
      console.log('连接成功');
      console.log('当前用户ID：', store.state?.userInfo?.id);
      if (store?.state?.userInfo.id) {
        this.$socket.emit('login', this.cr_environment + store.state.userInfo.id);

      }
    },
    disconnect() { console.log('断开连接') },
    connect_failed() { console.log('连接失败') },
    error() { console.log('错误发生，并且无法被其他事件类型所处理') },
    reconnecting() { console.log('正在重连') },
    reconnect_failed() { console.log('重连失败') },
    reconnect() {
      console.log('重连成功');
      if (store?.state?.userInfo.id) {
        this.$socket.emit('login', this.cr_environment + store.state.userInfo.id);
      }
    },
    new_msg(data) {//全局监听订阅事件，名字需要与后端约定好
      var msg = JSON.parse(data)
      console.log(msg);
      // socket 类型 要弹窗
      if (msg.method == 'warning_message_pop') {
        //  项目预警 跳转项目详情
        // project_detail project_center
        if (msg.jump_to == 'project_detail') {
          this.socketM1(msg);
        } else if (msg.jump_to == 'project_center') {
          this.socketM1(msg);
        } else {
          this.socketM2(msg.type, msg.str);
        }
      } 
       if (msg.method == 'warning_message_count') {
      
        store.commit('SocketNum', msg)
      }
    }
  },
  methods: {
    socketM2(title = '', desc = '') {
      this.$notify({
        title: title,
        dangerouslyUseHTMLString: true,
        customClass: 'socket-message socket-message-nc',
        message: `<h4>` + title + `</h4><p class="desc">` + desc + `</p>`,
        duration: 0,
        position: 'bottom-right',
      });
    },
    socketM1(msg) {
      this.$notify({
        title:  msg.type,
        dangerouslyUseHTMLString: true,
        customClass: 'socket-message',
        message: `<p class="desc">` +  msg.str + `</p><p class="check"><a href="#">查看>></a></p>`,
        duration: 0,
        position: 'bottom-right',
        onClick() {
        let data={
          warning_message_type:msg.warning_message_type,
          warning_message_id:msg.id
        }
        postData({
          url: "/user/project_warning/clear_one",
          data
        }).then((res) => {
          if(res.code==200){
            store.commit('SocketNum',res.data)
          if (msg.jump_to == 'project_detail') {
            // ------注意！！！！-----与后端确认过 project_id取外层-----------
            window.location.href='/workbench/projectDetail?id='+ msg.project_id
          } else if (msg.jump_to == 'project_center') {
            window.location.href='/workbench/hall'
          }
          }
        
        });
            
        }
      });
    },
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function () {
        window.location.reload()
        this.isRouterAlive = true;
      })
    },


  },
  computed: {
    islogin() {
      let flag = localStorage.getItem("isLogin");
      return true
      // return flag === "1" ? true : false;
    },
  },
  watch: {
    '$route'(to, from) {
      if (to.path == '/') {
        this.transitionName = 'slide-right';
      } else {
        this.transitionName = 'slide-left';
      }
    }
  }
};
</script>

<style lang="less">
#app {
  width: 100%;
  min-width: 1300px;
  min-height: 100vh;
}

// 筛选时间 窗口宽度  公共
.popover_date {
  width: 390px !important;
}

.child-view {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transition: all .5s cubic-bezier(.55, 0, .1, 1);
}

.slide-left-enter,
.slide-right-leave-active {
  opacity: 0;
  -webkit-transform: translate(30px, 0);
  transform: translate(30px, 0);
}

.slide-left-leave-active,
.slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-30px, 0);
  transform: translate(-30px, 0);
}

::-webkit-scrollbar {
  // 最外层盒子
  width: 8px; // 滚动条最外层盒子宽度
  height: 5px;
}

::-webkit-scrollbar-thumb {
  // 移动指示条盒子
  border-radius: 5px;
  /* -webkit-box-shadow: inset 0 0 5px #999; */
  background-color: #ccc;
}

::-webkit-scrollbar-track {
  // 指示条下面的背景盒子
  -webkit-box-shadow: inset 0 0 5px #ccc;
  border-radius: 5px;
  background-color: #eee;
}
</style>


