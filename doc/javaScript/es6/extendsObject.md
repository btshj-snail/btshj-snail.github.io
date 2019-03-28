# 对象的扩展

对象（object）是 JavaScript 最重要的数据结构。ES6 对它进行了重大升级，本章介绍数据结构本身的改变，下一章介绍[Object对象的新增方法](./addObjectFun.md)。

## 1. 属性的简洁表示法

ES6 允许直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。ES6 允许在对象之中，直接写变量。这时，属性名为变量名, 属性值为变量的值。属性的赋值器（`setter`）和取值器（`getter`），事实上也是采用这种写法。

## 2. 属性名表达式 

JavaScript 定义对象的属性，有两种方法。方法一是直接用标识符作为属性名，方法二是用表达式作为属性名,这时要将表达式放在方括号之内。但是，如果使用字面量方式定义对象（使用大括号），在 ES5 中只能使用方法一（标识符）定义属性。

```javaScript

// 方法一
obj.foo = true;

// 方法二
obj['a' + 'bc'] = 123;

var obj1 = {
  foo: true,
  abc: 123
};

```
ES6 允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。

```javaScript

let propKey = 'foo';

let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};

```
注意，属性名表达式与简洁表示法，不能同时使用，会报错。

```javaScript
let foo = "f";
let o = {[foo]}
//报错.属性名表达式不能和简洁表示法一同使用
```

## 3. 方法的 name 属性

函数的`name`属性，返回函数名。对象方法也是函数，因此也有`name`属性。
如果对象的方法使用了取值函数（`getter`）和存值函数（`setter`），则`name`属性不是在该方法上面，而是该方法的属性的描述对象的get和set属性上面，返回值是方法名前加上`get`和`set`。

```javaScript

const obj = {
  get foo() {},
  set foo(x) {}
};

obj.foo.name
// TypeError: Cannot read property 'name' of undefined

const descriptor = Object.getOwnPropertyDescriptor(obj, 'foo');

descriptor.get.name // "get foo"
descriptor.set.name // "set foo"


```
有两种特殊情况：`bind`方法创造的函数，`name`属性返回`bound`加上原函数的名字；`Function`构造函数创造的函数，`name`属性返回`anonymous`。

```javaScript

(new Function()).name // "anonymous"

var doSomething = function() {
  // ...
};
doSomething.bind().name // "bound doSomething"

```

## 4. 属性的可枚举性和遍历
- 可枚举性
对象的每个属性都有一个描述对象（`Descriptor`），用来控制该属性的行为。`Object.getOwnPropertyDescriptor`方法可以获取该属性的描述对象。

```javaScript

let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//  {
//    value: 123,
//    writable: true,
//    enumerable: true,
//    configurable: true
//  }

```

描述对象的`enumerable`属性，称为“可枚举性”，如果该属性为`false`，就表示某些操作会忽略当前属性。

目前，有四个操作会忽略`enumerable`为`false`的属性。

- `for...in`循环：只遍历对象自身的和继承的可枚举的属性。
- `Object.keys()`：返回对象自身的所有可枚举的属性的键名。
- `JSON.stringify()`：只串行化对象自身的可枚举的属性。
- `Object.assign()`： 忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性。

这四个操作之中，前三个是 ES5 就有的，最后一个`Object.assign()`是 ES6 新增的。其中，只有`for...in`会返回继承的属性，其他三个方法都会忽略继承的属性，只处理对象自身的属性。

实际上，引入“可枚举”（enumerable）这个概念的最初目的，就是让某些属性可以规避掉`for...in`操作，不然所有内部属性和方法都会被遍历到。比如，对象原型的toString方法，以及数组的length属性，就通过“可枚举性”，从而避免被`for...in`遍历到。

另外，ES6 规定，所有 `Class` 的原型的方法都是不可枚举的。总的来说，操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用`for...in`循环，而用`Object.keys()`代替。

- 属性的遍历

ES6 一共有 5 种方法可以遍历对象的属性。

1. for...in

`for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）。

2. Object.keys(obj)

`Object.keys`返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名。

3. Object.getOwnPropertyNames(obj)

`Object.getOwnPropertyNames`返回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是**包括不可枚举属性**）的键名。

4. Object.getOwnPropertySymbols(obj)

`Object.getOwnPropertySymbols`返回一个数组，包含对象自身的所有 Symbol 属性的键名。

5. Reflect.ownKeys(obj)

`Reflect.ownKeys`返回一个数组，包含对象自身的所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举。

以上的 5 种方法遍历对象的键名，都遵守同样的属性遍历的次序规则。

- 首先遍历所有数值键，按照数值升序排列。
- 其次遍历所有字符串键，按照加入时间升序排列。
- 最后遍历所有 Symbol 键，按照加入时间升序排列。


## 5. super 关键字 

我们知道，`this`关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字`super`，指向当前对象的原型对象。

注意，super关键字表示原型对象时，只能用在对象的方法之中，用在其他地方都会报错。目前，只有对象方法的简写法可以让 JavaScript 引擎确认，定义的是对象的方法。

## 6. 对象的扩展运算符

[《数组的扩展》](./extendsArray.md)一章中，已经介绍过扩展运算符（`...`）。ES2018 将这个运算符引入了对象。

- 解构赋值

对象的解构赋值用于从一个对象取值，相当于将目标对象自身的所有可遍历的（`enumerable`）、但尚未被读取的属性，分配到指定的对象上面。所有的键和它们的值，都会拷贝到新对象上面。**扩展运算符的解构赋值，不能复制继承自原型对象的属性。**

```javaScript

let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }

```

- 

下面是另一个例子。

```javaScript
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
x // 1
y // undefined
z // 3
```
上面代码中，变量x是单纯的解构赋值，所以可以读取对象o继承的属性；变量y和z是扩展运算符的解构赋值，只能读取对象o自身的属性，所以变量z可以赋值成功，变量y取不到值。

- 扩展运算符

