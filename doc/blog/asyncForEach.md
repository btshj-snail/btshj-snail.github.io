# async,await与forEach引发的血案

 <p class="article-desc">日期:2019.4.16</p>

 ---

> 本文仅是技术验证，记录，交流，不针对任何人。有冒犯的地方，请谅解。

 偶然间看到一篇文章，提及`await`在`forEach`中不生效，`async`，`await`这个`ES6`中的语法，对于我来说应该也不陌生了，早在一两年前就用过了，知道这是干什么用的，怎么用的。在看完这篇文章后，“第七感”觉着本身这个标题似乎有所不妥，内容到是感觉没啥问题，但是看到总结和余下的评论，总觉的这里面应该是有误区了。因此想要扒一下“它的外套”，看看是啥牌子（嘿嘿嘿嘿。。。真的只是看牌子）。在看了几篇详细介绍`async`，`await`后，才发现写决定写这篇文章，是个错误。因为它太深了，牵扯太多了，感觉就像无极中的馒头一样，能牵出一堆故事；也像是一个有实力，有背景的女一号，处处都是戏。

> 这世上的一切你都可以得到，只要你够坏，而你，你还不够坏 --《无极》

 好了，话不多说，进入正题。让我们一起来一件件的扒，看看到底是什么？

 ## `async`和`await`

`ES2017` 标准引入了 `async` 函数，使得**异步操作变得更加方便**。OK，看看如何操作的。

```javaScript

async function getBookInfo(name){
    const baseInfo = await requestBookBaseInfo(name); //requestBookBaseInfo 方法发送一个请求，向后台请求数据。这是一个异步方法
    const bookPrice = await requestBookPrice(baseInfo.id); //requestBookPrice方法发送一个请求，向后台请求数据。这是一个异步方法
    return {..baseInfo,bookPrice};
}

```
`getBookInfo`方法中，有两个异步函数，并且第二个异步函数用到了第一个异步函数的结果。如果`getBookInfo`能够达到我们的目的，那么用你的小指头想想就会有一个直接的结论。

**原来async函数内部使用await后，可以将await后面跟的异步函数变为同步。**

姑且认为这个结论是正确的，那么async函数又是如何实现的，才能有如此神奇的效果？`async`函数返回的是函数里面的`return`的值吗？`await`只能跟异步函数吗？

好的，带着这些疑问，我们继续向下扒，看看到底是A，还是B还是C、D、E、F、G。。。

阮大神在《ECMAScript 6 入门》中的`async`函数一篇，提到这么一句话 “**async 函数是什么？一句话，它就是 Generator 函数的语法糖。**”

什么？`async`是`Generator`的语法糖？OK，那我们再去扒下今天的女二号，`Generator`。


## Generator

> Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。---这也是阮大神说的。

按我个人的理解，`Generator`英语直译“生成”，那么`Generator`函数其实就是一个生成器，生成什么呢，生成的就是一个Iterator。等等又出现个Iterator，这又是什么？好吧，我们姑且将她放置一边，毕竟都女三号了，没这么快入场。如果不了解女三号，那么我们也可以将`Generator`理解为**状态管理机**。毕竟伟大诗人曾说过“横看成岭侧成峰”，我们现在也只是转个角度欣赏女二号而已。

在形式上，`Generator`只是一个普通的函数而已，只不过有两个比较明显的特征。一个是在关键字`function`和函数名之间有个`*`；二，在函数内部使用`yield`表达式，定义不同的状态（注意这里，这就是为什么又称之为状态管理机的由来）。

```javaScript

function* childEatProcess() {
  yield 'use toilet';
  yield 'wash hands';
  yield 'sit down';
  return 'eat'
}

var ch = childEatProcess();

ch.next();//{value:'use toilet',done:false}
ch.next();//{value:'wash hands',done:false}
ch.next();//{value:'sit down',done:false}
ch.next();//{value:'eat',done:true}
ch.next();//{value:'undefined',done:true}
```
上面的代码定义了一个`Generator`函数，他的内部有三个`yield`，也就是说该函数有四个状态（`use toilet`，`wash hands`，`sit down`以及`return`的`eat`）。`childEatProcess`和其他函数一样，直接调用即可。但是他的返回（一定要注意这里）不是`return`的值，而是**一个对象，一个指向内部状态的指针对象，也就是Iterator对象**。

并且`Generator`函数类似我们家小朋友吃饭前的准备工作一样，你不去触发他，他是不会自己执行的。当`ch`调用`next`方法后，函数内部才开始执行，执行到`yield`关键字后，运行`yield`后面的表达式，然后就停下来了。等着你再去触发他（`next`方法的调用）

### yield表达式

由于 `Generator` 函数返回的遍历器对象，只有调用`next`方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。`yield`表达式就是暂停标志。

遍历器对象的`next`方法的运行逻辑如下。

（1）遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。

（2）下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。

（3）如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。

（4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。

需要注意的是，`yield`表达式后面的表达式，只有当调用`next`方法、内部指针指向该语句时才会执行，因此等于为 `JavaScript` 提供了手动的“惰性求值”（`Lazy Evaluation`）的语法功能。

### yield* 表达式

和普通的`yield`表达式相比，`yield*`表达式多了一个星号。`yield*`表达式，用于将后面`Generator`表达式**执行**。这个还真不好表达，来看看下面的代码，直观感受下。


```javaScript

function* generator_1(){
    yield "b";
    yield "c";
}

function* generator_2(){
    yield "a";
    yield generator_1();
    yield "d";
}

function* generator_3(){
    yield "a";
    yield* generator_1();
    yield "d";
}
let g2 = generator_2();
g2.next();//{value:"a",done:false}
g2.next();//{value:Iterator,done:false}
g2.next();//{value:"d",done:true}
g2.next();//{value:undefined,done:true}

let g3 = generator_3();
g3.next();//{value:"a",done:false}
g3.next();//{value:"b",done:false}
g3.next();//{value:"c",done:false}
g3.next();//{value:"d",done:false}

```

从上面的列子，可以看出`yield`只是执行了`generator`函数而已，也就是获取到`generator`函数生成的`iterator`而已。而`yield*`，确是执行了`generator`函数的内部指针。

那么也可以将代码

```javaScript

function* generator_1(){
    yield "b";
    yield "c";
}

function* generator_3(){
    yield "a";
    yield* generator_1();
    yield "d";
}

//上面的代码等价于

function* generator_4(){
    yield "a";
    yield "b";
    yield "c";
    yield "d";
}


```


### next的参数

**`yield`表达式本身没有返回值，或者说总是返回undefined。next方法可以带一个参数，该参数就会被当作上一个yield表达式的返回值。**。注意，这句话非常重要，是理解后面的根本。重要的事情说三遍，**`yield`表达式本身没有返回值**，**`yield`表达式本身没有返回值**，**`yield`表达式本身没有返回值**。


## Iterator

作为本文的女三号，`Iterator`，我们就简单的扒一下吧。毕竟她不是这篇文章的小主。但是千万别小看她，这位也绝对是位重量级的女主，对象遍历，数组遍历，伪数组遍历，解构赋值，扩展符运算，所有能遍历的一切都离不开她的石榴裙。只是今天戏份略少而已。

`Iterator`就是遍历器，它是一种接口，为各种不同的数据结构提供统一的访问机制。任何数据结构只要部署 `Iterator` 接口，就可以完成遍历操作（即依次处理该数据结构的所有成员）。

`Iterator` 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

每一次调用`next`方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含`value`和`done`两个属性的对象。其中，`value`属性是当前成员的值，`done`属性是一个布尔值，表示遍历是否结束。

## 再扒Generator

看了女三号（`Iterator`）的个人简历。应该清楚`Generator`函数执行后返回的对象就是一个内部指针的遍历器对象即`Iterator`对象了吧。`Iterator`对象再调用`next`方法，遍历`Generator`中所有`yield`定义的状态。

之前描述女一号说，`async`是`generator`的语法糖，但是还是没有看出来`generator`和`async`的关系呀。不急，我们慢慢来。反过来先假如**async是generator的语法糖**这句话是正确的，那么我们肯定可以用`generator`函数来写出`async`的效果。

将`async`拆解后，可以发现其实就两点：

1. 内部的异步函数在`async`中变为了同步，即`await`后的异步表达式执行完后，才继续向下执行。
2. 对于`generator`来说，`async`是自动执行的，而`generator`返回的是`iterator`，必须要调用`next`，才能执行。

OK，那我们就按照这两点一个个的实现：

第一点，其实很简单，那么就是用回调函数，`promise`等等都可以实现顺序执行。

有麻烦的是，要让`Generator`函数自动运行，而不是我们手动调用`next`。

### 自动执行Generator

`Thunk` 函数是自动执行 `Generator` 函数的一种方法。

很早很早以前，有一个争论的焦点就是"求值策略"，即函数的参数到底应该何时求值。有人觉的应该在使用的时候表达式才求值，这样避免不必要的计算，相当于**传名调用**。有人认为应该在使用前就将表达式计算好，相当于**传值调用**。

而`Thunk`则是传名调用的实现，是将参数放到一个临时函数之中，再将这个临时函数传入函数体。

JavaScript 语言是传值调用，它的 `Thunk` 函数含义有所不同。在 `JavaScript` 语言中，`Thunk` 函数替换的不是表达式，而是多参数函数，将其替换成一个只接受回调函数作为参数的单参数函数。似乎和函数柯理化一个概念了。

```javaScript

function readSome(a,b,callBack){
    setTimeout(function(){
        callBack && callBack(a+b);
    },200)
}

let thunkFun = function(fn){
    return function(...args){
        return function(callBack){
           return  fn.call(this,...args,callBack);
        }
    }
}

let thunk_rs = thunkFun(readSome);

thubk_rs('Hi','girl')(function(str){
    console.log(str);
})

```
你可能会问， `Thunk` 函数有什么用？和`Generator`自执行有什么关系。。慢慢来，衣服是一件件扒，一件件穿的。

```javaScript

function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}


```
上面代码中，`Generator` 函数`gen`会自动执行完所有步骤。
但是，这不适合异步操作。如果必须保证前一步执行完，才能执行后一步，上面的自动执行就不可行。这时，`Thunk` 函数就能派上用处。

```javaScript

function readSome(a,b,callBack){
    setTimeout(function(){
        callBack && callBack(a+b);
    },200)
}

let thunkFun = function(fn){
    return function(...args){
        return function(callBack){
           return  fn.call(this,...args,callBack);
        }
    }
}

let thunk_rs = thunkFun(readSome);


var gen = function* (){
  var r1 = yield thunk_rs('Hi','girl');
  console.log(r1.toString());
  var r2 = yield readFileThunk('you are ','beautiful');
  console.log(r2.toString());
};

function run(fn){
    var gen = fn();
    function next(err,data){
        let rs = gen.next(data);
        if(rs.done) return ;
        rs.value(next)
    }
    next();
}

run(gen)


```

似乎这就完美的完成了自动执行。当然自动执行并不仅仅这一种方式。

## async原理

通过之前的了解，我们知道`async`的原理其实就是`Generator`函数和自执行器包装在一个函数里。所以才有`async`是`Generator`的语法糖的说法。真相大白，原来女一号就是穿了个马甲的女二号，只不过这个马甲赋予了女一号一些特别的能力。就像超人要穿他的战服才叫超人，才有超能力。

## 再扒async

穿了马甲自然有些地方不一样啦，虽然内部数据都一样。那么我们来看看穿上马甲后，有什么不同了。

`async`函数对 `Generator` 函数的改进，体现在以下四点。

（1）内置执行器。就是我们所谓的自执行。

（2）更好的语义。

（3）更广的适用性。

（4）**返回值promise**

最重要的是第一和第四点。第一点，地球人都知道，不说了。**第四点，返回promise对象**，而`generator`返回的`iterator`对象。这是非常重要的差异点。

实际上`async`函数执行的时候，一旦遇到`await`就会先返回（返回一个`promise`对象），等到异步操作完成，再接着执行函数体内后面的语句。`async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数。

## 解析那个馒头

为了一个馒头引发了一场血案，为了一篇文章引发了今天的扒衣行动。那我们回过头来再来看看这篇文章《为啥await在forEach中不生效》。

文章中有这么一段代码：

```javaScript

function test() {
  let arr = [3, 2, 1]
  arr.forEach(async item => {
    const res = await fetch(item)
    console.log(res)
  })
  console.log('end')
}

function fetch(x) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(x)
    }, 500 * x)
  })
}

test()

```

看了文章，大概了解这段代码其实是想做一个事情，虽然异步了，但是想按照数组排序顺序显示数组中的元素。使用forEach遍历，没有实现这个需求。所以才有了文章的标题。但是女一号表示这个锅，我不背。不是我不行，而是你没把我安排到好的剧本中。

来，我们换个剧本，依然在`forEach`里面，但是呢，在里面的回调函数中做点文章。

```javaScript

function test() {
    let arr = ["a", "b", "c"]
    arr.forEach(async (item,index) => {
      console.log('循环第'+index+'次')
      const res = await fetch(item)
      console.log('res',res)
      const res1 = await fetch1(res);
      console.log('res1',res1)
    })
    console.log('end')
  }
  
  function fetch(x,index) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(x+"经过fetch处理")
      }, 500)
    })
  }
  
  function fetch1(x) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(x+" 经过fetch1处理")
      }, 100)
    })
  }
  
  test()

```

这个剧本，`async`函数里面对两个异步表达式设置了`await`。并且都是后一个`await`的异步表达式使用了前一个`await`异步表达式的返回值作为参数。也就是说如果`async`在`forEach`中有作用，那么后一个异步表达式肯定会用前一个异步表达式的返回值做参数。也就是说我们期望的输出效果应该是：

> 循环第0次<br>
循环第1次<br>
循环第2次<br>
end<br>
undefined<br>
res a经过fetch处理<br>
res b经过fetch处理<br>
res c经过fetch处理<br>
res1 a经过fetch处理 经过fetch1处理<br>
res1 b经过fetch处理 经过fetch1处理<br>
res1 c经过fetch处理 经过fetch1处理<br>

亲们，你们可以试试，是不是这样子的输出。嘿嘿，我已经试了，确实是这样子输出的。


我们来看看为什么剧本一达不到预期的目的，而剧本二达到了预期的目的？很简单，`async`函数返回的是什么，返回的是`promise`，是一个异步对象。而`forEach`是一个个的回调函数，也就是说这些回调函数会**立即执行**，当执行到一个`await`关键字附近的时候，就会返回一个`promise`对象，`async`函数内部被冻结，等待`await`后面的异步表达式执行完后，再执行`async`函数内部的剩余代码。因此剧本一forEach时得到的是一堆的`promise`对象，而不是`async`函数内部的执行结果。`async`函数保证的是函数内部的`await`的顺序执行。那么也就能说明`async`在`forEach`中是有作用的，只是场景不对罢了。

## 总结

其实无论`async`还是`generator`都还有很多点没有扒到。`async`和`generator`的出现对于异步函数的处理真的是一个质的飞跃，较于原来的回调函数的金字塔，`promise`的非语义化来说，`async`完全可以胜任女一号的。


## 参考文献

1、《重学 JS：为啥 await 在 forEach 中不生效》<https://juejin.im/post/5cb1d5a3f265da03587bed99>

2、《ECMAScript 6 入门》 <https://es6.ruanyifeng.com/#docs/async>









