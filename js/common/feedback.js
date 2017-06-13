/**
 * Created by Administrator on 2017/4/13 0013.
 */



///*上传图片*/
//$(document).on('change','.feekback-photo li input',function(){
//    var _this=event.target;
//    wyn.upImg(_this,function(src){
//        console.log(src);
//        var btn = '<input type="file" accept="image/jpg,image/jpeg,image/png,image/gif" name="feekback-up">'
//        _this.setAttribute('data-src',src);
//        $(_this).parents('s').before('<span style="background-image:url('+src+')"><i class="icon-close"></i></span>')
//        $(_this).before(btn)
//    })
//})

/*显示隐藏*/
wyn.bind.touchEnd('.icon-arrows-bottom', showItem);

function showItem(obj) {
    if ($(obj).is('s')) obj = $(obj).parents('h3');
    $(obj).toggleClass('icon-arrows-top');
    $('textarea').blur();
    var height = wyn.get.domItemHeightSum($(obj).siblings('ul').find('li'))
    height = $(obj).hasClass('icon-arrows-top') ? height : 0;
    $(obj).siblings('ul').css('height', height)
}
/*统计字符数*/
$(document).on('input', '.feedback-content textarea', function () {
    var _this = $(event.target), text = _this.val(), num = _this.siblings('span').find('s');
    num.html(text.length)
})

/*判断是否是*/
$(function () {
    var feedback = new Vue({
            el: '#box',
            data: {
                //内容
                content: '',
                //问题类型
                feedbackType: [
                    {
                        text: '问题',
                        code: 1
                    }, {
                        text: '意见',
                        code: 2
                    }, {
                        text: '建议',
                        code: 3
                    }, {
                        text: '其他',
                        code: 4
                    }, {
                        text: '服药',
                        code: 5
                    }],
                //提交的问题类型
                type: {
                    text: '问题',
                    code: 1
                },
                isDoc: false,
                select: 1,
                //用户类型
                appType: 0,

                //上传的图片
                imgs: [],
            },
            mounted: function () {
                //获取数据
                this.$nextTick(function () {
                    window.removeLoading();
                    if (location.hash.replace('#', '').indexOf('doctor') != -1) {
                        this.isDoc = true;
                    }
                });
            },
            computed: {
                height: function () {
                    return this.type == '' ? 'auto' : 0
                },
                'isDisabled': function () {
                    return this.content.length < 1
                }
            },
            methods: {
                upImg: function (e) {
                    var _this = this;
                    console.log(e.target)
                    wyn.create.maskText('正在添加图片', {padding: '10px 15px', top: '30%'}, null);
                    var length = e.target.files.length;
                    var count = 0;
                    for (var i = 0; i < length; i++) {
                        lrz(e.target.files[i], {width: 300}, function (results) {
                                var img = new Image();
                                count++;
                                img.src = results.base64;
                                img.onload = function () {
                                    var style = new Object();
                                    if (img.width > img.height) {
                                        style = {
                                            height: '100%',
                                        }
                                    } else {
                                        style = {
                                            width: '100%',
                                        }
                                    }
                                    _this.imgs.push({src: results.base64, style: style})
                                    if (count == length) {
                                        wyn.create.maskText('添加成功', {padding: '10px 15px', top: '30%'}, null, 1500);
                                    }
                                }
                            }
                        )
                    }

                    /*wyn.upImg(e.target, function (src) {
                     if(_this.imgs.indexOf(src)==-1){
                     /!*var btn = '<input type="file" accept="image/jpg,image/jpeg,image/png,image/gif" name="feekback-up">'*!/

                     }
                     })*/
                },
                check: function (item) {
                    this.type = item;
                    showItem('.feedback-type h3');
                }
                ,
                post: function () {
                    if (this.type.code == undefined) {
                        alert('请选择反馈类型');
                        return;
                    } else if (this.content == '') {
                        alert('请填写内容');
                        return;
                    }
                    wyn.create.maskText('正在提交，请稍候', {padding: '10px 20px', top: '50%'}, null);
                    var imgarr = []
                    for (var i in this.imgs) {
                        imgarr[i] = this.imgs[i].src;
                        console.log(imgarr[i])
                    }
                    $.post(ajaxUrl + '/v1_3/wx/feedback', {
                        content: this.content,
                        'feedback-type': this.type.code,
                        'app-type': 0,
                        img: imgarr
                    }, function (data) {
                        console.log(this.data);
                        console.log(data);
                        data = JSON.parse(data);
                        $('#maskText').remove()
                        alert('反馈成功');
                        //关闭微信窗口
                        WeixinJSBridge.invoke('closeWindow', {}, function (res) {
                        });
                    })
                }
                ,
                delImg: function (item) {
                    var _this = this;
                    wyn.create.selectPrompt('确定移出此照片？', function (btn) {
                        wyn.bind.touchEnd(btn, function () {
                            console.log(item)
                            _this.imgs.splice(item, 1)
                        });
                    })
                }
            },
            watch: {
                'imgs': function () {
                    if (this.imgs.length > 4) {
                        this.imgs.length = 4;
                    }
                }
            }
        })
        ;
})
;
