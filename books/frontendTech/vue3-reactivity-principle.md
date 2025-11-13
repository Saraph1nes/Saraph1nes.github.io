# Vue3响应式学习

## 为什么要使用 ref？

该 `.value` 属性给予了 Vue 一个机会来检测 ref 何时被访问或修改。在其内部，Vue 在它的 getter 中执行追踪，在它的 setter 中执行触发。从概念上讲，你可以将 ref 看作是一个像这样的对象：

```js
// 伪代码，不是真正的实现
const myRef = {
  _value: 0,
  get value() {
    track()
    return this._value
  },
  set value(newValue) {
    this._value = newValue
    trigger()
  }
}
```

另一个 ref 的好处是，与普通变量不同，你可以将 ref 传递给函数，同时保留对最新值和响应式连接的访问。当将复杂的逻辑重构为可重用的代码时，这将非常有用。

先说结论：Vue官方建议使用 `ref()` 作为声明响应式状态的主要 API。

## Vue 响应性是如何工作的

我们无法直接追踪对上述示例中局部变量的读写，原生 `JavaScript` 没有提供任何机制能做到这一点。但是，我们是可以追踪**对象属性**的读写的。

在 JavaScript 中有两种劫持 `property` 访问的方式：[getter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get) / [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) 和 [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)。

`Vue 2` 使用 `getter / setters` 完全是出于支持旧版本浏览器的限制。

而在 `Vue 3` 中则使用了 Proxy 来创建响应式对象，仅将 `getter / setter` 用于 `ref`。下面的伪代码将会说明它们是如何工作的：

```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```

## ref

在组合式 API 中，推荐使用 [`ref()`](https://cn.vuejs.org/api/reactivity-core.html#ref) 函数来声明响应式状态

`ref()` 接收参数，并将其包裹在一个带有 `.value` 属性的 ref 对象中返回

注意，在模板中使用 ref 时，我们不需要附加 `.value`。为了方便起见，当在模板中使用时，ref 会自动解包 (有一些[注意事项](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#caveat-when-unwrapping-in-templates))，如：

```html
<button @click="count++">
  {{ count }}
</button>
```

### 响应性

Ref 可以持有任何类型的值，包括深层嵌套的对象、数组或者 JavaScript 内置的数据结构，比如 `Map`。

- 当 ref 的值是普通变量时，vue会创建一个含有 value 熟悉的对象，这是因为在标准的 JavaScript 中，检测**普通变量**的访问或修改是行不通的。然而，我们可以通过 `getter`和 `setter`方法来拦截对象属性的 get 和 set 操作。
- 当 ref 的值是一个对象时，`ref()` 也会在内部调用`reactive`，非原始值将通过 [`reactive()`](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#reactive) 转换为响应式代理。

### 深层响应性与优化

Ref 会使它的值具有深层响应性。这意味着即使改变嵌套对象或数组时，变化也会被检测到

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 以下都会按照期望工作
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

`shallowRef()`是`ref()`的浅层作用形式。通过 [shallow ref](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) 来放弃深层响应性。对于浅层 ref，只有 `.value` 的访问会被追踪。

浅层 ref 可以用于避免对大型数据的响应性开销来优化性能、或者有外部库管理其内部状态的情况。比如：

```js
const state = shallowRef({ count: 1 })

// 不会触发更改
state.value.count = 2

// 会触发更改
state.value = { count: 2 }
```



## reactive

### 响应性

响应式对象是 [JavaScript 代理](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，其行为就和普通对象一样。

不同的是，Vue 能够拦截对响应式对象所有属性的访问和修改，以便进行依赖追踪和触发更新。

### 深层响应性与优化

当访问嵌套对象时，会递归每一层，深层对象也会被 `reactive()` 包装。

与浅层 `ref` 类似，这里也有一个[`shallowReactive()`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive) API 可以选择退出深层响应性。

### Reactive Proxy vs. Original

值得注意的是，`reactive()` 返回的是一个原始对象的 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，它和原始对象是不相等的

```js
const raw = {}
const proxy = reactive(raw)

// 代理对象和原始对象不是全等的
console.log(proxy === raw) // false
```

只有代理对象是响应式的，更改原始对象不会触发更新。因此，使用 Vue 的响应式系统的最佳实践是**仅使用你声明对象的代理版本**。

### Tips

- 在同一个对象上调用 reactive() 会返回相同的代理
    - console.log(reactive(raw) === proxy) // true
- 在一个代理上调用 reactive() 会返回它自己
    - console.log(reactive(proxy) === proxy) // true

### reactive的局限性

- **它只能用于对象类型**

- **不能替换整个对象**

  由于 Vue 的响应式跟踪是通过属性访问实现的，因此我们必须始终保持对响应式对象的相同引用。这意味着我们不能轻易地“替换”响应式对象，因为这样的话与第一个引用的响应性连接将丢失

  ```js
  let state = reactive({ count: 0 })
  
  // 上面的 ({ count: 0 }) 引用将不再被追踪
  // (响应性连接已丢失！)
  state = reactive({ count: 1 })
  ```

- **对解构操作不友好**

  当我们将响应式对象的原始类型属性解构为本地变量时，或者将该属性传递给函数时，我们将丢失响应性连接

  ```js
  const state = reactive({ count: 0 })
  
  // 当解构时，count 已经与 state.count 断开连接
  let { count } = state
  // 不会影响原始的 state
  count++
  
  // 该函数接收到的是一个普通的数字
  // 并且无法追踪 state.count 的变化
  // 我们必须传入整个对象以保持响应性
  callSomeFunction(state.count)
  ```



## ref 和 reactive 比较

- `reactive` 只能用于对象类型（对象、数组和如 Map、Set 这样的[集合类型](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects#keyed_collections)），它不能持有如 `string`、`number` 或 `boolean` 这样的[原始类型](https://developer.mozilla.org/en-US/docs/Glossary/Primitive)。而 `ref` 都可以，因为 `ref` 会把对象类型的参数使用 `reactive` 处理。

## ref 解包

### 作为 reactive 对象的属性

一个 ref 会在作为响应式对象的属性被访问或修改时自动解包。换句话说，它的行为就像一个普通的属性

```js
const count = ref(0)
const state = reactive({
  count // 属性被访问，自动解包
})

console.log(state.count) // 0

state.count = 1
console.log(count.value) // 1

// 如果将一个新的 ref 赋值给一个关联了已有 ref 的属性，那么它会替换掉旧的 ref
const otherCount = ref(2)
state.count = otherCount
console.log(state.count) // 2
// 原始 ref 现在已经和 state.count 失去联系
console.log(count.value) // 1
```

只有当嵌套在一个深层响应式对象内时，才会发生 ref 解包。当其作为[浅层响应式对象](https://cn.vuejs.org/api/reactivity-advanced.html#shallowreactive)的属性被访问时不会解包。

### 数组和集合的注意事项

与 reactive 对象不同的是，当 ref 作为响应式数组或原生集合类型 (如 `Map`) 中的元素被访问时，它**不会**被解包

```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```

### 在模板中解包的注意事项

- 在模板渲染上下文中，只有顶级的 ref 属性才会被解包

  ```vue
  <script setup>
      const count = ref(0)
      const object = { id: ref(1) }
      const { id } = object
  </script>
  <template>
  	<span>{{ count + 1 }}</span> <!-- 正确 -->
      <span>{{ object.id + 1 }}</span> <!-- 错误 , 渲染的结果将是 [object Object]1  -->
  
  	<span>{{ id + 1 }}</span> <!-- 正确 , 我们可以将 id 解构为一个顶级属性 -->
  
  	<!-- 如果 ref 是文本插值的最终计算值 (即 `{{ }}` 标签)，那么它将被解包  -->
  	<template>{{ object.id }}</template> <!-- 渲染为 `1`, 该特性仅仅是文本插值的一个便利特性，等价于 {{ object.id.value }} -->
  </template>
  ```

## 参考

- [响应式基础 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/essentials/reactivity-fundamentals.html#limitations-of-reactive)
- [深入响应式系统 | Vue.js (vuejs.org)](https://cn.vuejs.org/guide/extras/reactivity-in-depth.html)

