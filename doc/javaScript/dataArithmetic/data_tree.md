# 树

树形数据结构，对于存储需要快速查找的数据非常有用。

## 树数据结构

树是一种分层数据的抽象模型。现实生活中最常见的树的例子是家谱，或是公司的组织架构图，如下图所示：

![](./imgs/tree_1.png)

## 树相关术语

一个树结构包含一系列存在父子关系的节点。每个节点都有一个父节点（除了顶部的第一个节点）以及零个或多个子节点：

![](./imgs/tree_2.png)

位于树顶部的节点叫作根节点（11）。它没有父节点。树中的每个元素都叫作节点，节点分为内部节点和外部节点。至少有一个子节点的节点称为内部节点（7、5、9、15、13和20是内部节点）。没有子元素的节点称为外部节点或叶节点（3、6、8、10、12、14、18和25是叶节点）。

一个节点可以有祖先和后代。一个节点（除了根节点）的祖先包括父节点、祖父节点、曾祖父节点等。一个节点的后代包括子节点、孙子节点、曾孙节点等。例如，节点5的祖先有节点7和节点11，后代有节点3和节点6。

有关树的另一个术语是子树。子树由节点和它的后代构成。例如，节点13、12和14构成了上图中树的一棵子树。

节点的一个属性是深度，节点的深度取决于它的祖先节点的数量。比如，节点3有3个祖先节点（5、7和11），它的深度为3。

树的高度取决于所有节点深度的最大值。一棵树也可以被分解成层级。根节点在第0层，它的子节点在第1层，以此类推。上图中的树的高度为3（最大高度已在图中表示——第3层）。


## 二叉树和二叉搜索树

二叉树中的节点最多只能有两个子节点：一个是左侧子节点，另一个是右侧子节点。这些定义有助于我们写出更高效的从树中插入、查找和删除节点的算法。二叉树在计算机科学中的应用非常广泛。

二叉搜索树（BST）是二叉树的一种，但是它只允许你在左侧节点存储（比父节点）小的值，在右侧节点存储（比父节点）大（或者等于）的值。上一节的图中就展现了一棵二叉搜索树。二叉搜索树将是我们在本章中要研究的数据结构。

### 创建BinarySearchTree类

下图展示了二叉搜索树数据结构的组织方式

和链表一样，将通过指针来表示节点之间的关系（术语称其为边）。在双向链表中，每个节点包含两个指针，一个指向下一个节点，另一个指向上一个节点。对于树，使用同样的方式（也使用两个指针）。但是，一个指向左侧子节点，另一个指向右侧子节点。

因此，将声明一个Node类来表示树中的每个节点。值得注意的一个小细节是，不同于在之前的章节中将节点本身称作节点或项，我们将会称其为键。
键是树相关的术语中对节点的称呼。我们将会遵循和LinkedList类中相同的模式，这表示也将声明一个变量以控制此数据结构的第一个节点。在树中，它不再是头节点，而是根元素。然后，我们需要实现一些方法。下面是将要在树类中实现的方法。

- insert(key)：向树中插入一个新的键。
- search(key)：在树中查找一个键，如果节点存在，则返回true；如果不存在，则返回false。
- inOrderTraverse：通过中序遍历方式遍历所有节点。
- preOrderTraverse：通过先序遍历方式遍历所有节点。
- postOrderTraverse：通过后序遍历方式遍历所有节点。
- min：返回树中最小的值/键。
- max：返回树中最大的值/键。
- remove(key)：从树中移除某个键。

```javaScript

        let BinarySearchTree = (function () {

            function Node(key) {
                this.key = key;
                this.left = null;
                this.right = null;
            }

            var root = null;

            function insertNode(pNode, node) {
                if (pNode.key > node.key) {
                    if (pNode.left === null) {
                        pNode.left = node;
                    } else {
                        arguments.callee(pNode.left, node);
                    }
                } else {
                    if (pNode.right === null) {
                        pNode.right = node;
                    } else {
                        arguments.callee(pNode.right, node);
                    }
                }
            }

            let _BinarySearchTree = function () {

            }

            _BinarySearchTree.prototype = {
                insert: function (key) {
                    let node = new Node(key);
                    if (root == null) {
                        root = node;
                    } else {
                        insertNode(root, node)
                    }
                }
            }

            return _BinarySearchTree;
        })();

```

遍历一棵树是指访问树的每个节点并对它们进行某种操作的过程。但是我们应该怎么去做呢？应该从树的顶端还是底端开始呢？从左开始还是从右开始呢？访问树的所有节点有三种方式：中序、先序和后序。在后面的小节中，我们将会深入了解这三种遍历方式的用法和实现。

### 中序遍历（左中右）

中序遍历是一种以上行顺序访问BST所有节点的遍历方式，也就是以从最小到最大的顺序访问所有节点。中序遍历的一种应用就是对树进行排序操作。

inOrderTraverse方法接收一个回调函数作为参数。回调函数用来定义我们对遍历到的每个节点进行的操作。由于我们在BST中最常实现的算法是递归，这里使用了一个私有的辅助函数，来接收一个节点和对应的回调函数作为参数。要通过中序遍历的方法遍历一棵树，首先要检查以参数形式传入的节点是否为null（这就是停止递归继续执行的判断条件）。然后，递归调用相同的函数来访问左侧子节点。接着对这个节点进行一些操作（callback），然后再访问右侧子节点。

我们来看它的实现：

```javaScript

let BinarySearchTree = (function () {

            function Node(key) {
                this.key = key;
                this.left = null;
                this.right = null;
            }

            var root = null;

            function insertNode(pNode, node) {
                if (pNode.key > node.key) {
                    if (pNode.left === null) {
                        pNode.left = node;
                    } else {
                        arguments.callee(pNode.left, node);
                    }
                } else {
                    if (pNode.right === null) {
                        pNode.right = node;
                    } else {
                        arguments.callee(pNode.right, node);
                    }
                }
            }

            function inOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    callback(node.key);
                    arguments.callee(node.right,callback);
                }
            }

            let _BinarySearchTree = function () {

            }

            _BinarySearchTree.prototype = {
                insert: function (key) {
                    let node = new Node(key);
                    if (root == null) {
                        root = node;
                    } else {
                        insertNode(root, node)
                    }
                },
                inOrderTraverse(callback){
                    inOrderTraverseNode(root,callback);
                }
            }

            return _BinarySearchTree;
        })();

```

### 先序遍历（中左右）

先序遍历是以优先于后代节点的顺序访问每个节点的。先序遍历的一种应用是打印一个结构化的文档。

```javaScript
let BinarySearchTree = (function () {

            function Node(key) {
                this.key = key;
                this.left = null;
                this.right = null;
            }

            var root = null;

            function insertNode(pNode, node) {
                if (pNode.key > node.key) {
                    if (pNode.left === null) {
                        pNode.left = node;
                    } else {
                        arguments.callee(pNode.left, node);
                    }
                } else {
                    if (pNode.right === null) {
                        pNode.right = node;
                    } else {
                        arguments.callee(pNode.right, node);
                    }
                }
            }

            function inOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    callback(node.key);
                    arguments.callee(node.right,callback);
                }
            }

            function preOrderTraverseNode(node,callback){
                if(node!==null){
                    callback(node.key);
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                }
            }

            let _BinarySearchTree = function () {

            }

            _BinarySearchTree.prototype = {
                insert: function (key) {
                    let node = new Node(key);
                    if (root == null) {
                        root = node;
                    } else {
                        insertNode(root, node)
                    }
                },
                inOrderTraverse(callback){
                    inOrderTraverseNode(root,callback);
                },
                preOrderTraverse(callback){
                    preOrderTraverseNode(root,callback);
                }
            }

            return _BinarySearchTree;
        })();

```

### 后序遍历

后序遍历则是先访问节点的后代节点，再访问节点本身。后序遍历的一种应用是计算一个目录和它的子目录中所有文件所占空间的大小。


```javaScript
let BinarySearchTree = (function () {

            function Node(key) {
                this.key = key;
                this.left = null;
                this.right = null;
            }

            var root = null;

            function insertNode(pNode, node) {
                if (pNode.key > node.key) {
                    if (pNode.left === null) {
                        pNode.left = node;
                    } else {
                        arguments.callee(pNode.left, node);
                    }
                } else {
                    if (pNode.right === null) {
                        pNode.right = node;
                    } else {
                        arguments.callee(pNode.right, node);
                    }
                }
            }

            function inOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    callback(node.key);
                    arguments.callee(node.right,callback);
                }
            }

            function preOrderTraverseNode(node,callback){
                if(node!==null){
                    callback(node.key);
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                }
            }

            function postOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                    callback(node.key);
                }
            }

            let _BinarySearchTree = function () {

            }

            _BinarySearchTree.prototype = {
                insert: function (key) {
                    let node = new Node(key);
                    if (root == null) {
                        root = node;
                    } else {
                        insertNode(root, node)
                    }
                },
                inOrderTraverse(callback){
                    inOrderTraverseNode(root,callback);
                },
                preOrderTraverse(callback){
                    preOrderTraverseNode(root,callback);
                },
                postOrderTraverse(callback){
                    postOrderTraverseNode(root,callback);
                }
            }

            return _BinarySearchTree;
        })();

```

## 搜索树中的值

在树中，有三种经常执行的搜索类型：
- 搜索最小值;
- 搜索最大值;
- 搜索特定的值

### 搜索最小值和最大值

我们使用下面的这个树作为例子：

![](./tree_4.png)

只用眼睛看这张图，你能一下找到树中的最小值和最大值吗？

如果你看一眼树最后一层最左侧的节点，会发现它的值为3，这是这棵树中最小的键。如果你再看一眼树最右端的节点（同样是树的最后一层），会发现它的值为25，这是这棵树中最大的键。这条信息在我们实现搜索树节点的最小值和最大值的方法时能给予我们很大的帮助。

```javaScript
let BinarySearchTree = (function () {

            function Node(key) {
                this.key = key;
                this.left = null;
                this.right = null;
            }

            var root = null;

            function insertNode(pNode, node) {
                if (pNode.key > node.key) {
                    if (pNode.left === null) {
                        pNode.left = node;
                    } else {
                        arguments.callee(pNode.left, node);
                    }
                } else {
                    if (pNode.right === null) {
                        pNode.right = node;
                    } else {
                        arguments.callee(pNode.right, node);
                    }
                }
            }

            function inOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    callback(node.key);
                    arguments.callee(node.right,callback);
                }
            }

            function preOrderTraverseNode(node,callback){
                if(node!==null){
                    callback(node.key);
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                }
            }

            function postOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                    callback(node.key);
                }
            }

            function minNode(node){
                if(node){
                    while(node && node.left){
                        node = node.left;
                    }
                    return node
                }
                return null;
            }

            function maxNode(node){
                if(node){
                    while(node && node.right){
                        node = node.right;
                    }
                    return node.key
                }
                return null;
            }

            let _BinarySearchTree = function () {

            }

            _BinarySearchTree.prototype = {
                insert: function (key) {
                    let node = new Node(key);
                    if (root == null) {
                        root = node;
                    } else {
                        insertNode(root, node)
                    }
                },
                inOrderTraverse(callback){
                    inOrderTraverseNode(root,callback);
                },
                preOrderTraverse(callback){
                    preOrderTraverseNode(root,callback);
                },
                postOrderTraverse(callback){
                    postOrderTraverseNode(root,callback);
                },
                  min(){
                    let node = minNode(root);
                    return node ? node.key : null;
                },
                max(){
                    let node = maxNode(root);
                    return node ? node.key : null;
                },
            }

            return _BinarySearchTree;
        })();

```

### 搜索特定值


```javaScript
let BinarySearchTree = (function () {

            function Node(key) {
                this.key = key;
                this.left = null;
                this.right = null;
            }

            var root = null;

            function insertNode(pNode, node) {
                if (pNode.key > node.key) {
                    if (pNode.left === null) {
                        pNode.left = node;
                    } else {
                        arguments.callee(pNode.left, node);
                    }
                } else {
                    if (pNode.right === null) {
                        pNode.right = node;
                    } else {
                        arguments.callee(pNode.right, node);
                    }
                }
            }

            function inOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    callback(node.key);
                    arguments.callee(node.right,callback);
                }
            }

            function preOrderTraverseNode(node,callback){
                if(node!==null){
                    callback(node.key);
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                }
            }

            function postOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                    callback(node.key);
                }
            }

            function minNode(node){
                if(node){
                    while(node && node.left){
                        node = node.left;
                    }
                    return node;
                }
                return null;
            }

            function maxNode(node){
                if(node){
                    while(node && node.right){
                        node = node.right;
                    }
                    return node.key
                }
                return null;
            }

            function searchNode(node,val){
                if(node===null) return false;
                if(node.key===val){
                    return true;
                }else if(node.key>val){
                   return arguments.callee(node.left,val);
                }else{
                   return arguments.callee(node.right,val);
                }
            }

            let _BinarySearchTree = function () {

            }

            _BinarySearchTree.prototype = {
                insert: function (key) {
                    let node = new Node(key);
                    if (root == null) {
                        root = node;
                    } else {
                        insertNode(root, node)
                    }
                },
                inOrderTraverse(callback){
                    inOrderTraverseNode(root,callback);
                },
                preOrderTraverse(callback){
                    preOrderTraverseNode(root,callback);
                },
                postOrderTraverse(callback){
                    postOrderTraverseNode(root,callback);
                },
                  min(){
                    let node = minNode(root);
                    return node ? node.key : null;
                },
                max(){
                    let node = maxNode(root);
                    return node ? node.key : null;
                },
                search(key){
                    return searchNode(root,key);
                }
            }

            return _BinarySearchTree;
        })();

```

### 移除一个节点

```javaScript
let BinarySearchTree = (function () {

            function Node(key) {
                this.key = key;
                this.left = null;
                this.right = null;
            }

            var root = null;

            function insertNode(pNode, node) {
                if (pNode.key > node.key) {
                    if (pNode.left === null) {
                        pNode.left = node;
                    } else {
                        arguments.callee(pNode.left, node);
                    }
                } else {
                    if (pNode.right === null) {
                        pNode.right = node;
                    } else {
                        arguments.callee(pNode.right, node);
                    }
                }
            }

            function inOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    callback(node.key);
                    arguments.callee(node.right,callback);
                }
            }

            function preOrderTraverseNode(node,callback){
                if(node!==null){
                    callback(node.key);
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                }
            }

            function postOrderTraverseNode(node,callback){
                if(node!==null){
                    arguments.callee(node.left,callback);
                    arguments.callee(node.right,callback);
                    callback(node.key);
                }
            }

            function minNode(node){
                if(node){
                    while(node && node.left){
                        node = node.left;
                    }
                    return node;
                }
                return null;
            }

            function maxNode(node){
                if(node){
                    while(node && node.right){
                        node = node.right;
                    }
                    return node;
                }
                return null;
            }

            function searchNode(node,val){
                if(node===null) return false;
                if(node.key===val){
                    return true;
                }else if(node.key>val){
                   return arguments.callee(node.left,val);
                }else{
                   return arguments.callee(node.right,val);
                }
            }

            /**
            *
            *方法中return node对象，主要是为了维护各个node之间的关系。保持树形结构
            *
            **/
            function removeNode(node,key){
                //如果key小于节点的key ，则表明想要删除的节点在当前节点的左边。继续调用删除方法，查找下一个
                if(node.key>key){
                    node.left = arguments.callee(node.left,key);
                    return node;
                }
                //如果key大于节点的key ，则表明想要删除的节点在当前节点的右边。继续调用删除方法，查找下一个
                else if(node.key<key){
                    node.right = arguments.callee(node.right,key);
                    return node;
                
                }
                //key值等于当前节点的key，表明该节点是我们想要删除的节点。此时准备删除。分为以下三种情况
                else{
                    //1.如果当前节点没有子节点，则直接删除。返回null给上一节点即可
                    if(node.left===null && node.right===null){
                        node = null;
                        return node;
                    }
                    //2. 如果当前节点只有一个子节点(只有左节点或者只有右节点)，那么直接将当前节点置换成子节点即可。
                    if(node.left===null){
                        node = node.right;
                        return node;
                    }else if(node.right===null){
                        node = node.left;
                        return node;
                    }
                    //3. 如果当前节点有两个子节点，那么此时找到右子节点所有后代（包含右子节点）中最小的一个节点。
                    // 将这个最小节点的值替换掉当前节点的值（其实是做了删除）
                    // 然后删除掉这个最小的节点。
                    var aux = minNode(node.right);
                    node.key = aux.key;
                    node.right = arguments.callee(node.right,aux.key);
                    return node;
                }
            }

            let _BinarySearchTree = function () {

            }

            _BinarySearchTree.prototype = {
                insert: function (key) {
                    let node = new Node(key);
                    if (root == null) {
                        root = node;
                    } else {
                        insertNode(root, node)
                    }
                },
                inOrderTraverse(callback){
                    inOrderTraverseNode(root,callback);
                },
                preOrderTraverse(callback){
                    preOrderTraverseNode(root,callback);
                },
                postOrderTraverse(callback){
                    postOrderTraverseNode(root,callback);
                },
                min(){
                    let node = minNode(root);
                    return node ? node.key : null;
                },
                max(){
                    let node = maxNode(root);
                    return node ? node.key : null;
                },
                search(key){
                    return searchNode(root,key);
                },
                remove(key){
                    return removeNode(root,key);
                }
            }

            return _BinarySearchTree;
        })();

```

## 自平衡树

二叉搜索树存在一个问题：取决于你添加的节点数，树的边可能会很深；也就是说，树的一条分支会有很多层，而其他的分支却只有几层。如图所示：

![](./imgs/tree_5.png)

这会在需要在某条边上添加、移除和搜索某个节点时引起一些性能问题。为了解决这个问题，有一种树叫作Adelson-Velskii-Landi树（AVL树）。AVL树是一种自平衡二叉搜索树，意思是任何一个节点左右两侧子树的高度之差最多为1。也就是说这种树会在添加或移除节点时尽量试着成为一棵**完全**树.

### AVL树

AVL树是一种自平衡树。添加或移除节点时，AVL树会尝试自平衡。任意一个节点（不论深度）的左子树和右子树高度最多相差1。添加或移除节点时，AVL树会尽可能尝试转换为完全树

### 在AVL树插入节点

在AVL树中插入或移除节点和BST完全相同。然而，AVL树的不同之处在于我们需要检验它的平衡因子，如果有需要，则将其逻辑应用于树的自平衡。

```javaScript

let insertNode = function(node,el){
    if(node === null ){
        node = new Node(el);
    }else if(el<node.key){
        node.left = arguments.callee(node.left,el);
        if(node.left !==null){
            //todo 检查是否平衡 {1}
        }
    }else if(el>node.key){
        node.right = arguments.callee(node.right,el);
        if(node.right !==null){
            //todo 检查是否平衡 {2}
        }
    }
    return node;
}

```

### 计算平衡因子

在AVL树中，需要对每个节点计算右子树高度（hr）和左子树高度（hl）的差值，该值（hr－hl）应为0、1或-1。如果结果不是这三个值之一，则需要平衡该AVL树。这就是平衡因子的概念。

```javaScript

let heightNode = function(node){
    if(node===null){
        return -1;
    }else{
        return Math.max(heightNode(node.left),heightNode(node.right)+1);
    }
}

```

因此，向左子树插入新节点时，需要计算其高度；如果高度大于1（即不为-1、0和1之一），就需要平衡左子树。代码如下：

```javaScript

//在insertNode方法的第一个todo里加入以下代码

if((heightNode(node.left)-heightNode(node.right))>1){
    // 旋转{3}
}

```

向右子树插入新节点时， 应用同样的逻辑，代码如下：

 ```javaScript

//在insertNode方法的第二个todo里加入以下代码

if((heightNode(node.right)-heightNode(node.left))>1){
    // 旋转{4}
}

```

### AVL 旋转

向AVL树插入节点时，可以执行单旋转或双旋转两种平衡操作，分别对应四种场景

- 右-右(RR): 向左的单旋转
- 左-左(LL): 向右的单旋转
- 左-右(LR): 向右的双旋转
- 右-左(RL): 向左的双旋转

该文未完。。。。。。。。。。

