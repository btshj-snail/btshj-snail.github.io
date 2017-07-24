/**
 * Created by snail on 17-7-18.
 */

'use strict'

const config = require('./webpack.config.config');

/**
 *
 * 入口配置文件
 * 放置在view文件夹下的js作为界面资源,
 */



function covertEntry(env) {
    let config_obj = config(env);
    let fileAry = config_obj.FILE_CONFIG;
    let obj = {};
    for(let i=0,l=fileAry.length;i<l;i++){
        let item = fileAry[i];
        obj[item.storage] = config_obj.SOURCE_PATH + item.entry;
    }

    return obj;
}


const entry = function (env) {
    return covertEntry(env);
};


module.exports = entry;