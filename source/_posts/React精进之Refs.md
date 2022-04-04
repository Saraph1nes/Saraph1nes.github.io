---
title: React精进之Refs
index_img: https://s2.loli.net/2022/04/04/C7QwKb1uVsrSkj4.jpg
date: 2021-08-22 23:26:20
tags: React
category: 前端
---

# React 精进之Refs

## 什么是Refs

官方文档这样写道:Refs 提供了一种方式，允许我们访问 DOM 节点或在 render 方法中创建的 React 元素。

在典型的 React 数据流中，[props](https://zh-hans.reactjs.org/docs/components-and-props.html) 是父组件与子组件交互的唯一方式。要修改一个子组件，你需要使用新的 props 来重新渲染它。但是，在某些情况下，你需要在典型数据流之外强制修改子组件。被修改的子组件可能是一个 React 组件的实例，也可能是一个 DOM 元素。对于这两种情况，React 都提供了解决办法。

在React 16.3版本引入了`React.createRef()` API,我们来试试看

## 创建 Refs

调用`React.createRef()`,并通过 `ref` 属性附加到 React 元素。在构造组件时，通常将 Refs 分配给实例属性，以便可以在整个组件中引用它们。

```jsx
import React, {Component} from 'react';

class RefsStudy extends Component {
  constructor(props) {
    super(props);
    this.myRefs = React.createRef();
  }

  render() {
    console.log(this.myRefs)  //current：null
    return (
      <div ref={this.myRef} />
    );
  }
}

export default RefsStudy;
```

## 访问 Refs

当 ref 被传递给 `render` 中的元素时，对该节点的引用可以在 ref 的 `current` 属性中被访问。

ref 的值根据节点的类型而有所不同：

- 当 `ref` 属性用于 HTML 元素时，构造函数中使用 `React.createRef()` 创建的 `ref` 接收底层 DOM 元素作为其 `current` 属性。
- 当 `ref` 属性用于自定义 class 组件时，`ref` 对象接收组件的挂载实例作为其 `current` 属性。
- **你不能在函数组件上使用 `ref` 属性**，因为他们没有实例。

接下来我们分别举例子

### 为 DOM 元素添加 ref

当ref属性用于HTML元素时，我们就用input来举例

```jsx
import React, {Component} from 'react';

class RefsStudy extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.clickMe = this.clickMe.bind(this)
  }

  clickMe() {
    this.textInput.current.value = '按钮被点击'
    console.log('按钮被点击')
  }

  componentDidMount() {
    console.log(this.textInput.current)
  }

  render() {
    return (
      <div>
        <input type='text' className='testRefClassName' id='testRefId' ref={this.textInput} />
        <button onClick={this.clickMe}>点我</button>
      </div>
    );
  }
}

export default RefsStudy;
```

点击后，我们可以看见控制台打印出了dom节点和其属性

![image-20210822103857866](https://i.loli.net/2021/08/22/qnpdWMQiEvmYc3Z.png)![image-20210822103908300](https://i.loli.net/2021/08/22/ySQhNqJHPXEBe2j.png)

React 会在`组件挂载时`给 `current` 属性传入 DOM 元素，并在组件卸载时传入 `null` 值。`ref` 会在 `componentDidMount` 或 `componentDidUpdate` 生命周期钩子触发前更新。

### 为 class 组件添加 Ref

```jsx
import React, {Component} from 'react';
import RefsStudy from "./index";

class RefsStudyWrapper extends Component { // 定义为class的父组件
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  componentDidMount() {
    console.log(this.textInput.current.textInput.current) // 可以拿到子组件里的dom
    this.textInput.current.clickMe() // 当然，也可以使用子组件定义的方法
  }

  render() {
    return (
      <div>
        <RefsStudy ref={this.textInput}/>
      </div>
    );
  }
}

export default RefsStudyWrapper;
```

```jsx
import React, {Component} from 'react';

class RefsStudy extends Component { //子组件
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.clickMe = this.clickMe.bind(this)
  }

  clickMe() {
    this.textInput.current.value = '按钮被点击'
    console.log('按钮被点击')
  }

  render() {
    return (
      <div>
        <input type='text' className='testRefClassName' id='testRefId' ref={this.textInput} />
        <button onClick={this.clickMe}>点我</button>
      </div>
    );
  }
}

export default RefsStudy;
```



![image-20210822104643893](https://i.loli.net/2021/08/22/npic2jN7Hy936sU.png)

请注意，这仅在 `RefsStudy` 声明为 class 时才有效
