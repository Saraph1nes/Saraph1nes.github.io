---
title: Typora + PicGo上传图片到七牛云
date: 2024-02-19
tags:
  - Typora
  - PicGo
  - 七牛云
  - Markdown
  - 图床配置
---

# Typora + PicGo上传图片到七牛云

<!-- DESC SEP -->

Typora通过PicGo-Core实现自动化图床上传，采用七牛云存储方案。核心配置包含accessKey/secretKey密钥对认证、bucket存储空间指定、CDN域名绑定及区域代码设置，通过JSON配置文件实现多平台参数预设。工作流程实现本地Markdown编辑与云端图片存储无缝衔接，支持批量上传和版本管理。

<!-- DESC SEP -->

## 安装 Typora 

Typora 是一款强大的 Markdown 编辑器，您可以从官方网站 [Typora](https://typora.io/) 下载并安装。

## 配置 PicGo

1. 打开 Typora，点击顶部菜单栏中的【偏好设置】。

2. 在【偏好设置】中，选择【图像】选项卡。

3. 在【插入图片时..】选择上传图片，如下图第1步

4. 上传服务选择`PicGo-Core`，如下图第2步

5. 点击`下载或更新`，如下图第3步

   - 如果下载失败可以采用以下方法：
     - 使用命令`npm install picgo -g`（此操作需要node环境）

6. 点击`打开配置文件`，配置参考下方[完整配置](#完整配置)，如下图第4步

   - 完成配置后保存

   - 如果无法正常打开，`windows`环境可以直接去路径`C:\Users\[你的用户名]\.picgo\config.json`中修改`config.json`文件

7. 最后一步，点击`验证图片上传选项`，typora会上传默认图片，成功则完成配置，如下图第5步

![image-20240219150631681](http://assest.sablogs.cn/img/typora/typoraimage-20240219150631681.png)

## 完整配置

配置说明如下

- accessKey ：七牛云的accessKey
- secretKey：七牛云的secretKey
- bucket：七牛云的bucket
- url：七牛云仓库配置的域名
- area：区域对应的值参考 [存储区域](https://developer.qiniu.com/kodo/1671/region-endpoint-fq)
- options：上传的可选配置项（一般不填）
- path：图片上传的路径（从配置bucket的根路径开始）

![image-20240219152018392](http://assest.sablogs.cn/img/typora/image-20240219152018392.png)

```json
{
  "picBed": {
    "uploader": "qiniu",
    "qiniu": {
      "accessKey": "", // 七牛云的accessKey
      "secretKey": "", // 七牛云的secretKey
      "bucket": "", // 七牛云的bucket
      "url": "", // 七牛云仓库配置的域名
      "area": "z2", // 存储区域
      "options": "", // 可选配置项
      "path": "img/typora/" // 图片上传的路径
    }
  },
  "picgoPlugins": {}
}
```



