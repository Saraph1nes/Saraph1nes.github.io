---
title: OpenSSL介绍及原理
date: 2024-03-12
tags:
  - OpenSSL
  - SSL证书
  - 加密库
  - 命令行工具
  - 网络安全
---

# OpenSSL介绍及原理

<!-- DESC SEP -->

OpenSSL 作为开源的加密工具包，完整实现了 TLS/SSL 协议栈并提供跨平台支持。其核心功能基于密码学算法库构建，包含 RSA/ECDSA 密钥对的生成与管理机制，支持通过命令行工具创建证书签名请求（CSR）并进行证书验证。该工具包采用模块化架构设计，内置 X.509 证书处理引擎，可完成证书链的生成、签名和安装全过程。通过抽象不同操作系统的加密接口，OpenSSL 在 Linux、Windows 和 macOS 平台均保持一致的 API 行为。

<!-- DESC SEP -->

正确的SSL实施对于网站的安全和成功很重要。因为很多网站所有者可能是第一次接触SSL，所以提供给他们所有必要的工具和实用程序是必要的。OpenSSL就是这样的一个工具。那么，OpenSSL到底是什么，为什么它这么重要呢？

下面这份指南就会涵盖各个方面，包括如何使用OpenSSL以及各种OpenSSL命令，从而实现简单而高效的SSL管理。

## 什么是 OpenSSL？

OpenSSL 是一个全方位的加密库，提供 TLS 协议的开源应用程序。它允许用户执行各种与 SSL 相关的任务，包括 CSR（证书签名请求）生成、私钥生成和 SSL 证书安装。

![What Is OpenSSL](http://assest.sablogs.cn/img/typora/OpenSSL.jpg)

## OpenSSL 有何用途？

OpenSSL是一个开源命令行工具，主要用于以下几个方面：生成CSR（Certificate Signing Request）和私钥、在服务器上安装SSL证书文件、合并文件、将证书转换为不同的SSL格式、验证证书信息，并解决可能出现的问题。

安装SSL证书到您的网站上需要遵循一系列必要的步骤，这些步骤对于任何服务器或电子邮件客户端都是相同的。在没有Web控制面板或者想要简化整个过程时，OpenSSL尤其方便。

由于并非所有服务器都提供Web用户界面来管理SSL，因此在某些平台上，OpenSSL是导入和配置证书的唯一解决方案。

## 如何使用 OpenSSL

OpenSSL的所有功能都与其命令行相关。您只需要学习一些常见的OpenSSL命令，就能更快、更轻松地配置每个新证书。

OpenSSL于1998年首次发布，适用于Linux、Windows、macOS和BSD系统。大多数Linux发行版都预先编译了OpenSSL。

### 在Linux上

要检查您的Linux系统是否安装了OpenSSL，请使用以下命令：

对于使用rpm包的GNU/Linux发行版：

```bash
rpm -qa | grep -i openssl
```

对于使用deb软件包的GNU/Linux发行版：

```bash
dpkg -l | grep -i openssl
```

对于Arch Linux使用：

```bash
pacman -Q openssl
```

### 在 Windows 上

如果您使用的是Windows系统，您可以从此处下载OpenSSL。

默认安装将在C盘上为程序创建一个目录 – C:\OpenSSL-Win32

要运行该程序，请转至C:\OpenSSL-Win32\bin\目录并双击openssl.exe文件。这将打开一个文本窗口，并显示OpenSSL>提示符。

在此提示符下输入所需的OpenSSL命令。您生成的文件将位于同一目录中。Windows上的OpenSSL命令与在Linux服务器上使用的命令相同。

## 常用 OpenSSL 命令

下面我们为普通用户整理了一些常见的 OpenSSL 命令。您可以随时使用它们来生成或管理您的证书。

### 检查 OpenSSL 版本

必须知道您拥有的 OpenSSL 版本，因为它决定了您可以使用哪些加密算法和协议。您可以通过运行以下命令来检查 OpenSSL 版本：

```bash
openssl version –a
```

---

### 使用 OpenSSL 生成 CSR

您可以使用 OpenSSL 创建 CSR（证书签名请求）代码。运行以下命令生成 CSR：

```bash
openssl req -new -key yourdomain.key -out yourdomain.csr
```

您还可以借助 –subj 开关在命令行本身中提交信息。

此命令将禁用问题提示：

```sh
openssl req -new -key yourdomain.key -out yourdomain.csr -subj "/C=US/ST=CA/L=San Francisco/O=Your Company, Inc./OU=IT/CN=yourdomain.com"
```

或者，您可以通过 CSR 生成器工具创建 CSR。

---

### 使用 OpenSSL 生成私钥

要生成私钥，您需要指定密钥算法、密钥大小和可选密码。标准密钥算法为 RSA，但根据具体情况也可以选择 ECDSA。选择关键算法时，请确保不会遇到兼容性问题。在本文中，我们仅展示如何通过 RSA 算法生成私钥。

对于密钥大小，使用 RSA 密钥算法时应选择 2048 位，使用 ECDSA 算法时应选择 256 位。任何低于 2048 的密钥大小都是不安全的，而较高的值可能会降低性能。

最后，您应该决定您的私钥是否需要密码。请注意，某些服务器不接受带有密码的私钥。

准备好生成私钥（使用 RSA 算法）后，请运行以下命令：

```sh
openssl genrsa -out yourdomain.key 2048
```

此命令将在当前目录中创建 yourdomain.key 文件。您的私钥将采用 PEM 格式。

---

### 使用 OpenSSL 查看私钥信息

您可以通过以下命令查看您的私钥的编码内容：

```bash
cat yourdomain.key
```

---

### 使用 OpenSSL 解码私钥

要解码您的私钥，请运行以下命令：

```bash
openssl rsa -text -in yourdomain.key -noout
```

---

### 使用 OpenSSL 提取公钥

要从私钥中提取公钥，请使用以下命令：

```bash
openssl rsa -in yourdomain.key -pubout -out yourdomain_public.key
```

---

### 使用 OpenSSL 立即创建您的私钥和 CSR

OpenSSL 用途广泛，还有一个命令可以生成您的私钥和 CSR：

```bash
openssl req -new

-newkey rsa:2048 -nodes -keyout yourdomain.key

i>-out yourdomain.csr

-subj "/C=US/ST=CA/L=San Francisco/O=Your Company, Inc./OU=IT/CN=yourdomain.com"
```

此命令生成不带密码的私钥 (-keyout yourdomain.key) 和 CSR 代码 (out yourdomain.csr)。

------

### 使用 OpenSSL 检查 CSR 信息

为确保您在向 CA 提交 CSR 之前提供了正确的信息，请运行以下命令：

```bash
openssl req -text -in yourdomain.csr -noout –verify
```

------

### 将 CSR 发送给 CA

运行以下命令查看并复制 CSR 的全部内容：

```bash
cat yourdomain.csr
```

确保包含 —–BEGIN CERTIFICATE REQUEST—– 和 —–END CERTIFICATE REQUEST— 标签，并将所有内容粘贴到 SSL 供应商的订单中。

------

### 检查 OpenSSL 中的证书

您的 CA 将 SSL 证书发送到您的收件箱后，运行以下命令以确保证书的信息与您的私钥匹配。

```bash
openssl x509 -text -in yourdomain.crt –noout
```

我们的常见 OpenSSL 命令列表到此结束。如果愿意，您可以研究所有 OpenSSL 命令。

------

##  底线

现在您已经知道什么是 OpenSSL 及其工作原理，您可以使用其命令在各种服务器上生成、管理和安装 SSL 证书。有时，当您没有网络托管面板时，使用 OpenSSL 是唯一的选择。

您可能需要一段时间才能熟悉 OpenSSL 命令，但使用它们越多，SSL 证书管理就会越好。

如果您正在寻找有关 OpenSSL 是什么及其工作原理的更多信息，这本免费书籍是一个极好的资源。

## 参考
- https://www.ssldragon.com/blog/what-is-openssl/