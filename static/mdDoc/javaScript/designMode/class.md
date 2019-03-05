# js中的类

## 创建类

在ES6之前，可以通过函数创建类。一般类名首字母大写。

```javaScript

 function Book(title,price){
     this.title = title;
     this.price = price;
 }

 Book.prototype.getTitle = function(){
     return this.title;
 }

 Book.prototype.getPrice = function(){
     return this.price;
 }

```
在js中没有想java那样可以指定静态属性，静态方法，私有属性,私有方法等的关键字。但是这些可以通过函数闭包的形式来实现这些需求。

```javaScript

(function (){
    let enableRead = true; //私有属性
    function _formatTitle(title){
        return `《${title}》`;
    } //私有方法
    Book.READ_COUNT = 0; //静态属性
     //静态方法
    Book.addReadCount = function(){ 
        return Book.READ_COUNT++;
    }
    return function Book(title,price){
            this.title = _formatTitle(title);
            this.price = price;
        }
})()

```
