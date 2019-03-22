# JS的模块化

没有模块化的缺点:

1. 全局变量污染.不同开发都有可能定义全局变量,但谁又知道呢,谁又能保证不覆盖别人的,不被别人覆盖呢
2. 模块化会将有具有相同功能特性的业务,处理函数等聚集在一起.这样别人在做的时候,就不用再次开发这些.加强协同能力.
3. 解决文件依赖问题.以前文件的依赖全靠script标签的书写顺序,文件多了,难记,易错.现在每个模块的依赖由自己管理,这样就不会弄错了.

## 简单的模块化

最原始的模块化实现:

```javaScript

var module = (function(){
    var inner = 1;
    var add = function(){
        inner++;
    }
    return {
        add:add
    }
})()

```
这样在自执行函数中定义的变量就都是私有函数了.外部只能访问模块暴露出来的方法了.

如果想横向扩展这个模块呢,也就是在其他地方为这个模块加些方法呢..可以这样

```javaScript

var module = (function(_module){
    var inner = 1;
    _module.open = function(){
        console.log('open')
    }
    return _module;
})(module)

```

浏览器环境中，模块的各个部分通常都是从网上获取的，有时无法知道哪个部分会先加载。如果采用上一节的写法，第一个执行的部分有可能加载一个不存在空对象，这时就要采用"宽放大模式"。

```javaScript

var module = (function(_module){
    var inner = 1;
    _module.open = function(){
        console.log('open')
    }
    return _module;
})(module||{})

```


## commn.js

2009年Node.js横空出世，将JavaScript带到了服务器端领域。而对于服务器端来说，没有模块化那可是不行的。因此CommonJs社区的大牛们开始发力了，制定了一个与社区同名的关于模块化的规范——CommonJs。它的规范主要如下：

1. 模块的标识应遵循的规则（书写规范）。
2. 定义全局函数require，通过传入模块标识来引入其他模块，执行的结果即为别的模块暴露出来的API。
3. 如果被require函数引入的模块中也包含依赖，那么依次加载这些依赖。
4. 如果引入模块失败，那么require函数应该报一个异常。
5. 模块通过变量exports来向外暴露API，exports只能是一个对象，暴露的API须作为此对象的属性。

CommonJs看起来是一个很不错的选择，拥有模块化所需要的严格的入口和出口，看起来一切都很美好，但它的一个特性却决定了它只能在服务器端大规模使用，而在浏览器端发挥不了太大的作用，那就是同步！这在服务器端不是什么问题，但放在浏览器端就出现问题了，因为文件都放在服务器上，如果网速不够快的话，前面的文件如果没有加载完成，浏览器就会失去响应！因此为了在浏览器上也实现模块化得来个异步的模块化才行！根据这个需求，我们的下一位主角——AMD就产生了！

## AMD

AMD是异步模块化的规范,而require.js则是其的一个使用较多的实现.

1. 用全局函数define来定义模块;
2. id为模块标识，遵从CommonJS Module Identifiers规范
3. dependencies为依赖的模块数组，在factory中需传入形参与之一一对应
4. 如果dependencies的值中有"require"、"exports"或"module"，则与commonjs中的实现保持一致
5. 如果dependencies省略不写，则默认为["require", "exports", "module"]，factory中也会默认传入require,exports,module
6. 如果factory为函数，模块对外暴漏API的方法有三种：return任意类型的数据、exports.xxx=xxx、module.exports=xxx
7. 如果factory为对象，则该对象即为模块的返回值

AMD虽然是异步,但是也只是意味着浏览器不出现"假死"状态.反而AMD在加载之初,就会要求加载完所有的依赖,才会执行内部程序.这样在第一次加载的时候就会显的特别慢. 那么这样就出现了CMD模式.

## CMD

CMD的全称是Common Module Definition，即通用模块定义。它是由蚂蚁金服的前端大佬——玉伯提出来的，实现的JavaScript库为sea.js。它和AMD的require.js很像，但加载方式不同，它是按需就近加载的，而不是在模块的开始全部加载完成。它有以下两大核心特点：
1. 简单友好的模块定义规范：Sea.js 遵循 CMD 规范，可以像 Node.js 一般书写模块代码。
2. 自然直观的代码组织方式：依赖的自动加载、配置的简洁清晰，可以让我们更多地享受编码的乐趣。

在CMD规范中，一个文件就是一个模块，代码书写的格式是这样的

```javaScript

define(factory);

```
当factory为函数时，表示模块的构造方法，执行该方法，可以得到该模块对外提供的factory接口，factory 方法在执行时，默认会传入三个参数：require、exports 和 module：

```javaScript

// 所有模块都通过 define 来定义
define(function(require, exports, module) {

  // 通过 require 引入依赖
  var $ = require('jquery');
  var Spinning = require('./spinning');

  // 通过 exports 对外提供接口
  exports.doSomething = ...

  // 或者通过 module.exports 提供整个接口
  module.exports = ...

});

```

它与AMD的具体区别其实我们也可以通过代码来表现出来，AMD需要在模块开始前就将依赖的模块加载出来，即依赖前置；而CMD则对模块按需加载，即依赖就近，只有在需要依赖该模块的时候再require就行了：

```javaScript

// AMD规范
define(['./a', './b'], function(a, b) {  // 依赖必须一开始就写好  
   a.doSomething()    
   // 此处略去 100 行    
   b.doSomething()    
   ...
});
// CMD规范
define(function(require, exports, module) {
   var a = require('./a')   
   a.doSomething()   
   // 此处略去 100 行   
   var b = require('./b') 
   // 依赖可以就近书写   
   b.doSomething()
   // ... 
});

```

从运行速度的角度来讲，AMD虽然在第一次使用时较慢，但在后面再访问时速度会很快；而CMD第一次加载会相对快点，但后面的加载都是重新加载新的模块，所以速度会慢点。总的来说,
require.js的做法是并行加载所有依赖的模块, 等完成解析后, 再开始执行其他代码, 因此执行结果只会"停顿"1次, 而Sea.js在完成整个过程时则是每次需要相应模块都需要进行加载，这期间会停顿是多次的，因此require.js从整体而言相对会比Sea.js要快一些。

---

参考:

 1. [简述JavaScript模块化编程](https://www.jianshu.com/p/3fbaa3ae70e6/)
 2. [Javascript模块化编程（一）：模块的写法](http://www.ruanyifeng.com/blog/2012/10/javascript_module.html)

 