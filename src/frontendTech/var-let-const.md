# var、let、const

## var

1. 函数作用域,作用域是全局或者整个函数快的
2. 可重复声明
3. 全局变量声明的 var 相当于挂载到 window

```js
var a = 112;
window.a; // 112
```

1. 变量提升

```js
var a = 99; // 全局变量a
f(); // f是函数，虽然定义在调用的后面，但是函数声明会提升到作用域的顶部。
console.log(a); // a=>99,  此时是全局变量的a
function f() {
    console.log(a); // 当前的a变量是下面变量a声明提升后，默认值undefined
    var a = 10;
    console.log(a); // a => 10
}
/**
 * 因为变量提升，可以理解全局只有一个 y 变量，每次循环是改变 y 的值，
 * 所以异步输出的都是最后一次执行的 y 的值
 */
for (var y = 0; y < 4; y++) {
    setTimeout(function () {
        console.log(y); // 4 4 4 4
    }, 1000);
    console.log('var', y); // 变量正常输出
}
console.log('yyyy', y); // 由于var可使变量提升，所以打印出的值为for循环中最后输出的值 yyyy 4
```

---



## let

1. 块级作用域
2. 不能重复声明
3. let 声明的变量在执行上下文创建阶段只会被创建，不会被初始化，因此对于执行阶段来说，如果在定义前使用则会报错，相当于使用了未被初始化的变量

```js
for (let x = 0; x < 4; x++) {
  console.log('let', x); // 变量正常输出
}
console.log('let', x); // 报错，提示x没有被定义
```

---



## const

1. 常量就是一旦定义完就不能修改的值
2. 常量定义必须初始化值，如果不初始化值就会报错。
3. 块级作用域
4. 不能重复声明

```js
const a = "111"
const b; // 报错 常量未初始化
```

---



## 暂时性死区

在代码块内，使用 `let` `const` 命令声明变量之前，该变量都是不可用的。这在语法上，称为 **暂时性死区**

```js
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}
```

---



## 用 var 实现 let

使用匿名函数创建一个作用域，将变量保存起来

```js
for (var y = 0; y < 4; y++) {
  (function (arg) {
    setTimeout(function () {
      console.log('var => let: ', arg); // 4 4 4 4
    }, 1000);
  })(y);
}
```

---



## 总结

### var 的特点

1. 在全局上定义时，会被挂在 `window` 上
2. 变量提升
3. 可以重复声明

### let、const

1. 解决了污染全局命名空间的问题
2. 与变量提升不同，会存在暂时性死区
3. 无法重复声明
4. 增加了块级作用域

## 参考

- [阮一峰：es6 入门](https://es6.ruanyifeng.com/#docs/let)
- [掘金：简述 const、let、var 的区别，练习用 var 实现 let](https://juejin.cn/post/7008043288552800286)