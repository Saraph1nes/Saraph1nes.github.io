# 2583.二叉树中的第 K 大层和

开始解题

看完题，首先可以想到，肯定是层序遍历，同时记录下每层总和，找到第k大的层总和

拿下！

```js
var kthLargestLevelSum = function (root, k) {
    const queue = [root]
    const countLevelArray = []

    while (queue.length > 0) {
        const levelLength = queue.length;
        let acc = 0

        for (let i = 0; i < levelLength; i++) {
            const node = queue.pop()
            node.left && queue.unshift(node.left)
            node.right && queue.unshift(node.right)
            acc += node.val
        }

        countLevelArray.push(acc)
    }

    return countLevelArray.sort((a, b) => b - a)[k - 1] || -1
};
```

