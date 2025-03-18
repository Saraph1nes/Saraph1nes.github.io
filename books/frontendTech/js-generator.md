# Generator

随着现代Web应用程序的复杂性不断增加，JavaScript作为一门动态且灵活的语言也在不断演进。在这个演进的过程中，ECMAScript 2015（通常称为ES6）为JavaScript引入了许多令人兴奋的新特性，其中之一就是Generator（生成器）。

JavaScript中的迭代器是一种强大的概念，它使得处理序列数据变得更加简单和灵活。Generator不仅仅是迭代器的一种实现，它引入了一种新的编程范式，允许我们以更直观和异步的方式编写代码。

## Generator函数

要创建一个Generator函数，我们使用 `function*` 来声明。

```javascript
function* myGenerator() {
  // 函数体
}
```

## yield关键字

在Generator函数内部，我们可以使用 `yield` 关键字，它的作用是将执行权暂时交还给调用者，并产生一个值。

```javascript
function* myGenerator() {
  yield 1;
  yield 2;
  yield 3;
}
```

上述例子中，每次调用Generator函数，它都会在 `yield` 处暂停，产生一个值，直到下一次调用才会继续执行。

## Generator.prototype.next()

生成器函数是分段执行的，每次调用 `next()` 方法，函数就执行一步，到下一个 `yield` 或 `return`，因此我们可以理解为 `yield` 是函数暂停，`return` 是函数完成。

每一次调用 `next()` 其返回值为：

- value：返回值，`yield` 或 `return` 关键字右侧的返回值。
- done：生成器的状态，当结果为 `true` 时，标志着生成器函数已经执行完成，如果继续调用返回的 value 为 `undefined`。

调用Generator函数并不会立即执行它的代码，而是返回一个**迭代器对象**。我们可以使用这个对象来控制Generator函数的执行。

```javascript
const generator = myGenerator();
console.log(generator.next()); // { value: 1, done: false }
console.log(generator.next()); // { value: 2, done: false }
console.log(generator.next()); // { value: 3, done: false }
console.log(generator.next()); // { value: undefined, done: true }
```

通过 `next()` 方法，我们可以逐步执行Generator函数的代码，并观察每次 `yield` 的返回值。

## 传递参数

Generator函数可以接受参数，这使得我们能够动态地影响生成器的行为。

```javascript
function* generatorWithParams(param) {
  yield param * 2;
  yield param * 3;
}

const generator = generatorWithParams(5);
console.log(generator.next()); // { value: 10, done: false }
console.log(generator.next()); // { value: 15, done: false }
```

再看一个

```js
function* gen() {
  const x = yield 1; // 此时暂停，返回 { value: 1, done: false }
  console.log(x);    // 在下一次调用 next() 时，x 被赋值为传入的参数，即 undefined
}

const g = gen();
console.log(g.next()); // 打印结果: { value: 1, done: false }
console.log(g.next()); // 打印结果: undefined，因为 x 被赋值为传入的参数，即 undefined
```

解释：

`yield` 表达式本身没有返回值（`undefined`）。`next()` 可以带一个参数，该参数就会被当作上一个 yield 表达式的返回值。

```js
function* gen() {
  const x = yield 1;
  console.log(x);
  return 4;
}
const g = gen();
console.log(g.next(2));
// { value: 1, done: false }

console.log(g.next(3));
// x: 3   调用时传递的值
// { value: 4, done: false }  return 返回的值
```

## for...of

值得注意的是，for...of 在执行过程中不会执行 return 语句

```js
function* gen() {
  yield 1;
  yield 2;
  return 3;
}

for (const g of gen()) {
  console.log(g);
}
// 1 2
```

## 练习题

```js
function* generatorFn(i) {
  console.log('i: ', i);                // 打印结果: i: 10
  const j = 5 * (yield i * 10);
  console.log('j: ', j);                // 打印结果: j: 50
  const k = yield (2 * j) / 4;
  console.log('k: ', k);                // 打印结果: k: 5
  return i + j + k;
}

const gen = generatorFn(10);
console.log(gen.next(20));               // 打印结果: { value: 100, done: false }
console.log(gen.next(10));               // 打印结果: { value: 25, done: false }
console.log(gen.next(5));                // 打印结果: { value: 65, done: true }
```

解释

1. `gen.next(20)` 开始执行生成器，打印 'i: 10'，然后执行 `yield i * 10`，接收传入的参数20，计算得到100，返回 `{ value: 100, done: false }`。此时生成器暂停在 `const j = 5 * 100;` 处。
2. `gen.next(10)` 继续执行生成器，调用 `next(10)`时， 将整个第一个 `yield` 表达式替换为 10，打印 'j: 50'，然后执行 `yield (2 * j) / 4`，接收传入的参数10，计算得到25，返回 `{ value: 25, done: false }`。此时生成器暂停在 `const k = yield (2 * j) / 4;` 处。
3. `gen.next(5)` 继续执行生成器，调用 `next(5)`时，将整个第二个 `yield` 替换为 5，打印 'k: 5'，然后执行到函数末尾，返回 `{ value: 65, done: true }`。生成器执行完毕，最后的返回值是 `i + j + k`，即 `10 + 50 + 5 = 65`。

## Generator.prototype.throw()

与 `next()` 相似，Generator 生成的实例可以通过调用 `throw()` 方法来抛出错误。

```javascript
function* gen() {
    try {
        yield 1;
        yield 2;
        yield 3;
    } catch (e) {
        console.log('捕获错误: ', e.message);
    }
}

const g = gen();
console.log(g.next());
// { value: 1, done: false }
console.log(g.throw(new Error('出错了')));
// 捕获错误:  出错了
// { value: undefined, done: true }
console.log(g.next());
// { value: undefined, done: true }
```

## Generator.prototype.return()

同样的，还有个 `return` 方法，用来提前结束迭代。

```js
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

const g = gen();
console.log(g.next()); // { value: 1, done: false }
console.log(g.return(4)); // { value: 4, done: true }
console.log(g.next()); // { value: undefined, done: true }
```

## yield*

在生成器函数中使用`yield*`时，会委托另一个生成器函数。

```javascript
function* inner() {
    yield 4;
    yield 5;
}

function* outer() {
    yield 1;
    yield 2;
    yield* inner();
    yield 3;
}

for (const v of outer()) {
    console.log(v);
}

// 1 2 4 5 3
```

## 参考

- [A Simple Guide to Understanding Javascript (ES6) Generators](https://medium.com/dailyjs/a-simple-guide-to-understanding-javascript-es6-generators-d1c350551950)

