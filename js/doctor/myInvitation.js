/**
 * Created by Administrator on 2017/4/10 0010.
 */
var invite_id = Number(location.hash.replace('#', ''));
var oldData = '';
//职称列表
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
$(function () {

    getHospitalList();
    getTitleList();
    $('.edit-list').on('scroll',function(){
        if(wyn.get.client()!='iphone'){
            var p = $(this).find('p');
            var scrollTop = this.scrollTop;
            //$('#edit-list').find('p').next('li').css('margin-top','.2rem');
            $.each(p,function(i){
                var objTop= p.eq(i).attr('data-top');
                if(objTop<=scrollTop){
                    p.eq(i).css({position:'fixed',top:$('.search-box')[0].offsetHeight+'px',margin:'0px'}).next('li').css('margin-top','.2rem');
                }else{
                    p.eq(i).css({position:'relative',top:'0px',margin:'-1px -0.12rem 0px'}).next('li').css({'margin-top':'0'});
                }
            })
        }
    })


    /*修改时获取数据*/
    if (invite_id) {
        $.post(ajaxUrl + '/v1_3/wx/doctor/read_details', {
            invite_id: invite_id
        }, function (data) {
            data = JSON.parse(data);
            console.log(this.data);
            console.log(data);
            if (data.code == -1) {
                alert(data.msg);
                window.history.back();
            } else {
                $('#invite_id').val(data.datas.invite_id);
                console.log(data);
                for (var i in $('form input').get()) {
                    var name = $('form input').eq(i).attr('name');
                    if (Boolean(data.datas[name])) {
                        if (name == 'sex') {
                            if ($('form input').eq(i).val() == data.datas[name]) {
                                $('form input').eq(i).attr('checked', 'checked')
                            }
                        } else {
                            $('form input').eq(i).val(data.datas[name])
                        }
                    }
                }
                oldData = $("form").serialize();
                $('.add-invite-box .btn-submit button').text('确认修改')
                verifyInput();
                subBtnStatus();
                setTimeout(function () {
                    window.removeLoading()
                }, 500)
                getOfficeList(data.datas.hospital)
            }
        })
    } else {
        setTimeout(function () {
            window.removeLoading()
        }, 500)
    }
    /*搜索*/
    $(document).on('input', '#search', function () {
        filtrateHospital($('#search'))
    })


    /*筛选医院*/
    function filtrateHospital(el) {
        var list = el.parents('.search-box').siblings('.edit-list').find('li');
        var val = el.val();
        list.css('display', 'none');
        var flag = false;
        list.get().forEach(function (e) {
            var v = window.pinyin.getFullChars(val).toLocaleLowerCase(),
                text = window.pinyin.getFullChars(e.innerHTML).toLocaleLowerCase();
            if (text.indexOf(v) != -1) {
                $(e).css('display', 'block');
                flag = true;
            }
        });

        $('.edit-list').find('p').css('display',!!val?'none':'block');
        if (flag || !val) {
            if(!val){
                list.css('display', 'block')
            }
            $('.search-hint').hide();
        } else {
            $('.search-hint').show();
        }
    }

    $('.doc-hospital-select-box .icon-small-close').on('touchend', function () {
        $('#search').val('');
        filtrateHospital($('#search'));
    })

    /*弹出输入文本框信息*/
    wyn.bind.touchEnd('.add-invite-input-box label i', function (obj) {
        console.log('弹出输入文本框')
        wyn.stop.stopDefault();
        var btn = $(obj),
            hash = btn.parents('li').attr('class'),
            _this = btn.siblings('input'),
            parent = _this.parents(),
            off = parent.hasClass('doc-hospital') ? true : parent.hasClass('doc-office') ? true : parent.hasClass('doc-title') ? true : parent.hasClass('doc-sex');
        if (!off) {
            /*if(win.get.client()!='iphone'){
             $('.edit-text-box label').find('input').focus();
             $('.edit-text-box label').find('input').blur();
             }*/
            $('.edit-text-box-public label').find('input').remove();
            $('.edit-text-box-public label').append('<input />');
            var attr = JSON.parse(_this.attr('attr')),
                name = _this.attr('name'),
                input = $('.edit-text-box-public').find('input');
            $('.edit-text-box-public')[0].id = name;
            $('.edit-text-box-public').addClass('show');
            $('.edit-text-box-public p').text(_this.attr('placeholder'));
            input.attr({
                placeholder: _this.attr('placeholder'),
                type: attr.type,
                maxlength: attr.max,
                value: _this.val()
            });
            if (wyn.get.client() != 'iphone')input.focus();

            wyn.bind.touchEnd('.edit-text-box-public .btn-bottom', function (obj) {
                if (input.val().trim()) {
                    _this.val(input.val());
                    btn.text(input.val())
                }
                //input.attr({placeholder: '', type: '', maxlength: '', value: ''})
                input.off('keyup');
                input.remove();
                window.history.go(-1);
                subBtnStatus();
                verifyInput();
            });

        } else {
            /*选择科室*/
            if ($(event.target).parents().hasClass('doc-office')) {
                if ($('.doc-hospital i').text() == '请选择医院') {
                    wyn.create.maskText('请先选择医院', {padding: '20px', top: '50%'}, null, 300);
                    return false;
                }
                $('.doc-office-select-box').toggleClass('show');
                wyn.bind.touchEnd('.edit-list li', function () {
                    if (!!!$(event.target).attr('dept_code')) {
                        return false;
                    }
                    var text = $(event.target).text();
                    var code = event.target.getAttribute('dept_code');
                    input.eq(0).val(code);
                    btn.prev('input').val(text);
                    window.history.go(-1);
                    subBtnStatus();
                    verifyInput();
                })
            }
            inputBlur(_this);
            var input = $(event.target).siblings('input');
            wyn.stop.stopDefault();
            /*选择医院*/
            if ($(event.target).parents().hasClass('doc-hospital')) {
                var oldtext = btn.text();
                hospitalListCasePosition();
                $('.doc-hospital-select-box').toggleClass('show');
                wyn.bind.touchEnd('.edit-list li', function (obj) {
                    var mewText = $(obj).text();
                    if (oldtext !== mewText) {
                        var code = event.target.getAttribute('hospital_code');
                        input.eq(0).val(code);
                        btn.prev('input').val(mewText);
                        getOfficeList(code);
                        $('.doc-office').find('input').val('');
                        $('.doc-office').find('i').text('请选择科室');
                    }
                    window.history.go(-1);
                    verifyInput();
                    subBtnStatus();
                });

                /*显示新增医院*/
                wyn.bind.touchEnd('.icon-search s', function () {
                    $('.edit-text-box-hospital').addClass('show');
                    $('.search-box input').blur();
                    location.hash += 'addHospital';
                });
            }

            /*选择职称*/
            if ($(event.target).parents().hasClass('doc-title')) {
                $('.doc-title-select-box').toggleClass('show');
                wyn.bind.touchEnd('.edit-list li', function () {
                    var text = $(event.target).text();
                    var code = event.target.getAttribute('dept_code');
                    input.eq(0).val(text);
                    //btn.prev('input').val(text);
                    window.history.go(-1);
                    subBtnStatus();
                    verifyInput();
                })
            }
        }
        location.hash = hash;
    });

    /*路由监听*/
    wyn.onHashChange(function (hash) {
        if (hash.indexOf('doc-tel') != -1) {
            $('.edit-text-box h5').show()
        } else {
            $('.edit-text-box h5').hide()
        }
        if (Number(hash.replace('#', '')) || !hash) {
            $('.edit-text-box-public,.select-box').removeClass('show');
            for (var i = 0; i < $('input').length; i++) {
                if ($('input').get(i) == document.activeElement) {
                    if ($('input').eq(i).attr('type') != 'date') {
                        $('input').eq(i).blur();
                    }
                }
            }
        }
        if (hash.indexOf('addHospital') == -1) {
            $('.edit-text-box-hospital').removeClass('show');
            $('.edit-text-box-hospital input').blur()
        }
        if (hash.indexOf('addOffice') == -1) {
            $('.edit-text-box-office').removeClass('show');
        }
    });

    /*提交邀请、编辑*/
    $('.add-invite-box button').on('touchend', function () {
        if ($(this).attr('disabled') == 'disabled' || $(this).attr('disabled')) {
            return;
        }
        if (oldData != '' && oldData == $("form").serialize()) {
            wyn.create.maskText('修改成功', {
                padding: '16px 20px',
                top: '50%',
                width: '160px',
                'line-height': '1.4'
            }, null, 2000);
            setTimeout(function () {
                window.history.back();
            }, 2000)
            return;
        }
        wyn.create.maskText('正在提交', {
            padding: '16px 20px',
            top: '50%',
            width: '160px',
            'line-height': '1.4'
        }, null);
        $('[name=sex]').val($('.doc-sex input:checked').val());
        $.ajax({
            data: $("form").serialize().replace(/%20|-/g, ''),
            type: "POST",
            url: ajaxUrl + '/v1_3/wx/doctor/invite',
            success: function (data) {
                data = JSON.parse(data);
                console.log(this.data);
                console.log(data);
                if (data['code'] == -1) {
                    /*wyn.create.maskText('填写的手机号已被注册或已被邀请,请更换手机号码', {
                     padding: '16px 20px',
                     top: '50%',
                     width: '160px',
                     'line-height': '1.4'
                     }, null, 2000);*/
                    $('#maskText').remove();
                    $('.doc-tel input').val('');
                    $('.doc-tel i').html('请输入手机号');
                    verifyInput();
                    subBtnStatus();
                    alert('填写的手机号已被注册或已被邀请,请更换手机号码')
                }
                else {
                    window.name='addInvite'
                    if (invite_id != '') {
                        wyn.create.maskText('修改成功', {padding: '16px 20px', top: '50%'}, null, 2000);
                        setTimeout(function () {
                            window.history.back();
                        }, 1000)
                    } else {
                        wyn.create.maskText('提交成功', {padding: '16px 20px', top: '50%'}, null, 1000);
                        setTimeout(function () {
                            location.replace('../../page/doctor/inviteCode.html#' + data.datas.invite_id)
                        }, 1000)
                    }
                }
            }
        })
    })

    $('[name=sex]').on('change', function () {
        subBtnStatus();
    })
});

/*提交按钮状态*/
function subBtnStatus() {
    var form = $('form')[0];
    var sex = '';
    for (var i = 0; i < $(form.sex).length; i++) {
        if ($(form.sex).eq(i).is(':checked')) {
            sex = $(form.sex).eq(i).val();
        }
    }
    /*console.log('性别'+ ($(form.sex).val() === ''))
     console.log('姓名'+($(form.name).val().length < 2))
     console.log('电话'+($(form.phone).val().length < 11))
     console.log('医院'+($(form.hospital).val() === ''))
     console.log('科室'+($(form.department).val() === ''))
     console.log('职称'+($(form.title).val() === ''))*/
    if (!!!sex || $(form.name).val() == '' || $(form.phone).val().length < 11 || $(form.hospital).val() === '' || $(form.department).val() === '' || $(form.title).val() === '') {
        $('.add-invite-box button').attr('disabled', true)
    } else {
        $('.add-invite-box button').attr('disabled', false)
    }
}


/*给文字加颜色*/
function verifyInput() {
    for (var i in $('.add-invite-input-box li i').get()) {
        var obj = $('.add-invite-input-box li i');
        if (obj.eq(i).prev('input').val()) {
            obj.eq(i).text(obj.eq(i).prev('input').val()).addClass('c-6')
        } else {
            obj.eq(i).removeClass('c-6')
        }
    }
}
/*获取医院列表*/
function getHospitalList() {
    $.ajax({
        type: "POST",
        url: ajaxUrl + '/v1_3/wx/hospital/list',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            if (data.code == -1) {
                alert(data.msg)
                window.history.back()
                return;
            };
            data['datas'].sort(function (a, b) {
                return window.pinyin.getFullChars(a.hospital_name.trim()).toLocaleLowerCase() < window.pinyin.getFullChars(b.hospital_name.trim()).toLocaleLowerCase() ? -1 : 1
            });

            /* for (var i in data['datas']) {
             $('.doc-hospital-select-box #edit-list')[0].innerHTML += '<li hospital_code="' + data['datas'][i]['hospital_code'] + '">' + data['datas'][i]['hospital_name'] + '</li>'
             }*/


            /*按字母分类*/
            var hospitalList = new Object();
            var caseArr = [];
            for (var i in data['datas']) {
                var code = window.pinyin.getFullChars(data['datas'][i]['hospital_name'].trim())[0].toLocaleLowerCase();
                if (!hospitalList[code]) {
                    hospitalList[code] = new Array;
                }
                hospitalList[code].push(data['datas'][i])
            }
            for (var i in hospitalList) {
                $('.doc-hospital-select-box #edit-list')[0].innerHTML += '<p style="font-size: .14rem;background: #eee;z-index: 99999999;position:relative;top:0;left: 0;right: 0;color: #999;margin: -1px -.12rem 0;padding: 0 .12rem;line-height: .2rem;">' + i.toLocaleUpperCase() + '</p>'
                for (var y in hospitalList[i]) {
                    $('.doc-hospital-select-box #edit-list')[0].innerHTML += '<li hospital_code="' + hospitalList[i][y]['hospital_code'] + '">' + hospitalList[i][y]['hospital_name'].trim() + '</li>'
                }
            }
        }
    })
}

/*添加医院*/
function addHospatal() {
    var val = $('.edit-text-box-hospital input').val().trim();
    var p = $('#edit-list').find('p');
    p.css({position:'relative',top:'0',margin:'-1px -0.12rem 0px'})
    $.each(p,function(i){
        p.eq(i).next('li').css('margin-top','0')
    })
    if (!!!val) {
        alert('请输入医院名称')
    } else {
        console.log(val)
        /*.doc-hospital-select-box*/
        $.post(ajaxUrl + '/v1_3/wx/hospital/save_hospital', {
            hospital_name: val
        }, function (data) {
            data = JSON.parse(data);
            console.log(data)
            if (data.code == -1) {
                alert(data.msg)
            } else {
                var input = $('.doc-hospital input')
                var hospitalItem = "<li hospital_code=" + data.datas.hospital_code + ">" + data.datas.hospital_name + "</li>"
                $('.doc-hospital i').html(data.datas.hospital_name)
                input.eq(0).val(data.datas.hospital_code)
                input.eq(1).val(data.datas.hospital_name)
                $('.doc-hospital-select-box').find('p').eq(0).before(hospitalItem);
                $('.doc-office').find('input').val('');
                $('.doc-office').find('i').text('请选择科室');
                $('.edit-text-box-hospital input').val('')
                subBtnStatus();
                verifyInput();
                getOfficeList(data.datas.hospital_code);
                window.history.go(-2)
            }
        })
    }
}
/*显示新增科室*/
function showOffice() {
    $('.edit-text-box-office').addClass('show');
    location.hash += 'addOffice';
};

/*新增科室*/
function addOffice() {
    var val = $('.edit-text-box-office input').val().trim();
    var hospital_code = $('[name=hospital]').val();
    if (!!!val) {
        alert('请输入科室名称')
    } else {
        console.log(val)
        console.log(hospital_code)
        $.post(ajaxUrl + '/v1_3/wx/hospital/save_dept', {
            hospital_code: hospital_code,
            dept_name: val
        }, function (data) {
            data = JSON.parse(data)
            console.log(data)
            console.log(this.data)
            if (data.code == -1) {
                alert(data.msg)
            } else {
                var input = $('.doc-office input');
                var officeItem = '<li dept_code="' + data.datas.dept_code + '">' + data.datas.dept_name + '</li>'
                if ($('.doc-office-select-box #edit-list li')[0].innerHTML == '暂无科室,快去添加吧') {
                    $('.doc-office-select-box #edit-list')[0].innerHTML = officeItem;
                } else {
                    $('.doc-office-select-box #edit-list li').eq(0).before(officeItem);
                }
                input.eq(0).val(data.datas.dept_code);
                input.eq(1).val(data.datas.dept_name);
                $('.edit-text-box-office input').val('');
                subBtnStatus();
                verifyInput();
                window.history.go(-2)
            }
        })

    }
    /*else if(!/^[\u4e00-\u9fa5]$/.test(val)){
     alert('您输入的医院名称不正确')
     }*/
};

/*获取科室*/
function getOfficeList(code) {
    $.ajax({
        data: {hospital_code: code},
        type: "POST",
        url: ajaxUrl + '/v1_3/wx/hospital/deptlist',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            var html = '';
            if (data['datas'].length == 0) {
                $('.doc-office-select-box #edit-list')[0].innerHTML = '<li style="color:#999 !important; ">暂无科室,快去添加吧</li>'
            } else {
                data['datas'].sort(function (a, b) {
                    return window.pinyin.getFullChars(a.dept_name).toLocaleLowerCase() < window.pinyin.getFullChars(b.dept_name).toLocaleLowerCase() ? -1 : 1
                });

                /*按字母分类*/
                var deplList = new Object();
                var caseArr = [];
                for (var i in data['datas']) {
                    var code = window.pinyin.getFullChars(data['datas'][i]['dept_name'].trim())[0].toLocaleLowerCase();
                    if (!deplList[code]) {
                        deplList[code] = new Array;
                    }
                    deplList[code].push(data['datas'][i])
                }

                for (var i in deplList) {
                    html += '<p style="font-size: .14rem;background: #eee;position:relative;top:0;left: 0;right: 0;color: #999;margin: -1px -.12rem 0;padding: 0 .12rem;line-height: .2rem;">' + i.toLocaleUpperCase() + '</p>'
                    for (var y in deplList[i]) {
                        html += '<li dept_code="' + deplList[i][y]['dept_code'] + '">' + deplList[i][y]['dept_name'].trim() + '</li>'
                    }
                }
                $('.doc-office-select-box #edit-list')[0].innerHTML = html;
            }
        }

    })
}

/*获取职称*/
function getTitleList() {
    var html = '';
    for (var i in window.titleArr) {
        html += '<li>' + window.titleArr[i] + '</li>';
    }
    $('.doc-title-select-box #edit-list')[0].innerHTML = html;
}

function hospitalListCasePosition(){
    var p = $('#edit-list').find('p');
    var topHeight=$('.search-box')[0].offsetHeight;
    $.each(p,function(i){
        p.eq(i).attr('data-top',p[i].offsetTop-topHeight+1)
    });
}