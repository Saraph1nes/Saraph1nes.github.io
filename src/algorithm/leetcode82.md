# 82.删除排序链表中的重复元素 II

## 题目

给定一个已排序的链表的头 `head` ， *删除原始链表中所有重复数字的节点，只留下不同的数字* 。返回 *已排序的链表* 。

**示例 1：**

![img](http://assest.sablogs.cn/img/typora/linkedlist1.jpg)

```js
输入：head = [1,2,3,3,4,4,5]
输出：[1,2,5]
```

**示例 2：**

![img](http://assest.sablogs.cn/img/typora/linkedlist2.jpg)

```js
输入：head = [1,1,1,2,3]
输出：[2,3]
```

**提示：**

- 链表中节点数目在范围 `[0, 300]` 内
- `-100 <= Node.val <= 100`
- 题目数据保证链表已经按升序 **排列**

**Related Topics**

- 链表
- 双指针

## 思路

- 这种删除重复的题一般都是大`while`中套小`while`
- 主要考点在于链表操作

## 解答

### TS

```ts
/**
 * Definition for singly-linked list.
 * class ListNode {
 *     val: number
 *     next: ListNode | null
 *     constructor(val?: number, next?: ListNode | null) {
 *         this.val = (val===undefined ? 0 : val)
 *         this.next = (next===undefined ? null : next)
 *     }
 * }
 */

function deleteDuplicates(head: ListNode | null): ListNode | null {
    let res = new ListNode(0, head)
    let cur = res
    while( cur.next && cur.next.next ){
        if(cur.next.val === cur.next.next.val){
            const v = cur.next.val
            while(cur.next && cur.next.val === v){
                cur.next = cur.next.next
            }
        }else{
            cur = cur.next
        }
    }
    return res.next
};
```

### GO

```go
// package main

// type ListNode struct {
// 	Val  int
// 	Next *ListNode
// }

func deleteDuplicates(head *ListNode) *ListNode {
    res := &ListNode{
        0,
        head,
    }

    cur := res

    for cur.Next != nil && cur.Next.Next != nil {
        if cur.Next.Val == cur.Next.Next.Val {
            v := cur.Next.Val
            for cur.Next != nil && v == cur.Next.Val {
                cur.Next = cur.Next.Next
            }
        } else {
            cur = cur.Next
        }
    }

    return res.Next
}
```

