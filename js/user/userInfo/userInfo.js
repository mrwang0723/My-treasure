/**
 * Created by Administrator on 2017/4/1 0001.
 */


/*/!*校验身份证、紧急联系人、紧急联系人电话、昵称格式*!/
 wyn.bind.touchEnd('[name=edit-submit]', function () {
 var input = $(event.target).parents('.edit-name-box').find('input'), type = input.attr('name');
 var text = input.parents('li').attr('content') + '不能为空';
 if (!input.val()) {
 wyn.create.maskText(text, {
 padding: '10px 15px',
 top: '30%',
 "z-index":99999,
 }, null, 500);
 }
 });*/

/* //提交出生日期
 $(document).on('blur', '[name=user-date]', function () {
 var _this = $(event.target);
 _this.siblings('[name=no-date]').val(_this.val());
 });*/
//民族列表
window.nationArr = ["汉族", "蒙古族", "回族", "藏族", "维吾尔族", "苗族", "彝族", "壮族", "布依族", "朝鲜族", "满族", "侗族", "瑶族", "白族", "土家族", "哈尼族", "哈萨克族", "傣族", "黎族", "傈僳族", "佤族", "畲族", "高山族", "拉祜族", "水族", "东乡族", "纳西族", "景颇族", "柯尔克孜族", "土族", "达斡尔族", "仫佬族", "羌族", "布朗族", "撒拉族", "毛南族", "仡佬族", "锡伯族", "阿昌族", "普米族", "塔吉克族", "怒族", "乌孜别克族", "俄罗斯族", "鄂温克族", "德昂族", "保安族", "裕固族", "京族", "塔塔尔族", "独龙族", "鄂伦春族", "赫哲族", "门巴族", "珞巴族", "基诺族"];

//职业列表
window.occupation = ["军人", "农民", "工人", "公务员及管理人员", "科技人员", "办事及业务人员", "商业及服务人员", "教师", "学生", "无业", "其他"];
window.titleList = new Array;
window.nationType = new Array;
window.occupationType = new Array;
for (var i in window.occupation) {
    window.occupationType[i] = {dataText: window.occupation[i], dataCode: window.occupation[i]}
}
for (var i in window.nationArr) {
    window.nationType[i] = {dataCode: window.nationArr[i], dataText: window.nationArr[i]}
}
var man = location.hash.indexOf('woman') == -1 ? true : false
$(function () {
    wyn.reloadPage();
    /* wyn.bind.touchEnd('.edit-list li', function (obj) {
     $(obj).css('background-color', 'rgba(200,200,200,.3)');
     setTimeout(function () {
     $(obj).css('background-color', 'rgba(200,200,200,0)');
     }, 150)
     });*/
    var userInfo = new Vue({
        el: '#ueseInfo',
        data: {
            userDatas: {
                sex: '',
                /* marry_status:0,
                 sex:1*/
            },
            /*name: '',//姓名
             sex: '',//性别
             birthday: '',//生日
             id_card: '',//身份证号
             education: '',//文化程度
             email: '',//邮箱
             nation: '',//民族
             address: '',//家庭住址
             urgen_name: '',//紧急联系人
             urgen_phone: '',//紧急联系人电话
             occupation: '',//职业
             marry_status: '',//婚姻状况*/
            //性别
            sexType: [
                {
                    dataText: '男',
                    dataCode: 1,
                    dataImg: '../../../images/userInfo/sex-man.png'
                }, {
                    dataText: '女',
                    dataCode: 2,
                    dataImg: '../../../images/userInfo/sex-woman.png'
                }],
            //婚姻状况列表
            marryStatusType: [
                {
                    dataText: '未婚',
                    dataCode: 0
                }, {
                    dataText: '已婚',
                    dataCode: 1
                }, {
                    dataText: '离异',
                    dataCode: 2
                }, {
                    dataText: '丧偶',
                    dataCode: 3
                }, {
                    dataText: '其他',
                    dataCode: 9
                }],

            //输入页提示文字
            inputPopText: '',
            //民族列表
            nationType: window.nationType,
            //职业列表
            occupationType: window.occupationType,
            //文化程度
            educationType: [
                {
                    dataText: '无',
                    dataCode: '无'
                },
                {
                    dataText: '小学',
                    dataCode: '小学'
                },
                {
                    dataText: '初中',
                    dataCode: '初中'
                },
                {
                    dataText: '中专',
                    dataCode: '中专'
                },
                {
                    dataText: '高中',
                    dataCode: '高中'
                },
                {
                    dataText: '专科',
                    dataCode: '专科'
                },
                {
                    dataText: '本科',
                    dataCode: '本科'
                },
                {
                    dataText: '研究生',
                    dataCode: '研究生'
                },
                {
                    dataText: '硕士',
                    dataCode: '硕士'
                },
                {
                    dataText: '博士',
                    dataCode: '博士'
                }
            ],
            //输入框提示的文字
            placeholderText: '',
            //输入后的文字
            inputText: '',
            //选择的列表
            selectList: [],
            //被修改的输入框
            postObj: '',
            //被修改的选项
            selectObj: {},

            Input: false,
            Select: false,
            sexSelect: false,
            imgStyle: {
                width: '100%',
                height: 'auto'
            }
            /*sexData:{
             dataText: '男',
             dataCode: 0
             },
             marryData:{
             dataText: '未婚',
             dataCode: 0
             },*/
        },
        filters: {
            height: function (val) {
                return parseInt(val) + 'cm'
            },
            weight: function (val) {
                return val + 'kg'
            }
        },
        mounted: function () {
            //获取数据
            this.$nextTick(function () {
                console.log('m')
                var _this = this;
                $.post(ajaxUrl + '/v1_3/wx/member/read', function (data) {
                    //if (localStorage)localStorage.setItem('userDatas', data);
                    data = JSON.parse(data);
                    console.log(data);
                    if (data.code == -1) {
                        //关闭微信窗口
                        setTimeout(function(){
                            alert('请先登录');
                            WeixinJSBridge.invoke('closeWindow', {}, function (res) {});
                        },200)
                        return;
                    } else {
                        _this.userDatas = data.datas;
                       /* _this.userDatas = {
                         address: "北京市海淀区",
                         avatar: "/uploads/face/1494491911.jpeg",
                         birthday: "2017-05-11",
                         body_height: null,
                         body_weight: null,
                         doctor: "杨瑞剑3",
                         education: "大专",
                         email: "15210211420@139.com",
                         id_card: "144444444444444444",
                         marry_status: "0",
                         member_id: "101",
                         name: "瑞剑4",
                         nation: "汉",
                         nickname: '',
                         occupation: "程序员",
                         sex: "0",
                         urgen_name: "小dog",
                         urgen_phone: "13546226377",
                         username: "45210211420"
                         }*/
                        setTimeout(function () {
                            window.removeLoading();
                            var img = $('.header-img')
                            if (img.height() < img.width()) {
                                if (_this.imgStyle != {
                                        height: "100%",
                                        width: "auto"
                                    }) {
                                    _this.imgStyle = {
                                        height: "100%",
                                        width: "auto"
                                    }
                                }
                            } else {
                                if (_this.imgStyle != {
                                        width: "100%",
                                        height: "auto",
                                    }) {
                                    _this.imgStyle = {
                                        width: "100%",
                                        height: "auto",
                                    }
                                }
                            }
                        }, 500)
                    }

                })
            })
        },
        computed: {
            //转换性别
            sexData: function () {
                if (this.userDatas.sex == '' || this.userDatas.sex == '0' ) {
                    this.userDatas.sex = '';
                    return new Object();
                }else {
                    return this.sexType[parseInt(this.userDatas.sex) - 1];
                }

            },
            //婚姻转换
            marryData: function () {
                if (this.userDatas.marry_status == 9) return this.marryStatusType[4];
                console.log(parseInt(this.userDatas.marry_status))
                if (this.userDatas.marry_status == '' && this.userDatas.marry_status!=0) {
                    return new Object();
                }else {
                    return this.marryStatusType[parseInt(this.userDatas.marry_status)]
                }

            }
        },
        methods: {
            //显示输入框
            showInput: function (text) {
                location.hash = 'input';
                this.placeholderText = $(event.target).parents('li').find('.input-pop-text').val();
                this.postObj = text;
                this.inputText = this.userDatas[text];
                //$('.edit-text-box input').focus();
                return false;
            },
            post: function () {
                if (this.postObj != '')this.userDatas[this.postObj] = this.inputText;
                /*验证身份证号*/
                if (this.postObj == 'id_card' && !wyn.judge.input.idCard(this.userDatas.id_card)) {
                    alert('您输入的身份证号不正确');
                    return;
                    /*验证紧急联系人*/
                } else if (this.postObj == 'urgen_name' && !wyn.judge.input.name(this.userDatas.urgen_name)) {
                    alert('请填写正确联系人姓名');
                    return;
                    /*验证紧急联系人电话*/
                } else if (this.postObj == 'urgen_phone' && !wyn.judge.input.phoneNumber(this.userDatas.urgen_phone.replace(/ |-/g,''))) {
                    alert('您输入的电话号格式不正确');
                    return;
                }
                this.userDatas.urgen_phone=this.userDatas.urgen_phone.replace(/ |-/g,'')
                var data = new Object();
                var val = this.userDatas[this.postObj];
                data[this.postObj] = val;
                console.log(this.userDatas.urgen_phone)
                this.postInput(data, function (msg) {
                    wyn.create.maskText(msg, {padding: '10px 15px', top: '50%'}, null, 1000)
                    window.history.back();
                })
            },
            clearInputText: function () {
                this.inputText = '';
            },

            /*获取修改的列表*/
            getSelect: function (item, obj) {
                if (obj == 'sex') {
                    location.hash = 'sex'
                } else {
                    location.hash = 'select'
                }
                this.selectList = item;
                this.selectObj = obj;
            },
            //提交修改的数据
            postSelect: function (obj) {
                console.log(obj)
                this.userDatas[this.selectObj] = obj.dataCode;
                var data = new Object();
                var val = this.userDatas[this.selectObj];
                data[this.selectObj] = val;
                this.postInput(data, function (msg) {
                    wyn.create.maskText(msg, {padding: '10px 15px', top: '50%'}, null, 1000)
                    window.history.back();
                })
            },
            //设置生日
            setBirthday: function ($event) {
                var now = new Date();
                var setDate = new Date($event.target.value.replace(/-/g, "/"));
                var minDate = new Date();
                minDate.setFullYear(minDate.getFullYear() - 10);
                var maxDate = new Date();
                maxDate.setFullYear(maxDate.getFullYear() - 100);
                console.log(maxDate)
                console.log(minDate)
                if (setDate < maxDate) {
                    wyn.create.maskText('年龄不能大于100岁哦', {padding: '15px 10px', top: '30%'}, null, 1000);
                    this.userDatas.birthday = getDateStr(maxDate, "yyyy-MM-dd");
                    $event.target.value = getDateStr(maxDate, "yyyy-MM-dd");
                    return false
                } else if (setDate > minDate) {
                    wyn.create.maskText('年龄不能小于10岁哦', {padding: '15px 10px', top: '30%'}, null, 1000);
                    this.userDatas.birthday = getDateStr(minDate, "yyyy-MM-dd");
                    $event.target.value = getDateStr(minDate, "yyyy-MM-dd");
                    return false;
                }
                this.userDatas.birthday = $event.target.value;
                var data = {
                    birthday: this.userDatas.birthday
                };
                this.postInput(data, function (msg) {
                    wyn.create.maskText(msg, {padding: '10px 15px', top: '50%'}, null, 1000)
                })
            },
            //设置头像
            setHead: function (e) {
                var _this = this;
                var obj = e.target;
                console.log(obj);
                /*wyn.upImg(obj, function (img, url, file, width, height) {
                 console.log(file);
                 console.log(url);
                 console.log(img);
                 console.log(width);
                 console.log(height);
                 _this.userDatas.avatar = img;
                 _this.postInput({avatar: img}, function (msg) {
                 wyn.create.maskText(msg, {padding: '10px 20px', top: '50%'}, null, 1000);
                 })
                 this.imgStyle = width > height ? {height: '100%', width: 'auto'} : {height: 'auto', width: '100%'};
                 console.log(this.imgStyle)
                 })*/
                wyn.create.maskText('正在设置头像', {padding: '10px 15px', top: '50%'}, null,2000);
                lrz(e.target.files[0], {width: 300}, function (results) {
                        var img = new Image();
                        img.src = results.base64;
                        img.onload = function () {
                            console.log(img.width)
                            console.log(img.height)
                            if (img.width > img.height) {
                                _this.imgStyle = {
                                    height: '100%',
                                }
                            } else {
                                _this.imgStyle = {
                                    width: '100%',
                                }
                            }
                            //_this.imgs.push({src: results.base64, style: style})
                            _this.userDatas.avatar = results.base64;
                            _this.postInput({avatar: results.base64}, function (msg) {
                                wyn.create.maskText(msg, {padding: '10px 20px', top: '50%'}, null, 1000);
                            })
                        }
                    }
                )
            },
            //设置身高
            goHeight: function () {
                var url = '';
                if (this.userDatas.sex == '1') {
                    url = './editHeight.html#' + this.userDatas.body_height;
                } else {
                    url = './editHeight.html#' + this.userDatas.body_height + 'woman';
                }
                location.href = url;
            },
            goWeight: function () {
                var url = '';
                if (this.userDatas.sex == '1') {
                    url = './editWeight.html#' + this.userDatas.body_weight;
                } else {
                    url = './editWeight.html#' + this.userDatas.body_weight + 'woman';
                }
                location.href = url;
            },
            //提交数据到服务器
            postInput: function (data, fn) {
                console.log(data)
                wyn.create.maskText('正在提交', {padding: '10px 20px', top: '50%'}, null);
                $.post(ajaxUrl + '/v1_3/wx/member/update', data, function (data) {
                    data = JSON.parse(data)
                    if (data.code == -1) {
                        alert(data.msg)
                    } else {
                        if (typeof  fn == 'function') fn(data.msg);
                        /*  if (localStorage)localStorage.clear('userDatas');*/
                    }
                })
            }
        },
        watch: {

        }
    });
    wyn.onHashChange(function (hash) {
        if (hash.indexOf('input') != -1) {
            userInfo.Input = true;
        } else if (hash.indexOf('select') != -1) {
            userInfo.Select = true;
        } else if (hash.indexOf('sex') != -1) {
            userInfo.sexSelect = true;
        } else {
            userInfo.Input = userInfo.Select = userInfo.sexSelect = false;
            /*if ($('textarea')[0] == document.activeElement) {
             $('textarea').blur()
             }*/
            for (var i = 0; i < $('input').length; i++) {
                if ($('input')[i] == document.activeElement && $('input').eq(i).attr('type') != 'date') {
                    $('input').eq(i).blur();
                }
            }
            if (userInfo.Input || userInfo.Select || userInfo.sexSelect) {
                for (var i = 0; i < $('input').length; i++) {
                    if ($('input')[i] == document.activeElement && $('input').eq(i).attr('type') == 'date') {
                        $('input').eq(i).blur();
                    }
                }
            }
        }
    })
})
;


/*登录时请求的数据 get方式*/
//var url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx767942a595048082&redirect_uri=https://www.cardiocloud.cn/v1_3/wx/${login/15210211420/1111}&response_type=code&scope=snsapi_base&state=123#wechat_redirect*/`