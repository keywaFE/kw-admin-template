<template>
  <div class="pagination-container">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    pagesize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 1
    },
    current: {
      type: Number
    }
  },
  data () {
    return {
      currentPage: this.current
    }
  },
  watch: {
    current (old, newVal) {
      this.currentPage = old
    }
  },
  methods: {
    handleSizeChange (value) {
      this.$emit('change-size', value)
    },
    handleCurrentChange (page) {
      this.$emit('change-page', page)
    }
  }
}
</script>
