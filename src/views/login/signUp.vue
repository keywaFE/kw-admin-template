<template>
    <el-form label-position="left" label-width="0px" :model='signForm' :rules="rules" ref='signForm'>
      <el-form-item prop='username'>
        <el-input
          type="text"
          auto-complete="off"
          placeholder="账号"
          v-model='signForm.username'
          >
          <svg-icon slot="prefix" icon-class="user2"></svg-icon>
        </el-input>
      </el-form-item>
      <el-form-item prop='password'>
          <el-input type="password"
            auto-complete="off"
            placeholder="密码"
            v-model='signForm.password'
            @keyup.native.enter="loginHandle('signForm')"
          >
          <svg-icon slot="prefix" icon-class="password2"></svg-icon>
          </el-input>
      </el-form-item>
      <el-form-item prop='rppassword'>
          <el-input type="password"
            auto-complete="off"
            placeholder="密码"
            v-model='signForm.rppassword'
            @keyup.native.enter="loginSignUp('signForm')"
          >
          <svg-icon slot="prefix" icon-class="password2"></svg-icon>
          </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
          <el-button class="login-btn" :loading="loading" type="primary" round @click='loginSignUp("signForm")'>注册</el-button>
      </el-form-item>
    </el-form>
</template>

<script>
import { patterns } from '@/utils/validate'
export default {
  data () {
    const validateRppassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.signForm.password) {
        callback(new Error('确认密码必须与密码一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      signForm: {
        username: '',
        password: '',
        rppassword: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '用户名不能为空！',
            trigger: 'blur'
          },
          {
            pattern: patterns.email.pattern,
            message: patterns.email.message,
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空！',
            trigger: 'blur'
          },
          {
            pattern: patterns.password.pattern,
            message: patterns.password.message,
            trigger: 'blur'
          }
        ],
        rppassword: [
          { validator: validateRppassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loginSignUp (ref) {
      this.$refs[ref].validate((valid) => {
        if (valid) {
          this.loading = true
          this.$user_signup(this.signForm).then(() => {
            this.loading = false
            this.signForm.username = ''
            this.signForm.password = ''
            this.signForm.rppassword = ''
            this.$emit('signSuccess')
            this.$message.success('注册成功,请登录')
          }).catch(() => {
            this.loading = false
          })
        }
      })
    }
  }
}
</script>

<style lang='scss'>
  .login-btn {
    width: 100%;
  }
</style>
