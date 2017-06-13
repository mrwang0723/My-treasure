/**
 * Created by Administrator on 2017/5/11 0011.
 */

var man = location.hash.indexOf('woman') == -1 ? true : false;
var weightNum = [];
for (var i = 30; i < 201; i++) {
    weightNum.push(i)
}
var weightDefault = location.hash.replace('#', '').indexOf('null')==-1?parseFloat(location.hash.replace('#', '')).toFixed(1):parseFloat(50).toFixed(1);
$(function () {
    var setUserWeight = new Vue({
        el: '#weight',
        data: {
            sex: man,
            weightNum: weightNum,
            weightDefault: weightDefault,
        },
        mounted: function () {
            //获取数据
            this.$nextTick(function () {
                window.removeLoading();
                console.log()
                $('.edit-set-content-num').css({'transform':'translate(' + (30-weightDefault) * ($('.edit-set-content-num li').eq(0).outerWidth(true)) + 'px,0)','-webkit-transform':'translate(' + (30-weightDefault) * ($('.edit-set-content-num li').eq(0).outerWidth(true)) + 'px,0)','width': wyn.get.domItemWidthSum($('.edit-set-content-num li'))})

            })
        },
        methods: {
            setWeight: function () {
                //localStorage.setItem('userWeight', $('.edit-show-num s').html());
                var data = {
                    body_weight: $('.edit-show-num s').html() + 'kg'
                };
                var _this = this;
                $.post(ajaxUrl + '/v1_3/wx/member/update', data, function (data) {
                    data = JSON.parse(data);
                    console.log(this.data);
                    console.log(data);
                    wyn.create.maskText(data.msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                    window.name = 'wyn';
                    window.history.go(-1);
                })
            }
        }
    });
    //微调数值
    $(document).on('touchstart', '.edit-set-left,.edit-set-right', function () {
        wyn.stop.stopDefault();
        var flag = $(event.target).parents().hasClass('edit-height-box'),
            box = $(document).find('.edit-set-content-num'),
            item = $('.edit-set-content-num li'),
            translateRe = flag ? /[^translate(-?\d+\,]-?\d+/i : /[^translate(]\d+/gi,
            text = parseInt(item.eq(0).text()),
            position = parseFloat(box[0].style.transform.match(translateRe)),
            aWidth = parseFloat(item.css(flag ? 'height' : 'width')),
            flagBtn = $(event.target).parents().hasClass('edit-set-left'),
            maxWidth = aWidth * (item.length - 1);
        //position = flag ? flagBtn ? position - Math.round(aWidth / 10) : position + Math.round(aWidth / 10) : flagBtn ? position + Math.round(aWidth / 10) : position - Math.round(aWidth / 10);
        position = flag ? flagBtn ? position - Math.round(aWidth/10) : position + Math.round(aWidth/10) : flagBtn ? position + Math.round(aWidth/10) : position - Math.round(aWidth/10);

        if (position > 0) {
            position = 0;
            wyn.create.maskText(flag ? '不能再高啦' : '不能再少了', {padding: '10px', top: '50%'}, null, 600)
        }
        ;
        if (position < -maxWidth) {
            position = -maxWidth;
            wyn.create.maskText(flag ? '不能再矮啦' : '不能再多了', {padding: '10px', top: '50%'}, null, 600)
        };
        $('.edit-show-num s').html(flag ? (text - parseFloat(Math.abs(position / (aWidth)))).toFixed(1) : (text + parseFloat(Math.abs(position / (aWidth)))).toFixed(1))

        box.css('transform', flag ? 'translate(0,' + position + 'px)' : 'translate(' + position + 'px,0)');
    });

    $(document).on('touchstart', '.edit-set-content', function () {
        wyn.stop.stopDefault();
        var flag = $(event.target).parents().hasClass('edit-height-box'),
            timer = document.body,
            ev = event.changedTouches[0],
            sX = flag ? ev.clientY : ev.clientX,
            box = $('.edit-set-content-num'),
            translateRe = flag ? /[^translate(-?\d+\,]-?\d+/i : /[^translate(]\d+/gi,
            position = parseFloat(box[0].style.transform.match(translateRe)),
            aWidth = parseFloat($('.edit-set-content-num li').css(flag ? 'height' : 'width')),
            maxWidth = aWidth * ($('.edit-set-content-num li').length - 1),
            text = parseFloat($('.edit-set-content-num li').eq(0).text()),
            sT = Date.now(),
            mT = 0;
        clearInterval(timer.timer)
        $(document).on('touchmove', '.edit-set-content', function () {
            wyn.stop.stopDefault();
            mT = Date.now();
            var numBox = $('.edit-show-num s'),
                ev = event.changedTouches[0],
                mX = flag ? ev.clientY : ev.clientX,
                mPosition = position - (sX - mX);
            mPosition = mPosition > 0 ? 0 : mPosition;
            mPosition = mPosition < -Math.round(maxWidth) ? -Math.round(maxWidth) : mPosition;
            numBox.html(flag ? (text - parseFloat(Math.abs(mPosition / (aWidth)))).toFixed(1) : (text + parseFloat(Math.abs(mPosition / (aWidth)))).toFixed(1))
            console.log(text + parseFloat(Math.abs(mPosition / (aWidth)).toFixed(1)))
            box.css('transform', flag ? 'translate(0,' + mPosition + 'px)' : 'translate(' + mPosition + 'px,0)');
            console.log(mPosition)
        })
        $(document).off('touchend', '.edit-set-content').on('touchend', '.edit-set-content', function () {
            var eT = Date.now(),
                ev = event.changedTouches[0],
                eX = flag ? ev.clientY : ev.clientX,
                num = (sX - eX) / (eT - mT),//最后一段时间手指划动速度
                ePosition = parseFloat($('.edit-set-content-num')[0].style.transform.match(translateRe));
            $(document).off('touchmove', '.edit-set-content');
            if (ePosition == 0) {
                if (sX - eX != 0)wyn.create.maskText(flag ? '不能再高啦' : '不能再少了', {
                    padding: '10px',
                    top: '50%'
                }, null, 600);
                return false;
            }
            if (ePosition == -Math.round(maxWidth)) {
                if (sX - eX != 0)wyn.create.maskText(flag ? '不能再矮啦' : '不能再多了', {
                    padding: '10px',
                    top: '50%'
                }, null, 600);
                return false;
            }
            if (Math.abs(sX - eX) < 20 || eT - sT > 200) {
                return false;
            }
            if (eT - mT < 50) {
                timer.timer = setInterval(function () {
                    num *= .95;
                    ePosition = ePosition - num;
                    if (ePosition >= 0) {
                        ePosition = 0;
                        wyn.create.maskText(flag ? '不能再高啦' : '不能再少了', {padding: '10px', top: '50%'}, null, 600);
                        clearInterval(timer.timer)
                    }
                    if (ePosition <= -Math.round(maxWidth)) {
                        ePosition = -Math.round(maxWidth);
                        wyn.create.maskText(flag ? '不能再矮啦' : '不能再多了', {padding: '10px', top: '50%'}, null, 600);
                        clearInterval(timer.timer)
                    }
                    if (Math.round(num * 3) == 0) {
                        num = 0;
                        clearInterval(timer.timer)
                    }
                    box.css('transform', flag ? 'translate(0,' + (ePosition) + 'px)' : 'translate(' + (ePosition) + 'px,0)');
                    $('.edit-show-num s').html(flag ? (text - parseFloat(Math.abs(ePosition / (aWidth)))).toFixed(1) : text + parseFloat(Math.abs(ePosition / (aWidth)).toFixed(1)))
                }, 10);
            }
        });
    });
});


