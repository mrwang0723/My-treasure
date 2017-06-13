/**
 * Created by Administrator on 2017/5/17 0017.
 */
$(function(){
    new Vue({
        el: '.about-box',
        data: {
            aboutDatas: {
                avatar: ''
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                var _this = this;
               /* $.post(ajaxUrl+'/v1_3/wx/doctor/read', function (data) {
                    data = JSON.parse(data)
                    console.log(data);
                    if (data.code == -1) {
                        alert(data.msg);
                        window.history.back();
                    } else {
                        console.log(data)
                        _this.aboutDatas = data.datas
                        setTimeout(function () {

                        }, 10)
                    }
                })*/
                this.aboutDatas = JSON.parse($.session.get('myDoc')).datas;
                setTimeout(function(){window.removeLoading()},500);
            })
        },
        methods: {
            showText: function (e) {
                var obj = $(e.target).parents('h2').siblings('.two-row');
                var oldHeight = obj.outerHeight();
                obj.toggleClass('auto-row')
                var newHeight = obj.find('p').outerHeight(true);
                if (oldHeight != newHeight) {
                    $(e.target).parents('h2').find('span').toggleClass('icon-unfold');
                    obj.css('height',obj.find('p').outerHeight(true))
                }
            }
        }
    })
})