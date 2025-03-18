# React useState 原理

## 简介

当你试着去了解hooks原理的时候，你应该使用过react的class组件，或者已经使用过hooks了。

在React v16.8之前，React主要依赖class组件创建有状态组件，而无状态组件则采用函数式组件编写。这时期的函数式组件通常被称为无状态组件，因为它们缺乏内部状态，每次渲染都重新初始化函数，主要用于简单的渲染任务。

随着React v16.8引入Hooks，特别是`useState`，函数式组件得以拥有内部状态，不再仅限于简单渲染。`useState`允许函数式组件在执行周期之间保持状态，使其在多次渲染之间保留状态信息。这一改变使函数式组件具备了更类似class组件的能力，同时保持了简洁和清晰的语法。

通过使用`useState`等Hooks，函数式组件能更灵活地处理内部状态，使开发者能方便地在函数式组件中进行状态管理和副作用处理。这一特性的引入是React发展中的重要一步，也是函数式组件逐渐成为React应用主要组件形式的推动因素之一。

本文将探讨以下几点问题

- `useState`如何能让函数式组件有了状态
- 为什么不能在条件语句中声明`hooks`
- `hooks`为什么要声明在组件的最顶部

## React Hooks

> 我们从这个文件开始看：packages/react/src/ReactHooks.js

可以看到：这个文件是一个React源代码文件，其中包含了一些React钩子（hooks）的实现。

ReactHooks.js伪代码如下：

```js
// 伪代码 - React Hooks 实现文件
import ReactCurrentDispatcher from './ReactCurrentDispatcher';

// 获取当前的dispatcher
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current
  return dispatcher
}

// useState钩子的实现
export function useState(initialState){
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
```

我们在这里只关注两个函数，一个是useState，一个是resolveDispatcher

### resolveDispatcher

resolveDispatcher函数中，可以看到了引用外部文件中的ReactCurrentDispatcher，我们去看看

```js
// packages/react/src/ReactCurrentDispatcher.js

/**
 * Keeps track of the current dispatcher.
 */
const ReactCurrentDispatcher = {
  current: null,
};

export default ReactCurrentDispatcher;
```

可以看到，该模块的主要作用是提供一个全局的、可被 React 内部访问的变量，用于存储当前的 dispatcher。

这有助于 React 内部和不同模块之间共享当前的 dispatcher 实例，以确保 hooks 能够在正确的上下文中执行。

### useState

- 入参 - initialState

用过react hooks 的同学都知道，这是用来初始化state的值

- dispatcher.useState

不难发现， `dispatcher` 对象有一个名为 `useState` 的方法，它实际上会调用 React 内部的 `useState` 实现。

## ReactFiberHooks

看到这，线索好像断掉了，于是我问了问GPT

![image-20231216195153024](http://assest.sablogs.cn/img/typora/image-20231216195153024.png)

于是我们来到这个文件：packages/react-reconciler/src/ReactFiberHooks.js

打开文件一看，好家伙，4800多行。

之前我们了解到了ReactCurrentDispatcher这么个玩意，他提供了一个全局的变量，那么这个文件有没有用到？

果然，发现了这么两行代码，从`shared/ReactSharedInternals`引入，有ReactCurrentDispatcher、 ReactCurrentBatchConfig两个变量，其中一个就是我们熟悉的ReactCurrentDispatcher。

```js
import ReactSharedInternals from 'shared/ReactSharedInternals';

const {ReactCurrentDispatcher, ReactCurrentBatchConfig} = ReactSharedInternals;
```

### ReactSharedInternals

进入到`shared/ReactSharedInternals`这个文件

```js
import * as React from 'react';

const ReactSharedInternals =
  React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

export default ReactSharedInternals;
```

`React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`的来源我就简单放一下，感兴趣的同学自己去看源码

```js
// packages/react/src/React.js

import ReactSharedInternals from './ReactSharedInternalsClient';

export {
  ...
  ReactSharedInternals as __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  ...
};
```

```js
// packages/react/src/ReactSharedInternalsClient.js

import ReactCurrentDispatcher from './ReactCurrentDispatcher';

const ReactSharedInternals = {
  ReactCurrentDispatcher,
  ReactCurrentBatchConfig,
  ...
};
    
export default ReactSharedInternals;
```

到这明白了，`React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED`其实就是我们最开始看到的这玩意

```js
const ReactCurrentDispatcher = {
  current: null,
};

export default ReactCurrentDispatcher;
```

### type Hook

好，现在回到`packages/react-reconciler/src/ReactFiberHooks.js `，在该文件中，我们可以看到Hook的type

```ts
export type Hook = {
  memoizedState: any, // 上次渲染时所用的 state
  baseState: any, // 已处理的 update 计算出的 state
  baseQueue: Update<any, any> | null, // 未处理的 update 队列（一般是上一轮渲染未完成的 update）
  queue: UpdateQueue<any, any> | null, // 当前出发的 update 队列
  next: Hook | null, // 指向下一个 hook，形成链表结构
};
```

举个例子，用于说明 `useState` 在链表中的关系。

首先，在组件渲染的过程中，React 会为每个 `useState` 调用创建一个新的 `Hook` 对象。在这个例子中，我们有两个 `useState`，因此会有两个对应的 `Hook` 对象。

```js
function MyComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("Hello, React!");

  return (
    <div>
      <p>Count: {count}</p>
      <p>Text: {text}</p>
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <button onClick={() => setText("New Text")}>Change Text</button>
    </div>
  );
}
```

1. 初始渲染时创建 Hook 对象：

```js
// 初始渲染时创建的 Hook 链表
Hook (count)
  -> Hook (text)
    -> null
```

在链表中，每个 `Hook` 对象的 `next` 属性指向下一个 `Hook` 对象，形成了链表结构。

2. 执行更新时更新 Hook 对象：

```js
// 执行更新后的 Hook 链表
Hook (count, updatedStateForCount)
  -> Hook (text, updatedStateForText)
    -> null
```

在这个例子中，`updatedStateForCount` 和 `updatedStateForText` 分别表示更新后的状态。

每个 `Hook` 对象的 `memoizedState` 属性存储了上次渲染时使用的状态，而 `baseState` 存储了已处理的 update 计算出的状态。

### ReactFiberBeginWork

来到`react/packages/react-reconciler/src/ReactFiberBeginWork.js`，注意看`updateFunctionComponent`函数，

```ts
function beginWork(
 current: Fiber | null,
 workInProgress: Fiber,
 renderLanes: Lanes,
): Fiber | null {
   // ...

    case FunctionComponent: {
        const Component = workInProgress.type;
        const unresolvedProps = workInProgress.pendingProps;
        const resolvedProps =
              workInProgress.elementType === Component
        ? unresolvedProps
        : resolveDefaultProps(Component, unresolvedProps);
        return updateFunctionComponent(
            current,
            workInProgress,
            Component,
            resolvedProps,
            renderLanes,
        );
    }

    // ...
}
```

```ts
function updateFunctionComponent(
  current: null | Fiber,
  workInProgress: Fiber,
  Component: any,
  nextProps: any,
  renderLanes: Lanes,
) {
     // ...
  if (__DEV__) {
     // ...
  } else {
    nextChildren = renderWithHooks(
      current,
      workInProgress,
      Component,
      nextProps,
      context,
      renderLanes,
    );
    hasId = checkDidRenderIdHook();
  }
    // ...
}
```

`renderWithHooks`主要做了两件事：

- 用变量 currentlyRenderingFiber记录当前的 fiber node。使得useState能拿到当前 node的状态。
- 判断 hook api 挂载在那个对象上。首次渲染和后期的更新，挂载的对象是不同的

```ts
// react/packages/react-reconciler/src/ReactFiberHooks.js

export function renderWithHooks<Props, SecondArg>(
    // 当前页面正在渲染的node，第一次渲染为null
    current: Fiber | null,
    // 新的node，用于下次页面更新
    workInProgress: Fiber,
    // 渲染组件的函数
    Component: (p: Props, arg: SecondArg) => any,
    // 组件的属性
    props: Props,
    // context
    secondArg: SecondArg,
    // fiber渲染过期时间
    nextRenderLanes: Lanes,
): any {
    // 将全局变量 renderLanes 设置为下一个渲染的优先级
    renderLanes = nextRenderLanes;
    // 将全局变量 currentlyRenderingFiber 设置为当前工作中的 Fiber 节点
    currentlyRenderingFiber = workInProgress;

    // ...

    if (__DEV__) {
        // ...
    } else {
        // 组件首次渲染，hook 从 HooksDispatcherOnMount 取
        // 非首次渲染， hook 从 HooksDispatcherOnUpdate 取
        ReactCurrentDispatcher.current =
            current === null || current.memoizedState === null
            ? HooksDispatcherOnMount
            : HooksDispatcherOnUpdate;
    }

    // ...
}

```

![image-20231217184846058](http://assest.sablogs.cn/img/typora/image-20231217184846058.png)

![image-20231217184912482](http://assest.sablogs.cn/img/typora/image-20231217184912482.png)

可以看到，在组件首次渲染的时候，`useState = mountState`；非首次渲染，`useState = upStateState`

### mountState

```ts
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) {
    // 第一次打开页面，链表是空的
    // 初始化currentlyRenderingFiber.memoizedState、workInProgressHook
    // currentlyRenderingFiber表示当前正在被渲染的 Fiber 节点
    // workInProgressHook表示当前正在工作的 Hook
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else {
    // 不是第一个hook对象，就把新的hook放在链表后面
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}

function mountStateImpl<S>(initialState: (() => S) | S): Hook {
  // 创建一个新的 Hook 用于在组件生命周期中管理状态。
  const hook = mountWorkInProgressHook();
  // 如果初始状态是一个函数，则调用它以获取实际的初始状态值。
  if (typeof initialState === 'function') {
    initialState = initialState();
  }
  // 将 Hook 的 memoizedState 和 baseState 设置为初始状态。
  hook.memoizedState = hook.baseState = initialState;
  // 创建一个更新队列，用于管理状态更新。
  const queue: UpdateQueue<S, BasicStateAction<S>> = {
    // 待应用于状态的挂起更新。
    pending: null,
    // lanes 是一个位掩码（bitmask），每一位都代表一个优先级的更新。
    // React 使用 lanes 来追踪每个 Fiber 节点（组件）的更新状态，以确定何时处理更新。
    lanes: NoLanes,
    // 负责分派更新到状态的函数。
    dispatch: null,
    // 在渲染期间用于计算下一个状态的约简器函数。
    lastRenderedReducer: basicStateReducer,
    // 上一次组件更新期间渲染的最后状态。
    lastRenderedState: (initialState: any),
  };
  // 将更新队列附加到 Hook 上。
  hook.queue = queue;
  // 返回初始化的 Hook。
  return hook;
}

function mountState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const hook = mountStateImpl(initialState);
  const queue = hook.queue;
  const dispatch: Dispatch<BasicStateAction<S>> = (dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any);
  queue.dispatch = dispatch;
  return [hook.memoizedState, dispatch]; // 返回 state ， 以及 setState 函数
}
```

### updateState

```ts
function updateState<S>(
initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
    return updateReducer(basicStateReducer, initialState);
}
```

可以看到其实 `updateState` 的内部逻辑，其实是就是 `updateReducer`，所以其实 `useState `和 `useReducer` 两个 `hooks` 其实做的是同一件事 => 更新 `state`

useState 和 useReduer 的关系：

- useState 是 useReduer 的一个特殊情况，其传入的 reducer 是固定的   basicStateReducer，负责改变 state

- useReducer 可以传入自定义的 reducer

`updateState` 做的事情，实际上就是拿到更新队列，循环队列，并根据每一个 `update` 对象对当前 `hook` 进行状态更新。最后返回最终的结果。

### updateReducer

```ts
function updateReducer<S, I, A>(
reducer: (S, A) => S,
 initialArg: I,
 init?: I => S,
): [S, Dispatch<A>] {
    const hook = updateWorkInProgressHook();
    return updateReducerImpl(hook, ((currentHook: any): Hook), reducer);
}
```

### updateWorkInProgressHook

```ts
// 在 React 的渲染和更新过程中，会涉及到多次调用这个函数，以确保正确地维护和更新 Hook 的状态信息。
function updateWorkInProgressHook(): Hook {
    // 此函数用于处理更新以及由渲染阶段更新触发的重新渲染。
    // 它假设存在当前可克隆的 Hook，或者可以用作基础的上一个渲染传递中的工作中 Hook。
    let nextCurrentHook: null | Hook;
    // 当 currentHook 为 null 时，表示当前是首次渲染
    if (currentHook === null) {
        // 如果有备用节点 (currentlyRenderingFiber.alternate)，则从备用节点的记忆状态中获取
        const current = currentlyRenderingFiber.alternate;
        if (current !== null) {
            nextCurrentHook = current.memoizedState;
        } else {
            nextCurrentHook = null;
        }
    } else {
        nextCurrentHook = currentHook.next;
    }

    let nextWorkInProgressHook: null | Hook;

    // 如果当前工作中的 Hook (workInProgressHook) 为 null，则表示这是首次渲染，
    // 将当前渲染的 Fiber 节点的记忆状态设置为下一个工作中的 Hook (currentlyRenderingFiber.memoizedState)。
    if (workInProgressHook === null) {
        nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
    } else {
        nextWorkInProgressHook = workInProgressHook.next;
    }

    // 如果 nextWorkInProgressHook 不为 null，说明已经有一个工作中的 Hook，可以直接复用。
    if (nextWorkInProgressHook !== null) {
        workInProgressHook = nextWorkInProgressHook;
        nextWorkInProgressHook = workInProgressHook.next;

        currentHook = nextCurrentHook;
    } else {
        // 否则，表示需要从当前 Hook 克隆一个新的 Hook，并更新当前 Hook 为下一个当前 Hook。
        // 如果 nextCurrentHook 为 null，表示这是初始渲染。
        if (nextCurrentHook === null) {
            const currentFiber = currentlyRenderingFiber.alternate;
            // 如果有备用节点 (currentlyRenderingFiber.alternate)，则抛出错误，因为在初始渲染时不应该调用更新 Hook。
            if (currentFiber === null) {
                // 这是初始渲染。当组件挂起、恢复，然后渲染额外的 Hook 时，会进入此分支。
                // 实际上不应该到达这里，因为我们应该首先切换到挂载分发器。
                throw new Error(
                    'Update hook called on initial render. This is likely a bug in React. Please file an issue.',
                );
            } else {
                // 否则，说明这是一个更新，抛出错误，因为在更新时应该始终有一个当前 Hook。
                // This is an update. We should always have a current hook.
                throw new Error('Rendered more hooks than during the previous render.');
            }
        }

        // 更新当前 Hook 为下一个当前 Hook。
        currentHook = nextCurrentHook;

        const newHook: Hook = {
            memoizedState: currentHook.memoizedState,

            baseState: currentHook.baseState,
            baseQueue: currentHook.baseQueue,
            queue: currentHook.queue,

            next: null,
        };

        if (workInProgressHook === null) {
            // 如果当前工作中的 Hook 为 null，说明这是列表中的第一个 Hook
            // 将当前渲染的 Fiber 节点的记忆状态设置为新的工作中的 Hook。
            currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
        } else {
            // 否则，将新的工作中的 Hook 添加到列表末尾。
            workInProgressHook = workInProgressHook.next = newHook;
        }
    }
    return workInProgressHook;
}
```

### updateReducerImpl

```ts
function updateReducerImpl<S, A>(
hook: Hook,
 current: Hook,
 reducer: (S, A) => S,
): [S, Dispatch<A>] {
    const queue = hook.queue;

    // 检查队列是否存在
    if (queue === null) {
        throw new Error(
            '应该有一个队列。这可能是 React 中的一个 bug，请报告一个问题。',
        );
    }

    queue.lastRenderedReducer = reducer;

    // 获取基本队列
    let baseQueue = hook.baseQueue;

    // 获取未处理的更新队列
    const pendingQueue = queue.pending;
    if (pendingQueue !== null) {
        // 有未处理的更新，将它们添加到基本队列中
        if (baseQueue !== null) {
            // 合并未处理队列和基本队列
            const baseFirst = baseQueue.next;
            const pendingFirst = pendingQueue.next;
            baseQueue.next = pendingFirst;
            pendingQueue.next = baseFirst;
        }
        current.baseQueue = baseQueue = pendingQueue;
        queue.pending = null;
    }

    if (baseQueue !== null) {
        // 有队列需要处理
        const first = baseQueue.next;
        let newState = hook.baseState;

        let newBaseState = null;
        let newBaseQueueFirst = null;
        let newBaseQueueLast: Update<S, A> | null = null;
        let update = first;
        do {
            // 从更新中删除 OffscreenLane 位，以区分在隐藏树中进行的更新和已在进入 Offscreen 树时添加到 renderLanes 的更新。
            const updateLane = removeLanes(update.lane, OffscreenLane);
            const isHiddenUpdate = updateLane !== update.lane;

            // 假设有以下场景：
            // 组件A的一个异步操作触发了更新。
            // 在更新时，React 可能会将更新的优先级（updateLane）设置为比当前渲染的优先级（renderLanes）更低的优先级。
            // 如果异步操作触发的更新的优先级较低，那么在 React 异步渲染的环境中，就有可能会将这个更新跳过，不立即处理。
            // 这样做的原因是为了优先处理那些更紧急、更高优先级的更新，以提高用户界面的响应性。
            const shouldSkipUpdate = isHiddenUpdate
            ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane)
            : !isSubsetOfLanes(renderLanes, updateLane);

            if (shouldSkipUpdate) {
                // 跳过更新
                // ...
            } else {
                // 此更新具有足够的优先级。

                // 检查这是否是一次乐观更新。
                // 在 React 中，乐观更新常常与状态管理和异步操作有关。具体来说，乐观更新的流程通常如下：
                // 1、用户触发某个操作，例如提交一个表单、点击一个按钮。
                // 2、应用程序会立即更新界面，展示操作的预期结果。
                // 3、同时，应用程序会发起实际的操作，比如向服务器发送请求。
                // 4、当实际操作完成后，根据实际结果更新界面。如果实际操作成功，则保持界面的状态不变；如果失败，则可能需要回滚或采取其他错误处理措施。
                const revertLane = update.revertLane;
                if (!enableAsyncActions || revertLane === NoLane) {
                    // 这不是一次乐观更新，我们现在将应用它。但是，如果之前有被跳过的更新，我们需要将此更新保留在队列中，以便以后可以重新基于它。
                    if (newBaseQueueLast !== null) {
                        const clone: Update<S, A> = {
                            lane: NoLane,
                            revertLane: NoLane,
                            action: update.action,
                            hasEagerState: update.hasEagerState,
                            eagerState: update.eagerState,
                            next: (null: any),
                        };
                        // 在React的更新机制中，更新以链表的形式存在，每个更新都是一个节点。
                        // newBaseQueueLast 的作用是指向这个链表中的最后一个节点，以方便在更新队列的尾部添加新的更新。
                        newBaseQueueLast = newBaseQueueLast.next = clone;
                    }
                } else {
                    // 乐观更新
                    // ...
                }
                const action = update.action;
                if (shouldDoubleInvokeUserFnsInHooksDEV) {
                    reducer(newState, action);
                }
                if (update.hasEagerState) {
                    // 如果此更新是状态更新（而不是 reducer）并且已急切处理，我们可以使用急切计算的状态
                    newState = ((update.eagerState: any): S);
                } else {
                    newState = reducer(newState, action);
                }
            }
            update = update.next;
        } while (update !== null && update !== first);

        if (newBaseQueueLast === null) {
            newBaseState = newState;
        } else {
            newBaseQueueLast.next = (newBaseQueueFirst: any);
        }

        // 当 newState 和 hook.memoizedState 相同时，说明状态没有发生变化。
        // 在 React 中，如果状态没有发生变化，React 通常会避免不必要的重新渲染，以提高性能。
        if (!is(newState, hook.memoizedState)) {
            markWorkInProgressReceivedUpdate();
        }

        hook.memoizedState = newState;
        hook.baseState = newBaseState;
        hook.baseQueue = newBaseQueueLast;

        queue.lastRenderedState = newState;
    }

    if (baseQueue === null) {
        // `queue.lanes` 用于交织过渡。一旦队列为空，我们可以将其设置回零。
        queue.lanes = NoLanes;
    }

    const dispatch: Dispatch<A> = (queue.dispatch: any);
    return [hook.memoizedState, dispatch];
}
```

### enqueueRenderPhaseUpdate

```ts
function enqueueRenderPhaseUpdate<S, A>(
queue: UpdateQueue<S, A>,
 update: Update<S, A>,
): void {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate =
        true;
    const pending = queue.pending;
    if (pending === null) {
        // This is the first update. Create a circular list.
        update.next = update;
    } else {
        update.next = pending.next;
        pending.next = update;
    }
    queue.pending = update;
}
```



通过`enqueueRenderPhaseUpdate`我们可以看到，实际上，`dispatchSetState` 这个函数主要做了两件事情。

- 第一件事：创建了一个 `update` 对象，这个对象上面保存了本次更新的相关信息，包括新的状态值 `action`。
- 第二件事：将所有的 `update` 对象串成了一个**环形链表**，保存在我们 `hook` 对象的 `queue.pending` 属性上面。

![ee5af52e1f814902bcb80700fc965a0a~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0](http://assest.sablogs.cn/img/typora/ee5af52e1f814902bcb80700fc965a0a~tplv-k3u1fbpfcp-zoom-in-crop-mark_1512_0_0_0.webp)

> **使用环形链表的意义：**
>  整个环形链表变量我们叫它 `update`，使得 `queue.pending = update ` 那么此时 `queue.pending` 的最近一次更新，就是 `update`，最早的一次更新是 `update.next`
>  这样就快速定位到最早的一次更新了
>  如果是单链表，想找到最早的 一次更新，需要一层一层往下找
>  环形链表一次就找到了

## 总结

React 通过记录每次更新的状态来实现对组件状态的追踪和管理。这种记录的作用主要有以下几个方面：

1. **状态的持久化：** React Hooks 中的状态是持久化的，即它们在组件的多次渲染之间保持不变。每次组件重新渲染时，React 会使用之前的状态作为新的状态的基础，通过对状态的修改和更新来实现组件状态的管理。这就是 `memoizedState` 和 `baseState` 的作用，它们记录了状态的当前值和基础值。
2. **更新队列的构建：** 当组件中的状态发生变化时，React 不会立即执行更新，而是将更新放入更新队列中，通过 `baseQueue` 来记录。这样可以确保在一次组件渲染的过程中，所有的状态更新都被收集到一个队列中，并在合适的时机进行批量处理。
3. **更新的持久化：** React 通过更新队列（`baseQueue`）来记录组件状态的更新，每个更新都是一个节点，这些节点形成一个链表结构。这样，React 在处理更新时可以按照链表的顺序依次执行，并且能够正确处理异步和并发场景。
4. **优化性能：** 通过记录每次更新的状态和更新队列，React 可以在渲染过程中避免重复的计算和处理。只有发生真正的状态变化时，React 才会进行更新，提高了性能。

> 注意：
>
> 多次调用setState，也会在`baseQueue`生成多个更新节点。
>
> 但React 中的状态更新并不是立即执行的，而是在一次组件更新的过程中进行批量处理。
>
> React 通过更新队列（`baseQueue`）和协调阶段来实现对状态更新的批量处理，确保只有最终的状态变化会触发一次实际的渲染。

![useState流程图.png](http://assest.sablogs.cn/img/typora/b781ce0ea07642d4bb505efdb33167ea~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 参考

[React Hooks useState 使用详解+实现原理+源码分析](https://juejin.cn/post/7076456859611168776)

[facebook / react github源码](https://github.com/facebook/react/blob/main/packages/react-reconciler/src/ReactFiberHooks.js)

