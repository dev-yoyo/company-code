import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

let lifeData = {
	// vuex_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wbGF0Zm9ybS5sb2NhbC5lYmFpbmEuY29tXC9hcGlcL21cL2FzayIsImlhdCI6MTYzNTIxMDExNiwiZXhwIjoxNjU2ODEwMTE2LCJuYmYiOjE2MzUyMTAxMTYsImp0aSI6IjRpbjRrTzJGanc0THgySEIiLCJzdWIiOjIwMDAwMDAwMDAwNCwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.2ZiJmRH_9f96FNvhkJvt0NDZJsLyGT8208BODXClND8"
	// vuex_token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9wbGF0Zm9ybS5kZXYuZWJhaW5hLmNvbVwvYXBpXC9tXC9nZXRfdG9rZW5fYnlfaWRcLzIwMDAwMDAwMDAwMSIsImlhdCI6MTY2Nzc4ODU5MCwiZXhwIjoxNjg5Mzg4NTkwLCJuYmYiOjE2Njc3ODg1OTAsImp0aSI6IkRxcG1tWXZUUWtyRlNrd3AiLCJzdWIiOjIwMDAwMDAwMDAwMSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.r396vptxCAMLVFQmarjekzwkKFSCPXxdtg5qgS2n1fs"

};

try {
	// 尝试获取本地是否存在lifeData变量，第一次启动APP时是不存在的
	lifeData = uni.getStorageSync('lifeData');
	// lifeData = JSON.parse(uni.getStorageSync('lifeData'));
} catch (e) {
}

// 需要永久存储，且下次APP启动需要取出的，在state中的变量名
let saveStateKeys = ['vuex_user', 'vuex_token', 'status', 'openid', 'provider'];

// 保存变量到本地存储中
const saveLifeData = function (key, value) {
	// 判断变量名是否在需要存储的数组中
	if (saveStateKeys.indexOf(key) != -1) {
		// 获取本地存储的lifeData对象，将变量添加到对象中
		let tmp = uni.getStorageSync('lifeData');
		// 第一次打开APP，不存在lifeData变量，故放一个{}空对象
		tmp = tmp ? tmp : {};
		tmp[key] = value;
		// 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
		uni.setStorageSync('lifeData', tmp);
	}
}

const store = new Vuex.Store({
	state: {
		// 如果上面从本地获取的lifeData对象下有对应的属性，就赋值给state中对应的变量
		// 加上vuex_前缀，是防止变量名冲突，也让人一目了然
		vuex_user: lifeData.vuex_user ? lifeData.vuex_user : {},
		vuex_token: lifeData.vuex_token ? lifeData.vuex_token : '',
		status: lifeData.status,
		openid: lifeData.openid ? lifeData.openid : '',
		provider: lifeData.provider ? lifeData.provider : '',
		loginShow: false,
		httpUrl: 'http://platform.dev.ebaina.com', // 打包地址：http://m.dev.ebaina.com
		// httpUrl: 'https://m.api.ebaina.com', // 打包地址：https://m.ebaina.com
	},
	mutations: {
		$uStore(state, payload) {
			// 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
			let nameArr = payload.name.split('.');
			let saveKey = '';
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
				saveKey = nameArr[0];
			} else {
				// 单层级变量，在state就是一个普通变量的情况
				state[payload.name] = payload.value;
				saveKey = payload.name;
			}
			// 保存变量到本地，见顶部函数定义
			saveLifeData(saveKey, state[saveKey])
		},
		loginShow(state, data) {
			state.loginShow = data
		}
	},
	actions: {
		// 登录
		// handleLogin({ commit }, info) {
		// 	console.log('handleLogin------', info);

		// 	let href = uni.getStorageSync("href");
		// 	let index = href.indexOf("pages");
		// 	let url = href.substring(index);
		// 	navigateTo("/" + url);
		// 	uni.removeStorage({ key: 'href' });
		// },
		// 退出登录
		handleLogOut() {
			// commit('setToken', '')
			//   localStorage.removeItem('aiborui_store_user', '')
			// window.location.href = '/'

			uni.clearStorage();
			// navigateTo("/");
			this.$Router.push({
				name: 'home'
			})
		},
	},
	getters: {
		loginShow: state => {//通过方法访问
			return state.loginShow
			// get() {
			// 	return state.loginShow
			// },
			// set(val) {
			// 	return state.loginShow
			// },
		},
	}
})

export default store
