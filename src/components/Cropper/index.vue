<template>
  <div>
    <label v-show="uploadImgVisible" class="uploadImg-wrapper" :style="styleObject" :for="'uploads'+this.name"><img :src="imgUrl" :style="styleObject"></label>
    <label v-show="!uploadImgVisible" class="uploadImg-wrapper" :style="styleObject" :for="'uploads'+this.name">
      <span class="tips">规格：{{this.width}} * {{this.height}}px</span>
    </label>
    <input
      type="file"
      :id="'uploads'+this.name"
      ref="fileInput"
      style="position:absolute; clip:rect(0 0 0 0);"
      accept="image/png, image/jpeg, image/jpg"
      @change="uploadImg($event)"
    />
    <el-dialog title="上传封面图片" :visible.sync="cropperVisible" @close="closeDialog" width="880px" class="cropper-dialog">
      <div class="crop-wrapper">
        <vue-cropper
          :ref="this.name"
          :img="option.img"
          :output-size="option.size"
          :output-type="option.outputType"
          :info="true"
          :full="option.full"
          :can-move="option.canMove"
          :can-move-box="option.canMoveBox"
          :fixed-box="option.fixedBox"
          :original="option.original"
          :auto-crop="option.autoCrop"
          :auto-crop-width="option.autoCropWidth"
          :auto-crop-height="option.autoCropHeight"
          :center-box="option.centerBox"
          :high="option.high">
        </vue-cropper>
      </div>
      <div class="opts">
        <el-button @click="cropperVisible = false">取消</el-button>
        <el-button type="primary" @click="crop">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { VueCropper } from 'vue-cropper'
import { config, uploadUrls } from '@/config/'
export default {
  name: 'cropper',
  components: {
    VueCropper
  },
  props: {
    initUrl: {
      type: Array,
      default() {
        return []
      }
    },
    name: {
      type: String,
      default: '765'
    },
    callback: {
      type: Function
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      baseUrl: config.baseUrl,
      action: uploadUrls.image,
      cropperVisible: false,
      uploadImgVisible: false,
      imgUrl: '',
      filename: '',
      styleObject: {
        width: this.width / 2 + 'px',
        height: this.height / 2 + 'px'
      },
      option: {
        img: '',
        size: 1,
        full: false,
        outputSize: 1,
        outputType: 'png',
        canMove: true,
        fixedBox: true,
        original: false,
        canMoveBox: true,
        autoCrop: true,
        // 只有自动截图开启 宽度高度才生效
        autoCropWidth: this.width,
        autoCropHeight: this.height,
        centerBox: false,
        fixed: true,
        fixedNumber: [4, 3],
        high: true
      }
    }
  },
  methods: {
    _afterSend(rs) {
      if (rs.error) {
        this.$message.error(rs.error)
      }
      if (rs.result) {
        this.imgUrl = this.baseUrl + rs.result.url
        this.uploadImgVisible = true
        this.cropperVisible = false
        this.callback && this.callback(rs.result)
      }
    },
    _dataURLtoFile(dataurl, filename) { // 将base64转换为文件
      const arr = dataurl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    _send(data, action) {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = (e) => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            this._afterSend(JSON.parse(xhr.responseText))
          } else {
            console.log('上传失败了！！！')
          }
        }
      }
      xhr.open('POST', action, true)
      xhr.send(data)
    },
    crop() {
      this.$refs[this.name].getCropData((data) => {
        const formData = new FormData()
        const compressFile = this._dataURLtoFile(data, this.filename)
        formData.append('file', compressFile)
        this._send(formData, this.action)
      })
    },
    closeDialog(e) {
      this.$refs[this.name].refresh()
      // 可以选择已经选择的图片
      this.$refs.fileInput.setAttribute('type', 'text')
      this.$refs.fileInput.setAttribute('type', 'file')
    },
    uploadImg(e) {
      // 上传图片
      const file = e.target.files[0]
      const isJPG = file.type === 'image/jpeg'
      const isPng = file.type === 'image/png'
      const isLt3M = file.size / 1024 / 1024 < 3
      if (!isJPG && !isPng) {
        this.$message.error('上传图片只能是 JPG/PNG 格式!')
        return false
      }
      if (!isLt3M) {
        this.$message.error('上传图片大小不能超过 3MB!')
        return false
      }
      this.filename = file.name

      const reader = new FileReader()
      reader.onload = (e) => {
        let data
        if (typeof e.target.result === 'object') {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]))
        } else {
          data = e.target.result
        }
        this.cropperVisible = true
        setTimeout(() => {
          this.option = {
            ...this.option,
            img: data,
            // outputType: 'png'
            outputType: file.type.split('/')[1]
          }
        }, 20)
      }
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file)
    }
  },
  created() {

  },
  watch: {
    initUrl(newVal) {
      if (newVal.length) {
        this.imgUrl = this.baseUrl + newVal[0].relativeUrl
        this.uploadImgVisible = true
      } else {
        this.uploadImgVisible = false
        this.imgUrl = ''
      }
    }
  }
}

</script>
<style lang="scss">
.uploadImg-wrapper {
  position: relative;
  display: block;
  background-color: #fbfdff;
  border: 1px dashed #c0ccda;
  box-sizing: border-box;
  border-radius: 6px;
  overflow: hidden;
  .tips {
    position: absolute;
    width: 100%;
    color: #666;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 12px;
    font-weight: normal;
  }
}
.cropper-dialog {
  .el-dialog__body {
    position: relative;
    padding: 0 20px 20px;
    width: 100%;
  }
  .crop-wrapper {
    height: 520px;
    width: 840px;
  }
  .opts {
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    text-align: center;
    padding-top: 20px;
  }
}
.cropper-btns {
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin:20px 10px 0px 0px;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
}
</style>
