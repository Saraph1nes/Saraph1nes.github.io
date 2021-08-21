---
title: npm快速换源工具nrm
date: 2021-08-20 22:54:35
tags: 杂七杂八
category: 前端
---

# npm快速换源工具nrm

## 为什么要切换npm源

1.速度太慢

因为默认的npm源是国外的，速度比较慢。可以选择国内镜像，加快下载安装速度，比如我们可以切换到taobao源或者公司内部的源。

2.手动切换太麻烦

切换源时，往往记不住源链接，百度之后再来执行命令npm config set registry ....

切换npm源推荐使用nrm

nrm 是一个 js 模块，是一个命令行工具，可以用来快速切换 npm 源。

## nrm安装方法

```
npm install -g nrm 
```

## 查看可选npm源

```
nrm ls
```

当我们安装好nrm之后，命令行工具输入 nrm ls 想去查看国内现有的包下载地址发现报错

```
internal/validators.js:124
    throw new ERR_INVALID_ARG_TYPE(name, 'string', value);
    ^

[TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
  at validateString (internal/validators.js:124:11)
  at Object.join (path.js:424:7)
  at Object.<anonymous> (C:\software\nvm\v14.17.4\node_modules\nrm\cli.js:17:20)
  at Module._compile (internal/modules/cjs/loader.js:1072:14)
  at Object.Module._extensions..js (internal/modules/cjs/loader.js:1101:10)
  at Module.load (internal/modules/cjs/loader.js:937:32)
  at Function.Module._load (internal/modules/cjs/loader.js:778:12)
  at Function.executeUserEntryPoint [as runMain] (internal/modules/run_main.js:76:12)
  at internal/main/run_main_module.js:17:47
] {
  code: 'ERR_INVALID_ARG_TYPE'
}
```

这里是因为默认了相对地址是命令行的而没有找到nrm.js文件，解决办法：

在报错信息里复制这个文件地址

![](https://i.loli.net/2021/08/21/yN2Zt8SxGHVrIvl.png)

用编译器打开cli.js文件，进行如下替换即可

```js
// const NRMRC = path.join(process.env.HOME, '.nrmrc');
const NRMRC = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.nrmrc');
```

![](https://i.loli.net/2021/08/21/i6nhPf8pKuwyQMR.png)

## 常用命令

```
查看可选npm源
nrm ls
切换npm源
nrm use npm
增加npm源(hellonpm为新增源的名称,下同)
nrm add hellonpm https://registry.npm.taobao.org
删除npm源
nrm del hellonpm
测试npm源速度
nrm test hellonpm
```

