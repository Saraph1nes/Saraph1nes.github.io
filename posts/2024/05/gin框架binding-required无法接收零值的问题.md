---
title: gin框架binding:"required"无法接收零值的问题
date: 2024-05-13
tags: 
    - Golang
    - Gin
    - 后端开发
    - 问题解决
---

# gin框架binding:"required"无法接收零值的问题

> ✨文章摘要（AI生成）

<!-- DESC SEP -->

本文探讨了 Gin 框架中使用 `binding:"required"` 标签时无法接收零值的问题。由于 Gin 的参数校验基于 validator，当字段被标记为必填时，会拒绝接收零值（如 int 的 0，string 的空串，bool 的 false）。文章提供了一个简单的解决方案：通过将字段类型定义为指针类型来解决这个问题，使得必填字段既能保证参数必传，又能正常接收零值。

<!-- DESC SEP -->


<!-- DESC SEP -->

## 现象

在go中gin框架中，需要接收前端参数时，参数必填，我们一般添加binding:"required"`标签，这样前端参数不给时，gin框架会自动校验，给出error。

gin的参数校验是基于validator的，如果给了required标签，则不能传入零值，比如字符串的不能传入空串，int类型的不能传入0，bool类型的不能传入false。

 有时候我们需要参数必填，而且需要可以传入零值。比如性别sex有0和1表示，0表示女，1表示男，而且需要必填。这个时候，我们可以通过定义int类型的指针解决该问题。同理，其他类型也是定义指针即可。

## 举例

不能接受零值的例子

前端传入参数，id为0，则报error

```go
type SaveArticleAdmin struct {
	ID          int   `form:"id" json:"id" binding:"required"`
	Name        string `form:"name" json:"name" binding:"required"`
	Content     string `form:"content" json:"content" binding:"required"`
	Summary     string `form:"summary" json:"summary"`
	Picture     string `form:"picture" json:"picture"`
	CategoryId  int    `form:"categoryId" json:"categoryId"`
	TagId       int    `form:"tagId" json:"tagId"`
	IsPublished int    `form:"isPublished" json:"isPublished"`
}
```

此时，我们只需要把

```go
ID          int   `form:"id" json:"id" binding:"required"`
```

变为

```go
ID          *int   `form:"id" json:"id" binding:"required"`
```

就可以正常接收了

