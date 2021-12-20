<template>
  <el-container>
    <el-aside class="aside-context" :style="{'min-height': asideHeight, 'width': menuWidth}">
      <div class="aside-header">
        <img :src="logo" class="aside-logo">
        <div v-show="!isCollapse" class="aside-title">&nbsp;Tabs 标签页 Dome</div>
      </div>
      <Menu></Menu>
    </el-aside>
    <el-container>
      <el-header style="padding: 0;">
        <Header></Header>
      </el-header>
      <el-tabs :value="activeTabIndex" type="card" closable @tab-remove="removeTab" @tab-click="selectTab">
        <el-tab-pane label="首页" :closable="false" :key="activeName" :name="activeName"></el-tab-pane>
        <el-tab-pane v-for="(item, index) in editableTabs" :key="index+1+''" :label="item.title" :name="index+1+''"></el-tab-pane>
      </el-tabs>
      <el-main class="menu-nav">
        <router-view :key="key"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import Header from './Header'
import Menu from './Menu'

export default {
  components: {
    Header,
    Menu
  },
  data () {
    return {
      logo: require('@/assets/logo.png'),
      activeName: '0'
    }
  },
  computed: {
    ...mapState({
      navMenus: (state) => state.menu.navMenus,
      menuWidth: (state) => state.menu.menuWidth + 'px',
      isCollapse: (state) => state.menu.isCollapse,
      editableTabs: (state) => state.menu.editableTabs,
      activeTabIndex: (state) => state.menu.activeTabIndex
    }),
    asideHeight: function () {
      return window.innerHeight + 'px'
    },
    mainHeight: function () {
      return window.innerHeight - 112 + 'px'
    },
    key () {
      return this.$route.fullPath
    }
  },
  methods: {
    removeTab (targetName) {
      if (targetName !== '0') {
        let tabs = this.editableTabs
        let title = ''
        let newTabs = []
        let list = tabs.filter(tab => tab.name !== targetName)
        let name = ''
        if (targetName === this.activeTabIndex) {
          name = Number(targetName) - 1 + ''
          tabs.forEach((tab, index) => {
            if (tab.name === name) {
              title = tab.title
            }
          })
          let path = this.getPath(title)
          this.$router.push(path)
          this.$store.dispatch('setActiveMenu', path)
        } else {
          tabs.forEach((tab, index) => {
            if (tab.name === this.activeTabIndex) {
              title = tab.title
            }
          })
        }
        list.forEach((tab, index) => {
          newTabs.push({title: tab.title, name: index + 1 + ''})
          if (title === tab.title) {
            this.$store.dispatch('setActiveTabIndex', index + 1 + '')
          }
        })
        this.$store.dispatch('setEditableTabs', newTabs)
        if (name === '0') {
          this.$store.dispatch('setActiveTabIndex', name)
        }
      }
    },
    selectTab (tab) {
      let targetName = tab._props.name
      if (this.activeTabIndex !== targetName) {
        let path = this.getPath(tab._props.label)
        this.$router.push(path)
        this.$store.dispatch('setActiveMenu', path)
        this.$store.dispatch('setActiveTabIndex', targetName)
      }
    },
    getPath (label) {
      let path = '/home'
      this.navMenus.forEach((item) => {
        if (item.label === label) {
          path = item.path
        } else {
          if (item.children.length > 0) {
            item.children.forEach((item1) => {
              if (item1.label === label) {
                path = item1.path
              } else {
                if (item1.children.length > 0) {
                  item1.children.forEach((item2) => {
                    if (item2.label === label) {
                      path = item2.path
                    } else {
                      if (item2.children.length > 0) {
                        item2.children.forEach((item3) => {
                          if (item3.label === label) {
                            path = item3.path
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
      return path
    }
  }
}
</script>

<style scoped>
.aside-context {
  background: #0f9095;
}
.aside-header {
  height: 60px;
  background: #1bb0b6;
}
.aside-logo {
  height: 50px;
  width: 50px;
  margin: 5px 7px;
  float: left;
}
.aside-title {
  height: 60px;
  line-height: 60px;
  color: #fff;
  width: 190px;
  text-align: left;
  font-size: 20px;
  font-weight: bold;
  float: left;
}
.menu-nav {
  padding: 0;
  width: 100%;
}
</style>
