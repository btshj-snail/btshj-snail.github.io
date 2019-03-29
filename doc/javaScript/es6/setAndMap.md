# Set 和 Map 数据结构

## Set

ES6 提供了新的数据结构 `Set`。它类似于数组，**但是成员的值都是唯一的，没有重复的值**。
`Set`本身是一个构造函数，用来生成 `Set` 数据结构。

`Set`函数可以接受一个数组（或者具有 `iterable` 接口的其他数据结构）作为参数，用来初始化

向 `Set` 加入值的时候，不会发生类型转换，所以5和"5"是两个不同的值。`Set` 内部判断两个值是否不同，使用的算法叫做“Same-value-zero equality”，它**类似**于精确相等运算符（===），主要的区别是`NaN`等于自身，而精确相等运算符认为`NaN`不等于自身。

### Set 实例的属性和方法 

Set 结构的实例有以下属性。

- Set.prototype.constructor：构造函数，默认就是Set函数。
- Set.prototype.size：返回Set实例的成员总数。


Set 实例的方法分为两大类：操作方法（用于操作数据）和遍历方法（用于遍历成员）。下面先介绍四个操作方法。

操作方法:

- add(value)：添加某个值，返回 Set 结构本身。
- delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
- has(value)：返回一个布尔值，表示该值是否为Set的成员。
- clear()：清除所有成员，没有返回值。

遍历方法:

- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

另外，`forEach`方法还可以有第二个参数，表示绑定处理函数内部的`this`对象。

扩展运算符（`...`）内部使用`for...of`循环，所以也可以用于 `Set` 结构。

如果想在遍历操作中，同步改变原来的 `Set` 结构，目前没有直接的方法，但有两种变通方法。一种是利用原 `Set` 结构映射出一个新的结构，然后赋值给原来的 `Set` 结构；另一种是利用`Array.from`方法。

```javaScript

// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6

```

## 2. WeakSet

`WeakSet` 结构与 `Set` 类似，也是不重复的值的集合。但是，它与 `Set` 有两个区别。

首先，`WeakSet`的成员只能是对象，而不能是其他类型的值。

其次，`WeakSet` 中的对象都是弱引用，即垃圾回收机制不考虑 `WeakSet` 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 `WeakSet` 之中。

这是因为垃圾回收机制依赖引用计数，如果一个值的引用次数不为0，垃圾回收机制就不会释放这块内存。结束使用该值之后，有时会忘记取消引用，导致内存无法释放，进而可能会引发内存泄漏。`WeakSet` 里面的引用，都不计入垃圾回收机制，所以就不存在这个问题。因此，`WeakSet` 适合临时存放一组对象，以及存放跟对象绑定的信息。只要这些对象在外部消失，它在 `WeakSet` 里面的引用就会自动消失。

由于上面这个特点，`WeakSet` 的成员是不适合引用的，因为它会随时消失。另外，由于 `WeakSet` 内部有多少个成员，取决于垃圾回收机制有没有运行，运行前后很可能成员个数是不一样的，而垃圾回收机制何时运行是不可预测的，因此 ES6 规定 `WeakSet` 不可遍历。

`WeakSet` 是一个构造函数，可以使用`new`命令，创建 `WeakSet` 数据结构。

`WeakSet`结构有以下三个方法:

- WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
- WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
- WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 

`WeakSet` 不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。`WeakSet` 的一个用处，是储存 `DOM` 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

```javaScript

let foos = new WeakSet();

class Foo {
    constructor(){
        foos.add(this)
    }

    method(){
        if(!foos.has(this)){
            throw new TypeError('Foo.prototype.method 只能在Foo的实例上调用！');
        }
    }
}


```

上面代码保证了`Foo`的实例方法，只能在`Foo`的实例上调用。这里使用 `WeakSet` 的好处是，`foos`对实例的引用，不会被计入内存回收机制，所以删除实例的时候，不用考虑`foos`，也不会出现内存泄漏。若是使用call,apply之类的来更改`this`,会抛出异常.


## 3. Map

JavaScript 的对象（`Object`），本质上是键值对的集合（`Hash` 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。
为了解决这个问题，ES6 提供了 `Map` 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。也就是说，`Object` 结构提供了“字符串—值”的对应，`Map` 结构提供了“值—值”的对应，是一种更完善的 `Hash` 结构实现。如果你需要“键值对”的数据结构，`Map` 比 `Object` 更合适。

事实上，不仅仅是数组，任何具有 `Iterator` 接口、且每个成员都是一个双元素的数组的数据结构（详见[《Iterator》](./iterator.md)一章）都可以当作`Map`构造函数的参数。这就是说，`Set`和`Map`都可以用来生成新的 `Map`。
```javaScript
const set = new Set([
  ['foo', 1],
  ['bar', 2]
]);
const m1 = new Map(set);
m1.get('foo') // 1

const m2 = new Map([['baz', 3]]);
const m3 = new Map(m2);
m3.get('baz') // 3


```
如果对同一个键多次赋值，后面的值将覆盖前面的值。如果读取一个未知的键，则返回`undefined`。注意，只有对同一个对象的引用，`Map` 结构才将其视为同一个键。这一点要非常小心。`Map` 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。

如果 `Map` 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值**严格相等**，Map 将其视为一个键，比如0和-0就是一个键，布尔值true和字符串true则是两个不同的键。另外，undefined和null也是两个不同的键。**虽然NaN不严格相等于自身，但 Map 将其视为同一个键。**

`Map` 结构的实例有以下属性和操作方法。

- size 属性

- set(key, value)

`set`方法设置键名`key`对应的键值为`value`，然后返回整个 `Map` 结构。如果`key`已经有值，则键值会被更新，否则就新生成该键。`set`方法返回的是当前的`Map`对象，因此可以采用链式写法。

- get(key)

`get`方法读取`key`对应的键值，如果找不到`key`，返回`undefined`。

- has(key)

`has`方法返回一个布尔值，表示某个键是否在当前 `Map` 对象之中。

- delete(key)

`delete`方法删除某个键，返回`true`。如果删除失败，返回`false`。

- clear()

`clear`方法清除所有成员，没有返回值。

`Map` 结构的实例的遍历方法

- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历 Map 的所有成员。


需要特别注意的是，`Map` 的遍历顺序就是插入顺序。

`Map` 结构转为数组结构，比较快速的方法是使用扩展运算符（...）。结合数组的`map`方法、`filter`方法，可以实现 `Map` 的遍历和过滤（Map 本身没有map和filter方法）。


## 4. WeakMap

`WeakMap`结构与`Map`结构类似，也是用于生成键值对的集合。
```javaScript

// WeakMap 可以使用 set 方法添加成员
const wm1 = new WeakMap();
const key = {foo: 1};
wm1.set(key, 2);
wm1.get(key) // 2

// WeakMap 也可以接受一个数组，
// 作为构造函数的参数
const k1 = [1, 2, 3];
const k2 = [4, 5, 6];
const wm2 = new WeakMap([[k1, 'foo'], [k2, 'bar']]);
wm2.get(k2) // "bar"
```

`WeakMap`与`Map`的区别有两点。

首先，`WeakMap`只接受对象作为键名（`null`除外），不接受其他类型的值作为键名。

其次，`WeakMap`的键名所指向的对象，不计入垃圾回收机制。

`WeakMap` 与 `Map` 在 API 上的区别主要是两个，一是没有遍历操作（即没有`keys()`、`values()`和`entries()`方法），也没有`size`属性。因为没有办法列出所有键名，某个键名是否存在完全不可预测，跟垃圾回收机制是否运行相关。这一刻可以取到键名，下一刻垃圾回收机制突然运行了，这个键名就没了，为了防止出现不确定性，就统一规定不能取到键名。二是无法清空，即不支持`clear`方法。因此，`WeakMap`只有四个方法可用：`get()`、`set()`、`has()`、`delete()`。