# 不受控组件

在大多数情况下，我们推荐使用受控组件来实现表单。
在受控组件中，表单数据由 React 组件负责处理。另外一个选择是不受控组件，其表单数据由 DOM 元素本身处理。

要编写一个未控制组件，你可以使用一个 ref 来从 DOM 获得 表单值，而不是为每个状态更新编写一个事件处理程序。

例如，在不受控组件中，以下代码接受一个单独的名字 :

```javascript

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={(input) => this.input = input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

```
因为不受控组件的数据来源是 DOM 元素，当使用不受控组件时很容易实现 React 代码与非 React 代码的集成。
如果你希望的是快速开发、不要求代码质量，不受控组件可以一定程度上减少代码量。否则。你应该使用受控组件。

如果仍然不清楚在某个特定方案你应该使用哪种类型的组件，可以在 这个文章中了解[受控](./form.md)和不受控组件 来获得帮助。

## 默认值

在 React 渲染生命周期中，表单元素中的 value 属性将会覆盖 DOM 中的 value 。
在不受控组件中，你可能希望 React 有初始值，但保留后续更新不受控制。
在这种情况下，你需要使用 defaultValue 属性而不是 value 属性。

```javascript

render() {
  return (
    <form onSubmit={this.handleSubmit}>
      <label>
        Name:
        <input
          defaultValue="Bob"
          type="text"
          ref={(input) => this.input = input} />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

```

同样， &lt;input type="checkbox"&gt; 和 &lt;input type="radio"&gt; 支持 defaultChecked，而 &lt;select&gt; 和 &lt;textarea&gt; 支持 defaultValue.