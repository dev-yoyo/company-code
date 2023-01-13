export default {
  // 配置显示在浏览器标签的title
  title: '线上项目',
  // token在Cookie中存储的天数，默认1天
  cookieExpires: 3650,
  // api请求基础路径
  baseUrl: {
    dev: 'http://project.dev.ebaina.com/api',
    pro: 'http://project.dev.ebaina.com/api',

    // dev: 'http://pm.api.ebaina.com/api',
    // pro: 'http://pm.api.ebaina.com/api',
  },
  // 默认打开的首页的路由name值，默认为home
  homeName: 'home',
}