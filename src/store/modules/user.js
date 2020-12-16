import { login, logout, userInfo } from '@/api/apis'
import { getToken, removeToken, setStorage, getStorage } from '@/utils/auth'
import { USE_AUTH } from '@/config'

const user = {
  state: {
    token: getToken(),
    uid: '',
    name: '',
    username: '',
    avatar: '',
    permission_routers: [],
    roles: [],
    isAdmin: false
  },

  mutations: {
    REMOVE_USER_INFO: (state, status) => {
      state.name = ''
      state.username = ''
      state.uid = ''
    },
    SET_ID: (state, id) => {
      state.uid = id
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_ROUTERS: (state, routers) => {
      state.permission_routers = routers
    },
    SET_ADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin
    }
  },

  actions: {
    GenerateRoutes({ commit }, routers) {
      return new Promise(resolve => {
        commit('SET_ROUTERS', routers)
        resolve()
      })
    },
    // 登录
    login({ commit }, data) {
      const loginParams = data.username ? {
        username: data.username.trim(),
        password: data.password
      } : { code: data.code, state: data.state }
      return new Promise((resolve, reject) => {
        login(loginParams).then(result => {
          // 保存token等信息
          const setData = {
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            expires_in: result.expires_in,
            uid: result.id,
            username: result.username,
            name: result.name
          }
          setStorage(setData)

          commit('SET_TOKEN', result.access_token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    getUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const uid = getStorage('uid')
        const username = getStorage('username')
        const name = getStorage('name')
        commit('SET_ID', uid)
        commit('SET_USERNAME', username)
        commit('SET_NAME', name)
        commit('SET_TOKEN', getToken())
        if (USE_AUTH) { // 是否开启权限校验
          userInfo({ id: uid }).then(rs => {
            commit('SET_ADMIN', rs.is_admin)
            resolve(rs)
          })
        } else {
          resolve()
        }
      })
    },

    // 登出
    logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout({}).then(() => {
          commit('SET_TOKEN', '')
          commit('REMOVE_USER_INFO')
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
