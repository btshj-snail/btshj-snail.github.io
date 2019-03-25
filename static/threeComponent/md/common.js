
var menuOper = {
    getMenuData : function(){
        var dom_container = document.getElementById('mdContent');
        var dom_children = dom_container.children;
        var result = [];
        var _pId = null;
        for(var i=0,l=dom_children.length;i<l;i++){
            var sub = dom_children[i]
            if(sub.tagName.toUpperCase()==="H2"){
                _pId = sub.id
                result.push({id:sub.id,name:sub.innerText,parentId:null});
            }
    
            if(sub.tagName.toUpperCase()==="H3"){
                var info = {id:sub.id,name:sub.innerText,parentId:_pId}
                if(!_pId){
                    result.push(info);
                }else{
                    result.forEach(function(item){
                        if(item.id===_pId){
                            if(!item.hasOwnProperty('sub')) item.sub = [];
                            item.sub.push(info)
                        }
                    })
                }
                
            }
        }
    
        return result;
    },
    
    assembleMenu : function(menu){
        var dom_container = document.getElementById("verticalMenu");
        var dom_header = document.createElement('div');
        dom_header.className = 'vertical-menu-header';
        dom_container.appendChild(dom_header);

        var prefix = document.createElement('p');
        prefix.innerText = "纸上得来终觉浅,";
        prefix.style.textIndent = "0em";
        var suffix = document.createElement('p');
        suffix.innerText = "绝知此事要躬行!";
        suffix.style.textIndent = "5em";
        dom_header.appendChild(prefix);
        dom_header.appendChild(suffix);

    
        var dom_ul = document.createElement('ul');
        dom_ul.className = "vertical-menu-out"
        menu.forEach(function(item){
            var dom_li = document.createElement("li");
    
            var p = document.createElement('p')
            p.innerText = item.name;
            p.dataset.id = item.id;
            dom_li.appendChild(p);
           
            if(item.sub && item.sub.length>0){
                var dom_sub_ul = document.createElement('ul');
                item.sub.forEach(function(sub){
                    var dom_sub_li = document.createElement("li");
                    dom_sub_li.innerText = sub.name;
                    dom_sub_li.dataset.id = sub.id;
                    dom_sub_ul.appendChild(dom_sub_li);
                })
                dom_li.appendChild(dom_sub_ul);
            }
            dom_ul.appendChild(dom_li);
        })
        dom_container.appendChild(dom_ul);
    },
    menuEvent:function(){
        var timer = null;
        $("#verticalMenu").find('[data-id]').click(function(){
            var id = $(this).data('id');
            var offset = $("#"+id).offset();
            $(document.documentElement).animate({scrollTop:offset.top}, 400);
        })

        $(document).scroll(function(){
            timer && clearTimeout(timer);
            timer = setTimeout(function(){
                var $el = $('h2,h3','#mdContent');
                for(var i=0,l=$el.length;i<l;i++){
                 if(isInViewPortAndSee($el[i])){
                    $("#verticalMenu").find('[data-id]').removeClass('active');
                    $("#verticalMenu").find('[data-id="'+$el[i].id+'"]').addClass('active');
                    break;
                 }
                }
                  
            },50)
           

        })
    },
    isContentOverView(){
        var dom_container = document.getElementById('mdContent');
        if(dom_container.clientHeight<=document.documentElement.clientHeight){
            return !1;
        }
        return !0;
    },
    hideMenu(bool){
        if(!!bool){
            document.querySelector('.left-area').style.display = "none";
            document.querySelector('.right-area').style.marginLeft = 0;
        }else{
            document.querySelector('.left-area').style.display = "block";
            document.querySelector('.right-area').style.marginLeft = "300px";
        }
    }
}

function isInViewPortAndSee (el) {
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight 
    const top = el.getBoundingClientRect() && el.getBoundingClientRect().top
    return top  <= viewPortHeight && top>0 
}

var initStyle = function(){
    var leftArea = document.querySelector('.left-area')
    var rightArea = document.querySelector('.right-area')
    if(!!leftArea && !!rightArea ) {
    
        var sy = window.getComputedStyle(rightArea);
    
    
        leftArea.style.height = sy.height;
    }
   
}


window.onload = function(){
    var menuData = menuOper.getMenuData();
    var bool = menuOper.isContentOverView();
    console.log(bool)
    console.log(menuData.length)
    if(!bool || menuData.length===0){
       menuOper.hideMenu(true)
    }else{
        menuOper.hideMenu(false)
        menuOper.assembleMenu(menuData);
        menuOper.menuEvent();
    }
    
    initStyle();
}