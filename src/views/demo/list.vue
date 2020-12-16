<template>
  <div class="app-container">
    <div class="total-count">目前拥有<span class="num">{{state.total}}</span>名代理商</div>
    <kw-table
      ref="tableRef"
      :api="tableState.api"
      :columns="tableState.tableColumn"
      :ignoreOperations="['add', 'edit', 'remove']"
      :page-size="state.pageSize"
      :page="state.page"
      :search="tableState.searchForm"
      :params="state.search"
      :importOptions="importOptions"
      :importTableColumns="importTableColumns"
      :exportUrl="exportUrl"
      :exportParams="state.search"
      @onGetTotal="getTotal"
      :transformData="transformData"
    >
      <template v-slot:header-right-slot>
        <el-select
          v-model="state.search.order_by"
          placeholder="请选择"
          @change="handleSearch"
        >
          <el-option
            v-for="item in orderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </template>
      <template v-slot:team_num="scopeProps">
        <el-button type="text">{{
          scopeProps.row.team_num
        }}</el-button>
      </template>
      <template v-slot:sales_order="scopeProps">
        <el-button
          type="text"
          @click="toDetail(scopeProps.row)"
          >{{ scopeProps.row.sales_order }}</el-button
        >
      </template>
      <template v-slot:btns="scopeProps">
        <el-button type="primary" @click="toDetail(scopeProps.row)"
          >编辑</el-button
        >
        <el-button type="danger" @click="handleDelete(scopeProps.row)"
          >删除</el-button
        >
      </template>
    </kw-table>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from '@vue/composition-api'
import { getAgentList, agentDel, getAgentGrade, agentImport } from '@/api/agent'
import useRequest from '@/hooks/useRequest'
import KwTable from '@/components/KwTable/'
import { uploadUrls } from '@/config'
export default {
  components: {
    KwTable
  },
  setup(props, ctx) {
    const state = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      gradeList: [],
      search: {
        order_by: ''
      }
    })
    const tableRef = ref(null)
    const tableState = reactive({
      // api: '/xxxx/xxx',
      api: getAgentList,
      tableColumn: [
        {
          label: 'ID',
          prop: 'id',
          width: '120'
        },
        {
          label: '昵称',
          prop: 'nickname'
        },
        {
          label: '代理商等级',
          prop: 'agent_grade',
          width: '100'
        },
        {
          label: '推荐人',
          width: '180',
          render: (h, props) => {
            return h(
              'div',
              props.row.recommend_user_id + ' ' + props.row.recommend_nickname
            )
          }
        },
        {
          label: '直属上级',
          width: '180',
          render: (h, props) => {
            return h(
              'div',
              props.row.parent_id + ' ' + props.row.parent_nickname
            )
          }
        },
        {
          label: '佣金收入(元)',
          prop: 'brokerage_total',
          width: '100'
        },
        {
          label: '订单数',
          slot: 'sales_order',
          width: '80'
        },
        {
          label: '星级',
          prop: 'star_total',
          width: '60'
        },
        {
          label: '团队人数',
          slot: 'team_num',
          width: '80'
        },
        {
          label: '更新时间',
          prop: 'update_time',
          width: '150'
        },
        {
          label: '操作',
          slot: 'btns',
          width: '150',
          fixed: 'right'
        }
      ],
      searchForm: [
        {
          tag: 'input',
          itemAttrs: {
            label: '姓名/ID：'
          },
          attrs: {
            key: 'id',
            value: '',
            placeholder: '请输入姓名/ID'
          }
        },
        {
          tag: 'input',
          itemAttrs: {
            label: '微信昵称：'
          },
          attrs: {
            key: 'nickname',
            value: '',
            placeholder: '请输入微信昵称'
          }
        },
        {
          tag: 'input',
          itemAttrs: {
            label: '手机号：'
          },
          attrs: {
            key: 'mobile',
            value: '',
            placeholder: '请输入手机号'
          }
        },
        {
          tag: 'input',
          itemAttrs: {
            label: '推荐人：'
          },
          attrs: {
            key: 'recommend_user_id',
            value: '',
            placeholder: '请输入推荐人ID'
          }
        },
        {
          name: 'grade',
          tag: 'select',
          itemAttrs: {
            label: '所属等级：'
          },
          attrs: {
            key: 'grade',
            value: '',
            options: []
          }
        },
        {
          tag: 'date',
          itemAttrs: {
            label: '佣金收入时间'
          },
          attrs: {
            key: 'date',
            value: ['', ''],
            type: 'daterange',
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            startPlaceholder: '请选择起始时间',
            endPlaceholder: '请选择结束时间'
          }
        }
      ]
    })

    const orderOptions = ref([
      { label: '默认排序(ID)', value: '' },
      { label: '佣金排序', value: 'brokerage' },
      { label: '订单数排序', value: 'order' },
      { label: '更新时间排序', value: 'update' }
    ])

    const { result: gradeResult, use: getGradeList } = useRequest(() =>
      getAgentGrade()
    )
    watch(gradeResult, rs => {
      if (rs) {
        state.gradeList = JSON.parse(
          JSON.stringify(rs.filter(item => +item.id !== 0))
            .replace(/id/g, 'value')
            .replace(/title/g, 'label')
        )
        tableState.searchForm.forEach(item => {
          if (item.name && item.name === 'grade') {
            item.attrs.options = state.gradeList
          }
        })
      }
    })

    function handleSearch() {
      tableRef.value.refresh(true)
    }

    function toDetail(row) {
      ctx.root.$router.push({
        name: 'demoDetail',
        params: { id: row.id, agent: 1 }
      })
    }

    function handleDelete(row) {
      ctx.root
        .$confirm('确认删除该代理商?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          del(row.id)
        })
    }

    const { result: delResult, use: del } = useRequest(id => agentDel({ id }))

    watch(delResult, delResult => {
      if (delResult) {
        ctx.root.$message({
          message: '删除成功',
          type: 'success',
          duration: 1000
        })
        tableRef.value.refresh(true)
      }
    })

    onMounted(() => {
      getGradeList()
    })

    // 导入
    const importTableColumns = [
      {
        label: '会员ID',
        prop: 'id'
      },
      {
        label: '实际层级身份',
        prop: 'agent_grade'
      },
      {
        label: '推荐人ID',
        prop: 'recommend_user_id'
      },
      {
        label: '上级奇鱼ID',
        prop: 'parent_id'
      }
    ]
    const importOptions = {
      uploadFileUrl: uploadUrls.file,
      downloadUrl: '/public/agent.xlsx',
      importApi: agentImport
    }

    // 导出URL
    const exportUrl = '/distribute/agent/export'

    function getTotal(total) {
      state.total = total
    }

    function transformData(data) {
      const date = {
        start_date: data.date ? data.date[0] : '',
        end_date: data.date ? data.date[1] : ''
      }
      delete data.date
      return {
        ...data,
        ...date
      }
    }

    return {
      tableState,
      state,
      orderOptions,
      handleSearch,
      tableRef,
      toDetail,
      handleDelete,
      importTableColumns,
      importOptions,
      exportUrl,
      getTotal,
      transformData
    }
  }
}
</script>
<style lang="scss">
.total-count {
  margin-bottom: 20px;
  color: #606266;
  font-weight: 700;
  .num {
    padding:  0 5px;
    color: #409EFF;
  }
}
</style>
