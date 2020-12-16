import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    add_time: +Mock.Random.date('T'),
    link: 'https://www.baidu.com',
    resource: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3262939020,1890335534&fm=27&gp=0.jpg',
    title: '@title(2, 3)',
    sort_order: '@increment',
    'position|1': [1, 3],
    'is_show|1': [1, 0]
  }))
}

export default {
  getList: config => {
    let params
    if (config.type === 'GET') {
      params = config.url
    } else {
      params = config.body
    }
    const { type, page = 1, pageSize = 20, sort } = param2Obj(params)

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
