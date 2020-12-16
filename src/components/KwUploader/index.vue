<template>
  <div class="uploader-wrapper">
    <el-upload
      :class="uuid"
      :action="uploadURL"
      :list-type="listType"
      :limit="limit"
      :file-list="imageList"
      :on-success="handleSuccess"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :accept="accept"
      :http-request="uploadRequest"
    >
      <i class="el-icon-plus"></i>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </el-upload>
    <div class="tips">{{tips}}</div>
  </div>
</template>
<script>
import { uploadFile } from '@/api/upload'
import { config, uploadUrls } from '@/config/'
import pdfDefault from 'static/images/pdf.png'
import rarDefault from 'static/images/rar.png'
import zipDefault from 'static/images/zip.png'

export default {
  name: 'Uploader',
  props: {
    initList: {
      type: Array,
      default: () => {
        return []
      }
    },
    limit: {
      type: Number,
      default: 1
    },
    listType: {
      type: String,
      default: 'picture-card'
    },
    allowPdf: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 2
    },
    tips: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inited: false,
      uuid: 'uploader' + new Date().getTime(),
      dialogImageUrl: '',
      dialogVisible: false,
      baseUrl: config.baseUrl,
      uploadURL: uploadUrls.storage,
      imageList: []
    }
  },

  computed: {
    accept() {
      const imageAccept = 'image/jpeg,image/png,'
      return this.allowPdf ? imageAccept + 'application/pdf' : imageAccept
    }
  },
  methods: {
    beforeUpload(file) {
      const isLtM = file.size / 1024 / 1024 < this.size
      if (!isLtM) {
        this.$message.error(`上传文件大小不能超过 ${this.size}MB!`)
        return false
      }
      if (this.allowPdf) {
        const isPDF = file.type === 'application/pdf'
        if (!isPDF) {
          this.$message.error('限上传PDF文件')
          return false
        }
      }
      return true
    },
    uploadRequest(params) {
      let percent = 0
      let timer = null
      const file = params.file
      if (this.beforeUpload(file)) {
        let formData = new FormData()
        formData.append('file', file)
        uploadFile(formData, progressEvent => {
          percent = (progressEvent.loaded / progressEvent.total) * 100

          // percent 100%的时候，接口还没返回数据
          if (percent > 80) {
            if (!timer) {
              let temp = percent
              timer = setInterval(() => {
                if (temp < 98) {
                  temp += 0.2
                  params.file.percent = temp
                  params.onProgress(params.file)
                }
              }, 200)
            }
          } else {
            params.file.percent = percent
            params.onProgress(params.file)
          }
        }).then(rs => {
          clearInterval(timer)
          params.file.percent = 100
          params.onProgress(params.file)
          this.handleSuccess(rs)
        })
      }
    },
    _normalizeUrl(fileUrl) {
      const isPDF = /.pdf$/.test(fileUrl)
      const isRAR = /.rar$/.test(fileUrl)
      const isZIP = /.zip$/.test(fileUrl)
      let url = fileUrl
      if (isPDF) {
        url = pdfDefault
      } else if (isRAR) {
        url = rarDefault
      } else if (isZIP) {
        url = zipDefault
      }
      return url
    },
    handleSuccess(rs) {
      const serverUrl = rs[0].url
      const url = this._normalizeUrl(rs[0].url)

      this.imageList.push({
        url: url,
        serverUrl: serverUrl,
        id: rs[0].id
      })
    },
    handleRemove(file, fileList) {
      this.imageList = this.imageList.filter(item => {
        return item.uid !== file.uid
      })
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  },
  watch: {
    initList: {
      handler: function(val, oldVal) {
        // 避免传入的初始化对象是响应式的 多次直接向初始化
        if (this.inited) return
        if (val.length && val[0].id && val[0].serverUrl) {
          this.imageList = val.map(item => {
            return {
              url: this._normalizeUrl(item.url),
              id: item.id,
              serverUrl: item.serverUrl
            }
          })
        } else {
          this.imageList = []
        }
        setTimeout(() => {
          this.inited = true
        }, 200)
      },
      deep: true
    },
    imageList: {
      handler: function(val, oldVal) {
        if (val.length === this.limit) {
          document.querySelector('.' + this.uuid + '  .el-upload--picture-card').style.display = 'none'
        } else {
          document.querySelector('.' + this.uuid + '  .el-upload--picture-card').style.display = 'inline-block'
        }

        this.$emit(
          'uploadSuccess',
          this.imageList.map(item => {
            return {
              url: item.serverUrl,
              id: item.id
            }
          })
        )
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.uploader-wrapper {
  .tips {
    color: #666;
  }
}
</style>
