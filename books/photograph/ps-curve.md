# ps曲线原理和应用

## 原理

一张图片，我们可以将它分为色调层（有颜色的部分）和影调层（黑白部分）

![image-20240110211748596](http://assest.sablogs.cn/imgs/typora/image-20240110211748596.png)

对影调层做一个简单的像素画分割，并将像素点从暗到亮排列，我们就得到了直方图

![image-20240110212147052](http://assest.sablogs.cn/imgs/typora/image-20240110212147052.png)

![image-20240110211944154](http://assest.sablogs.cn/imgs/typora/image-20240110211944154.png)

直方图最暗的地方，对应曲线的起点，最亮的地方，对应曲线的终点

![image-20240110212241458](http://assest.sablogs.cn/imgs/typora/image-20240110212241458.png)



## 应用

### 增加对比度

我们想增加图片对比度，只需要将亮部变亮，暗部变暗

![image-20240110212407353](http://assest.sablogs.cn/imgs/typora/image-20240110212407353.png)

### 模拟胶片

想要模拟胶片对比度高但是发灰的效果，我们可以将暗部提高，亮部压低，同时增加对比度

![image-20240110212703499](http://assest.sablogs.cn/imgs/typora/image-20240110212703499.png)

### 图片通透去灰

我们可以将起点拉到直方图最左侧，终点拉到直方图最右侧

![image-20240110212925355](http://assest.sablogs.cn/imgs/typora/image-20240110212925355.png)

### 使画面柔和

思考一下，答案在图片后给出

![image-20240110213046599](http://assest.sablogs.cn/imgs/typora/image-20240110213046599.png)

没错，原理是降低对比度，也就是增亮暗部，压低亮部，形成反S曲线

### 提亮部分

使用选择工具，点击图片后曲线会出现对应的点，只拉高当前点，将其他地方打点还原就可以了

![image-20240110213320021](http://assest.sablogs.cn/imgs/typora/image-20240110213320021.png)



## 参考

- [一次就掌握的ps曲线原理和应用](https://www.bilibili.com/video/BV1pG41167Km/?spm_id_from=333.880.my_history.page.click&vd_source=1aa7cd16fb20df2e3f44a5a96f399eb4)

