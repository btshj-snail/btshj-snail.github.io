# Promise对象

## 1. Promise 的含义

`Promise` 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，ES6 将其写进了语言标准，统一了用法，原生提供了`Promise`对象。

所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，`Promise` 是一个对象，从它可以获取异步操作的消息。`Promise` 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

`Promise`对象有以下两个特点。

（1）对象的状态不受外界影响。`Promise`对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是`Promise`这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

（2）一旦状态改变，就不会再变，任何时候都可以得到这个结果。`Promise`对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对`Promise`对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

注意，为了行文方便，本章后面的resolved统一只指fulfilled状态，不包含rejected状态。

有了`Promise`对象，就可以将异步操作以同步操作的流程表达出来，避免了层层嵌套的回调函数。此外，`Promise`对象提供统一的接口，使得控制异步操作更加容易。

`Promise`也有一些缺点。

首先，无法取消`Promise`，一旦新建它就会立即执行，无法中途取消。

其次，如果不设置回调函数，`Promise`内部抛出的错误，不会反应到外部。

第三，当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。

如果某些事件不断地反复发生，一般来说，使用 `Stream` 模式是比部署`Promise`更好的选择。

ES6 规定，`Promise`对象是一个构造函数，用来生成`Promise`实例。

下面代码创造了一个`Promise`实例。

```javaScript
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```
## 3. Promise.prototype.then()

它的作用是为 `Promise` 实例添加状态改变时的回调函数。前面说过，`then`方法的第一个参数是`resolved`状态的回调函数，第二个参数（可选）是`rejected`状态的回调函数.

`then`方法返回的是一个新的`Promise`实例（注意，不是原来那个`Promise`实例）。因此可以采用链式写法，即`then`方法后面再调用另一个`then`方法。

## 4. Promise.prototype.catch()

`Promise.prototype.catch`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。另外，`then`方法指定的回调函数，如果运行中抛出错误，也会被`catch`方法捕获。

`Promise` 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。


## 5. Promise.prototype.finally()

`finally`方法用于指定不管 `Promise` 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。不管`promise`最后的状态，在执行完`then`或`catch`指定的回调函数以后，都会执行`finally`方法指定的回调函数。

## 6. Promise.all()

`Promise.all`方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

`Promise.all`方法的参数可以不是数组，但必须具有 `Iterator` 接口，且返回的每个成员都是 `Promise` 实例。）

参数中所有的`promise`对象都变成了`fulfilled`状态，那么`Promise.all()`产生的新的`promise`才会变成`fulfilled`

参数中的`promise`对象，只要有个一变成了`rejected`状态，那么`Promise.all()`产生的新`promise`就会变成`rejected`

## 7. Promise.race()

`Promise.race`方法同样是将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

参数中的`promise`对象，只要有个一变成了`rejected`或者`fulfilled`状态，那么`Promise.race()`产生的新`promise`就会变成相同的状态。


## 8. Promise.resolve()

有时需要将现有对象转为 `Promise` 对象，`Promise.resolve`方法就起到这个作用。

`Promise.resolve`等价于下面的写法。
```javaScript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

`Promise.resolve`方法的参数分成四种情况。

- 参数是一个 Promise 实例
如果参数是 `Promise` 实例，那么`Promise.resolve`将不做任何修改、原封不动地返回这个实例。

- 参数是一个thenable对象
`thenable`对象指的是具有`then`方法的对象，比如下面这个对象。
```javaScript
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
```
`
`Promise.resolve`方法会将这个对象转为 `Promise` 对象，然后就立即执行`thenable`对象的`then`方法。

- 参数不是具有then方法的对象，或根本就不是对象

如果参数是一个原始值，或者是一个不具有`then`方法的对象，则`Promise.resolve`方法返回一个新的 `Promise` 对象，状态为`resolved`。

- 不带有任何参数

`Promise.resolve`方法允许调用时不带参数，直接返回一个`resolved`状态的 `Promise` 对象。


需要注意的是，立即`resolve`的 `Promise`对象，是在本轮“事件循环”（`event loop`）的结束时，而不是在下一轮“事件循环”的开始时。

```javaScript

setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three

```

上面代码中，`setTimeout(fn, 0)`在下一轮“事件循环”开始时执行，`Promise.resolve()`在本轮“事件循环”结束时执行，`console.log('one')`则是立即执行，因此最先输出。

## 9. Promise.reject()

`Promise.reject(reason)`方法也会返回一个新的 `Promise` 实例，该实例的状态为`rejected`。