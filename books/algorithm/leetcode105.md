# 构造二叉树

## 序列特点

| 遍历序列 | 根节点的位置 | 划分左右子树的方式                             | 主要特点                                   |
| -------- | ------------ | ---------------------------------------------- | ------------------------------------------ |
| 前序     | 第一个节点   | 利用中序找到根节点位置，在前序中截取，然后递归 | 根节点在序列最前面，适合确定根节点         |
| 中序     | 中间         | 根节点左侧是左子树，右侧是右子树               | 中序遍历序列给出了左右子树的具体顺序和大小 |
| 后序     | 最后一个节点 | 利用中序找到根节点位置，在后序中截取，然后递归 | 根节点在序列最后面，适合确定根节点         |

## 前序与中序构造二叉树

### 思路

- 前序遍历序列的第一个元素是树的根节点
- 在中序遍历序列中，根节点的位置将把序列分成左右两个子树的序列
- 递归构建左右子树
    - 根据中序遍历中根节点的位置，将前序遍历和中序遍历序列分成左右两个子序列
    - 左子序列对应左子树，右子序列对应右子树
    - 对左右子序列递归执行以上步骤，构建左右子树

### 实现

```js
var buildTree = function (preorder, inorder) {
    if (!preorder.length || !inorder.length) {
        return null
    }
    const rootVal = preorder[0]
    const root = new TreeNode(rootVal)

    const inorderRootIdx = inorder.findIndex(i => i === rootVal);

    // 利用中序的特点，中序根节点左侧为左节点，右侧为右节点
    // 知道个数后，可以去前序截取
    // 前序从左往右先是根节点、然后是左子树、然后是右子树
    // 所以左子树除去根节点，从1开始
    const leftNodeList = preorder.slice(1, inorderRootIdx + 1)
    // 右子树从左子树后开始
    const rightNodeList = preorder.slice(inorderRootIdx + 1)

    root.left = buildTree(leftNodeList, inorder.slice(0, inorderRootIdx));
    root.right = buildTree(rightNodeList, inorder.slice(inorderRootIdx + 1));

    return root
};
```

## 后序与中序构造二叉树

### 思路

- 在后序遍历序列中找到根节点，即最后一个节点。
- 在中序遍历序列中找到根节点的位置，根节点左边的部分为左子树，右边的部分为右子树。
- 根据中序遍历中根节点的位置，可以得知左子树和右子树的节点个数。
- 递归地构建左子树和右子树，直到左右子树为空或者只有一个节点。
- 返回根节点，递归构建完成整个二叉树。

### 实现

```js
var buildTree = function (inorder, postorder) {
    if (!inorder.length || !postorder.length) {
        return null
    }

    const rootVal = postorder[postorder.length - 1]
    const root = new TreeNode(rootVal)

    const rootInorderIdx = inorder.findIndex(i => i === rootVal);

    // 利用中序的特点，中序根节点左侧为左节点，右侧为右节点
    // 知道个数后，可以去后序截取
    // 后序从右往左是根节点、右子树、左子树
    // 所以左子树从0开始
    const postorderLeft = postorder.slice(0, rootInorderIdx);
    // 右子树从左子树后开始，并出去根节点
    const postorderRight = postorder.slice(rootInorderIdx, postorder.length - 1);

    root.left = buildTree(inorder.slice(0, rootInorderIdx), postorderLeft)
    root.right = buildTree(inorder.slice(rootInorderIdx + 1), postorderRight)

    return root;
};
```

## 前序与后序构造二叉树

### 思路

- 确定根节点：
    - 在前序遍历序列中，第一个节点即为根节点。
- 确定左子树和右子树：
    - 利用前序遍历序列和后序遍历序列的性质，可以确定左子树和右子树的范围。
    - 在前序遍历序列中，根节点后面的节点是左子树的节点，而在后序遍历序列中，根节点前面的节点是左子树的节点。
    - 利用这一性质，我们可以在前序遍历序列和后序遍历序列中确定左子树和右子树的范围。
- 递归构造左子树和右子树：
    - 根据确定的左子树和右子树的范围，在前序遍历序列和后序遍历序列中递归地构造左子树和右子树。

### 实现

#### js

```js
var constructFromPrePost = function (preorder, postorder) {
    if (!preorder.length || !postorder.length) {
        return null
    }

    const rootVal = preorder[0]
    const root = new TreeNode(rootVal)

    // 找到左子树和右子树

    // 先序的后一位就是左子树根
    // 后序在左子树根右侧，根节点左侧，就是所有的左子树节点

    const leftTreeNodeVal = preorder[1];
    const postorderLeftTreeNodeIdx = postorder.findIndex(i => i === leftTreeNodeVal);

    // 首先，postorderLeftTreeNodeIdx表示左子树根节点在后序遍历数组中的索引。
    // 在后序遍历中，左右根，子节点排列在根节点的左侧。
    // 左子树的节点数量是postorderLeftTreeNodeIdx + 1（包含根节点）
    // 因此，在先序遍历中，右子树的节点起始索引为postorderLeftTreeNodeIdx + 1。
    // 右子树的下一个节点是根节点的下一个节点，因此右子树的起始索引为postorderLeftTreeNodeIdx + 1 + 1
    // 简化为postorderLeftTreeNodeIdx + 2。
    const preorderRightTreeNodeIdx = postorderLeftTreeNodeIdx + 2;

    // 处理成子树的前序和后序
    const preorderLeft = preorder.slice(1, preorderRightTreeNodeIdx);
    const preorderRight = preorder.slice(preorderRightTreeNodeIdx);

    const postorderLeft = postorder.slice(0, postorderLeftTreeNodeIdx + 1);
    const postorderRight = postorder.slice(postorderLeftTreeNodeIdx + 1, -1);

    root.left = constructFromPrePost(preorderLeft, postorderLeft);
    root.right = constructFromPrePost(preorderRight, postorderRight);

    return root
};
```

#### golang

```go
func constructFromPrePost(preorder []int, postorder []int) *TreeNode {
	if len(preorder) == 0 || len(postorder) == 0 {
		return nil
	}

	rootVal := preorder[0]
	root := &TreeNode{Val: rootVal}

	if len(preorder) == 1 {
		return root
	}

	leftTreeNodeVal := preorder[1]
	postorderLeftTreeNodeIdx := indexOf(postorder, leftTreeNodeVal)

	preorderRightTreeNodeIdx := postorderLeftTreeNodeIdx + 2

	preorderLeft := preorder[1:preorderRightTreeNodeIdx]
	preorderRight := preorder[preorderRightTreeNodeIdx:]

	postorderLeft := postorder[:postorderLeftTreeNodeIdx+1]
	postorderRight := postorder[postorderLeftTreeNodeIdx+1 : len(postorder)-1]

	root.Left = constructFromPrePost(preorderLeft, postorderLeft)
	root.Right = constructFromPrePost(preorderRight, postorderRight)

	return root
}

func indexOf(arr []int, val int) int {
	for i, v := range arr {
		if v == val {
			return i
		}
	}
	return -1
}
```

## 总结

| 遍历序列 | 确定根节点方法             | 确定左右子树方法                       |
| -------- | -------------------------- | -------------------------------------- |
| 前序     | 前序遍历序列的第一个节点   | 中序遍历中根节点的位置确定左右子树范围 |
| 后序     | 后序遍历序列的最后一个节点 | 中序遍历中根节点的位置确定左右子树范围 |
| 前序     | 前序遍历序列的第一个节点   | 后序遍历确定左右子树的范围             |

