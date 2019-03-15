# 忽视掉的知识

1. 页面导入样式时，使用link和@import有什么区别？

(1) link属于XHTML标签，除了加载CSS外，还能用于定义RSS, 定义rel连接属性等作用；而@import是CSS提供的，只能用于加载CSS;

(2) 页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载;

(3) import是CSS2.1 提出的，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题;

(4) link支持使用js控制DOM去改变样式，而@import不支持;


