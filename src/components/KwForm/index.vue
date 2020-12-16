<template>
  <div class="kw-form">
    <el-form
      ref="formRef"
      v-bind="$attrs"
      :model="state.models"
      :inline="inline"
      :size="size"
      :label-width="labelWitdh"
    >
      <template v-for="(item, index) in state.items">
        <el-form-item
          :key="index + item.attrs.key || item.slot"
          v-bind="item.itemAttrs || {}"
          :prop="item.attrs.key"
        >
          <slot v-if="item.slot" :name="item.slot" :scope="state.model" />
          <component
            :is="item.tag"
            v-else
            v-model="state.models[item.attrs.key]"
            :size="size"
            v-bind="item.attrs || {}"
            v-on="item.listeners || {}"
          />
        </el-form-item>
      </template>
      <el-form-item>
        <el-button
          v-if="!!submitText"
          :loading="loading"
          type="primary"
          @click="handleSubmit"
          >{{ submitText }}</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { watch, reactive, ref, defineComponent } from '@vue/composition-api'
import compoentsMap from './map'
import KwSelect from './KwSelect'
export default {
  components: {
    KwSelect
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    inline: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: 'small'
    },
    loading: {
      type: Boolean,
      default: false
    },
    submitText: {
      type: String,
      default: '提交'
    }
  },
  setup(props, { emit }) {
    const formRef = ref(null)

    const state = reactive({
      items: [],
      models: {},
      originModels: {}
    })

    watch(
      () => props.items,
      items => {
        const models = {}
        items.forEach(item => {
          models[item.attrs.key] = item.attrs.value
        })
        state.models = models

        state.items = items.map(item => {
          const defalutComponent = compoentsMap[item.tag]

          if (!defineComponent.attrs) {
            defineComponent.attrs = {}
          }
          return {
            ...item,
            tag: defalutComponent.component,
            attrs: { ...defalutComponent.attrs, ...item.attrs }
          }
        })
      },
      {
        deep: true,
        immediate: true
      }
    )

    function handleSubmit() {
      formRef.value.validate(async valid => {
        if (valid) {
          try {
            emit('submit', state.models)
          } catch (e) {
            console.log(e)
          }
        }
      })
    }

    return {
      formRef,
      state,
      compoentsMap,
      handleSubmit,
      loading: props.loading
    }
  }
}
</script>
