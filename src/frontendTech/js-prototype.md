# 原型和原型链

## 概念

- 隐式原型：`__proto__`
- 显式原型：`prototype`

## 特性

![image.png](http://assest.sablogs.cn/img/typora/03d1615d951e4195b29100faf67b9b06~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

- 对象 `__proto__` 的值等于其构造函数的 `prototype`

```js
const obj = {};
const arr = [];
const fn = function () {};

obj.__proto__ == Object.prototype; // true
arr.__proto__ === Array.prototype; // true
fn.__proto__ == Function.prototype; // true
```

- 在访问对象的某个属性时，如果这个对象本身没有，那么它会去它的 `__proto__`（构造函数的显式原型 `prototype`）中寻找

```js
const obj = { a: 1 };
obj.toString;
// ƒ toString() { [native code] }
```

## 练习

```js
function Fn() {}

const fn = new Fn();
console.log('fn.prototype', fn.prototype);
console.log('fn.__proto__', fn.__proto__);
console.log('fn.__proto__ === Fn.prototype', fn.__proto__ === Fn.prototype);

console.log('Fn.__proto__', Fn.__proto__);
console.log('Fn.prototype', Fn.prototype);
console.log('Fn.prototype.__proto__', Fn.prototype.__proto__);
console.log(
  'Fn.prototype.__proto__ === Object.prototype',
  Fn.prototype.__proto__ === Object.prototype
);

console.log('fn.constructor === Fn', fn.constructor === Fn);
console.log('Fn.constructor', Fn.constructor);
```

![image-20231126133349481](http://assest.sablogs.cn/img/typora/image-20231126133349481.png)

说明

- 在你的情况下，`Fn.__proto__` 的输出是 `ƒ () { [native code] }`，这表示 `Fn` 的原型是由 JavaScript 引擎内部实现的，而不是通过常规的 JavaScript 代码创建的。这是因为函数的原型通常由引擎实现，而不是由开发人员手动定义。

## 参考

- [掘金：面不面试的，你都得懂原型和原型链](https://juejin.cn/post/6934498361475072014)
- [掘金：2019 面试准备 - JS 原型与原型链](https://juejin.cn/post/6844903782229213197)
- [JS原型及原型链详解](https://juejin.cn/post/7251393791227543589)

## 补充

说出以下打印，为什么

```js
function Fn(){}

console.log(Function.prototype === Object.__proto__)
console.log(Fn.__proto__ === Object.__proto__)
console.log(Fn.__proto__ === Function.__proto__)
console.log(Object.__proto__ === Function.__proto__)
```

- 简单记忆，所有函数最终都收敛到`Function.prototype`，所有对象都收敛到`Object.prototype`，或者说`null`
- 在 JavaScript 中，`Fn.__proto__` 和 `Function.__proto__` 都指向 `Function.prototype`，而 `Function.prototype` 是一个原生函数的引用，因此打印它们时会显示 `ƒ () { [native code] }`。由于它们指向同一个对象，所以比较它们是否相等时会返回 `true`。