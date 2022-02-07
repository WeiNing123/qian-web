const menu = {
  state: {
    isCollapse: false,
    menuWidth: 256,
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
