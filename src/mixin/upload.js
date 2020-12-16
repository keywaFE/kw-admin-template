import { config, uploadUrls } from '@/config/'
const uploadMixin = {
  data() {
    return {
      uploadURL: uploadUrls.image
    }
  },
  methods: {
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isJPG && !isPng) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB!')
        return false
      }
      return true
    },
    handleSuccess(rs, file, fileList) {
      this.postForm.imageList.push({
        relativeUrl: rs.data.url,
        id: rs.data.id || +new Date(),
        url: `${config.baseUrl}${rs.data.url}`
      })

      this.postForm.images = this.postForm.imageList.map(item => item.relativeUrl).join()
      this.$refs['postForm'] && this.$refs['postForm'].clearValidate(['images'])
    },
    handleRemove(file, fileList) {
      this.postForm.imageList = this.postForm.imageList.filter(item => {
        return item.uid !== file.uid
      })
      this.postForm.images = this.postForm.imageList.map(item => item.relativeUrl).join()
    }
  }
}

export {
  uploadMixin
}
