/**
 * Created by snail on 2017/7/26.
 */
require('../../publicResource/less/main.less');

import snailUtils from '../../publicResource/libs/snailUtils';


const pageAnimate  = {
    doHeadSectionAnimate(){
        let $o = $("#headSectionAnimate");
        let $span = $o.find("span").hide();
        $o.addClass("animate_text_center");
        setTimeout(function () {
            $span.show();
            $o.addClass("animate_text_second");
            setTimeout(function () {
                $o.addClass("animate_text_finally");
            }, 1600)
        }, 1600)
    }
}

function randomCellColor(){
    let ary=["#ff4400","#4b0","#1184CE","#c9c84b"];
    $(".co_cell_inner").each(function () {
        let index = snailUtils.getRandom(0,3);
        $(this).css({"background-color":ary[index]});
    });
}

$(function () {
    randomCellColor();
    snailUtils.loadImagesComplete(function () {
        snailUtils.endLoading();
        pageAnimate.doHeadSectionAnimate();
    });

})