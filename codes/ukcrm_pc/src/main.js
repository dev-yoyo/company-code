import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import config from '@/libs/config'
import '@/assets/css/common.css'
import '@/assets/css/fontstyle.css'
import '@/assets/css/fontstyle_color.css'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'babel-polyfill' // 兼容360 浏览器
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
import echarts from 'echarts'
import VueSocketIO from 'vue-socket.io'
Vue.use(new VueSocketIO({
    // debug: true,
    // connection: 'http://121.40.52.209:2345', //连接的静态地址
    connection: 'https://websocket.ebaina.com', //连接的静态地址

}))


// 路由守卫
const { homeName } = config
// const LOGIN_PAGE_NAME = 'login'
// router.beforeEach((to, from, next) => {
//   // 设置浏览器title
//   document.title = '监控管理平台'

//   let islogin = localStorage.getItem("isLogin")

//   if (to.path === '/login') {
//     if (islogin === '1') {
//       next({ name: homeName })
//     } else {
//       next()
//     }
//   } else {
//     if (islogin === '1') {
//       next()
//     } else {
//       next('/login')
//     }
//   }
// })

Vue.prototype.$config = config // 全局注册应用配置
Vue.prototype.$echarts = echarts
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
import settingMenu from '@/components/base/setting_menu.vue';
import topNav from "@/components/base/top_nav.vue";
Vue.component('leftMenu', leftMenu)
Vue.component('settingMenu',settingMenu)
Vue.component('topNav', topNav)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
