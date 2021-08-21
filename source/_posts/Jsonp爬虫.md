---
title: Jsonp爬虫
date: 2021-08-20 23:05:17
tags: java
category: 后端
---

# Jsoup和HtmlUnit简单实战

> 本技术需要一定的前端基础和JAVA网络编程相关知识，如还不了解自行百度补充

## 一、Jsoup简介

jsoup 是一款Java 的HTML解析器，可直接解析某个URL地址、HTML文本内容。它提供了一套非常省力的API，可通过DOM，CSS以及类似于jQuery的操作方法来取出和操作数据。

网页获取和解析速度飞快，推荐使用。
主要功能如下：

1. 从一个URL，文件或字符串中解析HTML；
2. 使用DOM或CSS选择器来查找、取出数据；
3. 可操作HTML元素、属性、文本；

**注意：Jsoup只能解析网页，不能爬电影和音乐**

## 二、Jsoup入门实战讲解

首先创建一个java的maven项目作为本次讲解的例子

导入maven依赖如下

```java
		<!-- https://mvnrepository.com/artifact/org.jsoup/jsoup -->
        <dependency>
            <groupId>org.jsoup</groupId>
            <artifactId>jsoup</artifactId>
            <version>1.13.1</version>
        </dependency>
```



首先我们要爬取京东的英语六级资料信息，我们在搜索框中输入"cet6"，地址栏如图所示

![image-20200615225858019](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/jsonp%E7%88%AC%E8%99%AB/image-20200615225858019.png)

现在我们得到了我们要获取的请求地址

https://search.jd.com/Search?keyword=cet6

可以看出，返回的是浏览器的Document对象，在js中可以使用的代码这里都能用

![image-20200615230420474](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/jsonp%E7%88%AC%E8%99%AB/image-20200615230420474.png)

接下来通过审查元素找到商品列表的div，并拿到div下的li标签

![image-20200615230734537](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/jsonp%E7%88%AC%E8%99%AB/image-20200615230734537.png)

接下来我们按照此方法，拿到相应的标签，并运行，运行结果如下，代码在下方给出

![image-20200615232057442](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/jsonp%E7%88%AC%E8%99%AB/image-20200615232057442.png)

```java
public class HtmlParseUtils {
    public static void main(String[] args) throws IOException {
        //请求地址  https://search.jd.com/Search?keyword=cet6
        String url = "https://search.jd.com/Search?keyword=cet6";
        //解析网页 (返回的是浏览器的Document对象,在js中可以使用的代码这里都能用)
        Document document = Jsoup.parse(new URL(url), 10000);
        Element element = document.getElementById("J_goodsList");
        //获取所有li冤死
        Elements elements = element.getElementsByTag("li");
        for (Element el : elements) {
            //拿到商品的图片（注意：如果图片未能找到，可能是因为网站使用了懒加载的方式）
            String img = el.getElementsByTag("img").eq(0).attr("src");
            
            //String img = el.getElementsByTag("img").eq(0).attr("source-data-lazy-img");如果上面的方法未能拿到，使用这个
            
            String price = el.getElementsByClass("p-price").eq(0).text();//拿到商品的价格
            
            String name = el.getElementsByClass("p-name").eq(0).text();//商品名字

            System.out.println("===================================================");
            System.out.println(img);
            System.out.println(price);
            System.out.println(name);
        }
    }
}
```

讲解到这里相信大家已经对Jsoup有了基本的了解，需要工具类的话把他封装一下即可，下面来说说怎么爬取Ajax

## 三、HtmlUnit简介

> 比较推荐使用HtmlUnit来进行网页抓取主要是因为：
>
> - 对于使用java实现的网页爬虫程序，我们一般可以使用apache的HttpClient组件进行HTML页面信息的获取，HttpClient实现的http请求返回的响应一般是纯文本的document页面，即最原始的html页面。
> - 对于一个静态的html页面来说，使用httpClient足够将我们所需要的信息爬取出来了。但是对于现在越来越多的动态网页来说，更多的数据是通过异步JS代码获取并渲染到的，最开始的html页面是不包含这部分数据的。

htmlunit 是一款开源的java 页面分析工具，读取页面后，可以有效的使用htmlunit分析页面上的内容。项目可以模拟浏览器运行，被誉为java浏览器的开源实现。这个没有界面的浏览器，运行速度也是非常迅速的。采用的是Rhinojs引擎。模拟js运行。

说白了就是一个浏览器，这个浏览器是用Java写的无界面的浏览器，正因为其没有界面,因此执行的速度还是可以滴，HtmlUnit提供了一系列的API,这些API可以干的功能比较多，如表单的填充，表单的提交，模仿点击链接，由于内置了Rhinojs引擎，因此可以执行Javascript。
网页获取和解析速度较快，性能较好，推荐用于需要解析网页脚本的应用场景。

```java
<!-- https://mvnrepository.com/artifact/net.sourceforge.htmlunit/htmlunit -->
<dependency>
    <groupId>net.sourceforge.htmlunit</groupId>
    <artifactId>htmlunit</artifactId>
    <version>2.41.0</version>
</dependency>

```

## 四、HtmlUnit+Jsoup请求Ajax内容

现在实战一下，我们请求的网站就是本博客，请求地址为

```
https://www.yxlyz.net/index.php/search/设计模式
```

页面如下

![image-20200618104442033](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/jsonp%E7%88%AC%E8%99%AB/image-20200618104442033.png)

代码如下

```java
package net.yxlyz.utils;

import com.gargoylesoftware.htmlunit.*;
import com.gargoylesoftware.htmlunit.html.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.io.IOException;
import java.util.List;
import java.util.logging.Logger;

/**
 * @Author Saraph1nes
 * @Date 2020/6/15 23:36
 * @Version 1.0
 */
public class HtmlUnitDemo {
    public static void main(String[] args) throws IOException {
        final WebClient webClient = new WebClient(BrowserVersion.CHROME);//新建一个模拟谷歌Chrome浏览器的浏览器客户端对象

        webClient.getOptions().setThrowExceptionOnScriptError(false);//当JS执行出错的时候是否抛出异常, 这里选择不需要
        webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);//当HTTP的状态非200时是否抛出异常, 这里选择不需要
        webClient.getOptions().setActiveXNative(false);
        webClient.getOptions().setCssEnabled(false);//是否启用CSS, 因为不需要展现页面, 所以不需要启用
        webClient.getOptions().setJavaScriptEnabled(true); //很重要，启用JS
        webClient.setAjaxController(new NicelyResynchronizingAjaxController());//很重要，设置支持AJAX

        HtmlPage page = null;
        try {
            page = webClient.getPage("https://www.yxlyz.net/index.php/search/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F");//尝试加载上面图片例子给出的网页
        } catch (Exception e) {
            e.printStackTrace();
        }finally {
            webClient.close();
        }

        webClient.waitForBackgroundJavaScript(10000);//异步JS执行需要耗时,所以这里线程要阻塞30秒,等待异步JS执行结束

        String pageXml = page.asXml();//直接将加载完成的页面转换成xml格式的字符串

        //下面的代码就是对字符串的操作了,常规的爬虫操作,用到了比较好用的Jsoup库

        Document document = Jsoup.parse(pageXml);//获取html文档
        List<Element> infoListEle = document.getElementById("tab_1").getElementsByAttributeValue("class", "list-group-item");//获取元素节点等
        for (Element element : infoListEle) {
            System.out.println(element.getElementsByTag("a").text());
            System.out.println(element.getElementsByTag("a").attr("href"));
        }
    }
}

```

结果为：

![](https://saraph1nes-bucket.oss-cn-hangzhou.aliyuncs.com/imgs/AliOssForTypecho/jsonp%E7%88%AC%E8%99%AB/image-20200618103221407.png)