import axios from 'axios'
import store from '@/store'
import storage from 'store'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import ElementUI from 'element-ui'
import { baseUrl } from '../api/base'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: baseUrl.url,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      ElementUI.Notification({
        title: 'Forbidden',
        message: data.message,
        type: 'error'
      })
    }
    if (error.response.status === 401) {
      ElementUI.Notification({
        title: 'Unauthorized',
        message: 'Authorization verification failed',
        type: 'error'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use((response) => {
  if (response.data.code === 301) {
    ElementUI.Notification({
      title: '提示',
      message: '用户名或密码错误',
      type: 'error'
    })
    setTimeout(() => {
      return false
    }, 1000)
  } else if (response.data.code === 302) {
    ElementUI.Notification({
      title: '提示',
      message: '无效token',
      type: 'error'
    })
    setTimeout(() => {
      store.dispatch('Logout').then(() => {
        window.location.reload()
      })
    }, 1000)
  } else if (response.data.code === 303) {
    console.log(11111)
    ElementUI.Notification({
      title: '登录超时',
      message: '登录超时，请重新登录...',
      type: 'error'
    })
    console.log(22222)
    setTimeout(() => {
      store.dispatch('Logout').then(() => {
        console.log(33333)
        window.location.reload()
      })
    }, 1000)
  } else {
    return response.data
  }
}, errorHandler)

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
