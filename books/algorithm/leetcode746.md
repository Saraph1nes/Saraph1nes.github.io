# 746.使用最小花费爬楼梯

## 题目

给你一个整数数组 `cost` ，其中 `cost[i]` 是从楼梯第 `i` 个台阶向上爬需要支付的费用。一旦你支付此费用，即可选择向上爬一个或者两个台阶。

你可以选择从下标为 `0` 或下标为 `1` 的台阶开始爬楼梯。

请你计算并返回达到楼梯顶部的最低花费。

**示例 1：**

```js
输入：cost = [10,15,20]
输出：15
解释：你将从下标为 1 的台阶开始。
- 支付 15 ，向上爬两个台阶，到达楼梯顶部。
总花费为 15 。
```

**示例 2：**

```js
输入：cost = [1,100,1,1,1,100,1,1,100,1]
输出：6
解释：你将从下标为 0 的台阶开始。
- 支付 1 ，向上爬两个台阶，到达下标为 2 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 4 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 6 的台阶。
- 支付 1 ，向上爬一个台阶，到达下标为 7 的台阶。
- 支付 1 ，向上爬两个台阶，到达下标为 9 的台阶。
- 支付 1 ，向上爬一个台阶，到达楼梯顶部。
总花费为 6 。
```

**提示：**

- `2 <= cost.length <= 1000`
- `0 <= cost[i] <= 999`

Related Topics

- 数组

- 动态规划

## 思路

- 一眼DP，找递推式
- 因为可选择向上爬一个或者两个台阶，所以`help[n]`可以是`help[n] = help[n-1] + cost[n]`  或者  `help[n] = help[n-2] + cost[n]`，取他们的最小值`help[n] = Math.min(help[n-1] + cost[n], help[n-2] + cost[n])`
- `help[0] = cost[0]` 和  `help[1] = cost[1]`
    - `help[0] = cost[0]`只有这一种情况
    - `help[1] = cost[1]`，因为`0 <= cost[i] <= 999`，所以直接可以这么写
- 最终可以得到help为**每一项都是当前最优值的数组**

## 解答

### js

```js
/**
 * @param {number[]} cost
 * @return {number}
 */
var minCostClimbingStairs = function(cost) {
    const len = cost.length;
    const help = new Array(len)
    // help[n] = help[n-1] + cost[n]
    // or help[n] = help[n-2] + cost[n]
    // help[n] = Math.min(help[n-1] + cost[n], help[n-2] + cost[n])
    help[0] = cost[0]
    help[1] = cost[1]
    for (let i = 2; i < len; i++) {
        help[i] = Math.min(help[i-1] + cost[i], help[i-2] + cost[i])
    }
    return Math.min(help[len-1],help[len-2])
};

// 解答成功:
// 执行耗时:48 ms,击败了99.84% 的JavaScript用户
// 内存消耗:41.7 MB,击败了76.05% 的JavaScript用户
```

### go

```go
func minCostClimbingStairs(cost []int) int {
    length := len(cost)
    help := make([]int, length)
    help[0] = cost[0]
    help[1] = cost[1]

    for i := 2; i < length; i++ {
        h1 := help[i-1] + cost[i]
        h2 := help[i-2] + cost[i]
        if h1 < h2 {
            help[i] = h1
        } else {
            help[i] = h2
        }
    }

    return min(help[length-1], help[length-2])
}

func min(a, b int) int {
    if a < b {
        return a
    }
    return b
}
```


