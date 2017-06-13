/**
 * Created by Administrator on 2017/4/19 0019.
 */
/*医生数据结构*/
/*face	     头像
 nickname	姓名.
 level	    等级0作业医生1主管医生2主任医生.
 hosp	    医院.
 star	    星级.
 body	    简介.
 doctor_id	医生id.
 branch	    科室.
 goods	    擅长.
 title	    职称.
 packages	购买健康服务包信息.
 package_id	健康服务包id 未购买为0.
 subject     健康服务包名称（未购买无该字段）.
 range_str	执行状态（未购买无该字段）.

 service	Object
 购买服务次数/剩余次数.

 group	    团队信息.
 name	    姓名.
 avatar	    头像.
 hospital	医院.
 department	科室.
 star	    星级.
 title	    职称.
 */
window.name='myDoctor'
/*获取我的医生信息*/
function getMyDoc() {
    $.ajax({
        url: ajaxUrl + '/v1_3/wx/member/doctor',
        type: 'post',
        success: function (data) {
            data = JSON.parse(data);
            console.log(data);
            if (data.code == -1) {
                popLogin();
                return;
            }
            var datas = data.datas;
            $.session.set('myDoc',JSON.stringify(data))
            if (!Number(datas.packages['package_id'])) {
                datas.packages = {
                    range_str: "去购买",
                    subject: "无在用服务包",
                }
            }
            datas['face'] = datas['face']===''?'../../../images/common/common-header.png':datas['face'];
            var img = datas.packages['img'] ? 'style=background-image:url(' + datas.packages['img'] + ')' : '';
            var myDocText = '';
            myDocText += '<div class="my-doctor-top" id="consult" onclick="toAbout()" >'
            myDocText += '        <h3>' + datas.nickname + '</h3>'
            myDocText += '        <div class="user-head">'
            myDocText += '          <img src="' + datas['face'] + '">'
            myDocText += '     </div>'
            myDocText += '         <p>' + datas['title'] + '&nbsp;/&nbsp;' + datas['branch'] + '</p>'
            myDocText += '         <span>' + datas['hosp'] + '</span>'
            myDocText += '         <ul class="doc-start">'
            myDocText += '          <li class="icon-start"></li>'
            myDocText += '            <li class="icon-start"></li>'
            myDocText += '            <li class="icon-start"></li>'
            myDocText += '             <li class="icon-start"></li>'
            myDocText += '             <li class="icon-start"></li>'
            myDocText += '         </ul>'
            myDocText += '         <a class="icon-right-bor" href="../../doctor/about.html">医生简介</a>'
            myDocText += '      </div>'
            myDocText += '     <div class="my-doctor-middle bor-b-10-e">'
            myDocText += '     <div class="my-doctor-middle-title  relative webkitBox bor-b-1-e">'
            myDocText += '           <h3>在线咨询</h3>'
            myDocText += '          <span></span>'
            myDocText += '            <a href="tel:400-8052003"></a>'
            myDocText += '     </div>'
            myDocText += '        <ul class="my-doctor-middle-list webkitBox webkitJustify">'
            myDocText += '            <li>'
            myDocText += '               <span><img src="../../../images/common/img_doctor_nav_tezx@2x.png"></span>'
            myDocText += '               <p>图文咨询</p>'
            myDocText += '                <s>' + datas.service['text'] + '</s>'
            myDocText += '          </li>'
            myDocText += '            <li>'
            myDocText += '               <span><img src="../../../images/common/img_doctor_nav_dhzx@2x.png"></span>'
            myDocText += '               <p>电话咨询</p>'
            myDocText += '               <s>' + datas.service['voice'] + '</s>'
            myDocText += '            </li>'
            myDocText += '            <li>'
            myDocText += '                <span><img src="../../../images/common/img_doctor_nav_spzx@2x.png"></span>'
            myDocText += '                <p>视频咨询</p>'
            myDocText += '                <s>' + datas.service['video'] + '</s>'
            myDocText += '           </li>'
            myDocText += '          <li>'
            myDocText += '              <span><img src="../../../images/common/img_doctor_nav_xdpg@2x.png"></span>'
            myDocText += '               <p>心电评估</p>'
            myDocText += '               <s>' + datas.service['ecg'] + '</s>'
            myDocText += '             </li>'
            myDocText += '         </ul>'
            myDocText += '     </div>'
            myDocText += '     <div class="my-doctor-bottom">'
            myDocText += '            <div class="my-doctor-middle-title  relative webkitBox bor-b-1-e">'
            myDocText += '                 <h3>健康服务包</h3>'
            myDocText += '              <a href="../../common/packageList.html">更多</a>'
            myDocText += '        </div>'
            myDocText += '           <div id=' + datas.packages['package_id'] + ' class="package-content">'
            myDocText += '                <ul class="image-text-box ">'
            myDocText += '                 <li class="icon-go">'
            myDocText += '                         <p ' + img + ' class="package-img"></p>'
            myDocText += '                       <h3 class="web-b-f-1 package-text">'
            myDocText += '                             <span>' + datas.packages['subject'] + '</span>'
            myDocText += '                             <s>' + datas.packages['range_str'] + '</s>'
            myDocText += '                          </h3>'
            myDocText += '                      </li>'
            myDocText += '                 </ul>'
            myDocText += '        </div>'
            myDocText += '        </div>'
            $('.my-doctor-box').append(myDocText);
            if (datas['star'])$('.doc-start li').eq(datas['star'] - 1).prevAll().addClass('active').end().addClass('active')
            setTimeout(function(){window.removeLoading()},500)
        }
    })
}
function toAbout(){
    location.href="../../doctor/about.html"
}
wyn.bind.touchEnd('.package-content', function (obj) {
    var _this = $(obj).parents('.package-content');
    if (!Number(_this.attr('id'))) {
        location.href = '../../../page/common/packageList.html';
    }else {
        location.href='../../../page/common/packageDetailsPurchased.html#'+_this.attr('id')
    }
})
