import Vue from 'vue';
import Router from 'vue-router';
import page from 'pages/Page1';
import error from 'pages/Error403';

Vue.use(Router)

export default new Router({
    mode: 'hash',
    base: '/',
    routes: [
        {
            name: 'Home',
            path: '/',
            component: page
        },
        {
            name: 'Error',
            path: '/Error',
            component: error
        }
    ]
})
