# 条件渲染

在React中，可以创建不同的组件来封装各种需要的行为。然后可以根据应用的状态变化只渲染其中一部分。

React中的条件渲染和javaScript中的一致，使用javaScript操作符if或条件运算符来创建表示当前状态的元素，然后让React根据它们来渲染UI


## 与运算符

```javascript

function Mailbox(props){
    const unReadMessages = props.unReadMessages;
    
    return (
        <div>
            <h1>Hello !</h1>
            {
                unReadMessages.length>0 && 
                
                <h2>you have {unReadMessages.length} unread message</h2>    
            }
        </div>
    )
}

```


## 三目运算

```javascript

function Login(props){
    return (
        <div>
            <h1>Hello !</h1>
            {
               props.isLogin ? <span>已登录</span>:<span>请登录</span>
            }
        </div>
    )
}

```

你可以根据自己的爱好，团队的习惯选取条件渲染的方式。当然如果条件变得国语复杂，可能就是提取组件的好时机了。


## 阻止组件渲染

在极少数的情况下，你可能希望隐藏组件，即使它被其他组件渲染。让render方法返回null 而不是它渲染结果即可实现。

在下面的例子，<WarningBanner/>根据属性warn的值条件渲染。如果warn的值是false，则组件不会渲染。

```javascript

function WarningBanner(props){
    if(!props.warn){
        return null;
    }
    
    return (
        <div>
            Warning!
        </div>
    )
}

class Page extends React.Component{
    constructor(props){
        super(props);
        this.state = {showWarning:true};
        this.handleToggleClick = this.handleToggleClick.bind(this);
    }
    
    handleToggleClick(){
        this.setState(prevState=>({showWarning:!prevState.warning}));
    }
    
    render(){
        return (
            <div>
                <Warning warn={this.state.showWarning}/>
                <button onClick={this.handleToggleClick}>{this.state.showWarning?'Hide':'Show'}</button>
            </div>
        )
    }
}

```