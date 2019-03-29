# Proxy


`Proxy` 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（`meta programming`），即对编程语言进行编程。

`Proxy` 可以理解成，在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。Proxy 这个词的原意是代理，用在这里表示由它来“代理”某些操作，可以译为“代理器”。

```javaScript

var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});


```
上面代码对一个空对象架设了一层拦截，重定义了属性的读取（`get`）和设置（`set`）行为。这里暂时先不解释具体的语法，只看运行结果。对设置了拦截行为的对象`obj`，去读写它的属性，就会得到下面的结果。

```javaScript

obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2

```

ES6 原生提供 `Proxy` 构造函数，用来生成 `Proxy` 实例。

```javaScript

var proxy = new Proxy(target, handler);

```
`Proxy` 对象的所有用法，都是上面这种形式，不同的只是handler参数的写法。其中，new Proxy()表示生成一个Proxy实例，target参数表示所要拦截的目标对象，handler参数也是一个对象，用来定制拦截行为。

```javaScript

var proxy = new Proxy({}, {
  get: function(target, property) {
    return 35;
  }
});

proxy.time // 35
proxy.name // 35
proxy.title // 35

```

上面代码中，作为构造函数，`Proxy`接受两个参数。第一个参数是所要代理的目标对象（上例是一个空对象），即如果没有`Proxy`的介入，操作原来要访问的就是这个对象；第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。比如，上面代码中，配置对象有一个`get`方法，用来拦截对目标对象属性的访问请求。`get`方法的两个参数分别是目标对象和所要访问的属性。可以看到，由于拦截函数总是返回`35`，所以访问任何属性都得到`35`。

注意，要使得`Proxy`起作用，必须针对`Proxy`实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。

如果`handler`没有设置任何拦截，那就等同于直接通向原对象。对于可以设置、但没有设置拦截的操作，则直接落在目标对象上，按照原先的方式产生结果。

下面是 `Proxy` 支持的拦截操作一览，一共 13 种。

- get(target, propKey, receiver)：拦截对象属性的读取，比如`proxy.foo`和`proxy['foo']`。

`get`方法用于拦截某个属性的读取操作，可以接受三个参数，依次为目标对象、属性名和 `proxy` 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

下面的例子使用`get`拦截，实现数组读取负数的索引。

```javaScript

function createArray(...elements){
    let handler = {
        get(target,propKey,receiver){
            let index = Number(propKey);
            if(index<0){
                propKey = target.length+index;
            }
            return Reflect.get(target,propKey,receiver);
        }
    }

    let target = [];
    target = [...elements];
    return new Proxy(target,handler)
}
let arr = createArray("a","b","c")
console.log(arr[-1])
```

下面是一个`get`方法的第三个参数的例子，它总是指向原始的读操作所在的那个对象，一般情况下就是 `Proxy` 实例。

```javaScript

const proxy = new Proxy({}, {
  get: function(target, property, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true

```

如果一个属性不可配置（`configurable`）且不可写（`writable`），则 `Proxy` 不能修改该属性，否则通过 `Proxy` 对象访问该属性会报错。



- set(target, propKey, value, receiver)：拦截对象属性的设置，比如`proxy.foo = v`或`proxy['foo'] = v`，返回一个布尔值。

`set`方法用来拦截某个属性的赋值操作，可以接受四个参数，依次为目标对象、属性名、属性值和` Proxy` 实例本身，其中最后一个参数可选。

注意，严格模式下，`set`代理如果没有返回`true`，就会报错。

- has(target, propKey)：拦截`propKey in proxy`的操作，返回一个布尔值。

`has`方法用来拦截`HasProperty`操作，即判断对象是否具有某个属性时，这个方法会生效。典型的操作就是`in`运算符。
`has`方法可以接受两个参数，分别是目标对象、需查询的属性名。

值得注意的是，`has`方法拦截的是`HasProperty`操作，而不是`HasOwnProperty`操作，即`has`方法不判断一个属性是对象自身的属性，还是继承的属性。

另外，虽然`for...in`循环也用到了`in`运算符，但是`has`拦截对`for...in`循环不生效。
- deleteProperty(target, propKey)：拦截`delete proxy[propKey]`的操作，返回一个布尔值。

`deleteProperty`方法用于拦截`delete`操作，如果这个方法抛出错误或者返回`false`，当前属性就无法被`delete`命令删除。注意，目标对象自身的不可配置（`configurable`）的属性，不能被`deleteProperty`方法删除，否则报错。




- ownKeys(target)：拦截`Object.getOwnPropertyNames(proxy)`、`Object.getOwnPropertySymbols(proxy)`、`Object.keys(proxy)`、`for...in`循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而`Object.keys()`的返回结果仅包括目标对象自身的可遍历属性。
- getOwnPropertyDescriptor(target, propKey)：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象。

`getOwnPropertyDescriptor`方法拦截`Object.getOwnPropertyDescriptor()`，返回一个属性描述对象或者`undefined`。

- defineProperty(target, propKey, propDesc)：拦截`Object.defineProperty(proxy, propKey, propDesc）`、`Object.defineProperties(proxy, propDescs)`，返回一个布尔值。

`defineProperty`方法拦截了`Object.defineProperty`操作。

```javaScript

var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar' // 不会生效

```
上面代码中，`defineProperty`方法返回`false`，导致添加新属性总是无效。

注意，如果目标对象不可扩展（`non-extensible`），则`defineProperty`不能增加目标对象上不存在的属性，否则会报错。另外，如果目标对象的某个属性不可写（`writable`）或不可配置（`configurable`），则d`efineProperty`方法不得改变这两个设置。



- preventExtensions(target)：拦截`Object.preventExtensions(proxy)`，返回一个布尔值。
- getPrototypeOf(target)：拦截`Object.getPrototypeOf(proxy)`，返回一个对象。

`getPrototypeOf`方法主要用来拦截获取对象原型。具体来说，拦截下面这些操作。

> Object.prototype.__proto__<br>
Object.prototype.isPrototypeOf()<br>
Object.getPrototypeOf()<br>
Reflect.getPrototypeOf()<br>
instanceof<br>

注意，`getPrototypeOf`方法的返回值必须是对象或者`null`，否则报错。另外，如果目标对象不可扩展（non-extensible）， `getPrototypeOf`方法必须返回目标对象的原型对象。

- isExtensible(target)：拦截Object.isExtensible(proxy)，返回一个布尔值。

`isExtensible`方法拦截`Object.isExtensible`操作。

注意，该方法只能返回布尔值，否则返回值会被自动转为布尔值。

这个方法有一个强限制，它的返回值必须与目标对象的`isExtensible`属性保持一致，否则就会抛出错误。

- setPrototypeOf(target, proto)：拦截Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- apply(target, object, args)：拦截 `Proxy` 实例作为函数调用的操作，比如`proxy(...args)`、`proxy.call(object, ...args)`、`proxy.apply(...)`。

`apply`方法拦截函数的调用、`call`和`apply`操作。

`apply`方法可以接受三个参数，分别是目标对象、目标对象的上下文对象（this）和目标对象的参数数组。


```javaScript

var twice = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments) * 2;
  }
};
function sum (left, right) {
  return left + right;
};
var proxy = new Proxy(sum, twice);
proxy(1, 2) // 6
proxy.call(null, 5, 6) // 22
proxy.apply(null, [7, 8]) // 30
Reflect.apply(proxy, null, [9, 10]) // 38
```
上面代码中，每当执行`proxy`函数（直接调用或`call`和`apply`调用），就会被`apply`方法拦截。

另外，直接调用`Reflect.apply`方法，也会被拦截。

- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作，比如`new proxy(...args)`。

`construct`方法用于拦截`new`命令，下面是拦截对象的写法。
```javaScript

var handler = {
  construct (target, args, newTarget) {
    return new target(...args);
  }
};

```
construct方法可以接受两个参数。

(1). target：目标对象
(2). args：构造函数的参数对象
(3). newTarget：创造实例对象时，new命令作用的构造函数（下面例子的p）

```javaScript

var p = new Proxy(function () {}, {
  construct: function(target, args) {
    console.log('called: ' + args.join(', '));
    return { value: args[0] * 10 };
  }
});

(new p(1)).value
// "called: 1"
// 10


```

construct方法返回的必须是一个对象，否则会报错。


## Proxy.revocable() 

`Proxy.revocable`方法返回一个可取消的 `Proxy` 实例。
```javaScript
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```

`Proxy.revocable`方法返回一个对象，该对象的`proxy`属性是`Proxy`实例，`revoke`属性是一个函数，可以取消`Proxy`实例。上面代码中，当执行`revoke`函数之后，再访问`Proxy`实例，就会抛出一个错误。

`Proxy.revocable`的一个使用场景是，目标对象不允许直接访问，必须通过代理访问，一旦访问结束，就收回代理权，不允许再次访问。


## this 问题

虽然 `Proxy` 可以代理针对目标对象的访问，但它不是目标对象的透明代理，即不做任何拦截的情况下，也无法保证与目标对象的行为一致。主要原因就是在 `Proxy` 代理的情况下，目标对象内部的`this`关键字会指向 `Proxy` 代理。

```javaScript

const target = new Date('2015-01-01');
const handler = {
  get(target, prop) {
    if (prop === 'getDate') {
      return target.getDate.bind(target);
    }
    return Reflect.get(target, prop);
  }
};
const proxy = new Proxy(target, handler);

proxy.getDate() // 1

```