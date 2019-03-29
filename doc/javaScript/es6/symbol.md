# Symbol

## 概述

ES5 的对象属性名都是字符串，这容易造成属性名的冲突。比如，你使用了一个他人提供的对象，但又想为这个对象添加新的方法（mixin 模式），新方法的名字就有可能与现有方法产生冲突。如果有一种机制，保证每个属性的名字都是独一无二的就好了，这样就从根本上防止属性名的冲突。这就是 ES6 引入`Symbol`的原因。

ES6 引入了一种新的原始数据类型`Symbol`，表示独一无二的值。它是 JavaScript 语言的第七种数据类型，前六种是：undefined、null、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）。

`Symbol` 值通过`Symbol`函数生成。这就是说，对象的属性名现在可以有两种类型，一种是原来就有的字符串，另一种就是新增的 `Symbol` 类型。凡是属性名属于 `Symbol` 类型，就都是独一无二的，可以保证不会与其他属性名产生冲突。

注意，`Symbol`函数前不能使用`new`命令，否则会报错。这是因为生成的 `Symbol` 是一个原始类型的值，不是对象。也就是说，由于 `Symbol` 值不是对象，所以不能添加属性。基本上，它是一种类似于字符串的数据类型。

`Symbol`函数可以接受一个字符串作为参数，表示对 `Symbol` 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

注意，`Symbol`函数的参数只是表示对当前 `Symbol` 值的描述，因此相同参数的`Symbol`函数的返回值是不相等的。

## 作为属性名的 Symbol

由于每一个 `Symbol` 值都是不相等的，这意味着 `Symbol` 值可以作为标识符，用于对象的属性名，就能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。


```javaScript

let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"

```

注意，`Symbol` 值作为对象属性名时，不能用点运算符。
```javaScript
const mySymbol = Symbol();
const a = {};

a.mySymbol = 'Hello!';
a[mySymbol] // undefined
a['mySymbol'] // "Hello!"

```

## 4. 属性名的遍历

`Symbol` 作为属性名，该属性不会出现在`for...in`、`for...of`循环中，也不会被`Object.keys()`、`Object.getOwnPropertyNames()`、`JSON.stringify()`返回。但是，它也不是私有属性，有一个`Object.getOwnPropertySymbols`方法，可以获取指定对象的所有 `Symbol` 属性名。`Object.getOwnPropertySymbols`方法返回一个数组，成员是当前对象的所有用作属性名的 `Symbol` 值。

由于以 `Symbol` 值作为名称的属性，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法


## 5. Symbol.for()，Symbol.keyFor() 

有时，我们希望重新使用同一个 `Symbol` 值，`Symbol.for`方法可以做到这一点。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 `Symbol` 值。如果有，就返回这个 `Symbol` 值，否则就新建并返回一个以该字符串为名称的 `Symbol` 值。

```javaScript

let s1 = Symbol.for('test');
let s2 = Symbol.for('test');

console.log(s1===s2)// true
```

`Symbol.for()`与`Symbol()`这两种写法，都会生成新的 `Symbol`。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。`Symbol.for()`不会每次调用就返回一个新的 `Symbol` 类型的值，而是会先检查给定的`key`是否已经存在，如果不存在才会新建一个值。比如，如果你调用`Symbol.for("cat")`30 次，每次都会返回同一个 `Symbol` 值，但是调用`Symbol("cat")`30 次，会返回 30 个不同的 `Symbol` 值。

`Symbol.keyFor`方法返回一个已登记的 `Symbol` 类型值的`key`。也就是只能返回使用`Symbol.for()`定义的`symbol`的key.

## 6. 实例 : 模块的 Singleton 模式

`Singleton` 模式指的是调用一个类，任何时候返回的都是同一个实例。

对于 `Node` 来说，模块文件可以看成是一个类。怎么保证每次执行这个模块文件，返回的都是同一个实例呢？

很容易想到，可以把实例放到顶层对象`global`。

```javaScript

// mod.js
function A() {
  this.foo = 'hello';
}

if (!global._foo) {
  global._foo = new A();
}

module.exports = global._foo;
```
然后，加载上面的mod.js。
```javaScript
const a = require('./mod.js');
console.log(a.foo);
```
上面代码中，变量a任何时候加载的都是A的同一个实例。

但是，这里有一个问题，全局变量`global._foo`是可写的，任何文件都可以修改。
```javaScript
global._foo = { foo: 'world' };

const a = require('./mod.js');
console.log(a.foo);
```
上面的代码，会使得加载`mod.js`的脚本都失真。

为了防止这种情况出现，我们就可以使用 `Symbol`。
```javaScript
// mod.js
const FOO_KEY = Symbol.for('foo');

function A() {
  this.foo = 'hello';
}

if (!global[FOO_KEY]) {
  global[FOO_KEY] = new A();
}

module.exports = global[FOO_KEY];
```
上面代码中，可以保证`global[FOO_KEY]`不会被无意间覆盖，但还是可以被改写。
```javaScript

global[Symbol.for('foo')] = { foo: 'world' };

const a = require('./mod.js');
```
如果键名使用Symbol方法生成，那么外部将无法引用这个值，当然也就无法改写。
```javaScript
// mod.js
const FOO_KEY = Symbol('foo');

// 后面代码相同 ……
```
上面代码将导致其他脚本都无法引用`FOO_KEY`。但这样也有一个问题，就是如果多次执行这个脚本，每次得到的`FOO_KEY`都是不一样的。虽然 `Node` 会将脚本的执行结果缓存，一般情况下，不会多次执行同一个脚本，但是用户可以手动清除缓存，所以也不是绝对可靠。


