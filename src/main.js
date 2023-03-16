import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import axios from 'axios';
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
axios.defaults.baseURL = '/api'

axios.interceptors.request.use( function(config) {
  config.headers['token'] = window.sessionStorage.getItem("user_token")
  return config;
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
