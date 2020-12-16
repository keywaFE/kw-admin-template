const aliveDomain = window.location.origin || 'http://dev-qy.keywa.cc'
export const config = {
  baseUrl: process.env.NODE_ENV !== 'production' ? 'http://dev-qy.keywa.cc' : aliveDomain
}

export const uploadUrls = {
  image: `${config.baseUrl}/system/image/uploads`,
  file: `${config.baseUrl}/image/uploadfile`,
  storage: '/storage/upload'
}

export const patterns = {
  url: {
    pattern: /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
    message: '请输入http(s)开头的网址'
  },
  email: {
    pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
    message: '请输入正确的email格式'
  }
}

export const USE_AUTH = false // 是否开启权限校验
