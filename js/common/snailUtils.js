/**
 * Created by snail on 2017/7/5.
 */


const snailUtils = {
    startLoading(){
        let dom_loading = document.querySelector("#screenLoading");
        if(dom_loading){
            dom_loading.style.display = "block";
        }else{
            dom_loading = document.createElement("div");
            dom_loading.className = "screenLoading";
            dom_loading.id="screenLoading";
            document.body.appendChild(dom_loading);
        }
    },
    endLoading(){
        let dom_loading = document.querySelector("#screenLoading");
        if(dom_loading){
            dom_loading.style.display = "none";
        }
    },
    loadImagesComplete(callBack){
        let defedAry = [];
        $("img").each(function(){
            let dfd = $.Deferred();
            $(this).bind('load',function(){
                dfd.resolve();
            })
            if(this.complete) setTimeout(function(){
                dfd.resolve();
            },100)
            defedAry.push(dfd);
        })

        $.when.apply(null,defedAry).done(function(){
            callBack && callBack();
        })
    }
}