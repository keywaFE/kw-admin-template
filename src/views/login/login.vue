<template>
  <div>
    <el-form
      label-position="left"
      label-width="0px"
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
    >
      <el-form-item prop="username">
        <el-input
          type="text"
          auto-complete="off"
          placeholder="账号"
          v-model="loginForm.username"
        >
          <svg-icon slot="prefix" icon-class="user"></svg-icon>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          auto-complete="off"
          placeholder="密码"
          v-model="loginForm.password"
          @keyup.native.enter="loginHandle('loginForm')"
        >
          <svg-icon slot="prefix" icon-class="password2"></svg-icon>
        </el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button
          class="login-btn"
          :loading="loading"
          type="primary"
          round
          @click="loginHandle('loginForm')"
          >登录</el-button
        >
      </el-form-item>
      <!-- <el-button @click="forgetPassword" style="float: right;" type="text">忘记密码</el-button> -->
    </el-form>

    <el-dialog
      title="忘记密码"
      :visible.sync="dialogFormVisible"
      center
      width="40%"
      append-to-body="true"
      top="35vh"
    >
      <el-form
        :model="sendForm"
        label-width="100px"
        :rules="sendFormRules"
        ref="sendForm"
      >
        <el-form-item label="请输入邮箱" label-width="30%" prop="email">
          <el-input v-model="sendForm.email" style="width: 80%;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="sendEmail">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { Message } from 'element-ui'
export default {
  name: 'page-login',
  data() {
    return {
      loading: false,
      loginForm: {
        username: '',
        password: ''
      },
      dialogFormVisible: false,
      sendLoading: false,
      redirect: '',
      sendForm: {
        email: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { pattern: /^.{5,18}$/, message: '限5-18个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
          // { 'pattern': /^.{6,18}$/, 'message': '限6-18个字符', 'trigger': 'blur' }
        ]
      },
      sendFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        // 需要进行解码
        let redirectPath = decodeURIComponent(route.fullPath).split(
          'redirect='
        )[1]
        this.redirect = redirectPath
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions(['login']),
    // ...mapMutations(['forgetPassword']),
    loginHandle(ref) {
      this.$refs[ref].validate(valid => {
        if (valid) {
          this.loading = true
          this.login(this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push(this.redirect || '/')
            })
            .catch(err => {
              Message({
                message: err.message,
                type: 'error',
                duration: 2 * 1000
              })
              this.loading = false
            })
        }
      })
    },
    forgetPassword() {
      this.dialogFormVisible = true
    },
    sendEmail() {
      this.$refs.sendForm.validate(valid => {
        if (valid) {
          this.sendLoading = true
          this.$internalUser_forgetPassword({ email: this.sendForm.email })
            .then(rs => {
              if (rs.code && rs.code === 400) {
                Message({
                  message: rs.msg,
                  type: 'error',
                  duration: 2 * 1000
                })
              } else {
                Message({
                  message: '重置密码邮件已发送至该邮箱，请登录邮箱继续操作',
                  type: 'success',
                  duration: 2 * 1000
                })
                this.dialogFormVisible = false
              }
              this.sendLoading = false
            })
            .catch(err => {
              Message({
                message: err.message,
                type: 'error',
                duration: 2 * 1000
              })
              this.sendLoading = false
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
