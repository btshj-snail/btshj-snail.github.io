
var module;
console.log('test1 定义module变量完成')

module= (function(_module){
    console.log('test1 module doing')
    _module.add = function(){
        console.log('call add function');
    }
    return _module;
})(module||{})

console.log('test1',module)