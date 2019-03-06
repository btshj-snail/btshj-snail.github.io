# 构造函数继承

```javaScript

function SuperClass(id){
    this.books = ["javaScript","html","css"];
    this.id = id;
}

SuperClass.prototype.showBooks = function(){
    return this.books;
}

function SubClass(id){
    SuperClass.call(this,id);
}

var instance1 = new SubClass(10);
var instance2 = new SubClass(11);

instance1.books.push("设计模式");

console.log(instance1.books) //["javaScript","html","css","设计模式"]
console.log(instance1.id) //10
console.log(instance2.books) //["javaScript","html","css"]
console.log(instance2.id) //11

instance1.showBooks(); //instance1.showBooks is not a function

```

其实构造函数继承的精华在于 SuperClass.call(this,id)。

该方法有两个注意点：

1. 是直接调用构造函数，而不是用new。这里是将构造函数当作普通的函数进行的使用。
2. call方法的使用。由于call这个方法可以更改函数的作用环境，因此在子类中，对superClass调用这个方法就是将子类的变量在父类中执行一遍。由于这种类型的继承没有涉及原型prototype，所以父类的原型方法自然不会被子类京城，而如果想被子类继承就必须要放在构造函数中，这样创建出来的每个实例都会单独拥有一份，而不会共用，这样违背了代码复用的原则。

那么为了综合类继承和构造函数继承，就有了下一节的[组合式继承](./extends_assemble.md)


