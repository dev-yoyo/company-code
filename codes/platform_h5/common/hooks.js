import store from "@/store";

export function navigateTo(path) {
	if (
		path.indexOf('pages/home/index') != -1 ||
		path.indexOf('pages/ask/index') != -1 ||
		path.indexOf('pages/ai/index') != -1 ||
		path.indexOf('pages/msg/index') != -1 ||
		path.indexOf('pages/my/index') != -1
	) {
		return uni.switchTab({
			url: path,
		});
	}

	return uni.navigateTo({
		url: path,
	});
}

export function reLaunch(path) {
	return uni.reLaunch({
		url: path,
	});
}

// 获取某天的日期
export const getDateStr = (AddDayCount) => {
	var dd = new Date();
	dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
	let y = dd.getFullYear();
	let m = dd.getMonth() + 1 < 10 ? "0" + dd.getMonth() + 1 : dd.getMonth() + 1; //获取当前月份的日期
	let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
	let w = dd.getDay();
	let str = "";

	switch (w) {
		case 0:
			str += "日";
			break;
		case 1:
			str += "一";
			break;
		case 2:
			str += "二";
			break;
		case 3:
			str += "三";
			break;
		case 4:
			str += "四";
			break;
		case 5:
			str += "五";
			break;
		case 6:
			str += "六";
			break;
	}
	return {
		y,
		m,
		d,
		w: str,
	};
}

// 时间格式 分解
export const getDate = (time) => {
	let Time = new Date(time);
	let y = Time.getFullYear(); //获取完整的年份(4位,1970-????)
	let m = Time.getMonth() + 1; //获取当前月份(0-11,0代表1月)
	let d = Time.getDate(); //获取当前日(1-31)
	// let h = Time.getHours() < 10 ? "0" + Time.getHours() : Time.getHours();
	// let min = Time.getMinutes() < 31 ? "00" : "30";

	return {
		y,
		m,
		d,
	};
}

// 倒计时
export const intervalTime = (presell_end_date) => {
	if(!presell_end_date){return;}
	// console.log("intervalTime>>", presell_end_date);
	// presell_end_date = "2021-11-5";
	var nowtime = new Date(), //获取当前时间
		endtime = new Date(Date.parse(presell_end_date.replace(/-/g, "/"))); //定义结束时间
	endtime.setDate(endtime.getDate() + 1);

	if (endtime.getTime() >= nowtime.getTime()) {
		var lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
			leftd = Math.floor(lefttime / (1000 * 60 * 60 * 24)), //计算天数
			lefth = Math.floor((lefttime / (1000 * 60 * 60)) % 24), //计算小时数
			leftm = Math.floor((lefttime / (1000 * 60)) % 60), //计算分钟数
			lefts = Math.floor((lefttime / 1000) % 60); //计算秒数

		let d = format(leftd),
			h = format(lefth),
			m = format(leftm),
			s = format(lefts);

		// console.log(2222222222222, d, h, m, s);

		let obj = {
			d, h, m, s
		}

		// console.log(obj);

		return obj
	} else {
		console.log("倒计时结束");
		return false
	}
}

export const format = (date) => {
	return date < 10 ? "0" + date : date;
}


// 获取url 参数
export function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return '';
}

// 授权
export const authStatus = () => {
	const status = store.state.status
	console.log('vuex >> status >>>>', store.state.status);

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