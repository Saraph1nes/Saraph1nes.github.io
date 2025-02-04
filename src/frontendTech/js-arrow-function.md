# 箭头函数

> 箭头函数表达式的语法比函数表达式更简洁，并且没有自己的 this，arguments，super 或 new.target。箭头函数表达式更适用于那些本来需要匿名函数的地方，并且它不能用作构造函数

## this

1. 箭头函数没有自己的 this 对象，内部的 this 就是定义时上层作用域中的 this，也就是说，箭头函数内部的 this 指向是固定的
2. 箭头函数的 this 不能被 call、apply、bind 改变

## 箭头函数的原型是 `undefined`

```javascript
const fn = name => {
  console.log(name);
};
console.log(fn.prototype); // undefined
```

## 箭头函数不能当成一个构造函数

```javascript
const fn = name => {
  console.log(name);
};
new fn();
// Uncaught TypeError: fn is not a constructor
```

## 不能使用 `new.target`

```javascript
const fn = () => {console.log(new.target)} // Uncaught SyntaxError: new.target expression is not allowed here
```

## 箭头函数没有 arguments 对象

```js
// 使用箭头函数的情况
const arrowFunction = () => {
  console.log(arguments); // 这里会报错，因为箭头函数没有自己的 arguments 对象
};

arrowFunction(1, 2, 3);

const arrowFunctionWithRest = (...args) => {
  console.log(args); // 这里使用剩余参数语法获取参数
};

arrowFunctionWithRest(1, 2, 3);
```

## 参考

- [MDN：箭头函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [掘金：关于 new 和箭头函数](https://juejin.cn/post/6952959678800199687)

