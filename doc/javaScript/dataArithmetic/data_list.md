# 集合

前几篇文章介绍了[数组](./data_array.md)，[栈](./data_stack.md)，[队列](./data_queue.md)，[链表](./data_linkedList.md)等顺序数据结构。
而集合则是一种不允许数据重复的无序数据结构。


## 构建集合

集合是由一组无序且唯一（即不能重复）的项组成的。这个数据结构使用了与有限集合相同的数学概念，只不过应用在计算机科学的数据结构中。

在深入学习集合的计算机科学实现之前，我们先看看它的数学概念。在数学中，集合是一组不同的对象（的集）。比如说，一个由大于或等于0的整数组成的自然数集合：N={0,1,2,3,4,5,6, …}。集合中的对象列表用“{}”(大括号)包围。

还有一个概念叫空集。空集就是不包含任何元素的集合。比如24和29之间的素数集合。由于24和29之间没有素数（除了1和自身，没有其他正因数的大于1的自然数），这个集合就是空集。空集用“{}”表示。

你也可以把集合想象成一个既没有重复元素，也没有顺序概念的数组。在数学中，集合也有并集、交集、差集等基本操作。在这一章中我们也会介绍这些操作。

## 创建集合

 目前的JavaScript实现是基于2011年6月发布的ECMAScript5.1（现代浏览器均已支持），它包括了我们在之前章节已经提到过的Array类的实现。ECMAScript6也包括了Set类的实现，本章稍后会介绍它的用法。本章中，我们要实现的类就是以ECMAScript6中Set类的实现为基础的。

 以下为仿Set类

 ```javaScript

   let items = Symbol("fakeSetItems");

        function FakeSet() {
            this[items] = {};
        }

        FakeSet.prototype = {
            /**
             *把值作为键和值同时保存，有利于快速查找
             **/
            add: function (val) {
                if (!this.has(val)) {
                    this[items][val] = val;
                    return true;
                }
                return false;
            },
            delete: function (val) {
                if (this.has(val)) {
                    delete this[items][val];
                    return true;
                }
                return false;
            },
            has: function (val) {
                // return val in this[items];
                return this[items].hasOwnProperty(val); //所有JavaScript对象都有hasOwnProperty方法。这个方法返回一个表明对象是否具有特定属性的布尔值。
            },
            clear: function (val) {
                this[items] = {};
            },
            size: function () {
                if (Object.keys) {
                    return Object.keys(this[items]).length;
                } else {
                    let count = 0;
                    for (let o in this[items]) {
                        //不能简单地使用for-in语句遍历items对象的属性，并递增count变量的值。
                        //还需要使用hasOwnProperty方法（以验证items对象具有该属性），因为对象的原型包含了额外的属性（属性既有继承自JavaScript的Object类的，也有属于对象自身，未用于数据结构的）。
                        if (this[items].hasOwnProperty(o)) {
                            ++count;
                        }
                    }
                    return count;
                }
            },
            values: function () {
                if (Object.keys) {
                    return Object.keys(this[items]).map(item => {
                        return this[items][item];
                    })
                } else {
                    let result = [];
                    for (let o in this[items]) {
                        if (this[items].hasOwnProperty(o)) {
                            result.push(this[items][o]);
                        }
                    }
                    return result;
                }
            }
        }

        let fakeSet = new FakeSet();
        fakeSet.add("jack");
        console.log(fakeSet.values())
        fakeSet.delete("jack");
        console.log(fakeSet.values())

 ```

 ## 集合操作

 ### 并集

并集是指：对于给定的两个集合，返回一个包含两个集合中所有元素的新集合。

 我们在FakeSet的基础进行填充,增加union方法.

  ```javaScript

   let items = Symbol("fakeSetItems");

        function FakeSet() {
            this[items] = {};
        }

        FakeSet.prototype = {
            /**
             *把值作为键和值同时保存，有利于快速查找
             **/
            add: function (val) {
                if (!this.has(val)) {
                    this[items][val] = val;
                    return true;
                }
                return false;
            },
            delete: function (val) {
                if (this.has(val)) {
                    delete this[items][val];
                    return true;
                }
                return false;
            },
            has: function (val) {
                // return val in this[items];
                return this[items].hasOwnProperty(val); //所有JavaScript对象都有hasOwnProperty方法。这个方法返回一个表明对象是否具有特定属性的布尔值。
            },
            clear: function (val) {
                this[items] = {};
            },
            size: function () {
                if (Object.keys) {
                    return Object.keys(this[items]).length;
                } else {
                    let count = 0;
                    for (let o in this[items]) {
                        //不能简单地使用for-in语句遍历items对象的属性，并递增count变量的值。
                        //还需要使用hasOwnProperty方法（以验证items对象具有该属性），因为对象的原型包含了额外的属性（属性既有继承自JavaScript的Object类的，也有属于对象自身，未用于数据结构的）。
                        if (this[items].hasOwnProperty(o)) {
                            ++count;
                        }
                    }
                    return count;
                }
            },
            values: function () {
                if (Object.keys) {
                    let ary =  Object.keys(this[items]);
                    return Array.isArray(ary) && ary.length>0 ? ary.map(item => {
                        return this[items][item];
                    }):[]
                } else {
                    let result = [];
                    for (let o in this[items]) {
                        if (this[items].hasOwnProperty(o)) {
                            result.push(this[items][o]);
                        }
                    }
                    return result;
                }
            },
            union:function(otherFakeSet){
                let unionSet = new FakeSet();
                let values = [];
                values = this.values();
                values.push.apply(values,otherFakeSet.values());
                for(let i=0,l=values.length;i<l;i++){
                    unionSet.add(values[i]);
                }
                return unionSet;
            },

        }

 ```

 ### 交集

 交集 ：对于给定的两个集合，返回一个包含两个集合中共有元素的新集合。

 ```javaScript

let items = Symbol("fakeSetItems");

        function FakeSet() {
            this[items] = {};
        }

        FakeSet.prototype = {
            ...
            intersection:function(oFakeSet){
                let newSet = new FakeSet();
                let values = this.values();
                for(let i=0,l=values.length;i<l;i++){
                    let val = values[i];
                    if(oFakeSet.has(val)){
                        newSet.add(val);
                    }
                }
                return newSet;
            }
        }

 ```

 ### 差集

 对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合。

  ```javaScript

let items = Symbol("fakeSetItems");

        function FakeSet() {
            this[items] = {};
        }

        FakeSet.prototype = {
            ...
            difference:function(oFakeSet){
                let newSet = new FakeSet();
                let values = this.values();
                for(let i=0,l=values.length;i<l;i++){
                    let val = values[i];
                    if(!oFakeSet.has(val)){
                        newSet.add(val);
                    }
                }
                return newSet;
            }
        }

 ```

 ### 子集

子集：验证一个给定集合是否是另一集合的子集。

```javaScript

function FakeSet() {
            this[items] = {};
        }

        FakeSet.prototype = {
            ...
            subSet:function(oFakeSet){
                let values = this.values();
                for(let i=0,l=values.length;i<l;i++){
                    let val = values[i];
                    if(!oFakeSet.has(val)){
                        return false;
                    }
                }
                return true;
            }
        }

```


至此完整的FakeSet的代码如下：

```javaScript

        let items = Symbol("fakeSetItems");

        function FakeSet() {
            this[items] = {};
        }

        FakeSet.prototype = {
            /**
             *把值作为键和值同时保存，有利于快速查找
             **/
            add: function (val) {
                if (!this.has(val)) {
                    this[items][val] = val;
                    return true;
                }
                return false;
            },
            delete: function (val) {
                if (this.has(val)) {
                    delete this[items][val];
                    return true;
                }
                return false;
            },
            has: function (val) {
                // return val in this[items];
                return this[items].hasOwnProperty(val); //所有JavaScript对象都有hasOwnProperty方法。这个方法返回一个表明对象是否具有特定属性的布尔值。
            },
            clear: function (val) {
                this[items] = {};
            },
            size: function () {
                if (Object.keys) {
                    return Object.keys(this[items]).length;
                } else {
                    let count = 0;
                    for (let o in this[items]) {
                        //不能简单地使用for-in语句遍历items对象的属性，并递增count变量的值。
                        //还需要使用hasOwnProperty方法（以验证items对象具有该属性），因为对象的原型包含了额外的属性（属性既有继承自JavaScript的Object类的，也有属于对象自身，未用于数据结构的）。
                        if (this[items].hasOwnProperty(o)) {
                            ++count;
                        }
                    }
                    return count;
                }
            },
            values: function () {
                if (Object.keys) {
                    return Object.keys(this[items]).map(item => {
                        return this[items][item];
                    })
                } else {
                    let result = [];
                    for (let o in this[items]) {
                        if (this[items].hasOwnProperty(o)) {
                            result.push(this[items][o]);
                        }
                    }
                    return result;
                }
            },
            union:function(otherFakeSet){
                let unionSet = new FakeSet();
                let values = [];
                values = this.values();
                values.push.apply(values,otherFakeSet.values());
                for(let i=0,l=values.length;i<l;i++){
                    unionSet.add(values[i]);
                }
                return unionSet;
            },
            intersection:function(oFakeSet){
                let newSet = new FakeSet();
                let values = this.values();
                for(let i=0,l=values.length;i<l;i++){
                    let val = values[i];
                    if(oFakeSet.has(val)){
                        newSet.add(val);
                    }
                }
                return newSet;
            },
            difference:function(oFakeSet){
                let newSet = new FakeSet();
                let values = this.values();
                for(let i=0,l=values.length;i<l;i++){
                    let val = values[i];
                    if(!oFakeSet.has(val)){
                        newSet.add(val);
                    }
                }
                return newSet;
            },
            subSet:function(oFakeSet){
                let values = this.values();
                for(let i=0,l=values.length;i<l;i++){
                    let val = values[i];
                    if(!oFakeSet.has(val)){
                        return false;
                    }
                }
                return true;
            }
        }

        let fakeSet = new FakeSet();
        fakeSet.add("jack");
        console.log(fakeSet.values())
        fakeSet.delete("jack");
        console.log(fakeSet.values())
        fakeSet.add("Tom");
        fakeSet.add("Lucy");

        let fakeSet1 = new FakeSet();
        fakeSet1.add("Tim");
        fakeSet1.add("Tom");
        let intersectionFakeSet = fakeSet1.intersection(fakeSet);
        console.log(intersectionFakeSet.values());

```

## ES6中的Set

详情见[《Set》](../es6/set.md)