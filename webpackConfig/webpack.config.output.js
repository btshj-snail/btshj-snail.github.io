/**
 * Created by snail on 17-7-18.
 */
'use strict'

const config = require('./webpack.config.config');


const output = function(env){
    let config_obj = config(env);
    return {
        path:config_obj.OUTPUT_PATH,
        filename:'[name].[hash].js',
        publicPath:"/static/",
    }
}

module.exports = output;