<template>
  <div class="bg1" :style="{'background-image': 'url(' + bgImg + ')', 'height': loginHeight}">
    <div class="warp" :style="{'height': loginHeight}">
      <div class="content">
        <h1 style="color: #ffffff;">个人综合应用平台</h1>
        <div style="width: 100%; height: 15px;">&nbsp;</div>
        <el-form :model="params" :rules="rules" ref="loginForm" class="login-form">
          <el-form-item prop="username">
            <el-input placeholder="请输入用户名" prefix-icon="el-icon-user" v-model="params.username" size="large" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input placeholder="请输入密码" type="password" prefix-icon="el-icon-lock" v-model="params.password" size="large" @keyup.enter.native="submitForm('loginForm')"></el-input>
          </el-form-item>
          <el-form-item prop="securityCode">
            <el-col :span="15">
              <el-input placeholder="请输入验证码" prefix-icon="el-icon-lock" v-model="params.securityCode" size="large" @keyup.enter.native="submitForm('loginForm')"></el-input>
            </el-col>
            <el-col :span="9">
              <div style="width: 100%; height: 40px; background: #ffffff;">
                <img
                  style="width: 100%; height: 40px;"
                  :src="authImgUrl"
                  @click="getSecurityCode"
                />
              </div>
            </el-col>
          </el-form-item>
          <div style="width: 100%; height: 15px;">&nbsp;</div>
          <el-form-item>
            <el-button
              style="width: 50%;"
              type="primary"
              @click="submitForm('loginForm')"
              size="medium"
              round
              :loading="state.loginBtn"
              :disabled="state.loginBtn">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="login-footer">@copy;&nbsp;2022-2030&nbsp;河南心倩信息科技有限公司.&nbsp;&nbsp;技术中心电话:15516183233</div>
  </div>
</template>

<script>
import md5 from 'md5'
import { mapActions } from 'vuex'
import { baseUrl } from '@/api/base'

export default {
  data () {
    return {
      bgImg: require('@/assets/image/login.jpg'),
      authImgUrl: '',
      isLoginError: false,
      params: {
        username: '',
        password: '',
        securityCode: ''
      },
      loginParams: {
        userCode: '',
        password: '',
        securityCode: ''
      },
      state: {
        loginBtn: false
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不低于5个字符', trigger: 'blur' }
        ],
        securityCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    loginHeight () {
      return window.innerHeight + 'px'
    }
  },
  created () {
    this.getSecurityCode()
  },
  methods: {
    ...mapActions(['Login']),
    submitForm (formName) {
      const {
        params,
        loginParams,
        state,
        Login
      } = this

      state.loginBtn = true

      this.$refs[formName].validate((valid) => {
        if (valid) {
          loginParams.userCode = params.username
          loginParams.password = md5(params.password)
          loginParams.securityCode = params.securityCode
          setTimeout(() => {
            Login(loginParams)
              .then((res) => this.loginSuccess(res))
              .catch(err => this.requestFailed(err))
              .finally(() => {
                state.loginBtn = false
              })
          }, 1000)
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    getSecurityCode () {
      this.authImgUrl = baseUrl.url + '/auth/authImg?timestamp=' + new Date().getTime()
    },
    loginSuccess (res) {
      this.isLoginError = false
      window.location.reload()
    },
    requestFailed (err) {
      this.isLoginError = true
      console.log(err.response)
    }
  }
}
</script>

<style scoped>
.bg1 {
  background-size: 100% 100%;
  background-repeat: no-repeat;
}
.warp {
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.3);
  text-align: center;
  position: absolute;
}
.content {
  width: 560px;
  margin: auto;
  top: 200px;
  position: relative;
}
.login-form {
  width: 330px;
  margin: 0 auto;
}
.login-footer {
  width: 100%;
  height: 40px;
  line-height: 40px;
  color: #ffffff;
  text-align: center;
  position: absolute;
  bottom: 10px;
  font-size: 15px;
}
>>> .el-form-item--small .el-form-item__content, .el-form-item--small .el-form-item__label {
  line-height: 32px;
}
</style>
