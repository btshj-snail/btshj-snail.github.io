

var getMenuData = function(){
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

    console.log(result)
    return result;
}

var assembleMenu = function(menu){
    var dom_container = document.getElementById("verticalMenu");
    var dom_ul = document.createElement('ul');
    menu.forEach(function(item){
        var dom_li = document.createElement("li");

        var p = document.createElement('p')
        p.innerText = item.name;
        p.id = item.id;

        dom_li.appendChild(p);
       
        if(item.sub && item.sub.length>0){
            var dom_sub_ul = document.createElement('ul');
            item.sub.forEach(function(sub){
                var dom_sub_li = document.createElement("li");
                dom_sub_li.innerText = item.name;
                dom_sub_li.id = item.id;
                
                dom_sub_ul.appendChild(dom_sub_li);
            })
            dom_li.appendChild(dom_sub_ul);
        }
        dom_ul.appendChild(dom_li);
    })
    dom_container.appendChild(dom_ul);
}


window.onload = function(){
    var menuData = getMenuData();
    assembleMenu(menuData);
}