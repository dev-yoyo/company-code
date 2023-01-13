
import Cookies from 'js-cookie'
// cookie保存的天数
import config from '@/libs/config'
const { title, cookieExpires } = config

export const TOKEN_KEY = 'firendCRM_token'

export const setTokens = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: cookieExpires || 1 })
}

export const getTokens = () => {
  const token = Cookies.get(TOKEN_KEY)
  if (token) return token
  else return false
}

/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute, vm)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
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
    // 日期格式化
export const  dateFormat =(dateData=> {
        var date = new Date(dateData)
        var y = date.getFullYear()
        var m = date.getMonth() + 1
        m = m < 10 ? ('0' + m) : m
        var d = date.getDate()
        d = d < 10 ? ('0' + d) : d
        var H = date.getHours().toString()
        H = H < 10 ? ('0' + H) : H
        var M = date.getMinutes().toString()
        M = M < 10 ? ('0' + M) : M
        var S = date.getSeconds().toString()
        S = S < 10 ? ('0' + S) : S
        const time = y + '-' + m + '-' + d + ' ' + H + ':' + M + ':' + S
        return time
    })

// export const noMultipleClicks = (fn, ...args) => {
	// fn是需要点击后需要执行的函数， a是点击需要传的参数
	// let that = this;
	// if (that.noClick) {
	// 	// 第一次点击
	// 	that.noClick= false;
	// 	if(a && a !== '') {
	// 		fn(a);
	// 	} else {
	// 		fn();
	// 	}
	// 	setTimeout(()=> {
	// 		that.noClick= true;
	// 	}, 2000)
	// }
// 	if (that.noClick) {
//         that.noClick= false;
// 		// method.apply(that, args)
// 		// fn.apply(that, ...args)
//         fn(...args);
//         setTimeout(function () {
//             that.noClick= true;
//         }, 2000)
//     } else {
//         console.log("请稍后点击")
//     }
// }
	// 防抖是关注于最后一次的事件触发，而节流则是在规定的时间里只执行一次。
	// 节流来解决滚动条案例
    // 处理防止多次点击   输入框 防抖
// 防止重复执行点击指令
// export default {
//     install(Vue) {
//         // 防止重复点击
//         Vue.directive('preventReClick', {
//             inserted(el, binding) {
//                 el.addEventListener('click', () => {
//                     if (!el.disabled) {
//                         el.disabled = true;
//                         setTimeout(() => {
//                             el.disabled = false;
//                         }, binding.value || 1000)
//                     }
//                 })
//             }
//         })
//     }
// }