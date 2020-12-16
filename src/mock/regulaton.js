import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

const imageUri = 'https://ss3.baidu.com/-rVXeDTa2gU2pMbgoY3K/it/u=1926710947,4088029293&fm=202'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
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
    }],
    imageUri
  }))
}

export default {
  getList: config => {
    const { type, title, page = 1, limit = 10, sort } = param2Obj(config.body)

    let mockList = List.filter(item => {
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      result: {
        total: mockList.length,
        list: pageList
      }
    }
  }
}
