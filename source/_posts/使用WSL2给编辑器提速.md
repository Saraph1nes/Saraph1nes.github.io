---
title: 使用WSL2给编辑器提速
index_img: https://s2.loli.net/2022/04/04/dvRi6LwImbyQVHt.png
date: 2022-02-08 18:25:48
tags:
---

## ⁂ 前言

最近使用webstrom的时候下方老是在构建索引，而且挺慢，于是花了点时间捣鼓了一下WSL2。

## ⁂ WSL是什么

Windows Subsystem for Linux（简称WSL）是一个在Windows 10上能够运行原生Linux二进制可执行文件（ELF格式）的兼容层。

Linux 的 Windows 子系统允许开发人员直接在 Windows 上运行 GNU/Linux 环境（包括大多数命令行工具、实用程序和应用程序）， 无需修改，没有传统虚拟机或双重引导设置的开销。

## ⁂ WSL2

WSL 2 是 Windows 子系统 for Linux 体系结构的新版本，它为 Windows 子系统 for Linux 提供支持，以便在 Windows 上运行 ELF64 Linux 二进制文件。

其主要目标是提高文件系统性能，以及添加完整的系统调用兼容性。

这种新体系结构更改了这些 Linux 二进制文件与 Windows 和计算机硬件交互的方式，但仍提供与 WSL 1（当前广泛使用的版本）中相同的用户体验。

单个 Linux 发行版可以使用 WSL 1 或 WSL 2 体系结构运行。每个发行版都可以随时升级或降级，您可以并行运行 WSL 1 和 WSL 2 发行版。

WSL 2 使用全新的架构，该架构受益于运行真正的 Linux 内核。

## ⁂ 开整

安装WSL并升级： https://docs.microsoft.com/zh-cn/windows/wsl/install#update-to-wsl-2

旧版安装WSL看这里： https://docs.microsoft.com/zh-cn/windows/wsl/install-manual#step-4---download-the-linux-kernel-update-package

WSL2支持GPU： https://docs.microsoft.com/zh-cn/windows/ai/directml/gpu-accelerated-training

终端推荐Windows Terminal，它可以管理所有的终端，支持常用快捷键，谁用谁知道。在win自带的应用商店就可以安装。

安装好后，在ubuntu中使用wsl.exe -l -v，或者在powershell中使用wsl -l -v，即可列出已安装的 Linux 发行版并显示每个发行版的 WSL 版本

Webstrom在2022版本更新之后也是支持wsl的，在linux中配置好ssh，把项目clone再用webstrom打开就行了

## ⁂ 后记
如果小伙伴们遇到什么问题，欢迎在评论区提问~
