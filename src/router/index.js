import Vue from 'vue'
import Router from 'vue-router'

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
    path: '/page',
    component: Layout,
    redirect: '/page',
    name: 'index',
    meta: { title: '业务' },
    children: [
      {
        path: '/page/backwardTrace',
        component: () => import('@/views/page/backwardTrace')
      },
      {
        path: '/page/forwardTrace',
        component: () => import('@/views/page/forwardTrace')
      },
      {
        path: '/page/keyPartsTraceability',
        component: () => import('@/views/page/keyPartsTraceability')
      },
      {
        path: '/page/oneClickQuery',
        component: () => import('@/views/page/oneClickQuery')
      },
      {
        path: '/page/productionInformationTraceability',
        component: () => import('@/views/page/productionInformationTraceability')
      },
      {
        path: '/page/qualityInformationTraceability',
        component: () => import('@/views/page/qualityInformationTraceability')
      },
      {
        path: '/page/salesInformationTraceability',
        component: () => import('@/views/page/salesInformationTraceability')
      },
      {
        path: '/page/supplyChainInformationTraceability',
        component: () => import('@/views/page/supplyChainInformationTraceability')
      },
      {
        path: '/basic/org',
        component: () => import('@/views/basic/org')
      },
      {
        path: '/basic/role',
        component: () => import('@/views/basic/role')
      },
      {
        path: '/basic/user',
        component: () => import('@/views/basic/user')
      }
    ]
  }
]

const createRouter = () =>
  new Router({
    // mode: 'history',
    base: '/tab-dome/',
    scrollBehavior: () => ({
      y: 0
    }),
    routes: constantRoutes
  })

const router = createRouter()

export default router
