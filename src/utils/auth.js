// import Cookies from 'js-cookie'
import { refreshToken } from '../api/apis'
import store from '@/store'

const TokenKey = 'access_token'

const localStorageKey = [
  'access_token',
  'expires_in',
  'refresh_token',
  'uid',
  'username'
]

export function getToken() {
  // return Cookies.get(TokenKey)
  return window.localStorage.getItem(TokenKey)
}

export function removeToken() {
  // Cookies.remove(TokenKey)
  localStorageKey.map(item => {
    window.localStorage.removeItem(item)
  })
}

export function setStorage(param) {
  for (let key in param) {
    window.localStorage.setItem(key, param[key])
  }
}

export function getStorage(key) {
  // return Cookies.get(TokenKey)
  return window.localStorage.getItem(key)
}

export function removeStorage(key) {
  // return Cookies.get(TokenKey)
  return window.localStorage.removeItem(key)
}

// 检查当前token是否过期
export function checkToken() {
  const nowTime = parseInt(new Date().getTime() / 1000)
  return new Promise((resolve, reject) => {
    if (getStorage('expires_in') && (nowTime > getStorage('expires_in') - 900)) {
      // 当前时间离过期时间小于15分钟
      refreshToken({
        refresh_token: getStorage('refresh_token')
      }).then(res => {
        const newToken = {
          access_token: res.access_token,
          expires_in: res.expires_in,
          refresh_token: res.refresh_token
        }
        // 更新token
        setStorage(newToken)
        store.commit('SET_TOKEN', res.access_token)
        resolve(res.access_token)
      })
    } else {
      resolve(window.localStorage.getItem(TokenKey))
    }
  })
}
