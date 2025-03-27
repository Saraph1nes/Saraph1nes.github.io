---
title: 【译】如何使用webpack bundle analyzer
date: 2023-03-17
tags:
  - webpack
  - 构建优化
  - 前端工具
  - 性能分析
  - 模块打包
---

# 【译】如何使用webpack bundle analyzer

<!-- DESC SEP -->

本文深入解析webpack bundle analyzer的可视化分析原理，指导如何通过插件配置生成构建报告，并详解在React、Next.js等框架中的集成方案。文章提供两种配置方式（插件/CLI）实现按需分析，结合具体框架的适配方案，帮助开发者精准定位构建体积问题，实施有效的模块打包优化策略。

<!-- DESC SEP -->


> 原文：https://blog.jakoblind.no/webpack-bundle-analyzer/#what-is-webpack-bundle-analyzer-and-when-do-you-need-it

[webpack bundle analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)是一个重要的工具，可以让你的 webpack bundle 保持小巧。这篇文章描述了如何设置它，以及在生成的报告中需要注意什么。

## 什么是 webpack bundle analyzer

通过[webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)，你可以获得 webpack bundle 中的内容的可视化信息。当你看到你的 bundle 中的内容时，你可以优化它，使其更小。

[![webpack-bundle-analyzer-jakobs-blog.png](http://assest.sablogs.cn/imgs/typora/webpack-bundle-analyzer-jakobs-blog.png)](https://blog.jakoblind.no/static/83c62393938676497462940d1a446f54/0c1ff/webpack-bundle-analyzer-jakobs-blog.png)

首先，我们要把它安装在一个现有的项目上，或者你可以直接跳到，[怎么去查看报告？](#怎么去查看报告？)

## 在项目中配置 webpack bundle analyzer

(你使用的是 React 框架，如 Gatsby、Next 或 CRA，那么[请查看 React 生态下的 Webpack bundle analyzer](#React 生态下的 Webpack bundle analyzer)

有两种方法可以在 webpack 项目中配置 webpack bundle analyzer。要么作为一个插件，要么使用命令行接口。你应该选择哪一种，取决于你的工作流程。

你想在每次构建时都创建一份报告吗？那么你应该使用[插件](#插件配置)

你想要一个单独的命令来按需创建报告吗？那么你应该使用[CLI 方式](#CLI配置)

### 插件配置

我将一步一步地告诉你如何将 webpack bundle analyzer 添加到你现有的项目中。你也可以下载这个完整的配置[在 createapp.dev 上](https://createapp.dev/webpack/react--babel--webpack-bundle-analyzer)

首先，你需要把这个依赖关系安装成一个开发依赖关系。

```text
# NPM
npm install --save-dev webpack-bundle-analyzer
# Yarn
yarn add -D webpack-bundle-analyzer
```

接下来，你将编辑你的`webpack.config.js`。

```jsx
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  // your webpack config is here
  plugins: [new BundleAnalyzerPlugin()],
};
```

每次你运行 webpack，都会在你的输出文件夹中生成一份报告。如果你仔细看一下输出的内容，就会发现报告被放在哪里。

```jsx
$ npm run build-prod

> empty-project@1.0.0 build-prod
> webpack --mode production

Webpack Bundle Analyzer saved report to /Users/jakoblind/dev/test-webpack-bundle-analyzer/dist/report.html
```

在我的示例中，它在`dist/report.html`中。该报告是一个 HTML 文件，你可以在浏览器中打开。

### CLI 配置

根据我的经验，我只想偶尔生成报告。如果我怀疑我的 bundle 太大，因为我最近添加了新的依赖，添加了新的功能，或者做了大的重构，我想分析我的 bundle。所以我想要一个自定义命令，只生成报告。我是这样做的。

有两件事你需要做。首先，生成一个`stats.json`文件。第二，用第一步生成的 stats.json 文件运行`webpack-bundle-analyzer`。

你生成的 stats.json 文件是这样的。

```text
$ npx webpack --profile --json > stats.json
```

我们使用`npx`来运行，它包含在 node 5 及以上版本中。这个命令在命令行中运行一个节点模块。

如果你对你的`stats.json`文件的外观感到好奇，你可以用文本编辑器打开它。里面有很多数据 🙂

接下来，你将用生成的`stats.json`文件运行 webpack-bundle-analyzer。

```text
$ npx webpack-bundle-analyzer ./stats.json
```

记得把路径改成你的 stats.json 文件的路径。

如果你在这里得到一个错误，那么打开`stats.json`文件，确保那里只有 JSON。

例如，如果你得到一个这样的错误。

```text
SyntaxError: Unexpected token W in JSON at position 0
```

这可能意味着你已经将 webpack bundle analyzer 配置为一个插件，并且你的`stats.json`文件以这样的文字开头。`Webpack Bundle Analyzer将报告保存到/Users/jakoblind/dev/test-webpack-bundle-analyzer/dist/report.html`。

在这种情况下，禁用该插件和/或从你的`stats.json`文件中删除上述文本。

你也可以在你的`package.json`文件中把这两个命令作为一个脚本加入，这样你只需要运行一个命令就可以生成报告。编辑你的`package.json`文件并添加以下内容。

```jsx
{
	// ...
  "scripts": {
    "report": "webpack --profile --json > stats.json; webpack-bundle-analyzer ./stats.json",
		// your other scripts here...
  },
}
```

现在你可以用一个命令来生成你的报告。

```jsx
$ npm run report
```

### webpack-bundle-analyzer with Typescript config file

你已经将你的 webpack 配置文件配置为使用 Typescript 了吗？(这意味着如果`webpack.config.ts`文件。注意`ts`扩展名) 那么你也可以为 webpack-bundle-analyzer 安装[types](https://www.npmjs.com/package/@types/webpack-bundle-analyzer)。像这样做。

```text
npm install --save @types/webpack-bundle-analyzer
```

## 你应该分析生产包还是开发包？

分析生产 bundle 包是最有意义的。这是你提供给你的用户的东西。因此，在生产模式下构建和运行 webpack-bundle-analyzer 是至关重要的。要在生产模式下运行 webpack[生产模式](https://blog.jakoblind.no/3-ways-to-reduce-webpack-bundle-size/#easy-run-webpack-in-production-mode)，你要像这样传入`mode`标志

```jsx
webpack --mode production
```

## React 生态下的 Webpack bundle analyzer

你是否使用 React 和[Nextjs](https://nextjs.org/)、[Gatsby](https://www.gatsbyjs.com/)或[create-react-app](https://create-react-app.dev/)等框架来构建你的应用？这些框架在引擎盖下使用 webpack，你可以得到 bundle 的分析。然而，这些工具包的配置看起来与我们之前研究的纯 webpack 配置有些不同。

### nextjs

使用[Nextjs](https://nextjs.org/)，你不能使用 webpack bundle analyzer out of the box。相反，你要使用另一个工具，叫做[next/bundle-analyzer](https://www.npmjs.com/package/@next/bundle-analyzer)

首先，将该依赖关系安装到你的项目中。

```text
# NPM
npm install @next/bundle-analyzer
# Yarn
yarn add @next/bundle-analyzer
```

接下来你要创建一个`next.config.js`文件（如果你已经有了它，只需编辑它），并添加以下内容。

```jsx
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
module.exports = withBundleAnalyzer({});
// if you already have a config here replace {}
// with your config in the line above
```

现在你可以通过在构建前将环境变量`ANALYZE`设置为`true`来生成报告。像这样。

```jsx
ANALYZE=true npm run build
```

当你这样做时，你的报告将自动打开。你会得到两份报告：一份用于服务器端，一份用于客户端。

### gatsby

有两个插件在引擎盖下使用 webpack bundle analyzer。第一个是[gatsby-plugin-webpack-bundle-analyser-v2](https://www.gatsbyjs.com/plugins/gatsby-plugin-webpack-bundle-analyser-v2/)

它的安装很简单。首先，安装依赖项。

```text
# NPM
npm install --save-dev gatsby-plugin-webpack-bundle-analyser-v2
# Yarn
yarn add -D gatsby-plugin-webpack-bundle-analyser-v2
```

然后在`gatsby-config.js`中添加该插件

```jsx
/* gatsby-config.js */

module.exports = {
  plugins: ['gatsby-plugin-webpack-bundle-analyser-v2'],
};
```

现在当你用`gatsby build`创建一个 Gatsby build 时，它会自动在你的浏览器中打开一个报告。

这很好，但它没有给你一个在每个单独页面上被加载的包的列表。然而，下一个插件可以。

让我们来看看另一个名为[gatsby-plugin-perf-budgets](https://www.npmjs.com/package/gatsby-plugin-perf-budgets)的插件，它将给你提供这些详细信息。这是一个实验性的插件，它和我们刚才看的`gatsby-plugin-webpack-bundle-analyser-v2`一起使用。你可以这样安装这两个插件的依赖项。

```text
# NPM
npm install --save-dev gatsby-plugin-webpack-bundle-analyser-v2
npm install --save-dev gatsby-plugin-perf-budgets
# Yarn
yarn add -D gatsby-plugin-webpack-bundle-analyser-v2
yarn add -D gatsby-plugin-perf-budgets
```

然后把它们都添加到`gatsby-config.js`中。

```json
/* gatsby-config.js */

module.exports = {
  plugins: [
    "gatsby-plugin-perf-budgets",
    "gatsby-plugin-webpack-bundle-analyser-v2",
  ],
}
```

现在，当你运行`gatsby build`时，你会得到两个报告。

1. `gatsby-plugin-webpack-bundle-analyser-v2`报告将在你的默认浏览器中自动打开。
2. `gatsby-plugin-perf-budgets`的报告会在你的`public`文件夹中生成，文件名是`_report.html`。

在`_report.html`文件中，你将得到所有生成页面的概览。你可以点击一个页面，只看那个特定页面的可视化信息。相当不错。

### create-react-app

首先，安装 npm 的依赖性

```text
# NPM
npm install --save-dev webpack-bundle-analyzer
# Yarn
yarn add -D webpack-bundle-analyzer
```

然后创建一个新文件`analyze.js`，内容如下

```jsx
const webpack = require('webpack');
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const webpackConfigProd = require('react-scripts/config/webpack.config')(
  'production'
);

webpackConfigProd.plugins.push(new BundleAnalyzerPlugin());

webpack(webpackConfigProd, (err, stats) => {
  if (err || stats.hasErrors()) {
    console.error(err);
  }
});
```

像这样运行它。

```jsx
NODE_ENV=production node analyze.js
```

报告将在你的浏览器中自动打开。

## 怎么去查看报告？

现在我们来看看报告里面有什么。这就是你现在正在阅读的我的博客的报告的样子。

[![webpack-bundle-analyzer-jakobs-blog.png](http://assest.sablogs.cn/imgs/typora/webpack-bundle-analyzer-jakobs-blog.png)](https://blog.jakoblind.no/static/83c62393938676497462940d1a446f54/0c1ff/webpack-bundle-analyzer-jakobs-blog.png)

生成的每个 JS 文件都有自己的大盒子，有独特的颜色。这就是代表我博客中的框架文件的盒子。

[![webpack-bundle-analyzer-framework.png](http://assest.sablogs.cn/imgs/typora/webpack-bundle-analyzer-framework.png)](https://blog.jakoblind.no/static/fee6bf3a929b5647a198802425ecd846/302a4/webpack-bundle-analyzer-framework.png)

盒子的大小与 JS 文件的大小相对应。在我的博客上，我们在上面看到的框架文件是最大的 bundle。

我写的代码在右下方的小蓝框中。其他的都是依赖关系和对依赖关系的依赖。这意味着我的 bundle 文件中最重要的部分是依赖关系，而且那里有最大的改进空间。

如果你把鼠标悬停在一个盒子上，你会看到确切的尺寸（也是 gzipped）。

[![webpack-bundle-analyzer-details.png](http://assest.sablogs.cn/imgs/typora/webpack-bundle-analyzer-details.png)](https://blog.jakoblind.no/static/e449860303c4f180e3cfd03d990492a5/889a4/webpack-bundle-analyzer-details.png)

在每个较大的盒子里，都有较小的盒子。每一个都代表模块。你也可以将鼠标悬停在单个模块上，以获得它们的尺寸。

你可以用滚轮进行放大和缩小。你也可以点击一个盒子来放大它。

现在你知道了报告中的内容和如何浏览报告，让我们看看你能用这些信息做什么。

### 你是否看到了一些大的库？它们可能是树状可动摇的，例如 lodash

如果你在其中看到了一些大型的库，看看它们是否是[可 tree-shaking 的](https://webpack.js.org/guides/tree-shaking/)。

其中一个常见的例子就是 lodash。通过树状摇动，你不必 bundle 整个库，而只需 bundle 你使用的部分。

如果你包含 lodash 而不进行树形摇动，它就是这样的。

![webpack-bundle-analyzer-lodash.png](http://assest.sablogs.cn/imgs/typora/webpack-bundle-analyzer-lodash.png)

有时你可以在 webpack bundle 分析器中看到 lodash，但你的`package.json`文件中却没有 lodash。这时该怎么办呢？那么很可能是你的某个依赖项将 lodash 作为一个依赖项。在这种情况下，你可以做的是找到哪个依赖项有 lodash 作为依赖。你可以看一下`package-lock.json`。在那里你会看到你项目的每个依赖关系的详细报告。

当你确定了可优化的依赖关系后，不幸的是你能做的并不多。你可以考虑停止使用它，用别的东西代替它。或者给他们发一个 PR，改善 lodash 的使用。

### 你是否依赖已废弃的 libs（例如 moment？）

减少软件包大小的最好方法是你能完全删除某些东西。如果你在报告中看到 momentjs，那么这可能是可行的。团队[不鼓励](https://momentjs.com/docs/#/-project-status/)在新项目中使用 Momentjs，他们已经停止为其开发新功能。相反，他们有一些[建议](https://momentjs.com/docs/#/-project-status/recommendations/)。**而对你的 bundle 影响最小的建议是根本不使用库**。这在现代 JavaScript 中是完全可能的。请在[你可能不再需要 Moment.js 了](https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore)这篇文章中阅读更多信息。

可能还有类似的情况。也许你在一些非常简单的事情上使用了重度依赖，你可以自己编码？

### 你在报告中看到一些大的 bundle 吗？

Webpack 建议，一个 bundle 包应该是最大的 250kb，没有经过删减。如果你看到比这更大的包，请使用[代码分割](https://blog.jakoblind.no/how-code-splitting-increases-performance/)将它们分割开来，也许可以懒惰地加载其中一些包。

### 你是否看到任何重复的内容？

你是否在许多 bundle 物中看到[代码重复](https://twitter.com/SiAdcock/status/842826384724709377/photo/1)？也许你可以考虑将这些代码拆分到它自己的包里。
