# 1901.寻找峰值 II

## 题目

一个 2D 网格中的 **峰值** 是指那些 **严格大于** 其相邻格子(上、下、左、右)的元素。

给你一个 **从 0 开始编号** 的 `m x n` 矩阵 `mat` ，其中任意两个相邻格子的值都 **不相同** 。找出 **任意一个 峰值** `mat[i][j]` 并 **返回其位置** `[i,j]` 。

你可以假设整个矩阵周边环绕着一圈值为 `-1` 的格子。

要求必须写出时间复杂度为 `O(m log(n))` 或 `O(n log(m))` 的算法

**示例 1:**

![img](http://assest.sablogs.cn/img/typora/1.png)

```wiki
输入: mat = [[1,4],[3,2]]
输出: [0,1]
解释: 3 和 4 都是峰值，所以[1,0]和[0,1]都是可接受的答案。
```

**示例 2:**

![img](http://assest.sablogs.cn/img/typora/3.png)

```wiki
输入: mat = [[10,20,15],[21,30,14],[7,16,32]]
输出: [1,1]
解释: 30 和 32 都是峰值，所以[1,1]和[2,2]都是可接受的答案。
```

**提示：**

- `m == mat.length`
- `n == mat[i].length`
- `1 <= m, n <= 500`
- `1 <= mat[i][j] <= 105`
- 任意两个相邻元素均不相等.

**标签：**

- 数组
- 二分查找
- 矩阵

## 思路

1. 初始化两个指针，left和right，分别指向矩阵的两侧边界。
2. 在每一次迭代中，计算中间列mid（(left + right) / 2）。
3. 检查mid列中的最大元素maxElement，以及其在该列的行索引maxIndex。
4. 如果maxElement比其相邻元素都大，则找到了一个潜在的峰值，返回[maxIndex, mid]。
5. 如果maxElement小于其左侧相邻元素，则在左半部分搜索，更新right为mid - 1。
6. 如果maxElement小于其右侧相邻元素，则在右半部分搜索，更新left为mid + 1。
7. 重复上述步骤，直到找到峰值或搜索范围缩小为零。

## 解答

### 暴力

- 时间复杂度为`O(m * n)`
- 空间复杂度是`O(1)`

```js
var findPeakGrid = function(mat) {
  const height = mat.length
  const width = mat[0].length
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      const a = mat[i-1] ? mat[i-1][j] || -1 : -1
      const b = mat[i+1] ? mat[i+1][j] || -1 : -1
      const c = mat[i][j-1] || -1
      const d = mat[i][j+1] || -1
      if (mat[i][j] > a && mat[i][j] > b && mat[i][j] > c && mat[i][j] > d){
        return [i, j]
      }
    }
  }
  return [0,0]
};
```

### 二分法

- 时间复杂度为`O(log n)`
- 空间复杂度是`O(1)`

```js
var findPeakGrid = function(mat) {
  const height = mat.length;
  const width = mat[0].length;
  let left = 0;
  let right = width - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    // 找出中间列中的最大元素及其索引
    let maxElement = Number.MIN_SAFE_INTEGER;
    let maxIndex = -1;
    for (let i = 0; i < height; i++) {
      if (mat[i][mid] > maxElement) {
        maxElement = mat[i][mid];
        maxIndex = i;
      }
    }

    // 检查maxElement是否为峰值
    const leftElement = mid > 0 ? mat[maxIndex][mid - 1] : Number.MIN_SAFE_INTEGER;
    const rightElement = mid < width - 1 ? mat[maxIndex][mid + 1] : Number.MIN_SAFE_INTEGER;

    if (maxElement > leftElement && maxElement > rightElement) {
      return [maxIndex, mid];
    } else if (maxElement < leftElement) {
      // 在左半部分搜索
      right = mid - 1;
    } else {
      // 搜索右半部分
      left = mid + 1;
    }
  }

  return [0, 0];
};

// 解答成功:
// 	执行耗时:72 ms,击败了100.00% 的JavaScript用户
// 	内存消耗:53.5 MB,击败了100.00% 的JavaScript用户
```


