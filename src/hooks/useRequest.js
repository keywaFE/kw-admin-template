import { reactive, toRefs } from '@vue/composition-api'

export default function useRequest (fn) {
  if (!fn) {
    throw new Error(
      `[useRequest]: 1st argument is required (must be a function)`
    )
  }

  if (typeof fn !== 'function') {
    throw new Error(
      `[useRequest]: argument has to be function, but received ${typeof fn}`
    )
  }
  const state = reactive({
    loading: false,
    error: null,
    result: null
  })

  let lastPromise
  const use = async (...args) => {
    state.error = null
    state.loading = true
    const promise = (lastPromise = fn(...args))
    try {
      const result = await promise
      if (lastPromise === promise) {
        state.result = result
      }
      // 延迟loading效果
      const timer = setTimeout(() => {
        clearTimeout(timer)
        state.loading = false
      }, 220)

      return result
    } catch (e) {
      state.error = e
    } finally {
      // state.loading = false
    }
  }

  return {
    ...toRefs(state),
    use
  }
}
