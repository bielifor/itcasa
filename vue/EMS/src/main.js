// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Element from 'element-ui'
import MyBread from '@/layout/bread.vue'
import myaxios from '@/assets/js/myaxios.js'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/index.css'

Vue.use(myaxios)
Vue.use(Element)

Vue.component(MyBread.name, MyBread)
Vue.config.productionTip = false;

var a = true
if (a === true) {
  console.log('aa');
}

/* eslint-disable no-new */
// 创建一个vue实例
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'    
})