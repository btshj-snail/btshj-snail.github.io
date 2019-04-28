# 走位setTimeout，回手掏Event Loop

 <p class="article-desc">日期:2019.4.27</p>

 ---

 > 本文仅是技术验证，记录，交流，不针对任何人。有冒犯的地方，请谅解。

 本想喝着`coffee`,看着娃,过一个恬静的周六。`occasionally`,浏览到一段代码，觉的蛮有趣。

 ```javaScript

setTimeout(function(){console.log(1)},30)

setTimeout(function(){console.log(2)},10)

setTimeout(function(){console.log(3)},0)

let now = new Date();

while(new Date() - now<100){

}

console.log(0);

```

估计大部分人都会知道第一个输出会是`0`（如果还不知道为什么`0`会先输出，也没有关系，看完整篇文章你就会知道了）.
但是后面输出的顺序到底是`3>2>1`还是`1>2>3`，估计就有争议了。

> 回手掏，鬼刀一开看不见，走位走位，手里干

## 走位，走位（简单使用setTimeout）

想知道上面的答案？等着，让我们先来看看`setTimeout`相关基础。

`setTimeout()` 方法可以设置一个定时器，该定时器在定时器到期后执行一个函数或指定的一段代码。

最简单的示例：

`100ms`后弹出系统对话框。（非严谨的，用俚语表述的需求。。。莫怪）

```javaScript

    setTimeout(function(){
        alert('走位，走位')
    }，100)

```
好简单的，是不？地球人都知道的东西，再写就没意思了。接下来写点可能会不知道的东东。

- 1.函数参数个数

    let timer = window.setTimeout(fun\[,delay,param1,param2,...]);

我们常用的就两个参数，估计一个参数，或者多于两个参数的情况用的比较少。只有一个参数时，延迟时间默认为0；有多于两个参数时，除开第一和第二参数的其他参数，我们称之为“附加参数”。附加参数都会做为回调函数的参数传递。

```javaScript

let func = function(a,b){
    console.log(a+b); 
}

setTimeout(func,100,10,20); //30

```

- 2.用于防抖


防抖:在事件被触发n秒后再执行回调，如果在这n秒内又被触发，则重新计时。

```javaScript

function debounce(fn, wait) {
  var timer = null;
  return function () {
      var context = this
      var args = arguments
      if (timer) {
          clearTimeout(timer);
          timer = null;
      }
      timer = setTimeout(function () {
          fn.apply(context, args)
      }, wait)
  }
}

```

- 3.轮循任务（setInterval）
`js`中可以使用`setInterval`开启轮询，但是这种存在一个问题就是执行间隔往往就不是你希望的间隔时间。使用`setTimeout`构造轮询能保证每次轮询的间隔。

- 4.程序切片
我们都清楚`js`是单线程的，意味着js处理大数据的时候，容易处于‘假死’状态。那么这个时候，我们可以利用`setTimeout`进行切片，来避免‘假死’状态的出现。

```javaScript
let func = function(index){
    ....
}

for(let i=0,l=10000000000;i<l;i++){
    (function(index){
        setTimeout(function(){func(index)},0)
    })(i)
}

```

基本`setTimeout`常用的用法就是这些。


## 回手掏（setTimeout原理及javaScript运行机制之event loop）

走位完了，让我们一起回手掏掏他们的原理和机制。

### js 单线程
我们都知道，现代浏览器每个标签页就是一个进程，每个进程下面又包含了各种线程，比如`javaScript`线程，渲染线程，请求线程等等。也就是说`js`是单线程的。估计有人要问了为什么`js`是单线程呢，为什么不是多线程呢？其实这和`js`的用途有关系。作为浏览器脚本语言，`JavaScript`的主要用途是与用户互动，以及操作`DOM`。这决定了它只能是单线程，否则会带来很复杂的同步问题。比如，假定`JavaScript`同时有两个线程，一个线程在某个`DOM`节点上添加内容，另一个线程删除了这个节点，这时浏览器应该以哪个线程为准？所以，为了避免复杂性，从一诞生，`JavaScript`就是单线程，这已经成了这门语言的核心特征，将来也不会改变。为了利用多核`CPU`的计算能力，`HTML5`提出`Web Worker`标准，允许`JavaScript`脚本创建多个线程，但是子线程完全受主线程控制，且不得操作`DOM`。所以，这个新标准并没有改变`JavaScript`单线程的本质。

OK，`js`是单线程，那么我们可以得出`setTimeout`绝对不是开启另一个线程来实现异步的。那`setTimeout`是如何达到异步效果的呢？

### 任务队列

在`js`中，所有任务都分为同步任务和异步任务两大类。同步任务指的是，在主线程上排队执行的任务，只有前一个任务执行完毕，才能执行后一个任务；异步任务指的是，不进入主线程、而进入"任务队列"（`task queue`）的任务，只有"任务队列"通知主线程，某个异步任务可以执行了，该任务才会进入主线程执行。

> （1）所有同步任务都在主线程上执行，形成一个执行栈（`execution context stack`）。<br>
（2）主线程之外，还存在一个"任务队列"（`task queue`）。只要异步任务有了运行结果，就在"任务队列"之中放置一个事件。<br>
（3）一旦"执行栈"中的所有同步任务执行完毕，系统就会读取"任务队列"，看看里面有哪些事件。那些对应的异步任务，于是结束等待状态，进入执行栈，开始执行。<br>
（4）主线程不断重复上面的第三步。<br>

只要主线程空了，就会去读取"任务队列"，这就是`JavaScript`的运行机制。这个过程会不断重复。

"任务队列"是一个先进先出的数据结构，排在前面的事件，优先被主线程读取。主线程的读取过程基本上是自动的，只要执行栈一清空，"任务队列"上第一位的事件就自动进入主线程。

### Event loop

主线程从"任务队列"中读取事件，这个过程是循环不断的，所以整个的这种运行机制又称为`Event Loop`（事件循环）。

这里一定要分清楚`task queue` 和`Event loop`概念。之前，发现很多人总是分不清楚`task queue` 和 `Event loop`概念。说`setTimeout`原理时，每每有人说到是将回调函数放入到事件队列里面，然后。。。。。。；真觉的这样的说法不太好。

### setTimeout理解

个人推测，每当调用`setTimeout`方法，实际上是向一个缓存对象写入一个键值对（以数字为键，以回调函数为值）。当到达指定延迟时间后，才将回调函数放入到`task queue`中，等待进入执行栈。

## 独特例子分析

在回手掏完之后，基本上`setTimeout`以及`js`运行机制应该大概明白了。通过以上的原理及机制，我们来分析一下下面的几个例子（包含之前没有说道的`setTimeout`的注意项）：

- 1. 开篇代码解析

```javaScript

setTimeout(function(){console.log(1)},30)

setTimeout(function(){console.log(2)},10)

setTimeout(function(){console.log(3)},0)

let now = new Date();

while(new Date() - now<100){

}

console.log(0);

```

这段代码在执行栈中执行顺序为：

1. 声明变量`now`；
2. 向setTimeout缓存对象中放入延迟30毫秒执行的回调函数（这个回调函数我们标记为func3）；
3. 向setTimeout缓存对象中放入延迟10毫秒执行的回调函数（这个回调函数我们标记为func2）；
4. 向setTimeout缓存对象中放入延迟0毫秒执行的回调函数（这个回调函数我们标记为func1）；
5. 向变量now赋值当前时间；
6. 一直循环100ms；
6.1. 在0ms时，将回调函数func1放入task queue中。
6.2. 在10ms时，将回调函数func2放入task queue中。
6.3. 在30ms时，将回调函数func3放入task queue中。
7. 向控制台打印0；
8. 执行栈空闲，从`task queue`中提取第一个任务（func1）。执行完func1后，再从task queue 中提取一个任务（func2）。执行完func2后，再从task queue 中提取一个任务（func3）.

以上就是整个代码的大概执行流程。因此，我们得到的打印顺序为 0>3>2>1。这个里面主要是要理解，**调用setTimeout方法并不是直接将回调函数放入`task queue`中，而是等到到达指定延时后，才将回调函数放入`task queue`中**。

- 2.最大延迟时长

也许你经常用几秒或者几十秒做延迟时间，估计你很少会想到`setTimeout`能设置的最大的延迟时间是多少呢？或者如果超出`setTimeout`的最大延迟时长，又会怎么样？

在一篇文章上看到过，`setTimout`最大延迟时长是用32位有符号数存储的，因此他的最大值应该是`Math.pow(2,31)-1=2147483647`,那么换算成天，大约就是`24.8`天。如果设置的时长大于`2147483647`，那么`setTimeout`的延时时长将会自动设置为`0`；

```javaScript

setTimeout(function(){console.log(1)},2147483648)

setTimeout(function(){console.log(2)},2147483647)

```

你会看到，控制台会立即输出`1`，而`2`却没有输出，如果上面的结论是正确的，要想看到`2`，估计要等`24.8`天了。嘿嘿，反正我是不准备等的了。。。又想尝试的兄弟，可以试了以后告知下。

- 3. 延时时长0

在MDN上看到这么一句话，“`delay`取默认值`0`，意味着“马上”执行，或者尽快执行。”

也就是说将延时时长设置为`0`，是在有条件的情况下尽快执行。但真的是`0`毫秒就放入`task queue`中吗？

我们来看段代码：

```javaScript

setTimeout(function(){
    console.log(2)
},2)

setTimeout(function(){
    console.log(6)
},6)

setTimeout(function(){
    console.log(1)
},1)

setTimeout(function(){
    console.log(3)
},3)

setTimeout(function(){
    console.log(0)
},0)

```

这样的一段代码，可能会有些人认为他的输出结果是：`0>1>2>3>6`.实际情况却不是这样的，实际输出确是`1>0>2>3>6`.

有人解释说，这是因为从执行延时1ms的延时函数，到执行`0ms`的延时函数，中间超过了`1ms`，导致延时`1ms`的回调函数先于延时`0ms`的回调函数进入`task queue`中。但是这种说法真不能苟同，如果这样都需要`1ms`那么`js`的运行效率也太低了。而且可以在`1ms`的延时函数 和` 0ms`的延时函数打印时间戳，可以发现，根本不可能是运行超过`1ms`导致的结果。

那么我们将`1ms`的延时函数和`0ms`的延时函数任意交换位置可以发现，谁在前面谁先进入`task queue`。那么可以大胆推论，其实延时`0ms`与延时`1ms`是等价的（这个结论是自我推导的，不一定正确）。因此才有了`1>0>2>3>6`输出顺序。


- 4. 最小间隔时长

有人会说上面例子输出结果是因为`setTimeout`的最小间隔时长导致的。最小间隔时长，是个很恶心的概念，最初接触的时候没有正确理解，导致一度认为这个最小间隔时长有问题。

我们来看看最小间隔时长在`MDN`上面的解释。在`MDN`上面它不叫“最小间隔时长”，而是叫做“最小延迟时间”。在以前，最小间隔时长通常为`10ms`，现在的现代浏览器通常为`4ms`（根据各个浏览器的不同会有些差异）。一直以来，都被“最小延迟时间”这个名词所误导，总认为延时时长必须大于等于最小延迟时间。但是，各种测试总是实现不了或者验证不了这个“最小延迟时间”。在读`MDN`的时候，发现它有这么一句话"这通常是由于函数嵌套导致（嵌套层级达到一定深度），或者是由于已经执行的`setInterval`的回调函数阻塞导致".

> 在浏览器中，setTimeout()/setInterval() 的每调用一次定时器的最小间隔是4ms，这通常是由于函数嵌套导致（嵌套层级达到一定深度），或者是由于已经执行的setInterval的回调函数阻塞导致的

这才焕然大悟，原来“最小延迟时间”是有限制条件的，他的限制条件就是函数嵌套到达一定深度，或者setInterval回调阻塞。

那么接下来我们就用一段代码验证下：

```javaScript

function doFunc(count){
    console.time('time total:')
    let timeFunc = function(){
        if(count>=0){
            setTimeout(timeFunc,0)
            count --;
        }else{
            console.timeEnd('time total:')
        }
    }
    timeFunc()
}
doFunc(10)

```

如果没有最小延迟时间的限制，那么在只有这段代码的环境下运行，那么应该会很快运行完。但是在chrome中实际输出确是`33.2451171875ms`。这就直接证明了最小延迟时间的存在，并且触发他的条件是函数嵌套到达了一定深度。

好吧，个人觉的`setTimeout`的小九九也就这些了，没有再写下去的必要了。比如`setTimeout`回调函数中的`this`，怎么清除当前建立的所有`setTimeout`等等。类似这些地球人都知道的事情，估计也不是您看这篇文章的目的了。

走吧，客官们，嗨把刺激战场喽。。。。


## 参考文献

1、《window​.set​Timeout》<https://developer.mozilla.org/zh-CN/docs/Web/API/Window/setTimeout>

2、《JavaScript 运行机制详解：再谈Event Loop》<http://www.ruanyifeng.com/blog/2014/10/event-loop.html>

3、《setTimeout最小间隔4ms的问题》<https://segmentfault.com/q/1010000014975261>

4、《setTimeout初探(一)：4ms的真伪》 <https://blog.csdn.net/yiifaa/article/details/52046333?utm_source=blogxgwz6>

5、 《setTimeout的那些事》<https://imweb.io/topic/56ac67fbe39ca21162ae6c78>
