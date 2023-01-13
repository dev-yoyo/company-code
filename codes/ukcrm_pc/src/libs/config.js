export default {
  // 配置显示在浏览器标签的title
  title: '友客帮',
  // token在Cookie中存储的天数，默认1天
  cookieExpires: 3650,
  // api请求基础路径
  baseUrl: {
    dev: 'http://crm.api.dev.ebaina.com/api/web',
    pro: 'http://crm.api.dev.ebaina.com/api/web',
    // pro: 'https://crm.api.ebaina.com/api/web'
  },
  // 默认打开的首页的路由name值，默认为home
  homeName: 'home',
}