# 操作图像

canvas更有意思的一项特性就是图像操作能力。可以用于动态的图像合成或者作为图形的背景，以及游戏界面（Sprites）等等。浏览器支持的任意格式的外部图片都可以使用，比如PNG、GIF或者JPEG。 你甚至可以将同一个页面中其他canvas元素生成的图片作为图片源。

引入图像到canvas里需要以下两步基本操作：

1. 获得一个指向HTMLImageElement的对象或者另一个canvas元素的引用作为源，也可以通过提供一个URL的方式来使用图片（参见例子）

2. 使用drawImage()函数将图片绘制到画布上

我们来看看具体是怎么做的。


## 获得需要绘制的图片

canvas的API可以使用下面这些类型中的一种作为图片的源：

**HTMLImageElement**

这些图片是由Image()函数构造出来的，或者任何的\<img\>元素

**HTMLVideoElement**

用一个HTML的 \<video\>元素作为你的图片源，可以从视频中抓取当前帧作为一个图像

**HTMLCanvasElement**

可以使用另一个 \<canvas\> 元素作为你的图片源。

**ImageBitmap**

这是一个高性能的位图，可以低延迟地绘制，它可以从上述的所有源以及其它几种源中生成。

这些源统一由 CanvasImageSource类型来引用。

有几种方式可以获取到我们需要在canvas上使用的图片。

### 使用相同页面内的图片

我们可以通过下列方法的一种来获得与canvas相同页面内的图片的引用：

- document.images集合
- document.getElementsByTagName()方法
- 如果你知道你想使用的指定图片的ID，你可以用document.getElementById()获得这个图片

### 使用其它域名下的图片

在 HTMLImageElement上使用crossOrigin属性，你可以请求加载其它域名上的图片。如果图片的服务器允许跨域访问这个图片，那么你可以使用这个图片而不污染canvas，否则，使用这个图片将会污染canvas。

### 使用其它 canvas 元素

和引用页面内的图片类似地，用 document.getElementsByTagName 或 document.getElementById 方法来获取其它 canvas 元素。但你引入的应该是已经准备好的 canvas。

一个常用的应用就是将第二个canvas作为另一个大的 canvas 的缩略图。

## 由零开始创建图像

或者我们可以用脚本创建一个新的 HTMLImageElement 对象。要实现这个方法，我们可以使用很方便的Image()构造函数。

```javaScript
var img = new Image();   // 创建一个<img>元素
img.src = 'myImage.png'; // 设置图片源地址
```

当脚本执行后，图片开始装载。

若调用 drawImage 时，图片没装载完，那什么都不会发生（在一些旧的浏览器中可能会抛出异常）。因此你应该用load事件来保证不会在加载完毕之前使用这个图片：

```javaScript
var img = new Image();   // 创建img元素
img.onload = function(){
  // 执行drawImage语句
}
img.src = 'myImage.png'; // 设置图片源地址
```

如果你只用到一张图片的话，这已经够了。但一旦需要不止一张图片，那就需要更加复杂的处理方法，但图片预加载策略超出本教程的范围，感兴趣的话可以参考JavaScript Image Preloader。