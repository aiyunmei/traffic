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
              <el-col :span="3">
                <el-input placeholder="车牌/闸机编号" v-model.trim="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="自编号" v-model.trim="searchData.carryNo" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="车辆/站点名" v-model.trim="searchData.carryName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="线路名称" v-model.trim="searchData.lineName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-select placeholder="选择车辆类型" v-model="searchData.carryType" clearable class="item-search-input-l">
                  <el-option v-for="item in this.$store.state.carryType" :key="item.label" :label="item.label" :value="item.value"></el-option>
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
          <a :href="hrefExcel" target="_blank"><el-button type="primary" icon="upload">导出</el-button></a>
          <a :href="toExcelHref" target="_blank"><el-button type="primary" icon="document">Excel模板下载</el-button></a>
          <el-button type="primary" icon="upload" v-on:click="uploadExcel">上传Excel数据</el-button>
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增车辆</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column  v-for="(item,index) in table" :label="item.label" :key="index">
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
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
              <el-form-item label="车牌/闸机编号" prop="carryCode">
                <el-input v-model="ruleForm.carryCode"></el-input>
              </el-form-item>
              <el-form-item label="自编号" prop="carryNo">
                <el-input v-model="ruleForm.carryNo"></el-input>
              </el-form-item>
              <el-form-item label="车辆/站点名" prop="carryName">
                <el-input v-model="ruleForm.carryName"></el-input>
              </el-form-item>
              <el-form-item label="线路短号" prop="lineShort">
                <el-autocomplete :fetch-suggestions="querySearchAsync" style="width:100%;" v-model="ruleForm.lineShort"></el-autocomplete>
              </el-form-item>
              <el-form-item label="车辆类型" prop="carryType" v-if="false">
                <el-radio-group v-model="ruleForm.carryType">
                  <el-radio-button v-for="item in this.$store.state.carryType" :label="item.value" :key="item.value">{{ item.label }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="燃油类型" prop="carryFuelType">
                <el-select placeholder="请选择" v-model="ruleForm.carryFuelType" clearable>
                  <el-option v-for="item in this.$store.state.carryFuelType" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车辆级别" prop="carryLevel">
                <el-select placeholder="请选择" v-model="ruleForm.carryLevel" clearable>
                  <el-option v-for="item in this.$store.state.carryLevel" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="车辆结构" prop="carryBodyType">
                <el-select placeholder="请选择" v-model="ruleForm.carryBodyType" clearable>
                  <el-option v-for="item in this.$store.state.carryBodyType" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="票价(分)" prop="price">
                <el-input v-model="ruleForm.price"></el-input>
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
    name: 'clcx',
    components: { excelupload },
    data () {
      return {
        hrefExcel: '', // excel导出url
        toExcelHref: '', // excel模板下载url
        searchData: { // 搜索数据
          carryCode: '',
          lineShort: '',
          carryNo: '',
          carryName: '',
          lineName: '',
          carryType: ''
        },
        table: [ // 表格展示
          { label: '车牌/闸机编号', name: 'code' },
          { label: '自编号', name: 'no' },
          { label: '车辆/站点名', name: 'name' },
          { label: '线路短号', name: 'lineShort' },
          { label: '线路名称', name: 'lineName' },
          { label: '公司名称', name: 'companyName' },
          { label: '车辆类型', name: 'carryTypeName' },
          { label: '车辆结构', name: 'bodyType' },
          { label: '燃油类型', name: 'fuelType' },
          { label: '车辆级别', name: 'level' },
          { label: '票价(分)', name: 'price' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        ruleForm: { // 表单数据
          carryCode: '',
          carryNo: '',
          carryName: '',
          lineShort: '',
          carryType: '',
          carryFuelType: '',
          carryLevel: '',
          carryBodyType: '',
          price: ''
        },
        rules: { // 表单规则
          carryCode: [
            { required: true, message: '请输入车牌/闸机编号', toggle: 'blur' },
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
          carryName: [
            { required: true, message: '请输入车辆/站点名', toggle: 'blur' },
            { min: 2, max: 20, message: '长度在2-20之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('格式错误, 必须为中文'))
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
          carryType: [
            { required: true, message: '请选择车辆类型', toggle: 'blur' }
          ],
          carryFuelType: [
            { required: true, message: '请选择燃油类型', toggle: 'blur' }
          ],
          carryLevel: [
            { required: true, message: '请选择车辆级别', toggle: 'blur' }
          ],
          carryBodyType: [
            { required: true, message: '请选择车辆结构', toggle: 'blur' }
          ],
          price: [
            { required: true, message: '输入票价', toggle: 'blur' },
            { min: 1, max: 5, message: '长度在1-5之间' },
            { validator: (rule, val, callback) => {
              if (this.va.number.test(val) === false) {
                return callback(new Error('请输入整数'))
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
        timeout: null // 输入建议的请求时间间隔
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '数据基础管理', small: '车辆管理' })
      this.hrefExcel = this.api.clcx.excel + '?companyId=' + localStorage.getItem('companyId') // 写入导出
      this.toExcelHref = this.api.clcx.goExcel // 写入下载excelurl
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.clcx.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let carryType = data[i].type
              res.data.data[i].carryTypeName = this.getCarryType(carryType) // 全局转换
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
          lineShort: encodeURIComponent(this.searchData.lineShort),
          lineName: encodeURIComponent(this.searchData.lineName),
          carryNo: encodeURIComponent(this.searchData.carryNo),
          carryName: encodeURIComponent(this.searchData.carryName),
          carryType: encodeURIComponent(this.searchData.carryType)
        }
        this.Result(formData)
        this.hrefExcel = this.api.clcx.excel + this.toHash(formData['params']) // 调用json转换成字符串连接hash函数
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          lineName: encodeURIComponent(this.searchData.lineName),
          carryNo: encodeURIComponent(this.searchData.carryNo),
          carryName: encodeURIComponent(this.searchData.carryName),
          carryType: encodeURIComponent(this.searchData.carryType),
          pageNum: val
        }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.carryCode = ''
        this.searchData.lineShort = ''
        this.searchData.lineName = ''
        this.searchData.carryNo = ''
        this.searchData.carryName = ''
        this.searchData.carryType = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增车辆'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.carryCode = row.code === undefined ? '' : row.code
        this.ruleForm.carryNo = row.no === undefined ? '' : row.no
        this.ruleForm.carryName = row.name === undefined ? '' : row.name
        this.ruleForm.lineShort = row.lineShort === undefined ? '' : row.lineShort
        this.ruleForm.carryType = row.type === undefined ? '' : row.type
        this.ruleForm.carryFuelType = row.fuelType === undefined ? '' : row.fuelType
        this.ruleForm.carryLevel = row.level === undefined ? '' : row.level
        this.ruleForm.carryBodyType = row.bodyType === undefined ? '' : row.bodyType
        this.ruleForm.price = row.price === undefined ? '' : row.price.toString()
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.clcx.delete, {params: {id: row.id}})
          .then((res) => {
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
              let carryCode = that.ruleForm.carryCode
              let carryNo = that.ruleForm.carryNo
              let carryName = that.ruleForm.carryName
              let lineShort = that.ruleForm.lineShort
              let carryType = 1 // that.ruleForm.carryType
              let price = that.ruleForm.price
              let carryFuelType = that.ruleForm.carryFuelType
              let carryLevel = that.ruleForm.carryLevel
              let carryBodyType = that.ruleForm.carryBodyType
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.clcx.update, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    id: that.tableRowData.id,
                    carryCode: encodeURIComponent(carryCode),
                    carryNo: encodeURIComponent(carryNo),
                    carryName: encodeURIComponent(carryName),
                    lineShort: encodeURIComponent(lineShort),
                    carryType: encodeURIComponent(carryType),
                    carryFuelType: encodeURIComponent(carryFuelType),
                    carryLevel: encodeURIComponent(carryLevel),
                    carryBodyType: encodeURIComponent(carryBodyType),
                    price: price
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].code = carryCode
                    that.tableData[that.indexEdit].no = carryNo
                    that.tableData[that.indexEdit].name = carryName
                    that.tableData[that.indexEdit].lineShort = lineShort
                    that.tableData[that.indexEdit].type = carryType
                    that.tableData[that.indexEdit].carryTypeName = that.getCarryType(carryType)
                    that.tableData[that.indexEdit].fuelType = carryFuelType
                    that.tableData[that.indexEdit].level = carryLevel
                    that.tableData[that.indexEdit].bodyType = carryBodyType
                    that.tableData[that.indexEdit].price = price
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 编辑网络出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错，请刷新试试'})
                })
              } else { // 如果是新增
                that.$axios.get(that.api.clcx.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    carryCode: encodeURIComponent(carryCode),
                    carryNo: encodeURIComponent(carryNo),
                    carryName: encodeURIComponent(carryName),
                    lineShort: encodeURIComponent(lineShort),
                    carryType: encodeURIComponent(carryType),
                    carryFuelType: encodeURIComponent(carryFuelType),
                    carryLevel: encodeURIComponent(carryLevel),
                    carryBodyType: encodeURIComponent(carryBodyType),
                    price: price
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    res.data.data.carryTypeName = that.getCarryType(carryType) // 全局转换
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
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错，请刷新试试'})
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
        this.ruleForm.carryCode = ''
        this.ruleForm.carryNo = ''
        this.ruleForm.carryName = ''
        this.ruleForm.lineShort = ''
        this.ruleForm.carryType = ''
        this.ruleForm.carryFuelType = ''
        this.ruleForm.carryLevel = ''
        this.ruleForm.carryBodyType = ''
        this.ruleForm.price = ''
      },
      querySearchAsync (queryString, cb) { // 线路短号输入建议
        let that = this
        clearTimeout(that.timeout)
        that.timeout = setTimeout(() => {
          this.$axios.get(this.api.suggestLineShort, {params: {companyId: localStorage.getItem('companyId'), lineShort: encodeURIComponent(queryString)}})
          .then((res) => {
            console.log(res)
            cb(res.data.data)
          })
        }, 1000 * Math.random())
      },
      uploadExcel () { // 上传excel
        this.excelUpload.src = this.api.clcx.uploadExcel
        this.excelUpload.fileName = 'importExcel'
        this.$store.commit('setExcelDialogHidden', true)
      }
    }
  }
</script>
