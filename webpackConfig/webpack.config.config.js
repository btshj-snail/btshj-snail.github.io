/**
 * Created by snail on 17-7-18.
 *
 *
 * FILE_CONFIG 字段详解
 * storage 编译后的js文件 生成位置以及名称.当然路径是由output中进行配置的
 * entry  入口文件
 * template 对应的ejs模板文件名称.
 *
 */
'use strict'

const path = require('path');
const p_path = path.resolve(__dirname, "../");
const outPath = path.resolve(p_path, "./static");
const htmlTemplatePath = path.resolve(p_path,'./src/publicResource/htmlTemplate/')
console.log("工程路径:" + p_path)
console.log("出口文件路径:" + outPath)

const config = function (env) {
    return {
        PROJECT_PATH: p_path,
        SOURCE_PATH: './src/view/',
        CONFIG_PATH:path.resolve(p_path,"./webpackConfig"),
        COPY_PATH_HTML_FRAGMENT_FROM:path.resolve(p_path, "./src/htmlFragment/"),
        COPY_PATH_HTML_FRAGMENT_TO:path.resolve(outPath,"./htmlFragment"),
        HTML_TEMPLATE_PATH:htmlTemplatePath,
        HTML_OUTPUT_DIRECTION:"page/",
        OUTPUT_PATH: outPath,
        FILE_CONFIG:[
            {storage:'js/index',entry:"index.js",template:'index'},
            {storage:'js/articleList',entry:"articleList.js",template:'articleList'},
            {storage:'js/superWeb',entry:"superWeb.js",template:'superWeb'},
            {storage:'js/threeJs/index',entry:"threeJs/index.js",template:'threeJs/index'},
            {storage:'js/compileFrame/index',entry:"compileFrame/index.js",template:'compileFrame/index'},
            {storage:'js/cssOther/cssOtherIndex',entry:"cssOther/cssOtherIndex.js",template:'cssOther/cssOtherIndex'},
            {storage:'js/cssOther/verticalAlign',entry:"cssOther/verticalAlign.js",template:'cssOther/verticalAlign'},
            {storage:'js/cssOther/background',entry:"cssOther/background.js",template:'cssOther/background'},
            {storage:'js/cssOther/border',entry:"cssOther/border.js",template:'cssOther/border'},
            {storage:'js/cssOther/clip',entry:"cssOther/clip.js",template:'cssOther/clip'},
            {storage:'js/cssOther/display',entry:"cssOther/display.js",template:'cssOther/display'},
            {storage:'js/cssOther/float',entry:"cssOther/float.js",template:'cssOther/float'},
            {storage:'js/cssOther/line-height',entry:"cssOther/line-height.js",template:'cssOther/line-height'},
            {storage:'js/cssOther/overflow',entry:"cssOther/overflow.js",template:'cssOther/overflow'},
            {storage:'js/cssOther/position',entry:"cssOther/position.js",template:'cssOther/position'},
            {storage:'js/cssOther/text-decoration',entry:"cssOther/text-decoration.js",template:'cssOther/text-decoration'},
            {storage:'js/cssOther/text-transform',entry:"cssOther/text-transform.js",template:'cssOther/text-transform'},
            {storage:'js/cssOther/white-space',entry:"cssOther/white-space.js",template:'cssOther/white-space'},
            {storage:'js/cssOther/widthHeight',entry:"cssOther/widthHeight",template:'cssOther/widthHeight'},
            {storage:'js/cssOther/wordSpacing',entry:"cssOther/wordSpacing",template:'cssOther/wordSpacing'},
        ]
    }
}


module.exports = config;