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


