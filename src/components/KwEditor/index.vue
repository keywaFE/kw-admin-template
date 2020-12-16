<template>
  <div>
    <vue-ueditor-wrap
      :ref="editorRef"
      v-model="content"
      :destroy="true"
      :config="ueConfig"
      :init="initEditor"
    ></vue-ueditor-wrap>
    <input type="file" :ref="inputRef" style="display: none;" />
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import uploadIcon from '@/assets/icons/upload-icon.png'
import { uploadFile } from '@/api/upload'

const temp = new Date().getTime()
export default {
  components: {
    VueUeditorWrap
  },
  props: {
    initContent: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      content: '',
      ueConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: `${config.baseUrl}/ueditor/controller.php`,
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: './static/UEditor/',
        // 是否启用元素路径，默认是true显示
        elementPathEnabled: false,
        // 编辑器不自动被内容撑高
        autoHeightEnabled: true,
        // 初始容器高度
        initialFrameHeight: 180,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 关闭自动保存
        enableAutoSave: false,
        // 是否开启字数统计
        wordCount: false,
        // 是否保持toolbar的位置不动,默认true
        autoFloatEnabled: true,
        // topOffset:330,
        insertorderedlist: {
          'decimal': '', // '1,2,3...'
          'lower-alpha': '', // 'a,b,c...'
          'lower-roman': '', // 'i,ii,iii...'
          'upper-alpha': '', // 'A,B,C'
          'upper-roman': '' // 'I,II,III...'
        },
        insertunorderedlist: {
          'circle': '', // ○ 小圆圈
          'disc': '', // ● 小圆点
          'square': '' // ■ 小方块
        }
      },
      inputRef: 'kwEditorInput' + temp,
      editorRef: 'KwEditor' + temp
    }
  },
  methods: {
    initEditor () {
      this.$refs[this.editorRef].registerButton({
        name: 'self-upload',
        icon: uploadIcon,
        tip: '图片上传',
        handler: (editor, name) => {
          const fileinput = this.$refs[this.inputRef]
          fileinput.value = ''
          fileinput.click()

          fileinput.onchange = (e) => {
            const file = e.target.files[0]

            let formData = new FormData()
            formData.append('file', file)

            uploadFile(formData).then(rs => {
              editor.execCommand('inserthtml', `<img src="${rs[0].url}" _src="${rs[0].url}" data-id="${rs[0].id}"/>`)
            })
          }
        }
      })
    }
  },
  watch: {
    content: {
      handler: function (val, oldVal) {
        this.$emit('contentChange', val)
      }
    },
    initContent: {
      handler: function (val, oldVal) {
        this.content = val
      },
      deep: true,
      immediate: true
    }
  }
}
</script>
