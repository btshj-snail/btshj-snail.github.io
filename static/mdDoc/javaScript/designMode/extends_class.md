# 继承——类继承

类继承是js继承方式中最为简单的一种继承方式。

通过将子类的prototype指向父类的实例化对象。这样子类就拥有了父类的共有属性和共有方法。

子类prototype--->父类实例_proto_以及构造方法中的属性和方法--->父类prototype

具体代码如下：

``` javaScript

function ParentClas(){
    this.nameList = ["jack","lucy"]; //{4}
    this.type = "js"
}

ParentClas.prototype.getNameList = function(){
    return this.nameList;
}

ParentClas.prototype.pushNameList = function(name){
    this.nameList.push(name);
}

ParentClas.prototype.setType = function(type){
    this.type = type;
}

function SubClas(){
    this.linkSymbol = "--->"
}

SubClas.prototype = new ParentClas(); //{1}

SubClas.prototype.toStringNameList = function(){ //{2}
    return this.nameList.join(this.linkSymbol);
}


let subClas = new SubClas();

//{3}
console.log(subClas instanceof SubClas); //true
console.log(subClas instanceof ParentClas); //true
console.log(SubClas instanceof ParentClas); //false
console.log(SubClas.prototype instanceof ParentClas);//true

console.log(subClas.getNameList()); // ["jack", "lucy"]
console.log(subClas.toStringNameList()); //jack--->lucy

subClas.pushNameList("Tom");//{5}
subClas.setType("java");

let subClas1 = new SubClas();

//{6}
console.log(subClas.toStringNameList()); //jack--->lucy--->Tom
console.log(subClas1.type)
```

1. 本段代码的关键之处在于{1}行。该处将父类实例化的对象传递给了子类的prototype。这样就实现了继承，并且这种方式我们称之为类继承

    同时这里要注意{1}和{2}的先后顺序不能换。因为这里是对子类prototype赋值的方式，若是将{1}放在{2}后面，那么相当于覆盖了{2}。

2. 本段代码{3}处，有4个使用instanceof检测的代码行。前两个很简单，因为继承关系，实例即属于子类也属于父类。第三个“SubClas instanceof ParentClas”为false，则是因为instanceof检测，其实是对prototype的检测。SubClas和ParentClas是没有任何关系的。而SubClas.prototype 确实指向的ParentClas的实例。


3. 注意第{4}，{5}，{6}的代码。第{4}行，在父类的构造函数中定义了共有属性nameList,并且**该属性是引用类型**。第{5}行，通过实例化对象调用pushNameList方法，向共有属性nameList增加了一个元素。 第{6}行，使用另一个实例化对象打印共有属性nameList中的元素。此时发现，“Tom”也被打印出来了。出现该现象的原因是，引用类型保存的都是地址指针。 这是类继承的一个缺陷。

4. 类继承的另外一个缺陷就是，父类的构造函数不能使用参数。