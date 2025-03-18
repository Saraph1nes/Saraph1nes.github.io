# 防抖与节流

## 手写防抖节流

### 一. 为什么要用到防抖节流

- 当函数绑定一些持续触发的事件如：resize、scroll、mousemove ，键盘输入，多次快速click等等，
- 如果每次触发都要执行一次函数，会带来性能下降，资源请求太频繁等问题

### 二. 防抖（Debounce）

> 触发事件后在 n 秒内函数只能执行一次，如果在 n 秒内又触发了事件，则会重新计算函数执行时间

#### 1. 后执行

> 触发后,等待n秒,再次触发重新计算等待时间,时间到,调用函数
>
> 后执行较为简单,直接上代码

```js
function _debounce(func, wait) {
    let timer;
    return () => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
            func.call(this, ...arguments)
        }, wait)
    }
}
```

#### 2. 先执行

> 触发后,立即调用函数,如在n秒内再次触发,则不会调用函数,n秒后触发才立即调用
>
> 当定时器id不存在时,executeNow为true,则立即执行,wait时间后,timer置空,又回到初态
>
> 当id存在时,也就是在wait时间段内再次调用函数,executeNow为false,则限制了触发

```js
function _debounce(func, wait) {
    let timer;
    return () => {
        //timer是定时器的id,虽然把定时器clear,id还是存在的
        if (timer) clearTimeout(timer)
        const executeNow = !timer;
        timer = setTimeout(() => {
            timer = null;
        }, wait)
        if (executeNow) func.call(this, ...arguments)
    }
}
```

### 三. 节流（Throttle）

> 连续触发事件时,在一段时间内只执行一次回调函数,如wait为1000时,5秒内无论触发多少次,只执行5次回调
>
> 节流比较好理解,上代码

```js
function _throttle(func, wait) {
    let timer;
    return () => {
        if (!timer) {
            timer = setTimeout(() => {
                timer = null;
                func.call(this, ...arguments)
            }, wait)
        }
    }
}
```

### 四. 总结

以上就是防抖和节流的内容，防抖和节流是性能优化的一种手段，在开发中可以使用lodash等js库来实现。

