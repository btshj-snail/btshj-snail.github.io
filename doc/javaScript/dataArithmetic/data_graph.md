# 图

图是一种非线性关系的的数据结构。

## 图相关术语

图是网络结构的抽象模型。图是一组由边连接的节点（或顶点）。学习图是重要的，因为任何二元关系都可以用图来表示。

任何社交网络，例如Facebook、Twitter和Googleplus，都可以用图来表示。

我们还可以使用图来表示道路、航班以及通信状态。

让我们来学习一下图在数学及技术上的概念。
一个图G=(V,E)由以下元素组成。
- V：一组顶点
- E：一组边，连接V中的顶点

下图表示一个图：

![](./imgs/map_1.png)

在着手实现算法之前，我们先了解下图的术语。

由一条边连接在一起的顶点称为**相邻顶点**。比如A，B是相邻的，A，D是相邻的。

一个顶点的**度**是其相邻顶点的数量。比如A和其他三个顶点相连接，因此A的度为3；E和其他两个顶点相连接，因此E的度为2.

路径是顶点v1，v2....vk的一个连续序列，其中vi和vi+1是相邻的。以上一示意图中的图为例，其中包含路径ABEI和ACDG

**简单路径**要求不包含重复的顶点。举个例子，ADG是一个简单的路径。除去最后一个顶点（因为它和第一个顶点是同一个顶点），环也是一个简单路径，比如ADCA（最后一个顶点重新回到A）

如果图中不存在环，则称为无环的。如果图中每两个顶点间都存在路径，则该图称之为**连通的**

图可以是无向的（边没有方向）或是有向的。如下图所示，有向图的边都有一个方向：

![](./map_2.png)

如果图中每两个顶点间在双向上都存在路径，则该图是**强连通的**。如C和D是强连通的，而A和B不是强连通的。

图还可以是**未加权的**和**加权**的，如图所示加权图的边都是赋予了权值的。

![](./map_3.png)

我们可以用图来解决计算机科学中许多问题，比如搜索图中特定顶点，搜索图中特定边，寻找图中的一条路径，寻找两个顶点间最短路径，以及环检测。

## 图的表示

从数据结构上来说，我们有多种形式来表示图。在所有的表示方法中，不存在绝对正确方式。图的正确表达方式，取决于待解决的问题和图的类型。

### 邻接矩阵

图最常见的实现是邻接矩阵。每个节点都和一个整数相关联，该整数将作为数组的索引。我们用一个二维数组来表示顶点间的连接。如果索引为i的节点和索引为j的节点相邻，则array[i][j] === 1 ,否则 array[i][j] === 0,如下图所示：

![](./map_4.png)

不是强连通图的，如果用用邻接矩阵来表示，则邻接矩阵将会有很多0，这意味着我们浪费了计算机存储空间来表示不存在的边。例如，查找给定顶点相邻顶点，即使该顶点只有一个相邻顶点，我们也不得不迭代一整行。邻接矩阵表示法不够好的另一个理由是，图中顶点的数量可能会改变，而二维数组不够灵活。


### 邻接表

我们也可以使用一种叫作**邻接表**的动态数据结构来表示图。邻接表由图中每个顶点的相邻顶点列表所组成。存在好几种方式来表示这种数据结构。我们可以用列表（数组）、链表，甚至是散列表或是字典来表示相邻顶点列表。下面的示意图展示了邻接表数据结构。

![](./map_5.png)

尽管邻接表可能对大多数问题来说都是更好的选择，但以上两种表示法都很有用，且它们有着不同的性质（例如，要找出顶点v和w是否相邻，使用邻接矩阵会比较快）。在本书的示例中，我们将会使用邻接表表示法。

### 关联矩阵

我们还可以用**关联矩阵**来表示图。在关联矩阵中，矩阵的行表示顶点，列表示边。如下图所示，我们使用二维数组来表示两者之间的连通性，如果顶点v是边e的入射点，则array[v][e]===1；否则，array[v][e]===0。

![](./map_6.png)

关联矩阵通常用于边的数量比顶点多的情况下，以节省空间和内存。

## 创建graph类

```javaScript

let Graph = (function(){
    let vertices = [];
    let adjList = new Dictionary();

})();

```
我们使用一个数组来存储图中所有顶点的名字，以及一个字典（在[《字典和散列表》](./data_dictionary.md)中，已经实现）来存储邻接表。字典将会使用顶点的名字作为键，邻接顶点列表作为值。vertices数组和adjList字典两者都是我们Graph类的私有属性。

接着，我们将实现两个方法：一个用来向图中添加一个新的顶点（因为图实例化后是空的），另外一个方法用来添加顶点之间的边。

addEdge方法接受两个顶点作为参数。首先，通过将w加入到v的邻接表中，我们添加了一条自顶点v到顶点w的边。如果你想实现一个有向图，则只用存放一条边的数据就可以了。由于本章中大多数的例子都是基于无向图的，我们需要添加一条自w向v的边。

```javaScript

let Graph = (function () {
            let vertices = [];
            let adjList = new Dictionary();


            function _Graph() { }

            _Graph.prototype = {
                addVertex: function (v) {
                    vertices.push(v);
                    adjList.set(v, []);
                },
                addEdge: function (v, w) {
                    adjList.get(v).push(w);
                    adjList.get(w).push(v);
                },
                toString: function () {
                    if (vertices.length <= 0) return "";
                    let result = vertices.map(item => {
                        return `${item} -> ${adjList.get(item).join(' ')}`;
                    })
                    return result.join('\n')
                }

            }

            return _Graph;
        })();

```

### 图的遍历

和树数据结构类似，我们可以访问图的所有节点。

有两种算法可以对图进行遍历：广度优先搜索（Breadth-FirstSearch，BFS）和深度优先搜索（Depth-FirstSearch，DFS）。

图遍历可以用来寻找特定的顶点或寻找两个顶点之间的路径，检查图是否连通，检查图是否含有环等。

在实现算法之前，让我们来更好地理解一下图遍历的思想方法。

图遍历算法的思想是必须追踪每个第一次访问的节点，并且追踪有哪些节点还没有被完全探索。对于两种图遍历算法，都需要明确指出第一个被访问的顶点。

完全探索一个顶点要求我们查看该顶点的每一条边。对于每一条边所连接的没有被访问过的顶点，将其标注为被发现的，并将其加进待访问顶点列表中。

为了保证算法的效率，务必访问每个顶点至多两次。连通图中每条边和顶点都会被访问到。

广度优先搜索算法和深度优先搜索算法基本上是相同的，只有一点不同，那就是待访问顶点列表的数据结构。

|算法|数据结构|描述
|--:|--:|--:
|深度优先搜索|栈|通过将顶点存入栈中，顶点是沿着路径被探索的，存在新的相邻顶点就去访问。
|广度优先搜索|队列|通过将顶点存入队列，最先入队列的顶点先被探索。

当要标注已经访问过的顶点时，我们用三种颜色来反映它们的状态。

- 白色：表示该顶点还没有被访问。
- 灰色：表示该顶点被访问过，但并未被探索过。
- 黑色：表示该顶点被访问过且被完全探索过。

这就是之前提到的务必访问每个顶点最多两次的原因。

#### 广度优先搜索

广度优先搜索算法会从指定的第一个顶点开始遍历图，先访问其所有的相邻点，就像一次访问图的一层。换句话说，就是先宽后深地访问顶点，如下图所示：

![](./graph_7.png)

以下是从顶点v开始的广度优先搜索算法所遵循的步骤。
- (1) 创建一个队列Q。
- (2) 将v标注为被发现的（灰色），并将v入队列Q。
- (3) 如果Q非空，则运行以下步骤：　　
    - (a) 将u从Q中出队列；
    - (b) 将标注u为被发现的（灰色）；　　
    - (c) 将u所有未被访问过的邻点（白色）入队列；　　
    - (d) 将u标注为已被探索的（黑色）。

实现广度优先算法：

```javaScript

let Graph = (function () {
            let vertices = [];
            let adjList = new Dictionary();

            /**
             * 初始化遍历状态
             * 1->未发现
             * 2->未探索
             * 3->已探索
             **/
            let initTraverseStatus = function () {
                let traverseStatus = {};
                vertices.forEach(item => {
                    traverseStatus[item] = 1;
                })
                return traverseStatus;
            }


            function _Graph() {}

            _Graph.prototype = {
                addVertex: function (v) {
                    if (vertices.findIndex(item => v === item) === -1) {
                        vertices.push(v);
                        adjList.set(v, []);
                    }
                },
                addEdge: function (v, w) {
                    adjList.get(v).push(w);
                    adjList.get(w).push(v);
                },
                toString: function () {
                    if (vertices.length <= 0) return "";
                    let result = vertices.map(item => {
                        return `${item} -> ${adjList.get(item).join(' ')}`;
                    })
                    return result.join('\n')
                },
                bfs: function (v, callback) {
                    let traverseStatus = initTraverseStatus(),
                        queue = new Queue();
                        queue.enqueue(v);

                        while(!queue.isEmpty()){
                            let u = queue.dequeue(),
                                neighbors = adjList.get(u);
                                traverseStatus[u] = 2;

                                neighbors.forEach((item)=>{
                                    if(traverseStatus[item] === 1){
                                        queue.enqueue(item);
                                        traverseStatus[item] = 2 ;
                                    }
                                })

                                traverseStatus[u] = 3;
                                callback && callback(u);
                        }
                }
            }

            return _Graph;
        })();

```

#### 使用BFS寻找最短路径

到目前为止，我们只展示了BFS算法的工作原理。我们可以用该算法做更多事情，而不只是输出被访问顶点的顺序。例如，考虑如何来解决下面这个问题。

给定一个图G和源顶点v，找出对每个顶点u，u和v之间最短路径的距离（以边的数量计）。对于给定顶点v，广度优先算法会访问所有与其距离为1的顶点，接着是距离为2的顶点，以此类推。所以，可以用广度优先算法来解这个问题。我们可以修改bfs方法以返回给我们一些信息：

- 从v到u的距离d[u]；
- 前溯点pred[u]，用来推导出从v到其他每个顶点u的最短路径。


```javaScript

let Graph = (function () {
            let vertices = [];
            let adjList = new Dictionary();

            /**
             * 初始化遍历状态
             * 1->未发现
             * 2->未探索
             * 3->已探索
             **/
            let initTraverseStatus = function () {
                let traverseStatus = {};
                vertices.forEach(item => {
                    traverseStatus[item] = 1;
                })
                return traverseStatus;
            }

            let _assemblePath = function(store,obj,vertex){
               store.push(vertex); 
               if(obj[vertex] in obj){
                   arguments.callee(store,obj,obj[vertex]);
               }
            }


            function _Graph() {}

            _Graph.prototype = {
                addVertex: function (v) {
                    if (vertices.findIndex(item => v === item) === -1) {
                        vertices.push(v);
                        adjList.set(v, []);
                    }
                },
                addEdge: function (v, w) {
                    adjList.get(v).push(w);
                    adjList.get(w).push(v);
                },
                toString: function () {
                    if (vertices.length <= 0) return "";
                    let result = vertices.map(item => {
                        return `${item} -> ${adjList.get(item).join(' ')}`;
                    })
                    return result.join('\n')
                },
                bfs: function (v, callback) {
                    let traverseStatus = initTraverseStatus(),
                        queue = new Queue();
                        queue.enqueue(v);

                        while(!queue.isEmpty()){
                            let u = queue.dequeue(),
                                neighbors = adjList.get(u);
                                traverseStatus[u] = 2;

                                neighbors.forEach((item)=>{
                                    if(traverseStatus[item] === 1){
                                        queue.enqueue(item);
                                        traverseStatus[item] = 2 ;
                                    }
                                })

                                traverseStatus[u] = 3;
                                callback && callback(u);
                        }
                },
                exitVertex:function(v){
                    return vertices.findIndex(item=>v===item)!==-1;
                },
                getShortestPath:function(beginV,endV){
                    if(!this.exitVertex(beginV) || !this.exitVertex(endV)) return [];
                    if(beginV===endV) return [];

                    let path = [],
                        
                        prev = {},
                        traverseStatus = initTraverseStatus(),
                        queue = new Queue();
                        queue.enqueue(beginV);

                        while(!queue.isEmpty()){
                            let u = queue.dequeue(),
                                neighbors = adjList.get(u);
                                traverseStatus[u] = 2;

                                neighbors.forEach((item)=>{
                                    if(item===endV){
                                        queue.clear();
                                    }
                                    if(traverseStatus[item] === 1){
                                        prev[item] = u; 
                                        queue.enqueue(item);
                                        traverseStatus[item] = 2 ;
                                    }
                                   
                                })

                                traverseStatus[u] = 3;
                        }
                        _assemblePath(path,prev,endV);
                        path = path.reverse();
                        path.push(beginV);
                        return {
                            path:path,
                            step:path.length,
                        }

                }
            }

            return _Graph;
        })();


```