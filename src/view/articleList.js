/**
 * Created by snail on 2017/7/24.
 */
function whenImageComplete(){
    snailUtils.loadImagesComplete(function(){
        snailUtils.endLoading();
    })
}

$(function(){
    whenImageComplete();
})
