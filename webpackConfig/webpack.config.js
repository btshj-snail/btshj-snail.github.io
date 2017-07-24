/**
 * Created by snail on 17-7-18.
 */

'use strict'

const webpack = require('webpack');
const config = require('./webpack.config.config');
const entry = require('./webpack.config.entry');
const output = require('./webpack.config.output');
const loader = require('./webpack.config.loader');
const plugins = require('./webpack.config.plugins');
const devServer = require('./webpack.config.devServer');

module.exports = function (env) {

    let plugins_obj = plugins(env) || [],
        config_obj = config(env),
        entry_obj = entry(env),
        output_obj = output(env),
        loader_obj = loader(env),
        devServer_obj = devServer(env);


    return {
        context: config_obj.PROJECT_PATH,
        entry: entry_obj,
        output: output_obj,
        module: loader_obj,
        plugins: plugins_obj,
        devtool: 'source-map',
        devServer: devServer_obj
    }
}
