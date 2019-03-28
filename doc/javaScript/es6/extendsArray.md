# 数组的扩展

## 1. 扩展运算符

扩展运算符（spread）是三个点（`...`）。它好比 `rest` 参数的逆运算，将一个数组转为用逗号分隔的参数序列。

该运算符主要用于函数调用。

```javaScript

function push(array, ...items) {
  array.push(...items);
}

function add(x, y) {
  return x + y;
}

const numbers = [4, 38];
add(...numbers) // 42

```

上面代码中，`array.push(...items)`和`add(...numbers)`这两行，都是函数的调用，它们的都使用了扩展运算符。该运算符将一个数组，变为参数序列。
扩展运算符后面还可以放置表达式。
```javaScript

const arr = [
  ...(x > 0 ? ['a'] : []),
  'b',
];

```

注意，扩展运算符如果放在括号中，JavaScript 引擎就会认为这是函数调用。如果这时不是函数调用，就会报错。

```javaScript

(...[1, 2])
// Uncaught SyntaxError: Unexpected number

console.log((...[1, 2]))
// Uncaught SyntaxError: Unexpected number

console.log(...[1, 2])
// 1 2

```

上面前两种情况都会报错，因为扩展运算符所在的括号不是函数调用，而第三种情况`console.log(...[1, 2])`就不会报错，因为这时是函数调用。

### 扩展运算符的应用

- 复制数组
- 合并数组
- 与解构赋值结合
扩展运算符可以与解构赋值结合起来，用于生成数组。

```javaScript

// ES5
a = list[0], rest = list.slice(1)
// ES6
[a, ...rest] = list

```

- 字符串转换成数组
- 实现了 Iterator 接口的对象
任何定义了遍历器（`Iterator`）接口的对象（参阅 [Iterator](./interator.md) 一章），都可以用扩展运算符转为真正的数组。

```javaScript

let nodeList = document.querySelectorAll('div');
let array = [...nodeList];

```

- Map 和 Set 结构，Generator 函数

扩展运算符内部调用的是数据结构的 `Iterator` 接口，因此只要具有 `Iterator` 接口的对象，都可以使用扩展运算符，比如 `Map` 结构。

```javaScript

let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]

```

## 2. Arry.from()

`Array.from`方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 `Set` 和 `Map`）。
如果参数是一个真正的数组，Array.from会返回一个一模一样的新数组。(数组是新的,但是里面的元素只是一个浅拷贝)

扩展运算符背后调用的是遍历器接口（`Symbol.iterator`），如果一个对象没有部署这个接口，就无法转换。`Array.from`方法还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有`length`属性。因此，任何有`length`属性的对象，都可以通过`Array.from`方法转为数组，而此时扩展运算符就无法转换。

```javaScript

Array.from({ length: 3 });
// [ undefined, undefined, undefined ]

```
对于还没有部署该方法的浏览器，可以用`Array.prototype.slice`方法替代。
```javaScript

const toArray = (() =>
  Array.from ? Array.from : obj => [].slice.call(obj)
)();

```

`Array.from`还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

如果map函数里面用到了`this`关键字，还可以传入`Array.from`的第三个参数，用来绑定`this`。

`Array.from()`可以将各种值转为真正的数组，并且还提供`map`功能。这实际上意味着，只要有一个原始的数据结构，你就可以先对它的值进行处理，然后转成规范的数组结构，进而就可以使用数量众多的数组方法。`Array.from()`的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 `Unicode` 字符，可以避免 JavaScript 将大于`\uFFFF`的 `Unicode` 字符，算作两个字符的 bug。

## 3. Array.of() 

`Array.of`方法用于将一组值，转换为数组。

```javaScript

Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1

```

这个方法的主要目的，是弥补数组构造函数`Array()`的不足。因为参数个数的不同，会导致`Array()`的行为有差异。

```javaScript

Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]

```

## 数组实例的 copyWithin()

数组实例的`copyWithin`方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

```javaScript

Array.prototype.copyWithin(target, start = 0, end = this.length)

```
它接受三个参数。

- target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
- start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示倒数。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。

这三个参数都应该是数值，如果不是，会自动转为数值。

## 5. 数组实例的 find() 和 findIndex()

数组实例的`find`方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为`true`的成员，然后返回该成员。如果没有符合条件的成员，则返回`undefined`。

这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。

```javaScript

function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26

```

另外，这两个方法都可以发现`NaN`，弥补了数组的`indexOf`方法的不足。
```javaScript
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0
```
上面代码中，`indexOf`方法无法识别数组的`NaN`成员，但是`findIndex`方法可以借助`Object.is`方法做到。

## 6. 数组实例的 fill()

`fill` 方法使用给定值，填充一个数组。

```javaScript

['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]

```

上面代码表明，fill方法用于空数组的初始化非常方便。数组中已有的元素，会被全部抹去。

fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。
```javaScript

['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']

```

上面代码表示，`fill`方法从 1 号位开始，向原数组填充 7，到 2 号位之前结束。

## 7. 数组实例的 entries()，keys() 和 values()

ES6 提供三个新的方法——`entries()`，`keys()`和`values()`——用于遍历数组。它们都返回一个遍历器对象（详见[《Iterator》](./iterator.md)一章），可以用`for...of`循环进行遍历，唯一的区别是`keys()`是对键名的遍历、`values()`是对键值的遍历，`entries()`是对键值对的遍历。

```javaScript

for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

```

## 8. 数组实例的 includes()

`Array.prototype.includes`方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。ES2016 引入了该方法。

该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始。没有该方法之前，我们通常使用数组的`indexOf`方法，检查是否包含某个值。

`indexOf`方法有两个缺点，

- 一是,不够语义化，它的含义是找到参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观。
- 二是，它内部使用严格相等运算符（===）进行判断，这会导致对NaN的误判。

## 9. 数组实例的 flat()，flatMap() 

数组的成员有时还是数组，`Array.prototype.flat()`用于将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。
```javaScript

[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]

```
上面代码中，原数组的成员里面有一个数组，`flat()`方法将子数组的成员取出来，添加在原来的位置。

`flat()`默认只会“拉平”一层，如果想要“拉平”多层的嵌套数组，可以将`flat()`方法的参数写成一个整数，表示想要拉平的层数，默认为1。如果不管有多少层嵌套，都要转成一维数组，可以用`Infinity`关键字作为参数。

如果原数组有空位，`flat()`方法会跳过空位。
```javaScript

[1, 2, , 4, 5].flat()
// [1, 2, 4, 5]

```
`flatMap()`方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`），然后对返回值组成的数组执行`flat()`方法。该方法返回一个新数组，不改变原数组。`flatMap()`只能展开**一层**数组。`flatMap()`方法的参数是一个遍历函数，该函数可以接受三个参数，分别是当前数组成员、当前数组成员的位置（从零开始）、原数组。`flatMap()`方法还可以有第二个参数，用来绑定遍历函数里面的`this`。

## 10. 数组的空位 

数组的空位指，数组的某一个位置没有任何值。比如，Array构造函数返回的数组都是空位。

  Array(3) // [, , ,]

注意，空位不是`undefined`，一个位置的值等于`undefined`，依然是有值的。空位是没有任何值，`in`运算符可以说明这一点。

ES5 对空位的处理，已经很不一致了，大多数情况下会忽略空位。

- forEach(), filter(), reduce(), every() 和some()都会跳过空位。
- map()会跳过空位，但会保留这个值
- join()和toString()会将空位视为undefined，而undefined和null会被处理成空字符串。

ES6 则是明确将空位转为`undefined`。

`Array.from`方法会将数组的空位，转为`undefined`，也就是说，这个方法不会忽略空位。

扩展运算符（...）也会将空位转为`undefined`。
 
`copyWithin()`会连空位一起拷贝。
 
`fill()`会将空位视为正常的数组位置。

`for...of`循环也会遍历空位。

`entries()`、`keys()`、`values()`、`find()`和`findIndex()`会将空位处理成undefined。
 
由于空位的处理规则非常不统一，所以建议避免出现空位。







