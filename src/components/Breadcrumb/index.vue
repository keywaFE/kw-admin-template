<template>
  <el-breadcrumb class="app-breadcrumb" v-show="levelList.length > 2" separator="/">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item  v-for="(item,index)  in levelList" :key="item.path" v-if="item.meta.title">
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.breadTitle || item.meta.title}}</span>
        <router-link v-else :to="item.redirect||item.path">{{item.meta.breadTitle || item.meta.title}}</router-link>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      let first = matched[0]
      // console.log(first.name)
      if (first && first.name !== 'dashboard') {
        matched = [{ path: '/dashboard', meta: { title: '系统首页' } }].concat(matched)
      }
      this.levelList = matched
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.el-breadcrumb__inner a,
.el-breadcrumb__inner.is-link {
  font-weight: normal;
  color: rgba(0, 0, 0, 0.45) !important;
  transition: color 0.3s;
  &:hover {
    color: #409eff;
  }
}
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  margin-left: 20px;
  .no-redirect {
    color: rgba(0, 0, 0, 0.65) !important;
    cursor: text;
  }
}
</style>
