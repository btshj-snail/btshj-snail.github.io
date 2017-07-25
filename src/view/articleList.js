/**
 * Created by snail on 2017/7/24.
 */
require("../publicResource/less/main.less");

import snailUtils from '../publicResource/libs/snailUtils';

function whenImageComplete(){
    snailUtils.loadImagesComplete(function(){
        snailUtils.endLoading();
    })
}

$(function(){
    whenImageComplete();
})
