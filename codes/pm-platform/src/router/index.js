import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'

Vue.use(VueRouter)

const baseRoute =[
  {
    path: '/',
    meta: {},
    component: () => import('@/views/home/index.vue')
  },
 
  {
    path: '/login',
    name:'login',
    meta: {},
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/register',
    name:'register',
    meta: {},
    component: () => import('@/views/login/register.vue')
  },
  {
    path: '/home',
    name:'home',
    meta: {},
    component: () => import('@/views/home/index.vue')
  },
  // {
  //   path: '/hall',
  //   name:'hall',
  //   meta: {},
  //   component: () => import('@/views/hall/hall.vue')
  // },
  // {
  //   path: '/hallDetail',
  //   name:'hallDetail',
  //   meta: {},
  //   component: () => import('@/views/hall/hallDetail.vue')
  // },


  {
    path: '/agreement',
    meta: {},
    component: () => import('@/components/agreement.vue')
  },

  {
    name:'404', path: '/404', component: () => import('@/components/base/NotFoundComponent.vue') 
  },


]




const router = new VueRouter({
  saveScrollPosition: true,
  mode: 'history',
  routes:baseRoute.concat(routes)
})

// 解决push同路径跳转报错
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
	return originalPush.call(this, location).catch(err => err)
}

//解决 replace同路径跳转报错
const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}





export default router
