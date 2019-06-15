# find

通过扫描磁盘来查找指定的文件。

基本用法：

```shell
find [PATH] [option] [action]
```

## 命令详解

### 与时间有关的参数

与时间有关的参数共有 `-atime`，`-ctime`，`-mtime`。下面以 `-mtime` 说明。

- -mtime n : n 为数字，表示在 n 天之前的“一天内”被更改过的文件；
- -mtime +n : 列出 n 天之前（不含 n 天本身）被更改过的文件名；
- -mtime -n : 列出在 n 之内（含 n 天本身）被更改过的文件名；
- -newer file : file 为一个存在的文件，列出比 file 还要新的文件名。

例子：

将过去系统上面 24 小时内有改动（mtime）的文件列出：

```shell

find / -mtime

# 那个0是重点！0代表目前的时间，所以，从现在开始到24小时前。
# 有改动过内容的文件都会被列出来！那么如果是3天前的24小时呢
# find / -mtime 3

```

寻找/etc 下面的文件，如果文件日期比/etc/passwd 新就列出

```shell

find /etc -newer /etc/passwd

# -newer 用在分辨两个文件之间的新旧关系是很有用的。

```

### 与用户或用户组名有关的参数

- -uid n : n 为数字，这个数字是用户的帐号 ID，即 UID，这个 UID 是记录在/etc/passwd 里面与帐号名称对应的数字。
- -gid n : n 为数字，这个数字是用户组名的 ID，即 GID，这个 GID 是记录在/etc/group 里面
- -user name : name 为用户帐号名称。
- -group name : name 为用户组名
- -nouser : 寻找文件的所有者不存在于/etc/passwd
- -nogroup : 寻找文件的所有用户组不存在与 /etc/group 中的文件。

例子：

查找系统中不属于任何人的文件

```shell

find / -nouser
# 通过这额命令，可以轻易就找出那些不太正常的文件。
# 如果有找到不属于系统任何人的文件时，不要太紧张。
# 那有时候是正常的，尤其是你曾经以源码自行编译软件时。

```

### 与文件权限及名称有关的参数

- -name filename : 查找文件名为 filename 的文件。
- -size [+-]SIZE : 查找比指定 SIZE 还要大（+）或还要小（-）的文件。这个 SIZE 的规格有： c 代表 byte，k 代表 1024byte。所以要找比 50KB 还要大的文件，就是“-size +50K”
- -type TYPE : 查找文件类型为指定 TYPE 的文件。类型主要有：一般正规文件（f）、设备文件（b，c）、目录（d）、；连接文件（l）、socket（s）及 FIFO（p）等属性。
- -perm mode : 查找文件权限“刚好等于”mode 的文件，这个 mode 为类似 chmod 的属性值，举例来说，-rwxr-xr-x 的属性值为 755
- -perm -mode : 查找文件权限“必须要全部包括 mode 的权限”的文件，举例来说，我们要查找 -rwxr--r--，即 744 的文件，使用-perm -744 ， 当一个文件的权限为-rwxr-xr-x，即 755 时，也会被列出来。
- -perm +mode : 查找文件权限“包含任意 mode 的权限”的文件。举例来说，我们要查找 -rwxr-xr-x，即 755 的文件，使用-perm +755 ， 当一个文件的权限为-rw-------，即 755 时，也会被列出来。

### 其他命令

- -exec command : command 为其他命令， - exec 后面可再接其他的命令来处理查找到的结果。
- -print : 将结果打印到屏幕上，这个操作是默认操作。
