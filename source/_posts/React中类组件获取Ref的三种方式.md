---
title: React中类组件获取Ref的三种方式
index_img: https://s2.loli.net/2022/04/04/C7QwKb1uVsrSkj4.jpg
date: 2022-03-20 12:16:22 
tags: React 
category: 前端
---

React中类组件获取Ref的三种方式

### ① Ref属性是一个字符串

```js
/* 类组件 */
class Children extends Component {
  render = () => <div>hello,world</div>
}

/* TODO:  Ref属性是一个字符串 */
export default class Index extends React.Component {
  componentDidMount() {
    console.log(this.refs)
  }

  render = () => <div>
    <div ref="currentDom">字符串模式获取元素或组件</div>
    <Children ref="currentComInstance"/>
  </div>
}
```
[![qZANwR.png](https://s1.ax1x.com/2022/03/20/qZANwR.png)](https://imgtu.com/i/qZANwR)
如上面代码片段，用一个字符串 ref 标记一个 DOM 元素，一个类组件(函数组件没有实例，不能被 Ref 标记)。 React 在底层逻辑，会判断类型，如果是 DOM 元素，会把真实 DOM 绑定在组件 this.refs (组件实例下的
refs )属性上，如果是类组件，会把子组件的实例绑定在 this.refs 上。

### ② Ref 属性是一个函数。

```js
class Children extends React.Component {
  render = () => <div>hello,world</div>
}

/* TODO: Ref属性是一个函数 */
export default class Index extends React.Component {
  currentDom = null
  currentComponentInstance = null

  componentDidMount() {
    console.log(this.currentDom)
    console.log(this.currentComponentInstance)
  }

  render = () => <div>
    <div ref={(node) => this.currentDom = node}>Ref模式获取元素或组件</div>
    <Children ref={(node) => this.currentComponentInstance = node}/>
  </div>
}
```
[![qZAdFx.png](https://s1.ax1x.com/2022/03/20/qZAdFx.png)](https://imgtu.com/i/qZAdFx)
如上代码片段，当用一个函数来标记 Ref 的时候，将作为 callback 形式，等到真实 DOM 创建阶段，执行 callback ，获取的 DOM 元素或组件实例，将以回调函数第一个参数形式传入，所以可以像上述代码片段中，用组件实例下的属性 currentDom和 currentComponentInstance 来接收真实 DOM 和组件实例。

### ③ Ref属性是一个ref对象
第三种方式就是上述通过 ref 对象方式获取
```js
class Children extends React.Component{  
    render=()=><div>hello,world</div>
}
export default class Index extends React.Component{
    currentDom = React.createRef(null)
    currentComponentInstance = React.createRef(null)
    componentDidMount(){
        console.log(this.currentDom)
        console.log(this.currentComponentInstance)
    }
    render=()=> <div>
         <div ref={ this.currentDom }  >Ref对象模式获取元素或组件</div>
        <Children ref={ this.currentComponentInstance }  />
   </div>
}
```
[![qZAUT1.png](https://s1.ax1x.com/2022/03/20/qZAUT1.png)](https://imgtu.com/i/qZAUT1)
