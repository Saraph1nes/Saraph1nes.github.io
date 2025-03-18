# 643.子数组最大平均数 I

## 题目

给你一个由 `n` 个元素组成的整数数组 `nums` 和一个整数 `k` 。

请你找出平均数最大且 **长度为 `k`** 的连续子数组，并输出该最大平均数。

任何误差小于 `10-5` 的答案都将被视为正确答案。

示例 1：

```wiki
输入：nums = [1,12,-5,-6,50,3], k = 4
输出：12.75
解释：最大平均数 (12-5-6+50)/4 = 51/4 = 12.75
```

示例 2：

```wiki
输入：nums = [5], k = 1
输出：5.00000
```

提示：

- `n == nums.length`
- `1 <= k <= n <= 105`
- `-104 <= nums[i] <= 104`

Related Topics

- 数组
- 滑动窗口

## 思路

滑动窗口算法是一种用于解决数组或字符串的子数组或子串问题的有效技巧。它通过维护一个固定大小的窗口，并在窗口上进行滑动来寻找解决方案。该算法通常用于解决子数组和子串的最大值、最小值、平均值等问题。

以下是滑动窗口算法的基本思路：

1. **初始化窗口：** 定义一个窗口，通常是一个连续的子数组或子串，并在数组或字符串上滑动这个窗口。
2. **窗口滑动：** 通过改变窗口的起始位置或结束位置，使窗口在数组或字符串上滑动。这意味着在每一步中，我们移除窗口的一个元素，并向右添加一个新元素。
3. **维护状态：** 在滑动窗口的过程中，维护窗口内部的状态。这可能包括计算窗口内的和、平均值、最大值、最小值等。
4. **更新解：** 根据窗口内部的状态，更新问题的解。例如，在寻找最大子数组和的问题中，每次窗口滑动时，更新当前的最大和。
5. **处理边界条件：** 在滑动窗口的过程中，需要注意边界条件，确保窗口不越界。

## 解答

### js

```js
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findMaxAverage = function(nums, k) {
    let sum = 0;
    const n = nums.length;
    for (let i = 0; i < k; i++) {
        sum += nums[i];
    }
    let maxSum = sum;
    for (let i = k; i < n; i++) {
        sum = sum - nums[i - k] + nums[i];
        maxSum = Math.max(maxSum, sum);
    }
    return maxSum / k;
};
```

### go

```go
func getMax(a int, b int) int {
	if a > b {
		return a
	}
	return b
}

func findMaxAverage(nums []int, k int) float64 {
	sum := 0
	n := len(nums)
	for i := 0; i < k; i++ {
		sum += nums[i]
	}
	maxSum := sum
	for i := k; i < n; i++ {
		sum = sum - nums[i-k] + nums[i]
		maxSum = getMax(maxSum, sum)
	}
	return float64(maxSum) / float64(k)
}
```

