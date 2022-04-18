---
title: leetcode记录(长更)
date: 2022-04-18 21:46:38
index_img: https://s2.loli.net/2022/04/05/jtXxbcHS6QE4Ypr.png
tags: [leetcode, 力扣, js]
category: 算法
---

## NO.002 - 两数相加

```js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    //定义一个新联表伪指针，用来指向头指针，返回结果
    let prev = new ListNode(0);
    //定义一个进位数的指针，用来存储当两数之和大于10的时候，
    let carry = 0;
    //定义一个可移动的指针，用来指向存储两个数之和的位置
    let cur = prev;
    //当l1不等于null 或 l2不等于null 就进入循环
    while(l1 !== null || l2 !== null){
        // 保持两个链表具有相同的位数,差的用0补齐
        let x = l1 === null ? 0 : l1.val;
        let y = l2 === null ? 0 : l2.val;
        //将两个链表的值，进行相加，并加上进位数
        let sum = x + y + carry;
        //计算进位数
        carry = parseInt(sum)
        //计算两个数的和，此时排除超过10的请况（大于10，取余数）
        sum = sum % 10;
        //将求和数赋值给新链表的节点，
        //注意这个时候不能直接将sum赋值给cur.next = sum。这时候会报，类型不匹配。
        //所以这个时候要创一个新的节点，将值赋予节点
        cur.next = new ListNode(sum);
        //将新链表的节点后移
        cur = cur.next;
        //当链表l1不等于null的时候，将l1 的节点后移
        if(l1 !== null){
            l1 = l1.next;
        }
        //当链表l2 不等于null的时候，将l2的节点后移
        if(l2 !== null){
            l2 = l2.next;
        } 
    }
    //如果最后两个数，相加的时候有进位数的时候，就将进位数，赋予链表的新节点。
    //两数相加最多小于20，所以的的值最大只能时1
    if(carry == 1){
        cur.next = new ListNode(carry);
    }
    //返回链表的头节点
    return prev.next;
};
```
## NO.20 括号
标准解法
```ts
function isValid(s: string): boolean {
    const stack = []
    const map = new Map([
        [')','('],
        [']','['],
        ['}','{']
    ])
    // 遍历字符串
    for(let i = 0;i<s.length;i++){
        // 正括号直接进栈
        if(map.has(s[i])){
            // 栈空 或者 没有对应符号
            if(stack.length === 0 || stack[stack.length - 1] !== map.get(s[i])){
                return false
            }
            // 反括号和栈顶对应
            if(stack[stack.length - 1] === map.get(s[i])){
                // 出栈
                stack.pop()
            }
        }else{
            stack.push(s[i])
        }
    }
    return !stack.length
};
```

牛逼解法
```ts
function isValid(s: string): boolean {
    const halfLen = Math.floor(s.length / 2)
    // 遍历字符串
    for(let i = 0;i<halfLen;i++){
        s = s.replace('{}','').replace('[]','').replace('()','')
    }
    return !s.length
};
```
