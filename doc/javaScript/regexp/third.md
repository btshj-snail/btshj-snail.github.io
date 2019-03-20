# 正则表达式括号的作用

不管哪门语言中都有括号。正则表达式也是一门语言，而括号的存在使这门语言更为强大。
对括号的使用是否得心应手，是衡量对正则的掌握水平的一个侧面标准。
括号的作用，其实三言两语就能说明白，括号提供了分组，便于我们引用它。
引用某个分组，会有两种情形：在JavaScript里引用它，在正则表达式里引用它。
内容包括：

- 分组和分支结构
- 捕获分组
- 反向引用
- 非捕获分组
- 相关案例

## 1. 分组和分支结构

这二者是括号最直觉的作用，也是最原始的功能。

### 1.1 分组

我们知道 `/a+/` 匹配连续出现的“a”，而要匹配连续出现的“ab”时，需要使用 `/(ab)+/` 。

其中括号是提供分组功能，使量词+作用于“ab”这个整体，测试如下：

```javaScript

var regex = /(ab)+/g;
var string = "ababa abbb ababab";
console.log( string.match(regex) ); 
// => ["abab", "ab", "ababab"]

```

### 1.2 分支结构

而在多选分支结构(p1|p2)中，此处括号的作用也是不言而喻的，提供了子表达式的所有可能。

比如，要匹配如下的字符串：

> - I love JavaScript
- I love Regular Expression

```javaScript

var regex = /^I love (JavaScript|Regular Expression)$/;
console.log( regex.test("I love JavaScript") );
console.log( regex.test("I love Regular Expression") );
// => true
// => true

```

如果去掉正则中的括号，即 `/^I love JavaScript|Regular Expression$/` ，匹配字符串是"I love JavaScript"和"Regular Expression"，当然这不是我们想要的。

## 2. 引用分组

这是括号一个重要的作用，有了它，我们就可以进行数据提取，以及更强大的替换操作。
而要使用它带来的好处，必须配合使用实现环境的API。
以日期为例。假设格式是yyyy-mm-dd的，我们可以先写一个简单的正则：

```javaScript

var regex = /\d{4}-\d{2}-\d{2}/;

```

然后再修改成括号版的：

```javaScript

var regex = /(\d{4})-(\d{2})-(\d{2})/;

```
### 2.1 提取数据

比如提取出年、月、日，可以这么做：

```javaScript

var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
console.log( string.match(regex) ); 
// => ["2017-06-12", "2017", "06", "12", index: 0, input: "2017-06-12"]

```
match返回的一个数组，第一个元素是整体匹配结果，然后是各个分组（括号里）匹配的内容，然后是匹配下标，最后是输入的文本。（注意：如果正则是否有修饰符g，match返回的数组格式是不一样的）。


同时，也可以使用构造函数的全局属性$1至$9来获取：

```javaScript

var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";

regex.test(string); // 正则操作即可，例如
//regex.exec(string);
//string.match(regex);

console.log(RegExp.$1); // "2017"
console.log(RegExp.$2); // "06"
console.log(RegExp.$3); // "12"


```

### 2.2 替换

比如，想把yyyy-mm-dd格式，替换成mm/dd/yyyy怎么做？

```javaScript

var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, "$2/$3/$1");
console.log(result); 
// => "06/12/2017"

```
其中replace中的，第二个参数里用$1、$2、$3指代相应的分组。等价于如下的形式：

```javaScript

var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, function() {
	return RegExp.$2 + "/" + RegExp.$3 + "/" + RegExp.$1;
});
console.log(result); 
// => "06/12/2017"

```

也等价于：

```javaScript

var regex = /(\d{4})-(\d{2})-(\d{2})/;
var string = "2017-06-12";
var result = string.replace(regex, function(match, year, month, day) {
	return month + "/" + day + "/" + year;
});
console.log(result); 
// => "06/12/2017"

```

## 3.反向引用

除了使用相应API来引用分组，也可以在正则本身里引用分组。但只能引用之前出现的分组，即反向引用。
还是以日期为例。
比如要写一个正则支持匹配如下三种格式：

> - 2016-06-12
- 2016/06/12
- 2016.06.12

最先可能想到的正则是:

```javaScript

var regex = /\d{4}(-|\/|\.)\d{2}(-|\/|\.)\d{2}/;
var string1 = "2017-06-12";
var string2 = "2017/06/12";
var string3 = "2017.06.12";
var string4 = "2016-06/12";
console.log( regex.test(string1) ); // true
console.log( regex.test(string2) ); // true
console.log( regex.test(string3) ); // true
console.log( regex.test(string4) ); // true

```

其中/和.需要转义。虽然匹配了要求的情况，但也匹配"2016-06/12"这样的数据。

假设我们想要求分割符前后一致怎么办？此时需要使用反向引用：

```javaScript

var regex = /\d{4}(-|\/|\.)\d{2}\1\d{2}/;
var string1 = "2017-06-12";
var string2 = "2017/06/12";
var string3 = "2017.06.12";
var string4 = "2016-06/12";
console.log( regex.test(string1) ); // true
console.log( regex.test(string2) ); // true
console.log( regex.test(string3) ); // true
console.log( regex.test(string4) ); // false


```
注意里面的 `\1`，表示的引用之前的那个分组 `(-|\/|\.)`。不管它匹配到什么（比如-），\1都匹配那个同样的具体某个字符。

我们知道了\1的含义后，那么\2和\3的概念也就理解了，即分别指代第二个和第三个分组。

看到这里，此时，恐怕你会有三个问题。

### 3.1 括号嵌套怎么办？

以左括号（开括号）为准,从左向右左括号的序列即是分组的序列。比如：

```javaScript

var regex = /^((\d)(\d(\d)))\1\2\3\4$/;
var string = "1231231233";
console.log( regex.test(string) ); // true
console.log( RegExp.$1 ); // 123
console.log( RegExp.$2 ); // 1
console.log( RegExp.$3 ); // 23
console.log( RegExp.$4 ); // 3


```

我们可以看看这个正则匹配模式：

第一个字符是数字，比如说1，第二个字符是数字，比如说2，第三个字符是数字，比如说3，接下来的是\1，是第一个分组内容，那么看第一个开括号对应的分组是什么，是123，接下来的是\2，找到第2个开括号，对应的分组，匹配的内容是1，接下来的是

### 3.2 \10表示什么呢？

另外一个疑问可能是，即\10是表示第10个分组，还是\1和0呢？

答案是前者，虽然一个正则里出现\10比较罕见。测试如下：

```javaScript

var regex = /(1)(2)(3)(4)(5)(6)(7)(8)(9)(#) \10+/;
var string = "123456789# ######"
console.log( regex.test(string) );
// => true

```

### 3.3 引用不存在的分组会怎样？

因为反向引用，是引用前面的分组，但我们在正则里引用了不存在的分组时，此时正则不会报错，只是匹配反向引用的字符本身。例如\2，就匹配"\2"。注意"\2"表示对"2"进行了转意。

```javaScript

var regex = /\1\2\3\4\5\6\7\8\9/;
console.log( regex.test("\1\2\3\4\5\6\7\8\9") ); 
console.log( "\1\2\3\4\5\6\7\8\9".split("") );

```

## 4.非捕获分组

之前文中出现的分组，都会捕获它们匹配到的数据，以便后续引用，因此也称他们是捕获型分组。

如果只想要括号最原始的功能，但不会引用它，即，既不在API里引用，也不在正则里反向引用。此时可以使用非捕获分组(?:p)，例如本文第一个例子可以修改为：

```javaScript

var regex = /(?:ab)+/g;
var string = "ababa abbb ababab";
console.log( string.match(regex) ); 
// => ["abab", "ab", "ababab"]

```

## 5. 相关案例

### 5.1 字符串trim方法模拟

`trim` 方法是去掉字符串的开头和结尾的空白符。有两种思路去做。


第一种，匹配到开头和结尾的空白符，然后替换成空字符。如：

```javaScript

function trim(str){
    return str.replace(/^\s+|\s+$/g,'');
}
console.log( trim("  foobar   ") ); 
// => "foobar"
```
第二种，匹配整个字符串，然后用引用来提取出相应的数据：

```javaScript

function trim(str){
    return str.replace(/^\s+(.*?)\s+$/g,'$1');
}
console.log( trim("  foobar   ") ); 
// => "foobar"
```

这里使用了惰性匹配*?，不然也会匹配最后一个空格之前的所有空格的。

当然，前者效率高。

### 5.2 将每个单词的首字母转换为大写

```javaScript

function firstLetter2UpperCase(str){
    return str.replace(/(^|\s)\w/g,function(match){
        return match.toUpperCase();
    })
}
firstLetter2UpperCase('this a tom ')
```


### 5.3 驼峰化

```javaScript

function camelize(str){
    return str.replace(/[-\s_]+(.)?/g,function(match,c){
        return c ? c.toUpperCase() : '';
    })
}
camelize('-this-a tom ')
```

### 5.4 中划线化

```javaScript

function dasherize(str){
    return str.replace(/[A-Z]/g,function(match){
        return "-"+match.toLowerCase();
    })
}

dasherize('ThisATom');

```

### 5.5 匹配成对标签

```javaScript

/<([^>]).*?>[\d\D]*?<\/\1>/.test('<a id="a" class="a"></a>')

```

---

本文来自 JS正则表达式完整教程（略长）[https://juejin.im/post/5965943ff265da6c30653879]