---
title: Linux安装Go环境
date: 2023-11-20
tags:
  - Go
  - Linux
  - 环境配置
  - 系统管理
  - 软件安装
---

# Linux安装Go环境

<!-- DESC SEP -->
本文详细介绍在Linux系统中安装Go语言的两种方式：通过yum包管理器快速安装适合简单场景，以及手动安装方式便于版本控制和环境管理。重点讲解手动安装时的环境变量配置要点，包括GOROOT、GOPATH等核心参数设置，确保开发环境正确初始化。
<!-- DESC SEP -->

有两种安装方式

## yum安装

```bash
yum -y install golang
```

使用如上命令，然后就可以使用Go语言了，但这种方式有个缺点，是yum自己处理的依赖，不方便管理

我推荐使用第二种方法



## 手动安装

> GO官网：https://golang.google.cn/dl/

我们选择这个linux环境的压缩包，去下载

![image-20231120203626500](http://assest.sablogs.cn/imgs/typora/image-20231120203626500.png)

下载后，上传到服务器，解压

也可以直接使用wget下载，右键上方链接，选择复制链接，进入`/usr/local`目录中，使用如下命令，下载并解压

```
wget https://golang.google.cn/dl/go1.21.4.linux-amd64.tar.gz
tar -xvf go1.21.4.linux-amd64.tar.gz
```

![image-20231120204117170](http://assest.sablogs.cn/imgs/typora/image-20231120204117170.png)

解压后，会出现一个go文件夹，接下来我们将go添加到环境变量

```bash
vim /etc/profile
```

打开后，在底部添加

```bash
export GO111MODULE=on
export GOROOT=/usr/local/go
export GOPATH=/home/gopath
export PATH=$PATH:$GOROOT/bin:$GOPATH/bin
```

最后使用`source /etc/profile`命令使环境变量生效

到这就配置完成了

