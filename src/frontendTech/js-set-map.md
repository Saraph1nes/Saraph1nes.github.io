# Set 和 Map

## Set

ES6 提出的新的数组结构，其存储的成员是唯一的 **没有重复** 的。

```javascript
new Set([1, 2, 3, 4, 4, 4]);
// Set(4) {1, 2, 3, 4}

new Set('abcdeee');
// Set(5) {'a', 'b', 'c', 'd', 'e'}
```

### 属性

- `size` 成员的数量

### 方法

- `add(value)` 添加，返回 Set 结构本身(可以连续 add 多次)
- `delete(value)` 删除，返回 Boolean 表示是否成功
- `has(value)` 查询，返回 Boolean 表示是否存在
- `clear()` 清除
- `keys()` 返回键名的遍历器
- `values()` 返回键值的遍历器
- `entries()` 返回键值对的遍历器
- `forEach()` 使用回调函数遍历每个成员

```javascript
let set = new Set(['red', 'green', 'blue']);

set.keys(); // ['red', 'green', 'blue']

set.values(); // ['red', 'green', 'blue']

set.entries(); // [(['red', 'red'], ['green', 'green'], ['blue', 'blue'])];

// Set 的键名和键值是同一个值，所以 keys、values 等返回的是同样的值
```

### 修改值

Set 目前没有直接修改值的方法，需要通过重新赋值来实现。

```javascript
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```

### 常用

```javascript
let a = new Set([1, 2, 3]);
let b = new Set([4, 3, 2]);

// 并集
let union = new Set([...a, ...b]);
// Set {1, 2, 3, 4}

// 交集
let intersect = new Set([...a].filter(x => b.has(x)));
// set {2, 3}

// （a 相对于 b 的）差集
let difference = new Set([...a].filter(x => !b.has(x)));
// Set {1}

// 遍历
for (let x of new Set(['red', 'green', 'blue'])) {
    console.log(x);
    // red
    // green
    // blue
}

// 去除数组的重复成员
[...new Set(array)];
```

## WeakSet

1. WeakSet 的成员只能是对象，而不能是其他类型的值。

```javascript
const ws = new WeakSet();
ws.add(1);
// TypeError: Invalid value used in weak set
ws.add(Symbol());
// TypeError: invalid value used in weak set
ws.add({ a: 1 });
// success
```

2. WeakSet 中的对象都是[弱引用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)
3. WeakSet 只有 `add()、delete()、has()` 方法，没有 `size` 属性 并且不能被遍历

## Map

传统的对象只能使用字符串来当键（key），ES6 提出的 Map 可以使用任何数据结构当 key

```javascript
const a = {};
const b = new Map();
b.set(a, 1);
b.set(undefined, 2);
b.set(null, 3);
b.set(NaN, 4); // 在 Map 中认为 NaN 等于 NaN
```

### 属性

- `size` 成员的数量

### 方法

- `set(key, value)` 添加，返回 Map 结构本身，可以链式调用
- `get(value)` 查找
- `delete(value)` 删除，返回 Boolean 表示是否成功
- `has(value)` 查询，返回 Boolean 表示是否存在
- `clear()` 清除
- `keys()` 返回键名的遍历器
- `values()` 返回键值的遍历器
- `entries()` 返回键值对的遍历器
- `forEach()` 使用回调函数遍历每个成员，第二参数可以设置 this

```javascript
const map = new Map([
    [1, 'one'],
    [2, 'two'],
    [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]


const reporter = {
    report: function(key, value) {
        console.log("Key: %s, Value: %s", key, value);
    }
};
// forEach 设置 this
map.forEach(function(value, key, map) {
    this.report(key, value);
}, reporter);
```

## WeakMap

1. WeakMap 只接受对象作为键名
2. WeakMap 的键名是[弱引用](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/WeakRef)的，键值依然是正常引用
3. 只有四个方法可用：`get()、set()、has()、delete()`

## 弱引用

垃圾回收时不会考虑弱引用的对象，也就是说如果当前对象已经没有被除了(WeakMap、WeakSet)以外的对象引用时， 那么就会回收当前对象的内存。

**场景**：储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。

## Object 和 Map 的区别

1. 键名类型，Object 只能使用字符串 / Symbol 来当键名，而 Map 可以用任意类型。
2. Map 在存储时会保留元素的顺序，所以如果考虑到元素迭代或顺序，使用 Map 更好。

## 总结

1. Set 是没有重复元素的数组
2. Map 是可以将任何类型当作 key 的对象
3. WeakMap、WeakSet 都是弱引用的, 没有 `size` 属性 并且不能被遍历

## 参考

- [阮一峰 ECMAScript 6 入门教程](https://es6.ruanyifeng.com/?search=Set&x=0&y=0#docs/set-map)

