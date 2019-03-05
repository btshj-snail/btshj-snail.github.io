# JavaScript 之 ArrayBuffer

## JS里的ArrayBuffer

首先，这个 ArrayBuffer 类型化数组，类型化数组是JavaScript操作二进制数据的一个接口。
最初为了满足JavaScript与显卡之间大量的、实时的数据交换，它们之间的数据通信必须是二进制的，而不能是传统的文本格式的背景下诞生的。

## 分配内存

类型化数组是建立在ArrayBuffer对象的基础上的。它的作用是，分配一段可以存放数据的连续内存区域。

```javascript
var bf = new ArrayBuffer(40); // 生成了字节长度为40的内存区域
//通过提供的 byteLength 属性返回分配字节的长度
console.log(bf.byteLength);  // 40
/*
    值得注意的是如果要分配的内存区域很大，有可能分配失败（因为没有那么多的连续空余内存），所以有必要检查是否分配成功。
*/
```

ArrayBuffer对象有一个slice方法，允许将内存区域的一部分，拷贝生成一个新的ArrayBuffer对象。

```javascript
const bf = new ArrayBuffer(40);
const newBf = bf.slice(0, 10); // 从0 - 9 不包括 10
```

> - 上面代码拷贝buffer对象的前10个字节，生成一个新的ArrayBuffer对象。slice方法其实包含两步，第一步是先分配一段新内存，第二步是将原来那个ArrayBuffer对象拷贝过去。

  - slice方法接受两个参数，第一个参数表示拷贝开始的字节序号，第二个参数表示拷贝截止的字节序号。如果省略第二个参数，则默认到原ArrayBuffer对象的结尾。

  - 除了slice方法，ArrayBuffer对象不提供任何直接读写内存的方法，只允许在其上方建立视图，然后通过视图读写。

## 视图的生成

ArrayBuffer作为内存区域，可以存放多种类型的数据。不同数据有不同的存储方式，这就叫做“视图”。目前，JavaScript提供以下类型的视图：

> Int8Array：8位有符号整数，长度1个字节。
> Uint8Array：8位无符号整数，长度1个字节。
> Int16Array：16位有符号整数，长度2个字节。
> Uint16Array：16位无符号整数，长度2个字节。
> Int32Array：32位有符号整数，长度4个字节。
> Uint32Array：32位无符号整数，长度4个字节。
> Float32Array：32位浮点数，长度4个字节。
> Float64Array：64位浮点数，长度8个字节。

每一种视图都有一个BYTES_PER_ELEMENT常数，表示这种数据类型占据的字节数。

```javascript

Int8Array.BYTES_PER_ELEMENT  // 1
Uint8Array.BYTES_PER_ELEMENT // 1
//...

```

每一种视图都是一个构造函数，有多种方法可以生成：

```javascript

    // 浏览器控制台输出：
    > Int32Array
    > function Int32Array() { [native code] }

```

### 01 在ArrayBuffer对象之上生成视图

同一个ArrayBuffer对象之上，可以根据不同的数据类型，建立多个视图。

```javascript

// 创建一个8字节的ArrayBuffer
var b = new ArrayBuffer(8);

// 创建一个指向b的Int32视图，开始于字节0，直到缓冲区的末尾
var v1 = new Int32Array(b);

// 创建一个指向b的Uint8视图，开始于字节2，直到缓冲区的末尾
var v2 = new Uint8Array(b, 2);

// 创建一个指向b的Int16视图，开始于字节2，长度为2
var v3 = new Int16Array(b, 2, 2);

```

上面代码在一段长度为8个字节的内存（b）之上，生成了三个视图：v1、v2和v3。视图的构造函数可以接受三个参数：

第一个参数：视图对应的底层ArrayBuffer对象，该参数是必需的。

第二个参数：视图开始的字节序号，默认从0开始。

第三个参数：视图包含的数据个数，默认直到本段内存区域结束。

值得注意的是：v1、v2和v3是重叠：v1\[0\]是一个32位整数，指向字节0～字节3；v2\[0\]一个8位无符号整数，指向字节2；v3\[0\]是一个16位整数，指向字节2～字节3。
只要任何一个视图对内存有所修改，就会在另外两个视图上反应出来。

### 02 直接生成

视图还可以不通过ArrayBuffer对象，直接分配内存而生成。

```javascript

var f64a = new Float64Array(8);
f64a[0] = 10;
f64a[1] = 20;
f64a[2] = f64a[0] + f64a[1];

```
上面代码生成一个8个成员的Float64Array数组（共64字节），然后依次对每个成员赋值。这时，视图构造函数的参数就是成员的个数。
可以看到，视图数组的赋值操作与普通数组的操作毫无两样。

### 03 将普通数组转为视图数组

    var typedArray = new Uint8Array( [ 1, 2, 3, 4 ] );

也可以将视图直接转化为数组

    Array.from(typeArray); 
    // Array.apply([],typeArray);
    
### 04 视图的操作

建立了视图以后，就可以进行各种操作了。这里需要明确的是，视图其实就是普通数组，语法完全没有什么不同，只不过它直接针对内存进行操作，而且每个成员都有确定的数据类型。
所以，视图就被叫做“类型化数组”

普通数组的操作方法和属性，对类型化数组完全适用。

```javascript

var buffer = new ArrayBuffer(16);

var int32View = new Int32Array(buffer);

for (var i=0; i<int32View.length; i++) {
  int32View[i] = i*2;
}

```

### 05 buffer属性

类型化数组的buffer属性，返回整段内存区域对应的ArrayBuffer对象。该属性为只读属性。

```javascript

var bf = new Uint8Array([1,2,3,4]);
bf.buffer;  // ArrayBuffer {}

```

byteLength属性和byteOffset属性

byteLength属性返回类型化数组占据的内存长度，单位为字节。byteOffset属性返回类型化数组从底层ArrayBuffer对象的哪个字节开始。这两个属性都是只读属性。

```javascript

var b = new ArrayBuffer(8);

var v1 = new Int32Array(b);
var v2 = new Uint8Array(b, 2);
var v3 = new Int16Array(b, 2, 2);

v1.byteLength // 8
v2.byteLength // 6
v3.byteLength // 4

v1.byteOffset // 0
v2.byteOffset // 2
v3.byteOffset; // 2

```
注意将byteLength属性和length属性区分，前者是字节长度，后者是成员长度。

### 06 set方法

类型化数组的set方法用于复制数组，也就是将一段内容完全复制到另一段内存。

```javascript

var a = new Uint8Array(8);
var b = new Uint8Array(8);

b.set(a);
```

上面代码复制a数组的内容到b数组，它是整段内存的复制，比一个个拷贝成员的那种复制快得多。set方法还可以接受第二个参数，表示从b对象哪一个成员开始复制a对象。

```javascript
var a = new Uint16Array(8);
var b = new Uint16Array(10);

b.set(a,2)
```
上面代码的b数组比a数组多两个成员，所以从b[2]开始复制。

### 07 subarray方法

subarray方法是对于类型化数组的一部分，再建立一个新的视图。

```javascript

var a = new Uint16Array(8);
var b = a.subarray(2,3);

a.byteLength // 16
b.byteLength // 2

```

subarray方法的第一个参数是起始的成员序号，第二个参数是结束的成员序号（不含该成员），如果省略则包含剩余的全部成员。所以，上面代码的a.subarray(2,3)，
意味着b只包含a\[2\]一个成员，字节长度为2。

### 08 ArrayBuffer与字符串的互相转换

ArrayBuffer转为字符串，或者字符串转为ArrayBuffer，有一个前提，即字符串的编码方法是确定的。
假定字符串采用UTF-16编码（JavaScript的内部编码方式），可以自己编写转换函数。

```javascript

// ArrayBuffer转为字符串，参数为ArrayBuffer对象
function ab2str(buf) {
   return String.fromCharCode.apply(null, new Uint16Array(buf));
}

// 字符串转为ArrayBuffer对象，参数为字符串
function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 每个字符占用2个字节
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
         bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

```
## 复合视图

由于视图的构造函数可以指定起始位置和长度，所以在同一段内存之中，可以依次存放不同类型的数据，这叫做“复合视图”。

```javascript

var buffer = new ArrayBuffer(24);

var idView = new Uint32Array(buffer, 0, 1);
var usernameView = new Uint8Array(buffer, 4, 16);
var amountDueView = new Float32Array(buffer, 20, 1);

```

上面代码将一个24字节长度的ArrayBuffer对象，分成三个部分：

> 字节0到字节3：1个32位无符号整数
> 字节4到字节19：16个8位整数
> 字节20到字节23：1个32位浮点数

## DataView视图

如果一段数据包括多种类型（比如服务器传来的HTTP数据），这时除了建立ArrayBuffer对象的复合视图以外，还可以通过DataView视图进行操作。

DataView视图提供更多操作选项，而且支持设定字节序。本来，在设计目的上，ArrayBuffer对象的各种类型化视图，是用来向网卡、声卡之类的本机设备传送数据，
所以使用本机的字节序就可以了；而DataView的设计目的，是用来处理网络设备传来的数据，所以大端字节序或小端字节序是可以自行设定的。

DataView本身也是构造函数，接受一个ArrayBuffer对象作为参数，生成视图。

DataView(ArrayBuffer buffer \[, 字节起始位置 \[, 长度\]\]);

```javascript

var buffer = new ArrayBuffer(24);

var dv = new DataView(buffer);

```

DataView视图提供以下方法读取内存：

- getInt8：读取1个字节，返回一个8位整数。

- getUint8：读取1个字节，返回一个无符号的8位整数。

- getInt16：读取2个字节，返回一个16位整数。

- getUint16：读取2个字节，返回一个无符号的16位整数。

- getInt32：读取4个字节，返回一个32位整数。

- getUint32：读取4个字节，返回一个无符号的32位整数。

- getFloat32：读取4个字节，返回一个32位浮点数。

- getFloat64：读取8个字节，返回一个64位浮点数。

这一系列get方法的参数都是一个字节序号，表示从哪个字节开始读取。

```javascript

var buffer = new ArrayBuffer(24);
var dv = new DataView(buffer);

// 从第1个字节读取一个8位无符号整数
var v1 = dv.getUint8(0);

// 从第2个字节读取一个16位无符号整数
var v2 = dv.getUint16(1); 

// 从第4个字节读取一个16位无符号整数
var v3 = dv.getUint16(3);
```

上面代码读取了ArrayBuffer对象的前5个字节，其中有一个8位整数和两个十六位整数。

如果一次读取两个或两个以上字节，就必须明确数据的存储方式，到底是小端字节序还是大端字节序。
默认情况下，DataView的get方法使用大端字节序解读数据，如果需要使用小端字节序解读，必须在get方法的第二个参数指定true。

```javascript
// 小端字节序
var v1 = dv.getUint16(1, true);

// 大端字节序
var v2 = dv.getUint16(3, false);

// 大端字节序
var v3 = dv.getUint16(3);

```

DataView视图提供以下方法写入内存：

- setInt8：写入1个字节的8位整数。
- setUint8：写入1个字节的8位无符号整数。
- setInt16：写入2个字节的16位整数。
- setUint16：写入2个字节的16位无符号整数。
- setInt32：写入4个字节的32位整数。
- setUint32：写入4个字节的32位无符号整数。
- setFloat32：写入4个字节的32位浮点数。
- setFloat64：写入8个字节的64位浮点数。

这一系列set方法，接受两个参数，第一个参数是字节序号，表示从哪个字节开始写入，第二个参数为写入的数据。
对于那些写入两个或两个以上字节的方法，需要指定第三个参数，false或者undefined表示使用大端字节序写入，true表示使用小端字节序写入。

```javascript

// 在第1个字节，以大端字节序写入值为25的32位整数
dv.setInt32(0, 25, false); 

// 在第5个字节，以大端字节序写入值为25的32位整数
dv.setInt32(4, 25); 

// 在第9个字节，以小端字节序写入值为2.5的32位浮点数
dv.setFloat32(8, 2.5, true);

```

如果不确定正在使用的计算机的字节序，可以采用下面的判断方式。

```javascript
var littleEndian = (function() {
  var buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
})();
```
如果返回true，就是小端字节序；如果返回false，就是大端字节序。

## 应用

### Ajax

传统上，服务器通过Ajax操作只能返回文本数据。XMLHttpRequest 第二版允许服务器返回二进制数据，这时分成两种情况。
如果明确知道返回的二进制数据类型，可以把返回类型（responseType）设为arraybuffer；如果不知道，就设为blob。

xhr.responseType = 'arraybuffer';

如果知道传回来的是32位整数，可以像下面这样处理。

```javascript

xhr.onreadystatechange = function () {
if (req.readyState === 4 ) {
    var arrayResponse = xhr.response;
    var dataView = new DataView(arrayResponse);
    var ints = new Uint32Array(dataView.byteLength / 4);
    xhrDiv.style.backgroundColor = "#00FF00";
    xhrDiv.innerText = "Array is " + ints.length + "uints long";
    }
}

```
### Canvas

网页Canvas元素输出的二进制像素数据，就是类型化数组。

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

var imageData = ctx.getImageData(0,0, 200, 100);
var typedArray = imageData.data;

需要注意的是，上面代码的typedArray虽然是一个类型化数组，但是它的视图类型是一种针对Canvas元素的专有类型Uint8ClampedArray。
这个视图类型的特点，就是专门针对颜色，把每个字节解读为无符号的8位整数，即只能取值0～255，而且发生运算的时候自动过滤高位溢出。这为图像处理带来了巨大的方便。

举例来说，如果把像素的颜色值设为Uint8Array类型，那么乘以一个gamma值的时候，就必须这样计算：

```javascript

u8[i] = Math.min(255, Math.max(0, u8[i] * gamma));

```

因为Uint8Array类型对于大于255的运算结果（比如0xFF+1），会自动变为0x00，所以图像处理必须要像上面这样算。
这样做很麻烦，而且影响性能。如果将颜色值设为Uint8ClampedArray类型，计算就简化许多。

```javascript

pixels[i] *= gamma;

```
Uint8ClampedArray类型确保将小于0的值设为0，将大于255的值设为255。注意，IE 10不支持该类型。

### File

如果知道一个文件的二进制数据类型，也可以将这个文件读取为类型化数组。

reader.readAsArrayBuffer(file);

下面以处理bmp文件为例。假定file变量是一个指向bmp文件的文件对象，首先读取文件。

```javascript

var reader = new FileReader();
reader.addEventListener("load", processimage, false); 
reader.readAsArrayBuffer(file);

```

然后，定义处理图像的回调函数：先在二进制数据之上建立一个DataView视图，再建立一个bitmap对象，用于存放处理后的数据，最后将图像展示在canvas元素之中。

```javascript

function processimage(e) { 
 var buffer = e.target.result; 
 var datav = new DataView(buffer); 
 var bitmap = {};
 // 具体的处理步骤
}

```
具体处理图像数据时，先处理bmp的文件头。具体每个文件头的格式和定义，请参阅有关资料。

```javascript
bitmap.fileheader = {}; 
bitmap.fileheader.bfType = datav.getUint16(0, true); 
bitmap.fileheader.bfSize = datav.getUint32(2, true); 
bitmap.fileheader.bfReserved1 = datav.getUint16(6, true); 
bitmap.fileheader.bfReserved2 = datav.getUint16(8, true); 
bitmap.fileheader.bfOffBits = datav.getUint32(10, true);

```
接着处理图像元信息部分。

```javascript
bitmap.infoheader = {};
bitmap.infoheader.biSize = datav.getUint32(14, true);
bitmap.infoheader.biWidth = datav.getUint32(18, true); 
bitmap.infoheader.biHeight = datav.getUint32(22, true); 
bitmap.infoheader.biPlanes = datav.getUint16(26, true); 
bitmap.infoheader.biBitCount = datav.getUint16(28, true); 
bitmap.infoheader.biCompression = datav.getUint32(30, true); 
bitmap.infoheader.biSizeImage = datav.getUint32(34, true); 
bitmap.infoheader.biXPelsPerMeter = datav.getUint32(38, true); 
bitmap.infoheader.biYPelsPerMeter = datav.getUint32(42, true); 
bitmap.infoheader.biClrUsed = datav.getUint32(46, true); 
bitmap.infoheader.biClrImportant = datav.getUint32(50, true);

```
最后处理图像本身的像素信息。

```javascript
var start = bitmap.fileheader.bfOffBits;
bitmap.pixels = new Uint8Array(buffer, start);
```

至此，图像文件的数据全部处理完成。下一步，可以根据需要，进行图像变形，或者转换格式，或者展示在Canvas网页元素之中。