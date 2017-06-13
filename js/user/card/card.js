/**
 * Created by xinyunhengan on 2017/3/30.
 */
$(function () {
    $('.two-code').qrcode({
        render: "canvas",
        height: 160,
        width: 160,
        correctLevel: 0,
        text: 'http://192.168.100.112:8081/public-platform/page/card/card.html'
    });
})