<template>
  <el-dialog :title="title" v-model="hidden" top="70px" @close="close">
    <div class="item-dialog">
      <div class="item-dialog-underline"></div>
      <div class="item-dialog-form">
        <input type="file" ref="upload" @change="uploadChange" id="upload" style="display: none" />
        <label for="upload" class="item-dialog-upload">选择文件</label>
        <el-tag v-show="this.name" type="primary" :title="this.name">{{ this.name === '' ? '' : '文件名称：' + this.name }}</el-tag>
        <div style="margin: 20px 0 0 0"></div>
        <div class="dialog-submit">
          <el-button type="primary" @click="upload">上传</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'excelUpload',
    props: ['title', 'src', 'fileName'],
    data () {
      return {
        file: '',
        name: '',
        type: ''
      }
    },
    computed: {
      hidden () {
        return this.$store.state.excelUploadDialogHidden
      }
    },
    methods: {
      uploadChange () {
        let len = this.$refs.upload.files.length
        if (len === 1) {
          this.file = this.$refs.upload.files[0]
          this.name = this.$refs.upload.files[0].name
          this.type = '.' + (this.$refs.upload.files[0].name.split('.'))[1]
        } else {
          this.file = null
          this.name = null
          this.type = null
        }
      },
      upload () {
        let form = new FormData()
        if (this.$refs.upload.files.length === 0) {
          this.$message({type: 'error', message: '请先上传文件'})
          return false
        }
        if (this.type === '.xls' || this.type === '.XLS') {
          this.$confirm('确定上传？', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
          .then(() => {
            this.$store.commit('setLoading', true)
            form.append(this.fileName, this.file)
            form.append('companyId', localStorage.getItem('companyId'))
            this.$axios.post(this.src, form, {
              header: {'Content-Type': 'multipart/form-data'}
            }).then((res) => {
              console.log(res)
              if (res.data.msg.code === '20000') {
                this.$message({type: 'success', message: '上传成功'})
                setTimeout(() => {
                  window.location.reload()
                }, 1000)
              } else if (res.data.msg.code === '40001') {
                this.$message({type: 'error', message: res.data.msg.message})
              } else {
                this.$message({type: 'error', message: '上传失败'})
              }
              this.$store.commit('setLoading', false)
            }).catch((err) => {
              console.log(err)
              this.$store.commit('setLoading', false)
            })
          }).catch(() => {})
        } else {
          this.$message({type: 'error', message: '上传文件格式错误'})
        }
      },
      close () {
        this.$store.commit('setExcelDialogHidden', false)
      }
    }
  }
</script>
