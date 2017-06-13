/**
 * Created by Administrator on 2017/4/26 0026.
 */


/*获取我的名片*/
function getDocCard(fn) {
    var text = ''

    $.ajax({
        url: ajaxUrl+'/v1_3/wx/doctor/read',
        type: 'post',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            if (isRequestSucces(data)) {
                var logoUrl=data.logo ? data.logo : '../../images/common/group_3@2x.png';
                data = data.datas
                data.hospital='人民解放军医院人民解放军医院'
                text = ' <div id="card" class="doc-card-box">\
                <span>扫描二维码与我联系</span>\
                <div  class="two-code-box">\
                    <img src="'+data.card+'" alt="二维码丢了">\
                </div>\
                <div class="doc-message webkitBox">\
                    <div class="doc-header">\
                        <img src="'+logoUrl+'" alt="">\
                    </div>\
                    <p class="web-b-f-1">\
                        <strong>'+data.nickname+'</strong>'+data.level+'<br>'+data.department+'<br>'+data.hospital+'\
                    </p>\
                </div>\
                <div class="major-box">\
                    <h3>专业擅长</h3>\
                    <p>'+data.speciality+'</p>\
                </div>\
            </div>'
                $('body').append(text);
                if(typeof fn == 'function')fn();
                console.log(typeof fn)
            }
        }
    })
}



/*判断是否发送成功*/
function isRequestSucces(data){
    data=wyn.get.type(data)=='object'?data:JSON.parse(data)
    console.log(data)
    if (data.code == -1) {
        wyn.create.maskText(data.msg, {padding: '10px 15px', top: '50%'}, null, 1000)
        return false;
    } else {
        return true;
    }
}
