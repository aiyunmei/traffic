<template>
  <div class="item" v-loading.fullscreen.lock="this.$store.state.loading">

    <div class="item-search">
      <el-collapse>
        <el-collapse-item name="1">
          <template slot="title">
            <el-button type="primary">搜索</el-button>
          </template>
          <div class="item-search-input">
            <el-row>
              <el-col :span="4">
                <el-input placeholder="公司名称" v-model.trim="searchData.companyName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="版本" v-model.trim="searchData.version" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-select v-model="searchData.supplierCode" @multiple="true" clearable allow-create placeholder="厂商" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.supplier" :label="item.label" :value="item.value" :key="index">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select v-model="searchData.isUser" @multiple="true" clearable allow-create placeholder="是否可用" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in [{value: 1, label: '是'},{value: 0, label: '否'}]" :label="item.label" :value="item.value" :key="index">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="1">
                <el-button icon="search" type="primary" @click="search"></el-button>
              </el-col>
              <el-col :span="1">
                <el-button icon="delete" type="primary" @click="reset"></el-button>
              </el-col>
            </el-row>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="item-table">

      <div class="item-table-title">
        <h2>{{ this.$store.state.tableTitle.big }}<span>{{ this.$store.state.tableTitle.small }}</span></h2>
        <div class="item-table-add">
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">上传</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class="item-table-cc" width="60">
            <template scope="scope">
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="item-pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="this.$store.state.page.pageNum"
            :page-size="this.$store.state.page.pageSize"
            layout="prev, pager, next, jumper, total"
            :total="this.$store.state.page.total">
          </el-pagination>
        </div>
      </div>

    </div>


    <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" @close="closeDialog('ruleForm')">
      <div class="item-dialog">
        <div class="item-dialog-underline"></div>
        <div class="item-dialog-form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
            <el-form-item label="上传类型" prop="uploadType">
              <el-radio-group v-model="ruleForm.uploadType">
                <el-radio-button label="1">外部链接</el-radio-button>
                <el-radio-button label="2">上传文件</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否可用" prop="isUser">
              <el-radio-group v-model="ruleForm.isUser">
                <el-radio-button label='1'>是</el-radio-button>
                <el-radio-button label='0'>否</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="厂商" prop="supplierCode">
              <el-select v-model="ruleForm.supplierCode" @multiple="true" clearable allow-create placeholder="请选择">
                <el-option v-for="(item,index) in this.$store.state.supplier" :label="item.label" :value="item.value" :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="版本号" prop="version">
              <el-input v-model="ruleForm.version"></el-input>
            </el-form-item>
            <el-form-item label="外部链接" prop="packagePath" v-if="ruleForm.uploadType === '1' ? true : false">
              <el-input v-model.trim="ruleForm.packagePath"></el-input>
            </el-form-item>
            <el-form-item label="上传文件" v-if="uploadType === '1' ? false : true">
              <input type="file" id="upload" @change="uploadChange" ref="upload" style="display: none;">
              <label for="upload" class="item-dialog-upload">选择文件</label>
              <el-tag type="primary" v-show="uploadData.name" :title="uploadData.name">{{ uploadData.name }}</el-tag>
            </el-form-item>
            <div class="dialog-submit">
              <el-button type="primary" @click="submitForm">提交</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'apkbb',
    data () {
      return {
        searchData: { // 搜索数据
          companyName: '',
          version: '',
          supplierCode: '',
          isUser: null
        },
        table: [ // 表格展示
          { label: '公司名称', name: 'companyName' },
          { label: '厂商', name: 'supplierName' },
          { label: '是否可用', name: 'isUserName' },
          { label: 'apk文件路径', name: 'packagePath' },
          { label: '版本号', name: 'version' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [],
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        ruleForm: { // 表单数据
          uploadType: '1',
          isUser: '',
          supplierCode: '',
          version: '',
          packagePath: ''
        },
        rules: { // 表单规则
          uploadType: [
            { required: true, message: '请选择类型', toggle: 'blur' }
          ],
          isUser: [
            { required: true, message: '请选择状态', toggle: 'blur' }
          ],
          supplierCode: [
            { required: true, message: '请选择厂商', toggle: 'blur' }
          ],
          version: [
            { required: true, message: '请输入版本号', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.number.test(val) === false) {
                return callback(new Error('版本号必须为数字'))
              } else {
                callback()
              }
            } }
          ],
          packagePath: [
            { required: true, message: '请输入外部链接', toggle: 'blur' },
            { min: 4, message: '不得低于4位' },
            { validator: (rule, val, callback) => {
              if (this.va.url.test(val) === false) {
                return callback(new Error('外部链接格式错误'))
              } else {
                callback()
              }
            } }
          ]
        },
        uploadData: { // 上传apk数据
          name: '',
          type: ''
        }
      }
    },
    computed: {
      uploadType () { // 返回选择类型
        return this.ruleForm.uploadType
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: 'APK管理', small: '版本管理' })
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.apkbb.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let isUser = data[i].isUser
              let supplierCode = data[i].supplierCode
              res.data.data[i].isUserName = this.getIsUser(isUser) // 全局转换
              res.data.data[i].supplierName = this.getSupplier(supplierCode) // 全局转换
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 失败
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '网错出错，请刷新页面试试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$message({type: 'error', message: '网错出错，请刷新页面试试'})
          this.$store.commit('setLoading', false)
        })
      },
      search () { // 搜索
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            companyName: encodeURIComponent(this.searchData.companyName),
            supplierCode: this.searchData.supplierCode,
            version: this.searchData.version,
            isUser: this.searchData.isUser
          }
        })
      },
      handleCurrentChange (val) { // 分页
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            companyName: encodeURIComponent(this.searchData.companyName),
            supplierCode: this.searchData.supplierCode,
            version: this.searchData.version,
            isUser: this.searchData.isUser,
            pageNum: val
          }
        })
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.companyName = ''
        this.searchData.supplierCode = ''
        this.searchData.version = ''
        this.searchData.isUser = null
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '上传'
        this.dialog.hidden = true
      },
      handleDelete (index, row) { // 删除
        this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          this.$store.commit('setLoading', true)
          this.$axios.get(this.api.apkbb.delete, {
            params: {
              id: row.id
            }
          }).then((res) => {
            console.log(res)
            if (res.data.msg.code === '20000') {
              this.$message({type: 'success', message: '删除成功'})
              this.tableData.splice(index, 1)
            } else {
              this.$message({type: 'error', message: '删除失败'})
            }
            this.$store.commit('setLoading', false)
          }).catch((err) => {
            console.log(err)
            this.$store.commit('setLoading', false)
            this.$message({type: 'error', message: '网络出错，请刷新页面试试'})
          })
        }).catch(() => {})
      },
      submitForm (e) { // 提交
        let that = this
        that.$refs['ruleForm'].validate((valid) => {
          if (valid) { // 通过验证
            let companyId = localStorage.getItem('companyId')
            let isUser = that.ruleForm.isUser
            let supplierCode = that.ruleForm.supplierCode
            let version = that.ruleForm.version
            let uploadType = that.ruleForm.uploadType
            let packagePath = that.ruleForm.packagePath
            let supplierName = that.getSupplier(supplierCode) // 全局转换
            let isUserName = that.getIsUser(isUser) // 全局转换
            if (uploadType === '1') { // 如果是上传外链
              that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
              .then(() => {
                that.$store.commit('setLoading', true)
                that.$axios.get(that.api.apkbb.upload, {params: {companyId: companyId, isUser: isUser, version: version, packagePath: packagePath, supplierCode: supplierCode}})
                .then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 上传外链成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    res.data.data.isUserName = isUserName
                    res.data.data.supplierName = supplierName
                    if (that.tableData.length < 10) {
                      that.tableData.unshift(data)
                    } else {
                      that.tableData.splice(9, 1)
                      that.tableData.unshift(data)
                    }
                    that.$message({type: 'success', message: '上传成功'})
                  } else if (res.data.msg.code === '40001') { // 上传外链出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 上传外链失败
                    that.$message({type: 'error', message: '上传失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 上传外链网络出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网错出错,请刷新试试'})
                })
                that.dialog.hidden = false
              }).catch(() => {})
            } else if (uploadType === '2') { // 如果是上传文件
              let fileVal = that.$refs.upload.value
              if (fileVal === '') { // 如果未上传文件阻止提交
                that.$message({type: 'error', message: '请先上传文件'})
                return false
              }
              that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
              .then(() => {
                that.$store.commit('setLoading', true)
                let formData = new FormData()
                formData.append('companyId', companyId)
                formData.append('isUser', isUser)
                formData.append('version', version)
                formData.append('supplierCode', supplierCode)
                formData.append('file', that.$refs.upload.files[0])
                that.$axios.post(that.api.apkbb.upload, formData, {header: {'Content-Type': 'multipart/form-data'}})
                .then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 上传文件成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    res.data.data.isUserName = isUserName
                    res.data.data.supplierName = supplierName
                    if (that.tableData.length < 10) {
                      that.tableData.unshift(data)
                    } else {
                      that.tableData.splice(9, 1)
                      that.tableData.unshift(data)
                    }
                    that.$message({type: 'success', message: '上传成功'})
                  } else if (res.data.msg.code === '40001') { // 上传文件出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 上传文件失败
                    that.$message({type: 'error', message: '上传失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 上传文件网络出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网错出错,请刷新试试'})
                })
                that.dialog.hidden = false
              }).catch(() => {})
            }
          } else { // 如果没有通过验证
            console.log('error')
          }
        })
      },
      uploadChange (e) { // 点击上传按钮写入文件数据
        let len = this.$refs.upload.files.length
        if (len === 1) {
          this.uploadData.name = this.$refs.upload.files[0].name
          this.uploadData.type = '.' + (this.$refs.upload.files[0].name.split('.'))[1]
        } else {
          this.uploadData.name = null
          this.uploadData.type = null
        }
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
      }
    }
  }
</script>
