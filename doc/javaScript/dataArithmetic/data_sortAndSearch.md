# 排序和搜索算法

假设我们有一个没有任何排列顺序的电话号码表（或号码簿）。当需要添加联络人和电话时，你只能将其写在下一个空位上。假定你的联系人列表上有很多人，某天，你要找某个联系人及其电话号码。但是由于联系人列表没有按照任何顺序来组织，你只能逐个检查，直到找到那个你想要的联系人为止。这个方法太吓人了，难道你不这么认为？想象一下你要在黄页上搜寻一个联系人，但是那本黄页没有进行任何组织，那得花多久时间啊？！

因此（还有其他原因），我们需要组织信息集，比如那些存储在数据结构里的信息。排序和搜索算法广泛地运用在待解决的日常问题中。

本章，你会学到最常用的排序和搜索算法，如冒泡排序、选择排序、插入排序、归并排序、快速排序和堆排序，以及顺序搜索和二分搜索算法。

## 排序算法

从上面的引言中，你应该理解，对给定信息得先排序再搜索。

本节会介绍一些在计算机科学中最著名的排序算法。我们会从最慢的一个开始，接着是一些性能较好的算法。在开始排序算法之前，我们先创建一个数组（列表）来表示待排序和搜索的数据结构。

```javaScript

function ArrayList(){
    let array = [];
    this.insert = function(item){
        array.push(item);
    }
    this.toString = function(){
        return array.join();
    }
}

```

如你所见，ArrayList是一个简单的数据结构，它将项存储在数组中。我们只需要一个插入方法来向数据结构中添加元素，Array类原生的push方法即可。最后，为了帮助我们验证结果，toString方法使用JavaScript原生Array类的join方法，来拼接数组中的所有元素至一个单一的字符串，这样我们就可以轻松地在浏览器的控制台输出结果了。

join方法拼接数组元素至一个字符串，并返回该字符串。注意ArrayList类并没有任何方法来移除数据或插入数据到特定位置。我们刻意保持简单是为了能够专注于排序和搜索算法。所有的排序和搜索算法会添加至这个类中。

### 冒泡排序

学习排序算法时，通常都先学冒泡算法，因为它在所有排序算法中最简单。然而，从运行时间的角度来看，冒泡排序是最差的一个，接下来你会知晓原因。

冒泡排序比较任何两个相邻的项，如果第一个比第二个大，则交换它们。元素项向上移动至正确的顺序，就好像气泡升至表面一样，冒泡排序因此得名。让我们来实现一下冒泡排序：

```javaScript

function ArrayList(){
    let array = [];
    let swap = function(array,index1,index2){
         let aux = array[index1];
         array[index1] = array[index2];
         array[index2] = aux;
         //es6
        // [array[index2],array[index1]] = [array[index1],array[index2]]
    }
    this.insert = function(item){
        array.push(item);
    }

    this.insertAry = function(ary){
        array.push.apply(array,ary);
    }

    this.toString = function(){
        return array.join();
    }
    this.bubbleSort = function(){
        for(let i=0,l=array.length;i<l;i++){
            for(let j=0,k=array.length-1;j<k;j++){
                if(array[j]>array[j+1]){
                    let aux = array[j];
                    array[j] = array[j+1];
                    array[j+1] = aux;
                }
            }
        }
    }
}


```

为了方便建立无序数组，我们可以定义以下方法：

```javaScript

function getRandomNumber(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getNoRepeatAryByLength(length,min,max){
    let ary = [];
    for(let i=0;i<length;i++){
        let randomNum = null;
        while(randomNum===null && ary.findIndex(item=>item===randomNum)!==-1){
            randomNum = getRandomNumber(min,max);
        }
        ary.push(randomNum);
        
    }
    return ary;
}

```

先调用getNoRepeatAryByLength(10,1,100),然后利用ArrayList的insertAry方法，将生成的数组写入到ArrayList中。综合起来，代码如下：

```javaScript

function getRandomNumber(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

function getNoRepeatAryByLength(length,min,max){
    let ary = [];
    for(let i=0;i<length;i++){
        let randomNum = null;
        while(randomNum===null && ary.findIndex(item=>item===randomNum)!==-1){
            randomNum = getRandomNumber(min,max);
        }
        ary.push(randomNum);
        
    }
    return ary;
}

function ArrayList(){
    let array = [];
    let swap = function(array,index1,index2){
         let aux = array[index1];
         array[index1] = array[index2];
         array[index2] = aux;
         //es6
        // [array[index2],array[index1]] = [array[index1],array[index2]]
    }
    this.insert = function(item){
        array.push(item);
    }

    this.insertAry = function(ary){
        array.push.apply(array,ary);
    }

    this.toString = function(){
        return array.join();
    }
    this.bubbleSort = function(){
        for(let i=0,l=array.length;i<l;i++){
            for(let j=0,k=array.length-1;j<k;j++){
                if(array[j]>array[j+1]){
                   swap(array,array[j],array[j+1]);
                }
            }
        }
    }
}

let al = new ArrayList();
let data = getNoRepeatAryByLength(10,1,100);
al.insertAry(data);
al.bubbleSort();
console.log(al.toString());

```

注意当内循环完成的时候，最大值已经就位了。也就是算法执行外循环的第二轮的时候，最大值已经是正确排序的了。尽管如此，在后续比较中，它们还一直在进行着比较，即使这是不必要的。因此，我们可以稍稍改进一下冒泡排序算法。

### 改进后的冒泡排序

如果从内循环减去外循环中已跑过的轮数，就可以避免内循环中所有不必要的比较。

```javaScript

function ArrayList(){
    let array = [];

    let swap = function(index1,index2){
         let aux = array[index1];
         array[index1] = array[index2];
         array[index2] = aux;
         //es6
        // [array[index2],array[index1]] = [array[index1],array[index2]]
    }
    this.insert = function(item){
        array.push(item);
    }

    this.insertAry = function(ary){
        array.push.apply(array,ary);
    }

    this.toString = function(){
        return array.join();
    }
    this.bubbleSort = function(){
        for(let i=0,l=array.length;i<l;i++){
            for(let j=0,k=array.length-1;j<k;j++){
                if(array[j]>array[j+1]){
                    swap(j,j+1);
                }
            }
        }
    }
    this.modifiedBubbleSort = function(){
        for(let i=0,l=array.length;i<l;i++){
            for(let j=0,k=array.length-1-i;j<k;j++){
                if(array[j]>array[j+1]){
                    swap(j,j+1);
                }
            }
        }
    }
}

```
注意已经在正确位置上的数字没有被比较。即便我们做了这个小改变，改进了一下冒泡排序算法，但我们还是不推荐该算法，它的复杂度是O(n2)。

### 选择排序

选择排序算法是一种原址比较排序算法。选择排序大致的思路是找到数据结构中的最小值并将其放置在第一位，接着找到第二小的值并将其放在第二位，以此类推。下面是选择排序算法的源代码：

```javaScript

this.selectionSort = function(){
    let indexMin ;
    for(let i=0,l=array.length;i<l;i++){
        indexMin = i;
        for(let j=i,k=array.length;j<k;j++){
            if(array[indexMin]>array[j]){
                indexMin = j;
            }
        }
        if(indexMin!==i){
            swap(array,array[indexMin],array[i]);
        }
    }
}

```