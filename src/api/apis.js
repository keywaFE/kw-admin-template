import { post, get } from '@/utils/request'
import { apis } from './apisConfig'

/**
 * 单独处理再vuex store modules中调用的接口请求
 * moduels里面的this指向不是vue实例
 */
export function login (data) {
  return post('/user/admin/login', data)
}

export function logout () {
  return post('/user/admin/logout')
}

export function userInfo (data) {
  return post('/system/menus', data)
}

// 刷新token接口
export function refreshToken (data) {
  return post('/user/refresh', data)
}

// 首页统计数据：http://doc.keywa.cc/project/252/interface/api/10315
export function homeCount (data) {
  return post('/distribute/order/general/count', data)
}

/**
 * 集中配置请求
 * apis中的每个key值代表一个功能模块，其value为该模块的api请求列表
 * api中method字段规则由后端提供的接口url地址，按最后两个'/'的单词驼峰组合而成
 * @type {Object}
 */

export function goodMainList (data) {
  return post('/product/goods/unique/lists', data)
}

export const apiMethods = Object.keys(apis).reduce((acc, module) => {
  apis[module].forEach(api => {
    acc[`${module}_${api.method}`] = (params = {}) => {
      if (api.type === 'post') return post(api.url, params)
      if (api.type === 'get') return get(api.url, params)
    }
  })
  return acc
}, {})
