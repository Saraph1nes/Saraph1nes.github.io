# async & await

## 前言

在探究`async/await`实现之前，需要先知道`generator`

> 链接：[MDC Generator DOC](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)

### 生成器函数

`function*`这种声明方式 (`function`关键字后跟一个星号）会定义一个**生成器函数** (generator function)，它返回一个 [
`Generator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator) 对象，例如。

```js
function* idMaker() {
  var index = 0;
  while (index < 3) yield index++;
}

var gen = idMaker();
console.log(gen.next().value); // 0
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2
console.log(gen.next().value); // undefined
```

### Generator对象

MDN中对于`Generator`的介绍如下

- **`Generator`**
  对象由[生成器函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/function*)
  返回并且它符合[可迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#可迭代协议)
  和[迭代器协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#迭代器协议)。
- `Generator` 是隐藏类 [
  `Iterator`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Iterator) 的子类。

他的原型链上有三个方法`next`、`return`、`throw`

简单来说就是

- 三个方法都返回包含属性 `done` 和 `value` 的对象，一般情况下

```js
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

const g = gen(); // Generator { }
g.next(); // { value: 1, done: false }
g.next(); // { value: 2, done: false }
g.next(); // { value: 3, done: false }
g.next(); // { value: undefined, done: true }
```

- `next`支持向生成器传入参数，如`next(value)`

```js
function* gen() {
  while (true) {
    const value = yield;
    console.log(value);
  }
}

const g = gen();
g.next(1); // 返回 { value: undefined, done: false }
// 这一步不会有输出：通过 `next` 发送的第一个值会被丢弃
g.next(2); // 返回 { value: undefined, done: false }
// 打印 2
```

- `return`会结束生成器，如果 `yield` 表达式包含在 [
  `try...finally`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/try...catch#finally_块)
  ，从 `finally` 块产生/返回的值。也支持向生成器传入参数，如`return(value)`

```js
function* gen() {
  try {
    yield 1;
  } finally {
    return "cleanup";
  }
}

const g1 = gen();
g1.next(); // { value: 1, done: false }
g1.return("early return"); // { value: 'cleanup', done: true }

```

- `throw`具有一个参数`exception`，如`throw(exception)`，这里的`exception`是要抛出的异常

```js
function* gen() {
  while (true) {
    try {
      yield 42;
    } catch (e) {
      console.log("捕获到错误！");
    }
  }
}

const g = gen();
g.next();
// { value: 42, done: false }
g.throw(new Error("出现了些问题"));
// "捕获到错误！"
// { value: 42, done: false }

```

## Async / Await 实现

```js
async function request() {
    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
            console.log(1);
        }, 600);
    });

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2);
            console.log(2);
        }, 400);
    });

    await new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(3);
            console.log(3);
        }, 200);
    });
}

request(); // 1 2 3
```

采用生成器 + 递归的方式实现

```js
function* request() {
    yield new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1);
            console.log(1);
        }, 600);
    });

    yield new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2);
            console.log(2);
        }, 400);
    });

    yield new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(3);
            console.log(3);
        }, 200);
    });
}

const gen = request();

function rec(g) {
    const next = g.next();
    if (next.done) {
        return;
    }
    next.value.then(() => {
        rec(g);
    });
}

rec(gen);
```

