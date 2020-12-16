<template>
  <div class="kw-table">
    <kw-form
      v-show="state.showSearchBar"
      v-if="searchState.formItems.length"
      :items="searchState.formItems"
      :loading="loading"
      submitText="搜索"
      @submit="handleSearch"
    ></kw-form>
    <div class="header" v-if="!simple">
      <div class="left">
        <slot name="header-btns" />
        <el-button
          v-if="operationState.canAdd"
          size="small"
          type="primary"
          icon="el-icon-plus"
          @click="handleActions('add')"
        >
          新增
        </el-button>
        <el-button
          v-if="operationState.canSelection && operationState.canEdit"
          size="small"
          type="success"
          icon="el-icon-edit"
          :disabled="state.selections.length !== 1"
          @click="handleActions('edit')"
        >
          修改
        </el-button>
        <el-button
          v-if="operationState.canSelection && operationState.canRemove"
          slot="reference"
          type="danger"
          icon="el-icon-delete"
          size="small"
          :disabled="state.selections.length === 0"
          @click="handleActions('remove')"
        >
          删除
        </el-button>
        <el-button
          v-if="importOptions && importOptions.importApi"
          size="small"
          type="primary"
          icon="el-icon-upload2"
          @click="handleActions('import')"
          >导入</el-button
        >
        <el-button
          v-if="exportUrl"
          size="small"
          type="warning"
          icon="el-icon-download"
          @click="handleActions('export')"
          >导出</el-button
        >
        &nbsp;
      </div>
      <div class="right">
        <slot name="header-right-slot" />
        <el-button-group>
          <el-button size="small" icon="el-icon-search" class="header-search-icon"
          @click="toggleSearch" />
          <el-button
            size="small"
            :loading="loading"
            icon="el-icon-refresh"
            @click="refresh"
          />
          <el-popover placement="bottom-end" width="150" trigger="click">
            <el-button slot="reference" size="small" icon="el-icon-s-grid">
              <i class="fa fa-caret-down" aria-hidden="true" />
            </el-button>
            <el-checkbox
              v-model="state.allColumnsSelected"
              :indeterminate="state.allColumnsSelectedIndeterminate"
              @change="handleCheckAllChange"
            >
              全选
            </el-checkbox>
            <el-checkbox
              v-for="item in state.columns"
              :key="item.prop"
              v-model="item.visiable"
              :checked="item.visiable"
              @change="handleCheckChange"
            >
              {{ item.label }}
            </el-checkbox>
          </el-popover>
        </el-button-group>
      </div>
    </div>
    <el-table
      :data="state.dataList"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @select-all="handleSelectAll"
      border
      ref="tableRef"
    >
      <el-table-column
        v-if="operationState.canSelection && !simple"
        type="selection"
        align="center"
      />
      <template v-for="column in state.columns">
        <!-- 支持自定义render -->
        <el-table-column
          v-if="column.visiable && column.render"
          :key="column.prop"
          v-bind="setAttrs(column)"
        >
          <template slot-scope="scope">
            <Render :row="scope.row" :index="index" :render="column.render" />
          </template>
        </el-table-column>
        <!-- 支持slot -->
        <el-table-column
          v-else-if="column.visiable && column.slot"
          :key="column.prop"
          v-bind="setAttrs(column)"
        >
          <template slot-scope="scope">
            <slot :name="column.slot" :row="scope.row" />
          </template>
        </el-table-column>
        <!-- 常用的特定元素展示 image link 等 -->
        <el-table-column
          v-else-if="column.visiable && column.img"
          :key="column.prop"
          v-bind="setAttrs(column)"
        >
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="430"
              trigger="hover"
              v-if="scope.row.goods_thumb"
            >
              <img
                style="width: 400px; height: 400px; display:inline-block;"
                :src="scope.row[column.prop]"
                object-fit="cover"
              />
              <img
                style="width: 60px; height: 60px; display:inline-block;"
                :src="scope.row[column.prop]"
                object-fit="cover"
                slot="reference"
              />
            </el-popover>
            <i
              v-else
              class="el-icon-picture-outline"
              style="font-size: 60px;"
            ></i>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.visiable && column.format"
          :key="column.prop"
          v-bind="setAttrs(column)"
        >
          <template slot-scope="scope">
            <div>{{ column.format(scope.row, column) }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="column.visiable && column.prefix"
          :key="column.prop"
          v-bind="setAttrs(column)"
        >
          <template slot-scope="scope">
            <span>{{ column.prefix }}{{ scope.row[column.prop] }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="column.visiable"
          :key="column.prop"
          v-bind="setAttrs(column)"
        />
      </template>
    </el-table>
    <div class="footer">
      <div>
        <el-button
          type="primary"
          :disabled="!state.dataList.length"
          v-if="operationState.canSelection && !simple"
          @click="selectAll"
          >{{ !state.isSelectedAll ? '全选' : '取消全选' }}</el-button
        >
        <slot
          name="footer-btns"
          v-bind="{ selection: state.selections, rows: state.dataList }"
        />
      </div>
      <Pagination
        v-if="pagination"
        :page="pageState.page"
        :page-size="pageState.pageSize"
        :total="pageState.total"
        @onPageChange="handlePageChange"
      />
    </div>
    <kw-import
      ref="importDialogRef"
      v-if="importOptions && importOptions.importApi"
      @onSuccess="handelImportSuccess"
      :options="importOptions"
      :columns="importTableColumns"
    ></kw-import>
  </div>
</template>

<script>
import { watch, reactive, onMounted, ref, computed } from '@vue/composition-api'
import { post } from '@/utils/request'
import Render from './render'
import Pagination from '@/components/pagination/'
import KwForm from '@/components/KwForm/'
import useRequest from '@/hooks/useRequest'
import KwImport from '@/components/KwImport/'

export const difference = (a, b) => {
  const s = new Set(b)
  return a.filter(x => !s.has(x))
}

export const upCate = str => str.charAt(0).toUpperCase() + str.slice(1)

export function type(obj) {
  return Object.prototype.toString
    .call(obj)
    .replace(/^\[object (.+)\]$/, '$1')
    .toLowerCase()
}

export function object2query(obj, separator = '&') {
  if (!obj) return '请检查参数是否为对象'
  const handleKey = Object.keys(obj).filter(key => obj[key] != null)
  const handleArray = handleKey.map(
    key => `${key}=${encodeURIComponent(obj[key])}`
  )
  return handleArray.join(separator)
}

export default {
  components: {
    Render,
    Pagination,
    KwForm,
    KwImport
  },
  props: {
    // 是否手动开始数据请求
    manual: {
      type: Boolean,
      default: false
    },
    api: {
      type: Function || String,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    search: {
      type: Array,
      default: () => []
    },
    // 用于转换表单的提交值 例如日期选址器 date = ['2020-11-11', '2022-01-01'] =>{startDate: '2020-11-11', endDate: '2022-01-01'}
    transformData: {
      type: Function
    },
    simple: {
      type: Boolean,
      default: false
    },
    ignoreOperations: {
      type: Array,
      default() {
        return []
      }
    },
    pageSize: {
      type: Number || String,
      default: 10
    },
    page: {
      type: Number || String,
      defalut: 1
    },
    pagination: {
      type: Boolean,
      default: true
    },
    params: {
      type: Object
    },
    listKey: {
      type: String,
      default: 'list'
    },
    totalKey: {
      type: String,
      default: 'total'
    },
    usePostWrapper: {
      type: Boolean,
      default: true
    },
    importOptions: {
      type: Object,
      default: () => {}
    },
    importTableColumns: {
      type: Array,
      default: () => []
    },
    exportUrl: {
      type: String
    },
    // 额外的查询字段，可以拼接在exportUrl上面
    exportParams: {
      type: Object,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const { api, columns, ignoreOperations } = props
    const request = typeof api === 'string' ? data => post(api, data) : api

    const tableRef = ref(null)
    const importDialogRef = ref(null)
    const originFormItemsRef = computed(() => props.search)

    // 操作按钮控制
    const operations = ['add', 'edit', 'remove', 'selection']
    const canOperations = difference(operations, ignoreOperations)
    const operationState = reactive({
      canSelection: canOperations.includes('selection'),
      canEdit: canOperations.includes('edit'),
      canAdd: canOperations.includes('add'),
      canRemove: canOperations.includes('remove')
    })

    // 如果有search表单，获取表单对象的键值对
    const searchKey = props.search.reduce((acc, cur) => {
      acc[cur.attrs.key] = cur.attrs.value
      return acc
    }, {})

    const searchState = reactive({
      formItems: props.search || [],
      searchKey: searchKey
    })

    const pageState = reactive({
      page: props.page || 1,
      pageSize: props.pageSize || 10,
      total: 0
    })

    const state = reactive({
      isSelectedAll: false,
      selections: [],
      dataList: [],
      allColumnsSelected: true,
      allColumnsSelectedIndeterminate: false,
      columns: columns.map(col => {
        return {
          ...col,
          visiable: !!(col.visiable === undefined || col.visiable === true)
        }
      }),
      showSearchBar: true
    })

    function setAttrs(params) {
      // eslint-disable-next-line
      const { slot, ...options } = params
      if (!options.align) {
        options.align = 'center'
      }
      return { ...options }
    }

    // 字段显示控制
    function handleCheckAllChange(v) {
      state.columns = state.columns.map(col => {
        return {
          ...col,
          visiable: !!v
        }
      })
    }

    function handleCheckChange(row) {
      state.allColumnsSelectedIndeterminate = state.columns.some(
        col => col.visiable === true
      )
    }

    function handleSelectionChange(rows) {
      if (rows.length === state.dataList.length) {
        state.isSelectedAll = true
      } else {
        state.isSelectedAll = false
      }
      state.selections = rows
    }

    function handleSelectAll(rows) {
      state.isSelectedAll = rows.length !== 0
    }

    function selectAll() {
      // if (!state.isSelectedAll) {

      // } else {
      //   this.state.dataList.forEach(row => {
      //     tableRef.value.toggleRowSelection(row, false)
      //   })
      // }

      tableRef.value.toggleAllSelection()

      state.isSelectedAll = !state.isSelectedAll
    }
    // 初始化chuckbox逻辑
    state.allColumnsSelected = state.columns.every(col => col.visiable === true)
    handleCheckChange()

    watch(
      () => state.columns,
      rs => {
        state.allColumnsSelected = state.columns.every(
          col => col.visiable === true
        )
        if (state.allColumnsSelected) {
          state.allColumnsSelectedIndeterminate = false
        }
      },
      {
        deep: true
      }
    )

    // 获取table数据
    const { loading, result, use: fetchTableDatas } = useRequest(request)

    async function fetchDatas(args) {
      state.isSelectedAll = false

      const formParmas = props.transformData
        ? props.transformData({ ...searchState.searchKey })
        : searchState.searchKey
      /* eslint-disable indent */
      const fetchPrams = props.usePostWrapper
        ? {
            post: {
              page: pageState.page,
              pagesize: pageState.pageSize,
              ...formParmas,
              ...props.params,
              ...args
            }
          }
        : props.pagination
        ? {
            page: pageState.page,
            pagesize: pageState.pageSize,
            ...formParmas,
            ...props.params,
            ...args
          }
        : {
            ...formParmas,
            ...props.params,
            ...args
          }
      /* eslint-enable */
      const result = await fetchTableDatas(fetchPrams)
      return result
    }

    onMounted(() => {
      if (!props.manual) {
        fetchDatas()
      }
    })

    watch(result, rs => {
      if (rs) {
        state.dataList = rs[props.listKey]
        pageState.total = rs[props.totalKey] && rs[props.totalKey] * 1
        emit('onGetTotal', pageState.total)
      }
    })

    function handleSearch(searchParams) {
      pageState.page = 1
      searchState.searchKey = searchParams
      fetchDatas()
    }

    function handlePageChange(page) {
      pageState.page = page
      fetchDatas()
    }

    function refresh() {
      searchState.formItems = JSON.parse(
        JSON.stringify(originFormItemsRef.value)
      )
      pageState.page = 1
      fetchDatas(searchKey)
    }

    function run(args) {
      if (props.manual) {
        return fetchDatas(args)
      }
    }
    function toggleSearch() {
      state.showSearchBar = !state.showSearchBar
    }

    function handleActions(actionName) {
      if (actionName === 'import') {
        importDialogRef.value.show()
        return
      }

      if (actionName === 'export' && props.exportUrl) {
        this.$confirm('确定导出?', '导出数据', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          const formParmas = props.transformData
            ? props.transformData({ ...searchState.searchKey })
            : searchState.searchKey

          const paramsString = object2query({
            ...formParmas,
            ...props.exportParams,
            access_token: this.$store.getters.token
          })
          const url = `${props.exportUrl}${
            props.exportUrl.indexOf('?') > 0 ? '&' : '?'
          }${paramsString}`

          window.location.href = url
        })

        return
      }
      emit('on' + upCate(actionName), state.selections)
    }

    function handelImportSuccess(data) {
      refresh()
      emit('importSuccess', data)
    }

    return {
      tableRef,
      loading,
      operationState,
      state,
      pageState,
      refresh,
      setAttrs,
      handleCheckAllChange,
      handleCheckChange,
      handleSelectionChange,
      handleSelectAll,
      handlePageChange,
      selectAll,
      handleActions,
      searchState,
      handleSearch,
      toggleSearch,
      run,
      handelImportSuccess,
      importDialogRef
    }
  }
}
</script>
<style lang="scss">
.kw-table {
  .header {
    padding-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .footer {
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
  }
}
</style>
