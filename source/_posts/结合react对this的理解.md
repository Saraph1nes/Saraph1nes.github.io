---
title: 结合react对this的理解 
date: 2022-03-07 21:55:02
tags: js react
category: 前端
---

## 使用react的一个小Demo记录一下自己对this的理解

```js
import React, {Component} from 'react';

class Demo extends Component {
  constructor(props) {
    super(props);
    console.log('constructor', this)
  }

  render() {
    console.log('render', this)
    return (
        <div>
          <button onClick={function () {
            console.log('onClick', this)
          }}>
            按钮
          </button>
        </div>
    );
  }
}

export default Demo;
```

上面是一段jsx代码，运行一下会发现，首先 constructor 里的this指向的是Demo，render 里的this也同样指向demo。

是因为我们的constructor和render函数都是Demo调用的。

> 如果一个函数在全局环境运行，this就指向顶层对象（浏览器中为window对象）；
> 如果一个函数作为某个对象的方法运行，this就指向那个对象；
> 如果一个函数作为构造函数，this指向它的实例对象。

点击按钮，onClick里的this指向的是undefined

那么问题来了，this指向运行时所在的对象或指向定义时所在的对象，但是这个对象最后会是window，不应该是undefined，undefined是怎么来的呢？

一般来说，babel会把我们写的js文件转换成es5来运行，babel会自动给js文件上加上严格模式 "use strict"

用了 [严格模式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Strict_mode) "use strict"，严格模式下无法再意外创建全局变量，所以this不为window而为undefined

## call、apply、bind 的用法以及区别

**相同之处：**

改变函数体内 this 的指向。


**不同之处：**

call、apply的区别：接受参数的方式不一样。

**bind 不立即执行。 apply、call 立即执行。**

**第一个参数都是改变this的指向，apply 第二个参数需要传入一个数组，call ,bind 直接把参数罗列就可以了。**

## 模拟实现apply、call和bind方法

### 实现call

```js
Function.prototype.myCall = function (targetObj) {
  const args = []
  targetObj.foo = this
  // 从第二个参数开始push
  for (let i = 1; i < arguments.length; i++) {
    args.push('arguments[' + i + ']')
  }
  console.log('args', args, 'targetObj.foo(' + args + ')') //args [ 'arguments[1]', 'arguments[2]' ] targetObj.foo(arguments[1],arguments[2])
  // eval() 函数会将传入的字符串当做 JavaScript 代码进行执行。
  eval('targetObj.foo(' + args + ')')
  delete targetObj.foo;
}

function sayHi(v1, v2) {
  console.log('sayHi', this.name, v1, v2)
}

name = '红红'
person = {
  name: '绿绿'
}

sayHi(22, 33);//sayHi 红红 22 33
sayHi.myCall(person, 44, 55);//sayHi 绿绿 44 55
```


