# 高级动画

在上一章，我们制作了[基本动画](./basicAnimation.md)以及逐步了解了让物件移动的方法。在这一部分，我们将会对运动有更深的了解并学会添加一些符合物理的运动以让我们的动画更加高级。

## 绘制小球

我们将会画一个小球用于动画学习，所以首先在画布上画一个球。下面的代码帮助我们建立画布。

```html

<canvas id="canvas" width="600" height="300"></canvas>

```

跟平常一样，我们需要先画一个 context（画布场景）。为了画出这个球，我们又会创建一个包含一些相关属性以及 draw() 函数的 ball 对象，来完成绘制。

```javaScript

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var ball = {
  x: 100,
  y: 100,
  radius: 25,
  color: 'blue',
  draw: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

ball.draw();

```

这里并没有什么特别的。小球实际上是一个简单的圆形，在arc() 函数的帮助下画出。

## 添加速率

现在我们有了一个小球，正准备添加一些基本动画，正如我们上一章所学的。又是这样，window.requestAnimationFrame() 再一次帮助我们控制动画。小球依旧依靠添加速率矢量进行移动。在每一帧里面，我们依旧用clear 清理掉之前帧里旧的圆形。

```javaScript

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var raf;

var ball = {
  x: 100,
  y: 100,
  vx: 5,
  vy: 2,
  radius: 25,
  color: 'blue',
  draw: function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
  }
};

function draw() {
  ctx.clearRect(0,0, canvas.width, canvas.height);
  ball.draw();
  ball.x += ball.vx;
  ball.y += ball.vy;
  raf = window.requestAnimationFrame(draw);
}

canvas.addEventListener('mouseover', function(e){
  raf = window.requestAnimationFrame(draw);
});

canvas.addEventListener('mouseout', function(e){
  window.cancelAnimationFrame(raf);
});

ball.draw();

```