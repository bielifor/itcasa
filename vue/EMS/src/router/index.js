import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/page/home.vue'
import User from '@/components/page/users/user.vue'
import Rights from '@/components/page/rights/rights.vue'
import Roles from '@/components/page/roles/roles.vue'
import Goods from '@/components/page/goods/goods.vue'
import Goodsadd from '@/components/page/goods/add.vue'
// import Reports from '@/components/page/reports/reports.vue'
import { Message } from 'element-ui'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/home',
      component: Home,
      children: [
        { path: '/users', component: User },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: Goodsadd },
        // { path: '/reports', component: Reports}

      ]
    }
  ]
})

// 添加一个全局前置守卫
router.beforeEach((to, from, next) => {
  // 当请求login时不应该验证
  if (to.path !== '/login') {
    // 验证 Localstorage 中是否存在 token
    var token = window.localStorage.getItem('token')
    if (!token) {
      // 跳转到登录页面
      router.push('/login')
      Message.error('您还没有登录，强登陆')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
