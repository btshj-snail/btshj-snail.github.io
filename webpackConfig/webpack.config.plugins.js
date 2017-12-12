/**
 * Created by snail on 17-7-18.
 */
'use strict'

const webpack = require('webpack'),
    path = require('path'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    WebpackMd5Hash = require('webpack-md5-hash'),
    ExtractTextWebpackPlugin = require('extract-text-webpack-plugin'),
    CleanWebpackPlugin = require('clean-webpack-plugin'),
    HtmlWebpackPlugin = require('html-webpack-plugin');

const entry = require('./webpack.config.entry');
const config = require("./webpack.config.config");

const plugins = function (env) {

    let config_obj = config(env);

    let p_ary = [
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en-ca|zh-cn/),
        new webpack.optimize.OccurrenceOrderPlugin(true), //根据模块调用次数,给模块分配ids,常被调用的ids分配更短的id,使得ids可预测,降低文件大小.
        new webpack.optimize.CommonsChunkPlugin({
            name: ['js/vendor'],
            minChunks: 3,
        }),
        new CopyWebpackPlugin([
            {
                from:config_obj.COPY_PATH_HTML_FRAGMENT_FROM,
                to:config_obj.COPY_PATH_HTML_FRAGMENT_TO
            }
            ]),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            beautify: false,
            comments: false,
            compress: {
                warnings: false,
                drop_console: false,
                collapse_vars: true,
                reduce_vars: true
            },
            output:{
                comments:false
            }
        }),
        new webpack.DefinePlugin({
            DEV: env == 'dev'
        }),
        //修复webpack的chunkhash不已chunk文件实际内容为准的问题
        new WebpackMd5Hash(),
    ]

    let fileAry = config_obj.FILE_CONFIG;

    for(let i=0,l=fileAry.length;i<l;i++){
        let item = fileAry[i];
        console.log('界面:'+item.entry);

        p_ary.push(
            new HtmlWebpackPlugin({
                template:"html-withimg-loader!"+path.resolve(config_obj.HTML_TEMPLATE_PATH,"./"+item.template+".html"),
                filename: config_obj.HTML_OUTPUT_DIRECTION+item.template + ".html",
                hash: true,
                inject: true,
                chunks: ['js/vendor', item.storage]
            })
        )
    }

    if (env == "dev") {

    } else {
        //css 单独打包
        p_ary.push(
            new ExtractTextWebpackPlugin('style/[name].[hash].css',{
                allChunks: true
            })
        );
        //清除编译文件存放空间
        p_ary.push(
            new CleanWebpackPlugin(['./static'],{
                exclude:["threeComponent","i18n"],
                root:config_obj.PROJECT_PATH,
                verbose:true,
                dry:false
            })
        );

    }


    return p_ary;
}


module.exports = plugins;