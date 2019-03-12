# npm 常用命令

## access

### 概要

```` cmd
npm access public [<package>]
npm access restricted [<package>]

npm access grant <read-only|read-write> <scope:team> [<package>]
npm access revoke <scope:team> [<package>]

npm access 2fa-required [<package>]
npm access 2fa-not-required [<package>]

npm access ls-packages [<user>|<scope>|<scope:team>]
npm access ls-collaborators [<package> [<user>]]
npm access edit [<package>]

````

### 详情

用于设置对私有包的访问控制。

对于所有子命令，如果没有包名称传递给子命令，则NPM访问将对当前工作目录中的包执行操作。

- public/restricted 将包设置为可公开访问或受限制

- grant/revoke 添加或删除用户和团队对包具有只读或读写访问权限的能力

- 2fa-required/2fa-not-required 配置包是否要求发布包的人在其帐户上启用双因素身份验证。

- ls-packages 显示用户或团队能够访问的所有包以及访问级别，只读公共包除外（它不会打印整个注册表列表）

- ls-collaborators 显示包的所有访问权限。将只显示您至少具有读取权限的包的权限。如果传入了<user>，则显示您所在的团队中该用户的访问权限

- edit 使用$editor立即设置包的访问权限

### 描述

npm access 总是直接在当前registry上操作，可以使用--registry=\<registry url>配置registry。

没有指定所属用户或团队的包总是公开的.

指定了用户或团队的包默认是受限制的,但是你可以使用 npm publish --access=public 命令来将该包发布成公开包.或者您也可以在发布后,使用 npm access public 命令来指定该包为公开包.

您必须具有设置包访问权限的权限：

- 您是这个包的拥有者(创建者)

- 您是拥有这个包的团队中的成员

- 您已被授予对包的读写权限，无论是作为团队成员还是直接作为所有者。

如果启用了双因素身份验证，那么在进行访问更改时，必须使用--otp传入一个otp。

如果您的帐户没有付款，那么发布作用域包的尝试将失败，并显示HTTP 402状态代码（逻辑上足够），除非您使用--access=public。

团队和团队成员的管理由npm team 命令完成。


## adduser 

增加一个registry用户

### 概要

````cmd

npm adduser [--registry=url] [--scope=@orgname] [--always-auth] [--auth-type=legacy]

aliases: login, add-user

````
### 详情

在指定的registry中创建或验证名为\<username>的用户.并将凭据保存到.npmrc文件。如果没有指定registry，将使用默认registry（请参见npm config）。

用户名、密码和电子邮件是从提示中读取的。

重置密码: https://www.npmjs.com/forgot

更改邮箱: https://www.npmjs.com/email-edit

可以使用同一用户帐户多次使用此命令在新计算机上进行授权。在新机器上进行身份验证时，用户名、密码和电子邮件地址都必须与现有记录匹配。

npm login 是 adduser 的别名,和其行为是完全一致的.

### 配置

#### registry

默认: https://registry.npmjs.org/

这是npm 包的registry的基础路径。如果还指定了作用域，则此registry将仅用于具有该作用域的包。作用域默认为当前所在项目目录的作用域（如果有）。见npm-scope。


### scope

默认: none

如果指定,用户和登录凭证将会与这个指定的范围相结合.查看npm-scope. 您可以同时使用这个,例如

````cmd

npm adduser --registry=http://myregistry.example.com --scope=@myco

````

这将为给定的作用域和登录设置一个registry，或者同时为该注册表创建一个用户。

### always-auth

默认:false

如果指定，保存配置，指示对给定注册表的所有请求都应包含授权信息。对私人注册中心有用。可以与--registry和/或--scope一起使用，例如

````cmd

npm adduser --registry=http://private-registry.example.com --always-auth

````

这将确保对该registry（包括tarballs）的所有请求都包含一个授权头。对于将元数据和包tarball存储在具有不同主机名的主机上的私有registry，可能需要使用此设置。有关“always-auth”的详细信息，请参见npm config中的“always-auth”。Always-Auth的registry特定配置优先于任何全局配置。

### auth-type

默认:'legacy'
类型:'legacy', 'sso', 'saml', 'oauth'

与adduser/login一起使用的身份验证策略。除了传统的NPM中的经典用户名/密码输入之外，一些其他npm registry（例如，NPME）可能支持其他认证策略。


