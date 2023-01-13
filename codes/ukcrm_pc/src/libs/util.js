
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