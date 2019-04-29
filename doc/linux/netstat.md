# netstat

Netstat 命令用于显示各种网络相关信息，如网络连接，路由表，接口状态 (Interface Statistics)，masquerade 连接，多播成员 (Multicast Memberships) 等等。

## 输出信息含义

执行netstat后，其输出结果为

``` shell

Active Internet connections (w/o servers)
Proto Recv-Q Send-Q Local Address Foreign Address State
tcp 0 2 210.34.6.89:telnet 210.34.6.96:2873 ESTABLISHED
tcp 296 0 210.34.6.89:1165 210.34.6.84:netbios-ssn ESTABLISHED
tcp 0 0 localhost.localdom:9001 localhost.localdom:1162 ESTABLISHED
tcp 0 0 localhost.localdom:1162 localhost.localdom:9001 ESTABLISHED
tcp 0 80 210.34.6.89:1161 210.34.6.10:netbios-ssn CLOSE

Active UNIX domain sockets (w/o servers)
Proto RefCnt Flags Type State I-Node Path
unix 1 [ ] STREAM CONNECTED 16178 @000000dd
unix 1 [ ] STREAM CONNECTED 16176 @000000dc
unix 9 [ ] DGRAM 5292 /dev/log
unix 1 [ ] STREAM CONNECTED 16182 @000000df

```

从整体上看，netstat的输出结果可以分为两个部分：

一个是Active Internet connections，称为有源TCP连接，其中"Recv-Q"和"Send-Q"指%0A的是接收队列和发送队列。这些数字一般都应该是0。如果不是则表示软件包正在队列中堆积。这种情况只能在非常少的情况见到。

另一个是Active UNIX domain sockets，称为有源Unix域套接口(和网络套接字一样，但是只能用于本机通信，性能可以提高一倍)。
Proto显示连接使用的协议,RefCnt表示连接到本套接口上的进程号,Types显示套接口的类型,State显示套接口当前的状态,Path表示连接到套接口的其它进程使用的路径名。


## 常见参数

- -a (all)显示所有选项，默认不显示LISTEN相关
- -t (tcp)仅显示tcp相关选项
- -u (udp)仅显示udp相关选项
- -n 拒绝显示别名，能显示数字的全部转化成数字。
- -l 仅列出有在 Listen (监听) 的服務状态

- -p 显示建立相关链接的程序名
- -r 显示路由信息，路由表
- -e 显示扩展信息，例如uid等
- -s 按各个协议进行统计
- -c 每隔一个固定时间，执行该netstat命令。

## 实用命令实例

### 列出所有端口 (包括监听和未监听的)

``` shell

# netstat -a 

# netstat -at //列出所有tcp端口

# netstat -au // 列出所有udp端口

```

### 列出所有处于监听状态的 Sockets

只显示监听端口 

```shell

# netstat -l
# netstat -lt //列出所有监听的tcp端口

# netstat -lu //列出所有监听的udp端口

# netstat -lx //只列出所有监听 UNIX 端口

```
### 显示每个协议的统计信息

```shell

# netstat -s
# netstat -st //显示tcp端口的统计信息
# netstat -su //显示udp端口的统计信息

```
## 在 netstat 输出中显示 PID 和进程名称 netstat -p

`netstat -p` 可以与其它开关一起使用，就可以添加 “PID/进程名称” 到 netstat 输出中，这样 `debugging` 的时候可以很方便的发现特定端口运行的程序。

```shell

# netstat -pt

```

###  在 netstat 输出中不显示主机，端口和用户名 (host, port or user)

当你不想让主机，端口和用户名显示，使用 netstat -n。将会使用数字代替那些名称。

同样可以加速输出，因为不用进行比对查询。

```shell

# netstat -an

```

### 持续输出 netstat 信息

netstat 将每隔一秒输出网络信息。

```shell

# netstat -c

```

### 显示核心路由信息 netstat -r

```shell

# netstat -r

```