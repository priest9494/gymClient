import axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Mark from './components/frames/Mark.vue'
import Subs from './components/frames/Subs.vue'
import SubTypes from './components/frames/SubTypes.vue'
import Trainers from './components/frames/Trainers.vue'
import Clients from './components/frames/Clients.vue'

import {store} from './store';

Vue.use(VueRouter)

Vue.config.productionTip = false
Vue.prototype.$axios = axios

const routes = [
  { path: '/mark', component: Mark },
  { path: '/subs', component: Subs },
  { path: '/subTypes', component: SubTypes },
  { path: '/clients', component: Clients },
  { path: '/trainers', component: Trainers }
]

const router = new VueRouter({
  routes
})

router.replace({ path: '/mark', redirect: '#' })

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
