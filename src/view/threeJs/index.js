/**
 * Created by snail on 2017/7/24.
 */



jQuery.extend( jQuery.easing,
    {
        easeOutExpo: function (x, t, b, c, d) {
            return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
        },
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        },
    });

$(function(){
    snailUtils.loadTopButton();

    $(function(){
        let animateComplete = 0;
        let doThreeAnimate = function(){
            $("#three_index_text_point").css({top:-200,opacity:0,color:"#ff4400"}).animate({top:0,opacity:1},800,"easeOutBounce");
        }
        $("#three_index_text_three").css({left:-400,opacity:0}).animate({left:0,opacity:1},1000,"easeOutExpo",function(){
            animateComplete++;
            if(animateComplete>1){
                doThreeAnimate();
            }
        });
        $("#three_index_text_js").css({right:-400,opacity:0}).animate({right:0,opacity:1},1000,"easeOutExpo",function(){
            animateComplete++;
            if(animateComplete>1){
                doThreeAnimate();
            }
        });
    })
    $(".three_menu_click").click(function(){
        let pageUrl = $(this).attr("pageUrl");
        $.get(pageUrl,function(data){
            $("#three_right_page").html(data);
        })
    })

})