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
      <login></login>
      <!-- <el-tabs v-model="activeName">
        <el-tab-pane label="用户登录" name="login">
          <login></login>
        </el-tab-pane>
        <el-tab-pane label="用户注册" name="signUp">
          <sign-up @signSuccess="handleSignSuccess"></sign-up>
        </el-tab-pane>
      </el-tabs>-->
    </div>
    <p class="copyright">Copyright &copy; 2018 www.keywa.com All Rights Reserved</p>
  </div>
</template>

<script>
import Login from './login'
import SignUp from './signUp'
export default {
  name: 'page-login',
  components: {
    Login,
    SignUp
  },
  data () {
    return {
      activeName: 'login',
      loginStyle: {
        width: '',
        height: ''
      }
    }
  },
  methods: {
    handleSignSuccess () {
      this.activeName = 'login'
    },
    setStyle () {
      this.loginStyle.width = window.innerWidth + 'px'
      this.loginStyle.height = window.innerHeight + 'px'
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
    width: 360px;
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
    width: 100%;
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
