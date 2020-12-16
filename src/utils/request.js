import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import { message } from '@/utils/resetMessage.js'
import { getToken, removeToken, checkToken } from '@/utils/auth'
import store from '@/store'
import router from '../router'
import { generateTraceId } from '@/utils/'

axios.defaults.timeout = 30 * 1000
axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded;charset=UTF-8'
// 多环境融合 需要加 /api路劲
// axios.defaults.baseURL = '/api'

axios.interceptors.request.use(
  config => {
    if (config.url.indexOf('import') !== -1) {
      config.timeout = 0
    }
    if (config.method === 'post' && !(config.data instanceof FormData)) {
      config.data = qs.stringify(config.data)
    } else {
      // 上传文件不设超时时间
      config.timeout = 0
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// respone拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.error) {
      if (response.data.error.code === 401) {
        // 封装的 element Message，防止重复弹出
        message({
          message: '登录超时，请重新登录',
          type: 'error',
          duration: 2 * 1000
        })
        store.commit('DEL_ALL_VIEWS')
        removeToken()

        router.push(`/login?redirect=${router.history.current.fullPath}`)
      } else {
        Message({
          message: response.data.error.message,
          type: 'error',
          duration: 2 * 1000
        })
      }
      return Promise.reject(response.data.error)
    }
    return response.data.result
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

async function request (options) {
  if (!options) {
    return
  }

  let config = {
    url: options.url,
    method: options.method,
    headers: {
      'X-B3-Referer': router.currentRoute.path,
      'X-B3-TraceId': '',
      'X-B3-SpanId': '',
      'Authorization': ''
    }
  }

  // 不带token的接口url
  const urlArray = [
    '/user/admin/login'
  ]

  if (!urlArray.some(item => { return options.url === item })) {
    let token = getToken()
    if (options.url !== '/user/refresh') {
      token = await checkToken()
    }
    config.headers['Authorization'] = 'Bearer ' + token
  }

  if (window._KEYWA_GLOBAL_CONFIG && window._KEYWA_GLOBAL_CONFIG._trace_id) {
    const betweenTemp = +new Date() - window._KEYWA_GLOBAL_CONFIG._PAGE_IN_TEMP
    if (betweenTemp > 500) {
      config.headers['X-B3-TraceId'] = generateTraceId()
      config.headers['X-B3-SpanId'] = generateTraceId()
    } else {
      config.headers['X-B3-TraceId'] = window._KEYWA_GLOBAL_CONFIG._trace_id
      config.headers['X-B3-SpanId'] = window._KEYWA_GLOBAL_CONFIG._span_id
    }
  }

  if (options.method === 'get') {
    config.params = options.data
  }
  if (options.method === 'post') {
    config.data = options.data
  }
  return axios(config)
}

export function get (url, data = {}) {
  return request({
    url,
    data,
    method: 'get'
  })
}

export function post (url, data = {}) {
  return request({
    url,
    data,
    method: 'post'
  })
}
