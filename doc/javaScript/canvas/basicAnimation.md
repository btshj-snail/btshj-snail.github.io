# 基本动画

由于我们是用 JavaScript 去操控 <canvas> 对象，这样要实现一些交互动画也是相当容易的。在本章中，我们将看看如何做一些基本的动画。

可能最大的限制就是图像一旦绘制出来，它就是一直保持那样了。如果需要移动它，我们不得不对所有东西（包括之前的）进行重绘。重绘是相当费时的，而且性能很依赖于电脑的速度。

## 动画的基本步骤

你可以通过以下的步骤来画出一帧:

1. 清空 canvas

除非接下来要画的内容会完全充满 canvas （例如背景图），否则你需要清空所有。最简单的做法就是用 clearRect 方法。

2. 保存 canvas 状态
如果你要改变一些会改变 canvas 状态的设置（样式，变形之类的），又要在每画一帧之时都是原始状态的话，你需要先保存一下。

3. 绘制动画图形（animated shapes）
这一步才是重绘动画帧。

4.恢复 canvas 状态
如果已经保存了 canvas 的状态，可以先恢复它，然后重绘下一帧。

## 操控动画 Controlling an animation

在 canvas 上绘制内容是用 canvas 提供的或者自定义的方法，而通常，我们仅仅在脚本执行结束后才能看见结果，比如说，在 for 循环里面做完成动画是不太可能的。

因此， 为了实现动画，我们需要一些可以定时执行重绘的方法。有两种方法可以实现这样的动画操控。首先可以通过 setInterval 和 setTimeout 方法来控制在设定的时间点上执行重绘。


### 有安排的更新画布 Scheduled updates

首先，可以用window.setInterval(), window.setTimeout(),和window.requestAnimationFrame()来设定定期执行一个指定函数。

**setInterval(function, delay)**

当设定好间隔时间后，function会定期执行。

**setTimeout(function, delay)**

在设定好的时间之后执行函数
 
**requestAnimationFrame(callback)**

告诉浏览器你希望执行一个动画，并在重绘之前，请求浏览器执行一个特定的函数来更新动画。

如果你并不需要与用户互动，你可以使用setInterval()方法，它就可以定期执行指定代码。如果我们需要做一个游戏，我们可以使用键盘或者鼠标事件配合上setTimeout()方法来实现。通过设置事件监听，我们可以捕捉用户的交互，并执行相应的动作。

> 下面的例子，采用 window.requestAnimationFrame()实现动画效果。这个方法提供了更加平缓并更加有效率的方式来执行动画，当系统准备好了重绘条件的时候，才调用绘制动画帧。一般每秒钟回调函数执行60次，也有可能会被降低。想要了解更多关于动画循环的信息，尤其是游戏，可以在Game development zone 参考这篇文章 Anatomy of a video game。





