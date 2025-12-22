---
title: macOS 连接老旧 Git 服务器出现 "no matching host key type found" 的问题记录
date: 2025-12-22
tags: 
  - macOS
  - Git
  - SSH
  - 问题排查
---

# macOS 连接老旧 Git 服务器出现 "no matching host key type found" 的问题记录

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文记录了在 macOS 上连接老旧 Git 服务器时遇到的 SSH 握手失败问题。由于 macOS 自带的 OpenSSH 8.8+ 默认禁用了 ssh-rsa 算法，而部分老旧服务器仅支持该算法，导致无法协商出匹配的 host key 类型。文章详细分析了错误原因，并提供了永久配置和临时解决两种方案。

<!-- DESC SEP -->

## 一、问题背景

在 macOS 上尝试克隆 Git 仓库：

```bash
git clone git@git.code.tencent.com:your_name/your_project.git
```

报错：

```
Unable to negotiate with xxx.xxx.xxx.xxx port 22: no matching host key type found. Their offer: ssh-rsa
致命错误：无法读取远程仓库。
请确认您有正确的访问权限并且仓库存在。
```

---

## 二、错误原因分析

### 2.1 报错核心含义

```
no matching host key type found. Their offer: ssh-rsa
```

意思是：

- 远程 Git 服务器只支持 `ssh-rsa`（SHA-1 算法）
- macOS 自带 OpenSSH 8.8+ 出于安全原因默认禁用了 `ssh-rsa`
- 双方无法协商出匹配的 host key 类型，导致连接失败

### 2.2 常见误解

有人会以为是 Git 仓库本身的限制，其实**问题完全在 SSH 协议协商上**，与 Git 本身无关。

### 2.3 IP 与域名匹配问题

- 报错中显示的 IP 地址是解析 `git.code.tencent.com` 后的实际 IP
- SSH 配置文件 `~/.ssh/config` 是按你输入的 **Host 字段**匹配的，而不是解析后的 IP
- 所以如果你只写了 IP，SSH 配置不会生效

---

## 三、解决方案

### 3.1 针对特定 Git 服务器启用 ssh-rsa（推荐）

编辑本机 SSH 配置：

```bash
nano ~/.ssh/config
```

添加以下内容：

```
Host git.code.tencent.com
    HostName git.code.tencent.com
    HostKeyAlgorithms +ssh-rsa
    PubkeyAcceptedAlgorithms +ssh-rsa
```

**说明**：

- `Host`：你在 Git 命令中使用的域名
- `HostKeyAlgorithms` / `PubkeyAcceptedAlgorithms`：允许使用老旧的 `ssh-rsa` 算法，仅对这个服务器生效

保存并退出：

- 按 `Ctrl + O` 保存
- 按 `Ctrl + X` 退出

### 3.2 测试 SSH 连接

```bash
ssh -v git@git.code.tencent.com
```

如果可以看到握手成功信息，没有报错，即表示配置生效。

### 3.3 执行 Git 克隆或拉取

```bash
git clone git@git.code.tencent.com:your_name/your_project.git
```

此时应该可以正常拉取代码。

---

## 四、临时解决方案

如果只想临时使用，不修改配置文件：

**SSH 命令**：

```bash
ssh -oHostKeyAlgorithms=+ssh-rsa -oPubkeyAcceptedAlgorithms=+ssh-rsa git@git.code.tencent.com
```

**Git 命令**：

```bash
GIT_SSH_COMMAND='ssh -oHostKeyAlgorithms=+ssh-rsa -oPubkeyAcceptedAlgorithms=+ssh-rsa' git clone git@git.code.tencent.com:your_name/your_project.git
```

这种方式只对当前命令有效，不改变全局配置。

---

## 五、总结

| 问题 | 原因 |
| --- | --- |
| macOS 连接老旧 Git 服务器失败 | OpenSSH 8.8+ 默认禁用 `ssh-rsa`，老服务器只支持 `ssh-rsa` |
| SSH 配置不生效 | `Host` 字段必须与 Git 命令中的域名匹配，不能写 IP |

**解决思路**：在本机允许 `ssh-rsa`，但仅针对特定服务器，不影响其他 SSH 连接的安全性。
