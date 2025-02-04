# Babel简介

## 什么是 Babel？

Babel 是一个工具链，主要用于在当前和旧的浏览器或环境中，将 ECMAScript 2015+ 代码转换为 JavaScript 向后兼容版本的代码

常用功能是以下几点

- 语法转换：转换 JSX 语法，以支持React、Vue等框架等等
- Polyfill 垫片：目标环境中缺少的 Polyfill 功能（通过第三方 polyfill，例如 [core-js）](https://github.com/zloirock/core-js))
- 源代码转换：Babel 通过语法转换(syntax transformer)支持最新版本的 JavaScript，而无需等待浏览器的支持

## preset 与 plugin

### Presets

- **作用：** Presets 是一组预定义的 Babel 插件集合，用于简化配置。它们旨在为特定的转换场景提供一组默认的插件，以便用户不必手动添加一系列插件来完成特定的转换任务。
- **示例：** `@babel/preset-env` 是一个常见的预设，它根据目标环境自动确定需要的插件，实现对 ECMAScript
  新特性的转换。使用预设的配置可以像下面这样简化：

```js
{
  "presets": ["@babel/preset-env"]
}
```

### Plugins

- **作用：** Plugins 是 Babel 转换过程中的实际转换器。每个插件通常执行一个具体的转换任务，例如将箭头函数转换为普通函数，或者将新的语法转换为旧版本的
  JavaScript。
- **示例：** 一个使用插件的配置可能看起来像下面这样：

```js
{
  "plugins": ["@babel/plugin-transform-arrow-functions"]
}
```

| 特性       | 插件                                                       | 预设                                         |
|----------|----------------------------------------------------------|--------------------------------------------|
| **定义**   | 插件是单个的 Babel 转换器，负责执行具体的转换任务。                            | 预设是插件的集合，提供一种简化配置的方式，通常为特定的转换场景提供默认的插件集。   |
| **简化配置** | 需要手动添加和配置每个插件，可能会显得繁琐。                                   | 内部包含已经配置好的一组插件，用户无需手动添加和配置，提供了更简便的配置方式。    |
| **目标场景** | 更具体，执行单一的转换任务，适用于特定的语法或功能。                               | 用于处理特定场景，例如处理不同版本的 ECMAScript 或其他预定义的转换需求。 |
| **示例**   | `"plugins": ["@babel/plugin-transform-arrow-functions"]` | `"presets": ["@babel/preset-env"]`         |
| **用途**   | 用于处理单一或特定的转换需求，手动配置。                                     | 提供一套默认配置，用于简化和统一处理特定场景的转换需求。               |

### 插件排序

- 插件在预设之前运行
- 插件排序是从第一个到最后一个。
- **预设顺序是颠倒的（最后一个到第一个）**

```json
{
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
}

// 将先运行 transform-decorators-legacy 再运行 transform-class-properties
```

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}

// 先 @babel/preset-react 再 @babel/preset-env
```

## Flow 和 TypeScript

Flow 和 TypeScript 是两种不同的静态类型检查工具，它们用于 JavaScript 代码。

浏览器只能执行原生的 JavaScript 代码，所以想要在浏览器中运行Flow 和 TypeScript ，需要使用babel处理

### Flow

@babel/preset-flow 支持将flow语法转换成js

```js
// @flow
function square(n: number): number {
  return n * n;
}
```

### TS

@babel/preset-typescript 支持将ts转换成js

```ts
function Greeter(greeting: string) {
  this.greeting = greeting;
}
```

### @babel/preset-typescript 与 tsc

#### tsc

TypeScript 编译器 `tsc` 用于将 TypeScript 代码编译为 JavaScript

这个过程涉及**类型检查、模块解析**等

- **类型检查：** 与 Babel 不同，`tsc` 不仅仅是一个转译工具，它还执行 TypeScript 代码的类型检查。它可以在开发阶段发现潜在的类型错误。
- **模块解析：** 处理 TypeScript 的模块系统，并将其转换为符合 CommonJS、AMD、ES6 等标准的 JavaScript 模块。

#### @babel/preset-typescript

这是 Babel 的一个预设，用于将 TypeScript 代码转换为可在浏览器中运行的 JavaScript 代码

主要关注**语法转换、类型移除**

- **语法转换：** 主要负责处理 TypeScript 的语法，将其转换为标准的 JavaScript 语法。
- **类型移除：** `@babel/preset-typescript` 会移除 TypeScript 的类型注解，以生成纯 JavaScript 代码

|          | @babel/preset-typescript                             | tsc (TypeScript Compiler)                    |
|----------|------------------------------------------------------|----------------------------------------------|
| **作用**   | Babel 的预设，将 TypeScript 代码转换为浏览器可运行的 JavaScript 代码    | TypeScript 编译器，将 TypeScript 代码编译为 JavaScript |
| **语法转换** | 主要负责处理 TypeScript 的语法，将其转换为标准的 JavaScript 语法         | 执行语法转换，将 TypeScript 代码转换为 JavaScript         |
| **类型移除** | 通常与 Babel 一起使用，移除 TypeScript 的类型注解，生成纯 JavaScript 代码 | 执行 TypeScript 代码的类型检查，但不移除类型注解               |
| **使用方法** | 在 Babel 配置文件中配置该预设，例如 `.babelrc` 或 `babel.config.js` | 在终端中运行 `tsc` 命令，读取 `tsconfig.json` 配置文件      |
| **类型检查** | 主要关注语法转换和类型移除，类型检查相对较弱                               | 提供强大的类型检查，能在编译时发现潜在的类型错误                     |
| **模块解析** | 不涉及模块解析，依赖于 Babel 的模块解析能力                            | 处理 TypeScript 的模块系统，并将其转换为标准的 JavaScript 模块  |

### Flow 和 TS 区别

|               | TypeScript                                          | Flow                                                        |
|---------------|-----------------------------------------------------|-------------------------------------------------------------|
| **开发方**       | 由 Microsoft 开发和维护，开源项目，得到广泛支持                       | 由 Facebook 开发和维护，最初为解决 Facebook 内部 JavaScript 代码复杂性而创建，开源项目 |
| **语言设计**      | JavaScript 的超集，添加了静态类型、接口、枚举等                       | 静态类型检查器，设计为 JavaScript 的静态类型检查，使用注释语法                       |
| **类型注解语法**    | 类似其他静态类型语言，可选的类型注解，支持类型推断                           | 使用注释语法，以 /* ... */ 或 // 开头，类型注解也是可选的，支持类型推断                 |
| **生态系统和工具支持** | 强大的生态系统，广泛支持于编辑器（如 Visual Studio Code），大量库和框架提供类型定义 | 相对较小的生态系统，一些编辑器支持，但可能相较于 TypeScript 有限                      |
| **响应式设计**     | 强调在大型项目中提供更好的响应式支持                                  | 在大型项目中提供良好的类型检查，但可能不如 TypeScript 强调响应式设计                    |

