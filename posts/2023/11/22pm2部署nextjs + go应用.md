---
title: pm2部署nextjs + go应用
date: 2023-11-22
tags:
  - Node.js
  - PM2
  - 进程管理
  - Next.js
  - Go
---

# pm2部署nextjs + go应用

<!-- DESC SEP -->

本文详细介绍了使用PM2进程管理工具部署Next.js与Go应用的完整流程。首先解析PM2核心功能包括进程守护、负载均衡和日志管理，随后分步骤阐述Go应用在Linux环境下交叉编译、依赖安装与PM2托管运行方案，最后讲解Next.js项目构建优化技巧及PM2集群模式配置要点，为全栈应用部署提供标准化操作指南。

<!-- DESC SEP -->

## pm2 介绍

> https://pm2.io/

PM2（Process Manager 2）是一个用于管理和监控Node.js应用程序的进程管理工具。

它可以确保应用程序在生产环境中稳定运行，具有强大的功能，包括进程守护、负载均衡、日志管理等。

虽然 PM2 最初是为 Node.js 设计的，但由于其功能强大和易用性，它也被广泛用于其他后端语言的应用程序管理。



## 为什么需要pm2

PM2 是一个带有负载均衡功能的 Node 应用的进程管理器

当你要把你的独立代码利用全部的服务器上的所有 CPU，并保证进程永远都活着，0 秒的重载， PM2 是完美的



## Go应用部署

部署的前提是你已经配置好了go环境。

在go环境配置完成后，就可以部署了，我直接把后端项目clone到服务器中，这样方便我同步最新代码，坏处是在服务器编译会占用服务器的CPU、内存等资源，造成服务的不稳定。

把应用clone下来后，进入项目（main.go文件的目录下），使用`go get`命令，安装依赖，这步可能有点慢，等待一会

如果觉得慢，也可以换源

在linux环境中，我们需要打包成二进制文件，以在linux平台运行

```bash
set GOARCH=amd64 
# GOARCH指的是目标处理器的架构，支持一下处理器架构 `arm  arm64  386  amd64  ppc64  ppc64le  mips64  mips64le  s390x`

set GOOS=linux 
# GOOS指的是目标操作系统，支持以下操作系统 `darwin  freebsd  linux  windows  android  dragonfly  netbsd  openbsd  plan9  solaris`
```

设置好后，我们对main.go文件执行go build 命令了，就可以得到我们想要的目标文件了，你也可以使用`-o`指定产物名称

```bash
go build -o <你的名称> main.go
```

执行后就会在当前目录下生成对应名称的文件，这是linux平台可执行的二进制文件

如果你已经装好了pm2，使用`pm2 start <你的名称>`，应用就运行了

你也可以采用`pm2 ls`命令查看运行情况

`sablog-api`是我的应用名称

![image-20231122210143282](http://assest.sablogs.cn/imgs/typora/image-20231122210143282.png)



## Nextjs应用部署

nextjs应用我也采用的是直接拉取仓库，在服务器build，后期应该会使用容器化部署，或者使用自动化部署

`git clone`拉取代码后，我们先`npm i`去安装项目需要的依赖

依赖安装完成后，我们运行`npm run build`命令

我的博客是一个服务端组件与客户端组件共存的项目，如果你的服务端组件/页面中有异步请求，那么在构建的时候，是会请求接口的，所以先部署后端，再来构建前端应用

成功打包后，开始部署

默认的启动命令是

```bash
npm run start
```

我们采用pm2托管，启动的命令为

```bash
pm2 start npm --name sa-blogs-site -- run start

pm2 start npm --name 【项目的别名】 -- run 【package.json中的脚本命令>】
```

