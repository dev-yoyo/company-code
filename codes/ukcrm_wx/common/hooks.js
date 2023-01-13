import store from "@/store";
import { getData } from "@/common/api";

// 返回上一页
export const navBack = () => {
	uni.navigateBack({ delta: 1 });
}

// 授权
export const authStatus = () => {
	const status = store.state.miniStatus
	console.log('vuex >> status >>>>', store.state.miniStatus);

	// return store.commit('loginShow', true)

	// 没授权
	if (status === undefined) {
		console.log('!!!!! 没授权 !!!!!');

		window.location.href = `${store.state.httpUrl}/api/m/redirect`
		let href = window.location.href
		uni.setStorageSync("href", href);
		return false
	} else if (status === 0) {
		console.log('!!!!! 手机号没注册 !!!!!');
		store.commit('loginShow', true)
		return false
	}

	return true
}

//判断是否是微信浏览器
export const isWxBrowser = () => {
	if (window.navigator.userAgent.toLowerCase().match(/MicroMessenger/i) == "micromessenger") {
		return true
	} else {
		return false
	}
}

/**
 * 阿里云 直传文件
 * 
 * 把随机生成的字符串拼接在原始上传文件名后面生成新的唯一文件名
 * 获取后端返回的签名信息，生成oss参数
 */
export const oss = (filename, url, callback, hideload = false) => {
	let accessid = ''
	let policyBase64 = ''
	let signature = ''
	let callbackbody = ''
	let key = ''
	let host = ''
	let g_object_name = ''

	let suffix = get_file_name(filename)
	g_object_name = key + random_string(10) + suffix

	getData(url).then(res => {
		let data = res
		policyBase64 = data['policy']
		accessid = data['accessid']
		signature = data['signature']
		callbackbody = data['callback']
		host = data['host']
		key = data['dir']

		if (filename != null) {
			// //  把随机生成的字符串拼接在原始上传文件名后面生成新的唯一文件名
			let suffix = get_file_name(filename)
			g_object_name = key + random_string(10) + suffix
			// return ''
		}
		// 返回表单上传需要的参数信息
		let call_obj = {
			'host': host,
			'key': g_object_name,
			'policy': policyBase64,
			'OSSAccessKeyId': accessid,
			'success_action_status': '200', // 让服务端返回200,不然，默认会返回204
			'callback': callbackbody,
			'signature': signature
		}
		callback(call_obj)
	})

	// if (hideload) {
	// 	wx.hideLoading()
	// }

	// 生成随机字符串
	function random_string(len) {
		len = len || 32
		var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
		var maxPos = chars.length
		var pwd = ''
		for (let i = 0; i < len; i++) {
			pwd += chars.charAt(Math.floor(Math.random() * maxPos))
		}
		return pwd
	}
	// 获取用户上传原始文件名
	function get_file_name(filename) {
		let pos = filename.lastIndexOf('.')
		let suffix = ''
		if (pos !== -1) {
			suffix = filename.substring(pos)
		}
		return suffix
	}
}

// 获取当前时间
export const getNowDate = (dateVal = new Date()) => {
	let Time = dateVal;
	let y = Time.getFullYear(); //获取完整的年份(4位,1970-????)
	let m = Time.getMonth() + 1; //获取当前月份(0-11,0代表1月)
	let d = Time.getDate(); //获取当前日(1-31)
	let h = Time.getHours();
	let min = Time.getMinutes();
  
	const obj = {
	  y,
	  m: m < 10 ? '0' + m : m,
	  d: d < 10 ? '0' + d : d,
	  h: h < 10 ? '0' + h : h,
	  min: min < 10 ? '0' + min : min
	};
  
	return obj
  }
  
  
// 处理防止多次点击
export function noMultipleClicks(fn, a){
	// fn是需要点击后需要执行的函数， a是点击需要传的参数
	let that = this;
	if (that.noClick) {
		// 第一次点击
		that.noClick= false;
		if(a && a !== '') {
			// a 是执行函数需要传的参数
			fn(a);
		} else {
			fn();
		}
		setTimeout(()=> {
			that.noClick= true;
		}, 2000)
	}
}