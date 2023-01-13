import { RouterMount, createRouter } from 'uni-simple-router';
// import { createRouter, createWebHistory } from 'vue-router'
// import store from './store'

const router = createRouter({
	// history: createWebHistory(),
	platform: process.env.VUE_APP_PLATFORM,
	routes: [
		...ROUTES,
		{
			path: '*',
			redirect: (to) => {
				return { name: 'home' }
			}
		},
	]
});
//全局路由前置守卫
router.beforeEach((to, from, next) => {
	next();
});
// 全局路由后置守卫
router.afterEach((to, from) => {
	// console.log('跳转结束')
})

export {
	router,
	RouterMount
}