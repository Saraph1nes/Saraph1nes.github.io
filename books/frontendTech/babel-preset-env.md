# @babel/preset-env

`babel/preset-env`是一个智能预设，让你轻松使用最新的JavaScript语法，无需烦恼目标环境兼容性，同时保持代码包的小巧精悍。

## 安装

### npm

```bash
npm install --save-dev @babel/preset-env
```

### yarn

```bash
yarn add --dev @babel/preset-env
```

## 它是如何工作的？

基于一些开源项目，利用这些数据确定支持的目标环境对于JavaScript语法和浏览器功能的兼容性

以下是一些开源项目说明

- [browserslist](https://github.com/browserslist/browserslist)
    - `browserslist` 用于配置目标浏览器和 Node.js 版本，它在前端开发中广泛用于确定项目中需要支持的浏览器范围。
    - 这个配置可以用于各种工具，比如自动化构建工具、样式预处理器等，以便根据指定的目标浏览器，进行相应的代码转换和优化。这有助于确保生成的代码在目标浏览器中具有良好的兼容性，并减少不必要的转换和填充，从而提高项目的性能和效率。
- [compat-table](https://github.com/compat-table/compat-table)
    - `compat-table`
      指的是Web开发中的兼容性表格，其中包含了不同浏览器对于各种Web标准和API的支持程度的详细信息。这类表格对开发者来说非常有用，因为它们提供了一种方式来了解不同浏览器在执行JavaScript、CSS、HTML等方面的差异。
    - 这样的兼容性表格通常展示了标准特性在不同浏览器中的支持程度，可能分为不同的版本。开发者可以查看这些表格，以确保他们的Web应用在主要浏览器中都能够正常运行，或者了解在某个特定浏览器版本中是否存在潜在的问题。
- [electron-to-chromium](https://github.com/Kilian/electron-to-chromium)
    - `electron-to-chromium` 用于帮助 Electron 开发者追踪和了解 Electron 版本所基于的 Chromium 版本。这可用于更好地理解和解决在
      Electron 应用程序中可能出现的特定问题，因为 Electron 是建立在 Chromium 上的。通过查看 `electron-to-chromium`
      ，开发者可以获取有关 Chromium 版本的信息，以更好地管理其应用程序的特性和问题。

> 注意
>
> `@babel/preset-env`不会包含任何低于第 3 阶段的 JavaScript 语法建议，因为在 TC39
> 流程的那个阶段，它无论如何都不会被任何浏览器实现。这些需要手动包括在内。该选项将包括某些浏览器已经实现的第 3
> 阶段提案。shippedProposals
>
> **阶段说明：**
>
> 1. **Stage 0 - Strawman（稻草人）:**
     >    - 初步的概念提案，尚未形成正式规范。
     >
- 这个阶段的提案通常只是一些初步的想法，可能会在后续阶段发生较大改变。
> 2. **Stage 1 - Proposal（提案）:**
     >    - 提案已经成为正式的 ECMAScript 提案。
     >
- 提案者需要提交详细的规范和示例，以便讨论和评审。
> 3. **Stage 2 - Draft（草案）:**
     >    - 规范文档更加完善，包括语法细节、语义和示例。
     >
- 此阶段通常需要实验性实现的反馈。
> 4. **Stage 3 - Candidate（候选）:**
     >    - 提案基本完成，规范进入终审阶段。
     >
- 在此阶段，不再对语法和功能进行重大更改，主要进行性能优化和细节调整。
> 5. **Stage 4 - Finished（完成）:**
     >    - 提案被接受为 ECMAScript 规范的一部分。
     >
- 它可以被浏览器和其他 JavaScript 环境广泛实现和使用。

## 使用

### 安装 Babel 及相关插件

请确保已经有 `package.json` 文件

```bash
npm install --save-dev @babel/core @babel/preset-env
```

### 配置 Babel

在你的项目根目录创建一个 `.babelrc` 文件，或者在 `package.json` 中的 `babel` 字段中进行配置。

使用 `.babelrc` 文件的例子

```json
{
  "presets": ["@babel/preset-env"]
}
```

或者在 `package.json`

```json
{
  "babel": {
    "presets": ["@babel/preset-env"]
  }
}
```

你也可以在配置中指定目标环境的浏览器或 Node.js 版本。例如：

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "browsers": ["last 2 versions", "ie >= 11"]
        }
      }
    ]
  ]
}
```

- `"last 2 versions"`: 这表示支持最新的两个版本的所有浏览器。
- `"ie >= 11"`: 这表示支持 Internet Explorer 版本大于等于 11 的所有版本。

在这个例子中，Babel 将根据 "last 2 versions" 和 "ie >= 11" 来转译代码，确保兼容这些浏览器。

### 使用 Babel

在你的构建脚本或其他地方使用 Babel 进行转译。例如，你可以在 `package.json` 的 `scripts` 中添加一个命令：

```json
{
  "scripts": {
    "build": "babel src -d dist"
  }
}
```

这个命令将会把 `src` 目录下的代码转译并输出到 `dist` 目录。

`babel-preset-env` 会自动根据你指定的目标环境选择合适的 Babel 插件，因此你不需要手动管理它们。

