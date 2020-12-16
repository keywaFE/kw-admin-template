import Vue from 'vue'
import { apiMethods } from '@/api/apis'
import { post, get } from '@/utils/request'
import { formatDate } from '@/utils/'
/**
 * 注册到vue对象中 使用$前缀
 */

Vue.use({
  install(Vue, options) {
    const deepRegister = (target, source) => {
      for (let k in source) {
        if (typeof source[k] === 'object') {
          deepRegister(target, source[k])
        } else {
          Object.defineProperty(target.prototype, '$' + k, { value: source[k] })
        }
      }
    }

    deepRegister(Vue, {
      formatDate,
      apiMethods,
      post,
      get
    })
  }
})
