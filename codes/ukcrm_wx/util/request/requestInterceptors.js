/**
 * 请求拦截
 * @param {Object} http
 */
module.exports = (vm) => {
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
        // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
        config.data = config.data || {}
		// if(config.params && config.params.page && config.params.page != 1) {
			
			
		// }
		// console.log('data数据 >>>', config);
        // 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
        config.header.authorization = vm.$store.state.vuex_token ? 'Bearer ' + vm.$store.state.vuex_token : ''
        console.log('vm.$store.state >>>', vm.$store.state);

        return config
    }, (config) => // 可使用async await 做异步操作
		// setTimeout(() =>{
		// 	uni.hideLoading()
		// },1000)
        Promise.reject(config))
}
