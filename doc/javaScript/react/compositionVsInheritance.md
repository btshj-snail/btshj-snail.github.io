# 组合 vs 继承

React 具有强大的组合模型，我们建议使用组合而不是继承来复用组件之间的代码。

在本节中，我们将围绕几个 React 新手经常使用继承解决的问题，我们将展示如果用组合来解决它们。

## 包含关系

一些组件不能提前知道它们的子组件是什么。这对于 Sidebar 或 Dialog 这类通用容器尤其常见。

我们建议这些组件使用 children 属性将子元素直接传递到输出。

```javascript

function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}

```

这样做还允许其他组件通过嵌套 JSX 来传递子组件。

```javascript

function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}

```

<FancyBorder> JSX 标签内的任何内容都将通过 children 属性传入 FancyBorder。
由于 FancyBorder 在一个 <div> 内渲染了 {props.children}，所以被传递的所有元素都会出现在最终输出中。


虽然不太常见，但有时你可能需要在组件中有多个入口，这种情况下你可以使用自己约定的属性而不是 children：

```javascript

function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}

```