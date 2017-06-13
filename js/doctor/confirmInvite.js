/**
 * Created by Administrator on 2017/5/16 0016.
 */
var invite_id = parseInt(location.hash.replace('#', ''));
window.titleArr=[
    "主任医师",
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
    "护师"
];
/*window.titleArrType= new Object();
for(var i in window.titleArr){
    window.titleArrType.dataCode=window.titleArr[i];
    window.titleArrType.dataText=window.titleArr[i];
}*/
$(function () {
    var confirm = new Vue({
        el: '.confirm-invite',
        data: {
            docDatas: {},
            dept: false,
            title: false,
            code: '',
            postCode: '',
            codeDisabled: false,
            postDisabled: true,
            timer: '',
            titleList:window.titleArr,
            deptActive: {},
            invite_id: invite_id
        },
        computed: {
            /*计算属性*/
        },
        filters: {
            /*过滤器*/
            sex: function () {
                return arguments[0] == '1' ? '男' : '女';
            },
            time: function () {
                return Number(arguments[0]) ? Number(arguments[0]) + 's' : arguments[0];
            }
        },
        mounted: function () {
            /*创建实例后立刻执行*/
            this.$nextTick(function () {
                var _this = this;
                var data = {
                    invite_id: _this.invite_id
                };
                $.post(ajaxUrl + '/v1_3/wx/doctor/read_details?create_user=1', data, function (data) {
                    data = JSON.parse(data);
                    _this.docDatas = data.datas;
                    _this.docDatas.create_user = 1;
                    console.log(data);
                    if(data.code==-1){
                        alert(data.msg)
                    }
                    if (data.datas.status == 2) {
                        location.replace('../../page/doctor/perfectMyMessage.html#' + _this.invite_id)
                    }
                    $.post(ajaxUrl + '/v1_3/wx/hospital/deptlist', {
                        hospital_code: _this.docDatas.hospital
                    }, function (data) {
                        data = JSON.parse(data);
                        console.log(data.datas)
                        _this.$set(_this.docDatas, 'deptList', data.datas)
                        for (var i in data.datas) {
                            if (_this.docDatas.department == data.datas[i]['dept_code']) {
                                _this.deptActive = data.datas[i];
                            }
                        }
                        setTimeout(function () {
                            window.removeLoading()
                        }, 500)
                    })
                })
            })
        },
        methods: {
            postData: function () {
                var _this = this;

                /*校验验证码*/
                if (this.code == this.postCode) {
                    //window.location.replace('../common/registerSucceed.html#' + this.invite_id)
                    $.post(ajaxUrl + '/v1_3/wx/doctor/set_invite', this.docDatas, function (data) {
                            data = JSON.parse(data);
                            console.log(data);
                            console.log(this.data);
                            console.log(_this.docDatas);
                            if (data.code == -1) {
                                alert(data.msg)
                            } else {
                                wyn.create.maskText('提交成功，请等待审核', {padding: '10px 15px', top: '50%'}, null, 1500)
                                setTimeout(function () {
                                    window.location.replace('../common/registerSucceed.html#' + _this.invite_id)
                                }, 1500);
                            }
                        }
                    )
                    /*跳转到注册成功页面*/
                    setTimeout(function(){
                        window.location.replace('../common/registerSucceed.html#' + this.invite_id)
                    },1000);
                } else {
                    alert('验证码不正确')
                }
                console.log(this.docDatas.department);

            },
            /*方法*/
            getCode: function (el) {
                var data = {
                    phone: this.docDatas.phone
                }
                var _this = this;
                $.post(ajaxUrl + '/v1_3/wx/member/verification', data, function (data) {
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.code == -1) {
                        wyn.create.maskText(data.msg, {padding: '10px 15px', top: '50%'}, null, 1000)
                    } else {
                        wyn.create.maskText(data.msg, {padding: '10px 15px', top: '50%'}, null, 1000)
                        _this.postCode = data.datas.code;
                        _this.codeDisabled = true;
                        var codeText = 60;
                        //alert(data.datas.code)
                        el.target.innerHTML = codeText + 's'
                        _this.timer = setInterval(function () {
                            el.target.innerHTML = (codeText--) + 's';
                            if (codeText == 0) {
                                clearInterval(_this.timer);
                                el.target.innerHTML = '再发一次';
                                _this.codeDisabled = false;
                            }
                        }, 1000)
                    }
                })
            },
            setDept: function (item) {
                this.deptActive = item;
                console.log(this.deptActive)
                window.history.back();
            },
            setTitle: function (item) {
                console.log(item)
                this.docDatas.title=item;
                window.history.back();
            }
        },
        watch: {
            'deptActive':function(){
                this.docDatas.department=this.deptActive.dept_code;
                console.log(this.docDatas.department)
            },
            'dept': function () {
                if (this.dept) {
                    location.hash = 'dept'
                }
            },
            'title': function () {
                if (this.title) {
                    location.hash = 'title'
                }
            },
            'code': function () {
                if (/\d{4}/.test(this.code))
                    this.postDisabled = false;
                else
                    this.postDisabled = true;

            }
        }
    })
    wyn.onHashChange(function (hash) {
        hash = hash.replace('#', '')
        if (hash == 'dept') {
            confirm.dept = true;
        } else if (hash == 'title') {
            confirm.title = true;
        } else {
            confirm.dept = false;
            confirm.title = false;
        }
    })
})