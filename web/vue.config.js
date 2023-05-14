// 导包
const autoprefixer = require('autoprefixer')
// 导包
const pxtorem = require('postcss-pxtorem')
const path = require('path')

// 暴露出去
module.exports = {
    // css属性如何处理
    css: {
        // 处理的选项
        loaderOptions: {
            postcss: {
                plugins: [
                    autoprefixer(),
                    // 使用 pxtorem库进行转换
                    pxtorem({
                        rootValue: 37.5,//1rem
                        propList: ['*']
                    })
                ]
            }
        }
    },

    pluginOptions: {
        "style-resources-loader": {
            preProcessor: "less",
            patterns: [
                // 全局变量路径
                path.resolve(__dirname, "./src/style/less.less"),
            ],
        },


    }

}