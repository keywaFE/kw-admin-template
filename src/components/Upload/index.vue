<template>
  <el-upload
    class="avatar-uploader"
    :action="imgUploadUrl"
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeUpload"
  >
    <img v-if="image" :src="baseURL + image" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
  </el-upload>
</template>
<script>
export default {
  name: 'ele-upload',
  props: {
  },
  data () {
  },
  methods: {
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG && !isPng) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
        return false
      }
      return true
    }
  },
  created () {
  }
}
</script>

<style lang="scss">
</style>
