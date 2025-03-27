---
title: Node.js 的 Event loop
date: 2024-03-11
tags:
  - Node.js
  - 事件循环
  - 异步编程
  - V8引擎
  - 性能优化
  - JavaScript引擎
---

# Node.js 的 Event loop

<!-- DESC SEP -->

Node.js 事件循环通过六个阶段协调异步操作：定时器阶段处理 setTimeout/setInterval 回调；I/O 回调阶段处理系统级操作；轮询阶段等待新I/O事件并执行对应回调；检查阶段执行 setImmediate 注册任务；关闭回调阶段处理 socket 关闭等清理工作。与浏览器事件循环相比，Node.js 新增了 setImmediate 和 process.nextTick 机制，其中 nextTick 拥有最高优先级在当前阶段末尾立即执行，这种分层调度机制使 Node.js 能够高效处理高并发 I/O 操作。

<!-- DESC SEP -->

> 官网链接：[Node.js — The Node.js Event Loop (nodejs.org)](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick)

## 作用

简单点说，Node.js 中的事件循环起到了协调和管理事件驱动的异步操作的作用，使得 Node.js 能够以高效、高性能的方式处理大量并发请求。

## 运行机制

Node.js 中的 Event Loop（事件循环）是其运行时环境的核心组成部分，负责处理异步操作、事件和回调函数的执行。

1. **事件循环启动**： 当 Node.js 应用程序启动时，事件循环被初始化并开始运行。事件循环会不断地等待事件发生并处理这些事件。
2. **处理事件队列**： Node.js 中有不同的阶段，事件循环会在这些阶段之间循环迭代。主要的阶段包括：
   - **Timers（定时器）阶段**：处理定时器的回调函数。
   - **I/O callbacks（I/O 回调）阶段**：处理一些系统级别的回调函数，比如网络请求、文件操作等的回调。
   - **Idle, prepare**：这些是一些内部使用的阶段，一般开发者不需要关心。
   - **Poll（轮询）阶段**：等待新的 I/O 事件，如果没有新的 I/O 事件发生，将会在此阶段等待。
   - **Check 阶段**：执行 `setImmediate()` 注册的回调函数。
   - **Close callbacks（关闭回调）阶段**：执行一些关闭的回调函数，比如关闭 socket 的回调函数。
3. **执行回调函数**： 在每个阶段中，事件循环会检查相应的事件队列是否有待处理的事件或回调函数。如果有，它会按照顺序执行这些回调函数，并将执行结果返回给调用者。
4. **循环迭代**： 事件循环会在以上阶段之间不断迭代，直到没有事件需要处理，并且没有计划的定时器。然后它会进入等待状态，直到有新的事件触发。

Node.js 的 Event Loop 保证了异步操作的顺序执行，并且不会阻塞主线程。这使得 Node.js 能够以高效的方式处理大量并发请求，提高系统的性能和响应速度。

| 阶段                            | 描述                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| Timers（定时器）阶段            | 处理定时器的回调函数。                                       |
| I/O callbacks（I/O 回调）阶段   | 处理一些系统级别的回调函数，比如网络请求、文件操作等的回调。 |
| Idle, prepare                   | 这些是一些内部使用的阶段，一般开发者不需要关心。             |
| Poll（轮询）阶段                | 等待新的 I/O 事件，如果没有新的 I/O 事件发生，将会在此阶段等待。 |
| Check 阶段                      | 执行 `setImmediate()` 注册的回调函数。                       |
| Close callbacks（关闭回调）阶段 | 执行一些关闭的回调函数，比如关闭 socket 的回调函数。         |

### Timers（定时器）阶段

计时器指定阈值，在阈值之后可以执行所提供的回调，而不是人们希望执行它的确切时间。

计时器回调将在指定时间过后尽早运行；但是，操作系统调度或其他回调的运行可能会延迟它们。

**从技术上讲，轮询阶段控制定时器何时执行。**

### I/O callbacks（I/O 回调）阶段

此阶段执行某些系统操作的回调，例如 TCP 错误类型。

例如，如果 TCP 套接字在尝试连接时收到 `ECONNREFUSED` ，则某些 *nix 系统希望等待报告错误。这将在待处理回调阶段排队执行。

### Poll（轮询）阶段

poll阶段有两个主要功能：

1. 计算应该阻塞和轮询 I/O 的时间
2. 处理轮询队列中的事件

简单来说：

- 检查是否有需要立即处理的 I/O 事件
  - 有
    - 迭代轮询队列中的回调函数，并同步执行它们，直到队列为空或达到系统相关的硬限制（比如系统资源不足等）。
  - 没有
    - 检查是否有被 `setImmediate()` 调度的任务
      - 有
        - 结束轮询阶段并执行这些调度的任务
      - 没有
        - 等待，直到有回调函数被添加到队列中，一旦有回调函数被添加，事件循环会立即执行它们。

### Check 阶段

一般情况下，事件循环会进入轮询阶段等待传入的连接、请求等。但是，如果使用了 `setImmediate()` 并且轮询阶段变为空闲，事件循环将结束并继续执行检查阶段，而不是等待轮询事件。

`setImmediate`是nodejs特有的api，他可以立即创建一个异步宏任务。nodejs在事件循环中还专门设了一个`check`时期，在这个时期会专门执行`setImmediate`的回调。

### Close callbacks（关闭回调）阶段

这个时期处理关闭事件，如**socket.on('close', ...)** 等这样可以确保在一些通讯结束前，所有任务都完成了。

## 理解NodeJS中的单线程

在 Node.js 中，“单线程”通常是指主 `JavaScript` 执行线程是单线程的，即 `JavaScript`代码的执行是单线程的。但是，`Node.js` 在内部使用了多线程来处理 I/O 操作。

1. **主 JavaScript 执行线程**：Node.js 中的 JavaScript 代码是在单个线程中执行的，也就是说，一个时间点只能有一个 JavaScript 代码块在执行。这就是说 JavaScript 代码无法实现真正的并行执行，因为它们都在同一个线程中。
2. **I/O 操作的多线程处理**：Node.js 在内部使用了多线程来处理 I/O 操作，比如文件读写、网络请求等。当进行一个 I/O 操作时，Node.js 会将其委托给底层操作系统或者线程池处理，这样就不会阻塞主 JavaScript 执行线程，从而保证了 JavaScript 代码的执行不会被 I/O 阻塞。

因此，尽管 Node.js 主要的 JavaScript 执行线程是单线程的，但是通过将 I/O 操作委托给其他线程或者线程池处理，Node.js 实现了非阻塞的 I/O 操作，保证了在高并发情况下的高性能表现。

所以，Node.js 是单线程的，这句话指的是 JavaScript 代码的执行是单线程的，而不是整个 Node.js 运行环境是单线程的。

## 与浏览器中的EventLoop比较

### 宏任务：

| 任务                  | 浏览器 | Node |
| --------------------- | ------ | ---- |
| I/O                   | ✅      | ✅    |
| setTimeout            | ✅      | ✅    |
| setInterval           | ✅      | ✅    |
| setImmediate          | ❌      | ✅    |
| requestAnimationFrame | ✅      | ❌    |

### 微任务：

| 任务                       | 浏览器 | Node |
| -------------------------- | ------ | ---- |
| process.nextTick           | ❌      | ✅    |
| MutationObserver           | ✅      | ❌    |
| Promise.then catch finally | ✅      | ✅    |

## process.nextTick()

在Node.js中，`process.nextTick()`方法允许你在当前事件循环的末尾插入一个任务，它会在当前操作完成后立即执行，但在任何I/O操作（包括定时器）之前执行。这与`setTimeout()、setImmediate()`以及事件触发器的行为有所不同。

| 特点                 | 描述                                                         |
| -------------------- | ------------------------------------------------------------ |
| 优先级高             | 在当前操作完成后立即执行，优先级高于其他异步操作，确保在I/O操作之前立即执行。 |
| 避免最大递归深度错误 | 回调函数会在当前调用栈清空之前执行，可用于避免最大递归深度错误，将递归函数分解为一系列调用。 |
| 性能开销低           | 性能开销较低，不涉及定时器管理或I/O周期，相对于`setTimeout()`和`setImmediate()`更为高效。 |

使用`process.nextTick()`能够确保任务在微任务中优先执行，因此在需要高优先级执行的情况下是非常有用的。

## `setImmediate()` 与 `setTimeout()`比较

`setImmediate()` 和 `setTimeout()` 类似，但根据调用时间的不同，其行为方式也不同。

- `setImmediate()` 旨在在当前轮询阶段完成后执行脚本。
- `setTimeout()` 安排脚本在最小阈值（以毫秒为单位）过去后运行。

## 小测试

```js
const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;
const server = http.createServer((req, res) => {
    testEventLoop()
});
server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

function testEventLoop() {
    console.log('=============')

    // Timer
    setTimeout(() => {
        console.log('Timer phase')
        process.nextTick(() => {
            console.log('Timer phase - nextTick')
        })
        Promise.resolve().then(() => {
            console.log('Timer phase - promise')
        })
    });

    // Check
    setImmediate(() => {
        console.log('Check phase')
        process.nextTick(() => {
            console.log('Check phase - nextTick')
        })
        Promise.resolve().then(() => {
            console.log('Check phase - promise')
        })
    })

    // Poll
    console.log('Poll phase');
    process.nextTick(() => {
        console.log('Poll phase - nextTick')
    })
    Promise.resolve().then(() => {
        console.log('Poll phase - promise')
    })
}
```

