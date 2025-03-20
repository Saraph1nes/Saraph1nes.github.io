---
title: vue-router 导航守卫学习笔记
date: 2024-04-29
tags: 
    - Vue
    - Vue Router
    - 前端开发
    - 路由
    - 学习笔记
---

# vue-router 导航守卫学习笔记

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文详细介绍了 Vue Router 中的导航守卫机制。文章系统地讲解了全局前置守卫、全局解析守卫、全局后置钩子、路由独享守卫以及组件内守卫的使用方法和应用场景。特别说明了守卫的执行时机、参数传递、组件实例访问等关键点，并通过实际代码示例展示了各类守卫的具体实现。最后通过完整的导航解析流程，帮助读者深入理解 Vue Router 的导航守卫机制。

<!-- DESC SEP -->

## 全局前置守卫

使用 `router.beforeEach` 注册一个全局前置守卫

```js
const router = createRouter({ ... })

// to: 即将要进入的目标
// from: 当前导航正要离开的路由
router.beforeEach((to, from) => {
  // ...
  // 返回 false 以取消导航
  return false
})
```

当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于**等待中**。

## 全局解析守卫

用 `router.beforeResolve` 注册一个全局守卫

和 `router.beforeEach` 类似，因为它在**每次导航**时都会触发，不同的是，解析守卫刚好会在导航被确认之前、**所有组件内守卫和异步路由组件被解析之后**调用。

可以用来处理路由元信息，比如：

```js
// 定义元信息
const routes = [
  {
    path: '/posts',
    component: PostsLayout,
    children: [
      {
        path: 'new',
        component: PostsNew,
        // 只有经过身份验证的用户才能创建帖子
        meta: { requiresAuth: true },
      },
      {
        path: ':id',
        component: PostsDetail
        // 任何人都可以阅读文章
        meta: { requiresAuth: false },
      }
    ]
  }
]

// 守卫中判断元信息 + 逻辑
router.beforeResolve(async to => {
  if (to.meta.requiresCamera) {
    try {
      await askForCameraPermission()
    } catch (error) {
      if (error instanceof NotAllowedError) {
        // ... 处理错误，然后取消导航
        return false
      } else {
        // 意料之外的错误，取消导航并把错误传给全局处理器
        throw error
      }
    }
  }
})
```

## 全局后置钩子

你也可以注册全局后置钩子，然而和守卫不同的是，这些钩子不会接受 `next` 函数也不会改变导航本身。

```javascript
router.afterEach((to, from) => {
  sendToAnalytics(to.fullPath)
})
```

它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用。

## 守卫内的全局注入

从 Vue 3.3 开始，你可以在导航守卫内使用 `inject()` 方法。这在注入像 [pinia stores](https://pinia.vuejs.org/) 这样的全局属性时很有用。

在 `app.provide()` 中提供的所有内容都可以在 `router.beforeEach()`、`router.beforeResolve()`、`router.afterEach()` 内获取到

```js
// main.ts
const app = createApp(App)
app.provide('global', 'hello injections')

// router.ts or main.ts
router.beforeEach((to, from) => {
  const global = inject('global') // 'hello injections'
  // a pinia store
  const userStore = useAuthStore()
  // ...
})
```

## 路由独享的守卫

路由配置上定义 `beforeEnter` 守卫。

`beforeEnter` 守卫 **只在进入路由时触发**，不会在 `params`、`query` 或 `hash` 改变时触发。例如，从 `/users/2` 进入到 `/users/3` 或者从 `/users/2#info` 进入到 `/users/2#projects`。

它们只有在 **从一个不同的** 路由导航时，才会被触发。

```js
const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: (to, from) => {
      // reject the navigation
      return false
    },
  },
]
```

你也可以将一个函数数组传递给 `beforeEnter`，这在为不同的路由重用守卫时很有用

```js
function removeQueryParams(to) {
  if (Object.keys(to.query).length)
    return { path: to.path, query: {}, hash: to.hash }
}

function removeHash(to) {
  if (to.hash) return { path: to.path, query: to.query, hash: '' }
}

const routes = [
  {
    path: '/users/:id',
    component: UserDetails,
    beforeEnter: [removeQueryParams, removeHash],
  },
  {
    path: '/about',
    component: UserDetails,
    beforeEnter: [removeQueryParams],
  },
]
```

## 组件内的守卫

最后，你可以在路由组件内直接定义路由导航守卫(传递给路由配置的)

可以为路由组件添加以下配置

- `beforeRouteEnter`

  - 在渲染该组件的对应路由被验证前调用

  - 不能获取组件实例 `this` ，因为当守卫执行时，组件实例还没被创建。

  - 可以通过传一个回调给 `next` 来访问组件实例，在导航被确认的时候执行回调，并且把组件实例作为回调方法的参数

    ```js
    beforeRouteEnter (to, from, next) {
      next(vm => {
        // 通过 `vm` 访问组件实例
      })
    }
    ```

  -  `beforeRouteEnter` 是支持给 `next` 传递回调的唯一守卫，对于 `beforeRouteUpdate` 和 `beforeRouteLeave` ，组件已经挂载完成，没有必要通过回调访问组件实例了。

- `beforeRouteUpdate`

  - 在当前路由改变，但是该组件被复用时调用
  - 因为在这种情况发生的时候，组件已经挂载好了，导航守卫可以访问组件实例 `this`
  - 举例：对于一个带有动态参数的路径 `/users/:id`，在 `/users/1` 和 `/users/2` 之间跳转的时候，由于会渲染同样的 `UserDetails` 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用

  ```js
  beforeRouteUpdate (to, from) {
    // just use `this`
    this.name = to.params.name
  }
  ```

- `beforeRouteLeave`

  - 在导航离开渲染该组件的对应路由时调用
  - 与 `beforeRouteUpdate` 一样，它可以访问组件实例 `this`
  - 该导航可以通过返回 `false` 来取消

  ```js
  beforeRouteLeave (to, from) {
    const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
    if (!answer) return false
  }
  ```

## （重要）完整的导航解析流程

1. 导航被触发。
2. 在失活的组件里调用 `beforeRouteLeave` 守卫。
3. 调用全局的 `beforeEach` 守卫。
4. 在重用的组件里调用 `beforeRouteUpdate` 守卫(2.2+)。
5. 在路由配置里调用 `beforeEnter`。
6. 解析异步路由组件。
7. 在被激活的组件里调用 `beforeRouteEnter`。
8. 调用全局的 `beforeResolve` 守卫(2.5+)。
9. 导航被确认。
10. 调用全局的 `afterEach` 钩子。
11. 触发 DOM 更新。
12. 调用 `beforeRouteEnter` 守卫中传给 `next` 的回调函数，创建好的组件实例会作为回调函数的参数传入。

## 参考

- [vue-router进阶](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)

