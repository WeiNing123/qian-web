import storage from 'store'
import { login, getInfo, logout } from '@/api/login'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    roles: [],
    menus: [],
    navMenus: [],
    info: {},
    activeMenu: '/home',
    activeMenuName: '首页'
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_NAVMENUS: (state, menus) => {
      state.navMenus = menus
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_ACTIVEMENU: (state, menus) => {
      state.activeMenu = menus
    },
    SET_ACTIVEMENUNAME: (state, activeMenuName) => {
      state.activeMenuName = activeMenuName
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          if (response.code === 200) {
            const result = response.result
            storage.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
            commit('SET_TOKEN', result.token)
          }
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          if (!response) {
            reject(new Error('验证失败，请重新登录'))
          }
          if (!response.roles || response.roles.length <= 0) {
            reject(new Error('获取角色信息失败'))
          }
          commit('SET_ROLES', response.roles)
          commit('SET_INFO', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    setInfo ({ commit }, info) {
      return new Promise(resolve => {
        commit('SET_INFO', info)
      })
    },
    setNavMenu ({ commit }, menu) {
      return new Promise(resolve => {
        commit('SET_NAVMENUS', menu)
      })
    },
    setMenu ({ commit }, menu) {
      return new Promise(resolve => {
        commit('SET_MENUS', menu)
      })
    },
    setActiveMenu ({ commit }, menu) {
      return new Promise(resolve => {
        commit('SET_ACTIVEMENU', menu)
      })
    },
    setActiveMenuName ({ commit }, activeMenuName) {
      return new Promise(resolve => {
        commit('SET_ACTIVEMENUNAME', activeMenuName)
      })
    },

    // 登出
    Logout ({ commit, state }) {
      return new Promise((resolve) => {
        logout(state.token).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          storage.remove(ACCESS_TOKEN)
        })
      })
    }

  }
}

export default user
