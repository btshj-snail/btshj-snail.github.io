/**
 * Created by snail on 2017/7/26.
 */
require('../../publicResource/less/main.less');

import snailUtils from '../../publicResource/libs/snailUtils';


const pageAnimate  = {

}


$(function(){
    snailUtils.loadImagesComplete(function () {
        snailUtils.endLoading();
    });
})