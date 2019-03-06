
# 1. jsx简介

```javascript
    const element = <h1>Hello world!</h1>
``` 
这种看起来可能有些奇怪的标签语法既不是字符串也不是HTML

它被称为JSX,一种javaScript的语法扩展.


## 1.1 jsx表达式

可以在任意的地方使用javaScript表达式,在JSX当中的表达式要包含在打括号里.

例如 2+2,user.firstName,以及formatName(user)都可以使用

```javascript

function formatName(){
    return user.firstName+" "+user.lastName;
}

const user = {
    firstName:'Harper',
    lastName:'Perez'
}

const element = (
    <h1>
        hello,{formatName()}!
    </h1>
);

ReactDOM.render(element,document.querySelector('#root'))

```

一般书写JSX的时候都会使用到缩进和换行,这样可以增强代码的可阅读性.与此同时,推荐在JSX代码外面加上(),防止分号自动插入的bug.

## 1.2 JSX属性

可以使用引号来定义以字符串为值的属性,也可以使用打括号定义以javaScript表达式为值的属性

```javascript

const element = (<div tabIndex={user.id}></div>);
const element1 = (<div tabIndex="admin"></div>);

```

## 1.3 JSX防注入攻击

React DOM 在渲染之前默认会过滤所有传入的值.它可以确保你的应用不会被注入攻击.所有的内容在渲染之前都会被转换为字符串,这样可以有效的防止XSS(跨站脚本)攻击.