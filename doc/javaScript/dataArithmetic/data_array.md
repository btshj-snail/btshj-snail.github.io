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

*** 注意forEach中不能使用continue，break等关键字。若要跳出本次循环，可以使用return。若要结束所有循环，只有使用for循环语句 ***

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
|:--|:--|
|@@iterator|返回一个包含数组键值对的迭代器对象，可以通过同步调用得到数组元素的键值对|
|copyWithin|复制数组中一系列元素到同一数组指定的起始位置|
|entries|返回包含数组所有键值对的@@iterator|
|includes|如果数组中存在某个元素，就返回true，否则返回false，ES7新增|
|find|根据回调函数给定的条件从数组中查找元素，如果找到则返回该元素|
|findIndex|根据回调函数给定的条件从数组中查找元素，如果找到则返回该元素的索引|
|fill|用静态值填充数组|
|from|根据已有数组创建新数组|
|keys|返回包含数组所有索引的@@iterator|
|of|根据传入的参数创建新的数组|
|values|返回包含数组所有值得@@iterator|

### 使用ES6新的迭代器（@@iterator）

ES6为Array类增加了一个@@iterator属性，需要通过Symbol.iterator来访问。代码如下：

```javaScript

let ary = [1,2,3];

let iterator = ary[Symbol.iterator]();
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);
console.log(iterator.next().value);
// 输出应该是1,2,3,undefined
```

不断调用迭代器的next方法就能依次得到数组中的值。数组中的值都迭代完了之后，iterator.next().value就会返回undefined


### entries,keys,values

ES6添加了三种从数组中获取iterator的方法。

1. entries

entries返回包含键值对的@@iterator

```javaScript

let ary = [1,2]

let iterator = ary.entries();

console.log(iterator.next().value)
console.log(iterator.next().value)

//输出应该是[0,1] [1,2] .[]里面分别是元素索引，对应值
```

2. keys
keys返回包含索引的@@iterator


```javaScript

let ary = [1,2]

let iterator = ary.keys();

console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

//输出应该是{value:0,done:false} {value:1,done:false} {value:undefined,done:true}

```

keys方法会返回numbers数组的索引。一旦没有可迭代的值，iterator.next()就会返回一个value属性为undefined，done属性为true的对象。如果done属性的值为false，就意味着还有可迭代的值。

3. values

values返回包含值得@@iterator

```javaScript

let ary = [1,2]

let iterator = ary.keys();

console.log(iterator.next().value)
console.log(iterator.next().value)

//输出应该是1,2

```
*** 注意在当前不是所有浏览器都支持ES6的情况，使用ES6提供的方法，最好是使用babel ***


### from

Array.from通过已有的数组，创建一个新的数组。比如要复制一个数组，则可以使用Array.from

```javaScript

let ary = [1,2,3,{a:1,b:2}];

let newAry = Array.from(ary);

let o = ary[3];

o.b = 4;

ary.push(4);

console.log(ary)   // 输出： [1,2,3,{a:1,b:4},4]
console.log(newAry) //输出：[1,2,3,{a:1,b:4}]

```

通过以上代码可以知道，Array.from 并不是是指针的引用，而是元素的拷贝，只不过是浅拷贝。上面的列子中可以看出，元素为引用值时，Array.from只是将引用值的地址进行了拷贝。

Array.from 还具有第二个参数。可以传入一个的根据条件改变值得函数。

```javaScript

let ary = [1,2,3,4,5];

let newAry = Array.from(ary,item=>item>3);

console.log(newAry); //输出[false,false,false,true,true]

```
### of

Array.of方法根据传入的参数创建一个新的数组

```javaScript

let ary = Array.of(1);
let ary1 = Array.of(1,2,3)

//等效

let ary = [1];
let ary1 = [1,2,3]

//通过解构也可以复制数组

let ary = [1,2,3,4]
let ary1 = Array.of(...ary)

```

### fill方法

fill用静态值填充数组。

fill一共有三个参数

第一个 填充的值

第二个 开始填充的索引

第三个 结束填充的索引(不包含这个索引)

```javaScript

let ary = new Array(6);

ary.fill(0);

console.log(ary) //[0,0,0,0,0,0]

ary.fill(1,1) 

console.log(ary) //[0,1,1,1,1,1]

ary.fill(2,2,3);

console.log(ary) //[0,1,2,1,1,1]

```

### copyWithin

copyWithin方法是复制数组中的指定的元素到该数组的指定位置。

copyWithin 一共有三个参数

第一个 将要复制到的位置

第二个 将要复制的元素开始索引

第三个 将要复制的元素结束索引（不包括该索引）

```javaScript

let ary = [1,2,3,4,5,6];

ary.copyWithin(0,3);

console.log(ary); //[4,5,6,4,5,6];

ary.copyWithin(0,4,6); //[5,6,6,4,5,6];

```

