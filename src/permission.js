import router from './router'
import store from './store'
// import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
// import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权
import { constantRouterMap, errorRouterMap } from '@/router/'
import { generateTraceId, getUrlKey } from '@/utils/'
import { USE_AUTH } from './config'

const whiteList = ['/login', '/resetPassword'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  const urlParams = {
    code: getUrlKey('code'),
    state: getUrlKey('state')
  }
  window._KEYWA_GLOBAL_CONFIG._trace_id = generateTraceId()
  window._KEYWA_GLOBAL_CONFIG._span_id = generateTraceId()
  NProgress.start()
  if (urlParams.code) {
    store.dispatch('login', urlParams).then(() => {
      location.href = location.origin + location.pathname
    }).catch(() => {
      location.href = location.origin + location.pathname
    })
  } else if (getToken()) {
    if (to.path === '/login') {
      NProgress.done()
      next({ path: '/' })
    } else {
      if (store.getters.username.length === 0) { // 判断当前用户是否已拉取完user_info信息
        let usrerModules = []
        store.dispatch('getUserInfo').then(rs => { // 拉取user_info
          if (USE_AUTH) { // 是否开启权限校验
            if (rs.is_admin) {
              usrerModules = [...constantRouterMap]
            } else {
              let permissionString = rs.list.join()
              let routeModules = constantRouterMap.filter(item => {
                const list = rs.list.map(item => item.replace('//', '/'))
                if (list.includes(item.path)) {
                  return true
                }
                return false
              })
              usrerModules = routeModules.map(item => {
                const children = item.children.filter(child => {
                  if (item.path === '/dashboard') {
                    return true
                  }

                  return permissionString.includes((item.path + '/' + child.path).replace('//', '/'))
                })
                return {
                  ...item,
                  children
                }
              })
            }
          } else {
            usrerModules = [...constantRouterMap]
          }
          generateRoutes(usrerModules, to, next)
        }).catch(err => {
          console.log(err)
        })
      } else {
        next()
        NProgress.done()
      }
      next()
      NProgress.done()
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`)
      NProgress.done()
    }
  }
  // next()
})

router.afterEach(() => {
  window._KEYWA_GLOBAL_CONFIG._PAGE_IN_TEMP = +new Date()
  NProgress.done() // 结束Progress
})

function generateRoutes(usrerModules, to, next) {
  store.dispatch('GenerateRoutes', usrerModules.concat(errorRouterMap)).then(() => { // 根据roles权限生成可访问的路由表
    const routes = usrerModules.concat(errorRouterMap)
    router.addRoutes(routes)
    // router.addRoutes(usrerModules) // 动态添加可访问路由表
    next({ ...to, replace: true })
    NProgress.done()
    // next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
  })
}
