
var module;

console.log('test2 定义module变量完成')

module = (function(_module){
    console.log('test2 module doing')
    _module.propagration = function(){
        console.log('call propagation function');
    }
    return _module;
})(module||{})

console.log('test2',module)