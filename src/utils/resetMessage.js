/* 重置message，防止重复点击重复弹出message弹框  */
import {
  Message
} from 'element-ui'
let messageInstance = null
const resetMessage = (options) => {
  // 如果弹窗已存在先关闭
  if (messageInstance) {
    messageInstance.close()
  }
  messageInstance = Message(options)
}
['error', 'success', 'info', 'warning'].forEach(type => {
  resetMessage[type] = options => {
    if (typeof options === 'string') {
      options = {
        message: options
      }
    }
    options.type = type
    return resetMessage(options)
  }
})

export const message = resetMessage
