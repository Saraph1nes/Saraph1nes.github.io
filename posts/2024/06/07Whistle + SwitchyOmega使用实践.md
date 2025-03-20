---
title: Whistle + SwitchyOmega使用实践
date: 2024-06-07
tags: 
    - 工具
    - 代理
    - 抓包
    - 调试工具
    - 前端开发
---

# Whistle + SwitchyOmega使用实践

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文详细介绍了 Whistle 和 SwitchyOmega 两个工具的安装配置和使用实践。Whistle 是一个基于 Node 实现的跨平台 web 调试代理工具，而 SwitchyOmega 是一个浏览器插件，用于快速切换不同的代理配置。文章涵盖了工具的安装步骤、HTTPS 证书配置、常见配置策略以及如何将配置跟随项目的方法，特别适合前端开发人员在日常开发中进行接口调试和跨域问题解决。

<!-- DESC SEP -->

我一直是使用charles进行代理和抓包的，但whistle似乎更加吸引我，原因主要是以下两点

- 易安装：作为前端开发，whistle支持使用npm命令一键安装，你只需要使用`npm i -g whistle`，就可以愉快的使用了
- 配置跟随项目：可以将代理规则配置添加到项目里，并通过`w2 add`一键设置到本地 Whistle 代理

## 简介
TS体操练习
### whistle

> 官网：[关于whistle · GitBook (wproxy.org)](https://wproxy.org/whistle/)

whistle是基于Node实现的跨平台web调试代理工具，同类型的工具有Fiddler和Charles，主要用于查看、修改HTTP、HTTPS、Websocket的请求、响应，也可以作为HTTP代理服务器使用。

### SwitchyOmega

> github：[FelisCatus/SwitchyOmega: Manage and switch between multiple proxies quickly & easily. (github.com)](https://github.com/FelisCatus/SwitchyOmega)

一句话来说，SwitchyOmega能够使你的浏览器快速轻松地管理多个代理并在多个代理之间切换

结合whistle的代理规则配置，能够很快的让浏览器适应不同项目的代理规则

## 安装启动

### 安装Node

由于whistle是基于Node的，自然需要先安装Node环境，这里不再多做说明。下面是whistle官网对Node版本的建议：

> whistle支持v0.10.0以上版本的Node，为获取更好的性能，推荐安装最新版本的Node。

### 安装whistle

- **安装whistle：**

  whistle支持三种等价的命令whistle、w2、wproxy，本文使用w2命令

  ```bash
  npm install -g whistle
  ```

- **查看版本：**

  ```bash
  w2 -V
  ```

  如果能正确输出whistle的版本信息，就表示安装成功了

- **查看帮助信息：**

  ```bash
  w2 help
  ```

### 启动whistle

- **启动whistle:**

```bash
w2 start
```

- **whistle的默认端口是8899，如果要指定端口号，执行下面的命令：**

```bash
w2 start -p 8888
```

- **重启whistle（也支持指定端口）:**

```bash
w2 restart
```

- **停止whistle:**

```bash
w2 stop
```

### whistle控制台

配置完代理后，我们需要先验证下代理是否配置成功

不同于Fiddler和Charles，whistle需要用浏览器访问配置页面（即whistle控制台），有以下两种方式

- 域名访问：[local.whistlejs.com/](https://link.juejin.cn/?target=http%3A%2F%2Flocal.whistlejs.com%2F)
- IP + 端口访问： [http://127.0.0.1:8899/](http://127.0.0.1:8899/)

>  如果进不去请尝试关闭防火墙，或者配置白名单规则

![image-20240606154730938](http://assest.sablogs.cn/img/typora/image-20240606154730938.png)

进入whistle控制台后，我们点击左侧菜单的Network，这里是查看请求日志的地方

接下来，就是让请求通过代理了

## 配置代理

配置代理时有两个关键的参数：服务器IP和端口号。端口号比较简单，对应w2 start命令启动好的端口号即可。

服务器IP的话需要分两种情况：

- 本地：对应127.0.0.1即可
- 远程：这时候需要填服务器的IP

配置所需要的信息在启动whistle时控制台会告诉我们，见下图：

![image-20240604132722961](http://assest.sablogs.cn/img/typora/image-20240604132722961.png)

如果是代理本机内容，选`127.0.0.1`即可

如果是代理远程设备，除了`127.0.0.1`之外，其他都可以的

### 浏览器代理

#### 场景配置

使用SwitchyOmega插件，可以去chrome或者edge插件市场下载

![image-20240605170447768](http://assest.sablogs.cn/img/typora/image-20240605170447768.png)

下载完成后，我们进入到插件的配置页面

情景模式的作用是可以快速在多个代理服务之间切换，我们可以点击 “新建情景模式” ，新建一个名称为w2的代理

![image-20240606163843373](http://assest.sablogs.cn/img/typora/image-20240606163843373.png)

创建完成后，我们进入w2

我们可以按下图配置，这是因为之前使用`w2 start`命令启动代理服务器的时候，控制台打印的端口是8899，所以具体情况需要根据实际的控制台输出配置

![image-20240606163945818](http://assest.sablogs.cn/img/typora/image-20240606163945818.png)

配置完成后我们通过菜单栏，切换到w2即可

![image-20240606164246636](http://assest.sablogs.cn/img/typora/image-20240606164246636.png)

现在，我们去访问google或其他任意网站，就能在whistle控制台中看到日志了

![image-20240606164401840](http://assest.sablogs.cn/img/typora/image-20240606164401840.png)

这就说明浏览器的代理生效了

### 全局代理

Windows: 菜单 > 设置 > 网络和Internet > 代理 （win11系统建议在开始里直接搜代理二字）

代理ip和端口取自上文 `w2 start` 时的控制台输出

![image-20240604133204790](http://assest.sablogs.cn/img/typora/image-20240604133204790.png)

### 手机代理

手机代理不细说了，网上很多

## 安装https证书

> 相关文档：[Https · GitBook (wproxy.org)](https://wproxy.org/whistle/webui/https.html)

关闭防火墙或者给whsitle设置了白名单之后，如果whistle的设置页面可以正常打开，这表示说我们可以代理http请求了。

这时，我们需要安装证书来捕获https请求

![Https](http://assest.sablogs.cn/img/typora/83850712-e384cc80-a743-11ea-9cf4-c5c3f4cbf0c8.png)

## 常见配置策略

在前端开发场景中，经常需要通过代理规避掉浏览器的**同源策略**，较为场景的是如下两种方式

- 通过webpack or vite 等构建工具实现（多个代理规则的时候配置起来较为繁琐，展示也不直观）
- 通过修改hosts文件的方式实现（修改麻烦，影响是计算机全局的）

这是Whistle + SwitchyOmega的好处就体现出来了，通过规则配置，可以实现不同项目不同规则，可以直观的显示，而且便于管理

### 配置方式

1. 默认方式

   默认是将匹配模式写在左边，操作uri写在右边

   ```
    pattern operatorURI
   ```

   whistle将请求url与pattern匹配，如果匹配到就执行operatorURI对应的操作

2. 传统方式

   传统方式指的是传统的hosts配置方式，操作URI写在左边

   ```
    operatorURI pattern
   ```

   如果pattern为路径或域名，且operatorURI为域名或路径

   ```
    www.test.com www.example.com/index.html
    http://www.test.com www.example.com/index.html
   ```

   这种情况下无法区分pattern和operatorURI，whistle不支持这种传统的方式，只支持默认方式

3. 组合方式

   传统hosts的配置对多个域名对于同一个ip可以采用这种方式：

   ```
    127.0.0.1  www.test1.com www.test2.com www.testN.com
   ```

   whistle完全兼容传统hosts配置方式，且支持更多的组合方式：

   ```
    # 传统组合方式
    pattern operatorURI1 operatorURI2 operatorURIN
   
    # 如果pattern部分为路径或域名，且operatorURI为域名或路径
    # 这种情况下也支持一个操作对应多个pattern
    operatorURI pattern1 pattern2 patternN
   ```

### 场景

接下来用一个简单场景合一个复杂场景举例子

#### 简单场景

我想通过访问 www.baidu.com 进入 google站点，那么只需要如下配置

左边配置你需要代理的`域名`或者`ip:端口号`，右边输入目标`域名`或者`ip:端口号`，用空格隔开

![image-20240606165600388](http://assest.sablogs.cn/img/typora/image-20240606165600388.png)

这样就实现了通过www.baidu.com 进入 google，如下图

![image-20240606165725013](http://assest.sablogs.cn/img/typora/image-20240606165725013.png)

#### 复杂场景

![image-20240607103811359](http://assest.sablogs.cn/img/typora/image-20240607103811359.png)

在项目较多的时候，可以将前后端的规则都写到一起，配置规则更直观

这样做的好处是，在本地开发的时候，不需要修改URL，直接通过浏览器插件就可以实现线上和本地环境的切换了，很方便

> excludeFilter和includeFilter是作为二级条件，用来过滤匹配已匹配的规则：
>
> - excludeFilter：表示排除匹配的请求
>
> - includeFilter：只保留匹配的请求

### 配置跟随项目

同时，我们可以将配置文件添加到项目中，方便其他的开发成员配置

只需要在项目根目录添加 `.whistle.js` 文件，如

```js
const pkg = require('./package.json');

exports.groupName = '项目开发环境'; // 可选，设置分组， 要求 Whistle 版本 >= v2.9.21
exports.name = `[${pkg.name}]本地环境配置`;
exports.rules = `
test.example.com http://127.0.0.1:5566
# cgi走现网
test.example.com/cgi-bin ignore://http
`;
```

> 如果要添加到 [Whistle 客户端](https://github.com/avwo/whistle-client)需要添加参数 `--client`，即：`w2 add --client`

也可以用 `w2 use [filepath]`，通过filepath对应的js文件获取规则配置，filepath可选，默认为当前目录的 `.whistle.js`。

在该目录下支持 `w2 add` (或 `w2 use`)，这时如果本地whistle里面没有同名的规则且不为空，则会自动创建一个并自动启用，如果存在则会提醒：

```
The rule already exists, to override it, you must add CLI option --force.
```

可以通过 `w2 add --force` 强制覆盖当前同名规则。

也可以异步获取规则 `.whistle.js`：

```
const assert = require('assert);
const path = require('path');
const pkg = require('./package.json');

module.exports = (cb, util) => {
  // 如果依赖插件，可以检查插件
  assert(util.existsPlugin('@tnpm/whistle.tianma')
    || util.existsPlugin('whistle.combo'), '请先安装插件npm i -g whisltle.combo');
  // 也可以远程获取规则
  // do sth
  cb({
    name: `[${pkg.name}]本地环境配置`,
    rules:  `
      test.example.com/combo whisle.combo://${path.join(__dirname, 'dev')}
      test.example.com http://127.0.0.1:5566
      # cgi走现网
      test.example.com/cgi-bin ignore://http
      `
  });
};
```

