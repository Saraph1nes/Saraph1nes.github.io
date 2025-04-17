---
title: 使用国内镜像加速 Rust 安装与更新
date: 2025-04-17
tags: 
   - Rust
   - 安装
   - 加速
   - 镜像
---

# 使用国内镜像加速 Rust 安装与更新

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文介绍了如何通过配置国内镜像来加速 Rust 的安装与更新。由于 Rust 官方服务器位于国外，直接安装可能会因网络问题导致速度缓慢或失败。通过设置环境变量（如 RUSTUP_UPDATE_ROOT 和 RUSTUP_DIST_SERVER）为国内镜像地址（如清华源、中科大源等），可以显著提升安装和更新的效率。

<!-- DESC SEP -->

## 背景

由于 Rust 官方服务器位于国外，直接按照 Rust 官网指南安装时可能会遇到下载速度慢或失败的问题。通过使用国内镜像，可以显著提升安装和更新的效率。

## 官方安装方法

默认安装命令如下：

curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

## 使用国内镜像加速安装

### 原理

官方的 rustup-init.sh 脚本支持配置以下两个环境变量：

1. `RUSTUP_UPDATE_ROOT`：指定 rust-init 的下载地址，默认值为 https://static.rust-lang.org/rustup。

2. `RUSTUP_DIST_SERVER`：指定 Rust 配套组件的下载地址，默认值为 https://static.rust-lang.org。

### 国内可用镜像地址

**RUSTUP_UPDATE_ROOT：**
- https://mirrors.ustc.edu.cn/rust-static/rustup

**RUSTUP_DIST_SERVER：**
- https://mirrors.sjtug.sjtu.edu.cn/rust-static/
- https://mirrors.tuna.tsinghua.edu.cn/rustup
- https://mirrors.ustc.edu.cn/rust-static

### 安装示例（以清华源为例）

1. 将以下环境变量添加到 ~/.bashrc 或其他 Shell 配置文件中，使其成为全局变量：

```bash
export RUSTUP_UPDATE_ROOT=https://mirrors.ustc.edu.cn/rust-static/rustup

export RUSTUP_DIST_SERVER=https://mirrors.tuna.tsinghua.edu.cn/rustup
```

2. 运行安装命令：

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

## 补充说明

如果未将环境变量添加到 ~/.bashrc，可以在安装后将其添加到 $HOME/.cargo/env 文件中：

```bash
echo "RUSTUP_DIST_SERVER=https://mirrors.tuna.tsinghua.edu.cn/rustup" >> ~/.cargo/env
```

## 使用国内镜像加速更新 crate 拉取

### 替换 crates.io 源

编辑 ~/.cargo/config 文件，内容如下：
```bash
[source.crates-io]
registry = "https://github.com/rust-lang/crates.io-index"
replace-with = 'sjtu'  # 可选：'tuna'、'ustc'、'rustcc'

# 清华大学
[source.tuna]
registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"

# 中国科学技术大学
[source.ustc]
registry = "git://mirrors.ustc.edu.cn/crates.io-index"

# 上海交通大学
[source.sjtu]
registry = "https://mirrors.sjtug.sjtu.edu.cn/git/crates.io-index.git"

# rustcc 社区
[source.rustcc]
registry = "git://crates.rustcc.cn/crates.io-index"
```

### 替换 github.com 源

通过 Git 全局替换 github.com 为代理服务（如 fastgit.org），或直接修改 Cargo.toml 中的引用源 URL。

## 参考文献

- [Rust 安装指南](https://www.rust-lang.org/tools/install)
- [Rustup 镜像安装帮助](https://mirrors.tuna.tsinghua.edu.cn/help/rustup/)