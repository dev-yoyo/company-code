var htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  lintOnSave: false,  // 关闭代码检查
  productionSourceMap:false,//控制是否在生产环境下生成map文件
    configureWebpack:{
      plugins: [
        new htmlWebpackPlugin({
            template: 'public/index.html',
        })
       ]
    }
}