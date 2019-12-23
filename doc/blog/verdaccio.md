# NPM 私服搭建

## 背景

目前项目组以及公司的前端项目越来越多，业务系统划分越来越精细，那么前端项目之间的公共组件、公共服务应该如何抽取、如何维护、如何管理，这些问题就愈显突出。因此搭建 npm 私服，将公共组件和服务以包的形式进行管理，通过版本号的形式进行发布，可以有效的管理公司、项目组内部的公共组件及服务。同时通过权限设置，也可以有效的保护公司成果不被泄露。除此之外，由于前端每次打包都需要重新拉取第三方包，这个步骤的速度依赖于网络以及第三方镜像。npm 私服可以设置缓存，第一次拉取第三方包后，以后的拉取将直接从 NPM 私服上进行，这样将会极大的提升打包编译速率。

## 为什么选择 verdaccio

网上主要有几种搭建企业 npm 私服的方式：

1. 付费选择：

- `MyGet`
- `NPM Org`

2. 免费选择：

- `DIY NPM`
- `Git`，这也是一种选择，在`package.json`中指定`git`仓库的`URL`即可，但是这种做法有些别扭，第一，使得`package.json`不够优雅，第二，当`git`仓库为`private`时，你需要`HTTPS`或`SSH`凭据，而且通常我们并没有每个团队的权限。
- `Sinopia`
- `verdaccio`

排除付费，可选择的其实也就`DIY NPM`、`Sinopia`、`verdaccio`。从社区活跃度来说，基本都选择了`verdaccio`。`verdaccio`是一个极简单的开源的`NPM`服务。

## 搭建

1. 找个合适的地方下载安装`nodejs`，比如在`/usr/local/lib`下

   安装`wget`（已经安装的跳过这步）

   ```shell

   yum install -y wget;

   ```

   下载：

   ```shell

   wget https://npm.taobao.org/mirrors/node/v12.14.0/node-v12.14.0-linux-x64.tar.xz

   ```

   解压：

   ```shell

   tar -xvf node-v10.6.0-linux-x64.tar.xz;

   ```

   重命名安装目录：

   ```shell

   mv node-v10.6.0-linux-x64 nodejs;

   ```

   建立软连接：

   ```shell

   ln -s /usr/local/lib/nodejs/bin/npm /usr/local/bin/
   ln -s /usr/local/lib/nodejs/bin/node /usr/local/bin/

   ```

执行`node -v`和 `npm -v`命令检查是否安装成功

全局安装`verdaccio`：

```shell
npm i verdaccio -g;
```

全局安装`pm2`，用来守护`node`进程：

```shell
npm i pm2 -g;
```

`pm2`启动服务，执行

```shell
pm2 start verdaccio;
```

然后浏览器访问`http://`服务器`IP`，出现以下页面则代表安装成功。

> pm2 start \***\* // 启动;<br>pm2 reload \*\*** //重启 ; <br> pm2 logs \*\*\* // 日志

## verdaccio 使用

`verdaccio`允许任何人创建账号，若没有配置`verdaccio`的配置文件`config.yaml`，则默认任何注册了`verdaccio`的开发都有`publish`权限。看个实例：

> 以下都以`http://1.1.1.1:4873`服务为例。注意要其他机器能访问，必须要修改配置文件。可参考进阶的配置

1. 添加一个用户：`npm adduser --registry http://1.1.1.1:4873`
2. 给要添加到服务的工程添加源信息，在工程根目录下新建`.npmrc`文件，添加以下内容

```
registry=http://1.1.1.1:4873
```

3. `package.json`中设置好版本，执行`npm publish`

4. 查看`http://1.1.1.1:4873`。可返现网站上已有列表

## 进阶

向上面这样，肯定是不能满足我们的需求的。我们需要权限可控（添加用户，请求、发布、撤销包），UI 可配置。先看看`verdaccio`提供的配置

### `verdaccio` 默认配置

```yarml
#包缓存路径
storage: ./storage

# 网站配置
web:
#网站标题
  title: verddico
#网站logo
  logo: /root/.config/verdaccio/logo.png
#网站导航栏背景色
  primary_color: "#3894ff"
#权限配置
auth:
# 内置的htpasswd权限插件
  htpasswd:
# 用户列表文件
    file: ./htpasswd
# 用户最大数目。-1表示不能在随意注册。
    max_users: -1
# 外部包管理仓库地址
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@*/*':
    access: $all
    publish: $authenticated
    proxy: npmjs
  '**':
    proxy: npmjs
logs:
  - {type: stdout, format: pretty, level: http}

```

### 外网访问配置

如果外网需要访问，那么必须在`config.yaml`增加以下配置

```yaml
listen: 0.0.0.0:4873
```

### 用户管理

按照默认配置，我们可以通过

```shell
npm adduser --registry=http://1.1.1.1:4873

```

这样可以随意的注册用户。但是对于公司私服来说，通常不希望这样。因此我们可以通过以下配置来禁止随意注册用户。

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: -1
```

问题来了，这样以后，我们如何增加用户呢？可以有以下两种方式：

1. 手动编辑`./htpasswd`文件。
2. 使用第三方插件，以命令的形式增加用户。

```shell

npm install sinopia-adduser -g

```

安装好该插件，在`./htpasswd`目录下，运行以下命令

```shell

sinopia-adduser

```

### 权限设置

`verdaccio` 默认引入了`htpasswd`插件。但是这个插件只能以`user`的角度去设置权限。而实际中，我们通常想通过分组来设置权限。

> 由于第三方权限组件都有权限服务器，而我们仅仅只想有个按分组来设置权限的功能即可.因此自己写了一个简单的分组权限插件`verdaccio-simplegroup`。`github`地址:`https://github.com/btshj-snail/snail-verdaccio-group`。

```shell

npm install verdaccio-simplegroup -g

```

在`config.yaml`配置文件中，增加相应的配置

```yaml
auth:
  htpasswd:
    file: ./htpasswd
    max_users: -1
  simplegroup:
    admin_group: Jack Lucy
    base_group: Jack

packages:
  '@company/*':
    access: $authenticated
    publish: admin_group
    unpublish: admin_group
    proxy: npmjs

  '@base/*':
    access: $authenticated
    publish: base_group
    unpublish: base_group
    proxy: npmjs
  '**':
    access: $all
    publish:
    unpublish:
    proxy: npmjs
```

`ok`，增加了以上配置，基本可以达到可使用的程度了。吐槽一下，`verdaccio`提供的默认网站 UI 真的有点`low`，提供的可配置地方又比较少。本来还想写一个网站的插件，但想想最近的时间，来还是以后再弄吧。

## 参考

1. [npm 私服搭建—verdaccio 方案及其最佳实践](https://www.jianshu.com/p/d32ce7e9d4d8)
2. [YAML 快速入门](https://www.jianshu.com/p/97222440cd08)
3. [Verdaccio 搭建私有 NPM](https://juejin.im/post/5cc81991f265da036d79c8ca)
4. [verdaccio](https://verdaccio.org)
