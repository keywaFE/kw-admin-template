<template>
  <div class="app-container">
    <!-- <p>商品信息</p> -->
    <el-form ref="detailForm" :model="state.detail" label-width="120px" v-model="state.detail">
      <el-form-item label="ID：">
        <span>{{state.detail.id}}</span>
      </el-form-item>
      <el-form-item label="姓名：">
        <span>{{state.detail.uname}}</span>
      </el-form-item>
      <el-form-item label="手机号：">
        <span>{{state.detail.mobile}}</span>
      </el-form-item>
      <el-form-item label="总订单笔数：">
        <span>{{ state.detail.sales_order }}</span>
      </el-form-item>
      <el-form-item label="推荐人ID：">
        <span>{{state.detail.recommend_user_id}} {{state.detail.recommend_nickname}}</span>
      </el-form-item>
      <el-form-item label="佣金收入(元)：">
        <span>{{state.detail.brokerage_total}}</span>
      </el-form-item>
      <el-form-item label="注册时间：">
        <span>{{state.detail.create_time}}</span>
      </el-form-item>
      <el-form-item label="用户地址信息：">
        <span>{{state.detail.address}}</span>
      </el-form-item>
      <div v-if="state.detail.is_agent">
        <el-form-item label="直属上级ID：">
          <span>{{state.detail.parent_id}} {{state.detail.parent_nickname}}</span>
          <el-button style="color: #E6A23C;" type="text" size="medium" @click="setEmptyParent">置空</el-button>
        </el-form-item>
        <el-form-item label="代理商等级：">
          <el-select v-model="state.detail.agent_grade" placeholder="请选择" clearable>
            <el-option
              v-for="item in state.gradeList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="btn-group">
      <el-button icon="el-icon-back" style="width: 100px;" @click="handleBack()">返回列表</el-button>
      <el-button type="primary" style="width: 200px;" @click="handleEdit()">确认保存</el-button>
      <el-button type="danger" style="width: 100px;" @click="handleDel()">删除</el-button>
    </div>
  </div>
</template>

<script>
import { watch, onMounted, reactive } from '@vue/composition-api'
import { getAgentDetail, getAgentGrade, agentEdit, agentDel } from '@/api/agent'
import useRequest from '@/hooks/useRequest'
export default {
  setup(props, ctx) {
    const state = reactive({
      detail: {},
      gradeList: []
    })

    const { result, use: getDetail } = useRequest((id) => {
      return getAgentDetail({ id })
    })
    watch(result, (rs) => {
      if (rs) {
        state.detail = rs
        state.detail.agent_grade = rs.agent_grade || ''
      }
    })

    const { result: gradeResult, use: getGradeList } = useRequest(() =>
      getAgentGrade()
    )
    watch(gradeResult, (rs) => {
      if (rs) {
        state.gradeList = rs.filter(item => +item.id !== 0)
      }
    })

    const { result: editResult, use: handleEdit } = useRequest(() => {
      const { id, is_agent, recommend_user_id, parent_id, agent_grade } = state.detail
      let postData = { id, is_agent, recommend_user_id, parent_id, agent_grade }
      return agentEdit({ post: postData })
    })

    function handleDel() {
      ctx.root.$confirm('确认删除该代理商', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del({ id: state.detail.id })
      })
    }

    const { result: delResult, use: del } = useRequest(() => {
      return agentDel({ id: state.detail.id })
    })

    watch(editResult, (rs) => {
      handleResult('保存成功')
    })
    watch(delResult, (rs) => {
      handleResult('删除成功')
    })

    function handleResult(msg) {
      ctx.root.$message({
        message: msg,
        type: 'success',
        duration: 1000
      })
      handleBack()
    }

    onMounted(() => {
      const id = ctx.root.$route.params.id
      getDetail(id)
      getGradeList()
    })

    const handleBack = () => {
      ctx.root.$router.push({ path: '/demo/list' })
    }

    function setEmptyParent() {
      state.detail.parent_id = 0
      state.detail.parent_nickname = ''
    }

    return {
      state,
      handleEdit,
      handleDel,
      handleBack,
      setEmptyParent
    }
  }
}
</script>

<style lang="scss">
.btn-group {
  margin-top: 20px;
}
.search-container {
  margin-bottom: 10px;
}
.brokerage-total {
  margin-bottom: 20px;
  font-size: 18px;
}
.order-info {
  margin-top: 40px;
  .order-info-header {
    font-weight: 700;
    color: #606266;
    margin: 0 0 20px 0 !important;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    padding: 20px;
  }
  .panel {
    text-align: center;
    .title {
      margin-bottom: 20px;
    }
    .count {
      font-size: 24px;
      color: #f4516c;
    }
  }
  .header-search-icon {
    display: none;
  }
}
</style>
