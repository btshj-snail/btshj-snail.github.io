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

- 浅拷贝

`Object.assign`方法实行的是浅拷贝，而不是深拷贝。也就是说，如果源对象某个属性的值是对象，那么目标对象拷贝得到的是这个对象的引用。

- 同名属性的替换

对于这种嵌套的对象，一旦遇到同名属性，`Object.assign`的处理方法是替换，而不是添加。

- 数组的处理

`Object.assign`可以用来处理数组，但是会把数组视为对象。

```javaScript

Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]

```
- 取值函数的处理

`Object.assign`只能进行值的复制，如果要复制的值是一个取值函数，那么将求值后再复制。

```javaScript

const source = {
  get foo() { return 1 }
};
const target = {};

Object.assign(target, source)
// { foo: 1 }

```
常见用途

- 为对象添加属性
```javaScript
  class Point {
    constructor(x, y) {
        Object.assign(this, {x, y});
    }
  }
```

- 为对象添加方法

```javaScript

Object.assign(SomeClass.prototype, {
  someMethod(arg1, arg2) {
    ···
  },
  anotherMethod() {
    ···
  }
});

// 等同于下面的写法
SomeClass.prototype.someMethod = function (arg1, arg2) {
  ···
};
SomeClass.prototype.anotherMethod = function () {
  ···
};


```

- 克隆对象

```javaScript
function clone(origin) {
  return Object.assign({}, origin);
}
```

不过，采用这种方法克隆，只能克隆原始对象自身的值，不能克隆它继承的值。如果想要保持继承链，可以采用下面的代码。

```javaScript

function clone(origin){
    let origin_proto = Object.getPrototypeOf(origin);
    return Object.assign(Object.create(origin_proto),origin);
}

```

- 合并多个对象

- 为属性指定默认值


## 3. Object.getOwnPropertyDescriptors() 

ES5 的`Object.getOwnPropertyDescriptor()`方法会返回某个对象属性的描述对象（descriptor）。ES2017 引入了`Object.getOwnPropertyDescriptors()`方法，返回指定对象所有自身属性（非继承属性）的描述对象。该方法的引入目的，主要是为了解决`Object.assign()`无法正确拷贝`get`属性和`set`属性的问题。

```javaScript

const source = {
  set foo(value) {
    console.log(value);
  }
};

const target1 = {};
Object.assign(target1, source);

Object.getOwnPropertyDescriptor(target1, 'foo')
// { value: undefined,
//   writable: true,
//   enumerable: true,
//   configurable: true }

```
上面代码中，`source`对象的`foo`属性的值是一个赋值函数，`Object.assign`方法将这个属性拷贝给`target1`对象，结果该属性的值变成了`undefined`。这是因为`Object.assign`方法总是拷贝一个属性的值，而不会拷贝它背后的赋值方法或取值方法。

这时，`Object.getOwnPropertyDescriptors`()方法配合`Object.defineProperties()`方法，就可以实现正确拷贝。

```javaScript

const source = {
  set foo(value) {
    console.log(value);
  }
};

const target2 = {};
Object.defineProperties(target2, Object.getOwnPropertyDescriptors(source));
Object.getOwnPropertyDescriptor(target2, 'foo')
// { get: undefined,
//   set: [Function: set foo],
//   enumerable: true,
//   configurable: true }


```

## 4. __proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf() 
JavaScript 语言的对象继承是通过原型链实现的。ES6 提供了更多原型对象的操作方法。

- __proto__属性
`__proto__`属性（前后各两个下划线），用来读取或设置当前对象的`prototype`对象。目前，所有浏览器（包括 IE11）都部署了这个属性。

```javaScript

// es5 的写法
const obj = {
  method: function() { ... }
};
obj.__proto__ = someOtherObj;

// es6 的写法
var obj = Object.create(someOtherObj);
obj.method = function() { ... };

```

该属性没有写入 ES6 的正文，而是写入了附录，原因是`__proto__`前后的双下划线，说明它本质上是一个内部属性，而不是一个正式的对外的 API，只是由于浏览器广泛支持，才被加入了 ES6。标准明确规定，只有浏览器必须部署这个属性，其他运行环境不一定需要部署，而且新的代码最好认为这个属性是不存在的。因此，无论从语义的角度，还是从兼容性的角度，都不要使用这个属性，而是使用下面的`Object.setPrototypeOf()`（写操作）、`Object.getPrototypeOf()`（读操作）、`Object.create()`（生成操作）代替。

实现上，`__proto__`调用的是`Object.prototype.__proto__`，具体实现如下。

```javaScript

Object.defineProperty(Object.prototype, '__proto__', {
  get() {
    let _thisObj = Object(this);
    return Object.getPrototypeOf(_thisObj);
  },
  set(proto) {
    if (this === undefined || this === null) {
      throw new TypeError();
    }
    if (!isObject(this)) {
      return undefined;
    }
    if (!isObject(proto)) {
      return undefined;
    }
    let status = Reflect.setPrototypeOf(this, proto);
    if (!status) {
      throw new TypeError();
    }
  },
});

function isObject(value) {
  return Object(value) === value;
}


```

- Object.setPrototypeOf() 

`Object.setPrototypeOf`方法的作用与`__proto__`相同，用来设置一个对象的`prototype`对象，返回参数对象本身。它是 ES6 正式推荐的设置原型对象的方法.

```javaScript

// 格式
Object.setPrototypeOf(object, prototype)

```

该方法等同于下面的函数。


```javaScript

function setPrototyeOf(object,prototype){
    object.__proto__ = prototype;
    return obj;
}

```

- Object.getPrototypeOf() 

该方法与`Object.setPrototypeOf`方法配套，用于读取一个对象的原型对象。

## 5. Object.keys()，Object.values()，Object.entries() 

- Object.keys()

ES5 引入了Object.keys方法，返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。ES2017 引入了跟`Object.keys`配套的`Object.values`和`Object.entries`，作为遍历一个对象的补充手段，供`for...of`循环使用。

```javaScript

let {keys, values, entries} = Object;
let obj = { a: 1, b: 2, c: 3 };

for (let key of keys(obj)) {
  console.log(key); // 'a', 'b', 'c'
}

for (let value of values(obj)) {
  console.log(value); // 1, 2, 3
}

for (let [key, value] of entries(obj)) {
  console.log([key, value]); // ['a', 1], ['b', 2], ['c', 3]
}

```


## 6. Object.fromEntries() 

`Object.fromEntries()`方法是`Object.entries()`的逆操作，用于将一个键值对数组转为对象。该方法的主要目的，是将键值对的数据结构还原为对象，因此特别适合将 `Map` 结构转为对象。

```javaScript
// 例一
const entries = new Map([
  ['foo', 'bar'],
  ['baz', 42]
]);

Object.fromEntries(entries)
// { foo: "bar", baz: 42 }

// 例二
const map = new Map().set('foo', true).set('bar', false);
Object.fromEntries(map)
// { foo: true, bar: false }
```