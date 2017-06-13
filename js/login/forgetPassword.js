/**
 * Created by Administrator on 2017/5/19 0019.
 */
$(function(){
    new Vue({
        el:'.login-main-box',
        data:{
            phone:'',
            password:'',
            code:'',
            postCode:'',
            isGet:true,
        },
        filters: {
            time: function () {
                return Number(arguments[0]) ? Number(arguments[0]) + 's' : arguments[0];
            }
        },
        mounted:function(){
            this.$nextTick(function(){
                window.removeLoading();
            })
        },
        methods:{
            /*方法*/
            getCode: function (el) {
                var data = {
                    phone: this.phone,
                }
                var _this = this;
                $.post(ajaxUrl + '/v1_3/wx/verification', data, function (data) {
                    data = JSON.parse(data)
                    console.log(data);
                    console.log(this.data)
                    if (data.code == -1) {
                        wyn.create.maskText(data.msg, {padding: '10px 15px', top: '50%'}, null, 1000)
                    } else {
                        wyn.create.maskText('获取成功，请注意查收短信', {padding: '10px 15px', top: '50%'}, null, 2000)
                        _this.postCode = data.datas.code;
                        _this.isGet = true;
                        var codeText = 60;
                        el.target.innerHTML = codeText + 's'
                        _this.timer = setInterval(function () {
                            el.target.innerHTML = (codeText--) + 's';
                            if (codeText == 0) {
                                clearInterval(_this.timer);
                                el.target.innerHTML = '再发一次';
                                _this.isGet = false;
                            }
                        }, 1000)
                    }
                })

            },
            submit:function(){
                var data={
                    phone : this.phone,
                    code:this.code,
                    application_type:2
                }

                /*校验验证码*/
                /*$.post(ajaxUrl+'/v1_3/wx/member/matecode',data,function(data){
                    data=JSON.parse(data);
                    console.log(this.data);
                    console.log(data);
                    if(data.code==-1){
                        alert(data.msg)
                    }else {
                        wyn.create.maskText('修改成功',{padding:'10px 15px',top:'30%'},null,2000)
                        setTimeout(function(){
                            window.history.back()
                        },2000)
                    }
                })*/

                /*修改密码*/
                $.post(ajaxUrl+'/v1_3/wx/forgotpassword',{
                    username:this.phone,
                    password:this.password
                },function(data){
                    data=JSON.parse(data);
                    if(data.code==-1){
                        alert(data.msg)
                    }else {
                        wyn.create.maskText('修改成功',{padding:'10px 15px',top:'30%'},null,2000)
                        setTimeout(function(){
                            window.history.back()
                        },2000)
                    }
                })
            }
        },
        computed:{
            //验证提交按钮
            isPost:function(){
                if(this.phone.length!=11){
                    return true;
                }else if(this.password.length<6){
                    return true;
                }else if(this.code.length!=4){
                    return true;
                }else {
                    return false;
                }
            }
        },
        watch:{
            'phone':function(){
                if(this.phone.length<11){
                    this.isGet=true
                }else {
                    this.isGet=false
                }
            }
        }
    })
})