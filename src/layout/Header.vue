<template>
  <div class="container-header">
    <div class="container-left">
      <i v-show="isCollapse" class="el-icon-s-unfold" @click="openMenu"></i>
      <i v-show="!isCollapse" class="el-icon-s-fold" @click="closeMenu"></i>
    </div>
    <div class="container-right">
      <el-menu
        background-color="#1bb0b6"
        text-color="#ffffff"
        @select="clickBar"
        mode="horizontal">
        <el-submenu index="userBtn">
          <template slot="title"><i class="fa el-icon-s-custom" />&nbsp;&nbsp;{{ userInfo.userName }}</template>
          <el-menu-item index="logout" key="logout">
            <i class="el-icon-switch-button" />
            <span slot="title">&nbsp;&nbsp;退出</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.menu.info,
      isCollapse: (state) => state.menu.isCollapse
    })
  },
  created () {
  },
  methods: {
    ...mapActions(['Logout']),
    clickBar (key, keyPath) {
      if (key === 'logout') {
        this.logout()
      }
    },
    // 退出登录
    logout () {
      this.Logout().then(() => {
        window.location.reload()
      })
    },
    openMenu () {
      this.$store.dispatch('setIsCollapse', false)
      this.$store.dispatch('setMenuWidth', 256)
    },
    closeMenu () {
      this.$store.dispatch('setIsCollapse', true)
      this.$store.dispatch('setMenuWidth', 64)
    }
  }
}
</script>

<style lang="scss">
  .container-header {
    height: 60px;
    line-height: 60px;
    width: 100%;
    color: #ffffff;
    border-bottom: #f8f7f6 2px solid;
    background: #1bb0b6;
  }
  .container-left {
    color: #ffffff;
    height: 60px;
    line-height: 60px;
    float: left;
    padding: 0 20px;
    font-size: 25px;
    cursor: pointer;
  }
  .container-right {
    height: 60px;
    float: right;
    margin-right: 30px;
  }
  .el-menu.el-menu--horizontal {
    border-bottom: solid 0px #e6e6e6;
  }
</style>
