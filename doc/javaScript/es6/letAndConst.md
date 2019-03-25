# let const命令

## let 命令

ES6 新增了let命令，用来声明变量。它的用法类似于var，但是所声明的变量，只在let命令所在的代码块内有效。

```javaScript

{
  let a = 10;
  var b = 1;
}

a // ReferenceError: a is not defined.
b // 1

```

for循环的计数器，就很合适使用let命令。

```javaScript

for(let i =0,l=10;i<l;i++){
    console.log('正在循环:'+i)
}

console.log('最终为:'+i)

```

### 不能变量提升

以往,`var`定义的变量具有变量提升的特性.即,你可以在定义变量之前,就使用变量.因为在解析js文件的时候,js会先扫描并执行所有变量的定义.但是`let`则不会.如果在`let`定义之前就使用变量,系统会报错.

> ***其实个人一直觉的这个地方有问题,既然不能变量提升,那么下面的暂时性死区则就说不通.按照比较合理的解释,应该是`var`,`let`,`const`都会进行变量提升,只不过`let`和`const`有暂时性死区,即在使用`let`或`const`声明之前的语句都无法访问该变量,这个区域就是暂时性死区***

### 暂时性死区

只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

```javaScript

var temp = 13;

if(true){
    temp = "abc";// ReferenceError
    let temp;
}

```

上面代码中，存在全局变量`tmp`，但是块级作用域内`let`又声明了一个局部变量`tmp`，导致后者绑定这个块级作用域，所以在`let`声明变量前，对`tmp`赋值会报错。

ES6 明确规定，如果区块中存在`let`和`const`命令，这个区块对这些命令声明的变量，从一开始就形成了封闭作用域。凡是在声明之前就使用这些变量，就会报错。

总之，在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”（temporal dead zone，简称 TDZ）。

```javaScript
if(true){
    tmp = 'abc';
    console.log(tmp);

    let tmp ;
    console.log(tmp)

    tmp = 123;
    console.log(tmp)
}


```

上面代码中，在`let`命令声明变量`tmp`之前，都属于变量`tmp`的“死区”。“暂时性死区”也意味着`typeof`不再是一个百分之百安全的操作。

**总之，暂时性死区的本质就是，只要一进入当前作用域，所要使用的变量就已经存在了，但是不可获取，只有等到声明变量的那一行代码出现，才可以获取和使用该变量。**

### 不允许重复声明




## 块级作用域

### 为什么需要块级作用域？

计数的循环变量泄露为全局变量。

```javaScript

for(var i=0,l=10;i<l;i++){
    console.log(i)
}
console.log(i)
```
我们都知道`for`循环运行完后的`console.log(i)`输出的是10.意味着循环完后,i并没有被回收.这样就会将其泄露成全局变量了.所以应该需要块级作用域的.


### ES6的块级作用域

`let`实际上为 JavaScript 新增了块级作用域。

块级作用域的出现，实际上使得获得广泛应用的立即执行函数表达式（IIFE）不再必要了。

```javaScript

(function(){
    var i = 0;
    ......
})()

{
    let i=0;
    ....
}


```


## const 命令

### 基本用法

`const`声明一个只读的常量。一旦声明，常量的值就不能改变。`const`声明的变量不得改变值，这意味着，`const`一旦声明变量，就必须立即初始化，不能留到以后赋值。`const`命令声明的常量也是不提升，同样存在暂时性死区，只能在声明的位置后面使用。

### 本质

`const`实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。对于简单类型的数据（数值、字符串、布尔值），值就保存在变量指向的那个内存地址，因此等同于常量。但对于复合类型的数据（主要是对象和数组），变量指向的内存地址，保存的只是一个指向实际数据的指针，const只能保证这个指针是固定的（即总是指向另一个固定的地址），至于它指向的数据结构是不是可变的，就完全不能控制了。因此，将一个对象声明为常量必须非常小心。

如果真的想将对象冻结，应该使用`Object.freeze`方法。

```javaScript

const foo = Object.freeze({});

// 常规模式时，下面一行不起作用；
// 严格模式时，该行会报错
foo.prop = 123;

```

## 顶层对象的属性

顶层对象，在浏览器环境指的是window对象，在 Node 指的是global对象。ES5 之中，顶层对象的属性与全局变量是等价的。

```javaScript

window.a = 1;
a // 1

a = 2;
window.a // 2

```

上面代码中，顶层对象的属性赋值与全局变量的赋值，是同一件事。

顶层对象的属性与全局变量挂钩，被认为是 JavaScript 语言最大的设计败笔之一。这样的设计带来了几个很大的问题，首先是没法在编译时就报出变量未声明的错误，只有运行时才能知道（因为全局变量可能是顶层对象的属性创造的，而属性的创造是动态的）；其次，程序员很容易不知不觉地就创建了全局变量（比如打字出错）；最后，顶层对象的属性是到处可以读写的，这非常不利于模块化编程。另一方面，window对象有实体含义，指的是浏览器的窗口对象，顶层对象是一个有实体含义的对象，也是不合适的。

ES6 为了改变这一点，一方面规定，为了保持兼容性，var命令和function命令声明的全局变量，依旧是顶层对象的属性；另一方面规定，let命令、const命令、class命令声明的全局变量，不属于顶层对象的属性。也就是说，从 ES6 开始，全局变量将逐步与顶层对象的属性脱钩。

```javaScript
var a = 1;
// 如果在 Node 的 REPL 环境，可以写成 global.a
// 或者采用通用方法，写成 this.a
window.a // 1

let b = 1;
window.b // undefined
```
> 全局变量,在ES6规范中有一个词叫做`Global Environment Records` ,它包括`Obejct Environment Record`和`Declarative Environment Records`.<br>
根据规范,所有var和window对象的上属性都是在`Object Environment Record`中的,而`let`,`const`变量声明都是在`Declarative Environment Record`中的.<br>
使用`let`和`const`声明时,会同时检查`Object Environment Record` 和 `Declarative Environment Record`中是否存在,而`var`声明只会检查`Object Environment Record`.若是检测到了就会抛出异常.<br>
声明在全局对象上的属性和通过`var`声明的变量都会存放于`Object Environment Record`.并且通过`var`声明的变量会绑定到全局对象(window)上.

