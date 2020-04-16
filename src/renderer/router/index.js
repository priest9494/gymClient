import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/mark',
      name: 'mark',
      component: require('@/components/frames/Mark').default
    },
    {
      path: '/subs',
      name: 'subs',
      component: require('@/components/frames/Subs').default
    },
    {
      path: '/clients',
      name: 'clients',
      component: require('@/components/frames/Clients').default
    },
    {
      path: '/trainers',
      name: 'trainers',
      component: require('@/components/frames/Trainers').default
    },
    {
      path: '/payments',
      name: 'payments',
      component: require('@/components/frames/Payments').default
    },
    {
      path: '/report',
      name: 'report',
      component: require('@/components/frames/Report').default
    },
    {
      path: '/subTypes',
      name: 'subTypes',
      component: require('@/components/frames/SubTypes').default
    }
  ]
})
