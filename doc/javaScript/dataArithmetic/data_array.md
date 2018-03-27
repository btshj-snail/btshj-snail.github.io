# 数组

几乎所有的编程语言都原生支持数组类型，因为数组是最简单的内存数据结构。

大多数语言，数组都是用于存储一些列同一种数据类型的值。但是在js中，数组可以存储不同类型的值。

## 创建数组

```javaScript

let a = new Array();
let b = new Array(7);
let c = new Array(1,2,3,4,5,6,7);
console.log(a)
console.log(b)
console.log(c)

```

使用new关键字，就能简单地声明初始化一个数组实例。但是这个并不是最佳的实践方案，如果你想创建一个数组，可以尝试像下面代码一样：

```javaScript

let a = [];
let b = [1,2,3,4,5,6]

```

## 迭代器

### 使用every方法迭代

every方法是对数组中每一元素运行指定的函数，如果该函数的每一项都返回true，则返回true

***注意：该方法是短路运行的。也就意味着，只要在某个元素判定到为false后，就不会再继续向后执行了.***

```javaScript

let ary = [1,2,3,4,5,6,7]
ary.every(function(item,index,ary){
    console.log(item)
    return item>3;
})
//输出应该是：1

```


### 使用some方法迭代

some方法是对数组中每一个元素运行指定的元素，如果该函数中的某项返回true，则返回true。

***注意：该方法是短路运行的。也就意味着，只要在某个元素判定到为false后，就不会再继续向后执行了.***

```javaScript

let ary = [1,23,4,5,6,7];

ary.some(function(item,index,ary){
    console.log(item);
    return item>3
})
//输出应该是 1 23
```

### 使用forEach方法迭代

 如果要迭代整个数组，可以使用forEach方法。他和for循环基本一致

```javaScript

let ary = [1,2,3];

ary.forEach(function(item,index,ary){
    console.log(item);
})

```

### 使用map和filter方法迭代

这两个方法都会返回一个新的数组。

map 方法 是将指定函数的返回值作为新数组的元素。

```javaScript

let ary = [1,2,3,4];

console.log(ary.map(function(item,index,ary){
    return item>2;
}))
// 输出结果应该为：false,false,true,true
```

filter 方法 是将指定函数返回true的元素放入到新的数组中。


```javaScript

let ary = [1,2,3,4];

console.log(ary.filter(function(item,index,ary){
    return item>2;
}))
// 输出结果应该为：3,4
```

### reduce 迭代

reduce方法接收一个函数作为参数，这个函数有四个参数：previousValue、currentValue、index和array。这个函数会返回一个将被叠加到累加器的值，reduce方法停止执行后会返回这个累加器。reduce的第二个参数是previousValue的初始值。

```javaScript

let ary = [1,2,3,4,5,6,7,8,9];
let result = ary.reduce(function(prevValue,item,index,ary){
    return prevValue+item;
},0)
console.log(result);
// 输出结果应该是45
```
## ES6、ES7新特性新方法

|方法|描述|
|--:|--:|
|@@iterator|返回一个包含数组键值对的迭代器对象，可以通过同步调用得到数组元素的键值对|
