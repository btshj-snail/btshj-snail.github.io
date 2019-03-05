# 系统操作手册编写说明及注意事项

## 说明

系统操作手册使用markdown标准语法进行编写.再使用前端动态解析markdown文本内容,生成html内容.

## 编写步骤及说明

我们以编写一个"入门说明"的文档为例.

1. 在/web/doc 文件夹下建立一个"first"的文件夹,作为该文档的说明.***(注意,这里希望每个文档都对应建立一个文件夹)***.并且在这个文件夹下新建一个img文件夹,用于放置本文档使用的图片.

2. 编写md文件. 文档的内容使用标准markdown语法.***(注意,一定要使用markdown的标准语法.其他的第三方扩展的语法请不要使用,比如有道词典提供的一些图标语法,本系统是无法完成解析的)***
***由于系统会动态解析二级标题,以二级标题为本文档的菜单数据,并且涉及到自动定位,快速定位等功能.因此二级标题的编写比较特殊.请务必注意.***
***编写二级标题 使用 两个连续的#号,然后使用span标签将文本包裹,并且设置span标签的id***.如下:

```
// id 必须在本文档内唯一
## <span id="shouye">首页</span>

```

> 系统会提取二级标题做为本文档的菜单,因此,请规划好您文档的二级标题的使用.

> 这里提供一个查看标准markdown语法的网站.<https://www.appinn.com/markdown/>

> 推荐使用编辑器,编写md文件.这样你可以边写边看到效果. webstorm,intelliJ IDEA,vscode等编辑器和ide都可以下载相应插件进行md文件的编写.要是不知道怎么安装插件,可以call me.



3. 编写html.在md文件的***同一个目录下***,建立一个***同名***的html文件.比如我们之前的md文件,叫做first.md,那么我们的html文件应该叫做first.html .
建立html后,编写html.

3.1. 引入css文件.整个文档使用了bootstrap样式,因此我们需要引入bootstrap的样式文件.

```html
<link rel="stylesheet" href="../../css/bootstrap.min.css">
```

> bootstrap.min.css文件在本工程内的绝对位置 是/web/css/bootstrap.min.css. 所以请注意href值的编写....

3.2. 引入js文件.

```html

<script src="../../js/jquery-2.1.1.min.js"></script>
<script src="../../js/bootstrap.min.js"></script>
<script src="../strapdown.js"></script>
<script src="../docCommon.js"></script>

```

> jquery-2.1.1.min.js文件在本工程内的绝对位置 是/web/js/jquery-2.1.1.min.js. 所以请注意src值的编写....
> bootstrap.min.js文件在本工程内的绝对位置 是/web/js/bootstrap.min.js. 所以请注意src值的编写....
> strapdown.js文件在本工程内的绝对位置 是/web/doc/strapdown.js. 所以请注意src值的编写....
> docCommon.js文件在本工程内的绝对位置 是/web/doc/docCommon.js. 所以请注意src值的编写....

3.3. 编写部分菜单html代码.直接copy吧

```html

<div role="navigation" class="navbar bg-primary navbar-fixed-top">
    <div class="container-fluid">
        <div class="navbar-header">
            <button class="navbar-toggle collapsed" type="button" data-toggle="collapse" data-target="#bs-navbar" aria-controls="bs-navbar" aria-expanded="false">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">操作手册</a>
        </div>

        <div id="bs-navbar" class="collapse navbar-collapse"  aria-expanded="false" style="height: 1px;">

        </div>
    </div>
</div>

```

3.4. 这里有一个关键点...一定要有一个空的隐藏的textarea标签 在您的html文档中.

总的来说,其实编写html,我建议您可以直接copy一份写好的,然后按照实际情况更改下css,js文件的引入路径,则ok.不建议,从空白的html开始编写....


4. 查看效果.编写完md和html文件后,可以启动web服务,在浏览器中打开这个html文件,查看效果.比如first.html,那么在地址应该是http://localhost:8080/go-nifty/doc/first/first.html


## 结束

OK,一篇文档就写完了...还是那句,有什么问题,可以随时call me.


