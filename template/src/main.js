import Vue from 'vue';
import store from '@/store';
import router from './router';
import '@/common/less/common.less';

<%- uiPlugin %>

import App from './App.vue';

Vue.config.productionTip = false;
// store.state.router = router;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app")