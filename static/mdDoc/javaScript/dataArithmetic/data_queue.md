# 队列

## 队列数据结构

队列是遵循*** FIFO ***（FirstInFirstOut，先进先出，也称为先来先服务）原则的一组有序的项。队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾。

## 创建队列

```javaScript

let Queue = (function(){
    let weakMap = new WeakMap();
    function _getItems(key){
        return weakMap.get(key);
    }

    function _setItems(key,val){
        weakMap.set(key,val);
    }

    return class {
        constructor(){
            _setItems(this,[]);
        }

        front(){
            return _getItems(this)[0];
        }

        size(){
            return _getItems(this).length;
        }

        isEmpty(){
            return _getItems(this).length===0;
        }

        print(){
            console.log(_getItems(this).toString());
        }

        enqueue(){
            let items = _getItems(this);
            items.push.apply(items,arguments);
        }

        dequeue(){
          return _getItems(this).shift();
        }

    }

})();

```

## 优先队列

优先队列-元素的添加和移除是有优先级的。

一个现实的列子就是机场登机的顺序。头等舱和商务舱乘客的优先级要高于经济舱乘客。在有些国家，老年人和孕妇（或带小孩的妇女）登机时也享有高于其他乘客的优先级。

另一个现实中的例子是医院的（急诊科）候诊室。医生会优先处理病情比较严重的患者。通常，护士会鉴别分类，根据患者病情的严重程度放号。

实现一个优先队列，有两种选项：设置优先级，然后在正确的位置添加元素；或者用入列操作添加元素，然后按照优先级移除它们。在这个示例中，我们将会在正确的位置添加元素，因此可以对它们使用默认的出列操作：

```javaScript

    let PriorityQueue = (function () {
            let weakMap = new WeakMap();

            function _getItems(key) {
                return weakMap.get(key);
            }

            function _setItems(key, val) {
                weakMap.set(key, val);
            }

            class QueueEl {
                constructor(val, priority) {
                    this.val = val;
                    this.priority = priority;
                }

                getValue() {
                    return this.val;
                }

                getPriority() {
                    return this.priority;
                }
            }

            return class {
                constructor() {
                    _setItems(this, []);
                }

                front() {
                    return _getItems(this)[0].getValue();
                }

                isEmpty() {
                    return _getItems(this).length === 0;
                }

                print() {
                    console.log(_getItems(this));
                }

                enqueue(val, priority) {
                    let queueEl = new QueueEl(val, priority),items = _getItems(this),isWrite = false;
                    for (let i = 0, l = items.length; i < l; i++) {
                        let qel = items[i];
                        if (!!this.priorityStrategy(qel.getPriority(), priority)) {
                            items.splice(i, 0, queueEl);
                            isWrite = true;
                            break;
                        }
                    }

                  !isWrite && items.push(queueEl);
                }

                dequeue() {
                    return _getItems(this).shift().getValue();
                }

                priorityStrategy(curPriority, selfPriority) {
                    return curPriority > selfPriority;
                }

                setPriorityStrategy(fun) {
                    this.priorityStrategy = fun;
                }

            }

        })();

        let pq = new PriorityQueue();
        pq.setPriorityStrategy(function(curVal,selfVal){
                return curVal<selfVal;
        })
        pq.enqueue("jack",10);
        pq.enqueue("tom",1);
        pq.enqueue("lucy",5);
        pq.print(); //[{val:jack,priority:10},{val:lucy,priority:5},{val:tom,priority:1}]

```

## 循环队列--击鼓传花

还有另一个修改版的队列实现，就是循环队列。循环队列的一个例子就是击鼓传花游戏（HotPotato）。在这个游戏中，孩子们围成一个圆圈，把花尽快地传递给旁边的人。某一时刻传花停止，这个时候花在谁手里，谁就退出圆圈结束游戏。重复这个过程，直到只剩一个孩子（胜者）。

在下面这个示例中，我们要实现一个模拟的击鼓传花游戏：

使用了我们之前创建的Queue类
```javaScript

function hotPotato(nameList,num){
    //将参与活动的人放入队列中
    let queue = new Queue();
    nameList.forEach((item)=>{
        queue.enqueue(item);
    })

    //将被淘汰的人移除队列

    while(queue.size()>1){
        // 将传递次数之前的人先出队列 再入队列
        for(let i=0;i<num;i++){
            queue.enqueue(queue.dequeue());
        }
        let name = queue.dequeue();
        console.log(`出局：${name}`);
    }
    //返回最终胜出的人
    return queue.dequeue();
}

let names = ["jack","tom","lucy","lili","hanmeimei","rosh","jni","foo","goog"];

console.log(`最终胜利的人：${hotPotato(names,5)}`);

```

