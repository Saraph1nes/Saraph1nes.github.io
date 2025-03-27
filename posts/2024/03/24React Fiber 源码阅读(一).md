---
title: React Fiber 源码阅读(一)
date: 2024-03-24
tags: 
  - React
  - Fiber
  - 源码调试
  - useState
  - 状态管理
  - 性能优化
---

# 24React Fiber 源码阅读(一)

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文深入探讨了React Fiber架构下的useState工作原理，从源码调试环境的搭建开始，详细分析了useState的初始化和更新机制。通过断点调试和源码分析，揭示了React如何通过dispatcher管理hook状态，以及state更新时Fiber节点的调度过程。文章重点讲解了mountState、dispatchSetState等核心函数，并探讨了React的eagerState优化策略。

<!-- DESC SEP -->

本文将从 React 的 Hooks 中的 useState 入手，探索 setState 到 Fiber 循环的过程中 React 所执行的操作

主要用于记录自己的学习路线，给想学习react 源码的同学一个参考

## 准备

> 环境：win11
>
> 编辑器：vscode
>
> 终端：git bash
>
> react版本：361d5a6d5055ddb588d9e0a6ff7bf3224b38222d

### 1、clone react的源码

此处会涉及到以下几个问题，请大家自己解决：

- 安装依赖阶段
  - npm换源，推荐使用nrm，切换到taobao源
  - 设置electron源为中国镜像仓库
- 源码编译阶段
  - `scripts\rollup\build.js`，开启sourceMap，注释掉没有生成sourceMap的插件
  - 这里可以参考光光的文章：[全网最优雅的 React 源码调试方式 - 掘金 (juejin.cn)](https://juejin.cn/post/7126501202866470949)
  - 我自己fork了一份代码，也可以clone我的仓库 [Saraph1nes/react-study: 学习 (github.com)](https://github.com/Saraph1nes/react-study)
  - JDK环境安装，我安装的时JDK-22
  - git bash 配置java环境变量
  - build 脚本有一些更改，可以直接使用命令：`node ./scripts/rollup/build.js`

解决上述问题，完成编译后，你会得到编译产物

![image-20240323135639419](http://assest.sablogs.cn/img/typora/image-20240323135639419.png)

### 2、npm link

接着，我们需要将我们打包出的`react`和`react-dom`库link到全局的 npm 包目录中

- 进入编译产物`build\node_modules\react`，执行`npm link`
- 进入编译产物`build\node_modules\react-dom`，执行`npm link`

### 3、修改项目依赖

这一步选择自己熟悉的react项目就行，我是用`vite`创建了一个`react`种子项目

使用`npm link react react-dom`，link 第二步编译出的产物

到此准备工作就完成了

## state初始化

```jsx
import { useState } from 'react'
import './App.css'

function App() {
    const [count, setCount] = useState(0) // 断点 1

    return (
        <>
        <div className="card">
            <button onClick={() => {
                    setCount(3) // 断点 2
                }}>
                直接设置最终值
            </button>
            <button onClick={() => {
                    setCount(v => v + 1) // 断点3
                }}>
                回调函数方式
            </button>
            <p>
                当前值:{count}
            </p>
        </div>
        </>
    )
}

export default App
```

我给`useState`打上断点，去看useState的创建步骤

### resolveDispatcher

![image-20240323143214087](http://assest.sablogs.cn/img/typora/image-20240323143214087.png)

![image-20240323143306598](http://assest.sablogs.cn/img/typora/image-20240323143306598.png)

进入`resolveDispatcher`

```js
// 用于获取当前正在运行的调度器（dispatcher）
// 在 React 中，调度器负责管理钩子（hooks）的调用和状态管理等任务。
function resolveDispatcher() {
    const dispatcher = ReactCurrentDispatcher.current;
    // Will result in a null access error if accessed outside render phase. We
    // intentionally don't throw our own error because this is in a hot path.
    // Also helps ensure this is inlined.
    return ((dispatcher: any): Dispatcher);
}
```

### dispatcher.useState

 dispatcher.useState(initialState) 实际上会调用`mountState`函数，底层依赖于`mountStateImpl`

```js
function mountState<S>(
    initialState: (() => S) | S,
    ): [S, Dispatch<BasicStateAction<S>>] {
        const hook = mountStateImpl(initialState); // 看下方mountStateImpl实现
const queue = hook.queue;
const dispatch: Dispatch<BasicStateAction<S>> = (dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
): any);
queue.dispatch = dispatch;
// 当使用setState的时候，会触发 dispatchSetState 函数的执行，并且将 currentlyRenderingFiber 和 queue 作为额外参数传入。
return [hook.memoizedState, dispatch];
}
```

```js
function mountStateImpl<S>(initialState: (() => S) | S): Hook {
    const hook = mountWorkInProgressHook(); // 看下方mountWorkInProgressHook实现
    if (typeof initialState === 'function') {
        const initialStateInitializer = initialState;
        // 如果初始状态是一个函数，则将其当作初始化函数 initialStateInitializer
        // 然后调用该函数获取初始状态值，并将其赋值给 initialState。这是为了支持初始状态可以是一个函数的情况。
        initialState = initialStateInitializer();
        // ...
    }
    // memoizedState 和 baseState 同时赋值为 initialState
    hook.memoizedState = hook.baseState = initialState;
    const queue: UpdateQueue<S, BasicStateAction<S>> = {
        pending: null,
        lanes: NoLanes, // 无优先级
        dispatch: null,
        lastRenderedReducer: basicStateReducer,
        lastRenderedState: (initialState: any),
    };
    // 初始化该hook的更新队列
    hook.queue = queue;
    return hook;
}
```

```js
// mountWorkInProgressHook 会创建一个新的hook
function mountWorkInProgressHook(): Hook {
    const hook: Hook = {
        memoizedState: null, // 是 Fiber 节点中用于存储 hook 状态的字段。React 会在每个组件对应的 Fiber 节点上维护一个链表，用来存储该组件中使用的所有 hook 的状态。
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
    };

    // workInProgressHook：在处理组件时，React 会在渲染过程中依次处理每个 hook，这个变量会在这个过程中更新，指向当前正在处理的 hook。
    if (workInProgressHook === null) {
        // 为空则说明是第一个hook，此时记录memoizedState，并将workInProgressHook指向新建的hook
        currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
    } else {
        // 将当前处理的 hook 对象 hook 添加到 hook 链表中，并更新 workInProgressHook 变量指向下一个要处理的 hook
        workInProgressHook = workInProgressHook.next = hook;
    }
    return workInProgressHook;
}
```

## state更新

上面探究了`state`初始化的相关逻辑，这部分主要探索`state update`相关的逻辑，涉及到2个断点。

他们的更新方式不同，一个是依赖于`current state`更新，另一个是直接更新到最终值。

![image-20240324123016151](http://assest.sablogs.cn/img/typora/image-20240324123016151.png)

### dispatchSetState

```tsx
function dispatchSetState<S, A>(
fiber: Fiber,
 queue: UpdateQueue<S, A>,
 action: A,
): void {
    const lane = requestUpdateLane(fiber); // 获取更新的优先级

    const update: Update<S, A> = {
        lane, // 当前这个更新操作所处的优先级
        revertLane: NoLane, // 更新过程中需要回滚的情况下所使用的通道
        action, // 更新操作
        hasEagerState: false, // React 有一种优化策略叫做"急切状态"，它可以在更新过程中提前计算并保存一些状态，以提高性能。hasEagerState 就是用来表示当前更新操作是否包含了这种急切状态。
        eagerState: null, // 如果hasEagerState为true，则eagerState表示急切状态的具体内容。它可能是一些预先计算好的状态值，用于在更新过程中快速获取和应用。
        next: (null: any), // 这个属性表示下一个更新操作。在 React 中，更新操作往往会形成一个链表结构，next 就是用来指向链表中的下一个更新操作的。这样可以方便 React 在更新过程中按照一定的顺序执行这些操作。
    };

    // 如果当前更新处于渲染阶段，则将更新操作放入渲染阶段的更新队列中；否则，获取当前 fiber 对象的备份。
    if (isRenderPhaseUpdate(fiber)) {
        enqueueRenderPhaseUpdate(queue, update);
    } else {
        const alternate = fiber.alternate;
        if (
            fiber.lanes === NoLanes &&
            (alternate === null || alternate.lanes === NoLanes)
        ) {
            // 当 React 的更新队列为空时，可以尝试提前计算下一个状态。如果提前计算的新状态与当前状态相同，那么可能就没有必要继续后续的渲染操作，可以直接跳过，从而提高性能。
            const lastRenderedReducer = queue.lastRenderedReducer;
            if (lastRenderedReducer !== null) {
                let prevDispatcher;
                try {
                    const currentState: S = (queue.lastRenderedState: any);
                    const eagerState = lastRenderedReducer(currentState, action);
                    // 将急切计算的状态和用于计算它的 reducer 存储在更新对象上。如果在进入渲染阶段之前 reducer 没有改变，那么就可以直接使用急切状态，而不必重新调用 reducer 计算状态。
                    update.hasEagerState = true;
                    update.eagerState = eagerState;
                    // 用于检查先前急切计算得到的状态是否与当前状态相同
                    // 如果先前急切计算得到的状态与当前状态相同，说明在渲染阶段之前就已经得到了与当前状态相同的状态，因此可以直接跳过后续的渲染过程，不用重新调度 React 进行重新渲染。
                    if (is(eagerState, currentState)) {
                        // 将当前的 fiber 对象、更新队列和更新对象作为参数传递进去，用于处理并及早退出渲染。
                        enqueueConcurrentHookUpdateAndEagerlyBailout(fiber, queue, update);
                        return;
                    }
                } catch (error) {
                    // Suppress the error. It will throw again in the render phase.
                } finally {
                }
            }
        }

        // 将更新操作 update 放入更新队列 queue 中，并返回更新所影响的根节点 root。
        const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
        //  如果 root 不为 null，表示有根节点需要进行更新。
        // 调度器（Scheduler）会根据应用的状态变化，确定哪些部分的组件需要进行重新渲染。
        // 如果存在需要更新的根节点，则会将相应的更新任务调度到这些根节点上，以触发重新渲染。
        if (root !== null) {
            // 对根节点 root 进行更新调度。这个函数会安排在给定 fiber 上的 lane 通道上进行更新。
            scheduleUpdateOnFiber(root, fiber, lane);
            // 这个函数用于在根节点 root 上处理转换更新，以确保更新的正确执行。
            entangleTransitionUpdate(root, queue, lane);
        }
    }
    markUpdateInDevTools(fiber, lane, action);
}
```

### enqueueConcurrentHookUpdate & enqueueUpdate

```tsx
export function enqueueConcurrentHookUpdate<S, A>(
fiber: Fiber,
 queue: HookQueue<S, A>,
 update: HookUpdate<S, A>,
 lane: Lane,
): FiberRoot | null {
    const concurrentQueue: ConcurrentQueue = (queue: any);
    const concurrentUpdate: ConcurrentUpdate = (update: any);
    enqueueUpdate(fiber, concurrentQueue, concurrentUpdate, lane);
    return getRootForUpdatedFiber(fiber);
}
```

### enqueueUpdate

```tsx
function enqueueUpdate(
fiber: Fiber,
 queue: ConcurrentQueue | null,
 update: ConcurrentUpdate | null,
 lane: Lane,
) {
    // 将当前 Fiber 节点、队列、更新操作和优先级信息依次添加到一个名为 concurrentQueues 的数组中。concurrentQueues 是用于存储并发更新任务的队列。
    concurrentQueues[concurrentQueuesIndex++] = fiber;
    concurrentQueues[concurrentQueuesIndex++] = queue;
    concurrentQueues[concurrentQueuesIndex++] = update;
    concurrentQueues[concurrentQueuesIndex++] = lane;

    // 在并发模式下，可能会有多个更新任务同时被提交，这些更新任务可能有不同的优先级。
    // 因此，为了确保整个系统能够正确地处理这些更新任务，需要将它们的优先级进行合并或者说归并。
    // 这样做的目的是确保高优先级的更新任务能够尽快得到处理，以提升系统的响应性和性能，并保证用户体验。
    concurrentlyUpdatedLanes = mergeLanes(concurrentlyUpdatedLanes, lane);

    // fiber.lanes字段在某些地方被用来检查是否有任何工作被调度，以执行急切的退出，因此我们需要立即更新它。
    fiber.lanes = mergeLanes(fiber.lanes, lane);
    const alternate = fiber.alternate;
    if (alternate !== null) {
        alternate.lanes = mergeLanes(alternate.lanes, lane);
    }
}
```

### getRootForUpdatedFiber

```tsx
function getRootForUpdatedFiber(sourceFiber: Fiber): FiberRoot | null {
    // 防止发生无限更新循环（infinite update loop），如果检测到存在无限更新循环，会抛出异常。
    throwIfInfiniteUpdateLoopDetected();
    // 然后通过向上遍历源 Fiber 节点的父节点链（return），直到找到根节点为止。
    // 在遍历过程中，每一步都会调用 detectUpdateOnUnmountedFiber 函数来检测是否在未挂载的 Fiber 节点上进行了更新操作。
    detectUpdateOnUnmountedFiber(sourceFiber, sourceFiber);
    let node = sourceFiber;
    let parent = node.return;
    while (parent !== null) {
        detectUpdateOnUnmountedFiber(sourceFiber, node);
        node = parent;
        parent = node.return;
    }
    return node.tag === HostRoot ? (node.stateNode: FiberRoot) : null;
}
```



## 总结

以下更新部分代码还需要阅读，下次会和 Fiber 的 WorkLoop 结合学习

```js
// 将更新操作 update 放入更新队列 queue 中，并返回更新所影响的根节点 root。
const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
//  如果 root 不为 null，表示有根节点需要进行更新。
// 调度器（Scheduler）会根据应用的状态变化，确定哪些部分的组件需要进行重新渲染。
// 如果存在需要更新的根节点，则会将相应的更新任务调度到这些根节点上，以触发重新渲染。
if (root !== null) {
    // 对根节点 root 进行更新调度。这个函数会安排在给定 fiber 上的 lane 通道上进行更新。
    scheduleUpdateOnFiber(root, fiber, lane);
    // 这个函数用于在根节点 root 上处理转换更新，以确保更新的正确执行。
    entangleTransitionUpdate(root, queue, lane);
}
```



本文学习到的流程：

- useState 的初始化
- 更新事件的 dispatch，eagetState的渲染优化处理，子渲染树的检索

![image-20240324145635186](http://assest.sablogs.cn/img/typora/image-20240324145635186.png)

## 下次学习方向

- Fiber 的 WorkLoop

