# 元素渲染

元素是构成React应用的最小单位.

与浏览器的DOM元素不同,**React当中的元素事实上是普通的对象**,React DOM 可以确保浏览器DOM的数据内容与React元素保持一致.

> 注意:
元素和组件是不同的概念.元素只是构成组件的一个部分.

## 将元素渲染到DOM中

首先我们在一个HTML页面中添加一个id="root"的div;

    <div id="root"></div>
    
在此div中所有的内容都将由React DOM来管理,所以我们称之为"根"DOM节点.
  
要将React元素渲染到根DOM节点中,我们通过ReactDOM.render()的方法来将其渲染到页面上.

```javascript

const el = <h1>Hello , world</h1>;
ReactDOM.render(
    el,
    document.querySelector("#root")
)

```

## 更新元素渲染

React元素都是immutable(不可变的)的.当元素被创建后,你是无法改变其内容和属性的.一个元素就像动画里面的帧,他代表应用界面在某一时间点的样子.

后面会介绍到我们将通过其他方式来改变内容和属性.

## React只会更新必要的部分

ReactDOM 首先会比较元素内容先后的不同,而在渲染的过程中只会更新不同的部分.
  