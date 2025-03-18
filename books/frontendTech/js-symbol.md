# Symbol

Symbol 是一个原始值类型，`Symbol()` 函数会返回 **symbol** 类型的值，创建的值是**唯一的**。

## 用法

Symbol()函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述。这主要是为了在控制台显示，或者转为字符串时，比较容易区分。

```javascript
var sym1 = Symbol();
var sym2 = Symbol('foo'); // Symbol(foo)

Symbol('foo') === Symbol('foo'); // false

// 不支持 new 方法
var sym = new Symbol(); // TypeError

// 不支持与其他类型直接计算
'your symbol is ' + sym; // TypeError: can't convert symbol to string
```

> **注意**
>
> 当使用 JSON.stringify() 时，以 symbol 值作为键的属性会被完全忽略：
>
> ```javascript
> JSON.stringify({ [Symbol('foo')]: 'foo' });
> // '{}'
> ```
>
>

获取 Symbol

```javascript
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols);
// [Symbol(a), Symbol(b)]
```

## 场景

1. 作为属性名，避免命名冲突
2. js 中没有私有属性、方法，可以用 `Symbol` 模拟出类似的效果。

## 简易实现

```javascript
const genUniqueName = (function () {
  let id = 0;
  return function (description) {
    return '@@' + description + '_' + id++;
  };
})();
function SymbolPolyfill(description) {
  if (this instanceof Symbol)
    throw new TypeError('Symbol is not a constructor');

  const symbol = {
    toString() {
      return this.__Name__;
    }
  };
  Object.defineProperties(symbol, {
    __Name__: {
      value: genUniqueName(description),
      writable: false,
      configurable: false,
      enumerable: false
    },
    __Description__: {
      value: description,
      writable: false,
      configurable: false,
      enumerable: false
    }
  });
  return symbol;
}

var a = SymbolPolyfill('foo');
var b = SymbolPolyfill('foo');

console.log(a === b); // false

console.log(a.toString());

var o = {};
o[a] = 'hello';
o[b] = 'hi';

console.log(o); // Object { "@@foo_1": "hello", "@@foo_2": "hi" }
```

## 参考

- [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [掘金：ES6 系列之模拟实现 Symbol 类型](https://juejin.cn/post/6844903619544760328)