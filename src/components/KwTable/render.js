export default {
  functional: true,
  props: {
    row: Object,
    index: Number,
    render: Function
  },
  render (createElement, ctx) {
    const params = {
      row: ctx.props.row,
      index: ctx.props.index
    }

    return ctx.props.render(createElement, params)
  }
}
