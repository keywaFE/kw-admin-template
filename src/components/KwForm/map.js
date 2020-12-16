const compoentsMap = {
  input: {
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入'
    }
  },
  select: {
    component: 'kw-select',
    attrs: {
      placeholder: '请选择',
      clearable: true
    }
  },
  date: {
    component: 'el-date-picker',
    attrs: {
      placeholder: '选择日期',
      clearable: true,
      type: 'date',
      format: 'yyyy/MM/dd',
      'value-format': 'yyyy/MM/dd'
    }
  },
  checkbox: {
    component: 'el-checkbox'
  },
  cascader: {
    component: 'el-cascader',
    attrs: {
      placeholder: '请选择',
      clearable: true
    }
  },
  textarea: {
    component: 'el-input',
    attrs: {
      type: 'textarea'
    }
  }
}

export default compoentsMap
