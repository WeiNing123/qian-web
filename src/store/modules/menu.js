import menuList from './menuList'

const menu = {
  state: {
    isCollapse: false,
    menuWidth: 256,
    info: {id: 1, userCode: 'admin', userName: '管理员'},
    menus: [],
    navMenus: menuList,
    activeMenu: '/home',
    activeMenuName: '首页',
    deviceHeight: window.innerHeight - 90,
    editableTabs: [],
    activeTabIndex: '0'
  },

  mutations: {
    SET_ISCOLLAPSE: (state, isCollapse) => {
      state.isCollapse = isCollapse
    },
    SET_MENUWIDTH: (state, menuWidth) => {
      state.menuWidth = menuWidth
    },
    SET_INFO: (state, info) => {
      state.info = info
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_NAVMENUS: (state, menus) => {
      state.navMenus = menus
    },
    SET_ACTIVEMENU: (state, menus) => {
      state.activeMenu = menus
    },
    SET_ACTIVEMENUNAME: (state, menus) => {
      state.activeMenuName = menus
    },
    SET_DeviceHeight: (state, deviceHeight) => {
      state.deviceHeight = deviceHeight
    },
    SET_EDITABLETABS: (state, tabs) => {
      state.editableTabs = tabs
    },
    SET_ACTIVETABINDEX: (state, activeIndex) => {
      state.activeTabIndex = activeIndex
    }
  },

  actions: {
    setIsCollapse ({ commit }, isCollapse) {
      return new Promise(resolve => {
        commit('SET_ISCOLLAPSE', isCollapse)
      })
    },
    setMenuWidth ({ commit }, menuWidth) {
      return new Promise(resolve => {
        commit('SET_MENUWIDTH', menuWidth)
      })
    },
    setMenu ({ commit }, menu) {
      return new Promise(resolve => {
        commit('SET_MENUS', menu)
      })
    },
    setNavMenu ({ commit }, menu) {
      return new Promise(resolve => {
        commit('SET_NAVMENUS', menu)
      })
    },
    setActiveMenu ({ commit }, menu) {
      return new Promise(resolve => {
        commit('SET_ACTIVEMENU', menu)
      })
    },
    setActiveMenuName ({ commit }, menu) {
      return new Promise(resolve => {
        commit('SET_ACTIVEMENUNAME', menu)
      })
    },
    setDeviceHeight ({ commit }, deviceHeight) {
      return new Promise(resolve => {
        commit('SET_DeviceHeight', deviceHeight)
      })
    },
    setEditableTabs ({ commit }, tabs) {
      return new Promise(resolve => {
        commit('SET_EDITABLETABS', tabs)
      })
    },
    setActiveTabIndex ({ commit }, ActiveIndex) {
      return new Promise(resolve => {
        commit('SET_ACTIVETABINDEX', ActiveIndex)
      })
    }
  }
}

export default menu
