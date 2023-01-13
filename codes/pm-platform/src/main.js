import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from '@/libs/config'
import '@/assets/css/common.css'
import '@/assets/css/fontstyle.css'
import '@/assets/css/fontstyle_color.css'
import '@/assets/css/style.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill' // 兼容360 浏览器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from 'axios'
Vue.use(mavonEditor)
import echarts from 'echarts'
import '@/assets/icons/iconfont.js'


//  socket 即时通讯
//main.js
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
    // debug: true,
    connection: 'https://websocket.ebaina.com', //连接的静态地址
}))


// 路由守卫
const { homeName } = config
//它可以结合全局后置守卫一起使用
router.beforeEach((to, from, next) => {
  // 判断登录注册以及首页 不用校验
 
  if (to.path == '/login'||to.path == '/home'||to.path == '/register'||to.path == '/'||to.path == ''|| to.path == '/agreement'|| to.path == '/help') {
    next()
  } else {
    
    var token=store.state.token
    var currentRole= store.state.userInfo.role_id
    // 如果没有token 跳转到注册页面
    if(!token){
      next('/register')
    }else {
      // 1 需要进行权限划分的判断是否符合对应等级
      // 判断是否有role属性以及role的长度不为0
      if (to.meta?.role && to.meta?.role.length) {
        // 判断接口返回的currentRole与路由中设置的权限是否有一个相等 有一个相等则放行 否则404
        var type= to.meta.role.find(item => {
          return currentRole==item
        });
        if(type!=undefined){
          next()
        }else{
          next('/404')
        }
      } else {
        // 不需要的权限划分的不用判断等级 如果页面存在进入页面 页面不存在 进入404页面
        if(to.matched.length === 0){ //没有匹配到当前路由
         next('/404')
          }else{
            next()
          }
      }
    }
  }
})

Vue.prototype.$axios = axios
Vue.prototype.$config = config // 全局注册应用配置
Vue.prototype.$echarts = echarts
// Vue.prototype.$noMultipleClicks = noMultipleClicks

Vue.config.productionTip = false
// 成功提醒
Vue.prototype.$success = function (message, showClose = false, callback, duration = 2000) {
  this.$message({
    message,
    type: 'success',
    duration,
    showClose,
    onClose: callback,
  })
}
// 错误提醒
Vue.prototype.$err = function (message, showClose = false, callback, duration = 2000) {
  this.$message({
    message,
    type: 'error',
    duration,
    showClose,
    onClose: callback,
  })
}
// 警告
Vue.prototype.$warning = function (message, showClose = false, callback, duration = 2000) {
  this.$message({
    message,
    type: 'warning',
    duration,
    showClose,
    onClose: callback,
  })
}
// 普通
Vue.prototype.$msg = function (message, showClose = false, callback, duration = 2000) {
  this.$message({
    message,
    duration,
    showClose,
    onClose: callback,
  })
}

Vue.use(ElementUI);

// 全局注册组件
import leftMenu from "@/components/base/left_menu.vue";
import headNav from "@/components/base/head_nav.vue";
import btmNav from "@/components/base/btm_nav.vue";
import topNav from "@/components/base/top_nav.vue";
Vue.component('leftMenu', leftMenu)
Vue.component('headNav', headNav)
Vue.component('btmNav', btmNav)
Vue.component('topNav', topNav)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
