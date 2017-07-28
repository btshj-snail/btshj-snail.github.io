/**
 * Created by snail on 2017/7/28.
 */
require("../../publicResource/less/main.less");
require("../../publicResource/less/codeEffect.less");

function init(){
    let $clearness = $(".effect_show .twoImgSlider_clearness");
    let $dim = $(".effect_show .twoImgSlider_dim");
    let width = $clearness.width();
    $dim.width(width).css({"background-size":width+"px 100%"});
}

$(function(){
    init();
    $(".effect_show").mousemove(function(e){
        let {pageX} = e;
        let $clearness = $(this).find(".twoImgSlider_clearness");
        let $dim = $(this).find(".twoImgSlider_dim");
        let {top,left} = $clearness.offset();

        if(pageX-left){
            let width = $clearness.width()-(pageX-left);
            $dim.width(width);
        }
    })
    $(window).resize(function(){
        init();
    })
})