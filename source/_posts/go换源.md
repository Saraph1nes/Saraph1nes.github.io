---
title: go换源
date: 2023-11-14 20:28:25
index_img:
tags: [GO, 后端, 换源]
category: 后端
---

Go版本1.13及以上：
任何系统都可以在编译器终端执行以下操作（最推荐）：

```text
$ go env -w GO111MODULE=on
$ go env -w GOPROXY=https://goproxy.cn,direct
```

MacOS或Linux也可以

```text
$ export GO111MODULE=on
$ export GOPROXY=https://goproxy.cn,direct
```

或者

```text
$ echo "export GO111MODULE=on" >> ~/.profile
$ echo "export GOPROXY=https://goproxy.cn,direct" >> ~/.profile
$ source ~/.profile
```
