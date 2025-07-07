---
title: Cursor清除历史记录
date: 2025-07-07
tags: 
   - Cursor
---

# Cursor清除历史记录

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文介绍了Cursor的清除历史记录的方法

<!-- DESC SEP -->

今天进入cursor的时候，一直显示`loading chat`，然后就卡住了，怎么都进不去。

搜了下相关原因，说是cursor缓存过大，清除历史记录可以解决这个问题。

cursor的缓存路径如下：

- Windows: `%APPDATA%\Cursor\User\workspaceStorage`
- macOS: `~/Library/Application Support/Cursor/User/workspaceStorage`
- Linux: `~/.config/Cursor/User/workspaceStorage`

我是macOS系统，最终我删除了`~/Library/Application Support/Cursor/User/workspaceStorage`目录下的所有文件，然后重新打开cursor，问题解决了。

## 参考

- [Chat stuck in “Loading Chat”](https://forum.cursor.com/t/chat-stuck-in-loading-chat/65498)