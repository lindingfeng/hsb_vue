import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const Home = () => import('../views/index/index.vue');
const Detail = () => import('../views/detail/index.vue');

export default new Router({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/detail/:id',
            component: Detail
        }
    ]
});
