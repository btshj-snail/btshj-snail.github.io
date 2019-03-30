# async 函数

ES2017 标准引入了 async 函数，使得异步操作变得更加方便。

`async` 函数是什么？一句话，它就是 `Generator` 函数的语法糖。

`async`函数就是将 `Generator` 函数的星号（*）替换成`async`，将`yield`替换成`await`，仅此而已。

`async`函数对 `Generator` 函数的改进，体现在以下四点。

- 内置执行器。

- 更好的语义。

- 更广的适用性。
`co`模块约定，`yield`命令后面只能是 `Thunk` 函数或 `Promise` 对象，而`async`函数的`await`命令后面，可以是 `Promise` 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 `resolved` 的 `Promise` 对象）。

- 返回值是 Promise。

`async`函数的返回值是 `Promise` 对象，这比 `Generator` 函数的返回值是 `Iterator` 对象方便多了。你可以用`then`方法指定下一步的操作。

