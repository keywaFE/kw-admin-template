import { post } from '@/utils/request'
// 代理商列表：http://doc.keywa.cc/project/252/interface/api/10182
export function getAgentList(params) {
  return post('/distribute/agent/list', params)
}

// 代理商详情：http://doc.keywa.cc/project/252/interface/api/10196
export function getAgentDetail(params) {
  return post('/distribute/agent/detail', params)
}

// 编辑代理商：http://doc.keywa.cc/project/252/interface/api/10224
export function agentEdit(params) {
  return post('/distribute/customer/edit', params)
}

// 删除代理商：http://doc.keywa.cc/project/252/interface/api/10210
export function agentDel(params) {
  return post('/distribute/agent/delete', params)
}

// 代理商等级：http://doc.keywa.cc/project/252/interface/api/10231
export function getAgentGrade(params) {
  return post('/distribute/agent/grade', params)
}

// 导入代理商：http://doc.keywa.cc/project/252/interface/api/10238
export function agentImport(params) {
  return post('/distribute/agent/import', params)
}
