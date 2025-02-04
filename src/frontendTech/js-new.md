# new 操作符

## new 的实现

```javascript
function _new(constructor, ...args) {
    // 1. 创建一个空对象
    const obj = {};

    // 2. 改变 this 指向，执行构造函数
    const res = constructor.apply(obj, args);

    // 3. 将新对象的隐式原型指向构造函数的显式原型
    obj.__proto__ = constructor.prototype;

    // 在 JavaScript 中，构造函数可以有不同的行为，有的可能返回一个新创建的对象，而有的可能返回其他类型的值（比如基本数据类型）。
    // 通过 instanceof Object 检查，可以确保返回的是一个对象。
    return res instanceof Object ? res : obj;
}
```

## new.target

**强制使用 `new`：** 通过这种方式，开发者在使用 `Foo` 构造函数时必须使用 `new` 关键字，否则会抛出异常。这有助于防止开发者在不使用 `new` 的情况下调用构造函数，导致意外的行为或错误。

```javascript
function Foo() {
    if (!new.target) throw 'Foo() must be called with new';
    console.log('Foo instantiated with new');
}

Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new"
```

## 参考

- [mdn: new](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/new.target)

