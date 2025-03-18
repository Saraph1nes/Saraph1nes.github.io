# 2583.二叉树中的第 K 大层和

又是树的一天，脑子里都要长树了

年后就是6天班，武汉又是冻雨，又回到年前的温度了，冷死，不用上班就好了

冷完估计就到春天了吧

![2a1a08bcff72d005c95e41c98d9faab](http://assest.sablogs.cn/img/typora/2a1a08bcff72d005c95e41c98d9faab.png)

## 正文

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

