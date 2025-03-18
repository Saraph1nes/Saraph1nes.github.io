# EventLoop & Promise

## 第一题

考点：`Promise`基础

```js
const promise = new Promise((resolve, reject) => {
    console.log(1);
    resolve();
    console.log(2);
    reject('error');
})
promise.then(() => {
    console.log(3);
}).catch(e => console.log(e))
console.log(4);
```

## 第二题

考点：`Promise`基础

```js
const promise = new Promise((resolve, reject) => {
        setTimeout(() => {
             console.log('once')
             resolve('success')
        }, 1000)
 })
promise.then((res) => {
       console.log(res)
     })
promise.then((res) => {
     console.log(res)
 })
```

## 第三题

考点：`Event Loop` 与 `Promise`

```js
const p1 = () => (new Promise((resolve, reject) => {
 console.log(1);
 let p2 = new Promise((resolve, reject) => {
  console.log(2);
  const timeOut1 = setTimeout(() => {
   console.log(3);
   resolve(4);
  }, 0)
  resolve(5);
 });
 resolve(6);
 p2.then((arg) => {
  console.log(arg);
 });

}));
const timeOut2 = setTimeout(() => {
 console.log(8);
 const p3 = new Promise(reject => {
  reject(9);
 }).then(res => {
  console.log(res)
 })
}, 0)


p1().then((arg) => {
 console.log(arg);
});
console.log(10);
```

## 第四题

考点：`.then` 或者 `.catch` 的参数期望

```js
Promise.resolve(1)
.then(2)
.then(Promise.resolve(3))
.then(console.log)
```

## 思考：如何取消一个`promise`

考点：采用`Promise.race`的特性

```js
function wrap(p) {
    let obj = {};
    let p1 = new Promise((resolve, reject) => {
        obj.resolve = resolve;
        obj.reject = reject;
    });
    obj.promise = Promise.race([p1, p]);
    return obj;
}

let promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve(123);
    }, 1000);
});
let obj = wrap(promise);
obj.promise.then((res) => {
    console.log(res);
});
// obj.resolve("请求被拦截了");
```

