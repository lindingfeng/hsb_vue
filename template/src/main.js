import Vue from 'vue';
import router from './router';
import '@/common/less/common.less';

<%- uiPlugin %>

// 增加import引用第三方css方式，如果不用自定义，建议用static里面的css样式，通过script方式引用有利于缓存处理

import App from './App.vue';
// import store from './store';

Vue.config.productionTip = false;
// store.state.router = router;

// import Ajax from 'utils/ajax'
// Ajax.post({
//     url: "/gateway/get_ft_list"
// })

new Vue({
    el: '#app',
    // store,
    router,
    components: { App },
    template: '<App/>'
});
