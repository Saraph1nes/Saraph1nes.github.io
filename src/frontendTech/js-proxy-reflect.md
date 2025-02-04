# Proxy & Reflect

## 代理 Proxy

Proxy 对象用于创建一个对象的代理，从而实现基本操作的拦截和自定义（如属性查找、赋值、枚举、函数调用等）。

### 方法

- `get(target, propKey, receiver)`：拦截对象属性的读取，比如 proxy.foo 和 proxy['foo']。
- `set(target, propKey, value, receiver)`：拦截对象属性的设置，比如 proxy.foo = v 或 proxy['foo'] = v，返回一个布尔值。
- `has(target, propKey)`：拦截 propKey in proxy 的操作，返回一个布尔值。
- `deleteProperty(target, propKey)`：拦截 delete proxy[propKey]的操作，返回一个布尔值。
- `ownKeys(target)`：拦截 Object.getOwnPropertyNames(proxy)、Object.getOwnPropertySymbols(proxy)、Object.keys(proxy)、for...in 循环，返回一个数组。该方法返回目标对象所有自身的属性的属性名，而 Object.keys()的返回结果仅包括目标对象自身的可遍历属性。
- `getOwnPropertyDescriptor(target, propKey)`：拦截 Object.getOwnPropertyDescriptor(proxy, propKey)，返回属性的描述对象。
- `defineProperty(target, propKey, propDesc)`：拦截 Object.defineProperty(proxy, propKey, propDesc）、Object.defineProperties(proxy, propDescs)，返回一个布尔值。
- `preventExtensions(target)`：拦截 Object.preventExtensions(proxy)，返回一个布尔值。
- `getPrototypeOf(target)`：拦截 Object.getPrototypeOf(proxy)，返回一个对象。
- `isExtensible(target)`：拦截 Object.isExtensible(proxy)，返回一个布尔值。
- `setPrototypeOf(target, proto)`：拦截 Object.setPrototypeOf(proxy, proto)，返回一个布尔值。如果目标对象是函数，那么还有两种额外操作可以拦截。
- `apply(target, object, args)`：拦截 Proxy 实例作为函数调用的操作，比如 proxy(...args)、proxy.call(object, ...args)、proxy.apply(...)。
- `construct(target, args)`：拦截 Proxy 实例作为构造函数调用的操作，比如 new proxy(...args)。

```js
function code1() {
    const obj = { name: 'Saraph1nes' };
    const handler = {
        get(obj, property) {
            console.log('get', obj, property);
            return obj[property];
        },
        set(obj, property, value) {
            console.log('set', obj, property);
            obj[property] = value;
        }
    };

    const proxy = new Proxy(obj, handler);

    console.log(proxy.name); // Saraph1nes
    proxy.name = 'ccc';
    console.log(proxy.name); // ccc

    // 注意
    Proxy.prototype; // undefined

    proxy.__proto__ === Object.prototype; // true
}
```

## 反射 Reflect

反射是指在运行时检查、访问和修改对象的能力

### 1. 将 Object 对象的一些方法放到 Reflect 对象上：

在ES6中，一些操作对象的方法被移到了Reflect对象上，比如`Object.defineProperty`。这样的改变有几个目的：

- **统一接口：** 将操作对象的方法集中到一个对象上，使得代码更加一致和统一。

- **防止命名冲突：** 将方法移到Reflect对象上，避免了在Object上可能存在的命名冲突。

  举例来说，老写法是这样的：

  ```js
  try {
    Object.defineProperty(target, property, attributes);
    // success
  } catch (e) {
    // failure
  }
  ```

  新写法使用Reflect对象：

  ```js
  if (Reflect.defineProperty(target, property, attributes)) {
    // success
  } else {
    // failure
  }
  ```

### 2. 修改某些 Object 方法的返回结果：

在某些情况下，ES6还修改了一些Object方法的返回结果，使其更加合理。比如，将`Object.defineProperty`的返回值从Boolean类型改为一个对象。

这样的改变使得我们更容易获取操作的详细信息，而不再依赖于异常处理。在Reflect对象上，方法的返回结果更加具有统一性和可操作性。

**函数式编程和 Proxy：**

在函数式编程方面，通过检查Reflect对象上的方法是否存在，可以更方便地进行函数式的编程风格，比如你提到的`'assign' in Object`可以改写为`Reflect.has(Object, 'assign')`。

此外，Reflect对象上的方法和Proxy对象上的方法是一一对应的，这为使用Proxy提供了更加方便的接口。通过Reflect对象，我们可以方便地获取和调用对象的默认行为，使得Proxy的使用更加灵活和强大。

总体而言，JavaScript的反射机制通过Reflect对象的引入，使得对象操作变得更加统一和灵活，同时也为函数式编程和Proxy的使用提供了更好的支持。

## 为什么 Proxy 要和 Reflect 配合使用？

答：为了解决 proxy 存在的问题，如下

1. get 陷阱，当一个对象继承自一个代理对象时，其 get 会错误

```js
function foo() {
    const parent = {
        name: 'parent1',
        // 如果不用Reflect用 target 访问时 this 指向会错误  取 value 时是正常的  但是 name 改变时会有问题
        get value() {
            return this.name;
        }
    };

    const proxy = new Proxy(parent, {
        get(target, key, receiver) {
            // return Reflect.get(target, key, receiver);

            // 在代理对象的 get 方法中，当你使用 return target[key]; 时，它实际上是在直接访问 parent 对象的属性，而不是通过代理，这就导致了继承链的断裂
            return target[key];
        }
    });

    const obj = {
        name: 'obj1'
    };

    // 设置obj继承与parent的代理对象proxy
    Object.setPrototypeOf(obj, proxy);

    console.log(obj.value); // parent1
}
```

1. 一些复杂的方法比较难实现，比如 `Reflect.ownKeys()`，如果没有 Reflect 开发很难（没必要）去实现 ownKeys 这个方法

## Proxy 和 Object.defineProperty 的区别

`Object.defineProperty` 的问题：

1. 对象套对象这种情况需要递归深度遍历，性能差
2. 对象新增的属性需要手动增加监听
3. 数组新增删除修改时(push、shift 等数组方法)监听不到

因为 Proxy 直接监听了整个对象，所以上述问题很容易解决，但是 `Proxy ` 兼容性略差于`Object.defineProperty`

## 参考

- [ECMAScript 6 入门教程](https://es6.ruanyifeng.com/#docs/reflect)
- [知乎：ES6 Proxy 里面为什么要用 Reflect？](https://www.zhihu.com/question/460133198/answer/1894620996)

