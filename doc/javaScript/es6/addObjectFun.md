# 对象新增的方法

## 1. Object.is()

ES5 比较两个值是否相等，只有两个运算符：相等运算符（`==`）和严格相等运算符（`===`）。它们都有缺点，**前者会自动转换数据类型**，后者的`NaN`不等于自身，以及`+0`等于`-0`。JavaScript 缺乏一种运算，在所有环境中，只要两个值是一样的，它们就应该相等。

ES6 提出“Same-value equality”（**同值相等**）算法，用来解决这个问题。Object.is就是部署这个算法的新方法。它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。

```javaScript

Object.is('foo', 'foo')
// true
Object.is({}, {})
// false

Object.is(+0,-0); //false

Object.is(NaN,NaN);//true

```
ES5 可以通过下面的代码，部署Object.is。

```javaScript

Object.defineProperty(Object,'is',{
    value:function(x,y){
        if(x===y){
            return x!==0 || 1/x === 1/y
        }
        return x!==x && y!==y;
    },
    configurable:true,
    enumerable:false,
    writable:true,
})


```

## 2. Object.assign()

`Object.assign`方法用于对象的合并，将源对象（source）的所有**可枚举属性**，复制到目标对象（target）。`Object.assign`方法的第一个参数是目标对象，后面的参数都是源对象。注意，如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。
如果只有一个参数，Object.assign会直接返回该参数。如果该参数不是对象，则会先转成对象，然后返回.由于`undefined`和`null`无法转成对象，所以如果它们作为参数，就会报错。
```javaScript

const obj = {a: 1};
Object.assign(obj) === obj // true

```
如果非对象参数出现在源对象的位置（即非首参数），那么处理规则有所不同。首先，这些参数都会转成对象，如果无法转成对象，就会跳过。这意味着，如果`undefined`和`null`不在首参数，就不会报错。

其他类型的值（即数值、字符串和布尔值）不在首参数，也不会报错。但是，除了字符串会以数组形式，拷贝入目标对象，其他值都不会产生效果。其他类型的值（即数值、字符串和布尔值）不在首参数，也不会报错。但是，除了字符串会以数组形式，拷贝入目标对象，其他值都不会产生效果。

`Object.assign`拷贝的属性是有限制的，只拷贝源对象的**自身属性**（不拷贝继承属性），也**不拷贝不可枚举的属性**（enumerable: false）。

注意点: