$(function () {
    /**
     * Created by xinyunhengan on 2017/3/28.
     */
    wyn.bind.touchEnd('.icon-small-close', function () {
        $(event.target).siblings('label').find('input').val('').focus();
        $(event.target).css('visibility', 'hidden');
        $('[name=user-submit]')[0].disabled = 'true';
    });

    /*显示隐藏密码*/
    wyn.bind.touchEnd('.user-password i', function () {
        var state = $(event.target).siblings('label').find('input').attr('type');
        $(event.target).toggleClass('icon-password-show').siblings('label').find('input').attr('type', state == 'password' ? 'text' : 'password')
    });

    /*显示隐藏清空按钮*/
    $(document).on('keyup focus', '.user-input li input', function () {
        $(this).parents('label').siblings('span').css('visibility', $(this).val() ? 'visible' : 'hidden');
    });
    $(document).on('blur', '.user-input li input', function () {
        $(this).parents('label').siblings('span').css('visibility', 'hidden')
    })
    /*校验提交按钮*/
    $(document).on('keyup', '[name=user-password],[name=user-password-again]', function () {
        if ($('[name=user-password]').val().length < 6 || $('[name=user-password-again]').val().length < 6) {
            $('[name=user-submit]')[0].disabled = true;
        } else {
            $('[name=user-submit]')[0].disabled = false;
        }
    });

    wyn.bind.touchEnd('[name=user-submit]', function () {
        judgePassword();
    });

    function judgePassword() {
        var flag = $('[name=user-password]').val() === $('[name=user-password-again]').val();
        if (!$('[name=user-password]').val()) {
            wyn.create.maskText('密码不能为空', {
                top: '30%',
                'transform': 'translate(-50%,-50%)',
                width: '190px',
                'line-height': '1.6',
                padding: '16px 10px'
            }, 'icon-login-sigh,icon-sigh', 2000)
        } else {
            if (!$('[name=user-password-again]').val()) {
                wyn.create.maskText('请再次输入密码', {
                    top: '30%',
                    'transform': 'translate(-50%,-50%)',
                    width: '190px',
                    'line-height': '1.6',
                    padding: '16px 10px'
                }, 'icon-login-sigh,icon-sigh', 2000);
            } else {
                if (!wyn.judge.input.password($('[name=user-password]').val(), 6, 20) || !wyn.judge.input.password($('[name=user-password-again]').val(), 6, 20)) {
                    wyn.create.maskText('密码格式不正确，请重新输入', {
                        top: '30%',
                        'transform': 'translate(-50%,-50%)',
                        width: '190px',
                        'line-height': '1.6',
                        padding: '16px 10px'
                    }, 'icon-login-sigh,icon-sigh', 2000);
                } else {
                    if (!flag) {
                        wyn.create.maskText('两次密码不一致请重新输入', {
                            width: '140px',
                            top: '30%',
                            transform: 'translate(-50%,-50%)',
                            'line-height': '1.6',
                            padding: '16px 10px',
                        }, 'icon-login-sigh,icon-sigh', 2000);
                    } else {
                        var _data={
                            phone:$.session.get('phone'),
                            doctor_id:$.session.get('doctor_id'),
                            name:$.session.get('user-name'),
                            password:$('[name=user-password]').val()
                        }
                        $.ajax({
                            type: 'post',
                            url: 'https://www.cardiocloud.cn/v1_3/wx/member/save',
                            data: _data,
                            success: function (data) {
                                data = JSON.parse(data);
                                console.log(data);
                                if (data.code == -1) {
                                    console.log(this.data)
                                    wyn.create.maskText(data.msg, {
                                        top: '50%',
                                        transform: 'translate(-50%,-50%)',
                                        padding: '10px 20px',
                                        'line-height': '1.4'
                                    }, null, 2000);
                                }else {
                                    location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx767942a595048082&redirect_uri=https://www.cardiocloud.cn/v1_3/wx/register/'+data.datas.member_id+'&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
                                }
                            }
                        })
                    }
                    ;
                }
                ;
            }
            ;
        }
        ;
    };

    function addBox() {
        var box = '<div class="password-success-box mask-box">';
        box += '<div class="success-bg mask-bg"></div>';
        box += '<div class="password-success-content mask-content">';
        box += '<h3>登记成功</h3>';
        box += '<h4>恭喜您！</br>获得<i>10</i>元红包</h4>';
        box += '<p>您已成为<i>＊＊＊</i>的会员</p>';
        box += '<div class="password-success-icon-box">';
        box += '<h5>代金券</h5>';
        box += '<h2><s>10</s>元</h2>';
        box += '</div>';
        box += '<button class="btn-close" type="button">确定</button>';
        box += '</div>';
        box += '</div>';
        return box;
    };

});