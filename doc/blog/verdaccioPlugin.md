## 背景

最近几天用`verdaccio`搭建了`npm`私服，具体搭建过程可以参见上一篇文章[《 NPM 私服搭建》](./verdaccio.md)。在使用私服的过程中，发现权限体系并不能很好的满足个人需求。因此在查阅文档后，自己开发了一个小的权限插件。

## 默认权限体系

`verdaccio` 的默认权限体系，使用了`htpasswd`作为权限插件。该插件主要是解决"人"的问题，指定权限都是从"人"出发。因此对于分组，这个插件仅提供了`$all`，`$authenticated`，`$anonymous`三个分组。

## 对权限的需求

因为公司划分了几个业务团队，那么需要按业务团队做一些权限划分，并且人数还比较多。如果按照人来设置，则比较麻烦。因此我们需要能够按分组来进行权限设置。

## verdaccio 插件

在翻阅了`verdaccio`的官方文档，发现`verdaccio`是支持插件的。可以通过重写`allow_access`、`allow_publish`、`allow_unpublish`方法，来实现权限的控制。这三个方法，都需要返回一个方法，而这个方法自动注入了三个参数`user`, `pkg`, `callback`。

- `user` 用户信息。包含`name`、`groups`属性。
- `pkg` 包信息。包含`name`、`action`属性。
- `callback` 回调函数。通过权限认证，执行的函数。

编写`verdaccio`插件有一个特别需要注意的就是发布出来的包名。包名必须为`verdaccio-**`.

## 编写`verdaccio-simplegroup`插件

就像这个插件的名字一样，一个及简单的以'组'的粒度来为`verdaccio`提供权限支撑的插件。

`github`地址：`https://github.com/btshj-snail/snail-verdaccio-group`

`npm`包：`verdaccio-simplegroup`

这里面代码是简单的，因此也不再表述了。

## 使用`verdaccio-simplegroup`插件

参见`https://github.com/btshj-snail/snail-verdaccio-group/blob/master/README.md`。
