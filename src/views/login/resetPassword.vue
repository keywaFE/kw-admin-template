<template>
  <div class="login" :style="loginStyle">
    <vue-particles
      color="#dedede"
      :particleOpacity="0.5"
      :particlesNumber="30"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.3"
      :linesDistance="180"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="repulse"
    ></vue-particles>
    <div class="introduce">
      <div class="logo">
        <svg-icon icon-class="logo"></svg-icon>
      </div>
    </div>
    <div class="content">
      <h3 class="title">奇鱼结算系统</h3>
      <el-form  label-width="28%" :model='resetForm' :rules="rules" ref='resetForm'>
        <el-form-item label="新密码" prop="newpassword">
          <el-input type="password" v-model="resetForm.newpassword" placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="rppassword" required>
          <el-input type="password" v-model="resetForm.rppassword" placeholder="请输入确认密码"></el-input>
        </el-form-item>
        <el-form-item style="width:100%;">
          <el-button class="login-btn" :loading="loading" type="primary" round @click='resetHandle'>重置密码</el-button>
        </el-form-item>
      </el-form>
    </div>
    <p class="copyright">Copyright &copy; 2018 www.keywa.com All Rights Reserved</p>
  </div>
</template>

<script>
import { patterns } from '@/utils/validate'
import { Message } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'

export default {
  name: 'reset-password',
  data () {
    const validateRpPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.resetForm.newpassword) {
        callback(new Error('确认密码必须与新密码一致!'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'reset',
      loginStyle: {
        width: '',
        height: ''
      },
      loading: false,
      resetForm: {
        // username: '',
        // password: '',
        newpassword: '',
        rppassword: ''
      },
      rules: {
        newpassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            pattern: patterns.password.pattern,
            message: patterns.password.message,
            trigger: 'blur'
          }
        ],
        rppassword: [
          { validator: validateRpPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    setStyle () {
      this.loginStyle.width = window.innerWidth + 'px'
      this.loginStyle.height = window.innerHeight + 'px'
    },
    resetHandle () {
      this.$refs.resetForm.validate((valid) => {
        if (valid) {
          let param = {
            pwd: this.resetForm.newpassword,
            repwd: this.resetForm.rppassword,
            key: this.$route.query.key
          }
          if (getToken()) {
            param.access_token = getToken()
          }
          this.loading = true
          this.$internalUser_passwordReset(param).then((rs) => {
            if (rs.code && rs.code === 400) {
              Message({
                message: rs.msg,
                type: 'error',
                duration: 2 * 1000
              })
            } else {
              Message({
                message: '重置密码成功，为您跳转到登录页',
                type: 'success',
                duration: 2 * 1000
              })
              // 清除token
              getToken() && removeToken()
              this.dialogFormVisible = false
              setTimeout(() => {
                this.$router.push({ path: '/login' })
                // location.reload()
              }, 1500)
            }
            this.loading = false
          }).catch((err) => {
            Message({
              message: err.message,
              type: 'error',
              duration: 2 * 1000
            })
            this.loading = false
          })
        }
      })
    }
  },
  created () {
    this.setStyle()
    window.addEventListener('resize', () => {
      this.setStyle()
    })
  }
}
</script>

<style lang='scss'>
#particles-js {
  position: absolute;
  top: 3%;
  left: 3%;
  bottom: 3%;
  right: 3%;
}
.login {
  position: relative;
  background: rgba(0, 0, 0, 0.2);
  &:before {
    z-index: -999;
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-image: url("../../assets/loginBg.png");
    background-size: cover;
  }
  .captcha-img {
    max-height: 36px;
  }
  .title {
    text-align: center;
    line-height: 30px;
    color: #409eff;
  }
  .content {
    position: fixed;
    top: 35%;
    left: 50%;
    transform: translate3d(-50%, 0, 0);
    background: #fff;
    width: 480px;
    padding: 30px 50px 25px 50px;
    border-radius: 6px;
    box-shadow: 1px 1px 2px #eee;
    .svg-icon {
      font-size: 16px;
    }
  }
  .el-tabs__nav {
    float: none;
    text-align: center;
    .el-tabs__item {
      width: 50%;
      padding: 0;
    }
    .el-tabs__active-bar {
      width: 50% !important;
    }
  }
  .introduce {
    display: none;
    width: 360px;
    position: fixed;
    top: 27%;
    left: 50%;
    margin-left: -180px;
    z-index: 99;
    .logo {
      font-size: 100px;
      text-align: center;
    }
    li {
      font-size: 14px;
      line-height: 28px;
      color: #fff;
    }
  }
  .login-btn {
    width: 60%;
  }
  .copyright {
    position: fixed;
    left: 0;
    width: 100%;
    bottom: 20px;
    color: #ccc;
    font-family: arial;
    font-size: 12px;
    text-align: center;
  }
}
</style>
