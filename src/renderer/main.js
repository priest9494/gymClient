import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import {store} from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.prototype.$axios = axios
Vue.config.productionTip = false

router.replace({name: 'mark', path: '/mark'})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
