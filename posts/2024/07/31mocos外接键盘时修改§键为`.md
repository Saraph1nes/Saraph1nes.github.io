---
title: MacOS外接键盘时修改§键为`
date: 2024-07-31
tags: 
  - MacOS
  - 键盘
  - Karabiner
  - 键盘布局
  - NIZ
  - 技术教程
---

# MacOS外接键盘时修改§键为`

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

在macOS Sonoma 14.5中，外接NIZ MICRO 82键有线键盘时，反引号键被识别为§键。通过排查发现键盘被识别为ISO布局。由于macOS原生不支持修改反引号键，使用Karabiner-Elements插件进行自定义按键设置，成功将§键改为反引号键。参考了多篇文档和教程，最终解决了问题。

<!-- DESC SEP -->

## 环境

- 键盘型号：NIZ MICRO 82键有线版
- macOS：Sonoma 14.5
- 链接方式：键盘链接显示器，显示器使用typec链接电脑

## 排查思路

### 按键测试

键盘是支持mac/win双系统的，切换为mac模式并链接到电脑时，我发现反引号键变成了奇怪的§
首先，我怀疑是键盘的问题，因此我使用了在线的键盘测试工具，发现按键正常，如下图
![image-20240731002327190](https://assest.sablogs.cn/imgs/blog/image-20240731002327190.png)
那么，很有可能是mac系统的问题了，经过一番搜索，我了解到了mac是存在「键盘布局」这个东西的
### 什么是键盘布局

这里引用一段[apple官网](https://support.apple.com/zh-cn/guide/mac-help/mchlp2886/mac)的原话：
>如果你连接的键盘不能马上被识别，“键盘设置助理”会自动打开，让你指定键盘类型。macOS 可识别三类键盘：ANSI、JIS（日本）和 ISO（欧洲）。ANSI 键盘是标准的 101 键布局，在北美洲以及世界其他地方广为使用。

由此可见，我的键盘应该是直接被识别成了ISO布局键盘，那么ISO布局的键盘应该长什么样呢，[相关链接](https://support.apple.com/zh-cn/102743#ISO)
![image-20240731003618624](https://assest.sablogs.cn/imgs/blog/image-20240731003618624.png)
### 美式、欧式、德语键盘

- 美式键盘

![美式键盘](https://assest.sablogs.cn/imgs/blog/ChMkJlp5aQWIDHt8AAGy-8J2x7cAAksLAMQ4iQAAbMT299-20240731005150639.jpg)
- 欧式键盘（英国键盘）

![欧式键盘（英国键盘）](https://assest.sablogs.cn/imgs/blog/ChMkJlp5aRWIbUnlAAH1KK8nvzIAAksLAMoCIsAAfVA450.jpg)
- 德语键盘

![德语键盘](https://assest.sablogs.cn/imgs/blog/ChMkJlp5aTqIN0fiAAHnzUUhB-kAAksLAOAAhcAAefl065.jpg)
### ISO键盘的差异点

从图中可以看到，ISO键盘和我们大多数人日常使用的ANSI键盘有一些区别：
- 左上角「反引号键」变成「§」
	- §符号通常被称为“节号”或“分节符号”。它的主要用途包括：
		1. **法律和法规**：在法律文件、法规和合同中，§符号常用于表示特定的章节或条款。例如，§ 5 可能指的是第五条款。
		2. **学术引用**：在学术写作中，特别是在引用法律文献时，§符号也常用于指示特定的章节或段落。
		3. **文档结构**：在某些文档中，§符号可以用来分隔不同的部分或段落，以便于阅读和理解。
		4. **编程和技术文档**：在某些编程语言或技术文档中，§符号可能被用作特殊标记或注释符号。
- 左侧「Shift」和「Z」之间多出一个按键
	- 以下是这个按键一些常见的用途：
		1. **英式键盘（UK Layout）**：在英国键盘布局中，这个按键通常用于输入「\」和「|」符号。按下这个键可以输入反斜杠「\」，而按住「Shift」键再按这个键可以输入竖线「|」。
		2. **德式键盘（German Layout）**：在德国键盘布局中，这个按键通常用于输入「<」和「>」符号。按下这个键可以输入小于号「<」，而按住「Shift」键再按这个键可以输入大于号「>」。
		3. **其他语言布局**：在其他一些语言的键盘布局中，这个按键可能用于输入其他特定的符号或字符。例如，在一些北欧国家的键盘布局中，这个按键可能用于输入「Ø」或「Æ」等特殊字符。
		这个额外的按键在ISO标准键盘布局中增加了更多的输入选项，特别是对于需要输入特定符号或字符的语言和地区。具体的符号和字符可能会因键盘布局和操作系统的不同而有所变化。
- 「Return」左侧按键
	- 在其他一些语言的键盘布局中，这个键可能用于输入其他特定的符号或字符。例如，在德语键盘布局中，这个键可能用于输入「Ü」和「ü」。

### 确定修改方案

了解了ISO键盘的差异点后，回到问题上，目前已经可以确定我的键盘就是被识别成了ISO键盘。
但是，我的键盘并没有ISO欧式布局中的「反引号键」（位于左侧shift和z之间的键），如下图。
![image-20240731005650959](https://assest.sablogs.cn/imgs/blog/image-20240731005650959.png)
现在就形成了一个问题，原有的「反引号键」变成了「§键」，又没有标准ISO欧洲布局中的「反引号键」
![image-20240731143559445](https://assest.sablogs.cn/imgs/blog/image-20240731143559445.png)
于是我就打算通过自定义按键的方式解决
## 解决问题

既然打算自定义按键，那么我优先考虑原生的解决方案，mac是支持改键的，但不支持改反引号这里，[说明书链接](https://support.apple.com/zh-cn/guide/mac-help/mchlp1011/mac)
![image-20240731010336760](https://assest.sablogs.cn/imgs/blog/image-20240731010336760.png)
很显然只能用第三方的解决方案了（Github启动！）
通过搜索，我注意到了[Karabiner-Elements](https://github.com/pqrs-org/Karabiner-Elements)这个插件，它有18.4k的star，肯定靠谱
在安装后，按照如下设置即可解决
![image-20240731122641206](https://assest.sablogs.cn/imgs/blog/image-20240731122641206.png)
## 参考

- [Remapping the § key on macOS](https://www.jamesinman.co.uk/remapping-the/)
- [键盘测试](https://key-test.com/cn/)
- [如何识别不同国家或地区的 Apple 键盘布局](https://support.apple.com/zh-cn/102743)
- [QWERTY之下的美、欧、日三种键盘布局](https://mouse.zol.com.cn/677/6776123.html)
- [在 Mac 上更改修饰键的行为](https://support.apple.com/zh-cn/guide/mac-help/mchlp1011/mac)
