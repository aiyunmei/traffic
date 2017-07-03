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
                <el-input placeholder="设备号" v-model="searchData.deviceId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="GPRS编号" v-model="searchData.gprsCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-select v-model="searchData.gprsType" @multiple="true" clearable allow-create placeholder="运营商" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.gprsType" :label="item.label" :value="item.value" :key="index"></el-option>
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
          <a :href="toExcelHref" target="_blank"><el-button type="primary" icon="document" class="item-search-btn">Excel模板下载</el-button></a>
          <el-button type="primary" icon="upload" v-on:click="uploadExcel">上传Excel数据</el-button>
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增流量卡</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class="item-table-cc" width="120">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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

      <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" @close="closeDialog('ruleForm')">
        <div class="item-dialog">
          <div class="item-dialog-underline"></div>
          <div class="item-dialog-form">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :label-position="dialog.position" label-width="20%">
              <el-form-item label="设备号" prop="deviceId">
                <el-input v-model="ruleForm.deviceId"></el-input>
              </el-form-item>
              <el-form-item label="gprs编号" prop="gprsCode">
                <el-input v-model="ruleForm.gprsCode"></el-input>
              </el-form-item>
              <el-form-item label="运营商" prop="gprsType">
                <el-select v-model="ruleForm.gprsType" @multiple="true" clearable allow-create placeholder="请选择">
                  <el-option v-for="(item,index) in this.$store.state.gprsType" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <div class="dialog-submit">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-dialog>

      <excelupload :title="excelUpload.title" :src="excelUpload.src" :fileName="excelUpload.fileName"></excelupload>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import excelupload from '../../views/excelUpload.vue'
  export default {
    name: 'sbllk',
    components: { excelupload },
    data () {
      return {
        toExcelHref: '', // 下载excel 模板 url
        searchData: { // 搜索数据
          deviceId: '',
          gprsCode: '',
          gprsType: ''
        },
        table: [ // 表格展示
          { label: '设备号', name: 'deviceId' },
          { label: 'GPRS编号', name: 'gprsCode' },
          { label: '运营商', name: 'gprsType' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 表格行数据
        ruleForm: { // 表单数据
          deviceId: '',
          gprsCode: '',
          gprsType: ''
        },
        rules: { // 表单规则
          deviceId: [
            { required: true, message: '请输入设备号', toggle: 'blur' },
            { min: 5, max: 50, message: '长度在5-50之间' },
            { validator: (rule, val, callback) => {
              if (this.va.pattern.test(val) === false) {
                return callback(new Error('不得使用非法字符'))
              } else {
                callback()
              }
            } },
            { validator: (rule, val, callback) => {
              if (this.va.string.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          gprsCode: [
            { required: true, message: '请输入gprs编号', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.pattern.test(val) === false) {
                return callback(new Error('不得使用非法字符'))
              } else {
                callback()
              }
            } },
            { min: 5, max: 50, message: '长度在5-50之间' },
            { validator: (rule, val, callback) => {
              if (this.va.string.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          gprsType: [
            { required: true, message: '请输入运营商', toggle: 'blur' },
            { min: 2, max: 10, message: '长度在2-10之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cn.test(val) === false) {
                return callback(new Error('必须为中文'))
              } else {
                callback()
              }
            } }
          ]
        },
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        indexEdit: 0, // 标记行数据
        excelUpload: { // 上传excel
          title: '上传Excel数据',
          src: '',
          fileName: ''
        }
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '机具录入', small: '流量卡管理' })
      this.toExcelHref = this.api.sbllk.goExcel
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.sbllk.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 失败
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '网络出错，请刷新页面试试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新页面试试'})
        })
      },
      search () { // 搜索
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            deviceId: this.searchData.deviceId,
            gprsCode: this.searchData.gprsCode,
            gprsType: encodeURIComponent(this.searchData.gprsType)
          }
        })
      },
      handleCurrentChange (val) { // 分页
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            deviceId: this.searchData.deviceId,
            gprsCode: this.searchData.gprsCode,
            gprsType: encodeURIComponent(this.searchData.gprsType),
            pageNum: val
          }
        })
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.deviceId = ''
        this.searchData.gprsCode = ''
        this.searchData.gprsType = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增流量卡'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.deviceId = row.deviceId === undefined ? '' : row.deviceId
        this.ruleForm.gprsCode = row.gprsCode === undefined ? '' : row.gprsCode
        this.ruleForm.gprsType = row.gprsType === undefined ? '' : row.gprsType
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.sbllk.delete, {
            params: {
              id: row.id
            }
          }).then((res) => {
            if (res.data.msg.code === '20000') {
              that.$message({type: 'success', message: '删除成功'})
              that.tableData.splice(index, 1)
            } else {
              that.$message({type: 'error', message: '删除失败,请重新试试'})
            }
            that.$store.commit('setLoading', false)
          }).catch((err) => {
            console.log(err)
            that.$store.commit('setLoading', false)
            that.$message({type: 'error', message: '删除失败,请重新试试'})
          })
        }).catch(() => {})
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              let chageDeviceId = that.ruleForm.deviceId
              let chagenGprsCode = that.ruleForm.gprsCode
              let changeGprsType = that.ruleForm.gprsType
              that.$store.commit('setLoading', true)
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.sbllk.update, {
                  params: {
                    id: that.tableRowData.id,
                    deviceId: chageDeviceId,
                    gprsCode: chagenGprsCode,
                    gprsType: encodeURIComponent(changeGprsType)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].deviceId = chageDeviceId
                    that.tableData[that.indexEdit].gprsCode = chagenGprsCode
                    that.tableData[that.indexEdit].gprsType = changeGprsType
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败，请重新试试'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 编辑网络出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '编辑失败，请重新试试'})
                })
              } else { // 如果是新增
                that.$axios.get(that.api.sbllk.add, {
                  params: {
                    companyId: localStorage.getItem('companyId') || null,
                    deviceId: chageDeviceId,
                    gprsCode: chagenGprsCode,
                    gprsType: encodeURIComponent(changeGprsType)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let addObj = {
                      id: res.data.id,
                      deviceId: chageDeviceId,
                      gprsCode: chagenGprsCode,
                      gprsType: changeGprsType,
                      createTime: that.updateTime(new Date())
                    }
                    if (that.tableData.length < 10) {
                      that.tableData.unshift(addObj)
                    } else {
                      that.tableData.splice(9, 1)
                      that.tableData.unshift(addObj)
                    }
                    that.$message({type: 'success', message: '新增成功'})
                  } else if (res.data.msg.code === '40001') { // 新增出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 新增失败
                    that.$message({type: 'error', message: '新增失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 新增网络出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '新增失败'})
                })
              }
              that.dialog.hidden = false
            }).catch(() => {})
          } else {
            console.log('error')
          }
        })
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.deviceId = ''
        this.ruleForm.gprsCode = ''
        this.ruleForm.gprsType = ''
      },
      uploadExcel () { // 上传excel
        this.excelUpload.src = this.api.sbllk.uploadExcel
        this.excelUpload.fileName = 'importExcel'
        this.$store.commit('setExcelDialogHidden', true)
      }
    }
  }
</script>
