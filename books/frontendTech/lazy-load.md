# 懒加载

**延迟加载**
（懒加载）是一种将资源标识为非阻塞（非关键）资源并仅在需要时加载它们的策略。这是一种缩短[关键渲染路径](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Critical_rendering_path)
长度的方法，可以缩短页面加载时间。

延迟加载可以在应用程序的不同时刻发生，但通常会在某些用户交互（例如滚动和导航）上发生。

## 代码拆分

JavaScript、CSS 和 HTML 可以被分割成较小的代码块。这样就可以在前期发送所需的最小代码，改善页面加载时间。其余的可以按需加载。

- 入口点分离：通过应用的入口点分离代码
- 动态分离：通过[动态 import()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import)
  语句分离代码

## JavaScript

任何类型为 type="module" 的脚本标签都被视为一个 JavaScript 模块，并且默认情况下会被延迟。

## CSS

默认情况下，CSS 被视为[渲染阻塞](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Critical_rendering_path)
资源，因此，在 [CSSOM](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Object_Model) 构造完成之前，浏览器不会渲染任何已处理的内容。

CSS 必须尽量小，才能尽快送达，建议使用媒体类型和查询实现非阻塞渲染。

你可以在`media`属性中提供媒体类型或查询; 然后，只有在媒体条件为 true 时，才会加载此资源。

```html
<!-- 加载和解析 styles.css 会阻塞渲染 -->
<link rel="stylesheet" href="styles.css"/>

<!-- 加载和解析 print.css 不会阻塞渲染 -->
<link rel="stylesheet" href="print.css" media="print"/>

<!-- 在大屏幕上，加载和解析 mobile.css 不会阻塞渲染 -->
<link
        rel="stylesheet"
        href="mobile.css"
        media="screen and (max-width: 480px)"
/>
```

可以执行一些 [CSS 优化](https://developer.mozilla.org/zh-CN/docs/Learn/Performance/CSS) 来实现这一目标。

## 字体

默认情况下，字体请求会延迟到构造渲染树之前，这可能会导致文本渲染延迟。

可以使用
`<link rel="preload">`、[CSS font-display 属性](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face/font-display)
和[字体加载 API](https://developer.mozilla.org/zh-CN/docs/Web/API/CSS_Font_Loading_API) 来覆盖默认行为并预加载网络字体资源。

参见 [Link 元素](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/link)。

## 图片和 iframe

很多时候，网页包含许多图片，这些图片会影响数据的使用和网页的加载速度。这些图片大部分都在屏幕之外（非关键），需要用户互动，如滚动，才能看到它们。

### Loading 属性

`<img>` 元素上的 loading 属性（或 `<iframe>` 上的 loading 属性）可用于指示浏览器推迟加载屏幕外的图像/iframe，直到用户滚动到其附近。

```html
<img src="image.jpg" alt="..." loading="lazy"/>
<iframe src="video-player.html" title="..." loading="lazy"></iframe>
```

当早期加载的内容全部加载完毕时，`load`
事件就会触发；这时，完全有可能（甚至有可能）在[可视视口 (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Visual_Viewport)
范围内有一些延迟加载的图片还没有加载。

这时可以通过检查其布尔属性 [
`complete` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/complete) 的值来确定某个图片是否已经完成加载。

**兼容性：**

- `img`标签

![image-20240308132158240](http://assest.sablogs.cn/img/typora/image-20240308132158240.png)

- `iframe`标签

![image-20240308132255961](http://assest.sablogs.cn/img/typora/image-20240308132255961.png)

### Polyfill

对旧的和目前不兼容的浏览器，我们需要这个`polyfill`
，以提供的支持：[loading-attribute-polyfill](https://github.com/mfranzke/loading-attribute-polyfill)。

### Intersection Observer API

[Intersection Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver)
允许用户得知被观察的元素何时进入或退出浏览器的视口。

以下是一个实现懒加载的例子，他的兼容性要好得多

**兼容性：**

![image-20240308133418585](http://assest.sablogs.cn/img/typora/image-20240308133418585.png)

**DEMO：**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Document</title>
</head>
<body>
<div id="root" style="height: 200vh">
    <img
            id="img1"
            width="1000"
            height="1000"
            src="https://picsum.photos/2000?random=1"
            alt=""
    />
    <img
            id="img2"
            width="1000"
            height="1000"
            src="https://picsum.photos/2000?random=2"
            alt=""
    />
    <img id="img3" width="1000" height="1000" src="" alt=""/>
</div>
</body>
<script>
    const intersectionObserver = new IntersectionObserver((entries) => {
        // 如果 intersectionRatio 为 0，则目标在视野外，
        // 我们不需要做任何事情。
        if (entries[0].intersectionRatio <= 0) return;

        // 目标出现在视野中, 加载图片

        const target = entries[0].target;
        target.src = `https://picsum.photos/2000?random=3`;

        console.log("加载图片");
    });
    // 开始监听
    intersectionObserver.observe(document.querySelector("#img3"));
</script>
</html>

```

### 事件处理器

当需要更好的兼容性时，还有以下几种选择：

- [polyfill intersection observer](https://github.com/w3c/IntersectionObserver)
- 回退到滚动、调整大小或方向变化事件处理器，以确定特定元素是否在视口中

