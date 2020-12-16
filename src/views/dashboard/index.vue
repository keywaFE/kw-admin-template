<template>
  <div class="dashboard">
    <!-- <div class="dashboard-title">奇鱼结算系统</div> -->
    <div class="page-title">实时概况</div>
    <el-row :gutter="12">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="title">订单量</div>
          <div class="count">{{ state.count.order_total }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="title">销售总额(元)</div>
          <div class="count">￥{{ state.count.amount_total }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="title">提成总额(元)</div>
          <div class="count">￥{{ state.count.brokerage_total }}</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <!-- <div class="dashboard-container dashboard">
    <data-group :data="countData" :dataList=development></data-group>
  </div> -->
</template>

<script>
import { onMounted, reactive, watch } from '@vue/composition-api'
import useRequest from '@/hooks/useRequest'
import { homeCount } from '@/api/apis'
// import { mapGetters } from 'vuex'
// import DataGroup from './datas.vue'
// import { constants } from 'crypto'
// import { resolve } from 'dns'
export default {
  setup() {
    const state = reactive({
      count: {}
    })

    const { result, use: getHomeCount } = useRequest(() =>
      homeCount()
    )

    watch(result, (rs) => {
      if (rs) {
        state.count = rs
      }
    })
    onMounted(() => {
      getHomeCount()
    })

    return {
      state
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.dashboard-title {
  font-size: 28px;
  color: #00A0FF;
  text-align: center;
  margin-top: 300px;
}
.page-title {
  font-size: 22px;
  margin-bottom: 20px;
  color: #606266;
}
.el-card__body {
  font-size: 22px;
  font-weight: 700;
  .title {
    margin-bottom: 20px;
    color: #606266;
  }
  .count {
    color: #f4516c;
    font-size: 24px;
  }
}
</style>
