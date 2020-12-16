/**
 * 格式化时间
 * @param {Date} date 传入时间对象：new Date()
 * @param {String} fmt 输出个字符串格式：yyyy-MM-dd hh:mm:ss
 * @return {String} '2018-06-18 15:22:23'
 */
export function formatDate(date, fmt) {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return timeStr
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

// export function param2Obj(url) {
//   let search = url
//   if (/\?/.test(search)) {
//     search = url.split('?')[1]
//     if (!search) {
//       return {}
//     }
//   }

//   return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}')
// }

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return {Object} {id:12345,a:b}
 */
export function query2obj(queryString) {
  let url = queryString || window.location.search
  let obj = {}
  let reg = /[^?&]+=[^?&]+/g
  let arr = url.match(reg)
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}

export function debounce(func, delay, immediate) {
  let timer
  let context = this
  const debounce = function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    if (immediate) {
      let callNow = !timer
      timer = setTimeout(() => {
        timer = null
      }, delay)
      if (callNow) {
        func.apply(context, args)
      }
    } else {
      timer = setTimeout(() => {
        func.apply(context, args)
      }, delay)
    }
  }

  debounce.cancel = function () {
    clearTimeout(timer)
    timer = null
  }
  return debounce
}

export function nMonth(n) {
  let targetDate = new Date()
  targetDate.setMonth(targetDate.getMonth() + n)
  return (new Date(+targetDate + 1000 * 60 * 60 * 24)).toLocaleString().split(' ')[0]
}

export function nDay(n) {
  const date = new Date()
  const milliseconds = +date + 1000 * 60 * 60 * 24 * (n + 1)
  return (new Date(milliseconds)).toLocaleString().split(' ')[0]
}

export const merge = (...objs) =>
  [...objs].reduce(
    (acc, obj) =>
      Object.keys(obj).reduce((a, k) => {
        acc[k] = acc.hasOwnProperty(k) ? [].concat(acc[k]).concat(obj[k]) : obj[k]
        return acc
      }, {}),
    {}
  )

export const objectMerge = (...objs) => {
  return [...objs].reduce((acc, obj) => {
    Object.keys(obj).forEach(k => {
      acc[k] = (typeof obj[k] === 'object') ? objectMerge(acc[k], obj[k]) : obj[k]
    })
    return acc
  })
}

/**
 * 深克隆一个对象
 * @param  {Object or Array} obj
 * @return  {Object or Array}
 * const a = { foo: 'bar', obj: { a: 1, b: 2 } }
 * const b = deepClone(a); // a !== b, a.obj !== b.obj
 */
export const deepClone = obj => {
  let clone = Object.assign({}, obj)
  Object.keys(clone).forEach(
    key => (clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key])
  )
  return Array.isArray(obj) ? (clone.length = obj.length) && Array.from(clone) : clone
}

export const nest = (items, id = null, link = 'parent_id') =>
  items
    .filter(item => item[link] === id)
    .map(item => ({ ...item, children: nest(items, item.id) }))

/**
 * 根据pid返回树形结构
 * @param  {Array} data 一伟数组列表
 * @return {Array}  树形嵌套数组
 */
export const listTransformTree = (data, pid = 'parent_id') => {
  let map = {}
  let result = []
  let mapData = deepClone(data)

  mapData.map(item => (map[item.id] = item))

  mapData.map(item => {
    let parent = map[item[pid]]
    parent ? (parent.children || (parent.children = [])).push(item) : result.push(item)
  })
  return result
}

/**
 * 将数组块化为指定大小的较小数组。
 * @param  {Array} arr 传入的一维数组
 * @param  {Number} size 分割长度
 * @return {Array}     结果二位数组
 * chunk([1, 2, 3, 4, 5], 2); // [[1,2],[3,4],[5]]
 */
export const chunk = (arr, size) => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  )
}

export const generateTraceId = () => (new Date().getTime() * 1000) + Math.round(Math.random() * 1000 + 0) + ''

export function getUrlKey(name) {
  /* eslint-disable-next-line */
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
}
