---
title: 单页面应用vercel部署刷新404问题
date: 2024-01-08
tags:
  - 前端部署
  - Vercel
  - SPA
  - 路由配置
  - 静态托管
---

# 单页面应用vercel部署刷新404问题

<!-- DESC SEP -->

本文解析单页面应用(SPA)在Vercel部署时遇到的404问题及其解决方案。详细阐述SPA路由机制与传统多页面应用的区别，Vercel静态托管服务特性及路由重写规则原理。通过配置vercel.json实现路径重定向，确保任意路由请求均返回index.html，由前端框架接管路由解析，从根本上解决刷新页面404错误。

<!-- DESC SEP -->

## 问题

我使用vite打包应用后，部署在vercel，进入首页没问题，到其他路由页面后，刷新页面，显示404

## 解决

在项目根目录下增加文件`vercel.json`，并添加内容

```json
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```



## 原因

在传统的多页面应用中，每个页面都有对应的服务端路由，而在单页面应用 (Single Page Application, SPA) 中，通常只有一个 HTML 页面，前端框架负责处理路由和渲染内容。

这时，当用户刷新页面时，服务端可能无法识别路由，导致返回 404 错误。

在上面的配置中，配置指定了一个重写规则：

```json
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

- `source`: 指定匹配的路径模式，这里使用 `/:path*` 表示匹配任意路径。
- `destination`: 指定重写后的目标路径，这里是 `/index.html`。

在上方配置中，你将所有路径重写到 `/index.html`，这意味着无论用户访问什么路径，都会返回 `index.html` 页面，这样做可以确保在任何路由下刷新页面时都能正确加载应用程序。

这样配置后，当用户刷新页面时，Vercel 会根据这个规则将请求重写到 `index.html`，然后由前端框架负责处理路由。

