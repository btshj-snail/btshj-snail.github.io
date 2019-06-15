# whereis

查找文件。在`Liunx`下面也有相当优异的查找命令。通常`find`不很常用的，因为速度比较慢。通常我们都是先使用`whereis`和`locate`来检查，如果真的找不到了，才用`find`来查找。为什么呢？因为`whereis`与`locate`是利用数据库来查找的，所以相当快速，而且并没有实际查询硬盘，比较节省时间。

## 命令

- -b ： 只找二进制格式的文件。
- -m ： 只找在说明文件`manual`路径下的文件
- -s ： 只找`source`源文件
- -u ： 查找不在上述三个选项当中的其他特殊文件。

## 实例

- 找出`ifconfi`g 这个文件名

```shell

whereis ifconfig

```

- 只找出跟`passwd`有关的说明文件

```shell

whereis -m passwd

```
