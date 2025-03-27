---
title: 博客后台应用的CI/CD
date: 2024-01-12
tags:
  - CI/CD
  - GitHub Actions
  - 自动化部署
  - 服务器运维
  - 持续集成
---

# 博客后台应用的CI/CD

<!-- DESC SEP -->

本文详细记录了博客后台应用从手动部署到自动化CI/CD的改造过程。通过GitHub Actions实现构建流水线自动化，解决GLIBC版本兼容性问题，完善PM2部署脚本实现服务平滑重启，最终构建完整的持续集成/持续交付工作流。

<!-- DESC SEP -->

目前博客前端部署在`vercel`，后端部署在腾讯云，一直是手动发布的，这次的改造目标是想让后端自动化部署

运维工具PC一直用的`Final Shell`，手机用的`Termius`

这里要推荐一下`Termius`，`Termius`有命令提示功能，在手机端发布很方便，我的手机系统是`IOS`，不知道有没有安卓版本

由于博客有CDN，每次前端发布后还需要手动去刷新资源，比较繁琐，也是想改造的点，这个后面再修改，话不多说，正文开始

## 环境

- 服务器环境
  - 腾讯云
  - OpenCloudOS 8.6

## CI / CD

我的想法是，在`github action`构建完成，把产物上传到服务器，然后部署

那么首先需要配置 `github workflows`，以下是我的配置

```yaml
# This workflow will build a golang project
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-go

name: Go

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:

  build_job:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout    
      uses: actions/checkout@v3
    - name: set up Go env
      uses: actions/setup-go@v4
      with:
        go-version: '1.21.4'
    - name: Build
      run: go build -o sablog-api main.go
    - name: Show generated files
      run: ls -R
    - name: Archive build artifact
      uses: actions/upload-artifact@v4
      with:
        name: build-artifact
        path: sablog-api

  upload_job:
    needs: build_job
    runs-on: ubuntu-latest
    steps:
    - name: Download build artifact
      uses: actions/download-artifact@v4
      with:
        name: build-artifact
        path: .
    - name: Show generated files
      run: ls -R
    - name: deploy file to server
      uses: wlixcc/SFTP-Deploy-Action@v1.2.4
      with:
        username: 'root'
        server: '${{ secrets.TENCENT_SERVER_HOST }}'
        ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }} 
        local_path: 'sablog-api'
        remote_path: '/var/www/sa-blog-bn'
        sftpArgs: '-o ConnectTimeout=5'

```

秘钥如图去添加就好了

![image-20240112154258649](http://assest.sablogs.cn/imgs/typora/image-20240112154258649.png)

## 构建环境问题

到此为止，一切正常，产物也成功的上传到了服务器

但是pm2部署却出现了问题

![image-20240112154340649](http://assest.sablogs.cn/imgs/typora/image-20240112154340649.png)

问了下AI兄弟，给了几点解决方案

![image-20240112154549097](http://assest.sablogs.cn/imgs/typora/image-20240112154549097.png)

- 更新目标服务器的`GLIBC`版本
- 在本地使用较低版本的`GLIBC`编译
- 使用容器化解决方案

**更新目标服务器的GLIBC版本**这点比较麻烦，2、3点可以考虑

我注意到，我构建时采用的`ubuntu`版本可能过高了，我决定先采用降低构建机器`ubuntu`版本的方式试一试，看是否可以解决

![image-20240112154924750](http://assest.sablogs.cn/imgs/typora/image-20240112154924750.png)

相关文档：https://docs.github.com/zh/actions/using-jobs/choosing-the-runner-for-a-job

最后发现，降低Ubuntu版本后，此问题解决了

## 脚本重启服务

当服务正在运行的时候，文件是被占用的，无法上传同名文件

我们需要将服务先停掉，覆盖上传后，再启动

先上配置，后解释

```yaml
# This workflow will build a golang project
# For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-go

name: Go

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:

  build_job:
    runs-on: ubuntu-20.04
    steps:
    - name: Checkout    
      uses: actions/checkout@v3    #这里使用了github官方提供的action,checkout项目到虚拟机上
    - name: set up Go env
      uses: actions/setup-go@v4
      with:
        go-version: '1.21.4'
    - name: Build
      run: go build -o sablog-api main.go
    - name: Show generated files
      run: ls -R
    - name: Archive build artifact
      uses: actions/upload-artifact@v4
      with:
        name: build-artifact
        path: sablog-api

  upload_job:
    needs: build_job
    runs-on: ubuntu-20.04
    steps:
    - name: Stop PM2 on Server # 上传操作前，需要将服务先停止
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.TENCENT_SERVER_HOST }}
        username: 'root'
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        port: 22
        # 使用 || true 确保即使没有运行的 PM2 进程也不会导致构建失败
        script: cd /var/www/sa-blog-bn && sudo /usr/local/bin/pm2 stop sablog-api || true
    - name: Download build artifact
      uses: actions/download-artifact@v4
      with:
        name: build-artifact
        path: .
    - name: Show generated files
      run: ls -R
    - name: deploy file to server
      uses: wlixcc/SFTP-Deploy-Action@v1.2.4
      with:
        username: 'root'
        server: '${{ secrets.TENCENT_SERVER_HOST }}'
        ssh_private_key: ${{ secrets.SSH_PRIVATE_KEY }} 
        local_path: 'sablog-api'
        remote_path: '/var/www/sa-blog-bn'
        sftpArgs: '-o ConnectTimeout=5' # 注意：增加-o参数，覆盖上传
    - name: Start PM2 on Server # 开启pm2，并进行监听
      uses: appleboy/ssh-action@v1.0.3
      with:
        host: ${{ secrets.TENCENT_SERVER_HOST }}
        username: 'root'
        key: ${{ secrets.SSH_PRIVATE_KEY }}
        port: 22
        script: cd /var/www/sa-blog-bn && sudo /usr/local/bin/pm2 start sablog-api --watch --ignore-watch="storage" # 忽略监听日志文件
```

## pm2 --watch 一直重启问题

现象：启动时是正常的，调用接口就会导致`pm2`自己重启

通过查阅资料资料，猜测可能是日志文件导致的，调用接口会产生日志，`pm2`监听到日志文件变化，就重启了

因此，我们需要修改`pm2`启动命令，忽略掉日志文件夹

我的日志文件夹是`storage`，所以使用如下命令

```bash
pm2 start sablog-api --watch --ignore-watch="storage"
```

![image-20240112160506314](http://assest.sablogs.cn/imgs/typora/image-20240112160506314.png)

可以看到，应用启动正常，`pm2`会自动监听文件变化，且日志变化不会导致重启

问题解决~

## 结语

至此，本文就结束了，下篇会研究前端应用发布后的自动刷新CDN操作

