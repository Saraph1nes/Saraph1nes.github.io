---
title: React精进之Refs转发
index_img: https://s2.loli.net/2022/04/04/C7QwKb1uVsrSkj4.jpg
date: 2021-08-26 21:19:23
tags: React
category: 前端
---

# React精进之Refs转发(Forwarding Refs)



Refs转发是一种通过组件自动将 ref 传递给其子组件的技术。对于应用程序中的大多数组件，这通常不是必需的。但是，它对某些类型的组件很有用，尤其是在可重用的组件库中。



## 转发 refs 到 DOM 组件

定义一个渲染原生按钮 DOM 元素的 Fancy Button 组件：

```jsx
function FancyButton(props) {
  return (
    <button className="FancyButton">
      {props.children}
    </button>
  );
}
```

React 组件隐藏了它们的实现细节，包括它们的渲染输出。其他使用 Fancy Button 的组件通常不需要获取内部按钮 DOM 元素的引用。这很好，因为它可以防止组件过度依赖彼此的 DOM 结构。

尽管此类封装对于 `FeedStory `或 `Comment `等应用程序级组件（或者说业务组件）是可取的，但对于高度可重用的“叶子”组件（也可以说是常用的基础组件，如 `FancyButton `或 `MyTextInput`）来说可能不方便。这些组件倾向于以与常规 DOM 按钮和输入类似的方式在整个应用程序中使用，并且为了管理焦点、选择或动画而访问它们的 DOM 节点可能是不可避免的。

**Ref 转发是一个可选特性，其允许某些组件接收 `ref`，并将其向下传递（换句话说，“转发”它）给子组件。**

在下面的示例中，`FancyButton` 使用 `React.forwardRef` 来获取传递给它的 `ref`，然后转发到它渲染的 DOM `button`：

```jsx
import React from "react";

const FancyButton = React.forwardRef((props, ref) => {
  return (
    <button
      ref={ref}
      className="FancyButton"
      onClick={props.myClick}
    >
      {props.children}
    </button>
  )
});

const FancyButtonWrapper = () => {

  // 您现在可以直接获取 DOM 按钮的引用
  const ref = React.createRef();

  return (
    <FancyButton ref={ref} myClick={()=>{
      console.log(ref.current) //<button class="FancyButton">按钮</button>
    }}>按钮</FancyButton>
  );
}

export default FancyButtonWrapper;
```

- 这样，使用 `FancyButton` 的组件可以获取底层 DOM 节点 `button` 的 ref ，并在必要时访问，就像其直接使用 DOM `button` 一样。

  以下是对上述示例发生情况的逐步解释：

    1. 我们通过调用 `React.createRef` 创建了一个 [React ref](https://zh-hans.reactjs.org/docs/refs-and-the-dom.html) 并将其赋值给 `ref` 变量。
    2. 我们通过指定 `ref` 为 JSX 属性，将其向下传递给 `<FancyButton ref={ref}>`。
    3. React 传递 `ref` 给 `forwardRef` 内函数 `(props, ref) => ...`，作为其第二个参数。
    4. 我们向下转发该 `ref` 参数到 `<button ref={ref}>`，将其指定为 JSX 属性。
    5. 当 ref 挂载完成，`ref.current` 将指向 `<button>` DOM 节点。

> 注意
>
> 第二个参数 `ref` 只在使用 `React.forwardRef` 定义组件时存在。常规函数和 class 组件不接收 `ref` 参数，且 props 中也不存在 `ref`。Ref 转发不仅限于 DOM 组件，你也可以转发 refs 到 class 组件实例中。

---

## 组件库维护者的注意事项

**当你开始在组件库中使用 `forwardRef` 时，你应当将其视为一个破坏性更改，并发布库的一个新的主版本。** 这是因为你的库可能会有明显不同的行为（例如 refs 被分配给了谁，以及导出了什么类型），并且这样可能会导致依赖旧行为的应用和其他库崩溃。

出于同样的原因，当 `React.forwardRef` 存在时有条件地使用它也是不推荐的：它改变了你的库的行为，并在升级 React 自身时破坏用户的应用。

---

