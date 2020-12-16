<template>
  <el-pagination
    background
    :current-page="page"
    :total="total"
    :page-size="pageSize"
    hide-on-single-page
    layout="prev, pager, next"
    @current-change="handleCurrentChange"
  ></el-pagination>
</template>
<script>
import { ref } from '@vue/composition-api'

export default {
  name: 'pagination',
  props: {
    total: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  setup(props, { emit }) {
    const { page, pageSize, total } = props
    const currentPage = ref(page)

    function handleCurrentChange(page) {
      currentPage.value = page
      emit('onPageChange', page)
    }

    return {
      total,
      pageSize,
      currentPage,
      handleCurrentChange
    }
  }
}
</script>
