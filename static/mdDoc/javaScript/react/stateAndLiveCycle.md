# State & 生命周期

一般一个组件内部需要更新、改变 ，那么就可以为这个组件加入状态，即state。

状态和属性十分相似，但是状态是私有的，完全受控于当前组件。

我们之前提到过，定义为的类的组件有一些特性，那么状态就是定义为类的组件的其中一个特性，生命周期钩子则是定义为类的组件的另一个特性。

***一般来说，如果某个特性是组件自己内部的实现细节，与外部无关的，那么通常会将这个特性设置为状态***


## 正确的使用状态

关于 setState() 这里有三件事情必须要知道

1. 不要直接更新状态

例如，此代码不会重新渲染组件：

```javascript

// wrong
this.state.comment = "Hello";

```

应该使用 setState()

```javascript

//correct
this.setState({comment:'Hello'});

```

构造函数是唯一能初始化this.state的地方

2. 状态更新可能是异步的

React可以将多个setState()调用合并成一个调用来提高性能。

因为this.props 和 this.state 可能是异步更新的，所以不能依靠他们的值来计算下一个状态。

例如，此代码可能无法更新计数器：

```javascript

//wrong
this.setState({
    counter:this.state.counter + this.props.increment
})

```

要修复它，可以使用第二种形式的setState()来接收一个函数而不是对象。该函数将接收先前的状态作为第一个参数，将此次更新被应用时props作为第二个参数：

```javascript

//correct
this.setState((prevState,props)=>({counter:prevState.counter+props.increment}))

```

3. 状态合并更新

当调用setState()时，React将你提供的对象合并到当前状态。

```javascript

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            posts:[],
            comments:[]
        }
    }
    
    render(){
        return (......)
    }
    
    
}

```

这里面的合并是浅合并，也就是说this.setState({comments}) 完整保留了this.state.posts,但是完全替换了this.state.comments

## 数据自顶向下流动

父组件或子组件都不能知道某个组件是有状态还是无状态，并且它们不应该关心某组件是被定义为一个函数还是一个类。

这就是为什么状态通常被称为局部或封装。除了拥有并设置它的组件外，其他组件不可访问。

组件可以选择将其状态传递给其子组件：

```javascript

<h2>It is {this.sate.date.toLocaleTimeString()}</h2>

```

这也适用于用户定义的组件：

```javascript

<FormattedDate date={this.state.date}/>

```
FormattedDate组件将在其属性接收到date值，但是不知道它是来自父组件的状态还是属性，还是手工输入

这通常被称为***自顶向下***或是***单向数据流***。任何状态始终由某些特定组件所有，并且从该状态导出的任何数据或UI只能影响树中***下方***的组件
