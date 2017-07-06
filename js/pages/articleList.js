/**
 * Created by snail on 2017/7/5.
 */
function whenImageComplete(){
    snailUtils.loadImagesComplete(function(){
        snailUtils.endLoading();
    })
}

$(function(){
    whenImageComplete();
})