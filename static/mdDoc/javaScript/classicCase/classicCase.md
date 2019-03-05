# 经典案例

## 1. 输入一个数。若在范围限制中则返回该值，若不在范围限制中，则返回限制值

该需求可以巧用Math的min和max方法进行。

```javascript

    function getValue(value,min,max){
        return Math.max(min,Math.min(max,value));
    }


```