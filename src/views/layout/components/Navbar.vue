<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <div class="breadcrumb-wrapper">
      <breadcrumb></breadcrumb>
    </div>

    <div class="nav-rihgt">
      <!-- <div class="nav-item">
        <el-dropdown  trigger="click">
          <div class="message">
            <el-badge :value="messageTotal" :max="99" class="count">
            </el-badge>
            <svg-icon icon-class="email"></svg-icon>
          </div>
          <el-dropdown-menu slot="dropdown" placement="bottom">
            <ul class="msg-list">
              <li class="no-msg" v-if="!messageList.length">暂无系统消息</li>
              <li class="msg-item" @click="readMsg(msg)" :class="{visited: msg.status === 1}" v-for="msg in messageList" :key="msg.id">
                <div class="text">
                  <svg-icon icon-class="email"></svg-icon>
                  <span class="type">{{typeTips[msg.type - 1]}}</span>
                  <span class="content">{{msg.title}}</span>
                  <span class="date">{{msg.create_at}}</span>
                </div>
                <div class="desc" v-show="msg.id === currentId" v-html="msg.content"></div>
              </li>
            </ul>
          </el-dropdown-menu>
        </el-dropdown>
      </div>-->
      <div class="nav-item">
        <el-dropdown trigger="hover" size="medium">
          <div class="avatar-wrapper">
            <img class="user-avatar" :src="avatar">
            {{name}}
            <i class="el-icon-caret-bottom"></i>
          </div>
          <el-dropdown-menu class="user-dropdown" slot="dropdown">
            <!-- <router-link class="inlineBlock" to="/user/uaccount">
              <el-dropdown-item>
                <svg-icon icon-class="uinfo">
                </svg-icon>
                账户资料
              </el-dropdown-item>
            </router-link>
            <router-link class="inlineBlock" to="/user/financeInfo">
              <el-dropdown-item>
                <svg-icon icon-class="money">
                </svg-icon>
                财务信息
              </el-dropdown-item>
            </router-link>-->
            <!-- <router-link class="inlineBlock" to="/password">
              <el-dropdown-item>
                <svg-icon icon-class="password2" style="margin-right: 6px;"></svg-icon>修改密码
              </el-dropdown-item>
            </router-link> -->
           <!--  <router-link class="inlineBlock" :to="'/internalUser/edit/'+ uid">
              <el-dropdown-item>
                <i class="el-icon-edit-outline"></i>
                编辑资料
              </el-dropdown-item>
            </router-link> -->
            <el-dropdown-item>
              <div @click="logout">
                <svg-icon icon-class="exit" style="margin-right: 7px;"></svg-icon>退出登录
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <div class="nav-item">
        <screenfull class=""></screenfull>
      </div>-->
    </div>
  </el-menu>

</template>

<script>
import { mapGetters } from 'vuex'
import Screenfull from '@/components/Screenfull'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import avatarDefault from '@/assets/avatarDefault.png'
export default {
  components: {
    Breadcrumb,
    Screenfull,
    Hamburger
  },
  data () {
    return {
      avatar: avatarDefault,
      currentId: '',
      messageTotal: 0,
      messageList: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'username',
      'name',
      'id',
      'uid',
      'currentPath',
      'sysMessages'
      // 'avatar'
    ])
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('ToggleSideBar')
    },
    readMsg (msg) {
      if (this.currentId && this.currentId === msg.id) {
        this.currentId = ''
      } else {
        this.currentId = msg.id
      }
      if (msg.status !== 1) {
        this.$message_read({ id: msg.id }).then(rs => {
          this.messageList = this.messageList.map(item => {
            if (item.id === msg.id) {
              item.status = 1
            }
            return item
          })
          // this.messageTotal = this.messageTotal - 1
        })
      }
    },
    logout () {
      this.$store.dispatch('logout').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  },
  created () {
    // this.messageTotal = this.sysMessages.pager.total_count
    // if (this.sysMessages.list) {
    //   this.messageList = [...this.sysMessages.list]
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.navbar {
  height: 64px;
  line-height: 64px;
  border-radius: 0px !important;
  border-bottom: 1px solid #eee;
  .current {
    padding-left: 10px;
    color: #666;
    font-size: 14px;
  }
  .breadcrumb-wrapper {
    float: left;
    position: relative;
    top: 23px;
    height: 18px;
    line-height: 22px;
    overflow: hidden;
  }
  .hamburger-container {
    line-height: 74px;
    height: 64px;
    float: left;
    padding: 0 10px;
  }
  .avatar-wrapper {
    height: 64px;
    line-height: 64px;
    cursor: pointer;
    position: relative;
    padding-left: 28px;
    .uinfo {
      height: 44px;
      padding: 10px 0;
      p {
        margin: 0;
        line-height: 18px;
        font-size: 13px;
      }
    }
    .user-avatar {
      display: -none;
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .el-icon-caret-bottom {
      // position: absolute;
      // right: -20px;
      // top: 25px;
      font-size: 16px;
    }
  }
  .nav-rihgt {
    float: right;
    height: 64px;
    line-height: 64px;
    display: flex;
  }
  .nav-item {
    padding: 0 24px;
  }
  .message {
    cursor: pointer;
    position: relative;
    font-size: 26px;
    color: #666;
    .count {
      position: absolute;
      right: 0;
      top: -10px;
      transform: translateX(50%);
      transform-origin: 100%;
    }
  }
}
.msg-list {
  padding: 0;
  overflow-y: auto;
  max-height: 360px;
  width: 450px;
  max-width: 450px;
}
.no-msg {
  line-height: 40px;
  text-align: center;
  color: #666;
}
.msg-item {
  padding: 0 10px;

  list-style: none;
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  color: #333;
  .desc {
    padding: 0 6px 10px;
    line-height: 22px;
    a {
      color: #409eff;
    }
    pre {
      margin: 0;
      color: #333;
    }
  }
  .text {
    display: flex;
    cursor: pointer;
    color: #409eff;
  }
  &.visited {
    color: rgba(0, 0, 0, 0.5);
    .text {
      color: rgba(0, 0, 0, 0.5);
    }
    .svg-icon {
      color: rgba(0, 0, 0, 0.65);
    }
    pre {
      color: rgba(0, 0, 0, 0.5);
    }
  }
  & + .msg-item {
    border-top: 1px solid #e8e8e8;
  }
  span {
    display: block;
  }
  .svg-icon {
    position: relative;
    top: 12px;
    flex: 0 0 30px;
    font-size: 18px;
    color: #f00;
  }
  .type {
    flex: 0 0 66px;
  }
  .content {
    width: 280px;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .date {
    padding-left: 10px;
    flex: 0 0 90px;
  }
}
</style>
