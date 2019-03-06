
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


    function scrollTopFun(){
    if($('#scrollTopWrapper').length===0){
        $('body').append('<div id="scrollTopWrapper" class="scroll-top-wrapper"><p>^</p><p>TOP</p></div>');
    }
    $('body').on('click','#scrollTopWrapper',function(){
        $('html, body').animate({scrollTop:0}, 500,"easeOutExpo");
    })
}

function autoActiveNavbarItem(){
    var map = {};
    var timer = null;
    var count = 0;

    var getPositionInfo = function(){
        $("h2>span").each(function(){
            var  id = $(this).attr('id');
            map[id] = Math.floor($(this).offset().top-72);
        })
    }

    var autoActive = function(scrollTop){
        var keys = Object.keys(map);
        for(var i=0,l=keys.length;i<l;i++){
            if(scrollTop-0>=map[keys[i]] && (scrollTop-0<map[keys[i+1]] || i===keys.length-1)){
                var $li = $("#bs-navbar").find('.nav>li>a[href="#'+keys[i]+'"]').parent()
                if($li.length>0){
                    $("#bs-navbar").find('.nav>li').removeClass('active');
                    $li.addClass('active');
                }
                break;
            }
        }
    }

    $(window).scroll(function(){
        var _$this = $(this);
        if (timer && count<2) {

            clearTimeout(timer);
            count++
        }
        ;
        if(count===2){
            if(Object.keys(map).length===0){
                getPositionInfo();
            }
            autoActive(_$this.scrollTop());
            count = 0;
        }else{
            timer = setTimeout(function(){
                if(Object.keys(map).length===0){
                    getPositionInfo();
                }
                autoActive(_$this.scrollTop());
            },300)
        }

    })
}

function navOper(){
    $("#bs-navbar").find('.nav>li>a').click(function(event){
        event.stopPropagation();
    $("#bs-navbar").collapse('hide');
        var href = $(this).attr('href');
        if(href.indexOf("#")===0){
            event.preventDefault();
            var id = href.replace('#',"");
            $('html, body').animate({scrollTop: $("#"+id).offset().top-72}, 500,"easeOutExpo");
        }
    })


}


var load = function(){
    // var mdPath = "";
    // var reg = new RegExp("path=([^&]*)");
    // var r = window.location.href.match(reg);
    // if(r!=null){
    //     mdPath = r[1];
    // }
    var pathAry = window.location.pathname.split('/');
    var docName = pathAry[pathAry.length-1].replace('.html','') || '';
    if(!!docName){
        $.get(docName+'.md',function(data){
            // $("#mdContent").text(data).val(data);
            resolveMarkDown(data);

            $("#bs-navbar").empty().append(' <ul class="nav navbar-nav"></ul>');
            var li = []
            $(".container#content").find('h2>span[id]').each(function(){
                var id = $(this).attr('id');
                var name = $(this).text();
                var liHtml = '<li><a href="#'+id+'">'+name+'</a></li>'
                li.push(liHtml);
            })
            $("#bs-navbar").find('ul.nav').html(li.join(''))

            computeMenu();
        })
    }
}

var computeMenu = function(){
    var width = 0;
    $("#bs-navbar").find('ul.nav>li').each(function(){
        width +=$(this).outerWidth()-0;
    })
    var w = $(".navbar-brand").outerWidth();

    if(document.documentElement.clientWidth>768){
        if( width+w+30>document.documentElement.clientWidth){
            $('.navbar-toggle').show();
            $('.navbar-header').css({float:'none'})
            $("#bs-navbar").removeClass('navbar-collapse');
        }else{
            $('.navbar-toggle').hide();
            $("#bs-navbar").addClass('navbar-collapse');
            $('.navbar-header').css({float:'left'})
            if(width===0) computeMenu();
        }
    }

}


$(function(){
    // scrollTopFun();
    navOper();
    autoActiveNavbarItem();
    load();
    var timer = null;
    $(window).resize(function(){
        timer && clearTimeout(timer);
        timer = setTimeout(function(){
            computeMenu();
        },300)

    })
})
