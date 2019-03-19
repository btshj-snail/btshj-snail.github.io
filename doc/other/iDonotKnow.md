# 忽视掉的知识

## 1. 页面导入样式时，使用link和@import有什么区别？

(1) link属于XHTML标签，除了加载CSS外，还能用于定义RSS, 定义rel连接属性等作用；而@import是CSS提供的，只能用于加载CSS;

(2) 页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;

(3) import是CSS2.1 提出的，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题;

(4) link支持使用js控制DOM去改变样式，而@import不支持;

## 2. 浏览器内核的解析和对比

浏览器一般来说可以分为两部分,shell+内核.一般shell指的就是浏览器的外壳,比如菜单,工具栏之类的.内核是浏览器的核心,他是基于标记语言显示内容的程序或模块.

浏览器内核又分成两部分:渲染引擎和js引擎.常见的浏览器内核可以分这四种：Trident、Gecko、 Presto、Webkit。
 
Trident又称MSHTML，是微软开发的渲染引擎（包含了Javascript引擎JScript），他已经深入了Windows操作系统的骨髓，例如Windows Media Play，Windows Explorer，Outlook Express等都使用了

Gecko是C++开发的，Open Source的渲染引擎，包括了SpiderMonkey(Rhino)。主要的使用者有Firefox。

Webkit是苹果公司基于KHTML开发的。他包括Webcore和JavaScriptCore（SquirrelFish,V8）两个引擎。主要的使用者有Safari，Chrome。

Presto由Opera Software公司开始的，用于Opera的渲染引擎。

## 3. HTML5的离线储存原理及其使用

原理:HTML5的离线存储是基于一个新建的.appcache文件的缓存机制(不是存储技术)，通过这个文件上的解析清单离线存储资源，这些资源就会像cookie一样被存储了下来。之后当网络在处于离线状态下时，浏览器会通过被离线存储的数据进行页面展示。

如何使用：
  1、页面头部像下面一样加入一个manifest的属性；
  2、在cache.manifest文件的编写离线存储的资源；
  	CACHE MANIFEST
  	#v0.11
  	CACHE:
  	js/app.js
  	css/style.css
  	NETWORK:
  	resourse/logo.png
  	FALLBACK:
  	/ /offline.html
  3、在离线状态时，操作window.applicationCache进行需求实现。

那么浏览器是怎么对离线的资源进行管理和加载的呢？这里需要分两种情况来讨论。

- 在线的情况下，浏览器发现html头部有manifest属性，它会请求manifest文件，如果是第一次访问app，那么浏览器就会根据manifest文件的内容下载相应的资源并且进行离线存储。如果已经访问过app并且资源已经离线存储了，那么浏览器就会使用离线的资源加载页面，然后浏览器会对比新的manifest文件与旧的manifest文件，如果文件没有发生改变，就不做任何操作，如果文件改变了，那么就会重新下载文件中的资源并进行离线存储。

- 离线的情况下，浏览器就直接使用离线存储的资源。

这个过程中有几个问题需要注意。

1. 如果服务器对离线的资源进行了更新，那么必须更新manifest文件之后这些资源才能被浏览器重新下载，如果只是更新了资源而没有更新manifest文件的话，浏览器并不会重新下载资源，也就是说还是使用原来离线存储的资源。

2. 对于manifest文件进行缓存的时候需要十分小心，因为可能出现一种情况就是你对manifest文件进行了更新，但是http的缓存规则告诉浏览器本地缓存的manifest文件还没过期，这个情况下浏览器还是使用原来的manifest文件，所以对于manifest文件最好不要设置缓存。

3. 浏览器在下载manifest文件中的资源的时候，它会一次性下载所有资源，如果某个资源由于某种原因下载失败，那么这次的所有更新就算是失败的，浏览器还是会使用原来的资源。

4. 在更新了资源之后，新的资源需要到下次再打开app才会生效，如果需要资源马上就能生效，那么可以使用window.applicationCache.swapCache()方法来使之生效，出现这种现象的原因是浏览器会先使用离线资源加载页面，然后再去检查manifest是否有更新，所以需要到下次打开页面才能生效。

## 4. cookies,sessionStorage,localStorage

cookie 是标示用户身份而存储在本地终端的.cookie数据始终在同源的http请求中携带(即使不需要),也会在浏览器和服务器之间传递.

sessionStorage和localStorage不会自动将数据发送给服务端,仅保存在客户端.

存储大小:

cookie的大小只有4k,而sessionStorage和localStorage虽然也有大小限制,但比cookie大得多,可以达到5M或更大.

有效期:

localStorage    存储持久数据，浏览器关闭后数据不丢失除非主动删除数据；

sessionStorage  数据在当前浏览器窗口关闭后自动删除。

cookie          设置的cookie过期时间之前一直有效，即使窗口或浏览器关闭


## 5. iframe的缺点

iframe 会阻塞主页的onload事件;

搜索引擎无法解析这种界面,不利于SEO;

iframe和主页共享连接池,而浏览器对同域的连接的并发数是有限制的,所以会影响界面的并行加载.

**如果需要使用iframe,最好是通过javaScript动态给iframe添加src属性值,这样可以绕过第一条和第三条**

## 6. 浏览器多个标签页之间的通信

1. 借助cookie和setInterval

这种方式性能损耗过大...不推荐

2. localStorage实现

localstorage是浏览器多个标签共用的存储空间，所以可以用来实现多标签之间的通信。
直接在window对象上添加监听即可：

```javaScript

window.onstorage = function(e){ console.log(e); }

//或者

window.addEventListener('storage',function(e){
	console.log(e);
})

```

onstorage以及storage事件，针对都是非当前页面对localStorage进行修改时才会触发，当前页面修改localStorage不会触发监听函数。然后就是在对原有的数据的值进行修改时才会触发，比如原本已经有一个key会a值为b的localStorage，你再执行：localStorage.setItem('a', 'b')代码，同样是不会触发监听函数的。

> (ps：session是会话级的存储空间，每个标签页都是单独的）

3. html5浏览器的新特性SharedWorker

普通的webworker直接使用new Worker()即可创建，这种webworker是当前页面专有的。然后还有种共享worker(SharedWorker)，这种是可以多个标签页、iframe共同使用的。

SharedWorker可以被多个window共同使用，但必须保证这些标签页都是同源的(相同的协议，主机和端口号)

(1. 首先新建一个js文件worker.js，具体代码如下：

```javaScript

//sharedWorker 所用到js文件,不必打包到项目中,直接放到服务器上即可.
let data = '';

onconnect = function(e){
	let port = e.ports[0];

	port.onmessage = function(e){
		if(e.data === 'get'){
			port.postMessage(data);
		}else{
			data  = e.data;
		}
	}
}

```
webworker端(暂且这样称呼)的代码就如上，只需注册一个onmessage监听信息的事件，客户端(即使用sharedWorker的标签页)发送message时就会触发。注意webworker无法在本地使用，出于浏览器本身的安全机制，所以我这次的示例也是放在服务器上的，worker.js和index.html在同一目录。

(2. 因为客户端和webworker端的通信不像websocket那样是全双工的，所以客户端发送数据和接收数据要分成两步来处理。示例中会有两个按钮，分别对应的向sharedWorker发送数据的请求以及获取数据的请求，但他们本质上都是相同的事件--发送消息。

(3. webworker端会进行判断，传递的数据为'get'时，就把变量data的值回传给客户端，其他情况，则把客户端传递过来的数据存储到data变量中。下面是客户端的代码：

```javaScript

// 这段代码是必须的，打开页面后注册SharedWorker，显示指定worker.port.start()方法建立与worker间的连接
    if (typeof Worker === "undefined") {
      alert('当前浏览器不支持webworker')
    } else {
      let worker = new SharedWorker('worker.js')
      worker.port.addEventListener('message', (e) => {
        console.log('来自worker的数据：', e.data)
      }, false)
      worker.port.start()
      window.worker = worker
    }
// 获取和发送消息都是调用postMessage方法，我这里约定的是传递'get'表示获取数据。
window.worker.port.postMessage('get')
window.worker.port.postMessage('发送信息给worker')

```
(4. 页面A发送数据给worker，然后打开页面B，调用window.worker.port.postMessage('get')，即可收到页面A发送给worker的数据。

4. websocket 通讯



## 7. 盒子模型

盒模型分为IE盒模型和W3C标准盒模型。

W3C标准盒模型: 属性width,height只包含content,不包含padding和border

IE盒模型:属性width,height包含border,padding和content,即content+border+padding

在ie8+浏览器中使用哪种盒模型可以由box-sizing(Css新增的属性)控制,默认值为content-box,即标准盒模型.如果将box-sizing设为border-box则用的就是IE盒模型.如果在ie6,7,8中的DOCTYPE缺失会触发IE盒模型.在当前W3C标准盒模型是可以通过box-sizing自由的进行切换.

**其实可以这么理解,标准盒模型下,设置的样式的width就是content的width,无论改变不改变padding都不会改变width的值.在IE盒模型下,设置的样式width等于border+content+padding,因此padding改变,将会影响content的变化.也就是说,IE盒模型下,width=300 , padding=20 , 其实content就变成了300-20*2=260**


## 8. css权重

important > id > class > tag|attribute|伪类 > 通配符 . id权重1000,class权重100,tag权重10,通配符1

同权重的情况下: 内联 > 嵌入样式表（当前文件中） > 外部样式

## 9. inline-block  错行

设置两个或多个元素为一行,加起来百分比刚好100%,但是会发现总是错行了.这是因为我们在编写代码的时候出现了换行.浏览器默认会合并多个换行为一个换行.这样每个元素中就有换行符占了位置,所以加起来肯定超过100%,就会出现错行.那么出现这个情况,我们可以设置父容器的font-size为0,这样换行符就没有占有空间了.

## 10. css模块化

无论是从现代前端框架,还是W3C的web component草案来看,组件化已经是前端开发的主流之选和未来的发展方向.

 - 预处理和后处理

 预处理:比较流行的CSS预处理器有Sass、Less和Stylus
 后处理:后处理器是对原生CSS进行处理并最终生成CSS的处理器

 - namespace约束

 OOCSS : **分离结构和皮肤**;**分离容器和内容**

 SMACSS:**基础（Base）**,**布局（Layout）**,**模块（Module）**,**状态（State）**,**主题（Theme）**

 ## 11. 元素竖向的百分比设定是相对于容器的高度吗？

 height 是,但是margin-top ,padding-top则不是相对于容器高度,而是相对于容器宽度


 ## 12. line-height

古时候我们使用印刷机来出来文字。印刷出来的每个字，都位于独立的一个块中。

行间距，即传说中控制两行文字垂直距离的东东。在CSS中，line-height被用来控制行与行之间垂直距离。

不过，行间距与半行间距，还是取决于CSS中的line-height。那么，如何来使用line-height呢？

默认状态，浏览器使用1.0-1.2 line-height, 这是一个初始值。你可以定义line-height属性来覆盖初始值：p｛line-height:140%｝

你可以有5种方式来定义line-height。

1. line-height可以被定义为：body{line-height:normal;}

2. line-height可以被定义为：body{line-height:inherit;}

3. line-height可以使用一个百分比的值body{line-height:120%;}

4. line-height可以被定义为一个长度值(px,em等) body{line-height:25px;}

5. line-height也可以被定义为纯数字， body{line-height:1.2}

### 缩写line-height

那5种line-height写法，可以在font属性中缩写。line-height的值紧跟着font-size值使用斜杠分开，如：\<font-size\>/\<line-height\>

实例：body{font:100%/normal  arial;} , body{font:100%/120%  arial;} ,body{font:100%/1.2  arial;}  ,body{font:100%/25px  arial;} 

计算line-height

有些CSS属性是可继承的（inherited），从层叠的元素里传递下来。这样做是为了方便开发者，不再为后代元素重新设值。

对于line-height继承有点复杂。

1. 百分比

![](https://note.youdao.com/yws/api/personal/file/1F9426C354CE4947AB8E347D622B2F1B?method=download&shareKey=9d3d5f54d1d6bf0de8b0196addd4c265)

2. 长度

![](https://note.youdao.com/yws/api/personal/file/459BF70610444C61B89B51A24BE5A1DE?method=download&shareKey=3a5b2a9cf02d07cfe8eead827819b5d1)

3. normal

![](https://note.youdao.com/yws/api/personal/file/73A8A75675EE4EACBFF00BDBC32DA46A?method=download&shareKey=151e35a754e7d8fd56e333067840a56e)

4. 数字

![](https://note.youdao.com/yws/api/personal/file/B283298CB73342C3920C21C04D44FAAD?method=download&shareKey=b7f7125c147d979d421b386dd8110212)

所谓行高是指 ***文本行基线间的垂直距离*** 。要想理解这句话首先得了解几个基本知识：

### 顶线、中线、基线、底线
![](https://note.youdao.com/yws/api/personal/file/E403B811D18842DA96D245B02314C0D0?method=download&shareKey=c70690d4a9b1afcecf004529acdea14c)

从上到下四条线分别是顶线、中线、基线、底线，很像才学英语字母时的四线三格，我们知道vertical-align属性中有top、middle、baseline、bottom，就是和这四条线相关。尤其记得基线不是最下面的线，最下面的是底线。

**行高**是指上下文本行的基线间的垂直距离，即图中两条红线间垂直距离。

**行距**是指一行底线到下一行顶线的垂直距离，即第一行粉线和第二行绿线间的垂直距离。

**半行距**是行距的一半，即区域3垂直距离/2，区域1，2，3，4的距离之和为行高，而区域1，2，4距离之和为字体size，所以半行距也可以这么算：（行高-字体size）/2


### 内容区、行内框、行框

![](https://note.youdao.com/yws/api/personal/file/47D1811FB3B74496AE4C3B8118C33EF6?method=download&shareKey=3e9e59fed16f3fd6f50e794fa834e9fc)

**内容区**：底线和顶线包裹的区域，即图深灰色背景区域。

**行内框**:每个行内元素会生成一个行内框，行内框是一个浏览器渲染模型中的一个概念，无法显示出来，在没有其他因素影响的时候（padding等），行内框等于内容区域，而设定行高时行内框高度不变，半行距【（行高-字体size）/2】分别增加/减少到内容区域的上下两边（深蓝色区域）

**行框（line box）**，行框是指本行的一个虚拟的矩形框，是浏览器渲染模式中的一个概念，并没有实际显示。行框高度等于本行内所有元素中行内框最大的值（以行高值最大的行内框为基准，其他行内框采用自己的对齐方式向基准对齐，最终计算行框的高度），当有多行内容时，每行都会有自己的行框。


基本概念搞明白了我们就可以说说本文的主角line-height属性了。

定义：line-height 属性设置行间的距离（行高），不能使用负值。该属性会影响行框的布局。在应用到一个块级元素时，它定义了该元素中基线之间的最小距离而不是最大距离。line-height 与 font-size 的计算值之差(行距)分为两半，分别加到一个文本行内容的顶部和底部。可以包含这些内容的最小框就是行框。

div居中对齐一直是个难题，水平还好解决些，margin：0 auto; 可以解决现代浏览器，IE下text-align:center。但垂直居中就没那么简单了，默认是这样子的。

```html

<div style="width:150px;height:100px;background-color:#ccc;">
                <span>This is a test.<br/>
                        This is a test.
                </span>
</div>

```

我们可以利用line-block这样做

```html

<div style="width:150px;height:100px;line-height:100px;background-color:#ccc;font-size:0;">
                <span style="display:inline-block;font-size:10px;line-height:1.4em;vertical-align:middle;">This is a test.<br/>
                        This is a test.
                </span>
</div>

```

单行就比较简单了，把line-height设置为box的大小可以实现单行文字的垂直居中



## 13. 在ios中overflow: scroll时不能平滑滚动

	-webkit-overflow-scrolling: touch

	是因为这行代码启用了硬件加速特性，所以滑动很流畅。


## 14. png,jpg,gif,webp

png8 : 无损,索引色,适合小图标

png24: 无损,直接色,适合小图标

jpg : 有损,直接色,适合大图

gif : 无损,索引色,适合小动图

webp:同时支持有损和无损压缩的,直接色


## 15. JavaScript原型，原型链

- 每一个构造函数都拥有一个prototype属性，这个属性指向一个对象，也就是原型对象。当使用这个构造函数创建实例的时候，prototype属性指向的原型对象就成为实例的原型对象。
- 原型对象默认拥有一个constructor属性，指向指向它的那个构造函数（也就是说构造函数和原型对象是互相指向的关系）。
- 每个对象都拥有一个隐藏的属性[[prototype]]，指向它的原型对象，这个属性可以通过 Object.getPrototypeOf(obj) 或 obj.\_\_proto__ 来访问。实际上，构造函数的prototype属性与它创建的实例对象的[[prototype]]属性指向的是同一个对象，即 对象.\_\_proto__ === 函数.prototype 。

在JavaScript中，所有的对象都是由它的原型对象继承而来，反之，所有的对象都可以作为原型对象存在。
访问对象的属性时，JavaScript会首先在对象自身的属性内查找，若没有找到，则会跳转到该对象的原型对象中查找。


JavaScript中所有的对象都是由它的原型对象继承而来。而原型对象自身也是一个对象，它也有自己的原型对象，这样层层上溯，就形成了一个类似链表的结构，这就是原型链（prototype chain）。

## 16. js数据类型的内存划分

js数据类型分为两大类,基本类型和引用类型.基本类型包括(string,number,null,undefined,boolean),引用类型包括:对象,方法,数组

基本类型大小固定,所以放在栈(stack)中,引用类型大小不固定,所以放在堆(heap)中.引用类型在堆中的地址存放在栈中.

当一个方法执行时，每个方法都会建立自己的内存栈，在这个方法内定义的变量将会逐个放入这块栈存里，随着方法的执行结束，这个方法的栈存也将自然销毁了。因此，所有在方法中定义的变量都是放在栈内存中的；

当我们在程序中创建一个对象时，这个对象将被保存到运行时数据区中，以便反复利用（因为对象的创建成本开销较大），这个运行时数据区就是堆内存。堆内存中的对象不会随方法的结束而销毁，即使方法结束后，这个对象还可能被另一个引用变量所引用（方法的参数传递时很常见），则这个对象依然不会被销毁，只有当一个对象没有任何引用变量引用它时，系统的垃圾回收机制才会在核实的时候回收它。



