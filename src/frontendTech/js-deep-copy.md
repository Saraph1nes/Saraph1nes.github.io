# 浅拷贝与深拷贝

## 数据类型

数据分为基本数据类型(String, Number, Boolean, Null, Undefined，Symbol)和对象数据类型。

1、基本数据类型的特点：直接存储在栈(stack)中的数据

2、引用数据类型的特点：**存储的是该对象在栈中引用，真实的数据存放在堆内存里**

引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。

![image-20220225115130640](http://assest.sablogs.cn/img/typora/IQ6ptD8jN5vP3Bd.png)

## 深拷贝和浅拷贝比较

**深拷贝和浅拷贝是只针对Object和Array这样的引用数据类型的**。

**深拷贝和浅拷贝的原理（重要）：**浅拷贝只复制指向某个对象的指针，而不复制对象本身，新旧对象还是共享同一块内存。但深拷贝会另外创造一个一模一样的对象，新对象跟原对象不共享内存，修改新对象不会改到原对象。

## 赋值和浅拷贝比较

**赋值：**当我们把一个对象赋值给一个新的变量时，**赋的其实是该对象的在栈中的地址，而不是堆中的数据**
。也就是两个对象指向的是同一个存储空间，无论哪个对象发生改变，其实都是改变的存储空间的内容，因此，两个对象是联动的。

**浅拷贝：**浅拷贝是按位拷贝对象，**它会创建一个新对象**
，这个对象有着原始对象属性值的一份精确拷贝。如果属性是基本类型，拷贝的就是基本类型的值；如果属性是内存地址（引用类型），拷贝的就是内存地址
，因此如果其中一个对象改变了这个地址，就会影响到另一个对象。即默认拷贝构造函数只是对对象进行浅拷贝复制(逐个成员依次拷贝)
，即只复制对象空间而不复制资源。

|     | 和原数据是否指向同一对象 | 第一层数据为基本数据类型     | 原数据中包含子对象        |
|-----|--------------|------------------|------------------|
| 赋值  | 是            | 改变会使原数据一同改变      | 改变会使原数据一同改变      |
| 浅拷贝 | 否            | 改变**不**会使原数据一同改变 | 改变会使原数据一同改变      |
| 深拷贝 | 否            | 改变**不**会使原数据一同改变 | 改变**不**会使原数据一同改变 |

## 浅拷贝的实现

### Object.assign()

`Object.assign()` 方法可以把任意多个的源对象自身的可枚举属性拷贝给目标对象，然后返回目标对象。但是 `Object.assign()`
进行的是浅拷贝，拷贝的是对象的属性的引用，而不是对象本身。

```js
var obj = { a: {a: "kobe", b: 39} };
var initalObj = Object.assign({}, obj);
initalObj.a.a = "wade";
console.log(obj.a.a); // wade
```

注意：当object只有一层的时候，是深拷贝

```js
let obj = {
    username: 'kobe'
};
let obj2 = Object.assign({},obj);
obj2.username = 'wade';
console.log(obj);//{username: "kobe"}
```

### Array.prototype.concat()

```js
let arr = [1, 3, {
    username: 'kobe'
}];
let arr2=arr.concat();    
arr2[2].username = 'wade';
console.log(arr);
```

### Array.prototype.slice()

```js
let arr = [1, 3, {
    username: ' kobe'
}];
let arr3 = arr.slice();
arr3[2].username = 'wade'
console.log(arr);
```

## 深拷贝的实现

### JSON.parse(JSON.stringify())

```js
let arr = [1, 3, {
   username: ' kobe'
}];
let arr4 = JSON.parse(JSON.stringify(arr));
arr4[2].username = 'duncan';
console.log(arr, arr4)
```

原理： 用`JSON.stringify`将对象转成`JSON`字符串，再用JSON.parse()把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝。

**这种方法虽然可以实现数组或对象深拷贝，但不能处理函数。**

这是因为 `JSON.stringify()` 方法是将一个JavaScript值(对象或者数组)转换为一个 JSON字符串，不能接受函数。

### 手写

递归方法实现深度克隆原理：**遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝。**

```js
// 定义检测数据类型的功能函数
function checkedType(target) {
    return Object.prototype.toString.call(target).slice(8, -1)
}
// 实现深度克隆---对象/数组
function clone(target) {
    // 判断拷贝的数据类型
    // 初始化变量result 成为最终克隆的数据
    let result, targetType = checkedType(target)
    if (targetType === 'Object') {
        result = {}
    } else if (targetType === 'Array') {
        result = []
    } else {
        return target
    }
    // 遍历目标数据
    for (let i in target) {
        // 获取遍历数据结构的每一项值。
        let value = target[i]
        // 判断目标结构里的每一值是否存在对象/数组
        if (checkedType(value) === 'Object' ||
            checkedType(value) === 'Array') { //对象/数组里嵌套了对象/数组
            // 继续遍历获取到value值
            result[i] = clone(value)
        } else { 
            // 获取到value值是基本的数据类型或者是函数。
            result[i] = value;
        }
    }
    return result
}
```

### lodash

该函数库也有提供 `_.cloneDeep` 用来做 Deep Copy。

```js
var _ = require('lodash');
var obj1 = {
    a: 1,
    b: {f: {g: 1}},
    c: [1, 2, 3]
};
var obj2 = _.cloneDeep(obj1);
console.log(obj1.b.f === obj2.b.f);
// false
```