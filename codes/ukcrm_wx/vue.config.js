const TransformPages = require('uni-read-pages')
const { webpack } = new TransformPages()

module.exports = {
    // 配置路径别名
    configureWebpack: {
        devServer: {
            // 调试时允许内网穿透，让外网的人访问到本地调试的H5页面
            disableHostCheck: true
        },
        plugins: [
            new webpack.DefinePlugin({
                ROUTES: webpack.DefinePlugin.runtimeValue(() => {
                    const tfPages = new TransformPages({
                        includes: ['path', 'name', 'aliasPath']
                    });
                    return JSON.stringify(tfPages.routes)
                }, true)
            })
        ]
    },
    pluginOptions: {
        webpackBundleAnalyzer: {
            openAnalyzer: process.env.NODE_ENV === 'production'
        }
    },
}
 