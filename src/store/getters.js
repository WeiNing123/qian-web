const getters = {
  userInfo: state => state.menu.info,
  navMenus: state => state.menu.navMenus,
  deviceHeight: state => state.menu.deviceHeight,
  isCollapse: state => state.menu.isCollapse,
  menuWidth: state => state.menu.menuWidth,
  editableTabs: state => state.menu.editableTabs,
  activeTabIndex: state => state.menu.activeTabIndex
}

export default getters
