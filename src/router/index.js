import Vue from 'vue'
import Router from 'vue-router'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar custom style
import store from '../store/'
import { D2T } from '@/utils/data'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'index',
    meta: { title: '首页' },
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/home'),
        meta: { title: '首页', icon: 'fa fa-home', closable: false, affix: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/seeFile',
    name: 'seeFile',
    component: () => import('@/views/page/filePage')
  },
  {
    path: '/404',
    component: () => import('@/views/exception/404')
  },
  {
    path: '/page',
    component: Layout,
    redirect: '/page',
    name: 'index',
    meta: { title: '业务' },
    children: []
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history',
    base: '/qian-web/',
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

// 解决下一个用户登录 还是上一个用户路由权限的问题
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login', '/logout'] // 不重定向白名单

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const deviceHeight = window.innerHeight - 90
  store.dispatch('setDeviceHeight', deviceHeight)

  const hasToken = storage.get(ACCESS_TOKEN)

  if (hasToken) {
    // 有token值
    if (to.path === '/login') {
      // 如果请求登陆页面 直接进入主页
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0

      if (hasRoles) {
        next()
      } else {
        const { menu } = await store.dispatch('GetInfo')

        const menuTree = D2T(menu)
        let addRoutes = addDynamicRoutes(menuTree)
        // console.log('addRoutes', addRoutes)
        const len = router.options.routes.length
        router.options.routes[len - 1].children = router.options.routes[len - 1].children.concat(addRoutes)
        router.addRoutes(router.options.routes)
        store.dispatch('setNavMenu', menuTree)
        next({ ...to, replace: true })
      }
    }
  } else {
    // 在免登陆名单内 可以访问 需要配合后台的shiro使用
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login') // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})
router.afterEach(() => {
  NProgress.done() // 结束Progress
})

/**
 * 添加动态(菜单)路由
 * @param {*} menuList 菜单列表
 * @param {*} routes 递归创建的动态(菜单)路由
 */
function addDynamicRoutes (menuList = [], routes = []) {
  var temp = []
  for (var i = 0; i < menuList.length; i++) {
    if (menuList[i].children && menuList[i].children.length >= 1) {
      temp = temp.concat(menuList[i].children)
    } else if (menuList[i].path && /\S/.test(menuList[i].path)) {
      const url = menuList[i].path
      if (!url) continue
      // 创建路由配置
      var route = {
        path: url,
        component: null,
        name: menuList[i].label,
        meta: {
          title: menuList[i].label,
          icon: menuList[i].icon,
          closable: true,
          affix: false
        }
      }
      try {
        // 根据菜单URL动态加载vue组件，这里要求vue组件须按照url路径存储
        // 如url='sys/user'，则组件路径应是'@/views/sys/index.vue',否则组件加载不到
        if (menuList[i].children && menuList[i].children.length > 0) {
          route['component'] = resolve => require([`@/layout`], resolve)
          route['redirect'] = 'noRedirect'
        } else {
          route['component'] = resolve => require([`@/views${url}`], resolve)
        }
      } catch (e) {
        console.log('error', e)
      }
      routes.push(route)
    }
  }
  if (temp.length >= 1) {
    addDynamicRoutes(temp, routes)
  }
  return routes
}
