import { uploadImg } from '@/api/upload'
import { config } from '@/config/'
import uploadIcon from '@/assets/icons/upload-icon.png'
const mixin = {
  data() {
    return {
      ueConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: `${config.baseUrl}/ueditor/controller.php`,
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: process.env.NODE_ENV !== 'production' ? './static/UEditor/' : '/dist/Public/UEditor/',
        // 是否启用元素路径，默认是true显示
        elementPathEnabled: false,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 280,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: false,
        // 是否开启字数统计
        wordCount: true,
        maximumWords: 4000
      }
    }
  },
  methods: {
    ueInit() {
      const that = this
      that.$refs.content.registerButton({
        name: 'self-upload',
        icon: uploadIcon,
        tip: '自定义图片上传',
        handler: (editor, name) => {
          const fileinput = that.$refs.imageUploader
          const userId = that.$store.getters.id
          // debugger
          fileinput.value = ''
          fileinput.click()

          fileinput.onchange = (e) => {
            const file = e.target.files[0]

            uploadImg(file, userId).then(rs => {
              if (rs.result) {
                editor.execCommand('inserthtml', `<img src="${config.baseUrl + rs.result.url}" _src="${rs.result.url}" data-id="${rs.result.id}"/>`)
              } else {
                that.$message({
                  title: '提示',
                  message: rs.error.message || '上传失败',
                  type: 'error'
                })
              }
            })
          }
        }
      })
    }
  },
  watch: {
    'postForm.content'(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
        this.$refs['postForm'] && this.$refs['postForm'].clearValidate(['content'])
      }
    },
    'postForm.imageList'(newVal, oldVal) {
      if (newVal.length === 3) {
        document.querySelector('.product-image-wrapper .el-upload--picture-card').style.display = 'none'
      } else {
        document.querySelector('.product-image-wrapper .el-upload--picture-card').style.display = 'inline-block'
      }
    }
  }
}

export {
  mixin
}
