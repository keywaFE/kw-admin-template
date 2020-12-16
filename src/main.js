import Vue from 'vue'
import ElementUI from 'element-ui'
import VueCompositionAPI from '@vue/composition-api'
// import VueParticles from 'vue-particles'
// import { message } from '@/utils/resetMessage.js'

import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import '@/styles/index.scss' // global css

import '@/plugins/'
// import './mock'

import App from './App'
import router from './router'
import store from './store'

import '@/icons' // icon
import '@/permission' // permission control

import * as filters from './filters' // global filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Vue.use(VueParticles)

Vue.use(ElementUI, {
  size: 'small'
})
Vue.use(VueCompositionAPI)
// Vue.prototype.$message = message
console.log('for debug')
Vue.config.productionTip = false

window._KEYWA_GLOBAL_CONFIG = {
  _trace_id: '',
  _span_id: '',
  _PAGE_IN_TEMP: 0,
  _PAGE_LOAD_TEMP: 0
}

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
