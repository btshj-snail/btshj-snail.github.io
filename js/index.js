/**
 * Created by snail on 2017/7/5.
 */
function whenImageComplete(){
    snailUtils.loadImagesComplete(function(){
        snailUtils.endLoading();
    })
}

function typesEvent(){
    $(".types").find("li")
        .mouseover(function () {
            $(this).find("a").hide();
            $(this).find("span").show();
        })
        .mouseout(function () {
            $(this).find("a").show();
            $(this).find("span").hide();
        })
        .click(function () {
           let url =  $(this).attr("pageUrl");
           window.location.href = url;
        })

}

$(function(){
    whenImageComplete();
    typesEvent();
})