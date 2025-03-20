---
title: 让你的VSCode极简和高效
date: 2025-02-16
tags: 
  - VSCode
  - 工具
  - 效率
  - 美化
  - 定制化
---

# 让你的VSCode极简和高效

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文介绍了如何通过安装Apc Customize UI++扩展和编辑settings.json文件，来定制VSCode的UI元素，使其更加极简和高效。包括颜色自定义、滚动栏自定义、APC自定义UI设置以及其他个性化设置，帮助用户打造一个更清洁和简约的编码环境。

<!-- DESC SEP -->

VSCode是一个高度可自定义的代码编辑器，可以根据您的喜好进行量身定制，使其更极简和高效。

## 1、安装扩展

### Apc Customize UI++

此扩展程序让您可以自定义VSCODE中的各种UI元素，可以直接从[Vscode Marketplace](https://marketplace.visualstudio.com/items?itemName=drcika.apc-extension)安装它。

## 2、自定义设置

为了使Vscode清洁器和更简约，我们将编辑settings.json文件。

您可以通过按command + shift + P打开此文件，然后搜索`setting.json`，即可开启

### 颜色自定义

添加以下设置自定义颜色和外观

```json
"workbench.colorCustomizations": {
    "editor.background": "#21222f",
    "sideBar.background": "#21222f",
    "activityBar.background": "#21222f",
    "actionBar.toggledBackground": "#21222f",
    "activityBarTop.background": "#21222f",
    "statusBar.background": "#21222f",
    "titleBar.activeBackground": "#21222f",
    "titleBar.inactiveBackground": "#21222f",
    "panel.background": "#21222f",
    "editorGroupHeader.tabsBackground": "#21222f",
    "editorGroupHeader.tabsBorder": "#21222f",
    "editorGroup.border": "#21222f",
    "editorGroup.dropBackground": "#21222f",
    "editorGroupHeader.noTabsBackground": "#21222f",
    "editorGroupHeader.border": "#21222f",
    "editorGroup.focusedEmptyBorder": "#21222f",
    "editorGroup.emptyBackground": "#21222f",
    "editorGroupHeader.tabsEmptyBackground": "#21222f",
    "tab.activeBackground": "#303148",
    "tab.inactiveBackground": "#21222f",
    "tab.inactiveForeground": "#555875",
    "tab.border": "#21222f",
    "tab.activeBorder": "#21222f",
    "tab.unfocusedActiveBorder": "#21222f",
    "tab.activeBorderTop": "#21222f",
    "tab.unfocusedActiveBorderTop": "#21222f",
    "tab.hoverBackground": "#21222f",
    "tab.unfocusedHoverBackground": "#21222f",
    "tab.hoverBorder": "#21222f",
    "tab.unfocusedHoverBorder": "#21222f",
    "tab.activeModifiedBorder": "#21222f",
    "tab.inactiveModifiedBorder": "#21222f",
    "tab.unfocusedActiveModifiedBorder": "#21222f",
    "tab.unfocusedInactiveModifiedBorder": "#21222f",
    "dropdown.background": "#21222f",
    "input.background": "#2e3045",
    "input.border": "#3e425e",
    "inputOption.activeBackground": "#21222f",
    "inputOption.activeBorder": "#21222f",
    "inputOption.activeForeground": "#e5e9ff",
    "button.background": "#2344ff",
    "button.foreground": "#ffffff",
    "terminal.background": "#21222f",
    "editorLineNumber.activeForeground": "#fdad51",
    "menu.background": "#21222f",
    "editorPane.background": "#21222f",
    "editor.selectionBackground": "#383c52",
    "panel.border": "#383c52",
    "sideBar.border": "#383c52",
    "scrollbar.shadow": "#21222f",
    "editorStickyScroll.border": "#2d3042",
    "editor.lineHighlightBackground": "#2d3042",
    "editorGutter.background": "#21222f",
    "editorGutter.modifiedBackground": "#21222f",
    "editorGutter.addedBackground": "#21222f",
    "editorGutter.deletedBackground": "#21222f",
    "statusBarItem.remoteBackground": "#9190ff",
    "focusBorder": "#21222f",
    "scrollbarSlider.background": "#383c52",
    "scrollbarSlider.activeBackground": "#535a7c",
    "scrollbarSlider.hoverBackground": "#474c69"
},
```

### **滚动栏自定义**

最小化并自定义滚动条

```json
"editor.scrollbar.verticalScrollbarSize": 10,
"editor.scrollbar.horizontalScrollbarSize": 10,
"editor.scrollbar.vertical": "visible",
"editor.scrollbar.horizontal": "visible",
```

### APC自定义UI设置

可以设置vscode的外观

```json
"apc.electron": {
    "backgroundColor": "#1a1a1a",
    "frame": true,
    "transparent": true,
    "titleBarStyle": "hiddenInset",
    "vibrancy": "ultra-dark",
    "trafficLightPosition": {
        "x": 15,
        "y": 13
    },
    "trafficLightPositionRight": {
        "x": 15,
        "y": 13
    }
},
```

### 其他自定义

```json
{
    // 将侧边栏的位置设置为右侧
    "workbench.sideBar.location": "right",

    // 设置 APC 的字体系列
    "apc.font.family": "GohuFont uni14 Nerd Font Mono",

    // 设置 APC 头部的样式
    "apc.header": {
        "compact": 22, // 紧凑模式的高度
        "fontSize": 12, // 字体大小
        "fontWeight": "bold" // 字体粗细
    },

    // 设置 APC 侧边栏标题栏的样式
    "apc.sidebar.titlebar": {
        "fontSize": 11, // 字体大小
        "fontWeight": "bold" // 字体粗细
    },

    // 自定义 APC 样式表
    "apc.stylesheet": {
        ".tabs-container .tab.active": {
            "border-radius": "7px !important" // 激活标签的圆角
        },
        ".scrollbar": {
            "background": "#21222f !important" // 滚动条背景颜色
        }
    },

    // 禁用 CSS 属性值自动完成
    "css.completion.triggerPropertyValueCompletion": false,

    // 将 GitHub Copilot 聊天终端位置设置为终端
    "github.copilot.chat.terminalChatLocation": "terminal",

    // 禁用面包屑导航
    "breadcrumbs.enabled": false,

    // 隐藏编辑器操作位置
    "workbench.editor.editorActionsLocation": "hidden",

    // 设置编辑器标签高度为紧凑模式
    "window.density.editorTabHeight": "compact",

    // 禁用编辑器的迷你地图
    "editor.minimap.enabled": false,

    // 将活动栏的位置设置为底部
    "workbench.activityBar.location": "bottom",

    // 禁用工作台布局控制
    "workbench.layoutControl.enabled": false,

    // 禁用命令中心
    "window.commandCenter": false,

    // 启用 APC 菜单栏紧凑模式
    "apc.menubar.compact": true
}
```

