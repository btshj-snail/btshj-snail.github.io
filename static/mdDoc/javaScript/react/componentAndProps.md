# 组件&Props
 
组件可以将UI切成一些独立的、可复用的部件，这样就可以只专注于构建每一个单独的部件。

组件从概念上看就像是函数，它可以接收任意的输入值（称之为"props"）,并返回一个需要在页面上展示的React元素。

## 函数定义/类定义组件

定义一个组件最简单的方式是用javaScript函数：

```javascript

function Welcome(props){
    return <h1>Hello,{props.name}</h1>
}

```

该组件是一个有效的React组件，它接收一个单一的“props”对象并返回一个React元素。我们之所以称这种类型的组件为函数定义组件，是因为从字面上来看，它就是一个javaScript函数。

当然也可以用ES6的class来定义组件

```javascript

class Welcome extends React.Component{
    render(){
        return (<h1>Hello,{props.name}</h1>);
    }
}

```
上面两个组件在React中是相同。我们将在后面讨论类定义组件的一些额外特性。

## 组件渲染

在前面我们遇到的React元素都是DOM标签。然而，React元素也可以是用户自定义的组件。

当React遇到的元素是用户自定义的组件，它会将JSX属性作为单个的对象传递给该组件，这个对象称之为"props"

>警告：
组件名称必须以大写字母开头。<p>例如，&lt;div/&gt;表示一个DOM标签，但是<Welcome/>表示一个组件，并且在使用该组件时必须定义或者引入它。
  
  
## 组合组件

组件可以在它的输出中引用其他组件，这就可以让我们用同一组件来抽象出任意层次的细节。在React应用中，按钮、表单、对话框、整个屏幕的内容等，这些通常都被表示为组件。

例如，我们可以创建一个App组件，用来多次渲染Welcome组件。

```javascript

function Welcome (props){
    return (<h1>Welcome,{props.name}</h1>)
}

function App(props){
    return (
            <div>
                <Welcome name="jack"/>
                <Welcome name="tom"/>
                <Welcome name="lucy"/>
            </div>
            )
}

ReactDOM.render(<App/>,document.querySelector("#root"));

```

通常，一个新的React应用程序的顶部是一个App组件。但是，如果要将React集成到现有应用程序中，则可以从下而上使用像Button这样的小组件作为开始，并逐渐运用到视图层的顶部。

## Props的只读性

无论是使用函数或是类来声明一个组件，它决不能修改它自己的props。来看这个sum函数

```javascript

function sum(a,b){
    return a+b;
}

```
类似于上面的这种函数称之为“纯函数”，它没有改变它自己的输入值，当传入的值相同时，总是会返回相同的结果。

与之相对应的是非纯函数，它会改变它自身的输入值：

```javascript

function withDraw(account,amount){
    account.total = amount;
}

```

React是非常灵活的，但它有一个严格的规则：

***所有的React组件必须像纯函数那样使用他们的props。***

当然，应用的界面是随时间动态变化的，而State可以在不违反上述规则的情况下，根据用户操作、网络响应、或者其他状态变化，使组件动态的响应并改变组件的输出。