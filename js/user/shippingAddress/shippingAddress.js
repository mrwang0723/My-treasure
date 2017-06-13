/**
 * Created by xinyunhengan on 2017/3/31.
 */
$(function () {
    $(document).on('touchmove', '.mask-bg,.select-prompt-box', function () {
        wyn.stop.stopDefault();
    })

    /*编辑*/
    wyn.bind.touchEnd('.operation-btn-box .icon-editor,[name=btn-address]', function () {
        if ($(event.target).parents('.address-item')[0]) {
            var item = $(event.target).parents('.address-item')[0].getAttribute('data-datas');
            window.location.href = 'addAddress.html#' + item;
        } else
            window.location.href = 'addAddress.html'
    });
    /*设置默认收货地址*/
    wyn.bind.touchEnd('.operation-btn-box .icon-yes', function (obj) {
        wyn.create.maskText('',{width:'60px',height:'60px',top:'30%',background:'url(../../../images/common/loading.gif) center no-repeat','background-size':'60px'})
        if (!$(event.target).hasClass('status')) {
            var datas = $(obj).parents('.address-item').attr('data-datas');
            datas = JSON.parse(datas)
            datas.status = 1;
            $.ajax({
                url: ajaxUrl + '/v1_3/wx/address/save',
                data: datas,
                type: 'post',
                success: function (data) {
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.code == -1) {
                        wyn.create.maskText(data.msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                        return false;
                    }else {
                        $('#maskText').remove()
                    }
                }
            });
            $('.operation-btn-box .icon-yes').removeClass('status');
            $(event.target).addClass('status');
        }
    })

    /*删除地址*/
    wyn.bind.touchEnd('.operation-btn-box .icon-delete', function () {
        wyn.create.selectPrompt('确定要删除该地址吗？', function () {
            var item = $(event.target).parents('.address-item');
            var data = {address_id: item[0].id}
            wyn.bind.touchEnd('.btn-yes', function () {
                var box = $(event.target).parents('.select-prompt-box');
                $.ajax({
                    url: ajaxUrl + '/v1_3/wx/address/del',
                    data: data,
                    type: 'post',
                    success: function (data) {
                        console.log(JSON.parse(data));
                        if (JSON.parse(data).code == -1) {
                            wyn.create.maskText(JSON.parse(data).msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                            return false;
                        } else {
                            item.remove();
                            box.animate({opacity: 0}, 300, function () {
                                box.remove();
                            })
                            if (!!!$('.address-item')[0]) {
                                window.location.reload();
                            }
                        }
                    }
                });
            });
        })
    })
})

/*获取收货地址*/
function getAddressList() {
    $.ajax({
        url: ajaxUrl + '/v1_3/wx/address/thread',
        type: 'post',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            window.removeLoading();
            if (data.code == -1) {
                var text = '';
                text += '    <div class="no-address-box user-input">'
                text += '         <div class="address-bg"></div>'
                text += '    <p>您还没有设置收货地址哦</br>赶快去添加吧</p>'
                text += '    <button type="button" name="btn-address">添加新地址</button>'
                text += '</div>'
                $('body').append(text)
                return;
            } else {
                var text = '';
                for (var i in data['datas']) {
                    if (!!!data['datas'][i]['nickname']) continue;
                    delete data.datas[i]['update_time'];
                    delete data.datas[i]['create_time'];
                    var datas = JSON.stringify(data.datas[i])
                    var status = data.datas[i]['status'] == 1 ? 'status' : '';

                    text += '      <div id="' + data.datas[i]['address_id'] + '" data-datas=' + datas + ' class="address-item">'
                    text += '            <div class="set-address touch-feedback">'
                    text += '               <h3><span class="nickname">' + data.datas[i]['nickname'] + '</span><s class="phone fright">' + data.datas[i]['phone'] + '</s></h3>'
                    text += '            <p class="body">' + data.datas[i]['body'] + '</p>'
                    text += '           </div>'
                    text += '           <ul class="operation-btn-box bor-t-1-e">'
                    text += '                <li class="icon-yes ' + status + '">默认地址</li>'
                    text += '               <li class="icon-delete">删除</li>'
                    text += '               <li class="icon-editor">编辑</li>'
                    text += '           </ul>'
                    text += '       </div>'
                }
                $('.address-list-box').append(text)
                $('.address-btn').removeClass('hidden');
            }
        }
    })
}

/*新增收货地址*/
$(document).on('touchend', '.address-btn', function () {
    var _this = event.target, name = $('[name=nickname]').val().trim(), phone = $('[name=phone]').val().replace(/ |-/g, ''), body = $('[name=body]').val().trim()
    if (_this.off) return false;
   /* if (!wyn.judge.input.name(name)) {
        wyn.create.maskText('请输入正确的收货人', {padding: '10px', width: '160px', top: '30%'}, null, 1000)
        return false
    } else */
    if (!wyn.judge.input.phoneNumber(phone)) {
        wyn.create.maskText('请输入正确手机号', {padding: '10px', width: '160px', top: '30%'}, null, 1000)
        return false;
    } else if (body.length < 5) {
        wyn.create.maskText('详细地址不可少于5个字', {padding: '10px', width: '180px', top: '30%'}, null, 1000)
        return false;
    } else {
        wyn.create.maskText('正在提交', {padding: '10px 15px', top: '50%'}, null);
        $('[name=body]').val($('[name=body]').val().trim())
        _this.off = true
        var status = Number($('[type=checkbox]').is(':checked'));
        var datas = ($('form').serialize() + '&status=' + status).replace(/%20|-/g, '');
        $.ajax({
            url: ajaxUrl + '/v1_3/wx/address/save',
            data: datas,
            type: 'post',
            success: function (data) {
                console.log(JSON.parse(data));
                if (JSON.parse(data).code == -1) {
                    wyn.create.maskText(JSON.parse(data).msg, {padding: '10px 15px', top: '50%'}, null, 1000);
                    return false;
                } else {
                    if(!!!location.hash){
                        wyn.create.maskText('添加成功', {padding: '10px 15px', top: '50%'}, null,1000);
                    }else {
                        wyn.create.maskText('更改成功', {padding: '10px 15px', top: '50%'}, null),1000;
                    }
                    window.name = 'addAddress';
                    setTimeout(function(){
                        window.history.back()
                    },500)
                }
            }
        })
    }
})
//下单时设置收货地址
wyn.bind.touchEnd('.set-address', function (obj) {
    var datas = obj.parents('.address-item')[0].dataset.datas;
    setAddress(datas);
});
/*设置收货地址*/
function setAddress(datas) {
    /*如果有设置临时数据*/
    var off = $.session.get('buyPackage') == undefined ? false : true;
    if (off) {
        $.session.set('address', datas)
        location.replace($.session.get('buyPackage'));
    }
};

/*初始化新增地址、编辑页面*/
function initPage() {
    var data = location.hash.replace('#', '');
    setTimeout(function () {
        window.removeLoading();
    }, 300);
    if (data) {
        document.title = '编辑地址'
        data = JSON.parse(decodeURI(data));
        console.log(data.nickname)
        $('[name=nickname]').val(data.nickname)
        $('[name=address_id]').val(data.address_id)
        $('[name=phone]').val(data.phone)
        $('[name=body]').val(data.body)
        if (data.status == 1)
            $('.set-default').addClass('hidden');
        else
            $('#switchCP').attr('checked', false)
        /*var datas = {
         "address_id": "296",
         "member": "101",
         "nickname": "爱上空间",
         "phone": "13465413211",
         "body": "4512165431321",
         "status": "1"
         }*/
    }
}