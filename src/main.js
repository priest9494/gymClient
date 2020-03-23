import axios from 'axios'
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App.vue'
import Mark from './components/Mark.vue'
import Subs from './components/Subs.vue'
import SubTypes from './components/SubTypes.vue'
import Trainers from './components/Trainers.vue'
import Clients from './components/Clients.vue'

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
  render: h => h(App),
  router
}).$mount('#app')
