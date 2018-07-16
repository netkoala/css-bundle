import Vue from 'vue'
import router from './routes/Router'

import './assets/scss/normalize.scss'
import './assets/scss/main.scss'

var vm = new Vue({
    el: '#app',
    router
});