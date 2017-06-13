/**
 * Created by xinyunhengan on 2017/3/28.
 */
$(function () {
    /*发送验证码*/
    wyn.bind.touchEnd('[name=get-code]', function () {
        var _this = event.target;
        var _phone =$('[name=user-phone]').val().replace(/ |-/g,'');
        if (!_this.disabled) {
            $.ajax({
                url:ajaxUrl+'/v1_3/wx/member/verification',
                type:'post',
                data:{phone:_phone},
                success:function(data){
                    data = JSON.parse(data);
                    console.log(data);
                    if(data.code==-1){
                        wyn.create.maskText(data.msg,{
                            top: '50%',
                            transform: 'translate(-50%,-50%)',
                            padding:'10px 20px',
                            'line-height':'1.4'
                        }, null, 2000);
                    }else{
                        _this.setAttribute('code',data.datas['code'])
                        //alert(data.datas['code'])
                        wyn.create.maskText('验证码已发送', {
                            width: '200px',
                            top: '50%',
                            transform: 'translate(-50%,-50%)',
                            height: '52px',
                            'line-height': '52px'
                        }, null, 2000);
                        _this.disabled = true;
                        var time = 60;
                        _this.innerHTML = time + 'S';
                        clearInterval(_this.timer);
                        _this.timer = setInterval(function () {
                            _this.innerHTML = (--time) + 'S';
                            if (time < 0) {
                                clearInterval(_this.timer);
                                _this.innerHTML = '再发一次';
                                _this.disabled = false;
                            }
                        }, 1000);
                    }}
            })
        } else {
            wyn.create.maskText('验证码已发送，请稍候', {
                width: '200px',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                height: '52px',
                'line-height': '52px'
            }, null, 2000);
            return false;
        }
    });

    /*登记验证*/
    wyn.bind.touchEnd('.btn-submit button', function () {
        var userPhone = $('[name=user-phone]');
        var userCode = $('[name=user-code]');
        var userName = $('[name=user-name]')
        var codeData={
            phone:userPhone.val().replace(/ |-/g,''),
            code:userCode.val(),
            application_type:1
        };
        if (!userName.val()) {
            wyn.create.maskText('真姓实名不能为空', {
                top: '30%',
                'transform': 'translate(-50%,-50%)',
                width: '190px',
                'line-height': '1.6',
                padding: '16px 10px'
            }, 'icon-login-sigh,icon-sigh', 2000)
        } else {
            if (!userPhone.val()) {
                wyn.create.maskText('手机号不能为空', {
                    top: '30%',
                    'transform': 'translate(-50%,-50%)',
                    width: '190px',
                    'line-height': '1.6',
                    padding: '16px 10px'
                }, 'icon-login-sigh,icon-sigh', 2000)
            } else {
                if (!userCode.val()) {
                    //判断验证码是否为空
                    wyn.create.maskText('验证码不能为空', {
                        top: '30%',
                        'transform': 'translate(-50%,-50%)',
                        width: '190px',
                        'line-height': '1.6',
                        padding: '16px 10px'
                    }, 'icon-login-sigh,icon-sigh', 2000)
                } else {
                    var codeRep = /\d{4}/;
                    if (!wyn.judge.input.name(userName.val())) {
                        //校验真实姓名
                        wyn.create.maskText('姓名格式不正确', {
                            top: '30%',
                            'transform': 'translate(-50%,-50%)',
                            width: '190px',
                            'line-height': '1.6',
                            padding: '16px 10px'
                        }, 'icon-login-sigh,icon-sigh', 2000)
                    } else {
                        if (!wyn.judge.input.phoneNumber(userPhone.val().replace(/ |-/g,''))) {
                            //校验手机号和密码格式
                            wyn.create.maskText('手机号格式不正确', {
                                top: '30%',
                                'transform': 'translate(-50%,-50%)',
                                width: '190px',
                                'line-height': '1.6',
                                padding: '16px 10px'
                            }, 'icon-login-sigh,icon-sigh', 2000)
                        } else {
                            /*var saveDate={
                                'name':$('[name=user-name]').val(),
                                'phone':$('[name=user-phone]').val(),
                                'doctor_id':location.href.match(/\d*$/)[0] || 28
                            }*/
                            if (!codeRep.test(userCode.val())) {
                                //验证码格式校验
                                wyn.create.maskText('请输入4位数字验证码', {
                                    top: '30%',
                                    'transform': 'translate(-50%,-50%)',
                                    width: '190px',
                                    'line-height': '1.6',
                                    padding: '16px 10px'
                                }, 'icon-login-sigh,icon-sigh', 1500)
                            } else {
                                wyn.create.maskText('提交中，请稍后', {
                                    top: '30%',
                                    'transform': 'translate(-50%,-50%)',
                                    width: '190px',
                                    'line-height': '1.6',
                                    padding: '16px 10px'
                                }, 'icon-login-sigh,icon-sigh')
                                /*验证码校验*/
                                $.ajax({
                                    url: ajaxUrl+'/v1_3/wx/member/matecode',
                                    data: codeData,
                                    type: 'post',
                                    success: function (data) {
                                        data = JSON.parse(data);
                                        console.log(data);
                                        if (data.code == -1) {
                                            /*wyn.create.maskText(data.msg, {
                                                top: '50%',
                                                transform: 'translate(-50%,-50%)',
                                                padding: '10px 20px',
                                                'line-height': '1.4'
                                            }, null, 2000);*/
                                            alert('该手机号已被注册，请更换手机号')

                                        } else {
                                            var saveDate={
                                                'name':$('[name=user-name]').val(),
                                                'phone':$('[name=user-phone]').val(),
                                                'doctor_id':location.href.match(/\d*$/)[0] || 28
                                            }
                                            $.ajax({
                                                type: 'post',
                                                url: ajaxUrl+'/v1_3/wx/member/save',
                                                data: saveDate,
                                                success: function (data) {
                                                    data = JSON.parse(data);
                                                    console.log(data)
                                                    console.log(this.data)
                                                    if (data.code == -1) {
                                                        wyn.create.maskText(data.msg, {
                                                            top: '50%',
                                                            transform: 'translate(-50%,-50%)',
                                                            padding: '10px 20px',
                                                            'line-height': '1.4'
                                                        }, null, 2000);
                                                    }else {
                                                        location.href='../../common/registerSucceed.html#user';
                                                    }
                                                }
                                            })
                                        }
                                    }
                                });

                                /*跳过短信验证*/
                                /*
                                 var saveDate={
                                 'name':$('[name=user-name]').val(),
                                 'phone':$('[name=user-phone]').val(),
                                 'doctor_id':location.href.match(/\d*$/)[0] || 28
                                 }
                                $.ajax({
                                    type: 'post',
                                    url: ajaxUrl+'/v1_3/wx/member/save',
                                    data: saveDate,
                                    success: function (data) {
                                        data = JSON.parse(data);
                                        console.log(data)
                                        console.log(this.data)
                                        if (data.code == -1) {
                                            wyn.create.maskText(data.msg, {
                                                top: '50%',
                                                transform: 'translate(-50%,-50%)',
                                                padding: '10px 20px',
                                                'line-height': '1.4'
                                            }, null, 2000);
                                        }else {
                                            wyn.create.maskText('登记成功', {
                                                top: '30%',
                                                'transform': 'translate(-50%,-50%)',
                                                width: '190px',
                                                'line-height': '1.6',
                                                padding: '16px 10px'
                                            }, 'icon-login-sigh,icon-sigh', 1200)
                                            setTimeout(function(){
                                                location.href='../../common/registerSucceed.html#user';
                                            },1000)

                                        }
                                    }
                                })*/
                            }
                        }
                        /*//格式校验成功
                         wyn.create.maskText('&nbsp;加载中...', {
                         top: '50%',
                         'transform': 'translate(-50%,-50%)',
                         width: '180px',
                         'line-height': '1.6',
                         padding: '16px 10px'
                         }, 'icon-login-sigh,icon-loading', 4000)*/
                    }
                }
            }
        };
    });
})