# mkdir

新建文件夹。

## 命令选项

- -m : 配置文件夹的权限，直接设置，不需要默认权限。
- -p : 帮助你直接将所需要的目录（包含上层目录）递归创建起来。

## 案例

- 1.  创建多层目录

```shell

mkdir -p test1/test2/test3

```

- 2. 新建权限为 rwx--x--x 的叫做 `test2` 的目录

```shell

mkdir -m 711 test2

```
