---
title: Ngrok内网穿透
date: 2021-07-03
tags:
  - 网络工具
  - Ngrok
  - 内网穿透
  - 开发测试
  - 服务器配置
---

# Ngrok内网穿透

<!-- DESC SEP -->
Ngrok内网穿透技术通过建立安全通道实现本地服务外网访问，包含客户端(ngrok)和服务端(ngrokd)架构。原理是通过专用隧道(tunnel)将内网服务映射到公网服务器，生成临时访问地址。免费版配置流程包含注册ngrok.cc平台、开通免费隧道、下载客户端配置ID等步骤，最终实现外网临时访问本地开发环境。
<!-- DESC SEP -->

# Ngrok内网穿透

大家在写项目的时候都会遇到测试的问题。当你需要把你写好的网站给别人展示，你是把源码发给人家？还是叫人家来你本地主机上看？

现在Ngrok的内网穿透技术可以实现生成一个临时的地址，让外网的小伙伴们可以临时的看到你本地服务器运行的项目。**实现自己电脑上的项目可以让别人访问。**

现在让我们一起来学习吧~

## 一、什么是内网穿透

内网穿透，又叫NAT穿透，是计算机用语，翻译过来就是 你的电脑可以直接被你朋友访问。 通常我们的电脑是无法自己被访问的。因为我们的电脑缺少自己的独立的ip地址。现在ip稀缺，电信运营商已经不会随便分配固定ip给个人。这就需要ngrok来实现了。

怕有些人对一些基础的知识还不了解，这里给科普下。

1、 公网IP地址：在公网上每个服务器有一个公网IP地址，外网可以直接连接的
2、 域名：公网IP地址为一串数字，为了方便记忆，注册域名来指向IP地址。
3 、端口：服务器对外提供服务必须要有一个端口的
在实际中你访问一个服务器的服务，也就是连接到这个服务器IP的指定端口。如果还不清楚的可以百度学习下。

**举个例子**，比如你在内网下192.168.0.100这台电脑上开了一个网站服务，那么端口默认是80，在内网下你直接通过浏览器输入http://192.168.0.100 直接打开网站，这个内网链接地址在外是打不开的。
通过内网穿透后平台分配一个公网地址,比如 http://www.yxlyz.net用户在外时就可以通过这个公网地址打开网站。

## 二、原理

ngrok 会先建立一个通道，将主机A的http请求传递给主机B，从而实现内网穿透。

![1](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/1.jpg)



ngrok分为client端(ngrok)和服务端(ngrokd)，实际使用中的部署如下：

![2](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/2.jpg)

内网服务程序可以与ngrok client部署在同一主机，也可以部署在内网可达的其他主机上。ngrok和ngrokd会为建立与public client间的专用通道（tunnel）。

就是把你本地项目临时映射到一个公网的服务器上，再给你一个网址。客户就能通过网址访问你的项目了。

## 三、实践

由于花生壳要钱，所以我们使用ngorkCC， 链接http://www.ngrok.cc/

![image-20200614225143330](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614225143330.png)

先注册，然后登录进去。

![image-20200614225310540](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614225310540.png)

![image-20200614225405315](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614225405315.png)

依次选择，隧道管理，开通隧道，拉到最下面有个0元的，再点击立即购买。

![image-20200614230805332](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614230805332.png)

确定添加  --->   确定开通，会跳转到如下界面下载客户端，选择自己对应的版本下载

![image-20200614231051229](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614231051229.png)

![image-20200614231232686](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614231232686.png)

下载后在如下文件夹下启动

![image-20200614231351232](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614231351232.png)

![image-20200614231411222](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614231411222.png)

将此处的隧道ID复制到终端运行

![image-20200614231446906](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614231446906.png)

完成启动，看见状态这里改变了

![image-20200614231535705](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614231535705.png)

链接成功。

![image-20200614231611877](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614231611877.png)

此处可以看到外网可以访问到的地址。

![image-20200614234552720](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614234552720.png)

![image-20200614234601973](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/Ngrok%E5%86%85%E7%BD%91%E7%A9%BF%E9%80%8F/image-20200614234601973.png)

此时完成了内网穿透，你就可以和你的小伙伴们分享你写好的项目啦~！
