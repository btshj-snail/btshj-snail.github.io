/**
 * Created by snail on 17-7-18.
 */
'use strict'

const webpack = require('webpack'),
    autoprefixer = require('autoprefixer'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

function getLessUse(env) {
    return env != 'dev'
        ?
        ExtractTextPlugin.extract([
            {loader: 'css-loader'},
            {loader: 'postcss-loader',options:{plugins:[autoprefixer({browsers:['ie>=8','>1% in CN']})]}},//中国使用了超过1%的浏览器
            {loader: 'less-loader'}
        ])
        :
        ['style-loader',
            {
                loader: 'css-loader',
                options: {
                    modules: false
                }
            },
            {loader: 'postcss-loader',options:{plugins:[autoprefixer({browsers:['ie>=8','>1% in CN']})]}},
            {
                loader: 'less-loader',
                options: {
                    modules: false,
                }
            }]
}

function getCssUse(env) {
    return env != 'dev'
        ?
        ExtractTextPlugin.extract([
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                }
            },
            {loader: 'postcss-loader',options:{plugins:[autoprefixer({browsers:['ie>=8','>1% in CN']})]}},//中国使用了超过1%的浏览器
        ])
        :
        [
            'style-loader',
            {
                loader: 'css-loader',
                options: {
                }
            },
            {loader: 'postcss-loader',options:{plugins:[autoprefixer({browsers:['ie>=8','>1% in CN']})]}},//中国使用了超过1%的浏览器
            ]
}

const loader = function (env) {

    let lessUse = getLessUse(env);
    let cssUse = getCssUse(env);

    return {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components|static)/,
                include: /src/,
                use: [
                    {
                        // 编译新版本js语法为低版本js语法
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                // 编译es2015版本的js
                                ['babel-preset-es2015', {
                                    modules: false
                                }], 'babel-preset-stage-2',
                            ],

                            plugins: [
                                // 减少重复的编译后的辅助方法
                                'babel-plugin-transform-runtime',
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: cssUse
            },
            {
                test: /\.less$/,
                use: lessUse
            },
            {
                test: /\.(jpg|png|gif)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // 编码为dataUrl的最大尺寸
                        limit: 10000,
                        // 输出路径，相对于publicPath
                        outputPath: 'imgs/',
                        name: '[name]_[hash:8].[ext]'
                    }
                }

            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?.*$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/font-woff',
                        outputPath: 'font/',
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?.*$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/octet-stream',
                        outputPath: 'font/',
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?.*$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        // mimetype: 'application/vnd.ms-fontobject',
                        outputPath: 'font/',
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?.*$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        limit: 10000,
                        mimetype: 'application/svg+xml',
                        outputPath: 'font/',
                        name: '[name]_[hash:8].[ext]'
                    }
                }
            },
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            }
            // {
            //     test: /\.html$/,
            //     use: {loader:'raw-loader'}
            // },

        ]
    }
}


module.exports = loader;