---
title: 纪念日
banner_img: https://s2.loli.net/2022/04/04/eaGPUDMShFqjNpy.jpg
banner_img_height: 60
banner_mask_alpha: 0.5
date: 2022-04-04 21:53:21
---

<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://cdn.staticfile.org/twitter-bootstrap/4.3.1/css/bootstrap.min.css">
    <link href="./static/css/cover.css" rel="stylesheet">
    <link href="./static/css/TimeCircles.css" rel="stylesheet">
    <script src="https://cdn.staticfile.org/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://cdn.staticfile.org/popper.js/1.15.0/umd/popper.min.js"></script>
    <script src="https://cdn.staticfile.org/twitter-bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdn.bootcss.com/typed.js/2.0.5/typed.js"></script>
    <script src="static/js/TimeCircles.js"></script>
    <style>
        /* Make the image fully responsive */
        .carousel-inner img {
            border-radius: 10px;
            width: 100%;
            height: 100%;
        }
    </style>
</head>

<body>


<div class="anniversary-container">
    <div id="main_box"></div>
    <div class="hr-line-solid"></div>
    <div class="inner">
        <div>
            <div id="DateCountdown" data-date="2018-03-07 20:00:00"></div>
        </div>
    </div>
</div>
<script>
    $("#DateCountdown").TimeCircles();
</script>
<script>
    let main_box = document.getElementById('main_box');
    new Typed(main_box, {
        strings: ['<h4>亲爱的陈小猪：</h4>\n' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你好！<br>\n' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一切都不必操之过急，我们会有如歌一般的生活。不开心的时候一定告诉我原因，如果是我不对我一定会努力改，如果是你的小情绪，那么我会酌情溺爱你，但一定不会责怪你。莫名的情绪总是会有，重要的是相互的包容与理解。<br>\n' +
        '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;我更希望你爱自己，我绝没有那么重要，爱自己才有能力去爱，才有终生的浪漫情怀，为了我失去自己，没有必要。\n' +
        '你一定会幸福快乐，愿我有机会出一份力。\n' +
        '<div style="text-align: right">夏宇轩</div>\n' +
        '<div style="text-align: right">2020.10.21</div>'],
        typeSpeed: 50,
        startDelay: 100,
        loop: false,
        contentType: 'html',
        cursorChar: '➼'
    });
</script>
</body>
</html>
