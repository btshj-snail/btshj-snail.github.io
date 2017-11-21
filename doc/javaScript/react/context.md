# Context

> 注释：由于React v15.5开始 React.PropTypes已经废弃，我们推荐使用prop-types来定义contextTypes。

使用React可以非常轻松地追踪通过React组件的数据流。
在React组件中，你可以看到哪些props被传递，这使得你的应用容易理解。

在有些场景中，你不想要向下每层都手动地传递你需要的 props. 这就需要强大的 context API了。

## 为什么不要使用Context

绝大多数应用程序不需要使用 context.

如果你想让你的应用更稳定，别使用context。因为这是一个实验性的API，在未来的React版本中可能会被更改。

如果你对状态管理库如Redux或Mobx不太熟悉，那就别用context了。
在很多实际应用中，这些库及其React绑定是管理与许多组件相关的state的不错选择。
Redux可能是你更好的选择，而不是context。

如果你不是一个有经验的React的开发者，不要使用context，通常仅使用props和state来实现功能是更好的一种方式。

尽管有这些警告，如果你还是坚持要使用context，
那么尽量将使用context的代码隔离到一小块地方并避免直接使用context API，这样以后API变更的时候更容易升级。

## 如何使用Context

假设你有如下代码:

```javascript

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.props.color}}>
        {this.props.children}
      </button>
    );
  }
}

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button color={this.props.color}>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  render() {
    const color = "purple";
    const children = this.props.messages.map((message) =>
      <Message text={message.text} color={color} />
    );
    return <div>{children}</div>;
  }
}

```

在这个例子中，我们手动传递color这个prop，以适当地设置Button和Message组件的样式。使用context，我们可以自动地在组件树中传递参数。

```javascript

const PropTypes = require('prop-types');

class Button extends React.Component {
  render() {
    return (
      <button style={{background: this.context.color}}>
        {this.props.children}
      </button>
    );
  }
}

Button.contextTypes = {
  color: PropTypes.string
};

class Message extends React.Component {
  render() {
    return (
      <div>
        {this.props.text} <Button>Delete</Button>
      </div>
    );
  }
}

class MessageList extends React.Component {
  getChildContext() {
    return {color: "purple"};
  }

  render() {
    const children = this.props.messages.map((message) =>
      <Message text={message.text} />
    );
    return <div>{children}</div>;
  }
}

MessageList.childContextTypes = {
  color: PropTypes.string
};

```

通过在MessageList（context提供者）中添加childContextTypes和getChildContext，React会向下自动传递参数，任何组件只要在它的子组件中（这个例子中是Button），
就能通过定义contextTypes来获取参数。

如果contextTypes没有定义，那么context将会是个空对象。