---
title: 比较requestAnimationFrame、nextTick 和 requestIdleCallback
date: 2025-03-19
tags: 
    - 前端
    - JavaScript
    - 性能优化
    - 事件循环
    - 任务调度
---

# 比较requestAnimationFrame、nextTick 和 requestIdleCallback

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

requestAnimationFrame、nextTick 和 requestIdleCallback 是 JavaScript 中三种任务调度机制，分别用于处理渲染同步任务、DOM 更新后逻辑和空闲期任务。本文将详细介绍这三种函数的定义、执行时机、用途以及适用场景。

<!-- DESC SEP -->

在 JavaScript 中，requestAnimationFrame、nextTick 和 requestIdleCallback 是三种与任务调度相关的函数，但它们的用途、执行时机和适用场景有显著区别。以下是对它们的详细对比和解释：

## 对比

### requestAnimationFrame

- **定义**: requestAnimationFrame 是一个浏览器提供的 API，用于在浏览器下一次重绘（repaint）之前执行回调函数。通常与动画相关任务绑定。

- **执行时机**: 在浏览器渲染帧之前执行（通常与显示器的刷新率同步，例如 60Hz 对应约 16.67ms 一帧）。

- **用途**: 

  - 主要用于动画、绘制或更新 DOM 的场景。
  - 确保任务与浏览器渲染同步，避免掉帧或不流畅的视觉效果。

- **特点**:

  - 回调函数接收一个时间戳参数（timestamp），表示当前帧的开始时间。
  - 如果浏览器标签页不可见，requestAnimationFrame 会暂停执行，节省资源。

- **示例**:

  ```javascript
  function animate() {
    console.log("Frame rendered");
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
  ```

### nextTick（在 Vue.js 或 Node.js 中常见）

- **定义**: 

  - 在 Vue.js 中，Vue.nextTick 是一个工具方法，用于在 DOM 更新完成后执行回调。
  - 在 Node.js 中，process.nextTick 用于在当前事件循环的当前阶段结束后立即执行回调。
  - 注意：nextTick 不是原生 JavaScript 的浏览器 API，而是特定框架或运行时的实现。

- **执行时机**: 

  - Vue.js: 在下一次 DOM 更新循环之后（通常依赖微任务队列，例如 Promise.resolve()）。
  - Node.js: 在当前事件循环阶段完成后，但早于 I/O 回调或 setTimeout。

- **用途**:

  - Vue.js: 用于在数据更新后等待 DOM 渲染完成时执行操作。
  - Node.js: 用于将任务推迟到当前执行栈清空后，但优先级高于其他异步任务。

- **特点**:

  - 不直接与浏览器渲染帧绑定，而是与事件循环或框架机制相关。
  - 依赖微任务队列（microtask queue），执行时机比宏任务（如 setTimeout）更早。

- **示例**（Vue.js）:

  ```javascript
  this.message = "Updated";
  this.$nextTick(() => {
    console.log("DOM updated:", this.$el.textContent);
  });
  ```

### requestIdleCallback

- **定义**: requestIdleCallback 是一个浏览器 API，用于在浏览器空闲时执行低优先级任务。

- **执行时机**: 在浏览器完成当前帧的渲染后，如果有空闲时间（通常是帧之间的剩余时间），则执行回调。

- **用途**:

  - 用于执行不需要立即完成的任务，例如后台数据处理、日志记录或预加载。
  - 避免影响动画或用户交互的流畅性。

- **特点**:

  - 回调函数接收一个 IdleDeadline 对象，包含 timeRemaining() 方法，用于判断剩余空闲时间。
  - 可以设置超时（timeout），如果空闲时间太久未触发，则强制执行。
  - 如果浏览器忙碌（例如高负载动画），任务可能被推迟。

- **示例**:

  ```javascript
  requestIdleCallback((deadline) => {
    while (deadline.timeRemaining() > 0) {
      console.log("Doing some background work");
    }
  }, { timeout: 2000 });
  ```

## 适用场景

- **requestAnimationFrame**: 需要流畅动画或与浏览器渲染同步的任务，例如游戏循环、CSS 动画替代品。如果任务与动画或 UI 更新相关，优先使用 requestAnimationFrame。
- **nextTick**: 处理框架（如 Vue）中的 DOM 更新后逻辑，或在 Node.js 中优化事件循环。如果任务依赖 DOM 更新完成（如 Vue 数据变更后），使用 nextTick。
- **requestIdleCallback**: 执行不紧急的任务，例如分析用户行为、预加载资源。如果任务可以推迟到空闲时执行，使用 requestIdleCallback。

## 与 setTimeout 对比？

- 一个通用的定时器，将任务放入宏任务队列（macrotask queue），在指定延迟后执行。

- 不与浏览器渲染帧绑定，执行时机可能导致“跳帧”（例如在渲染中间执行）。

- 示例：

  ```javascript
  setTimeout(() => console.log("Timeout"), 0);
  ```

------

### 执行顺序

在 JavaScript 的事件循环中，任务分为 **微任务（microtasks）** 和 **宏任务（macrotasks）**，浏览器还会额外处理渲染步骤。以下是它们在事件循环中的大致执行时机：

1. **事件循环的执行步骤**（简化和浏览器相关）：
   - 执行当前调用栈中的同步代码。
   - 处理微任务队列（例如 Promise.then、nextTick）。
   - 渲染更新（包括 requestAnimationFrame 的回调）。
   - 处理宏任务队列（例如 setTimeout、setInterval）。
   - 如果有空闲时间，执行 requestIdleCallback。
2. **各函数的执行时机**：
   - **nextTick**（Vue.js 使用微任务实现，例如 Promise；Node.js 使用 process.nextTick）：
     - 在当前调用栈清空后，微任务队列中最先执行。
   - **requestAnimationFrame**：
     - 在渲染阶段之前执行（通常在微任务之后，渲染 DOM 之前）。
   - **setTimeout**：
     - 在宏任务队列中，渲染阶段完成后执行（即使延迟设为 0ms，也会等到下一轮宏任务）。
   - **requestIdleCallback**：
     - 在当前帧渲染后，如果有空闲时间才执行；如果没有空闲，可能推迟到下一帧的空闲时间。

## 练一练

```javascript
console.log("Start");

setTimeout(() => console.log("setTimeout"), 0);
Promise.resolve().then(() => console.log("Promise"));
Vue.nextTick(() => console.log("Vue nextTick")); // 假设在 Vue 环境中
requestAnimationFrame(() => console.log("rAF"));
requestIdleCallback(() => console.log("rIC"));

console.log("End");
```

**输出顺序**（假设在浏览器中运行，Vue 使用微任务实现）：

```text
Start
End
Promise
Vue nextTick
rAF
setTimeout
rIC
```

**解释**：

- Start 和 End 是同步代码，最先执行。
- Promise 和 Vue.nextTick 是微任务，在同步代码后立即执行。
- requestAnimationFrame 在渲染前执行，比宏任务早。
- setTimeout 是宏任务，在渲染后执行。
- requestIdleCallback 在空闲时执行，通常最晚。

在事件循环的单次迭代中，假设所有函数同时触发（延迟为 0 或默认行为）：

1. **nextTick**（微任务）：最先执行，因为微任务优先级最高。
2. **requestAnimationFrame**：其次执行，与渲染阶段绑定，在宏任务之前。
3. **setTimeout**：再次执行，作为宏任务，在渲染后执行。
4. **requestIdleCallback**：最后执行，仅在空闲时运行，可能推迟到下一帧。

**注意**：

- 如果 setTimeout 的延迟大于 0，它会显著滞后。
- 如果浏览器忙碌（例如高负载动画），requestIdleCallback 可能被推迟甚至不执行（除非设置了 timeout）。

## 总结

| 函数     | setTimeout                       | requestAnimationFrame    | nextTick (Vue/Node)          | requestIdleCallback      |
| -------- | -------------------------------- | ------------------------ | ---------------------------- | ------------------------ |
| 定义     | 在指定延迟后将任务加入宏任务队列 | 在下一次浏览器重绘前执行 | 在微任务队列或特定时机执行   | 在浏览器空闲时执行       |
| 延迟控制 | 可指定延迟（单位：毫秒）         | 无明确延迟，与刷新率同步 | 无延迟，依赖微任务或框架逻辑 | 无明确延迟，依赖空闲时间 |
| 用途     | 通用定时任务                     | 动画、渲染相关任务       | DOM 更新后逻辑或事件优化     | 低优先级后台任务         |
| 执行时机 | 宏任务队列，延迟后执行           | 渲染前（与帧同步）       | 微任务队列或当前阶段后       | 空闲时（帧后）           |
| 环境     | 浏览器和 Node.js                 | 浏览器                   | Vue.js 或 Node.js            | 浏览器                   |

