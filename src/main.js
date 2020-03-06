import axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Mark from './components/Mark.vue'

Vue.use(VueRouter);
Vue.config.productionTip = false;
Vue.prototype.$axios = axios;

const routes = [
  { path: '/mark', component: Mark }
];

const router = new VueRouter({
  routes
});

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
