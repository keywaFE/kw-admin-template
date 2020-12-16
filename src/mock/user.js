import Mock from 'mockjs'
import { query2obj } from '@/utils'

const mockList = []
const count = 100

for (let i = 0; i < count; i++) {
  mockList.push(Mock.mock({
    id: '@increment',
    title: '@title(5, 10)',
    'state|1': [1, 2, 3],
    'status|1': [0, 1],
    sort_order: '@integer(1, 99)',
    create_time: +Mock.Random.datetime('yyyy-MM-dd A HH:mm:ss'),
    update_time: +Mock.Random.datetime('yyyy-MM-dd A HH:mm:ss'),
    author: '@first',
    state_name: '@first',
    status_name: '@first',
    cate_id: '@increment',
    cate_name: '@first',
    'tag|2-10': [{
      tag_id: '@increment',
      title: '@first'
    }]
  }))
}

export default {
  login: config => {
    const { username, password } = query2obj(config.body)
    if (username === 'admin' && password === '123') {
      return {
        result: {
          username: '唐伯虎',
          userId: '9527',
          access_token: 9086536717222
        }
      }
    } else {
      return {
        error: {
          message: '账号或密码不正确'
        }
      }
    }
  },
  logout: config => {
    return {
      result: true
    }
  },
  userList: config => {
    const { title, page = 1, limit = 10 } = query2obj(config.body)

    const respList = mockList
      .filter(item => {
        if (title && item.title.indexOf(title) < 0) return false
        return true
      })
      .filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      result: {
        total: mockList.length,
        list: respList
      }
    }
  }
}
