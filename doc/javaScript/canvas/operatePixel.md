# 像素操作

到目前为止，我们尚未深入了解Canvas画布真实像素的原理，事实上，你可以直接通过ImageData对象操纵像素数据，直接读取或将数据数组写入该对象中。稍后我们也将深入了解如何控制图像使其平滑（反锯齿）以及如何从Canvas画布中保存图像。

## ImageData 对象

ImageData对象中存储着canvas对象真实的像素数据，它包含以下几个只读属性：

**width**

图片宽度，单位是像素

**height**

图片高度，单位是像素

**data**

Uint8ClampedArray类型的一维数组，包含着RGBA格式的整型数据，范围在0至255之间（包括255）。

data属性返回一个 Uint8ClampedArray，它可以被使用作为查看初始像素数据。每个像素用4个1bytes值(按照红，绿，蓝和透明值的顺序; 这就是"RGBA"格式) 来代表。每个颜色值部份用0至255来代表。每个部份被分配到一个在数组内连续的索引，左上角像素的红色部份在数组的索引0位置。像素从左到右被处理，然后往下，遍历整个数组。

Uint8ClampedArray  包含高度 × 宽度 × 4 bytes数据，索引值从0到(高度×宽度×4)-1

例如，从行50，纵200的像素中读取图片的蓝色部份，你会写以下代码：

    blueComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 2];   

你可能用会使用Uint8ClampedArray.length属性来读取像素数组的大小（以bytes为单位）：

    var numBytes = imageData.data.length;

## 创建一个ImageData对象

去创建一个新的，空白的ImageData对象，你应该会使用createImageData() 方法。有2个版本的createImageData()方法。

    var myImageData = ctx.createImageData(width, height);

上面代码创建了一个新的具体特定尺寸的ImageData对象。所有像素被预设为透明黑。

你也可以创建一个被anotherImageData对象指定的相同像素的ImageData对象。这个新的对象像素全部被预设为透明黑。这个并非复制了图片数据。

    var myImageData = ctx.createImageData(anotherImageData);

## 得到场景像素数据

为了获得一个包含画布场景像素数据的ImageData对像，你可以用getImageData()方法：

    var myImageData = ctx.getImageData(left, top, width, height);

这个方法会返回一个ImageData对象，它代表了画布区域的对象数据，此画布的四个角落分别表示为(left, top), (left + width, top), (left, top + height), 以及(left + width, top + height)四个点。这些坐标点被设定为画布坐标空间元素。

> 注：任何在画布以外的元素都会被返回成一个透明黑的ImageData对像。

## 颜色选择器

在这个例子里面，我们会使用getImageData()去展示鼠标光标下的颜色。为此，我们要当前鼠标的位置，记为layerX和layerY，然后我们去查询getImageData()给我们提供的在那个位置的像数数组里面的像素数据。最后我们使用数组数据去设置背景颜色和\<div\>的文字去展示颜色值。

```javaScript

var img = new Image();
        img.src = './image/4.png';
        var canvas = document.querySelector('#myCanvas');
        var ctx = canvas.getContext('2d');
        img.onload = function(){
            ctx.drawImage(img,0,0);
            img.style.display = "none";
        }

        function pick (event){
            var x = event.layerX;
            var y = event.layerY;
            var pixel = ctx.getImageData(x,y,1,1);
            var data = pixel.data;
            var rgba = 'rgba(' + data[0] + ',' + data[1] +
             ',' + data[2] + ',' + (data[3] / 255) + ')';
            var colorDom = document.querySelector("#color");
            colorDom.innerHTML = rgba;
        }

        canvas.onclick = function(event){
            pick(event);
        }

```


## 在场景中写入像素数据

你可以用putImageData()方法去对场景进行像素数据的写入。

    ctx.putImageData(myImageData, dx, dy);

dx和dy参数表示你希望在场景内左上角绘制的像素数据所得到的设备坐标。

例如，为了在场景内左上角绘制myImageData代表的图片，你可以写如下的代码：

    ctx.putImageData(myImageData, 0, 0);

### 图片灰度和反相颜色

在这个例子里，我们遍历所有像素以改变他们的数值。然后我们将被修改的像素数组通过putImageData()放回到画布中去。invert函数仅仅是去减掉颜色的最大色值255.grayscale函数仅仅是用红绿和蓝的平均值。你也可以用加权平均，例如x = 0.299r + 0.587g + 0.114b这个公式。更多资料请参考维基百科的Grayscale。

```javaScript

var img = new Image();
img.src = './image/4.png';
img.onload = function() {
  draw(this);
};

function draw(img) {
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  img.style.display = 'none';
  var imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
  var data = imageData.data;
    
  var invert = function() {
    for (var i = 0; i < data.length; i += 4) {
      data[i]     = 225 - data[i];     // red
      data[i + 1] = 225 - data[i + 1]; // green
      data[i + 2] = 225 - data[i + 2]; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  var grayscale = function() {
    for (var i = 0; i < data.length; i += 4) {
      var avg = (data[i] + data[i +1] + data[i +2]) / 3;
      data[i]     = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    ctx.putImageData(imageData, 0, 0);
  };

  var invertbtn = document.getElementById('invertbtn');
  invertbtn.addEventListener('click', invert);
  var grayscalebtn = document.getElementById('grayscalebtn');
  grayscalebtn.addEventListener('click', grayscale);
}

```