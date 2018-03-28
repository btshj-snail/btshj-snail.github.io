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
            return _getItems()[0];
        }

        isEmpty(){
            return _getItems().length===0;
        }

        print(){
            console.log(_getItems().toString());
        }

        enqueue(){
            _getItems().push();
        }

        dequeue(){
          return _getItems().shift();
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

let PriorityQueue = (function(){
    let weakMap = new WeakMap();
    function _getItems(key){
        return weakMap.get(key);
    }

    function _setItems(key,val){
        weakMap.set(key,val);
    }

    class QueueEl {
        constructor(val,priority){
            this.val = val;
            this.priority = priority;
        }

        getValue(){
            return this.val;
        }

        getPriority(){
            return this.priority;
        }
    }

    return class {
        constructor(){
            _setItems(this,[]);
        }

        front(){
            return _getItems()[0].getValue();
        }

        isEmpty(){
            return _getItems().length===0;
        }

        print(){
            console.log(_getItems().getValue().toString());
        }

        enqueue(val,priority){
            let queueEl = new QueueEl(val,priority);
            let items = _getItems();
            for(let i=0,l=items.length;i<l;i++){
                let qel = items[i];
                if(!!this.priorityStrategy(qel.getPriority(),priority)){
                    items.splice(i,0,queueEl);
                    break;
                }
            }

            _getItems().push(queueEl);
        }

        dequeue(){
          return _getItems().shift().getValue();
        }

        priorityStrategy(curPriority,selfPriority){
            return curPriority>selfPriority;
        }

        setPriorityStrategy(fun){
            this.priorityStrategy = fun;
        }

    }

})();

```