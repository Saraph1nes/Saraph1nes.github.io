# Promise

## 原理

Promise 是一个类，创建时需要传入一个执行器函数，该执行器会立即执行。

Promise 有三种状态：

- `Pending`（等待）
- `Fulfilled`（完成）
- `Rejected`（失败）

状态只能由 `Pending` 转变为 `Fulfilled` 或 `Pending` 转变为 `Rejected`，且一旦发生改变就不能再次修改。

Promise 使用 `resolve` 和 `reject` 两个函数来更改状态：

- `resolve` 用于将 Promise 从 `Pending` 状态转变为 `Fulfilled` 状态。
- `reject` 用于将 Promise 从 `Pending` 状态转变为 `Rejected` 状态。

`then` 方法是 Promise 的关键方法，其内部进行状态判断：

- 如果状态是成功（`Fulfilled`），则调用成功回调函数。
- 如果状态是失败（`Rejected`），则调用失败回调函数。

这确保了 Promise 的基本流程和状态变化机制。

## Promise.resolve

1. `Promise.resolve(42)` 相当于 `new Promise(function(resolve){ resolve(42); });`
2. 将 thenable 对象转换为 Promise 对象

## Promise.all

1. 参数为 `Promise<any>[]`
2. 返回值还是一个 Promise 对象
3. 只要有一个失败，Promise.all 就会执行 `reject()`

```js
/**
 * @param {Promise[]} promises
 */
Promise.all = promises => {
  const arr = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((p, idx) => {
      //
      Promise.resolve(p)
        .then(res => {
          arr[idx] = res;
          if (++count === promises.length) {
            resolve(arr);
          }
        })
        .catch(reject);
    });
  });
};
```

## Promise.race

1. 参数为 `Promise<any>[]`
2. 采用第一个完成了的(resolve or reject) Promise 的值

```js
Promise.race = promises => {
  return new Promise((resolve, reject) => {
    promises.forEach(p => Promise.resolve(p).then(resolve, reject));
  });
};
```

## Promise.any

与 Promise.all 可以看做是相反的。Promise.any 中只要有一个 Promise 实例成功就成功，只有当所有的 Promise 实例失败时 Promise.any 才失败，此时 Promise.any 会把所有的失败/错误集合在一起，返回一个失败的  promise 和 AggregateError 类型的实例

```js
Promise.any = promises => {
  const errs = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((p, idx) => {
      Promise.resolve(p).then(resolve, err => {
        errs[idx] = err;
        if (++count === promises.length) {
          reject(new AggregateError(errs));
        }
      });
    });
  });
};
```

## Promise.allSettled

1. 参数为 `Promise<any>[]`
2. 返回所有 Promise 执行后的返回结果，对于每个结果对象，都有一个 status 字符串。如果它的值为 fulfilled，则结果对象上存在一个 value 。如果值为 rejected，则存在一个 reason 。value（或 reason ）反映了每个 promise 决议（或拒绝）的值。

```js
Promise.allSettled = promises => {
  /**
   * @type {{status: 'fulfilled' | 'rejected', reason?: any, value?:any}[]}
   */
  const arr = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((p, idx) => {
      Promise.resolve(p)
        .then(res => {
          arr.push({
            status: 'fulfilled',
            value: res
          });
        })
        .catch(err => {
          arr.push({
            status: 'rejected',
            reason: err
          });
        })
        .finally(e => {
          if (++count === promises.length) {
            resolve(arr);
          }
        });
    });
  });
};
```

## 参考

- [掘金：字节飞书面试——请实现 promise.all](https://juejin.cn/post/7069805387490263047)

