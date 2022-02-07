// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/'
import { VueAxios } from './utils/request'
import { get, post } from './api/http'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/components/iconfont/iconfont.css'

import * as echarts from 'echarts'

import router from './router'
import { dateFormat } from './utils/date'

Vue.config.productionTip = false

Vue.use(VueAxios)
Vue.use(Element, { size: 'small' })

Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$echarts = echarts
Vue.prototype.$dateFormat = dateFormat

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
