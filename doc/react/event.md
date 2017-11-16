# 事件处理

React元素的事件处理和DOM元素的很相似。但是有一点语法上的不同。

+ React事件绑定属性的命名是采用哦驼峰式写法，而不是小写。

+ 如果采用JSX的语法你需要传入一个函数作为事件处理函数，而不是一个字符串(DOM元素的写法)

+ 在React中不能使用返回false的方式阻止默认行为。必须明确的使用preventDefault

例如：

```javascript

function ActionLink(props){
    function handleClick(e){
        e.preventDefault();
        console.log('33333')
    }
    
    return (
        <a href="#" onClick={handleClick}> click me </a>
    )
}

```

在这里e是一个合成事件。React根据W3C spec 来定义这些合成事件，所以不需要担心跨浏览器兼容性问题。

当使用ES6 class语法来定义一个组件的时候，事件处理器会称为类的一个方法。

```javascript

class Toggle extends React.Component{
    constructor(props){
        super(props);
        this.state = {isToggle:true};
        
        this.handleClick = this.handleClick.bind(this);
    }
    
    handleClick(e){
        this.setState(prevState=>({isToggle:!prevState.isToggle}));
    }
    
    render(){
        return (
            <button onClick={this.handleClick}>
                {this.state.isToggle?'ON':'OFF'}
            </button>
        )
    }
}

```

必须谨慎的对待JSX回调函数中的this，类的方法默认是不会绑定this的。如果你忘记绑定this.handleClick 并把它传入onClick，当你调用这个函数的时候this的值会是undefined。

这并不是React的特殊行为，它是函数如何在javaScript中运行的一部分。通常情况下，如果你没有在方法后面添加()，例如onClick = {this.handleClick},你应该为这个方法绑定this。

如果使用bind让你很困惑，这里有两种方式可以解决。如果你正在使用实验性的属性初始化语法，你可以使用属性初始化器来正确的绑定回调函数：