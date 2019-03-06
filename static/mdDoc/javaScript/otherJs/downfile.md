# 将前台内容直接生成文件下载

一般来说，下载文件，都是要经过web服务器来实现。但是有些情况下，希望通过js直接将内存中的数据写入文件，然后进行下载。
那么接下的方法，则将演示如何实现该需求。

## 示例

```javascript
var binaryData = [0,0,1,1,1,0,0,0,1,1]; //普通数组
//要保存的数据是10个二进制位，但是一个字节是8位，so，需要16位,2个字节
var binLen = binaryData.length;
var byteLen = Math.ceil(binLen/8);
var buffer = new ArrayBuffer(byteLen ); // 开辟两个字节的缓冲区
var byteData = new Uint8Array(buffer);
for(var i=0; i<byteLen ; i++) { //开始转化为8进制
  byteData[i] = 0;
  for(var j=i*8,k=7; k>=0&&j<binLen; j++,k--) {
    byteData[i] |= binaryData[j] << k;  
    //用按位或运算，将8个二进制一组地组合到byteData中
  }
}
var data = new Blob([buffer],{type:"application/octet-stream"});
var downloadUrl = window.URL.createObjectURL(data);//返回一个DOMString ，包含一个唯一的blob链接（该链接协议为以blob:，后跟唯一标识浏览器中的对象的掩码）。
var anchor = document.createElement("a");
anchor.href = downloadUrl;
anchor.download = "二进制测试.bin";
anchor.click();
window.URL.revokeObjectURL(data); //销毁之前使用URL.createObjectURL()方法创建的URL实例。

```


## 关键点

### 1. bufferArray、Uint8Array

有关bufferArray 以及Uint8Array 在之前的[JavaScript 之 ArrayBuffer](./arrayBuffer.md)文章中已经涉及过，因此不再详解.

### 2. Blob

这是一个js用于存储大数据的一个对象。可以存储二进制数据，以及其他类型数据。在[Blob](./blob.md)文章中可以查看详细说明。

