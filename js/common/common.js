/**
 * Created by xinyunhengan on 2017/3/28.
 */

//测试库地址
var ajaxUrl = 'https://knx.cardiocloud.cn'

//开发库地址
//var ajaxUrl='http://119.254.209.223';
//加载动画
window.satrtLoading = function () {
    var box = document.createElement('div');
    box.id = 'loading-box';
    style = {
        'position': 'fixed',
        width: '100%',
        height: document.documentElement.clientHeight + 'px',
        left: 0,
        top: 0,
        background: '#fff no-repeat center 45% url("/public-platform/images/common/loading.gif")',
        'z-index': '99999999999999',
        "background-size": '80px'
    };
    $(box).on('touchstart', function () {
        event.preventDefault();
    });
    for (var i in style) {
        box.style[i] = style[i];
    }
    document.documentElement.appendChild(box);
}
//移出加载动画
window.removeLoading = function () {
    var box = document.getElementById('loading-box');
    document.documentElement.removeChild(box);
}

window.satrtLoading();
$(function () {
        isRotation()
        /*屏幕旋转判断*/
        $(window).bind('orientationchange', isRotation);
        $(document).on('touchmove', '.mask-box,.select-prompt-box', function () {
            wyn.stop.stopDefault();
        });
        /*清空输入框内文字*/
        wyn.bind.touchEnd('.icon-small-close', function (obj) {
            if ($(obj).siblings('input')[0])$(obj).siblings('input').val('').focus().end().css('visibility', 'hidden');
        })

        /*显示隐藏密码*/
        wyn.bind.touchEnd('.user-password i', function () {
            var state = $(event.target).parents('label').find('input').attr('type');
            $(event.target).toggleClass('icon-password-show').parents('label').find('input').attr('type', state == 'password' ? 'email' : 'password')
            console.log()
        });

        /*通用显示隐藏清空输入框按钮*/
        $(document).off('input focus', 'input').on('input focus', 'input', function () {
            var off = $(event.target).siblings('.icon-small-close')[0];
            if (off) $(off).css('visibility', $(this).val() ? 'visible' : 'hidden');
        })
        $(document).one('blur', 'input', function () {
            if ($(event.target)) {
                var off = $(event.target).siblings('.icon-small-close')[0];
                $(off).css('visibility', 'hidden');
            }
            console.log($(event.target))
            wyn.stop.stopBubble();
        })

        /* /!*显示隐藏清空按钮*!/
         $(document).on('input', '.user-input li input', function () {
         $(this).parents('label').siblings('span').css('visibility', $(this).val() ? 'visible' : 'hidden');
         });
         $(document).on('input', '.user-input li input', function () {
         $(this).parents('label').siblings('span').css('visibility', 'hidden')
         })*/

        /*验证登录按钮是否可点击*/
        $(document).on('input', '[name=user-code],[name=user-name],[name=user-password],[name=user-phone]', function () {
            checkOne();
        });

        /*初次验证*/
        function checkOne() {
            var userName = $('[name=user-name]'), userPhone = $('[name=user-phone]'), passWord = $('[name=user-password]'),
                userCode = $('[name=user-code]');
            var flag = false;
            if (userPhone[0]) {
                if (userPhone.val().length < 11) {
                    flag = true;
                }
            }
            if (userName[0]) {
                if (userName.val().length < 2) {
                    flag = true;
                }
            }
            if (passWord[0]) {
                if (passWord.val().length < 6) {
                    flag = true;
                }
            }
            if (userCode[0]) {
                if (userCode.val().length != 4) {
                    flag = true;
                }
            }
            $('[name=user-submit]')[0].disabled = flag;
        };
        wyn.bind.touchEnd('.mask-box .btn-close', function () {
            $(this).parents('.mask-box').remove();
        });

        //触摸反馈
        $(document).on('touchstart', '.touch-feedback', function () {
            var _this = $(event.target).hasClass('touch-feedback') ? $(event.target) : $(event.target).parents('.touch-feedback')
            var style = _this.css('background-color');
            //_this.css('background-color', '#61A665');
            _this.css('background-color', 'rgba(0,0,0,.1)');
            $(document).on('touchend', '.touch-feedback', function () {
                _this.css('background-color', style);
            })
        })
    }
);

/*输入框失去焦点*/
function inputBlur(obj) {
    if ($(obj)[0].type != 'text' || $(obj)[0].type != 'tel' || $(obj)[0].type != 'password' || $(obj)[0].type != 'email') {
        if ($(obj).hasClass('icon-small-close')) return;
        $('[type=text],[type=tel],[type=password],[type=email]').blur();
    }
};

//求所有子集宽度的和
function getItemWidthSum(a, b) {
    var obj = $(a).find(b);
    var len = $(a).find(b).length - 1;

    function sum(num) {
        var width = $(a).find(b).eq(num).outerWidth(true);
        console.log(width + '==' + num)
        if (num < 0) {
            return 0;
        } else {
            return width + arguments.callee(num - 1);
        }
    }

    return sum(len)
};

function getDateStr(x, y) {
    var z = {
        y: x.getFullYear(),
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
    });
}
/*判断屏幕是否旋转*/
function isRotation(){
        if (window.orientation != 0 && window.orientation!=undefined) {
            var text = '<div class="rotate-screen-pop">\
        <h3><span class="icon-sigh"></span><p>暂不支持横屏模式<br>请使用竖屏模式浏览</p></h3>\
        </div>';
            $('html').append(text);
            $('.rotate-screen-pop').on('touchstart',function(){
                $(this).on('touchmove',function(){
                    return false;
                })
                $(this).on('touchend',function(){
                    $(this).off('touchmove')
                })
            })
        } else {
            if ($('.rotate-screen-pop')[0]) {
                $('.rotate-screen-pop').remove()
            }
        }
}

/*提示登录后继续操作*/
function popLogin(){
    if(wyn.get.client()=='iphone'){
        //关闭微信窗口
        setTimeout(function(){
            alert('请登录后再继续操作')
            //WeixinJSBridge.invoke('closeWindow', {}, function (res) {});
            location.replace('/public-platform/page/login/login.html')
        },300)
    }else {
        alert('请登录后再继续操作')
        setTimeout(function(){
            location.replace('/public-platform/page/login/login.html')
            //WeixinJSBridge.invoke('closeWindow', {}, function (res) {});
        },300)
    }
}
/*/!*关闭窗口事件*!/
 window.onbeforeunload = onbeforeunload_handler;
 window.onunload = onunload_handler;
 function onbeforeunload_handler(){
 return false;
 }
 function onunload_handler(){
 return false;
 }*/
/*/!*匹配hash值是任意字母结尾的*!/
 console.log(/#[a-zA-Z]+$/.test(location.href))*/

/*关闭微信窗口*/
//WeixinJSBridge.invoke('closeWindow', {}, function (res) {});