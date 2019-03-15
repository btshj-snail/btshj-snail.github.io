# 基本介绍

## \<canvas\> 元素

    <canvas id="tutorial" width="150" height="150"></canvas>
    
\<canvas\> 看起来和 \<img\> 元素很相像，唯一的不同就是它并没有 src 和 alt 属性。
实际上，\<canvas\> 标签只有两个属性—— width和height。这些都是可选的，并且同样利用 DOM properties 来设置。
当没有设置宽度和高度的时候，canvas会初始化宽度为300像素和高度为150像素。
该元素可以使用CSS来定义大小，但在绘制时图像会伸缩以适应它的框架尺寸：如果CSS的尺寸与初始画布的比例不一致，它会出现扭曲。

> 注意: 如果你绘制出来的图像是扭曲的, 尝试用width和height属性为\<canvas>明确规定宽高，而不是使用CSS。

id属性并不是\<canvas>元素所特有的，而是每一个HTML元素（比如class元素）都默认具有的属性。
给每个标签都加上一个id属性是个好主意，因为这样你就能在我们的脚本中很容易的找到它。

\<canvas>元素可以像任何一个普通的图像一样（有margin，border，background等等属性）被设计。
然而，这些样式不会影响在canvas中的实际图像。我们将会在一个专门的章节里看到这是如何解决的。
当开始时没有为canvas规定样式规则，其将会完全透明。

## 替换内容

\<canvas\>元素不同于在其中的\<img\>标签，就像\<video\>，\<audio\>，或者 \<picture\>元素一样，很容易定义一些替代内容。
由于某些较老的浏览器（尤其是IE9之前的IE浏览器）或者文本浏览器不支持HTML元素"canvas"，在这些浏览器上你应该总是能展示替代内容。

这非常简单：我们只是在\<canvas>标签中提供了替换内容。支持\<canvas>的浏览器将会忽略在容器中包含的内容，并且只是正常渲染canvas。

举个例子，我们可以提供对canvas内容的文字描述或者是提供动态生成内容相对应的静态图片，如下所示：

```html

<canvas id="stockGraph" width="150" height="150">
  current stock price: $3.15 +0.15
</canvas>

<canvas id="clock" width="150" height="150">
  <img src="images/clock.png" width="150" height="150" alt=""/>
</canvas>

```

## 渲染上下文（The rendering context）

\<canvas\> 元素创造了一个固定大小的画布，它公开了一个或多个渲染上下文，其可以用来绘制和处理要展示的内容。我们将会将注意力放在2D渲染上下文中。
其他种类的上下文也许提供了不同种类的渲染方式；比如， WebGL 使用了基于OpenGL ES的3D上下文 ("experimental-webgl") 。

canvas起初是空白的。为了展示，首先脚本需要找到渲染上下文，然后在它的上面绘制。\<canvas\> 元素有一个叫做 getContext() 的方法，
这个方法是用来获得渲染上下文和它的绘画功能。
getContext()只有一个参数，上下文的格式。对于2D图像而言，如本教程，你可以使用 CanvasRenderingContext2D。

    var canvas = document.getElementById('tutorial');
    var ctx = canvas.getContext('2d');

代码的第一行通过使用 document.getElementById() 方法来为 \<canvas\> 元素得到DOM对象。一旦有了元素对象，你可以通过使用它的getContext() 方法来访问绘画上下文。

## 检查支持性

替换内容是用于在不支持 \<canvas\> 标签的浏览器中展示的。通过简单的测试getContext()方法的存在，脚本可以检查编程支持性。上面的代码片段现在变成了这个样子：

```javascript
var canvas = document.getElementById('tutorial');

if (canvas.getContext){
  var ctx = canvas.getContext('2d');
  // drawing code here
} else {
  // canvas-unsupported code here
}
```

## 一个模板骨架

这里的是一个最简单的模板，我们之后就可以把它作为之后的例子的起点。

> 注意: 为了简洁, 我们在HTML中内嵌了script元素, 但并不推荐这种做法。

```html

<html>
  <head>
    <title>Canvas tutorial</title>
    <script type="text/javascript">
      function draw(){
        var canvas = document.getElementById('tutorial');
        if (canvas.getContext){
          var ctx = canvas.getContext('2d');
        }
      }
    </script>
    <style type="text/css">
      canvas { border: 1px solid black; }
    </style>
  </head>
  <body onload="draw();">
    <canvas id="tutorial" width="150" height="150"></canvas>
  </body>
</html>

```

上面的脚本中包含一个叫做draw()的函数，当页面加载结束的时候就会执行这个函数。
通过使用在文档上加载事件来完成。只要页面加载结束，这个函数，或者像是这个的，
同样可以使用 window.setTimeout()， window.setInterval()，或者其他任何事件处理程序来调用。


## 一个简单例子

一开始，让我们来看个简单的例子，我们绘制了两个有趣的长方形，其中的一个有着alpha透明度。我们将在接下来的例子里深入探索一下这是如何工作的。

```html

<html>
 <head>
  <script type="application/javascript">
    function draw() {
      var canvas = document.getElementById("canvas");
      if (canvas.getContext) {
        var ctx = canvas.getContext("2d");

        ctx.fillStyle = "rgb(200,0,0)";
        ctx.fillRect (10, 10, 55, 50);

        ctx.fillStyle = "rgba(0, 0, 200, 0.5)";
        ctx.fillRect (30, 30, 55, 50);
      }
    }
  </script>
 </head>
 <body onload="draw();">
   <canvas id="canvas" width="150" height="150"></canvas>
 </body>
</html>


```

