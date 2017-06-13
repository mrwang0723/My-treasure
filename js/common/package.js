/**
 * Created by Administrator on 2017/4/19 0019.
 */
var is_package = false;

$(function () {
    var nowDate = getDateStr(new Date, "yyyy-MM-dd");
    $('#start_time input').val(nowDate);

    /*开具发票开关*/
    $(document).on('change', '[name=invoice]', function () {
        if ($(this).is(":checked")) {
            $('.bill-box').css('height', '102px')
        } else {
            $('.bill-box').css('height', 0)
        }
    });
    /*发票选择个人或公司*/
    $(document).on('change', '[name=invoice_type]', function () {
        if (this.value == '个人') {
            $('[name=invoice_title]').text('请填写个人或姓名')
            $('[name=invoice_title]').attr('placeholder', '请填写个人或姓名')


        } else if (this.value == '公司') {
            $('[name=invoice_title]').text('请填写公司名称')
            $('[name=invoice_title]').attr('placeholder', '请填写公司名称')
        }
    });
});

/*packageList页获取康复包列表*/
function getPackageList() {
    $.post(ajaxUrl + '/v1_3/wx/member/is_package', function (data) {
        data = JSON.parse(data);
        console.log(data);
        if (data.code != -1) {
            is_package = true;
        }
    })
    $.ajax({
        url: ajaxUrl + '/v1_3/wx/member/template_list',
        type: 'post',
        cache: true,
        success: function (data) {
            var code = JSON.parse(data)['code']
            console.log(JSON.parse(data));
            if (code == -1) {
                var noPackageText = '<div class="no-package">\
                    <img width="50%" src="../../images/common/icon_member_news_kffeb@2x.png">\
                    <p>暂时没有康复包</p>\
                </div>'
                $('.package-list-box').append(noPackageText);
                setTimeout(function () {
                    window.removeLoading()
                }, 500);
                return false;
            }
            data = JSON.parse(data).datas
            var packageItem = '';
//                data[i]['is_buy']=true;
            for (var i in data) {
                var buyText = Boolean(data[i]['is_buy']) ? '已购买' : '购买>'
                var img = Boolean(data[i]['img']) ? data[i]['img'] : '../../images/common/pricing-6.png';
                var buyClass = Boolean(data[i]['is_buy']) ? 'c-c' : '';
                packageItem += '<div class="package-item bc-f mar-b-10">'
                packageItem += '   <div id="' + data[i]['template_id'] + '" class="package-item-content webkitBox">'
                packageItem += '      <div style="background-image:url(' + img + ')" class="package-img"></div>'
                packageItem += '       <div class="web-b-f-1">'
                packageItem += '         <h3>' + data[i]['subject'] + '</h3>'
                packageItem += '         <p>' + data[i]['objective'] + '</p>'
                packageItem += '          <span class="b-1-e1">所属病种类：' + data[i]['disease_name'] + '</span>'
                packageItem += '       </div>'
                packageItem += '  </div>'
                packageItem += '   <ul class="package-btn webkitBox">'
                packageItem += '      <li>' + data[i]['amount'] + '</li>'
                packageItem += '     <li class="web-b-f-1">' + data[i]['num'] + '人付款</li>'
                packageItem += '      <li class="relative"><a class="' + buyClass + '" data-buy="' + data[i]['is_buy'] + '" data-href="../common/buyPackage.html#' + data[i]['template_id'] + '">' + buyText + '</a></li>'
                packageItem += '  </ul>'
                packageItem += '</div>';
            }
            $('.package-list-box').append(packageItem);
            setTimeout(function () {
                window.removeLoading()
            }, 500)
        }
    })
}

/*购买按钮*/
wyn.bind.touchEnd('.package-btn a', function (obj) {
    //alert($(obj).parents('.package-item').find('.package-item-content')[0].id)
    if (!$(obj).hasClass('true')) {
        /*if (is_package) {
         alert('已经买过康复包不能再买啦！')
         } else {
         var _this = $(obj).parents('.package-item').find('.package-item-content');
         //var is_buy = _this.parents('.package-item').find('a').attr('data-buy')
         var url = '../common/packageDetails.html#' + _this[0].id;
         location.href = url;
         }*/
        var _this = $(obj).parents('.package-item').find('.package-item-content');
        //var is_buy = _this.parents('.package-item').find('a').attr('data-buy')
        var url = '../common/packageDetails.html#' + _this[0].id;
        location.href = url;

    }
});

//跳转到康复包详情
wyn.bind.touchEnd('.package-item-content', function (obj) {
    if (location.href.indexOf('buyPackage') != -1) return;
    var _this = $(obj).hasClass('package-item-content') ? $(obj) : $(obj).parents('.package-item-content');
    //var is_buy = _this.parents('.package-item').find('a').attr('data-buy')
    var url = '../common/packageDetails.html#' + _this[0].id;

    //如果是已经购买的康复包
    /*if (is_buy != 'false') {
     url = '../common/packageDetailsPurchased.html#' + _this[0].id;
     }*/

    _this.parents('.package-item').css('background-color', 'rgba(0,0,0,.3)!important;')
    location.href = url;
    //location.replace(url) ;
    //alert($(obj).parents('.package-item').find('a').attr('data-href'))
    //location.href = $(obj).parents('.package-item').find('a').attr('data-href')
});

/*加载订单页*/

/*点击更换、添加收货地址*/
wyn.bind.touchEnd('.shipping-address-box', function () {
    var url = '../../page/user/shippingAddress/main.html' + location.hash
    $.session.set('buyPackage', location.href);
    location.href = url;
});

/*
 /!*隐藏显示右侧输入页面*!/
 wyn.onHashChange(function (hash) {
 if (hash.indexOf('order_no') == -1) {
 $('.pay-box').removeClass('show');
 } else {
 $('.pay-box').addClass('show');
 $('[type=date]').blur()
 }
 if(hash.indexOf('buyer_msg')!=-1){
 $('[type=date]').blur()
 }else {
 $('.edit-text-box').removeClass('show')
 $('[type=text]').blur()
 }
 });
 */

/*隐藏显示右侧输入页面*/
wyn.onHashChange(function (hash) {
    if (hash.indexOf('order_no') == -1) {
        $('.pay-box').removeClass('show');
    } else {
        $('.pay-box').addClass('show');
        if ($('[type=date]')[0] == document.activeElement) {
            $('[type=date]').blur()
        }
    }
    if (hash.indexOf('buyer_msg') != -1 || hash.indexOf('invoice_title') != -1) {
        $('[type=date]').blur()
    } else {
        $('.edit-text-box').removeClass('show')
        if ($('[type=tetx]')[0] == document.activeElement) {
            $('[type=text]').blur()
        }
    }
    var iObj = $('.order-form i');
    if ($('[data-class=buyer_msg]')[0]) {
        if ($('[data-class=buyer_msg]').text() != '选填：对本次订单的说明') {
            $('[data-class=buyer_msg]').addClass('c-6')
        } else {
            $('[data-class=buyer_msg]').removeClass('c-6')
        }
    }
    ;
    if ($('[data-class=invoice_title]')[0]) {
        if ($('[data-class=invoice_title]').text() != '请填写个人或姓名' && $('[data-class=invoice_title]').text() != '请填写公司名称') {
            $('[data-class=invoice_title]').addClass('c-6')
        } else {
            $('[data-class=invoice_title]').removeClass('c-6')
        }
    }
    ;
});

/*隐藏显示右侧输入页面*/
wyn.bind.touchEnd('[name=buyer_msg],[name=invoice_title]', function (obj) {
    var iObj = $('.order-form i');
    console.log(iObj)
    location.hash += $(obj).attr('name');
    if ($('.edit-text-box textarea')[0]) {
        $('.edit-text-box textarea').remove()
    }
    $('.edit-text-box label').append('<textarea rows="2" maxlength="35" style="text-align: justify;line-height: 1.4;padding-top: 8px;"></textarea>')
    /*<input style="padding-right: 44px;" placeholder="选填：对本次订单的说明" required="" name="edit-name" value="心率带尺码L,设备未取，待发货的">*/
    var textObj = $(obj).siblings('input');
    /*给输入框赋值*/
    $('.edit-text-box textarea').attr({placeholder: textObj.attr('placeholder'), value: textObj.val()});
    $('.edit-text-box textarea').text(textObj.val());
    $('.edit-text-box p').text(textObj.attr('placeholder'));
    var _this = obj;
    $('.edit-text-box').addClass('show');

    wyn.bind.touchEnd('.edit-text-box button', function (button) {
        var text = $(button).parents('.edit-text-box').find('textarea');
        text.blur();
        if (text.val().trim()) {
            $(_this).siblings('input').val(text.val());
            $(_this).text(text.val());
            textObj.val(text.val());
            if (location.hash.indexOf('buyer_msg') != -1) {
                $.session.set('conditionText', text.val())
            }
        }
        window.history.back();
    })
});

/*点击确认订单时生成订单*/
wyn.bind.touchEnd('.buy-pay button', function () {
    createOrder();
});


/*选择生效日期*/
$(document).on('input', '#start_time input', function () {
    var now = new Date();
    var minDate = getDateStr(now, "yyyy-MM-dd");
    var _this = event.target;
    var maxDate = getDateStr(new Date(Date.now() + 432000000), "yyyy-MM-dd");
    var setDate = new Date(_this.value.replace(/-/g, "/"));
    now.setHours(0);
    now.setMilliseconds(0);
    now.setMinutes(0);
    now.setSeconds(0)
    if (setDate - now > 432000000) {
        wyn.create.maskText('不能选择5天以后哦', {padding: '10px 15px', width: '160px', top: '30%'}, null, 2000);
        $(_this).siblings('input').val(maxDate);
        $(_this).val(maxDate);
    } else if (setDate - now < 0) {
        wyn.create.maskText('不能选择今天之前哦', {padding: '10px 15px', width: '190px', top: '30%'}, null, 2000)
        $(_this).siblings('input').val(minDate);
        $(_this).val(minDate);
    } else {
        $(_this).siblings('input').val(_this.value);
    }
});


/*获取默认收货地址*/
function getAddress() {
    var addressText = '';
    var address = $.session.get('address');
    //{"msg":"获取成功","datas":[{"address_id":"186","member":"90","nickname":"jjjj","phone":"6666","body":"斤斤计较","create_time":"2016-09-02 10:57:38","update_time":"2016-09-02 10:57:38","status":"0"}],"code":0,"tag":"YES"}
    if (address != undefined) {
        address = JSON.parse(address);
        addressText = '<div class="shipping-address-box bc-f bor-b-10-e">\
                        <div class="shipping-address icon-go">\
                            <h3>' + address['nickname'] + '<span class="fright">' + address['phone'] + '</span></h3>\
                            <p>' + address['body'] + '</p>\
                        </div>\
                        <input type="hidden" name="address_id" value="' + address['address_id'] + '">\
                    </div>'
        getIndent(addressText);
    } else {
        $.ajax({
            url: ajaxUrl + '/v1_3/wx/address/thread',
            type: 'post',
            success: function (data) {
                /*if (JSON.parse(data).code == -1) {
                 wyn.create.maskText(JSON.parse(data).msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                 console.log(JSON.parse(data).msg)
                 return false;
                 } else {*/
                data = JSON.parse(data).datas;
                console.log(data);
                if (!data.length) {
                    addressText = ' <div class="shipping-address-box bc-f bor-b-10-e">\
                            <div class="no-address icon-go" style="color:#a9a9a9;line-height:1.4;text-align: center;font-size:14px;">您还未设置收货地址<br>可选择：<strong>购买后补充</strong>&nbsp;或者立即添加</div>\
                            <input type="hidden" name="address_id" value="">\
                    </div>'
                } else {
                    var isStatus = true;
                    for (var i in data) {

                        /*如果有默认收货地址*/
                        if (Number(data[i]['status'])) {
                            addressText = '<div class="shipping-address-box bc-f bor-b-10-e">\
                        <div class="shipping-address icon-go">\
                            <h3>' + data[i]['nickname'] + '<span \
class="fright">' + data[i]['phone'] + '</span></h3>\
                            <p>' + data[i]['body'] + '</p>\
                        </div>\
                        <input type="hidden" name="address_id" value="' + data[i]['address_id'] + '">\
                    </div>'
                            isStatus = false;
                        }
                    }
                    /*如果有地址没有默认收货地址 选择列表里的第一个*/
                    if (isStatus) {
                        addressText = '<div class="shipping-address-box bc-f bor-b-10-e">\
                        <div class="shipping-address icon-go">\
                            <h3>' + data[0]['nickname'] + '<span \
class="fright">' + data[0]['phone'] + '</span></h3>\
                            <p>' + data[0]['body'] + '</p>\
                        </div>\
                        <input type="hidden" name="address_id" value="' + data[0]['address_id'] + '">\
                    </div>'
                    }
                }
                getIndent(addressText);
            }
        });
    }
}


/*生成订单*/
function createOrder() {
    $('.pay-title strong').text($('[name=amount]').eq(0).val() + '元');
    console.log($('.order-form').serialize())
    $.ajax({
        url: ajaxUrl + '/v1_3/wx/order/save',
        type: 'post',
        data: $('.order-form').serialize(),
        success: function (data) {
            console.log(JSON.parse(data));
            console.log(this.data)
            if (JSON.parse(data).code == -1) {
                wyn.create.maskText(JSON.parse(data).msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                return false;
            } else {
                data = JSON.parse(data).datas['order_no'];
                location.hash += ("&order_no");
                $.session.set('date', $('[name=start_time]').val())
                $('[name=order_no]').val(data);
            }
        }
    })
}

/*获取订单信息*/
function getIndent(addressText) {
    var template_id = location.hash.replace('#', '');
    addressText = addressText || '';
    $.ajax({
        url: ajaxUrl + '/v1_3/wx/member/template',
        data: {template_id: template_id},
        type: 'post',
        success: function (data) {
            console.log(JSON.parse(data));
            if (JSON.parse(data).code == -1) {
                wyn.create.maskText(JSON.parse(data).msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                return false;
            } else {
                var sizeText = $.session.get('sizeText');
                var conditionText = $.session.get('conditionText');
                var sizeTextAndConditionText = '选填：对本次订单的说明';
                console.log(sizeText);
                console.log(conditionText);
                if (!!conditionText) {
                    if (!!$.session.get('sizeText')) {
                        sizeTextAndConditionText = '心率带尺码' + $.session.get('sizeText') + ','
                        sizeTextAndConditionText += $.session.get('conditionText')
                    } else {
                        sizeTextAndConditionText = $.session.get('conditionText')
                    }
                }
                console.log(sizeTextAndConditionText)
                var services = JSON.stringify(JSON.parse(data).datas['services']);
                data = JSON.parse(data).datas['template'];
                var img = Boolean(data['img']) ? data['img'] : '../../images/common/pricing-6.png';
                var nowDate = getDateStr(new Date, "yyyy-MM-dd");
                var services = {
                    text: data.service_text,
                    voice: data.service_voice,
                    video: data.service_video,
                    assess: data.service_assess,
                    ecg: data.service_ecg
                };
                console.log(JSON.stringify(services))
                /*<input type="hidden" name="service_text" value=' + data.service_text + '>\
                 <input type="hidden" name="service_voice" value=' + data.service_voice + '>\
                 <input type="hidden" name="service_video" value=' + data.service_video + '>\
                 <input type="hidden" name="service_assess" value=' + data.service_assess + '>\
                 <input type="hidden" name="service_ecg" value=' + data.service_ecg + '>\ <input type="hidden" name="service" value="' + JSON.stringify(service) + '">\*/
                addressText = addressText + ' <div class="buy-package-package bc-f package-item-content bor-b-10-e webkitBox">\
                        <input type="hidden" name="template_id" value="' + data['template_id'] + '">\
                        <input type="hidden" name="services" value=' + JSON.stringify(services) + '>\
                        <div  style="background-image:url(' + img + ')"  class="package-img"></div>\
                        <div class="web-b-f-1">\
                            <h3>' + data['subject'] + '</h3>\
                            <p>' + data['objective'] + '</p>\
                            <span class="pad-0 c-6">所属病种：' + data['disease_name'] + '<s class="buy-package-package-price">￥' + data['amount'] + '</s></span>\
                            <input name="amount" type="hidden" value="' + data['amount'] + '">\
                        </div>\
                    </div>\
                    <!--填写的信息-->\
                    <ul class="input-form-box bor-b-10-e">\
                        <li class="input-text webkitBox leave-word">\
                            <p>买家留言</p>\
                            <label class="web-b-f-1 relative">\
                                <input type="hidden" name="buyer_msg" placeholder="选填：对本次订单的说明" value="' + sizeTextAndConditionText + '">\
                                <i class="no-wrap" data-class="buyer_msg" name="buyer_msg">' + sizeTextAndConditionText + '</i>\
                            </label>\
                            <span class="icon-go"></span>\
                        </li>\
                        <li id="start_time" class="input-text webkitBox">\
                            <p>康复包生效日期</p>\
                            <label class="web-b-f-1 relative">\
                                <input class="op-0" min="2017-5-20" max="2017-5-25" type="date">\
                                <input type="button" name="start_time" value="' + nowDate + '">\
                                <input type="hidden" name="start_time" value="' + nowDate + '">\
                            </label>\
                            <span class="icon-go"></span>\
                        </li>\
                    </ul>\
                     <ul class="buy-form input-form-box">\
                        <li class="input-text webkitBox">\
                            <p>开具发票</p>\
                            <label for="switchCP" class="btn-off">\
                                <input id="switchCP" name="invoice" class="weui-switch-cp__input op-0" type="checkbox">\
                                <div class="weui-switch-cp__box"></div>\
                            </label>\
                        </li>\
                        <div class="bill-box">\
                            <li class="input-text input-select webkitBox">\
                                <p>发票类型</p>\
                                <p>\
                                    <label>\
                                        <input type="radio" name="invoice_type" value="公司"><span class="icon-right">公司</span>\
                                    </label>\
                                    <label>\
                                        <input type="radio" name="invoice_type" checked value="个人"><span class="icon-right">个人</span>\
                                    </label>\
                                </p>\
                            </li>\
                            <li class="input-text webkitBox select-data">\
                                <p>发票抬头</p>\
                                <label class="web-b-f-1 relative">\
                                    <input type="hidden" name="invoice_title" placeholder="请填写个人或姓名">\
                                    <i class="no-wrap" data-class="invoice_title" name="invoice_title">请填写个人或姓名</i>\
                                </label>\
                                <span class="icon-go"></span>\
                            </li>\
                        </div>\
                    </ul>\
                    <div class="buy-pay">\
                        <button type="button">确认订单</button>\
                    </div>'
                $('.order-form').append(addressText);
                console.log($('[name=services]').val())
                $.session.set('subject', data['subject'])
                window.removeLoading();
            }
        }
    })
}

/*支付*/
wyn.bind.touchEnd('[name=btn-pay]', function (obj) {
    pay($('.pay-form').serialize());
});

function pay(data) {
    console.log($('.pay-form').serialize())
    if ($('.pay-form strong').text() == '0.00元') {
        var url = '/v1_3/member/callback/' + $('[name=order_no]').val() + '/' + md5(md5($('[name=order_no]').val()) + 'key');
        $.get(url, function (data) {
            if (JSON.parse(data).code == -1) {
                wyn.create.maskText(JSON.parse(data).msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                return false;
            } else {
                createPaySucceed();
            }
        })
    } else {
        $.ajax({
            url: ajaxUrl + '/v1_3/wx/order/pay',
            type: 'post',
            data: data,
            success: function (data) {
                console.log(JSON.parse(data))
                if (JSON.parse(data).code == -1) {
                    wyn.create.maskText(JSON.parse(data).msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                    return false;
                } else {
                    data = JSON.parse(data).datas;
                    //data.channel='wx_pub';
                    //wx.config({wxData});
                    pingpp.createPayment(data, function (result, err) {
                        if (result == "success") {
                            createPaySucceed();
                            // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的支付结果都会跳转到 extra 中对应的 URL。
                        } else if (result == "fail") {
                            // charge 不正确或者微信公众账号支付失败时会在此处返回
                        } else if (result == "cancel") {
                            // 微信公众账号支付取消支付
                        }
                    });
                }
            }
        })
    }
}


/*支付弹出框*/
function createPaySucceed() {
    var name = $.session.get('subject') ? $.session.get('subject') : '';
    var date = $.session.get('date') ? $.session.get('date').split('-') : "";
    date = date[0] + '年' + date[1] + '月' + date[2] + '日'
    var text = ' <div class="pay-mask-box">\
            <div class="mask-bg"></div>\
            <div class="pay-mask-content bor-radius-10">\
                <img src="../../images/common/img_member_fkcg_nav@2x.png">\
                <h3>付款成功！</h3>\
                <p>感谢您选择康乃心！<br>\
                    您购买的“' + name + '”付款成功，以下内容请您知晓：</p>\
                <span>①.健康服务计划将于' + date + '开始生效。<br>②.服务包配套的设备将在5个工作日内送达您指定的收货地址。<br>\
        ③.配套设备到货之前，康乃心平台赠送您5天的体验时间。<br>\
        ④.拍照上传您的健康档案（服药情况、病史病历等），以便主管医生审核，为您量身定制健康服务计划。</span>\
                <button class="bor-t-1-e touch-feedback" type="button">确定</button>\
            </div>\
        </div>'
    $('body').append(text);
    wyn.bind.touchEnd('.pay-mask-box button', function (obj) {
        location.replace(ajaxUrl + '/public-platform/page/user/myDoctor/main.html')
    })
}