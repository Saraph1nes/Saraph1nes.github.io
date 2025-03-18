# CSP

CSP（Content Security Policy）是一种 Web
应用程序安全策略，它用于限制网站加载的资源，它允许网站所有者定义可信任的内容来源，禁止非授权来源的脚本、图片、样式表等资源加载，从而有效地防止跨站脚本攻击（XSS）、点击劫持等攻击方式。

## 设置方式

### HTTP

```bash
HTTP/1.1 200 OK
Content-Security-Policy: default-src 'self'; script-src 'self' https://apis.google.com
Content-Type: text/html;charset=UTF-8
```

### HTML meta 标签

```html
<!-- 仅允许自己的站点和 example.com 加载 js 脚本-->
<meta
  http-equiv="Content-Security-Policy"
  content="script-src 'self' https://www.example.com"
/>
```

## 优点

- 减少恶意代码注入、执行。
- 保护用户免受 XSS 攻击，从而使他们的敏感信息受到保护
- 增加您应用程序的安全性

## 缺点

- 配置复杂：一般页面会有大量三方资源，如广告、插件等，需要经过很繁琐的配置才能使页面功能正常。
- 影响功能：如果 CSP 设置过于严格，尤其是使用 HTTP 下发时，很可能导致页面的某个功能不能用。

