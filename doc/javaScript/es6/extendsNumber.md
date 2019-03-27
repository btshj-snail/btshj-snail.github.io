# 数字的扩展

## 1. 二进制和八进制表示法 

ES6 提供了二进制和八进制数值的新的写法，分别用前缀0b（或0B）和0o（或0O）表示。

```javaScript

0b111110111 === 503 // true
0o767 === 503 // true

```

从 ES5 开始，在严格模式之中，八进制就不再允许使用前缀0表示，ES6 进一步明确，要使用前缀0o表示。
```javaScript

// 非严格模式
(function(){
  console.log(0o11 === 011);
})() // true

// 严格模式
(function(){
  'use strict';
  console.log(0o11 === 011);
})() // Uncaught SyntaxError: Octal literals are not allowed in strict mode.

```
如果要将0b和0o前缀的字符串数值转为十进制，要使用`Number`方法。

    Number('0b111')  // 7
    Number('0o10')  // 8

## 2. Number.isFinite(), Number.isNaN()

ES6 在`Number`对象上，新提供了`Number.isFinite()`和`Number.isNaN()`两个方法。

`Number.isFinite()`用来检查一个数值是否为有限的（finite），即不是`Infinity`。

注意，如果参数类型不是数值，`Number.isFinite`一律返回false。如果参数类型不是NaN，`Number.isNaN`一律返回false。

它们与传统的全局方法`isFinite()`和`isNaN()`的区别在于，传统方法先调用`Number()`将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，`Number.isFinite()`对于非数值一律返回false,` Number.isNaN()`只有对于NaN才返回true，非NaN一律返回false。

## 3. Number.parseInt(), Number.parseFloat()

ES6 将全局方法`parseInt()`和`parseFloat()`，移植到`Number`对象上面，行为完全保持不变。

```javaScript

// ES5的写法
parseInt('12.34') // 12
parseFloat('123.45#') // 123.45

// ES6的写法
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45

```
这样做的目的，是逐步减少全局性方法，使得语言逐步模块化。

```javaScript

Number.parseInt === parseInt // true
Number.parseFloat === parseFloat // true

```

## 4. Number.isInteger()

`Number.isInteger()`用来判断一个数值是否为整数。

```javaScript
Number.isInteger(25) // true
Number.isInteger(25.1) // false
```
JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

```javaScript
Number.isInteger(25) // true
Number.isInteger(25.0) // true
```

如果参数不是数值，`Number.isInteger`返回`false`。

```javaScript
Number.isInteger() // false
Number.isInteger(null) // false
Number.isInteger('15') // false
Number.isInteger(true) // false
```
注意，由于 JavaScript 采用 IEEE 754 标准，数值存储为64位双精度格式，数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）。如果数值的精度超过这个限度，第54位及后面的位就会被丢弃，这种情况下，Number.isInteger可能会误判。
```javaScript

Number.isInteger(3.0000000000000002) // true

```
上面代码中，`Number.isInteger`的参数明明不是整数，但是会返回true。原因就是这个小数的精度达到了小数点后16个十进制位，转成二进制位超过了53个二进制位，导致最后的那个2被丢弃了。

类似的情况还有，如果一个数值的绝对值小于`Number.MIN_VALUE（5E-324）`，即小于 JavaScript 能够分辨的最小值，会被自动转为 0。这时，`Number.isInteger`也会误判。
```javaScript
Number.isInteger(5E-324) // false
Number.isInteger(5E-325) // true
```
上面代码中，5E-325由于值太小，会被自动转为0，因此返回true。

**总之，如果对数据精度的要求较高，不建议使用`Number.isInteger()`判断一个数值是否为整数。**

## Number.EPSILON 

ES6 在`Number`对象上面，新增一个极小的常量`Number.EPSILON`。根据规格，它表示 1 与大于 1 的最小浮点数之间的差。

对于 64 位浮点数来说，大于 1 的最小浮点数相当于二进制的1.00..001，小数点后面有连续 51 个零。这个值减去 1 之后，就等于 2 的 -52 次方。

```javaScript
Number.EPSILON === Math.pow(2, -52)
// true
Number.EPSILON
// 2.220446049250313e-16
Number.EPSILON.toFixed(20)
// "0.00000000000000022204"
```

`Number.EPSILON`实际上是 JavaScript 能够表示的最小精度。误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了。

引入一个这么小的量的目的，在于为浮点数计算，设置一个误差范围。我们知道浮点数计算是不精确的。

```javaScript
0.1 + 0.2
// 0.30000000000000004

0.1 + 0.2 - 0.3
// 5.551115123125783e-17

5.551115123125783e-17.toFixed(20)
// '0.00000000000000005551'
```

上面代码解释了，为什么比较`0.1 + 0.2`与0.3得到的结果是`false`。

    0.1 + 0.2 === 0.3 // false

`Number.EPSILON`可以用来设置“能够接受的误差范围”。比如，误差范围设为 2 的-50 次方（即`Number.EPSILON * Math.pow(2, 2)`），即如果两个浮点数的差小于这个值，我们就认为这两个浮点数相等。

```javaScript
5.551115123125783e-17 < Number.EPSILON * Math.pow(2, 2)
// true
```

因此，`Number.EPSILON`的实质是一个可以接受的最小误差范围。

```javaScript
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true

1.1 + 1.3 === 2.4 // false
withinErrorMargin(1.1 + 1.3, 2.4) // true
```
上面的代码为浮点数运算，部署了一个误差检查函数。

## 6. 安全整数和 Number.isSafeInteger() 

JavaScript 能够准确表示的整数范围在`-2^53`到`2^53`之间（不含两个端点），超过这个范围，无法精确表示这个值。

```javaScript

Math.pow(2, 53) // 9007199254740992

9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992

Math.pow(2, 53) === Math.pow(2, 53) + 1 // true

```

上面代码中，超出 2 的 53 次方之后，一个数就不精确了。

ES6 引入了`Number.MAX_SAFE_INTEGER`和`Number.MIN_SAFE_INTEGER`这两个常量，用来表示这个范围的上下限。

```javaScript

Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
// true
Number.MAX_SAFE_INTEGER === 9007199254740991
// true

Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER
// true
Number.MIN_SAFE_INTEGER === -9007199254740991
// true

```

## 7. Math 对象的扩展 

ES6 在 `Math`对象上新增了 17 个与数学相关的方法。所有这些方法都是静态方法，只能在 `Math` 对象上调用。

- Math.trunc()
`Math.trunc`方法用于去除一个数的小数部分，返回整数部分。

```javaScript
    Math.trunc(4.1) // 4
    Math.trunc(4.9) // 4
    Math.trunc(-4.1) // -4
    Math.trunc(-4.9) // -4
    Math.trunc(-0.1234) // -0
```
对于非数值，`Math.trunc`内部使用`Number`方法将其先转为数值。

```javaScript
    Math.trunc('123.456') // 123
    Math.trunc(true) //1
    Math.trunc(false) // 0
    Math.trunc(null) // 0
```

对于空值和无法截取整数的值，返回NaN。

```javaScript
    Math.trunc(NaN);      // NaN
    Math.trunc('foo');    // NaN
    Math.trunc();         // NaN
    Math.trunc(undefined) // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```javaScript

Math.trunc = Math.trunc || function(x) {
  return x < 0 ? Math.ceil(x) : Math.floor(x);
};
```

- Math.sign()
`Math.sign`方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。

它会返回五种值。

>参数为正数，返回+1；<br>
参数为负数，返回-1；<br>
参数为 0，返回0；<br>
参数为-0，返回-0;<br>
其他值，返回NaN。<br>

```javaScript
Math.sign(-5) // -1
Math.sign(5) // +1
Math.sign(0) // +0
Math.sign(-0) // -0
Math.sign(NaN) // NaN
```
如果参数是非数值，会自动转为数值。对于那些无法转为数值的值，会返回NaN。

```javaScript
Math.sign('')  // 0
Math.sign(true)  // +1
Math.sign(false)  // 0
Math.sign(null)  // 0
Math.sign('9')  // +1
Math.sign('foo')  // NaN
Math.sign()  // NaN
Math.sign(undefined)  // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。

```javaScript
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
};
```
- Math.cbrt()

Math.cbrt方法用于计算一个数的立方根。

```javaScript

Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt(1)  // 1
Math.cbrt(2)  // 1.2599210498948734

```
对于非数值，`Math.cbrt`方法内部也是先使用`Number`方法将其转为数值。

```javaScript
Math.cbrt('8') // 2
Math.cbrt('hello') // NaN
```

对于没有部署这个方法的环境，可以用下面的代码模拟。
```javaScript
Math.cbrt = Math.cbrt || function(x) {
  var y = Math.pow(Math.abs(x), 1/3);
  return x < 0 ? -y : y;
};
```

- Math.clz32()

Math.clz32()方法将参数转为 32 位无符号整数的形式，然后这个 32 位值里面有多少个前导 0。

```javaScript

Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1000) // 22
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(0b00100000000000000000000000000000) // 2

```
上面代码中，0 的二进制形式全为 0，所以有 32 个前导 0；1 的二进制形式是0b1，只占 1 位，所以 32 位之中有 31 个前导 0；1000 的二进制形式是0b1111101000，一共有 10 位，所以 32 位之中有 22 个前导 0。

`clz32`这个函数名就来自”count leading zero bits in 32-bit binary representation of a number“（计算一个数的 32 位二进制形式的前导 0 的个数）的缩写。

左移运算符（<<）与Math.clz32方法直接相关。

```javaScript
Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1 << 1) // 30
Math.clz32(1 << 2) // 29
Math.clz32(1 << 29) // 2
```

对于小数，Math.clz32方法只考虑整数部分。

```javaScript
Math.clz32(3.2) // 30
Math.clz32(3.9) // 30
```
对于空值或其他类型的值，`Math.clz32`方法会将它们先转为数值，然后再计算。
```javaScript
Math.clz32() // 32
Math.clz32(NaN) // 32
Math.clz32(Infinity) // 32
Math.clz32(null) // 32
Math.clz32('foo') // 32
Math.clz32([]) // 32
Math.clz32({}) // 32
Math.clz32(true) // 31
```

- Math.imul()
Math.imul方法返回两个数以 32 位带符号整数形式相乘的结果，返回的也是一个 32 位的带符号整数。

```javaScript

Math.imul(2, 4)   // 8
Math.imul(-1, 8)  // -8
Math.imul(-2, -2) // 4
```
如果只考虑最后 32 位，大多数情况下，`Math.imul(a, b)`与`a * b`的结果是相同的，即该方法等同于(a * b)|0的效果（超过 32 位的部分溢出）。之所以需要部署这个方法，是因为 JavaScript 有精度限制，超过 2 的 53 次方的值无法精确表示。这就是说，对于那些很大的数的乘法，低位数值往往都是不精确的，`Math.imul`方法可以返回正确的低位数值。

`(0x7fffffff * 0x7fffffff)|0 // 0`
上面这个乘法算式，返回结果为 0。但是由于这两个二进制数的最低位都是 1，所以这个结果肯定是不正确的，因为根据二进制乘法，计算结果的二进制最低位应该也是 1。这个错误就是因为它们的乘积超过了 2 的 53 次方，JavaScript 无法保存额外的精度，就把低位的值都变成了 0。Math.imul方法可以返回正确的值 1。

```javaScript
Math.imul(0x7fffffff, 0x7fffffff) // 1
```


- Math.fround()
Math.fround方法返回一个数的32位单精度浮点数形式。

对于32位单精度格式来说，数值精度是24个二进制位（1 位隐藏位与 23 位有效位），所以对于 -224 至 224 之间的整数（不含两个端点），返回结果与参数本身一致。
```javaScript

Math.fround(0)   // 0
Math.fround(1)   // 1
Math.fround(2 ** 24 - 1)   // 16777215

```
如果参数的绝对值大于 224，返回的结果便开始丢失精度。

```javaScript

Math.fround(2 ** 24)       // 16777216
Math.fround(2 ** 24 + 1)   // 16777216
```
`Math.fround` 方法的主要作用，是将64位双精度浮点数转为32位单精度浮点数。如果小数的精度超过24个二进制位，返回值就会不同于原值，否则返回值不变（即与64位双精度值一致）。

```javaScript

// 未丢失有效精度
Math.fround(1.125) // 1.125
Math.fround(7.25)  // 7.25

// 丢失精度
Math.fround(0.3)   // 0.30000001192092896
Math.fround(0.7)   // 0.699999988079071
Math.fround(1.0000000123) // 1
```

对于 `NaN` 和 `Infinity`，此方法返回原值。对于其它类型的非数值，`Math.fround` 方法会先将其转为数值，再返回单精度浮点数。

```javaScript
Math.fround(NaN)      // NaN
Math.fround(Infinity) // Infinity

Math.fround('5')      // 5
Math.fround(true)     // 1
Math.fround(null)     // 0
Math.fround([])       // 0
Math.fround({})       // NaN
```
对于没有部署这个方法的环境，可以用下面的代码模拟。

```javaScript

Math.fround = Math.fround || function (x) {
  return new Float32Array([x])[0];
};
Math.hypot()
Math.hypot方法返回所有参数的平方和的平方根。

Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
Math.hypot();            // 0
Math.hypot(NaN);         // NaN
Math.hypot(3, 4, 'foo'); // NaN
Math.hypot(3, 4, '5');   // 7.0710678118654755
Math.hypot(-3);          // 3
```

上面代码中，3 的平方加上 4 的平方，等于 5 的平方。

如果参数不是数值，`Math.hypot`方法会将其转为数值。只要有一个参数无法转为数值，就会返回 `NaN`。