# Rust基础语法 

> 官网：https://www.rust-lang.org/zh-CN/learn/get-started

官网提供了两种方式学习

- [官方示例文档](https://doc.rust-lang.org/rust-by-example/hello/comment.html)
  - 适合有一定基础的开发者
- [官方中文文档](https://kaisery.github.io/trpl-zh-cn/)
  - 适合初学者

因为学习时我已经有4年的前端开发经验，又想快速上手，所以选择[官方示例文档](https://doc.rust-lang.org/rust-by-example/hello/comment.html)。

## 第一个Rust程序

```rust
// 这是一个注释，会被编译器忽略。
// 这是主函数。
fn main() {
    // 当编译后的二进制文件被调用时，这里的语句会被执行。
    // 向控制台打印文本。
    println!("Hello World!");
}
```

通过 `rustc hello.rs` 命令编译，生成可执行文件 `hello`，然后运行 `./hello` 即可看到输出。

## 注释/评论

Rust支持几种不同类型的注释：

### 常规注释（被编译器忽略）

```rust
// 行注释，从双斜杠开始到行尾结束

/* 块注释，从 /* 开始到结束分隔符 */ 为止。
   可以跨越多行 */
```

### 文档注释（会被解析为HTML库文档）

```rust
/// 为接下来的项生成库文档
/// 通常用于函数、结构体、枚举等前面
/// 支持Markdown格式

//! 为包含此注释的项生成库文档
//! 通常用于模块或整个文件的开头
//! 也支持Markdown格式
```

文档注释特别有用，因为它们可以使用 `cargo doc` 命令生成HTML文档。这些文档可以解释API的用法、提供示例，并使代码更易于理解。

