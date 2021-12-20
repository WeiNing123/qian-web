const menuList = [
  {
    id: 1,
    label: '业务视图',
    path: '/view',
    icon: 'icon iconfont icon-yewu',
    children: [
      {
        id: 9,
        label: '质量信息追溯',
        path: '/page/qualityInformationTraceability',
        icon: '',
        children: []
      },
      {
        id: 10,
        label: '供应链信息追溯',
        path: '/page/supplyChainInformationTraceability',
        icon: '',
        children: []
      },
      {
        id: 11,
        label: '生产信息追溯',
        path: '/page/productionInformationTraceability',
        icon: '',
        children: []
      },
      {
        id: 12,
        label: '销售及售后服务信息追溯',
        path: '/page/salesInformationTraceability',
        icon: '',
        children: []
      }
    ]
  },
  {
    id: 2,
    label: '向前追溯',
    path: '/page/forwardTrace',
    icon: 'icon iconfont icon-backward',
    children: []
  },
  {
    id: 3,
    label: '向后追溯',
    path: '/page/backwardTrace',
    icon: 'icon iconfont icon-forward',
    children: []
  },
  {
    id: 4,
    label: '一键查询',
    path: '/page/oneClickQuery',
    icon: 'icon iconfont icon-icon_yijianchaxun',
    children: []
  },
  {
    id: 13,
    label: '关键件追溯',
    path: '/page/keyPartsTraceability',
    icon: 'icon iconfont icon-guanjianci',
    children: []
  },
  {
    id: 5,
    label: '系统管理',
    path: '/basic',
    icon: 'el-icon-setting',
    children: [
      {
        id: 6,
        label: '用户管理',
        path: '/basic/user',
        icon: '',
        children: []
      },
      {
        id: 7,
        label: '角色管理',
        path: '/basic/role',
        icon: '',
        children: []
      },
      {
        id: 8,
        label: '部门管理',
        path: '/basic/org',
        icon: '',
        children: []
      }
    ]
  }
]

export default menuList
