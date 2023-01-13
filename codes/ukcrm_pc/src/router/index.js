import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routers'
import setting from './setting'

Vue.use(VueRouter)

const baseRoute =[
  { path: '*', component: () => import('@/components/base/NotFoundComponent.vue') },
  {
    path: '/login',
    meta: {},
    component: () => import('@/views/login/login.vue')
  },
  {
    path: '/register',
    meta: {},
    component: () => import('@/views/login/register.vue')
  },
  {
    path: '/forget',
    meta: {},
    component: () => import('@/views/login/forget.vue')
  },
  {
    path: '/company_choose',
    meta: {},
    component: () => import('@/views/login/company_choose.vue')
  },
  {
    path: '/company_create',
    meta: {},
    component: () => import('@/views/login/company_create.vue')
  },
  {
    path: '/agreement',
    meta: {},
    component: () => import('@/components/agreement.vue')
  },
  {
    path: '/policy',
    meta: {},
    component: () => import('@/components/policy.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: () => import('@/views/home/index.vue')
  },
  {
    path: '/visit',
    meta: {},
    component: () => import('@/views/visit/index.vue')
  },
  {
    path: '/basic',
    meta: {},
    component: () => import('@/views/user/basic.vue')
  },
  {
    path: '/account',
    meta: {},
    component: () => import('@/views/user/account.vue')
  },
  {
    path: '/branch',
    meta: {},
    component: () => import('@/views/branch/index.vue')
  },
  {
    path: '/approve',
    meta: {},
    component: () => import('@/views/approve/index.vue')
  }
]

const router = new VueRouter({
  saveScrollPosition: true,
  mode: 'history',
  routes:baseRoute.concat(routes).concat(setting)
})

// 解决同路径跳转报错
// const originalPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


export default router
