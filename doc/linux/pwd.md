# pwd

## 详解

由于 `Linux` 文件系统中有许多目录，当用户执行一条 `Linux` 命令又没有指定该命令或参数所在的目录时，Linux 系统就会首先在当前目录（目前的工作目录）搜寻这个命令或它的参数。因此，用户在执行命令之前，常常需要确定目前所在的工作目录，即当前目录。

当用户登陆 `Linux` 系统之后，其当前目录就是它的主目录。那么，如何确定当前目录呢？可以使用 `Linux` 系统的 `pwd` 命令来显示当前目录的绝对路径。

`pwd` 命令，是 `Print Working Directory` （打印工作目录）的缩写，功能是显示用户当前所处的工作目录。该命令的基本格式为：

```shell
[root@localhost ~]# pwd
```

### 实例

```shell

[root@localhost ~]# whoami
root
[root@localhost ~]# pwd
/root

```
`whoami` 命令用于确定当前登陆的用户，后续会做详细介绍。可以看到，root 用户当前所在目录是它的主目录 /root。
