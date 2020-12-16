<template>
  <div class="menu-wrapper">
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <router-link
        v-if="item.path === '/dashboard'"
        to="/dashboard"
        :key="item.children[0].name"
      >
        <el-menu-item
          index="dashboard"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <svg-icon
            v-if="item.children[0].meta&&item.children[0].meta.icon"
            :icon-class="item.children[0].meta.icon"
          ></svg-icon>
          <span
            v-if="item.children[0].meta&&item.children[0].meta.title"
            slot="title"
          >{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>
      <router-link
        v-else-if="item.path !== '/dashboard' && item.children.length && hasZeroShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
        :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name"
      >
        <el-menu-item
          :index="item.path+'/'+item.children[0].path"
          :class="{'submenu-title-noDropdown':!isNest}"
        >
          <svg-icon
            v-if="item.children[0].meta&&item.children[0].meta.icon"
            :icon-class="item.children[0].meta.icon"
          ></svg-icon>
          <span
            v-if="item.children[0].meta&&item.children[0].meta.title"
            slot="title"
          >{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.children&&child.children.length>0"
            :routes="[child]"
            :key="child.path"
          ></sidebar-item>

          <div v-else @click="handleRoute(item, child)" @dblclick="handleDblclick" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </div>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import logoImg from '../../../../assets/logo.png'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logoImg
    }
  },
  methods: {
    logoClick() {
      this.$router.push({ path: '/' })
    },
    hasZeroShowingChildren(children) {

      const showingChildren = children.filter(item => {
        return !item.hidden
      })
      return showingChildren.length === 0
    },
    handleRoute(item, child) {
      this.$router.push({
        path: `${item.path}/${child.path}`
      })
    },
    handleDblclick() {
      window.location.reload()
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
