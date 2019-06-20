import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index/index.vue'
import detail from '@/pages/detail/index.vue'
import personal from '@/pages/personal/index.vue'
import login from '@/pages/login/index.vue'
import newblog from '@/pages/newblog/index.vue'
import upblog from '@/pages/upblog/index.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path:'/detail/:id',
      name:'detail',
      component:detail
    },
    {
      path:'/personal',
      name:'personal',
      component:personal
    },
    {
      path:'/login',
      name:'login',
      component:login
    },
    {
      path:'/newblog',
      name:'newblog',
      component:newblog
    },
    {
      path:'updateblog/:id',
      name:'upblog',
      component:upblog
    }
  ]
})
