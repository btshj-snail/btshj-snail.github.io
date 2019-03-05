# 绘制文本

canvas提供了两种绘制文本的方式

**fillText(text, x, y [, maxWidth])**

在指定的(x,y)位置填充指定的文本，绘制的最大宽度是可选的.

**strokeText(text, x, y [, maxWidth])**

在指定的(x,y)位置绘制文本边框，绘制的最大宽度是可选的.

## 一个填充文本的示例

文本用当前的填充方式被填充：

```javaScript

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = "48px serif";
  ctx.fillText("Hello world", 10, 50);
}

```

## 一个文本边框的示例

文本用当前的边框样式被绘制：

```javaScript

function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  ctx.font = "48px serif";
  ctx.strokeText("Hello world", 10, 50);
}

```
## 有样式的文本

在上面的例子用我们已经使用了 font 来使文本比默认尺寸大一些. 还有更多的属性可以让你改变canvas显示文本的方式：

**font = value**

当前我们用来绘制文本的样式. 这个字符串使用和 CSS font 属性相同的语法. 默认的字体是 10px sans-serif。

**textAlign = value**
文本对齐选项. 可选的值包括：start, end, left, right or center. 默认值是 start。

**textBaseline = value**

基线对齐选项. 可选的值包括：top, hanging, middle, alphabetic, ideographic, bottom。默认值是 alphabetic。

**direction = value**
文本方向。可能的值包括：ltr, rtl, inherit。默认值是 inherit。

## 先进的文本测量

当你需要获得更多的文本细节时，下面的方法可以给你测量文本的方法。

**measureText()**

将返回一个 TextMetrics对象的宽度、所在像素，这些体现文本特性的属性。
下面的代码段将展示如何测量文本来获得它的宽度：

```javaScript
function draw() {
  var ctx = document.getElementById('canvas').getContext('2d');
  var text = ctx.measureText("foo"); // TextMetrics object
  text.width; // 16;
}
```