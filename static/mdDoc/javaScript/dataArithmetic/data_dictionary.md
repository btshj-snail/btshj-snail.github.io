# 字典和散列表

集合、字典和散列表可以存储不重复的值。在集合中，我们感兴趣的是每个值本身，并把它当作主要元素。在字典中，我们用[键，值]的形式来存储数据。在散列表中也是一样（也是以[键，值]对的形式来存储数据）。但是两种数据结构的实现方式略有不同。

## 字典

集合表示一组互不相同的元素（不重复的元素）。在字典中，存储的是[键，值]对，其中键名是用来查询特定元素的。字典和集合很相似，集合以[值，值]的形式存储元素，字典则是以[键，值]的形式来存储元素。字典也称作映射。

与Set类相似，ECMAScript6同样包含了一个Map类的实现，即我们所说的字典。我们在本章中将要实现的类就是以ECMAScript6中Map类的实现为基础的。你会发现它和Set类很相似（但不同于存储[值，值]对的形式，我们将要存储的是[键，值]对）。

```javaScript

let Dictionary = (function(){

        let wm = new WeakMap();

        function _Dictionary(){
            wm.set(this,{});
        }

        _Dictionary.prototype = {
            set(key,val){
                let store = wm.get(this);
                store[key] = val;
            },
            delete(key){
                let store = wm.get(this);
                if(this.has(key)){
                    delete store[key];
                    return true;
                }
                return false;
            },
            has(key){
                let store = wm.get(this);
                return key in store;
            },
            get(key){
                let store = wm.get(this);
               return this.has(key) ? store[key] : undefined ;
            },
            clear(){
                wm.set(this,{});
            },
            size(){
                return Object.keys(wm.get(this)).length;
            },
            keys(){
                //Object.keys 不会获取原型链上的属性
                return Object.keys(wm.get(this));
            },
            values(){
                let vals = [];
                // for in 会将循环出所有原型链上的属性。所以使用hasOwnPropertype加以判断。主要是担心Object.prototype.xxx的出现
                let store = wm.get(this);
                for(let o in store){
                    if(store.hasOwnProperty(o)){
                        vals.push(store[o]);
                    }
                }
                return vals;
            },
        }

        return _Dictionary;
    })()

    let dictionary = new Dictionary();
    dictionary.set("101","v101")
    dictionary.set("102","v102")
    dictionary.set("103","v103")
    dictionary.set("104","v104")

    console.log(dictionary.get("104")); //v104
    console.log(dictionary.size()); //4
    console.log(dictionary.keys()) ;//["101","102","103","104"]
    console.log(dictionary.values());//["v101","v102","v103","v104"]
    console.log(dictionary.has("103")); // true
    console.log(dictionary.delete("103")); // true
    console.log(dictionary.has("103")); //flase
    console.log(dictionary.clear()); //undefined
    console.log(dictionary.size()); //0

```

## 散列表

散列算法的作用是尽可能快地在数据结构中找到一个值。在之前的章节中，你已经知道如果要在数据结构中获得一个值（使用get方法），需要遍历整个数据结构来找到它。如果使用散列函数，就知道值的具体位置，因此能够快速检索到该值。散列函数的作用是给定一个键值，然后返回值在表中的地址。

看了散列表，没想通他的用途。键值关系，直接字典数据结构啊，怎么会那么麻烦，还需要建散列表？？？？？？

