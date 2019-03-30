# class基本语法

class 其实只是一种语法糖而已。。


## constructor 方法
`constructor`方法是类的默认方法，通过`new`命令生成对象实例时，自动调用该方法。一个类必须有`constructor`方法，如果没有显式定义，一个空的`constructor`方法会被默认添加。

`constructor`方法默认返回实例对象（即`this`），完全可以指定返回另外一个对象。

```javaScript

class Foo {
    constructor(){
        return Object.create(null)
    }
}
new Foo() instanceof Foo //false
```
上面代码中，`constructor`函数返回一个全新的对象，结果导致实例对象不是`Foo`类的实例。

类必须使用`new`调用，否则会报错。这是它跟普通构造函数的一个主要区别，后者不用`new`也可以执行。



