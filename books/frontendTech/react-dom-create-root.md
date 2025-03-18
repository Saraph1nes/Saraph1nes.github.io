# ReactDOM.createRoot().render()解析

## 前言

> 本文中的代码为了便于理解，都是经过简化的伪代码，忽略了初始化不需要的逻辑，与`dev`环境下的判断，请大家阅读时以源码为准

很多人都知道这是将 React 应用渲染到页面上特定 DOM 元素的典型代码片段

本文将通过阅读源码，了解调用 `ReactDOM.createRoot.render` 时，`React`内部发生了什么

下面是这段代码很常见，一般来说单页面应用只需要写一次

```jsx
ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
)
```

## 起步

首先，我们需要找到`ReactDOM`的相关实现，路径是`packages/react-dom`

接着找到`createRoot`和`render`的实现文件，以下是文件路径

- `createRoot`和`render`的实现：`packages/react-dom/books/client/ReactDOMRoot.js`
- 老`render`实现(ReactDOM.render)：`packages/react-dom/books/client/ReactDOMLegacy.js`

## createRoot实现

> 位置：packages/react-dom/books/client/ReactDOMRoot.js
>
> `createRoot`函数

这里我就不放源码了，鼓励大家自己去读源码，本文会列出重点部分代码，大家可以对照源码阅读

### 1、验证DOM合法性

> 位置：packages/react-dom/books/client/ReactDOMRoot.js
>
> `isValidContainer`函数

`Node.nodeType` 的值参考 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/nodeType)

```jsx
// 判断是否为有效的容器节点
export function isValidContainer(node: any): boolean {
    // 如果节点存在且是元素节点、文档节点、文档片段节点，或者是注释节点并且满足特定条件，则认为是有效容器
    return !!(
        node &&
        (node.nodeType === ELEMENT_NODE ||
         node.nodeType === DOCUMENT_NODE ||
         node.nodeType === DOCUMENT_FRAGMENT_NODE ||
         (!disableCommentsAsDOMContainers &&
          node.nodeType === COMMENT_NODE &&
          (node: any).nodeValue === ' react-mount-point-unstable '))
    );
}
```

### 2、创建Fiber根节点

> 位置：packages/react-dom/books/client/ReactDOMRoot.js
>
> `createRoot `函数

```js
// 调用createContainer
const root = createContainer(
    container,
    ConcurrentRoot,
    null,
    isStrictMode,
    concurrentUpdatesByDefaultOverride,
    identifierPrefix,
    onRecoverableError,
    transitionCallbacks,
);
```

> 位置：packages/react-reconciler/books/ReactFiberReconciler.js
>
> `createContainer `函数

```js
export function createContainer(
containerInfo: Container,
 tag: RootTag,
 hydrationCallbacks: null | SuspenseHydrationCallbacks,
 isStrictMode: boolean,
 concurrentUpdatesByDefaultOverride: null | boolean,
 identifierPrefix: string,
 onRecoverableError: (error: mixed) => void,
    transitionCallbacks: null | TransitionTracingCallbacks,
        ): OpaqueRoot {
            const hydrate = false;
            const initialChildren = null;
            // 调用createFiberRoot
            return createFiberRoot(
                containerInfo,
                tag,
                hydrate,
                initialChildren,
                hydrationCallbacks,
                isStrictMode,
                concurrentUpdatesByDefaultOverride,
                identifierPrefix,
                onRecoverableError,
                transitionCallbacks,
                null,
            );
        }
```

> 位置：packages/react-reconciler/books/ReactFiberRoot.js
>
> `createFiberRoot` 函数

```js
export function createFiberRoot(
containerInfo: Container,
 tag: RootTag,
 hydrate: boolean,
 initialChildren: ReactNodeList,
 hydrationCallbacks: null | SuspenseHydrationCallbacks,
 isStrictMode: boolean,
 concurrentUpdatesByDefaultOverride: null | boolean,
 identifierPrefix: string,
 onRecoverableError: null | ((error: mixed) => void),
    transitionCallbacks: null | TransitionTracingCallbacks,
        formState: ReactFormState<any, any> | null,
            ): FiberRoot {

                // 创建一个FiberRootNode
                const root: FiberRoot = (new FiberRootNode(
                    containerInfo,
                    tag,
                    hydrate,
                    identifierPrefix,
                    onRecoverableError,
                    formState,
                ): any);
                if (enableSuspenseCallback) {
                    root.hydrationCallbacks = hydrationCallbacks;
                }

                if (enableTransitionTracing) {
                    root.transitionCallbacks = transitionCallbacks;
                }

                // 调用createHostRootFiber，创建未初始化的Fiber节点
                const uninitializedFiber = createHostRootFiber(
                    tag,
                    isStrictMode,
                    concurrentUpdatesByDefaultOverride,
                );

                // 这两行代码建立了 FiberRootNode（通过 root 变量表示）和 FiberNode（通过 uninitializedFiber 变量表示）之间的关联。
                root.current = uninitializedFiber;
                uninitializedFiber.stateNode = root;

                // ...

                // 初始化更新队列
                initializeUpdateQueue(uninitializedFiber);

                return root;
            }
```

> 位置：packages/react-reconciler/books/ReactFiber.js
>
> `createHostRootFiber`函数

```js
export function createHostRootFiber(
tag: RootTag,
 isStrictMode: boolean,
 concurrentUpdatesByDefaultOverride: null | boolean,
): Fiber {
    let mode;
    // `tag`的判断
    if (tag === ConcurrentRoot) {
        mode = ConcurrentMode;
        if (isStrictMode === true || createRootStrictEffectsByDefault) {
            mode |= StrictLegacyMode | StrictEffectsMode;
        }
        if (
            forceConcurrentByDefaultForTesting
        ) {
            mode |= ConcurrentUpdatesByDefaultMode;
        } else if (
            allowConcurrentByDefault &&
            concurrentUpdatesByDefaultOverride
        ) {
            mode |= ConcurrentUpdatesByDefaultMode;
        }
    } else {
        mode = NoMode;
    }

    if (enableProfilerTimer && isDevToolsPresent) {
        mode |= ProfileMode;
    }

    return createFiber(HostRoot, null, null, mode);
}

// 创建FiberNode
function createFiber(
tag: WorkTag,
 pendingProps: mixed,
 key: null | string,
 mode: TypeOfMode,
): Fiber {
    // $FlowFixMe[invalid-constructor]: the shapes are exact here but Flow doesn't like constructors
    return new FiberNode(tag, pendingProps, key, mode);
}
```

在这个函数中，我们可以看到`tag`的判断，`tag`的类型有两种，`ConcurrentRoot`与`LegacyRoot`

#### ConcurrentRoot与LegacyRoot的区别

| 类型             | 描述                                                         |
| ---------------- | ------------------------------------------------------------ |
| `LegacyRoot`     | 传统的、非并发模式下的根节点。React使用同步渲染，一次渲染一直执行到完成，不会被打断。这是 React 16 及之前版本的默认行为。 |
| `ConcurrentRoot` | 并发模式下的根节点。React使用 Fiber 架构，支持将渲染工作分解为多个优先级较低的任务，实现更灵活的、可中断的渲染，适用于处理复杂的用户界面。 |

#### FiberRootNode与FiberNode

| 特征               | FiberRootNode                                   | FiberNode                                          |
| ------------------ | ----------------------------------------------- | -------------------------------------------------- |
| 代表的层次         | 整个 React 应用的根节点                         | 单个虚拟 DOM 树中的节点                            |
| 类型               | 大多数情况下一个应用只有一个 `FiberRootNode`    | 多个 `FiberNode` 组成虚拟 DOM 树                   |
| 关联的实体         | 通常关联着整个应用的根组件或根 DOM 节点         | 关联着单个 React 元素、组件或 DOM 元素             |
| 状态               | 包含应用级别的状态信息，例如调度器相关的信息    | 包含单个元素或组件的状态、引用等信息               |
| 协调更新的起点     | 作为整个应用更新的起点，负责协调整个应用的更新  | 单个 `FiberNode` 作为更新的起点，协调子树的更新    |
| 存储子树结构的方式 | 以 `current` 字段表示当前正在处理的 `FiberNode` | 使用 `child`、`sibling`、`return` 字段形成链表结构 |

现在回到源码

通过`createFiberRoot`函数，创建了一个`FiberRootNode`节点

通过`createFiber`，创建了一个`FiberNode`节点

接着，通过如下代码将他们关联

```js
root.current = uninitializedFiber;
uninitializedFiber.stateNode = root;
```

这样做的好处是，React 在整个渲染和更新过程中可以方便地访问和操作 `FiberRootNode` 和对应的 `FiberNode`

这样的结构使得 React 能够在处理渲染和更新时更加灵活地操作不同层次的节点，并保持对整个应用状态的一致性



### 3、初始化更新队列

> 位置：packages/react-reconciler/books/ReactFiberClassUpdateQueue.js
>
> initializeUpdateQueue函数

React 中的每个组件都有一个关联的更新队列，用于存储待处理的状态更新，组件的状态更新是通过更新队列来管理的

当组件的状态发生变化时，React 会将新的状态信息存储在更新队列中，并在适当的时机执行队列中的更新，从而更新组件的界面

```jsx
export function initializeUpdateQueue<State>(fiber: Fiber): void {
    const queue: UpdateQueue<State> = {
    baseState: fiber.memoizedState, // 用于存储组件当前的状态
    firstBaseUpdate: null, // 用于维护更新队列中的更新链表
    lastBaseUpdate: null, // 同上
    shared: { // 一些共享的信息，如待处理的更新、更新的优先级等
    pending: null,
    lanes: NoLanes,
    hiddenCallbacks: null,
},
    callbacks: null, // 回调函数
};

// 通过将其挂在 FiberNode 上，React 可以在整个渲染和协调更新的过程中方便地访问和修改组件的更新队列
fiber.updateQueue = queue;
}
```

#### 更新队列的作用

举个例子

```jsx
import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

- 用户点击按钮时，`increment` 方法被调用，此时会生成一个**`update`** 对象
- 创建的 `update` 对象被添加到组件的 `updateQueue` 中，`updateQueue` 实际上是一个链表，存储了一系列更新对象，每个对象代表一个状态变更。
- 后续就是根据React的调度算法，进行更新，更新的细节不在此赘述



## render实现

> 位置：packages/react-dom/books/client/ReactDOMRoot.js
>
> `ReactDOMRoot.prototype.render`函数

注意：下文中的`OpaqueRoot `就是 `FiberRootNode`，详情见`packages/react-reconciler/books/ReactFiberReconciler.js`，中的 `type OpaqueRoot = FiberRoot;`

```js
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render =
  function (children: ReactNodeList): void {
    
    // root 就是刚刚创建的 OpaqueRoot
    const root = this._internalRoot;
    if (root === null) {
      throw new Error('Cannot update an unmounted root.');
    }

    // ...

	// 调用了updateContainer
    updateContainer(children, root, null, null);
  };
```

> 位置：packages/react-reconciler/books/ReactFiberReconciler.js
>
> `updateContainer`函数

```js
export function updateContainer(
element: ReactNodeList,
 container: OpaqueRoot,
 parentComponent: ?React$Component<any, any>,
 callback: ?Function,
): Lane {
    // container.current 就是 FiberNode 
    // 因为刚刚通过root.current = uninitializedFiber，将current指向了FiberNode
    const current = container.current;

    // 为当前的 FiberNode 分配一个更新通道lane，lane 表示了当前更新的优先级
    const lane = requestUpdateLane(current);

    // 因为parentComponent === null，这里context是一个空对象
    const context = getContextForSubtree(parentComponent);
    if (container.context === null) {
        container.context = context;
    } else {
        container.pendingContext = context;
    }

    // 创建一个update对象，上文提到过，创建的 update 对象会被添加到组件的 updateQueue 中，用于更新
    const update = createUpdate(lane);

    // 队列更新相关操作
    // 计算更新操作的子树起点
    const root = enqueueUpdate(current, update, lane);
    if (root !== null) {
        scheduleUpdateOnFiber(root, current, lane);
        entangleTransitions(root, current, lane);
    }

    return lane;
}
```

### 1、分配了更新优先级lane

到这里你需要知道，react框架更新的几大特点

- **优先级调度**
    -  `lane` 参数表示更新的优先级
    - React可以根据不同任务的优先级来调度更新，确保高优先级的任务得到更及时的处理
- **Fiber树**
    - Fiber是一种轻量的、可中断的工作单元，它构成了React中的虚拟DOM树，通过Fiber树，React能够以更细粒度管理组件的更新（局部更新），在更新期间更容易地中断和恢复
- **局部更新：**
    - Fiber架构可以让React只更新发生变化的部分，而不必重新渲染整个组件树
    - enqueueUpdate函数返回的根节点 `root` 就是代表了更新操作的起点，React会从这个起点开始遍历Fiber树，找到需要更新的部分

### 2、维护一个context，用于整个子树的状态共享

- `context`是组件树中共享的数据，组件树中所有子组件可以直接访问，类似于 `useContext`

- `getContextForSubtree` 函数用于返回给定父组件的上下文信息

### 3、创建一个update对象

- 创建一个update对象，上文提到过，创建的 update 对象会被添加到组件的 updateQueue 中

```js
// update节点属性说明

export type Update<State> = {
    lane: Lane, // 更新的优先级，调度算法使用

    tag: 0 | 1 | 2 | 3, // update节点的类型
    payload: any, // update节点包含的信息
    callback: (() => mixed) | null, // 更新完成后的回调

    next: Update<State> | null, // 链表的 next 节点
};
```

### 4、队列更新相关操作

```js
// 主要针对这段代码进行大致解释，下一篇会具体讲解更新部分
const root = enqueueUpdate(current, update, lane);
if (root !== null) {
    scheduleUpdateOnFiber(root, current, lane);
    entangleTransitions(root, current, lane);
}
```

- `enqueueUpdate `返回了更新的起点，react会从这个起点开始遍历更新子树
- `scheduleUpdateOnFiber`函数用于在Fiber 树上安排更新
- `entangleTransitions` 看代码应该是是根据优先级合并不同车道上的更新操作，下一篇会具体讲解更新部分

## 总结一下

当使用 `ReactDOM.createRoot().render()` 时，React 做了以下准备工作

1. **验证DOM合法性：** 确保传入的容器节点是有效的 DOM 元素，以便在其上渲染 React 应用

2. **创建Fiber根节点：** 通过 `createContainer` 函数创建了一个 `FiberRootNode`（`OpaqueRoot`），表示整个 React 应用的根节点。

   同时，创建了一个未初始化的 `FiberNode`，这两者建立了关联，构成了根节点的结构

3. **初始化更新队列：** 使用 `initializeUpdateQueue` 函数为刚创建的 `FiberNode` 初始化了更新队列，该队列用于存储组件的状态更新

4. **分配更新优先级lane：** 在调用 `ReactDOMRoot.prototype.render` 函数时，为当前的 `FiberNode` 分配了一个更新通道（`lane`），表示更新的优先级

5. **维护共享context：** 确保整个子树共享相同的上下文，以便在组件树中进行状态的共享

6. **创建更新对象：** 创建一个 `update` 对象，包含了更新的信息，将其添加到组件的更新队列中

7. **队列更新相关操作：** 使用 `enqueueUpdate` 将更新对象添加到更新队列中，并通过 `scheduleUpdateOnFiber` 和 `entangleTransitions` 函数进一步安排更新

## 问题

### 每一个dom都能视为一个FiberNode吗？

- 在 React Fiber 架构中，每个 DOM 元素对应于一个 `FiberNode`，但并非一一对应
- `FiberNode` 表示的是虚拟 DOM 节点，当 React 应用渲染时，会创建一个虚拟 DOM 树，由多个 `FiberNode` 组成
- 每个 `FiberNode` 对应于虚拟 DOM 中的一个节点，**可以是 React 元素、组件，也可以是实际的 DOM 元素**



###  React Fiber 架构中的 `child`、`sibling`、`return`

- **`child` 字段：** 表示当前节点的第一个子节点。在链表中，它指向该节点的第一个子节点，如果没有子节点则为 `null`
- **`sibling` 字段：** 表示当前节点的下一个兄弟节点。在链表中，它指向该节点的下一个兄弟节点，如果没有兄弟节点则为 `null`
- **`return` 字段：** 表示当前节点的父节点。在链表中，它指向该节点的父节点

举个例子，有以下虚拟 DOM 结构，`child`和`sibling`的关系如图，`return`未画出，为`child`节点的相反方向，`A`节点的`return`指向`null`

![image-20240129205700689](http://assest.sablogs.cn/imgs/typora/image-20240129205700689.png)


