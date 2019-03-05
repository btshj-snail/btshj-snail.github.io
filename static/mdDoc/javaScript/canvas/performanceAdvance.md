# 性能优化

canvas元素是众多广泛使用的网络2D图像渲染标准之一。它被广泛用于游戏及复杂的图像可视化中。然而，随着网站和应用将canvas画布推至极限，性能开始成为问题。此文目标是给使用canvas画布元素的优化带来建议，去保证你的网站或者应用表现卓越。

## 性能贴士

下面是一些改善性能的建议

### 在离屏canvas上预渲染相似的图形或重复的对象

如果你发现你的在每一帧里有好多复杂的画图运算，请考虑创建一个离屏canvas，将图像在这个画布上画一次（或者每当图像改变的时候画一次），然后在每帧上画出视线以外的这个画布。

```javaScript

myEntity.offscreenCanvas = document.createElement("canvas");
myEntity.offscreenCanvas.width = myEntity.width;
myEntity.offscreenCanvas.height = myEntity.height;
myEntity.offscreenContext = myEntity.offscreenCanvas.getContext("2d");

myEntity.render(myEntity.offscreenContext);

```

### 避免浮点数的坐标点，用整数取而代之

当你画一个没有整数坐标点的对象时会发生子像素渲染。

    ctx.drawImage(myImage, 0.3, 0.5);

浏览器为了达到抗锯齿的效果会做额外的运算。为了避免这种情况，请保证在你调用drawImage()函数时，用Math.floor()函数对所有的坐标点取整。

### 不要在用drawImage时缩放图像

在离屏canvas中缓存图片的不同尺寸，而不要用drawImage()去缩放它们。

### 使用多层画布去画一个复杂的场景

你可能会发现，你有些元素不断地改变或者移动，而其它的元素，例如外观，永远不变。这种情况的一种优化是去用多个画布元素去创建不同层次。

例如，你可以在最顶层创建一个外观层，而且仅仅在用户输入的时候被画出。你可以创建一个游戏层，在上面会有不断更新的元素和一个背景层，给那些较少更新的元素。

```html
<div id="stage">
  <canvas id="ui-layer" width="480" height="320"></canvas>
  <canvas id="game-layer" width="480" height="320"></canvas>
  <canvas id="background-layer" width="480" height="320"></canvas>
</div>
 
<style>
  #stage {
    width: 480px;
    height: 320px;
    position: relative;
    border: 2px solid black
  }
  canvas { position: absolute; }
  #ui-layer { z-index: 3 }
  #game-layer { z-index: 2 }
  #background-layer { z-index: 1 }
</style>

```

### 用CSS设置大的背景图

如果像大多数游戏那样，你有一张静态的背景图，用一个静态的\<div\>元素，结合background 特性，以及将它置于画布元素之后。这么做可以避免在每一帧在画布上绘制大图。

### 用CSS transforms特性缩放画布

CSS transforms 特性由于调用GPU，因此更快捷。最好的情况是，不要将小画布放大，而是去将大画布缩小。例如Firefox系统，目标分辨率480 x 320 px。

```javaScript

var scaleX = canvas.width / window.innerWidth;
var scaleY = canvas.height / window.innerHeight;

var scaleToFit = Math.min(scaleX, scaleY);
var scaleToCover = Math.max(scaleX, scaleY);

stage.style.transformOrigin = "0 0"; //scale from top left
stage.style.transform = "scale(" + scaleToFit + ")";

```

### 使用moz-opaque属性(仅限Gecko)

如果你的游戏使用画布而且不需要透明，请在画布上设置moz-opaque属性。这能够用于内部渲染优化。

    <canvas id="mycanvas" moz-opaque></canvas>

### 更多的贴士

- 将画布的函数调用集合到一起（例如，画一条折线，而不要画多条分开的直线）
- 避免不必要的画布状态改变
- 渲染画布中的不同点，而非整个新状态
- 尽可能避免 shadowBlur特性
- 尽可能避免text rendering
- 使用不同的办法去清除画布(clearRect() vs. fillRect() vs. 调整canvas大小)
-  有动画，请使用window.requestAnimationFrame() 而非window.setInterval()
- 请谨慎使用大型物理库
- 用JSPerf测试性能