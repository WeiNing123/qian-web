// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/components/iconfont/iconfont.css'

import router from './router'

Vue.config.productionTip = false

Vue.use(Element, { size: 'small' })

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
