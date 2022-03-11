---
title: call、apply、bind的用法以及区别
date: 2022-03-11 09:43:46
tags: js
category: 前端
---

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

上方可以实现带参数的call，也有更简单的方法实现

```js
Function.prototype.myCall = function (targetObj) {
  const args = [...arguments].slice(1)// 从第二个参数开始放入数组
  targetObj.foo = this // 将sayHi函数作为传入对象的foo属性
  targetObj.foo(...args)// 使用函数，并将参数传入
}

function sayHi(v1, v2) {
  console.log('sayHi', this.name, v1, v2)
  return v1 + v2
}

name = '红红'
person = {
  name: '绿绿'
}

console.log('say1', sayHi(22, 33));
;//sayHi 红红 22 33
console.log('say1', sayHi.myCall(person, 44, 55));//sayHi 绿绿 44 55
```

方法实现到这里，还需要处理一些细节问题，如果第一个参数为 null 或者 undefined (没传值)呢？ 如果sayHi()有返回值呢 ？ 不难想到，对入参和返回值进行判断就可以了，代码如下

```js
Function.prototype.myCall = function (targetObj) {
  const args = [...arguments].slice(1)// 从第二个参数开始放入数组
  targetObj = targetObj || window // 注意，js代码要放在浏览器运行，window是web浏览器中才有的对象，执行环境node会报window is not defined
  targetObj.foo = this // 将sayHi函数作为传入对象的foo属性
  return targetObj.foo(...args)// 使用函数，并将参数传入
}

function sayHi(v1, v2) {
  if (v1 && v2) {
    console.log('sayHi', this.name, v1, v2)
    return v1 + v2
  } else {
    console.log('just say name', this.name)
  }
}

name = '红红'
person = {
  name: '绿绿'
}

console.log('say1', sayHi(22, 33));
console.log('say2', sayHi.myCall({person}, 44, 55));
sayHi.myCall()

/**
 * 输出
 * sayHi 红红 22 33
 * say1 55
 * sayHi 绿绿 44 55
 * say2 99
 * just say name 红红
 */
```

### 实现apply

apply 和 call的作用完全一致，只是入参是一个数组。

```js
Function.prototype.myApply = function () {
  let targetObj = arguments[0];
  const array = arguments[1];
  targetObj = targetObj || window
  targetObj.foo = this
  //判断第二个参数是不是 null or undefiend
  const result = array == null ? targetObj.foo(array) : targetObj.foo(...array)
  delete targetObj.foo
  return result
}

name = '红红'
person = {
  name: '绿绿'
}

function sayHi(v1, v2) {
  if (v1 && v2) {
    console.log('sayHi', this.name, v1, v2)
    return v1 + v2
  } else {
    console.log('just say name', this.name)
  }
}

sayHi.myApply(person, [11, 22]) // sayHi 绿绿 11 22
sayHi.myApply() // just say name 红红
```

### 实现bind

```js
Function.prototype.myBind = function (targetObj) {
  const arr = [...arguments].slice(1)
  targetObj.foo = this
  return function () {
    return targetObj.foo.apply(targetObj, arr)
  }
}

name = '红红'
person = {
  name: '绿绿'
}

function sayHi(v1, v2) {
  console.log('sayHi', this.name, v1, v2)
}

sayHi(11, 22)// sayHi 红红 11 22
sayHi.myBind(person, 33, 44)() // sayHi 绿绿 33 44
```

## 总结

- call、apply、bind都可以改变函数运行时的上下文（this）
- 如果对传入的参数不确定，推荐使用apply
- 对于有明确规定的参数，推荐使用call，当然这也是最常用的
- 对于想先绑定一个新函数，不立马执行的，推荐bind
