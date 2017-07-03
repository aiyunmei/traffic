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
                <el-input placeholder="车牌号" v-model.trim="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="自编号" v-model.trim="searchData.carryNo" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="员工姓名" v-model.trim="searchData.name" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="电话" v-model.trim="searchData.telephone" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <a :href="hrefExcel" target="_blank"><el-button type="primary" icon="upload">导出</el-button></a>
          <a :href="toExcelHref" target="_blank"><el-button type="primary" icon="document">Excel模板下载</el-button></a>
          <el-button type="primary" icon="upload" v-on:click="uploadExcel">上传Excel数据</el-button>
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增司机</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name]">{{ scope.row[item.name] === '' ? '/' : scope.row[item.name] }}</span>
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
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="gender">
                <el-radio-group v-model="ruleForm.gender">
                  <el-radio-button label="男">男</el-radio-button>
                  <el-radio-button label="女">女</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="员工状态" prop="status">
                <el-radio-group v-model="ruleForm.status">
                  <el-radio-button label="1">在职</el-radio-button>
                  <el-radio-button label="2">离职</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="车牌号" prop="carryCode">
                <el-input v-model="ruleForm.carryCode"></el-input>
              </el-form-item>
              <el-form-item label="自编号" prop="carryNo">
                <el-input v-model="ruleForm.carryNo"></el-input>
              </el-form-item>
              <el-form-item label="线路短号" prop="lineShort">
                <el-autocomplete :fetch-suggestions="querySearchAsync" style="width:100%;" v-model="ruleForm.lineShort"></el-autocomplete>
              </el-form-item>
              <el-form-item label="手机号" prop="telephone">
                <el-input v-model="ruleForm.telephone"></el-input>
              </el-form-item>
              <el-form-item label="部门名称" prop="departmentName">
                <el-input v-model="ruleForm.departmentName"></el-input>
              </el-form-item>
              <el-form-item label="身份证" prop="idcard">
                <el-input v-model="ruleForm.idcard"></el-input>
              </el-form-item>
              <div class="dialog-submit">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-dialog>

    </div>

    <excelupload :title="excelUpload.title" :src="excelUpload.src" :fileName="excelUpload.fileName"></excelupload>

  </div>
</template>

<script type="text/ecmascript-6">
  import excelupload from '../../views/excelUpload.vue'
  export default {
    name: 'sjcx',
    components: { excelupload },
    data () {
      return {
        hrefExcel: '', // excel导出url
        toExcelHref: '', // excel模板下载url
        searchData: { // 搜索数据
          carryCode: '',
          carryNo: '',
          name: '',
          telephone: '',
          lineShort: ''
        },
        table: [ // 表格展示
          { label: '车牌号', name: 'carryCode' },
          { label: '自编号', name: 'carryNo' },
          { label: '员工姓名', name: 'name' },
          { label: '公司名称', name: 'companyName' },
          { label: '部门名称', name: 'departmentName' },
          { label: '职责', name: 'post' },
          { label: '性别', name: 'gender' },
          { label: '电话', name: 'telephone' },
          { label: '线路短号', name: 'lineShort' },
          { label: '员工状态', name: 'statusName' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        ruleForm: { // 表单数据
          name: '',
          carryCode: '',
          carryNo: '',
          lineShort: '',
          gender: '',
          telephone: '',
          departmentName: '',
          idcard: '',
          status: ''
        },
        rules: { // 表单规则
          name: [
            { required: true, message: '请输入姓名', toggle: 'blur' },
            { min: 2, max: 5, message: '长度在2-5之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cn.test(val) === false) {
                return callback(new Error('格式错误, 必须为中文'))
              } else {
                callback()
              }
            } }
          ],
          carryCode: [
            { required: true, message: '请输入车牌号', toggle: 'blur' },
            { min: 4, max: 15, message: '长度在4-15之间' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('不得包含特殊符号如：@/.~等'))
              } else {
                callback()
              }
            } }
          ],
          carryNo: [
            { required: true, message: '请输入自编号', toggle: 'blur' },
            { min: 4, max: 50, message: '长度在4-50之间' },
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
          lineShort: [
            { required: true, message: '请输入线路短号', toggle: 'blur' },
            { min: 1, max: 10, message: '长度在1-10之间' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('不得包含特殊符号如：@/.~等'))
              } else {
                callback()
              }
            } }
          ],
          gender: [
            { required: true, message: '请选择性别', toggle: 'blur' }
          ],
          status: [
            { required: true, message: '请选择员工状态', toggle: 'blur' }
          ],
          telephone: [
            { validator: (rule, val, callback) => {
              if (val === undefined) {
                callback()
                return false
              }
              if (val === '') {
                callback()
                return false
              }
              if (this.va.telephone.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          departmentName: [
            { min: 2, max: 25, message: '长度在2-25之间' },
            { validator: (rule, val, callback) => {
              if (val === undefined) {
                callback()
                return false
              }
              if (val === '') {
                callback()
                return false
              }
              if (this.va.cn.test(val) === false) {
                return callback(new Error('格式错误, 必须为中文'))
              } else {
                callback()
              }
            } }
          ],
          idcard: [
            { validator: (rule, val, callback) => {
              if (val === undefined) {
                callback()
                return false
              }
              if (val === '') {
                callback()
                return false
              }
              if (this.va.idCard.test(val) === false) {
                return callback(new Error('格式错误'))
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
        excelUpload: { // 上传excel
          title: '上传Excel数据',
          src: '',
          fileName: ''
        },
        indexEdit: 0, // 编辑行index
        timeout: null // 输入建议请求时间间隔
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '数据基础管理', small: '司机管理' })
      this.hrefExcel = this.api.sjcx.excel + '?companyId=' + localStorage.getItem('companyId') // 写入excel导出url
      this.toExcelHref = this.api.sjcx.goExcel // 写入下载excelurl
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.sjcx.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let status = data[i].status
              res.data.data[i].statusName = this.getPersonStatus(status) // 全局转换
            }
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
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          carryNo: this.searchData.carryNo,
          name: encodeURIComponent(this.searchData.name),
          telephone: this.searchData.telephone,
          lineShort: encodeURIComponent(this.searchData.lineShort)
        }
        this.Result(formData)
        this.hrefExcel = this.api.sjcx.excel + this.toHash(formData['params']) // 调用json转换成字符串连接hash函数
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          carryNo: this.searchData.carryNo,
          name: encodeURIComponent(this.searchData.name),
          telephone: this.searchData.telephone,
          lineShort: encodeURIComponent(this.searchData.lineShort),
          pageNum: val
        }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.carryCode = ''
        this.searchData.carryNo = ''
        this.searchData.name = ''
        this.searchData.telephone = ''
        this.searchData.lineShort = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增司机'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.name = row.name === undefined ? '' : row.name
        this.ruleForm.gender = row.gender === undefined ? '' : row.gender
        this.ruleForm.carryCode = row.carryCode === undefined ? '' : row.carryCode
        this.ruleForm.carryNo = row.carryNo === undefined ? '' : row.carryNo
        this.ruleForm.lineShort = row.lineShort === undefined ? '' : row.lineShort
        this.ruleForm.telephone = row.telephone === undefined ? '' : row.telephone
        this.ruleForm.departmentName = row.departmentName === undefined ? '' : row.departmentName
        this.ruleForm.idcard = row.idcard === undefined ? '' : row.idcard
        this.ruleForm.status = row.status === undefined ? '' : row.status.toString()
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.sjcx.delete, {
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
          if (valid) { // 通过
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              let name = that.ruleForm.name
              let gender = that.ruleForm.gender
              let carryCode = that.ruleForm.carryCode
              let carryNo = that.ruleForm.carryNo
              let lineShort = that.ruleForm.lineShort
              let telephone = that.ruleForm.telephone
              let departmentName = that.ruleForm.departmentName
              let idcard = that.ruleForm.idcard
              let status = that.ruleForm.status
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.sjcx.update, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    id: that.tableRowData.id,
                    name: encodeURIComponent(name),
                    gender: encodeURIComponent(gender),
                    carryCode: encodeURIComponent(carryCode),
                    carryNo: encodeURIComponent(carryNo),
                    lineShort: encodeURIComponent(lineShort),
                    telephone: encodeURIComponent(telephone),
                    departmentName: encodeURIComponent(departmentName),
                    idcard: encodeURIComponent(idcard),
                    status: encodeURIComponent(status)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].name = name
                    that.tableData[that.indexEdit].gender = gender
                    that.tableData[that.indexEdit].carryCode = carryCode
                    that.tableData[that.indexEdit].carryNo = carryNo
                    that.tableData[that.indexEdit].lineShort = lineShort
                    that.tableData[that.indexEdit].telephone = telephone
                    that.tableData[that.indexEdit].departmentName = departmentName
                    that.tableData[that.indexEdit].idcard = idcard
                    that.tableData[that.indexEdit].status = status
                    that.tableData[that.indexEdit].statusName = that.getPersonStatus(status)
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 编辑网络出错
                  console.log(err)
                  that.$message({type: 'error', message: '网络出错，请刷新试试'})
                  that.$store.commit('setLoading', false)
                })
              } else { // 如果是新增
                that.$axios.get(that.api.sjcx.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    name: encodeURIComponent(name),
                    gender: encodeURIComponent(gender),
                    carryCode: encodeURIComponent(carryCode),
                    carryNo: encodeURIComponent(carryNo),
                    lineShort: encodeURIComponent(lineShort),
                    telephone: encodeURIComponent(telephone),
                    departmentName: encodeURIComponent(departmentName),
                    idcard: encodeURIComponent(idcard),
                    status: encodeURIComponent(status)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    res.data.data.statusName = that.getPersonStatus(status)
                    if (that.tableData.length < 10) {
                      that.tableData.unshift(data)
                    } else {
                      that.tableData.splice(9, 1)
                      that.tableData.unshift(data)
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
                  that.$message({type: 'error', message: '网络出错，请刷新试试'})
                  that.$store.commit('setLoading', false)
                })
              }
              that.dialog.hidden = false
            }).catch(() => {})
          } else { // 未通过
            console.log('error')
          }
        })
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.name = ''
        this.ruleForm.gender = ''
        this.ruleForm.status = ''
        this.ruleForm.carryCode = ''
        this.ruleForm.carryNo = ''
        this.ruleForm.lineShort = ''
        this.ruleForm.telephone = ''
        this.ruleForm.departmentName = ''
        this.ruleForm.idcard = ''
      },
      uploadExcel () { // 上传excel
        this.excelUpload.src = this.api.sjcx.uploadExcel
        this.excelUpload.fileName = 'importExcel'
        this.$store.commit('setExcelDialogHidden', true)
      },
      querySearchAsync (queryString, cb) { // 线路短号输入建议
        let that = this
        clearTimeout(that.timeout)
        that.timeout = setTimeout(() => {
          that.$axios.get(that.api.suggestLineShort, {params: {companyId: localStorage.getItem('companyId'), lineShort: encodeURIComponent(queryString)}})
          .then((res) => {
            console.log(res)
            cb(res.data.data)
          })
        }, 1000 * Math.random())
      }
    }
  }
</script>
