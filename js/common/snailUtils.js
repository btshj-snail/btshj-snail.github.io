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
    },
    loadTopButton(){
        let time = 1000, frameTime = 60;
        let topBtnFrame = document.createElement("div");
        topBtnFrame.className = "topButton";
        document.body.appendChild(topBtnFrame);
        let topBtn_i = document.createElement("i");
        topBtn_i.className = "fa fa-angle-double-up fa-2x";
        topBtnFrame.appendChild(topBtn_i);
        let topBtn_p = document.createElement("p");
        topBtn_p.innerHTML = "TOP";
        topBtnFrame.appendChild(topBtn_p);

        topBtnFrame.onclick = function () {
            let top = document.body.scrollTop;
            let move = top / time * frameTime;
            moveFun(top, move);
        }


        function moveFun(top, move) {
            top = top - move;
            if (top > 0) {
                document.body.scrollTop = top;
                requestAnimationFrame(function () {
                    moveFun(top, move)
                });
            }
        }

    }
}