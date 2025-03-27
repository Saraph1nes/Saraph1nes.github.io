---
title: source-map介绍
date: 2022-04-04
tags:
  - JavaScript
  - 构建工具
  - source-map
  - 调试优化
  - 前端工程化
---

# source-map介绍

<!-- DESC SEP -->

本文系统解析source-map核心功能，详细对比eval、source-map、hidden-source-map等7种生成模式的差异特性。通过分析行映射精度、构建速度、文件体积等维度，说明开发环境推荐使用cheap-module-source-map的原因。结合生产环境实际需求，给出禁用source-map的安全建议及性能优化方案，帮助开发者合理运用调试工具提升工程化效率。

<!-- DESC SEP -->

## 1. eval (默认)

每个module会封装到eval里包裹起来执行，并且会在末尾追加注释（用来关联到map以锁定行数）

## 2. source-map

生成一个SourceMap文件

## 3. hidden-source-map

和source-map一样，但不会在bundle末尾追加注释

把source-map文件打包出来，但不在module中关联，也就不能锁定代码行数了

## 4.inline-source-map

生成一个DataUrl形式的SourceMap

不会单独把source-map文件打包出来，直接放在module中的eval函数里，能锁定代码行数

## 5.eval-source-map

每个module会通过eval()来执行，并且生成一个DataUrl形式的SourceMap

不会单独把source-map文件打包出来，直接放在bundle中的eval函数里，能锁定代码行数

## 6. cheap-source-map

生成一个没有列信息(column-mappings)的SourceMap文件，不包含loader的sourcemap(比如babel的sourcemap)

与source-map相比，只是没有列信息，我们查看报错的时候通常只需要知道行数，可以减少sourceMap文件大小

## 7. cheap-module-source-map

生成一个没有列信息(column-mappings)的SourceMap文件，loader的sourcemap也被简化为只包含对应行的

推荐开发环境使用，能生成map文件，不记录列数，对于babel解析的source-map，不会导致行数识别问题。

## 总结：

生产环境一般不用sourcemap功能，原因如下：

- 通过bundle和sourcemap文件可以反编译成源码，可能会导致源码暴露
- 生产环境一般使用更为小巧的bundle，soucemap文件体积太大
