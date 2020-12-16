import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    create_time: +Mock.Random.date('T'),
    username: '@first',
    name: '@title(2, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted']
  }))
}

export default {
  getUserList: config => {
    const { type, page = 1, pageSize = 20, sort } = param2Obj(config.body)

    let mockList = List.filter(item => {
      if (type && item.type !== type) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < pageSize * page && index >= pageSize * (page - 1))

    return {
      result: {
        total: mockList.length,
        list: pageList
      }
    }
  }
}
