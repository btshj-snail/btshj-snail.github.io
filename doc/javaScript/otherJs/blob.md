# Blob 对象
一个 Blob对象表示一个不可变的, 原始数据的类似文件对象。Blob表示的数据不一定是一个JavaScript原生格式。blob对象本质上是js中的一个对象，里面可以储存大量的二进制编码格式的数据。

## 创建blob对象

创建blob对象本质上和创建一个其他对象的方式是一样的，都是使用Blob() 的构造函数来进行创建。 构造函数接受两个参数：

第一个参数为一个数据序列，可以是任意格式的值。

第二个参数是一个包含两个属性的对象{ type: MIME的类型, endings: 决定第一个参数的数据格式，可以取值为 "transparent" 或者 "native"（transparent的话不变，是默认值，native 的话按操作系统转换） 。 }

Blob()构造函数允许使用其他对象创建一个Blob对象，比如用字符串构建一个blob

```javascript

var debug = {hello: "world"};
var blob = new Blob([JSON.stringify(debug, null, 2)],
  {type : 'application/json'});

```

既然是对象，那么blob也拥有自己的属性以及方法

**属性**

- Blob.isClosed (只读)

布尔值，指示 Blob.close() 是否在该对象上调用过。 关闭的 blob 对象不可读。

- Blob.size (只读)

Blob 对象中所包含数据的大小（字节）。

- Blob.type (只读)

一个字符串，表明该Blob对象所包含数据的MIME类型。如果类型未知，则该值为空字符串。

**方法**

- Blob.close()

关闭 Blob 对象，以便能释放底层资源。

- Blob.slice([start[, end[, contentType]]])

返回一个新的 Blob 对象，包含了源 Blob 对象中指定范围内的数据。其实就是对这个blob中的数据进行切割，我们在对文件进行分片上传的时候需要使用到这个方法。

看到上面这些方法和属性，使用过HTML5提供的File接口的应该都很熟悉，这些属性和方法在File接口中也都有。 其实File接口就是基于Blob，继承blob功能并将其扩展为支持用户系统上的文件，也就是说：

File接口中的Flie对象就是继承与Blob对象。

## blob对象的使用

上面说了很多关于Blob对象的一些概念性的东西，下面我们来看看实际用途。

### 分片上传

> 首先说说分片上传，我们在进行文件上传的时候，因为服务器的限制，会限制每一次上传到服务器的文件大小不会很大，这个时候我们就需要把一个需要上传的文件进行切割，然后分别进行上传到服务器。

假如需要做到这一步，我们需要解决两个问题:

- 怎么切割?
- 怎么得知当前传输的进度?

首先怎么切割的问题上面已经有过说明，因为File文件对象是继承与Blob对象的，因此File文件对象也拥有slice这个方法，我们可以使用这个方法将任何一个File文件进行切割。

```javascript

var BYTES_PER_CHUNK = 1024 * 1024; // 每个文件切片大小定为1MB .
var blob = document.getElementById("file").files[0];
var slices = Math.ceil(blob.size / BYTES_PER_CHUNK);
var blobs = [];
for(var i=0,l=slices;i<l;i++)
    blobs.push(blob.slice(i*BYTES_PER_CHUNK,(i + 1)*BYTES_PER_CHUNK);
});

```

通过上面的方法。我们就得到了一个切割之后的File对象组成的数组blobs；

接下来要做的时候就是将这些文件分别上传到服务器。

在HTTP1.1以上的协议中，有Transfer-Encoding这个编码协议，用以和服务器通信，来得知当前分片传递的文件进程。

这样解决了这两个问题，我们不仅可以对文件进行分片上传，并且能够得到文件上传的进度。

### 粘贴图片

blob还有一个应用场景，就是获取剪切板上的数据来进行粘贴的操作。例如通过QQ截图后，需要在网页上进行粘贴操作。

粘贴图片我们需要解决下面几个问题

- 监听用户的粘贴操作

- 获取到剪切板上的数据

- 将获取到的数据渲染到网页中

首先我们可以通过paste事件来监听用户的粘贴操作:

```javascript

document.addEventListener('paste', function (e) {
    console.info(e);
});

```

然后通过事件对象中的clipboardData 对象来获取图片的文件数据。

#### clipboardData对象介绍

介绍一下 clipboardData 对象，它实际上是一个 DataTransfer 类型的对象， DataTransfer 是拖动产生的一个对象，但实际上粘贴事件也是它。

##### clipboardData 的属性介绍

属性|类型|说明
:--|:--|:--|
dropEffect|	String|	默认是 none
effectAllowed|	String|	默认是 uninitialized
files|	FileList|	粘贴操作为空List
items|	DataTransferItemList|	剪切板中的各项数据
types|	Array|	剪切板中的数据类型| 该属性在Safari下比较混乱

##### items 介绍

items 是一个 DataTransferItemList 对象，自然里面都是 DataTransferItem 类型的数据了。

**属性**

items 的 DataTransferItem 有两个属性 kind 和 type

属性|说明
:--|:--|
kind|一般为 string 或者 file
type|具体的数据类型，例如具体是哪种类型字符串或者哪种类型的文件，即 MIME-Type

**方法**

方法	参数	说明
:--|:--|:--|
getAsFile|空|如果 kind 是 file ，可以用该方法获取到文件
getAsString|function(str)|如果 kind 是 string ，可以用该方法获取到字符串str

在原型上还有一些其他方法，不过在处理剪切板操作的时候一般用不到了。

**type 介绍**

一般 types 中常见的值有 text/plain 、 text/html 、 Files 。

值|说明
:--|:--|
text/plain|普通字符串
text/html|带有样式的html
Files|文件(例如剪切板中的数据)

有了上面这些方法，我们可以解决第二个问题即获取到剪切板上的数据。

```javascript

document.addEventListener('paste', function (e) {
    console.info(e);
    var cbd = e.clipboardData;
    for(var i = 0; i < cbd.items.length; i++) {
        var item = cbd.items[i];
        console.info(item);
        if(item.kind == "file"){
            var blob = item.getAsFile();
            if (blob.size === 0) {
                return;
            }
            console.info(blob);
        }
    }
});

```

最后我们需要将获取到的数据渲染到网页上。

其实这个本质上就是一个类似于上传图片本地浏览的问题。我们可以直接通过HTML5的File接口将获取到的文件上传到服务器然后通过将服务器返回的url地址来对图片进行渲染。也可以使用fileReader对象来进行图片本地浏览。

#### fileReader对象简介

从Blob中读取内容的唯一方法是使用 FileReader。

FileReader接口有4个方法，其中3个用来读取文件，另一个用来中断读取。无论读取成功或失败，方法并不会返回读取结果，这一结果存储在result属性中。

方法名|参数|描述
:--|:--|:--|
readAsBinaryString|file|将文件读取为二进制编码
readAsText|file,[encoding]|将文件读取为文本
readAsDataURL|file|将文件读取为DataURL
abort|(none)|终端读取操作

FileReader接口包含了一套完整的事件模型，用于捕获读取文件时的状态。

事件|描述
:--|:--|
onabort|中断
onerror|出错
onloadstart|开始
onprogress|正在读取
onload|成功读取
onloadend|读取完成，无论成功失败

通过上面的方法以及事件，我们可以发现，通过readAsDataURL方法及onload事件就可以拿到一个可本地浏览图片的DataURL。

最终代码如下：

```javascript

document.addEventListener('paste', function (e) {
    console.info(e);
    var cbd = e.clipboardData;
        var fr = new FileReader();
        var html = '';
        for(var i = 0; i < cbd.items.length; i++) {
            var item = cbd.items[i];
            console.info(item);
            if(item.kind == "file"){
                var blob = item.getAsFile();
                if (blob.size === 0) {
                    return;
                }
                console.info(blob);
                fr.readAsDataURL(blob);
                fr.onload=function(e){
                    var result=document.getElementById("result");
                    //显示文件
                    result.innerHTML='<img src="' + this.result +'" alt="" />';
                }
            }
        }
});

```
