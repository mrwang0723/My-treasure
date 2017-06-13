/**
 * Created by Administrator on 2017/4/18 0018.
 */
/*/!*完善资料*!/
function skipHref(){
    var url = location.hash.replace('#','');
    if(url && url=='user'){
    }
    if(url && url=='doctor'){
        location.href='../../page/doctor/myMessage.html';
    }
}*/
var url = location.hash.replace('#','')
var isUser = !!url?url=='user'?true:false:false;
/*function skip(){
    var url = location.hash.replace('#','');
    if(url && url=='user'){
        location.href='../../page/user/myDoctor/main.html';
    }
    if(url && url=='doctor'){
        location.href='../../page/doctor/myMessage.html';
    }
}
$('.succeed-box button').on('touchend',function(){
    skipHref();
});
$('.succeed-box .btn-skip').on('touchend',function(){
    skip();
});*/
//Vue.config.silent = true;
var invite_id=location.hash.replace("#",'')
$(function(){
    var vm = new Vue({
        el:'#succeed-box',
        data:{
            isUser:isUser,
            invite_id:invite_id
        },
        mounted:function(){
            this.$nextTick(function(){
                window.removeLoading();
            })
        },
        computed:{
            infoData:function(){
                if(isUser){
                    return {
                        url:'../../page/user/userInfo/main.html',
                        skip:'../../page/user/myDoctor/main.html',
                        text:'请完善个人真实信息<br>以便医生与您精准沟通'
                    }
                }else {
                    return {
                        url:'../../page/doctor/perfectMyMessage.html#'+this.invite_id,
                        skip:'close',
                        text:'请完善个人信息以便顺利审核通过'
                    }
                }
            },
        },
        methods:{
            skip:function(){
                if(this.infoData.skip=='close'){
                    WeixinJSBridge.invoke('closeWindow',{},function(res){});
                }else {
                    location.href = this.infoData.skip;
                }
            },
            perfectMessage:function(){
                window.location.replace(this.infoData.url);
            }
        }
    })
})