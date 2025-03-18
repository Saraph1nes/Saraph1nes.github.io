# @babel/preset-react

## 插件

这个预设包含以下插件：

#### @babel/plugin-syntax-jsx

- **功能：** 这个插件主要用于告诉Babel解析器去识别和理解JSX语法。JSX是一种类似XML的语法扩展，用于描述React元素的结构。这个插件确保Babel能够正确地解析JSX代码，而不会因为不认识JSX而报错。

#### @babel/plugin-transform-react-jsx

- **功能：** 这个插件用于将JSX语法转换为普通的JavaScript函数调用。它会将JSX元素转换为`React.createElement`
  函数的调用，从而实现虚拟DOM的创建。例如，将`<div>Hello, World!</div>`转换为
  `React.createElement('div', null, 'Hello, World!')`。

#### @babel/plugin-transform-react-display-name

- **功能：** 这个插件用于在转换过程中自动添加React组件的`displayName`。`displayName`
  是一个React组件的可选属性，用于调试和在开发者工具中更好地显示组件的名称。这个插件可以确保在转换JSX时，自动为生成的组件添加合适的
  `displayName`。

当启用 `development` 配置时，还会使用以下插件

#### @babel/plugin-transform-react-jsx-self

- **功能：** 该插件用于转换 JSX 元素，并在转换后的代码中添加 `__self` 属性。这个属性的目的是标识 JSX
  元素在源代码中的位置。通常，这对于在开发过程中定位错误或警告的源位置很有用。例如，转换前的 JSX 代码可能是
  `<div>Hello, World!</div>`，而转换后可能是 `React.createElement('div', { __self: this }, 'Hello, World!')`。

#### @babel/plugin-transform-react-jsx-source

- **功能：** 类似于 `@babel/plugin-transform-react-jsx-self`，该插件用于转换 JSX 元素，并在转换后的代码中添加 `__source`
  属性。这个属性包含了一个包含源代码位置信息的对象，其中包括文件名、行数和列数。这对于在开发者工具中追踪 React
  元素的来源位置非常有用。例如，转换前的 JSX 代码可能是 `<div>Hello, World!</div>`，而转换后可能是
  `React.createElement('div', { __self: this, __source: { fileName: 'your-file.js', lineNumber: 5, columnNumber: 10 } }, 'Hello, World!')`。

这两个插件通常与其他 JSX 转换插件一起使用，以便在开发环境中提供更好的源代码调试支持。

在生产环境中，通常会省略这些额外的属性，以减小代码体积。

## 安装

```bash
npm install --save-dev @babel/preset-react
```

## 用法

### 通过配置文件使用（推荐）

不带参数：

```json
// babel.config.json
{
  "presets": ["@babel/preset-react"]
}
```

带参数：

```json
// babel.config.json
{
  "presets": [
    [
      "@babel/preset-react",
      {
        "pragma": "dom", // 默认是 React.createElement（仅在经典的运行时中）
        "pragmaFrag": "DomFrag", // 默认是 React.Fragment（仅在经典的运行时中）
        "throwIfNamespace": false, // 默认是 true
        "runtime": "classic" // 默认是 classic
        // "importSource": "custom-jsx-library" // 默认是 react（仅在经典的运行时中）
      }
    ]
  ]
}
```

### 通过命令行工具使用（CLI）

```shell
babel --presets @babel/preset-react script.js
```

### 通过 Node API 使用

```js
require("@babel/core").transformSync("code", {
  presets: ["@babel/preset-react"],
});
```

## 总结

在典型的React项目中，你通常不需要手动添加`@babel/preset-react`，因为它通常是React项目的默认预设之一。

如果你使用了著名的React脚手架工具，比如Create React App，它已经默认包含了`@babel/preset-react`，并在其内部的Babel配置中进行了设置。

在使用Create React App的情况下，你不需要手动添加`@babel/preset-react`。它已经被配置在`react-scripts`
中。你只需关注你的应用代码而不是底层的Babel配置。

如果你在搭建自定义的React项目，需要手动配置Babel，可以在Babel配置文件（通常是`.babelrc`或`babel.config.js`）中手动添加
`@babel/preset-react`。例如：

