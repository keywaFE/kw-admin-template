<template>
  <div class="import-template">
    <el-dialog
      title="导入"
      class="import-dialog"
      :visible.sync="importDialogVisible"
    >
      <div class="import-data">
        <el-upload
          class="upload-demo"
          :action="options.uploadFileUrl"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv"
          drag
          list-type="text"
          :before-upload="beforeUpload"
          :on-success="handleXLSSuccess"
          :on-error="uploadError"
          :file-list="xlsList"
          :show-file-list="false"
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">
            将表格拖放到此处上传，或点击
            <em>上传</em>
          </div>
        </el-upload>
        <div class="errorstips">{{ templateErrorTips }}</div>
        <div class="import-tips" v-if="options.downloadUrl">
          为了保证正常使用，仅支持
          <a class="download-demo" :href="options.downloadUrl" download
            >记录上传模板（点击下载）</a
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog title :visible.sync="successDialogVisible">
      <div class="success-body">
        <span>
          <i style="color: #67c23a;" class="el-icon-circle-check"></i>
          {{ successMsg }}
        </span>
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="hide">{{btnText}}</el-button> -->
        <el-button type="primary" @click="hide">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="导入失败"
      :visible.sync="failDialogVisible"
      class="fail-export"
      size="large"
      width="90%"
    >
      <span
        v-html="failData.msg"
        style="display:inline-block;padding-bottom:15px; color:#F56C6C;"
      ></span>
      <el-table
        v-if="failData.data"
        :data="failData.data"
        border
        style="width: 100%"
      >
        <el-table-column
          :label="item.label"
          :prop="item.prop"
          align="center"
          :width="item.width"
          v-for="item in columns"
          :key="item.prop"
        >
          <template slot-scope="scope">
            <span v-html="scope.row[item.prop]"></span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="failDialogVisible = false">取 消</el-button>
        <el-button @click="importAgain" type="primary">重新导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'importDialog',
  props: {
    options: {
      downloadUrl: {
        type: String,
        required: true
      },
      uploadFileUrl: {
        type: String,
        required: true
      },
      importApi: {
        type: Function,
        required: true
      }
    },
    columns: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      importDialogVisible: false,
      successDialogVisible: false,
      failDialogVisible: false,
      failData: {},
      xlsList: [],
      successMsg: '',
      templateErrorTips: ''
    }
  },
  methods: {
    show() {
      this.templateErrorTips = ''
      this.importDialogVisible = true
    },
    hide() {
      this.successDialogVisible = false
      this.failDialogVisible = false
      this.importDialogVisible = false
    },
    importAgain() {
      this.templateErrorTips = ''
      this.failDialogVisible = false
      this.importDialogVisible = true
      this.failData = {}
    },
    beforeUpload(file) {
      const isXls =
        file.type ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel'
      if (isXls) {
        return true
      } else {
        this.$message.error('只能上传后缀为xls或xlsx的文件!')
        return false
      }
    },
    async handleXLSSuccess(rs, file, fileList) {
      if (rs.result) {
        const importResult = await this.options.importApi({
          url: rs.result.url
        })
        if (importResult.code * 1 === 400) {
          if (importResult.data) {
            this.importFail(importResult)
            this.importDialogVisible = false
          } else {
            this.templateErrorTips = importResult.msg
          }
        } else if (importResult.code === 200) {
          this.importSuccess(importResult)
          this.$emit('xlsUploadSuccess', importResult)
          this.importDialogVisible = false
        }
      } else {
        this.$message.error('导入失败')
      }
      this.xlsList = []
    },
    uploadError(file, fileList) {
      this.xlsList = []
      this.$message.error('导入失败')
    },
    importFail(rs) {
      this.failData = rs
      this.failDialogVisible = true
    },
    importSuccess(rs) {
      this.successMsg = rs.msg
      this.successDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
.import-template {
  .import-dialog {
    text-align: center;
  }
  .el-dialog--small {
    width: 500px;
    min-height: 312px;
  }
  .el-dialog__header {
    text-align: center;
  }
  .errorstips {
    padding-top: 10px;
    color: #f00;
  }
  .import-tips {
    padding-top: 10px;
    a {
      color: #20a0ff;
    }
  }
  .success-body {
    font-size: 24px;
    text-align: center;
    padding: 65px 0;
  }
  .el-dialog__footer {
    text-align: center;
    .el-button {
      width: 200px;
    }
  }
}
</style>
