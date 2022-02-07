const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  userInfo: state => state.user.info,
  navMenus: state => state.user.navMenus,
  deviceHeight: state => state.menu.deviceHeight,
  isCollapse: state => state.menu.isCollapse,
  menuWidth: state => state.menu.menuWidth,
  editableTabs: state => state.menu.editableTabs,
  activeTabIndex: state => state.menu.activeTabIndex
}

export default getters
