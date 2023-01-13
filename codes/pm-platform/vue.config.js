module.exports = {
    // devServer: {
    //     open: true, // 配置项目在启动时自动在浏览器打开
    //     proxy: {
    //         '/api' : { // '/api'是代理标识，一般是每个接口前的相同部分
    //             target: "http://project.dev.ebaina.com/api", // 请求地址，一般是服务器地址
    //             //  target: "http://pm.api.ebaina.com/api", // 请求地址，一般是服务器地址                 
    //             changeOrigin: true, // 是否进行跨域
    //             // pathRewrite: { // pathRewrite的作用是把请求接口中的 '/api'替换掉，一般是替换为空""
    //             //     '^/api':""
    //             // }
    //         }
    //     },
    //     host:'localhost',
    // },
    productionSourceMap:false,//控制是否在生产环境下生成map文件
    // chainWebpack(config) {
    //     if (IS_PRODUCTION) {
    //         config.plugin('html').tap(args => {
    //             args[0].cdn = cdn
    //             return args
    //         })
    //         //视为一个外部库，而不将它打包进来
    //         config.externals(externals)
    //     }
    // }  
}
// //生产环境标记
// const IS_PRODUCTION = process.env.NODE_ENV === 'production'
// //配置引用cdn的js、css地址
// const cdn = {
//     css: [
//         'https://unpkg.com/element-ui@2.13.2/lib/theme-chalk/index.css'
//     ],
//     js: [
//         'https://cdn.bootcdn.net/ajax/libs/vue/2.6.10/vue.min.js',
//         'https://cdn.bootcdn.net/ajax/libs/vue-router/3.0.2/vue-router.min.js',
//         'https://cdn.bootcdn.net/ajax/libs/vuex/3.1.0/vuex.min.js',
//         'https://cdn.bootcdn.net/ajax/libs/axios/0.18.1/axios.min.js',
//         'https://unpkg.com/element-ui@2.13.2/lib/index.js',
//         'https://cdn.bootcdn.net/ajax/libs/echarts/5.0.1/echarts.min.js'
//     ]
// }
// //配置打包时使用CDN节点（加入externals外部扩展）， 忽略打包的第三方库
// //左面放package.json中的扩展的名称,右面放项目依赖的名称(项目初始化要用的名称)
// const externals = {
//   // 属性名称 vue, 表示遇到 import xxx from 'vue' 这类引入 'vue'的，不去 node_modules 中找，而是去找全局变量 Vue（其他的为VueRouter、Vuex、axios、ELEMENT、echarts，注意全局变量是一个确定的值，不能修改为其他值，修改为其他大小写或者其他值会报错，若有异议可留言）
//     vue: 'Vue',
//     'vue-router': 'VueRouter',
//     vuex: 'Vuex',
//     axios: 'axios',
//     'element-ui': 'ELEMENT',
//     'echarts': 'echarts'
// }
    
