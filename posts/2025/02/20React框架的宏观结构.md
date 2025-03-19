---
title: React框架的宏观结构
date: 2025-02-20
tags: 
  - React
  - 前端
---

# 营销活动前端安全方案探索

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文深入探讨了React框架的宏观结构，重点分析了任务调度循环和Fiber构造循环的关系。任务调度循环负责优先级管理和增量渲染，确保应用在高优先级任务（如用户交互）下保持响应性。Fiber构造循环则通过构建和更新Fiber树，反映组件层次结构，优化渲染过程。两者紧密结合，任务调度循环决定何时执行Fiber构造循环，确保在16ms帧时间内完成渲染，避免阻塞主线程。这一机制显著提升了React在复杂应用中的性能和流畅度。

<!-- DESC SEP -->

## 关键要点

- React框架的宏观结构围绕任务调度循环和工作循环展开，核心是通过Fiber架构管理渲染。
- 任务调度循环（工作循环）负责优先级调度，确保应用响应性。
- Fiber构造循环在工作循环中构建和更新Fiber树，反映组件层次结构。

## React框架的宏观结构

React是一个用于构建用户界面的JavaScript库，通过组件化方式高效渲染界面。其渲染过程依赖Fiber架构，允许暂停和恢复渲染任务以提升性能。

### 任务调度循环（工作循环）

任务调度循环是React的核心机制，确保渲染任务不会阻塞主线程，从而保持应用响应性：

- **合作式调度**：将渲染任务拆分为小单元，允许浏览器处理其他任务如用户交互。
- **优先级管理**：高优先级任务（如用户点击）优先处理，低优先级任务（如数据更新）延后。
- **增量渲染**：将渲染工作分布到多个帧中，避免单帧时间过长导致卡顿。

例如，React使用requestAnimationFrame处理高优先级更新，使用requestIdleCallback处理低优先级更新，确保关键交互优先。

### Fiber构造循环

Fiber构造循环是工作循环的一部分，负责构建和更新Fiber树：

- **Fiber树结构**：每个Fiber节点对应一个组件或元素，包含状态、属性及与其他节点的关系（子节点、兄弟节点、父节点）。
- **beginWork函数**：在渲染阶段处理每个Fiber节点，决定是否创建新节点或更新现有节点。
- **工作进展树**：在渲染过程中，React维护一个工作进展树（work-in-progress tree），完成后替换当前树。

这个过程确保React能高效管理复杂组件树，特别是在更新时只处理必要的部分。

### 两者关系

任务调度循环决定何时处理Fiber构造循环中的工作，而Fiber构造循环则构建或更新Fiber树，最终在提交阶段（commit phase）应用到实际DOM。

## 详细调研笔记

React框架的宏观结构以其任务调度循环和工作循环为核心，特别是在Fiber架构引入后，显著提升了渲染效率和应用响应性。以下是详细分析，包括所有相关细节和推理过程。

### React渲染过程概述

React通过虚拟DOM（Virtual DOM）高效更新实际DOM，减少直接操作DOM的性能开销。Fiber架构（自React 16起）重新设计了核心算法，允许暂停、恢复和优先级调度渲染任务。这一架构的核心目标是增量渲染和并发处理，确保大型应用在复杂更新时保持流畅。

从功能调用结果中，我们搜索了多个资源，包括React Fiber的官方文档、博客文章和技术分析，确认了Fiber架构的实现细节。例如，[React Fiber Architecture - An Overview](https://tusharf5.com/posts/react-fiber-overview/) 提到Fiber使用新的数据结构替代递归栈，采用while循环提升性能。

### 任务调度循环（工作循环）的详细分析

任务调度循环通常被称为工作循环，是React管理渲染任务的关键机制。从搜索结果中，[How React Scheduler works internally?](https://jser.dev/react/2022/03/16/how-react-scheduler-works/) 指出，工作循环通过优先级调度任务，确保高优先级更新（如用户交互）不被低优先级任务（如网络数据渲染）阻塞。

- **合作式调度**：工作循环将渲染任务拆分为小单元，使用requestIdleCallback和requestAnimationFrame调度。Velotio的博客[An Introduction to React Fiber - The Algorithm Behind React](https://www.velotio.com/engineering-blog/react-fiber-algorithm) 详细说明，requestAnimationFrame用于高优先级更新，requestIdleCallback用于低优先级更新。
- **优先级管理**：不同任务有不同优先级，例如动画和用户输入优先于数据渲染。LogRocket的文章[A deep dive into React Fiber](https://blog.logrocket.com/deep-dive-react-fiber/) 提到，React通过内部定时器监控每个工作单元，确保16ms帧时间预算内完成。
- **增量渲染**：工作循环允许暂停和恢复，特别是在并发模式下，高优先级任务可中断低优先级任务。Tushar F.的文章[React Fiber Architecture - An Overview](https://tusharf5.com/posts/react-fiber-overview/) 举例，复杂应用中，React可分帧处理，避免帧丢失。

从GitHub上的讨论[Implementation notes on react's scheduling model](https://gist.github.com/Jessidhia/49d0915b7e722dc5b49ab9779b5906e8) 中，我们看到，React保护同步更新免于无限递归（当前限制为50次），但异步更新需依赖调度器管理。

### Fiber构造循环的详细分析

Fiber构造循环是工作循环中的子过程，负责构建和更新Fiber树。Fiber树是React内部表示组件层次结构的数据结构，每个节点（Fiber）对应一个组件或元素。从Medium文章[Exploring React Fiber tree](https://medium.com/@bendtherules/exploring-react-fiber-tree-20cbf62fe808) 中，我们了解到，Fiber树采用左子右兄弟二叉树结构，每个节点包含子节点（child）、兄弟节点（sibling）、父节点（return）及对应的DOM节点（stateNode）。

- **Fiber树结构**：每个Fiber节点存储状态（memoizedState）、属性（memoizedProps）等信息，连接形成树状结构。DEV Community的帖子[Understanding React's Fiber Tree](https://dev.to/gervaisamoah/understanding-reacts-fiber-tree-a-deep-dive-into-reacts-architecture-and-rendering-process-2loo) 提到，Fiber节点是工作单元的基本单位，反映组件树。
- **beginWork函数**：从搜索结果[How beginWork works](https://incepter.github.io/how-react-works/docs/react-dom/how.begin_work.works/) 中，beginWork是渲染阶段的关键函数，处理每个Fiber节点，决定是否创建新节点或更新现有节点。它返回下一个工作单元，涉及current树（当前可见）和workInProgress树（工作进展）。
- **工作进展树**：React在渲染过程中维护workInProgress树，完成后在提交阶段替换current树。LogRocket的文章[A deep dive into React Fiber](https://blog.logrocket.com/deep-dive-react-fiber/) 提到，React监控时间限制，暂停当前工作，下一帧继续构建树。

从中文资源[React技术揭秘](https://react.iamkasong.com/process/beginWork.html) 中，我们看到beginWork约500行代码，处理当前Fiber节点，创建子Fiber节点，涉及mount和update两种情况，体现了Fiber构造的动态性。

### 两者关系的深入探讨

任务调度循环和工作循环是宏观管理层，决定何时处理Fiber构造循环中的工作。Fiber构造循环在beginWork函数中执行，构建或更新Fiber树。例如，Velotio的博客[An Introduction to React Fiber - The Algorithm Behind React](https://www.velotio.com/engineering-blog/react-fiber-algorithm) 提到，workLoop调用performUnitOfWork，内部调用beginWork，完成Fiber树的遍历和处理。

从时间管理的角度，任务调度循环确保Fiber构造循环在16ms帧时间内完成，避免阻塞主线程。LogRocket的文章[A deep dive into React Fiber](https://blog.logrocket.com/deep-dive-react-fiber/) 提到，React监控时间，暂停工作，下一帧继续，体现了两者紧密结合。

### 推理过程与挑战

初始搜索“React framework macro structure task scheduling loop fiber construction loop”未直接找到明确定义，需结合多个资源推导。尝试浏览GitHub仓库[react-fiberArchitecture](https://github.com/acdlite/react-fiber-architecture) 失败（返回404），可能是访问问题，改为搜索相关术语如“React Fiber task scheduling loop”和“React fiber tree construction process”，逐步明确概念。

从多次搜索和浏览中，我们确认任务调度循环即工作循环，Fiber构造循环在beginWork中实现，关系为前者管理后者执行时机。所有细节均来自功能调用结果，确保信息完整。

### 表格总结

以下表格总结关键概念：

| 概念                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| 任务调度循环（工作循环） | 管理渲染任务的优先级和调度，确保应用响应性，使用requestIdleCallback和requestAnimationFrame。 |
| Fiber构造循环            | 在工作循环中通过beginWork函数构建和更新Fiber树，反映组件层次结构。 |
| Fiber树结构              | 左子右兄弟二叉树，每个节点含子节点、兄弟节点、父节点及DOM映射。 |
| 优先级管理               | 高优先级任务（如用户交互）优先，低优先级任务（如数据更新）延后。 |

### 关键发现

一个有趣的细节是，React通过内部定时器监控每个工作单元，确保16ms帧时间预算内完成，这一机制在大型应用中特别重要，避免帧丢失。

------

## 关键引文

- [React Fiber Architecture - An Overview](https://tusharf5.com/posts/react-fiber-overview/)
- [How React Scheduler works internally?](https://jser.dev/react/2022/03/16/how-react-scheduler-works/)
- [An Introduction to React Fiber - The Algorithm Behind React](https://www.velotio.com/engineering-blog/react-fiber-algorithm)
- [A deep dive into React Fiber](https://blog.logrocket.com/deep-dive-react-fiber/)
- [Exploring React Fiber tree](https://medium.com/@bendtherules/exploring-react-fiber-tree-20cbf62fe808)
- [How beginWork works](https://incepter.github.io/how-react-works/docs/react-dom/how.begin_work.works/)
- [React技术揭秘](https://react.iamkasong.com/process/beginWork.html)
- [Implementation notes on react's scheduling model](https://gist.github.com/Jessidhia/49d0915b7e722dc5b49ab9779b5906e8)

