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
    <div class="container-right">
      <i class="el-icon-setting" style="cursor: pointer;" title="修改密码" @click="modifyPassword"></i>
    </div>

    <el-dialog title="修改密码" :visible.sync="modifyPasswordDialog" width="600px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="modifyPasswordForm" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model="passwordForm.userCode" readonly></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="passwordForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="info" @click="modifyPasswordDialog = false" plain>取 消</el-button>
        <el-button type="primary" @click="trueModifyPassword('modifyPasswordForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import store from '../store/'

export default {
  data () {
    return {
      modifyPasswordDialog: false,
      passwordForm: {
        id: store.getters.userInfo.id,
        userCode: store.getters.userInfo.userCode,
        password: '',
        newPassword: ''
      },
      passwordRules: {
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'},
          {min: 6, message: '数字和字母组合,长度最少6个字符', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.user.info,
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
    },
    modifyPassword () {
      this.passwordForm.password = ''
      this.passwordForm.newPassword = ''
      this.modifyPasswordDialog = true
    },
    trueModifyPassword (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$post('/auth/modifyPassword', this.passwordForm).then(res => {
            if (res.state === 0) {
              this.$notify({ title: '提示', message: '原密码输入错误!', type: 'error' })
            } else {
              this.$notify({ title: '提示', message: '密码修改成功，重新登录生效!', type: 'success' })
              this.modifyPasswordDialog = false
            }
          })
        } else {
          return false
        }
      })
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
