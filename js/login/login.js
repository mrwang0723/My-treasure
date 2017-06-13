/**
 * Created by xinyunhengan on 2017/3/27.
 */
$(function () {
    setTimeout(function(){
        window.removeLoading();
    },500)

    wyn.reloadPage();
    /*登录验证*/
    wyn.bind.touchEnd('[name=user-submit]', function () {
        var userPhone = $('[name=user-phone]');
        var userPassword = $('[name=user-password]');
        var userCode = $('[name=user-code]');
        if (!userPhone.val()) {
            //判断手机号是否为空
            wyn.create.maskText('手机号不能为空', {
                width: '200px',
                height: '52px',
                top: '50%',
                transform: 'translate(-50%,-50%)',
                WebKitTransform: 'translate(-50%,-50%)',
                'line-height': '52px'
            }, null, 2000)
        } else {
            if (!userPassword.val()) {
                //判断密码是否为空
                wyn.create.maskText('密码不能为空', {
                    width: '200px',
                    height: '52px',
                    top: '50%',
                    transform: 'translate(-50%,-50%)',
                    WebKitTransform: 'translate(-50%,-50%)',
                    'line-height': '52px'
                }, null, 2000)
            } else {
                if (userCode[0] && !userCode.val()) {
                    //判断验证码是否为空
                    wyn.create.maskText('验证码不能为空', {
                        width: '200px',
                        top: '50%',
                        transform: 'translate(-50%,-50%)',
                        height: '52px',
                        'line-height': '52px'
                    }, null, 2000)
                } else {
                    $('.user-input input').blur();
                    var codeRep = /\d{4}/;
                    // if (!wyn.judge.input.phoneNumber(userPhone.val()) || !wyn.judge.input.password(userPassword.val(),6,20)) {
                    //     //校验手机号和密码格式
                    //     wyn.create.maskText('您输入的手机号或密码不正确，请重新输入', {
                    //         top: '50%',
                    //         'transform': 'translate(-50%,-50%)',
                    //         width: '190px',
                    //         'line-height': '1.6',
                    //         padding: '16px 10px'
                    //     }, 'icon-login-sigh,icon-sigh', 2000)
                    // } else {
                    //     if (userCode[0] && !codeRep.test(userCode.val())) {
                    //         //验证码格式校验
                    //         wyn.create.maskText('您输入的验证码格式不正确，请重新输入', {
                    //             top: '50%',
                    //             'transform': 'translate(-50%,-50%)',
                    //             width: '190px',
                    //             'line-height': '1.6',
                    //             padding: '16px 10px'
                    //         }, 'icon-login-sigh,icon-sigh', 2000)
                    //     } else {
                    var url = ajaxUrl + '/v1_3/wx/login';
                    wyn.create.maskText('登录中', {'padding': '10px 20px', top: '50%'}, null,null)
                    $.ajax({
                        url: url,
                        type: 'post',
                        dataType: "json",
                        data: {phone: userPhone.val(), password: userPassword.val()},
                        success: function (data) {
                            console.log(data);
                            if (data.code == 0) {
                                    wyn.create.maskText('登陆成功', {'padding': '10px 20px', top: '50%'}, null,2000)

                                location.replace("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa2c63a415badd00b&redirect_uri=" + ajaxUrl + "/v1_3/wx/logins/" + data.datas.phone + "/" + data.datas.password + "&response_type=code&scope=snsapi_base&state=123#wechat_redirect");
                            } else {
                                wyn.create.maskText(data.msg, {
                                    top: '50%',
                                    'transform': 'translate(-50%,-50%)',
                                    width: '190px',
                                    'line-height': '1.6',
                                    padding: '16px 10px'
                                }, 'icon-login-sigh,icon-sigh', 2000)
                            }
                        }
                    })
                }
                ;
            }
            ;
        }
        ;
    });
});