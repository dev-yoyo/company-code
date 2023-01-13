import Vue from 'vue'
import App from './App'
import { router, RouterMount } from './router.js'  //路径换成自己的
Vue.use(router)
Vue.config.productionTip = false

// 引入全局uView
// import uView from 'uview-ui'
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

import mixin from './common/mixin'

App.mpType = 'app'

import { noMultipleClicks } from './common/hooks.js'
import store from './store'
// console.log(store.state);

// 登录拦截
// if (!store.state.token) {
//     uni.reLaunch({
//         url: 'pages/login/login',
//     });
// }

// 引入uView提供的对vuex的简写法文件
let vuexStore = require('@/store/$u.mixin.js');
Vue.mixin(vuexStore);
Vue.prototype.$store = store;
Vue.prototype.$noMultipleClicks = noMultipleClicks;


// #ifdef MP
// 引入uView对小程序分享的mixin封装
const mpShare = require('@/uni_modules/uview-ui/libs/mixin/mpShare.js')
// const mpShare = require('uview-ui/libs/mixin/mpShare.js')
Vue.mixin(mpShare)
// #endif
Vue.mixin(mixin)


const app = new Vue({
    store,
    ...App
})

// 引入请求封装
require('./util/request/index')(app)

app.$mount()

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif
