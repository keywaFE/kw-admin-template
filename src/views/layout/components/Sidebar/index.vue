<template>
  <div>
    <div class="admin-logo">
      <span class="tab-title">奇鱼结算系统</span>
    </div>
    <el-scrollbar wrapClass="scrollbar-wrapper">
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        :unique-opened="true"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <sidebar-item :routes="permission_routers"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  inject:['reload'],
  components: { SidebarItem },
  computed: {
    ...mapGetters([
      'sidebar',
      'permission_routers'
    ]),
    routes() {
      return this.$router.options.routes
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
  },
  watch: {
    $route(to,from){
      if (to.path === '/dashboard') {
        this.reload()
      }
    }
  }
}
</script>
<style>
  .logo-img {
    width: 150px;
  }
  .tab-title {
    text-align: center;
    display: block;
  }
</style>
