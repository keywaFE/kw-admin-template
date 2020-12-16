<template>
  <el-select v-bind="$attrs" :value="value" v-on="$listeners">
    <el-option
      v-for="item in $attrs.options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
</template>
<script>
export default {
  name: 'kw-form-select',
  props: {
    value: {
      type: [String, Number],
      default: ''
    }
  }
}
</script>
