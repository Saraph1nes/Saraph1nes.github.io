# 数据类型检测

## 原生数据类型

- undefined
- null
- boolean
- number
- symbol
- bigint
- object

------

## typeof

原理：直接在计算机底层基于类型的值（二进制）进行检测

```javascript
typeof null; // object
typeof /^1/; // object
typeof new Date(); // object
typeof function () {}; // function
```

弊端：

- typeof 不能区别 普通对象/数组对象/正则对象/日期对象
- 会错误的将 null 检测为 object

------

## instanceof

原理：检测当前实例是否属于这个类，只要当前类出现在实例的原型链上，结果都是 true，能够区分对象到底是哪种对象

```javascript
arr instanceof Object; // true
1 instanceof Number; // false
new Number(1) instanceof Number; // true
'a' instanceof String; // false
```

弊端：

- 由于我们可以随意修改原型的指向，所以检测的结果可能不准确
- 不能检测基本类型
- null 和 undefined 使用 instanceof 时会抛出异常

源码：

```javascript
function instance_of(instance, classFunc) {
    let classFuncPrototype = classFunc.prototype;
    // Object.getPrototypeOf(obj) === obj.__proto__
    // IE 下不兼容 __proto__ 使用 getPrototypeOf
    proto = Object.getPrototypeOf(instance);
    while (true) {
        if (proto === null) {
            return false;
        }
        if (proto === classFuncPrototype) {
            return true;
        }
        proto = Object.getPrototypeOf(proto);
    }
}
```

------

## constructor

```javascript
arr = [];
arr.constructor === Array(1).constructor // true
arr.constructor === Number; // false
arr.constructor === Object; // false
arr.constructor.constructor === Object.constructor // true
```

原理：通过构造函数检测

弊端：

- 能够解决 instanceof 不能检测基本类型的缺点，但是 constructor 可以随意更改，所以不准确
- null 和 undefined 是无效对象，因此不存在 constructor，故不能对这两个作出判断

------

## Object.prototype.toString.call(value)

```javascript
Object.prototype.toString.call(1); // "[object Number]"
Object.prototype.toString.call(NaN); // "[object Number]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call([]); // "[object Array]"
Object.prototype.toString.call({}); // "[object Object]"
Object.prototype.toString.call(function () {}); // "[object Function]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
```

------

## jQuery检测方法

```javascript
const class2type = {},
      toString = class2type.toString, // 等价于 Object.prototype.toString
      typeList =
      'Boolean Number String Function Array Date RegExp Object Error'.split(' ');

// 设定数据类型的映射表
typeList.forEach(name => {
    class2type[`[object ${name}]`] = name.toLowerCase();
});

function toType(obj) {
    if (obj == null) {
        // 如果传入的是 null 或者 undefined，返回对应的字符串
        return obj + '';
    }
    return typeof obj === 'object' || typeof obj === 'function'
        ? class2type[toString.call(obj)] || 'object'
    : typeof obj;
}
```

## 扩展问题

**typeof NaN 结果是什么？为什么？**

- 答案是number，为什么呢？因为IEEE-754标准，64位浮点数，当指数位全为1, 表示非数字(NaN Not a Number),诸如0除以0的结果。

**为什么string这种基础类型居然还能调用方法，例如'a'.indexOf('a'), 方法调用不是对象才有的能力吗？**

- JS中为了便于基本类型操作，提供了3个特殊的引用类型：Boolean、Number、String它们具有基本类型特殊行为。
- 实际上，每当读取一个基本类型的时候，js内部会自动创建一个基本包装类型对象，可以让我们调用一些方法来操作。
- `'a'.indexOf('a')`在调用过程中会先`let str = new String('a')`，然后调用indexOf，调用完毕str = null, 销毁该对象

**为什么要用 Object.prototype.toString，不用自己原型对象的toString方法，比如函数const a = new Function(); 调用a.toString()不行吗？**

- 因为实例对象有可能会自定义toString方法，会覆盖Object.prototype.toString，所以在使用时，最好加上call。