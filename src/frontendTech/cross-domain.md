# 跨域

## 同源策略

协议+域名+端口 完全相同，则为同源

限制：

- Cookie、LocalStorage、IndexedDB 等存储性内容
    - 网页中的脚本只能访问与其来源相同的域的存储内容，无法直接访问其他域的Cookie、LocalStorage或IndexedDB。
- DOM 节点
    - 脚本只能访问与其来源相同的域创建的DOM节点，无法直接访问其他域的DOM节点。
- AJAX 请求发送后，结果被浏览器拦截了
    - 使用XMLHttpRequest或Fetch API发送的AJAX请求，由于受到同源策略的限制，无法直接向不同源的服务器发起请求。

但是有三个标签是允许跨域加载资源：

- `<img src=XXX>`
- `<link href=XXX>`
- `<script src=XXX>`

## jsonp

利用 `<script>` 标签没有跨域限制的漏洞，网页可以得到从其他来源动态产生的 JSON 数据。JSONP 请求一定需要服务器做支持才可以。

```js
function jsonp({ url, params, callback }) {
    return new Promise((resolve, reject) => {
        let script = document.createElement('script');
        window[callback] = function (data) {
            resolve(data);
            document.body.removeChild(script);
        };
        params = { ...params, callback }; // wd=b&callback=show
        let arrs = [];
        for (let key in params) {
            arrs.push(`${key}=${params[key]}`);
        }
        script.src = `${url}?${arrs.join('&')}`;
        document.body.appendChild(script);
    });
}

jsonp({
    url: 'http://localhost:3000/say',
    params: { wd: 'Iloveyou' },
    callback: 'show'
}).then(data => {
    console.log(data);
});
```

## CORS

CORS 是一个 W3C 标准,全称是"跨域资源共享"（Cross-origin resource sharing）。

CORS是通过在服务器端设置特定HTTP头部来允许跨域资源访问的机制，解决了浏览器的同源策略限制。

### 简单请求

简单请求是指满足一定条件的跨域请求，具备以下特点：

1. 使用简单的 HTTP 方法，如 GET、HEAD、POST。
2. 请求头部信息不超出一定范围，限定在
   Accept、Accept-Language、Content-Language、Content-Type（仅限三个值：application/x-www-form-urlencoded、multipart/form-data、text/plain）等字段。

如果请求满足上述条件，浏览器会直接发起跨域请求，并在请求头部中携带 Origin 字段，表示请求的来源。服务器需要正确设置
`Access-Control-Allow-Origin` 等头部，以允许跨域请求。这种情况下，不会触发浏览器的预检请求，简化了跨域请求的处理流程。

### 复杂请求

复杂请求是不符合简单请求条件的跨域请求。对于复杂请求，浏览器会先发起预检请求

### 预检请求（OPTIONS）

预检请求是一种 OPTIONS 请求，用于在正式的跨域请求之前检测服务器是否允许实际的请求。

这是出于安全考虑，以确保跨域请求得到服务器的明确许可。

预检请求包含了请求方法、请求头等信息，服务器通过响应头中的配置来决定是否允许实际请求。

**预检请求（Preflight）会检查以下内容：**

1. **HTTP 方法：**
    - 预检请求会检查实际请求所使用的 HTTP 方法，通过 `Access-Control-Request-Method` 头部告知服务器。
2. **自定义头部信息：**
    - 如果实际请求携带了自定义的头部信息，预检请求会通过 `Access-Control-Request-Headers` 头部告知服务器。
3. **Origin：**
    - 预检请求本身包含了 Origin 头部，用于指示请求的来源。

**优化预检请求**

为了优化性能，可以缓存预检请求，服务器端通过设置 `Access-Control-Max-Age` 字段告知浏览器在一定时间内无需再发送预检请求。

### HTTP 请求首部字段

1. **Origin：**
    - 预检请求或实际请求的源站，仅包含服务器名称，不包含路径信息。
2. **Access-Control-Request-Method：**
    - 用于预检请求，告诉服务器实际请求会使用的 HTTP 方法。
3. **Access-Control-Request-Headers：**
    - 用于预检请求，告诉服务器实际请求会携带的首部字段。

### HTTP 响应首部字段

1. **Access-Control-Allow-Origin：**
    - 表示允许请求的域，可以是具体的域名或使用通配符 "*" 表示允许所有域。
2. **Access-Control-Expose-Headers：**
    - 服务器将允许浏览器访问的响应头放入白名单，使这些头可以通过 `getResponseHeader()` 方法访问。
3. **Access-Control-Allow-Credentials：**
    - 表示允许携带 Cookie，是一个布尔值。
4. **Access-Control-Allow-Methods：**
    - 表示允许的请求方法，可以是单个方法或多个方法的逗号分隔列表。
5. **Access-Control-Allow-Headers：**
    - 表示允许携带的请求头，可以是单个头或多个头的逗号分隔列表。

> **注意：** 在跨源访问时，XMLHttpRequest 对象的 `getResponseHeader()` 方法只能获取到一些基本的响应头，而要访问其他头，则需要服务器设置相应的响应头。
>
> 这些首部字段通常无需手动设置，当使用 XMLHttpRequest 对象发起跨源请求时，它们会被自动设置。

## XDM

跨文档消息通信（Cross-document Messaging ），简称XDM，是一种在不同文档或浏览器窗口之间进行跨域通信的技术。

在Web中，由于同源策略的限制，不同源（不同域、协议或端口）的页面通常无法直接进行 JavaScript 交互，但通过跨文档消息通信，可以在这些页面之间传递信息。

主要的 API 用于实现跨文档消息通信是 `window.postMessage`。

这个 API 允许一个文档（页面）通过一个目标文档的引用来向其发送消息，而不受同源策略的限制。

### 基本用法

#### 发送消息

```javascript
// 发送消息
otherWindow.postMessage(message, targetOrigin);
```

- `otherWindow`: 目标窗口的引用，可以是 `window` 对象或一个 `iframe` 的 `contentWindow`。
- `message`: 要发送的消息，可以是字符串、数字、对象等。
- `targetOrigin`: 限定接收消息的文档的源（origin），用于增加安全性。可以是具体的源（例如 `https://example.com`），也可以是通配符
  `*`，表示允许来自任意源的消息。

#### 接收消息

```javascript
// 接收消息
window.addEventListener('message', handleMessageEvent);

function handleMessageEvent(event) {
  // event.data 包含接收到的消息
  // event.origin 包含消息发送方的 origin
  // 可以通过 event.source 获取发送消息的窗口引用
  // 在这里处理接收到的消息
}
```

通过这种方式，页面可以在不同源之间安全地传递消息。但需要注意，由于 `postMessage`
允许跨域通信，应谨慎处理接收到的消息，以防止安全风险。验证消息的来源和内容是确保安全的关键。

## 参考

- [MDN CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)

