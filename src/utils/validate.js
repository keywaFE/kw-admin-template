export const patterns = {
  email: {
    pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
    message: '邮箱格式不正确'
  },
  password: {
    pattern: /^.{6,18}$/,
    message: '用户密码限制6-18位'
  },
  phone: {
    pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
    message: '手机格式不正确'
  }
}
