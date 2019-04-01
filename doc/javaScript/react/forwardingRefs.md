# 转发 Refs

`Ref` 转发是一种将`ref`通过组件传递给其子代之一的技术。这种技术对于高阶部件（也称为hocs）特别有用。

让我们从一个`logs`组件属性到控制台的HOC示例开始：

```javaScript

function logProps(WrappedComponent) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }

  return LogProps;
}

```

The “logProps” HOC passes all props through to the component it wraps, so the rendered output will be the same. For example, we can use this HOC to log all props that get passed to our “fancy button” component:

高阶组件`logProps`传递所有 `prop` 到包裹的组件,所以这样渲染输出是一样的.比如,我们可以使用高阶组件记录传递`FancyButton`组件的到所有`props`

```javaScript
class FancyButton extends React.Component {
  focus() {
    // ...
  }

  // ...
}

// Rather than exporting FancyButton, we export LogProps.
// It will render a FancyButton though.
export default logProps(FancyButton);

```

上面的例子有一个地方需要告诫您:`refs`将不会被传递过来.这是因为`ref`并不是一个`prop`.`React`对他的处理像`key`一样.如果您在HOC上增加一个`ref`,那么这个`ref`将和最外面的容器组件相关联,而不会和包裹组件有任何关系.

这意味着用于`FancyButton`组件的`refs`将实际附加到`logProps`组件：

```javaScript

import FancyButton from './FancyButton';

const ref = React.createRef();

// The FancyButton component we imported is the LogProps HOC.
// Even though the rendered output will be the same,
// Our ref will point to LogProps instead of the inner FancyButton component!
// This means we can't call e.g. ref.current.focus()
<FancyButton
  label="Click Me"
  handleClick={handleClick}
  ref={ref}
/>;

```

幸好,我们可以使用API `React.forwardRef`很容易的将`refs`转发到内部`FancyButton`组件.`React.forwardRef`接受一个函数作为参数,这个函数拥有`props`和`ref`参数,并且这个函数返回`React`组件.例如:
```javaScript
function logProps(Component) {
  class LogProps extends React.Component {
    componentDidUpdate(prevProps) {
      console.log('old props:', prevProps);
      console.log('new props:', this.props);
    }

    render() {
      const {forwardedRef, ...rest} = this.props;

      // Assign the custom prop "forwardedRef" as a ref
      return <Component ref={forwardedRef} {...rest} />;
    }
  }

  // Note the second param "ref" provided by React.forwardRef.
  // We can pass it along to LogProps as a regular prop, e.g. "forwardedRef"
  // And it can then be attached to the Component.
  function forwardRef(props, ref) {
    return <LogProps {...props} forwardedRef={ref} />;
  }

  // These next lines are not necessary,
  // But they do give the component a better display name in DevTools,
  // e.g. "ForwardRef(logProps(MyComponent))"
  const name = Component.displayName || Component.name;
  forwardRef.displayName = `logProps(${name})`;

  return React.forwardRef(forwardRef);
}
```