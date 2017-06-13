/**
 * Created by Administrator on 2017/5/24 0024.
 */
Vue.directive('blur', {
    // 当绑定元素插入到 DOM 中。
    inserted: function (el) {
        // 聚焦元素

    },
    /*当数据更新时 防触发*/
    update:function(el,value){
        if(!value.value){
            el.blur()
        }
    }
});