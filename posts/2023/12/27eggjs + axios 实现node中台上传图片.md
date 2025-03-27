---
title: eggjs + axios 实现node中台上传图片
date: 2023-12-27
tags:
  - Node.js
  - eggjs
  - 文件上传
  - Axios
  - 中间件
---

# eggjs + axios 实现node中台上传图片

<!-- DESC SEP -->

本文详细介绍了基于eggjs框架实现图片上传中台服务的完整技术方案。客户端部分使用axios配合FormData实现多文件上传，封装了超时机制和统一请求头配置；服务端通过ctx.request.files接收上传文件流，结合fs模块读取文件内容，通过form-data库二次封装请求实现文件转发。

<!-- DESC SEP -->

## 依赖

- axios
- fs
- form-data

## 代码示例

### 客户端代码

客户端使用`antd-mobile`的`ImageUploader`

#### http.js

```js
/**
 * 将本地资源上传到服务器
 */
export const uploadFile = async (options) => {
  const { url, head = {}, files = [] } = options
  const header = { ...head }
  header['Source'] = 'h5'
  header['serviceType'] = 'miniVip'
  header['Content-Type'] = `multipart/form-data`
  
  // FormData
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('file', file)
  })

  const res = await axios.post(url, formData, {
    headers: header,
    timeout: 1000 * 10, // 设置超时时间为10秒钟
  })

  return res.data
}
```

#### index.jsx

```jsx
<ImageUploader
    // ...
    upload={async (file) => {
        const { Result, Success } = await uploadFile({
            url: `${api.API_HOST_CENTRE}Cms/UpLoad/UpLoadImg`,
            files: [file],
            name: 'file',
        })
        if (Success) {
            return {
                url: Result.FileStoreFullUrl,
                // url: URL.createObjectURL(file),
            }
        } else {
            return {
                url: '',
            }
        }
    }}
    // ...
</ImageUploader>
```

### 服务端代码

```js
private async apiImgUpload() {
    const {ctx} = this;
    const {servicetype} = ctx.request.header;
    // 根据客户端request header的servicetype获取配置域名
    const serviceData = find(this.app.config.serverHost, v => v.type === servicetype);
    const serviceHost = serviceData ? serviceData.name : this.app.config.gatewayDomain;
    try {
        // console.log('ctx.request.files', ctx.request.files)
        // console.log('got %d files', ctx.request.files.length);
        const file = ctx.request.files[0];
        const data = fs.readFileSync(file.filepath)
        // console.log('filename: ' + file.filename);
        // console.log('encoding: ' + file.encoding);
        // console.log('mime: ' + file.mime);
        // console.log('tmp filepath: ' + file.filepath);
        const formData = new FormData();
        formData.append('file', data, {
            filename: file.filename,
            contentType: file.mime,
        });
        const res = await axios.request({
            method: "POST",
            url: `${serviceHost}${ctx.request.url.replace('/api', '')}`,
            data: formData,
            headers: {
                ...formData.getHeaders(),
                'Source': 'h5',
                'ezr-brand-id': ctx.session.brandId,
                'Accept': 'application/json, text/plain, */*'
            }
        });
        console.log('============ apiImgUpload success ============', res.data);
        this.ctx.body = res.data;
    } catch (error: any) {
        console.log('============ apiImgUpload error ============', error);
        if (error && error.response) {
            if (error.response.status === 404) {
                this.ctx.helper.errorBody(404, '接口不存在');
            } else {
                if (error.response.data) {
                    this.ctx.body = error.response.data;
                } else {
                    this.ctx.helper.errorBody(500, '接口错误');
                }
            }
        } else {
            this.ctx.helper.errorBody(500, '服务处理错误');
        }
    } finally {
        // 需要删除临时文件
        await ctx.cleanupRequestFiles();
    }
}
```

## multipart/form-data

`multipart/form-data` 是一种在HTTP协议中用于在客户端和服务器之间传输二进制数据的一种编码方式。

通常情况下，它用于通过HTTP POST请求上传文件或提交包含文件上传的表单数据。

当使用 `multipart/form-data` 编码时，数据会被分割成多个部分，每个部分都有自己的头部信息，用于描述数据的类型、长度等信息。每个部分之间用一定的分隔符分隔开来。

这种编码方式允许传输不同类型的数据，包括文本和二进制文件，而不会对它们进行编码转换。这对于上传文件非常重要，因为文件可能包含任意类型的数据，包括图片、视频、文档等。

使用 `multipart/form-data` 编码的请求通常用于以下情况：

1. 文件上传：用户通过表单上传文件到服务器。
2. 包含二进制数据的表单提交：除了文件上传外，还可以包含其他类型的二进制数据，例如图像的二进制数据。

在HTTP请求的头部中，`Content-Type` 字段会被设置为 `multipart/form-data`，同时包含一个 boundary 参数，该参数指定了每个部分之间的分隔符。示例：

```
cssCopy code
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryABC123
```

在每个部分的头部中，也会包含一些额外的信息，例如 `Content-Disposition` 字段，用于描述数据的类型和可能的其他属性。

## Boundary

`boundary` 是在 `multipart/form-data` 编码中用于分隔不同部分的标识符，在HTTP请求头的 `Content-Type` 字段中指定。

它的作用是定义每个部分（例如上传的文件或表单数据）的起始和结束位置。

在实际数据传输中，每个部分都以 `--boundary` 开始，整个请求以 `--boundary--` 结束，这样设计确保了服务器能够准确解析和处理每个部分。

`boundary`的值应该是唯一的，以避免与实际数据冲突。

## eggjs中文件的接收与上传

> 参考链接：https://eggjs.github.io/zh/guide/upload.html

nodejs中，处理文件一般使用`Stream`，`eggjs`提供了`Stream`和`File`两种模式，使用`File`模式需要添加`eggjs`配置，参考文档

![image-20231227171900256](http://assest.sablogs.cn/imgs/typora/image-20231227171900256.png)

代码示例中，通过`ctx.request.files`，获取文件列表，通过`fs.readFileSync`，将文件资源存储到`node`服务器内存中

```js
const file = ctx.request.files[0];
const data = fs.readFileSync(file.filepath)
```

然后通过`new FormData()`，以表单数据进行文件上传

```js
const formData = new FormData();
formData.append('file', data, {
    filename: file.filename,
    contentType: file.mime,
});
const res = await axios.request({
    method: "POST",
    url: `${serviceHost}${ctx.request.url.replace('/api', '')}`,
    data: formData,
    headers: {
        ...formData.getHeaders(),
        'Source': 'h5',
        'ezr-brand-id': ctx.session.brandId,
        'Accept': 'application/json, text/plain, */*'
    }
});
```

## form-data库

在http协议中使用form提交文件时需要将form标签的method属性设置为post，enctype属性设置为multipart/form-data，并且有至少一个input的type属性为file时，浏览器提交这个form时会在请求头部的Content-Type中自动添加boundary属性。

一般来说，`boundary`不需要手动维护，除非有特殊需要

不同浏览器处理`boundary`的逻辑是不一样的，比如`form-data`库中，通过`formData.getHeaders()`，可以使用库提供的header方法，源码如下

```js
FormData.prototype.getHeaders = function(userHeaders) {
  var header;
  var formHeaders = {
    'content-type': 'multipart/form-data; boundary=' + this.getBoundary()
  };

  for (header in userHeaders) {
    if (userHeaders.hasOwnProperty(header)) {
      formHeaders[header.toLowerCase()] = userHeaders[header];
    }
  }

  return formHeaders;
};

FormData.prototype.getBoundary = function() {
  if (!this._boundary) {
    this._generateBoundary();
  }

  return this._boundary;
};

FormData.prototype._generateBoundary = function() {
 //生成50个字符的边界，类似于Firefox使用的边界，它们针对boyer-moore解析进行了优化。
  var boundary = '--------------------------';
  for (var i = 0; i < 24; i++) {
    boundary += Math.floor(Math.random() * 10).toString(16);
  }

  this._boundary = boundary;
};
```

