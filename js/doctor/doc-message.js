/**
 * Created by Administrator on 2017/5/10 0010.
 */
var title = location.hash.replace('#', '')
window.titleArr = ["主任医师",
    "副主任医师",
    "主治医师",
    "住院医师",
    "主任技师",
    "副主任技师",
    "主管技师",
    "技师",
    "主任护师",
    "副主任护师",
    "主管护师",
    "护师"];
if (title.indexOf('edit') != -1) {
    document.title = '编辑信息'
}
$(function () {
    var docMessage = new Vue({
            el: '.my-message-box',
            data: {
                docDatas: {},
                saveLoading: false,
                Input: false,
                placeholderText: '',
                inputPopText: '',
                titleArr: window.titleArr,
                avatarStyle: {
                    width: '100%',
                    height: 'auto'
                },
                cert_cardStyle: {
                    width: '100%',
                    height: 'auto'
                },
                job_cardStyle: {
                    width: '100%',
                    height: 'auto'
                },

            },
            mounted: function () {
                //获取数据
                this.$nextTick(function () {
                    //var invite_id=location.hash.replace('#','')
                    var _this = this;
                    var data = {
                        is_set: 1
                    }
                    if (location.href.indexOf('perfectMyMessage') == -1) {
                        data.is_set = 2
                    }
                    $.post(ajaxUrl + '/v1_3/wx/doctor/details', data, function (data) {
                        data = JSON.parse(data);
                        //_this.docDatas = data.datas;
                        _this.docDatas = data.datas;
                        console.log(data)
                        if(data.code==-1 || !Boolean(data.datas)){
                            popLogin();
                        }
                        //_this.$set(_this.docDatas, 'invite_id', invite_id);
                        setTimeout(function () {
                            var img = $('.my-message-box').find('img');
                            for (var i = 0; i < img.length; i++) {
                                /*_this[img[i].getAttribute('data-name')+'Style']*/
                                console.log(img[i].getAttribute('data-name') + 'Style')
                                if (img.eq(i).height() < img.eq(i).width()) {
                                    _this[img.eq(i).attr('data-name') + 'Style'] = {
                                        height: "100%",
                                        width: "auto"
                                    }
                                } else {
                                    _this[img.eq(i).attr('data-name') + 'Style'] = {
                                        width: "100%",
                                        height: "auto",
                                    }
                                }
                                console.log(_this[img.eq(i).attr('data-name') + 'Style'])
                            }
                            window.removeLoading();
                        }, 500)
                    })
                })
            },
            updated: function () {
                var _this = this;
            },
            directives: {
                focus: {
                    update: function (el, arg) {
                        console.log(arg.value)
                        if (arg.value) {
                            el.focus();
                        } else {
                            el.blur();
                        }
                    }
                }
            },
            filters: {
                sex: function (val) {
                    if (val == '1')
                        return '男'
                    else
                        return '女'
                }
            }
            ,
            computed: {
                isPsot: function () {
                    return !!this.docDatas.cert_card
                }
            }
            ,
            methods: {
                showInput: function (hash, inputPopText, placeholderText) {
                    location.hash += hash;
                    this.inputPopText = inputPopText;
                    this.placeholderText = placeholderText;
                    //if(wyn.get.client()=='iphone') $('#inputBox').focus();
                }
                ,
                //上传图片
                upImg: function (e, data) {
                    var _this = this;
                    /*wyn.upImg(e.target, function (url) {
                     _this.docDatas[data] = url;
                     })*/
                    if(!!!$(e.target).val())return;
                    wyn.create.maskText('正在上传', {padding: '10px 15px', top: '50%'}, null);
                    lrz(e.target.files[0], {width: 200}, function (results) {
                            var img = new Image();
                            img.src = results.base64;
                            img.onload = function () {
                                console.log(img.width)
                                console.log(img.height)
                                console.log(data + 'Style')
                                if (img.width > img.height) {
                                    _this[data + 'Style'] = {
                                        height: '100%',
                                        width: 'auto'
                                    }
                                } else {
                                    _this[data + 'Style'] = {
                                        width: '100%',
                                        height: 'auto'
                                    }
                                }
                                //_this.imgs.push({src: results.base64, style: style})
                                _this.docDatas[data] = results.base64;
                                wyn.create.maskText('上传成功', {padding: '10px 20px', top: '50%'}, null, 1000);
                            }
                        }
                    )
                }
                ,
                inputPost: function () {
                    window.history.back();
                }
                ,
                //保存
                save: function () {
                    var _this = this;
                    if (!this.saveLoading) {
                        if (!!!this.docDatas.cert_card) {
                            alert('请上传胸牌')
                        } else {
                            wyn.create.maskText('正在提交，请稍候', {
                                padding: '10px 15px',
                                top: '50%'
                            }, null);
                            delete  _this.docDatas['department']
                            $.post(ajaxUrl + '/v1_3/wx/doctor/set_invite',
                                _this.docDatas, function (data) {
                                    data = JSON.parse(data);
                                    console.log(data);
                                    console.log(this.data)
                                    if (data.code == -1) {
                                        alert(data.msg)
                                    } else {
                                        wyn.create.maskText('提交成功，请等待审核', {
                                            padding: '10px 15px',
                                            top: '50%'
                                        }, null)
                                        setTimeout(function () {
                                            window.location.replace('./myMessage.html')
                                        }, 1000);
                                        /*/!*关闭微信窗口*!/
                                         WeixinJSBridge.invoke('closeWindow', {}, function (res) {});*/
                                    }
                                })
                        }
                    }
                }
                ,
                //申请变更
                changes: function () {
                    window.location.href = './perfectMyMessage.html#edit'
                }
            }
        })
        ;
    wyn.onHashChange(function (hash) {
            if (hash.replace('#', '').indexOf('input') != -1) {
                docMessage.Input = true;
            } else {
                docMessage.Input = false;
                if (wyn.get.client() == 'iphone' && $('#inputBox')[0] == document.activeElement) {
                    $('#inputBox')[0].blur();
                }
            }
        }
    )
})