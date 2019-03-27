# 函数的扩展

## 1. 函数参数的默认值 

ES6 之前，不能直接为函数的参数指定默认值，只能采用变通的方法。ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。

```javaScript

function log(x, y = 'World') {
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello

```

除了简洁，ES6 的写法还有两个好处：首先，阅读代码的人，可以立刻意识到哪些参数是可以省略的，不用查看函数体或文档；其次，有利于将来的代码优化，即使未来的版本在对外接口中，彻底拿掉这个参数，也不会导致以前的代码无法运行。

参数变量是默认声明的，所以不能用let或const再次声明。

**使用参数默认值时，函数不能有同名参数。**

```javaScript

// 不报错
function foo(x, x, y) {
  // ...
}

// 报错
function foo(x, x, y = 1) {
  // ...
}
// SyntaxError: Duplicate parameter name not allowed in this context

```
另外，一个容易忽略的地方是，参数默认值不是传值的，而是每次都重新计算默认值表达式的值。也就是说，参数默认值是惰性求值的。

```javaScript

let x = 99;
function foo(p = x + 1) {
  console.log(p);
}

foo() // 100

x = 100;
foo() // 101

```

### 与解构赋值默认值结合使用

参数默认值可以与解构赋值的默认值，结合起来使用。

```javaScript

function foo({x, y = 5}) {
  console.log(x, y);
}

foo({}) // undefined 5
foo({x: 1}) // 1 5
foo({x: 1, y: 2}) // 1 2
foo() // TypeError: Cannot read property 'x' of undefined

```

上面代码只使用了对象的解构赋值默认值，没有使用函数参数的默认值。只有当函数`foo`的参数是一个对象时，变量x和y才会通过解构赋值生成。如果函数foo调用时没提供参数，变量x和y就不会生成，从而报错。通过提供函数参数的默认值，就可以避免这种情况。

```javaScript

function foo({x, y = 5} = {}) {
  console.log(x, y);
}

foo() // undefined 5

```
上面代码指定，如果没有提供参数，函数`foo`的参数默认为一个空对象。

### 参数默认值的位置

通常情况下，定义了默认值的参数，应该是函数的尾参数。因为这样比较容易看出来，到底省略了哪些参数。如果非尾部的参数设置默认值，实际上这个参数是没法省略的。定义了默认值的参数不是尾参数，是无法只省略该参数，而不省略它后面的参数，除非显式输入undefined。

如果传入undefined，将触发该参数等于默认值，null则没有这个效果。

### 函数的 length 属性

指定了默认值以后，函数的`length`属性，将返回没有指定默认值的参数个数。也就是说，指定了默认值后，`length`属性将失真.这是因为`length`属性的含义是，该函数预期传入的参数个数。某个参数指定默认值以后，预期传入的参数个数就不包括这个参数了。同理，后文的 `rest` 参数也不会计入`length`属性。如果设置了默认值的参数不是尾参数，那么`length`属性也不再计入后面的参数了。

```javaScript

(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
(function (a=5,b,c){}).length //0
```
### 作用域

一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域（`context`）。等到初始化结束(调用函数的时候会去处理参数完毕)，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的。

```javaScript

var x = 1;

function f(x, y = x) {
  console.log(y);
}

f(2) // 2

```

## 2. rest参数

ES6 引入 `rest` 参数（形式为`...变量名`），用于获取函数的多余参数，这样就不需要使用`arguments`对象了。`rest` 参数搭配的变量是一个数组，该变量将多余的参数放入数组中。

```javaScript

function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10

```
注意，rest 参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。
函数的length属性，不包括 rest 参数。
```javaScript

(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1

```

## 3.严格模式

从 ES5 开始，函数内部可以设定为严格模式。ES2016 做了一点修改，规定只要***函数参数***使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错。

这样规定的原因是，函数内部的严格模式，同时适用于函数体和函数参数。但是，函数执行的时候，先执行函数参数，然后再执行函数体。这样就有一个不合理的地方，只有从函数体之中，才能知道参数是否应该以严格模式执行，但是参数却应该先于函数体执行。
```javaScript

function doSomething(value=070){
    'use strict'
    return value;
}

```

上面代码中，参数`value`的默认值是八进制数`070`，但是严格模式下不能用前缀0表示八进制，所以应该报错。但是实际上，JavaScript 引擎会先成功执行`value = 070`，然后进入函数体内部，发现需要用严格模式执行，这时才会报错。

虽然可以先解析函数体代码，再执行参数代码，但是这样无疑就增加了复杂性。因此，标准索性禁止了这种用法，只要参数使用了默认值、解构赋值、或者扩展运算符，就不能显式指定严格模式。

两种方法可以规避这种限制。第一种是设定全局性的严格模式，这是合法的。第二种是把函数包在一个无参数的立即执行函数里面。

## 4. name 属性

函数的name属性，返回该函数的函数名。
```javaScript
function foo() {}
foo.name // "foo"
```
这个属性早就被浏览器广泛支持，但是直到 ES6，才将其写入了标准。

需要注意的是，ES6 对这个属性的行为做出了一些修改。如果将一个匿名函数赋值给一个变量，ES5 的`name`属性，会返回空字符串，而 ES6 的`name`属性会返回实际的函数名。
```javaScript
var f = function () {};

// ES5
f.name // ""

// ES6
f.name // "f"
```
上面代码中，变量f等于一个匿名函数，ES5 和 ES6 的`name`属性返回的值不一样。

如果将一个具名函数赋值给一个变量，则 ES5 和 ES6 的`name`属性都返回这个具名函数原本的名字。

```
const bar = function baz() {};

// ES5
bar.name // "baz"

// ES6
bar.name // "baz"
```

Function构造函数返回的函数实例，`name`属性的值为`anonymous`。

```javaScript
(new Function).name // "anonymous"
```

bind返回的函数，name属性值会加上bound前缀。

```javaScript
function foo() {};
foo.bind({}).name // "bound foo"

(function(){}).bind({}).name // "bound "
```
 ## 5.箭头函数

 ES6 允许使用“箭头”（=>）定义函数。如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。如果箭头函数的代码块部分多于一条语句，就要使用大括号将它们括起来，并且使用return语句返回。由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号，否则会报错。

 ### 使用注意点 

 箭头函数有几个使用注意点。

- （1）函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

- （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。

- （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。

- （4）不可以使用yield命令，因此箭头函数不能用作 Generator 函数。

上面四点中，第一点尤其值得注意。this对象的指向是可变的，但是在箭头函数中，它是固定的。

`this`指向的固定化，并不是因为箭头函数内部有绑定`this`的机制，实际原因是箭头函数根本没有自己的`this`，导致内部的`this`就是外层代码块的`this`。正是因为它没有`this`，所以也就不能用作构造函数。

除了`this`，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：`arguments`、`super`、`new.target`。另外，由于箭头函数没有自己的`this`，所以当然也就不能用`call()`、`apply()`、`bind()`这些方法去改变this的指向。

```javaScript

(function() {
  return [
    (() => this.x).bind({ x: 'inner' })()
  ];
}).call({ x: 'outer' });
// ['outer']

```

上面代码中，箭头函数没有自己的`this`，所以`bind`方法无效，内部的`this`指向外部的`this`。

长期以来，JavaScript 语言的`this`对象一直是一个令人头痛的问题，在对象方法中使用`this`，必须非常小心。箭头函数”绑定”`this`，很大程度上解决了这个困扰。

### 不适用场合

- 第一个场合是定义函数的方法，且该方法内部包括this。

```javaScript

const cat = {
  lives: 9,
  jumps: () => {
    this.lives--;
  }
}

```
上面代码中，`cat.jumps()`方法是一个箭头函数，这是错误的。调用`cat.jumps()`时，如果是普通函数，该方法内部的`this`指向`cat`；如果写成上面那样的箭头函数，使得`this`指向全局对象，因此不会得到预期结果。

- 第二个场合是需要动态this的时候，也不应使用箭头函数。

```javaScript

var button = document.getElementById('press');
button.addEventListener('click', () => {
  this.classList.toggle('on');
});


```


### 嵌套的箭头函数

## 6. 双冒号运算符

箭头函数可以绑定`this`对象，大大减少了显式绑定`this`对象的写法（`call`、`apply`、`bind`）。但是，箭头函数并不适用于所有场合，所以现在有一个提案，提出了“函数绑定”（`function bind`）运算符，用来取代`call`、`apply`、`bind`调用。

函数绑定运算符是并排的两个冒号（::），双冒号左边是一个对象，右边是一个函数。该运算符会自动将左边的对象，作为上下文环境（即`this`对象），绑定到右边的函数上面。
```javaScript
foo::bar;
// 等同于
bar.bind(foo);

foo::bar(...arguments);
// 等同于
bar.apply(foo, arguments);

const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return obj::hasOwnProperty(key);
}

```


如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。

```javaScript
var method = obj::obj.foo;
// 等同于
var method = ::obj.foo;

let log = ::console.log;
// 等同于
var log = console.log.bind(console);
```

如果双冒号运算符的运算结果，还是一个对象，就可以采用链式写法。
```javaScript
import { map, takeWhile, forEach } from "iterlib";

getPlayers()
::map(x => x.character())
::takeWhile(x => x.strength > 100)
::forEach(x => console.log(x));
```

## 7. 尾调用优化

什么是尾调用

尾调用（`Tail Call`）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。

```javaScript

function f(x){
  return g(x);
}

```
尾调用不一定出现在函数尾部，只要是最后一步操作即可。

尾调用之所以与其他调用不同，就在于它的特殊的调用位置。

我们知道，函数调用会在内存形成一个“调用记录”，又称“调用帧”（`call frame`），保存调用位置和内部变量等信息。如果在函数A的内部调用函数B，那么在A的调用帧上方，还会形成一个B的调用帧。等到B运行结束，将结果返回到A，B的调用帧才会消失。如果函数B内部还调用函数C，那就还有一个C的调用帧，以此类推。所有的调用帧，就形成一个“调用栈”（`call stack`）。

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用帧，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用帧，取代外层函数的调用帧就可以了。
```javaScript
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```
上面代码中，如果函数`g`不是尾调用，函数f就需要保存内部变量`m`和`n`的值、g的调用位置等信息。但由于调用`g`之后，函数`f`就结束了，所以执行到最后一步，完全可以删除`f(x)`的调用帧，只保留`g(3)`的调用帧。

这就叫做“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。

注意，只有不再用到外层函数的内部变量，内层函数的调用帧才会取代外层函数的调用帧，否则就无法进行“尾调用优化”。
```javaScript
function addOne(a){
  var one = 1;
  function inner(b){
    return b + one;
  }
  return inner(a);
}
```
上面的函数不会进行尾调用优化，因为内层函数`inner`用到了外层函数`addOne`的内部变量`one`。

### 尾递归

函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用帧，很容易发生“栈溢出”错误（stack overflow）。但对于尾递归来说，由于只存在一个调用帧，所以永远不会发生“栈溢出”错误。

```javaScript

function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5) // 120


```
上面代码是一个阶乘函数，计算`n`的阶乘，最多需要保存`n`个调用记录，复杂度 `O(n)` 。

如果改写成尾递归，只保留一个调用记录，复杂度 O(1) 。

```javaScript

function factorial(n,total) {
  if (n === 1) return 1;
  return factorial(n - 1,n*total);
}

factorial(5,1) // 120

```

由此可见，“尾调用优化”对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 亦是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署“尾调用优化”。这就是说，ES6 中只要使用尾递归，就不会发生栈溢出，相对节省内存。

### 递归函数的改写

尾递归的实现，往往需要改写递归函数，确保最后一步只调用自身。做到这一点的方法，就是把所有用到的内部变量改写成函数的参数。比如上面的例子，阶乘函数 `factorial` 需要用到一个中间变量`total`，那就把这个中间变量改写成函数的参数。这样做的缺点就是不太直观，第一眼很难看出来，为什么计算5的阶乘，需要传入两个参数5和1？

两个方法可以解决这个问题。

- 方法一是在尾递归函数之外，再提供一个正常形式的函数。

```javaScript

function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

function factorial(n) {
  return tailFactorial(n, 1);
}

factorial(5) // 120

```

上面代码通过一个正常形式的阶乘函数`factorial`，调用尾递归函数`tailFactorial`，看起来就正常多了。

函数式编程有一个概念，叫做柯里化（`currying`），意思是将多参数的函数转换成单参数的形式。这里也可以使用柯里化。

```javaScript

function currying(fn, n) {
  return function (m) {
    return fn.call(this, m, n);
  };
}

function tailFactorial(n, total) {
  if (n === 1) return total;
  return tailFactorial(n - 1, n * total);
}

const factorial = currying(tailFactorial, 1);

factorial(5) // 120

```

- 第二种方法就简单多了，就是采用 ES6 的函数默认值。

```javaScript

function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}

factorial(5) // 120

```

总结一下，递归本质上是一种循环操作。纯粹的函数式编程语言没有循环操作命令，所有的循环都用递归实现，这就是为什么尾递归对这些语言极其重要。对于其他支持“尾调用优化”的语言（比如 Lua，ES6），只需要知道循环可以用递归代替，而一旦使用递归，就最好使用尾递归。


## 8. 函数参数的尾逗号 

ES2017 允许函数的最后一个参数有尾逗号（trailing comma）。

此前，函数定义和调用时，都不允许最后一个参数后面出现逗号。

