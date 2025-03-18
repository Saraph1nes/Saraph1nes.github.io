# 二叉树遍历

## 深度优先搜索（DFS）

1. **遍历方式**：
    - 从起始顶点开始，沿着一条路径一直往下走，直到不能再走为止，然后回退到前一步选择另一条路径继续探索，直到所有路径都被探索完成。
2. **实现方式**：
    - 使用递归或者栈来实现。
    - 如果使用递归，就是通过函数的递归调用来实现深度遍历。
    - 如果使用栈，可以手动维护一个栈结构来模拟递归过程。
3. **特点**：
    - 深度优先搜索常用于查找图中的路径，寻找最大深度等问题。
    - 当图的深度较大时，DFS可能会使用较多的栈空间，可能会导致栈溢出。

### 先（前）序遍历

```js
var preorderTraversal = function(root) {
    if (!root) return []
    const res = []
    const dfs = (_root) => {
        res.push(_root.val)
        _root.left && dfs(_root.left)
        _root.right && dfs(_root.right)
    }
    dfs(root)
    return res
};
```

### 中序遍历

```js
var inorderTraversal = function (root) {
    if (!root) return []
    const res = []
    const dfs = (_root) => {
        _root.left && dfs(_root.left)
        res.push(_root.val)
        _root.right && dfs(_root.right)
    }
    dfs(root)
    return res
};
```

### 后序遍历

```js
var postorderTraversal = function(root) {
  if (!root) return []
  const res = []
  const dfs = (_root) => {
    _root.left && dfs(_root.left)
    _root.right && dfs(_root.right)
    res.push(_root.val)
  }
  dfs(root)
  return res
};
```

## 广度优先搜索（BFS）

1. **遍历方式**：
    - 从起始顶点开始，首先遍历其所有的邻居节点，然后再遍历邻居节点的邻居节点，以此类推，直到遍历完所有可达的节点。
2. **实现方式**：
    - 使用队列来实现。
    - 从起始顶点开始，将其放入队列，然后依次将队列中的顶点弹出，并将其邻居节点放入队列中，直到队列为空。
3. **特点**：
    - 广度优先搜索适用于寻找最短路径、最短距离等问题。
    - 通常情况下，BFS所需的额外空间较DFS要少，因为只需要一个队列即可。
    - BFS适合用于解决图中节点的最短路径问题，因为它保证了从起点到达每个节点的路径都是最短的。

### 层序遍历

```js
var levelOrder = function (root) {
    if (!root) {
        return []
    }
    const res = []
    let queue = [root]

    while (queue.length) {
        const qLen = queue.length
        const vals = []

        for (let i = 0; i < qLen; i++) {
            const node = queue.shift()
            vals.push(node.val)
            node.left && queue.push(node.left)
            node.right && queue.push(node.right)
        }

        res.push(vals)
    }

    return res
};
```

## 总结

| 特征     | 深度优先搜索（DFS） | 广度优先搜索（BFS） |
| -------- | ------------------- | ------------------- |
| 遍历方式 | 深度遍历            | 广度遍历            |
| 实现方式 | 递归或栈            | 队列                |
| 内存使用 | 较多                | 较少                |
| 适用场景 | 路径查找、最大深度  | 最短路径、最短距离  |

