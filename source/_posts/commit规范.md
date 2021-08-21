---
title: git commit规范
date: 2021-08-20 23:01:51
tags: git
category: 通用
---

### git commit规范

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
复制代码
占位标签解析：
type:代表某次提交的类型，比如是修复一个bug还是增加一个新的feature。所有的type类型如下：
scope:scope说明commit影响的范围。scope依据项目而定，
		例如在业务项目中可以依据菜单或者功能模块划分，
		如果是组件库开发，则可以依据组件划分。
subject:是commit的简短描述
body:提交代码的详细描述
footer:如果代码的提交是不兼容变更或关闭缺陷，则Footer必需，否则可以省略。

feat[特性]:新增feature 
fix[修复]: 修复bug     
docs[文档]: 仅仅修改了文档，比如README, CHANGELOG, CONTRIBUTE等等
style[格式]: 仅仅修改了空格、格式缩进、逗号、console.log删除等等，不改变代码逻辑
refactor[重构]: 代码重构，没有加新功能或者修复bug
perf[优化]: 优化相关，比如提升性能、体验
test[测试]: 测试用例，包括单元测试、集成测试等
chore[工具]: 改变构建流程、或者增加依赖库、工具等
revert[回滚]: 回滚到上一个版本
复制代码
```



#### 示例：

```
[特性]添加头像功能
[特性]添加收藏功能
[修复]在android机器上传崩溃问题解决
[文档]修改README,增加了使用说明
[优化]首页图片加载缓慢优化
[重构]对头像功能进行封装重构
```