# 765.情侣牵手

今天双11，但我感觉好像一个月前双11活动就开始了，今天居然才是双11

我的思路是贪心，代码如下

```javascript
var minSwapsCouples = function(row) {
  const swap = (arr, a, b) => {
    let cur = arr[a]
    arr[a] = arr[b]
    arr[b] = cur
  }


  let len = row.length;
  let res = 0;
  let cache = [];

  // cache方便查找对应值的索引是多少
  for (let i = 0; i < len; i++) {
    cache[row[i]] = i;
  }

  // 遍历情侣对
  for (let i = 0; i < len - 1; i += 2) {
    // 情侣对第一个数的值
    let a = row[i];
    // 排列完成后，左边肯定是偶数，右边为奇数，当a为偶数时，b为a+1，a为奇数时，b为a-1
    let b = a ^ 1;

    // 如果row[i + 1] === b，说明这一组已经在最终位置了
    // 如果row[i + 1] !== b，说明需要换位置
    if (row[i + 1] !== b) {
      // src是当前位置后一位置索引
      let src = i + 1
      // tar是最终值在row中的索引
      let tar = cache[b]

      // 交换元素之前同步cache
      cache[row[tar]] = src
      cache[row[src]] = tar

      // 交换并计数
      swap(row, src, tar)
      res++;
    }
  }

  return res;
};
```
