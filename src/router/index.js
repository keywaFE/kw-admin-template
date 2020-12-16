import Vue from 'vue'
import Router from 'vue-router'

import Layout from '../views/layout/Layout'

Vue.use(Router)

export const baseRouterMap = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'root'
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    children: [
      {
        path: '',
        meta: {
          title: '首页',
          icon: 'dashboard'
        },
        component: () => import('@/views/dashboard/index')
      }
    ]
  }
]

export const constantRouterMap = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    meta: {
      title: '首页',
      icon: 'home'
    },
    children: [
      {
        path: '',
        meta: {
          title: '首页',
          icon: 'home'
        },
        component: () => import('@/views/dashboard/index')
      }
    ]
  },
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo/list',
    name: 'demo',
    meta: {
      title: '代理商管理',
      icon: 'agent'
    },
    children: [
      {
        path: 'list',
        name: 'demoList',
        meta: {
          title: '代理商列表',
          icon: 'userList'
        },
        component: () => import('@/views/demo/list')
      },
      {
        path: 'detail/:id/:agent',
        name: 'demoDetail',
        meta: {
          title: '代理商详情',
          isMemberDetail: true
        },
        hidden: true,
        component: () => import('@/views/demo/detail')
      }
    ]
  }
]

export const errorRouterMap = [{ path: '*', redirect: '/404', hidden: true }]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: baseRouterMap
})
