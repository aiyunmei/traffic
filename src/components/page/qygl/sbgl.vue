<template>
  <div class="item" v-loading.fullscreen.lock="this.$store.state.loading">

    <div class="item-search">
      <el-collapse>
        <el-collapse-item>
          <template slot="title">
            <el-button type="primary">搜索</el-button>
          </template>
          <div class="item-search-input">
            <el-row>
              <el-col :span="2">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="车牌/闸机编号" v-model.trim="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="设备号" v-model.trim="searchData.deviceId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-select v-model="searchData.carryType" @multiple="true" clearable allow-create placeholder="车辆类型" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.carryType" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-col>
              <el-col :span="2">
                <el-select v-model="searchData.supplier" @multiple="true" clearable allow-create placeholder="厂商" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.supplier" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-date-picker class="item-search-input-l" @keyup.enter.native="search" v-model="searchTime" type="datetimerange" :picker-options="pickerOptions" placeholder="选择搜索时间范围" align="left" :editable="false" :clearable="false"></el-date-picker>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增设备</el-button>
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

    </div>

    <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" @close="closeDialog('ruleForm')">
      <div class="item-dialog">
        <div class="item-dialog-underline"></div>
        <div class="item-dialog-form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
            <el-form-item label="车牌/闸机编号" prop="carryCode">
              <el-autocomplete v-model="ruleForm.carryCode" :fetch-suggestions="querySearchAsync" style="width:100%;"></el-autocomplete>
            </el-form-item>
            <el-form-item label="设备号" prop="deviceId">
              <el-input v-model="ruleForm.deviceId"></el-input>
            </el-form-item>
            <el-form-item label="设备厂家" prop="supplier">
              <el-select v-model="ruleForm.supplier" @multiple="true" clearable allow-create placeholder="请选择">
                <el-option v-for="(item,index) in this.$store.state.deviceSupplier" :label="item.label" :value="item.value" :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车辆类型" prop="carryType">
              <el-select v-model="ruleForm.carryType" @multiple="true" clearable allow-create placeholder="请选择">
                <el-option v-for="(item,index) in this.$store.state.carryType" :label="item.label" :value="item.value" :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="gprs编号" prop="gprsCode">
              <el-input v-model="ruleForm.gprsCode"></el-input>
            </el-form-item>
            <el-form-item label="运营商" prop="gprsType">
              <el-select v-model="ruleForm.gprsType" @multiple="true" clearable allow-create placeholder="请选择">
                <el-option v-for="(item,index) in this.$store.state.gprsType" :label="item.label" :value="item.value" :key="index">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="设备类型" prop="type">
              <el-select placeholder="请选择" v-model="ruleForm.type" clearable>
                <el-option v-for="item in this.$store.state.deviceType" :key="item.label" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="线路短号" prop="lineShort" v-if="false">
              <el-autocomplete v-model="ruleForm.lineShort" :fetch-suggestions="querySearchAsyncLineShort" style="width:100%;"></el-autocomplete>
            </el-form-item>
            <div class="dialog-submit">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        pickerOptions: { // 时间间隔便捷选择
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        hrefExcel: '', // 到处excel url
        searchTime: '', // 时间间隔
        searchData: { // 搜索
          carryCode: '',
          deviceId: '',
          lineShort: '',
          supplier: '',
          carryType: '',
          startTime: '',
          endTime: ''
        },
        table: [ // 表格显示
          { label: '车牌/闸机编号', name: 'carryCode' },
          { label: '设备号', name: 'deviceId' },
          { label: '闸机站点名', name: 'carryName' },
          { label: '自编号', name: 'carryNo' },
          { label: '设备厂家', name: 'supplierName' },
          { label: '公司名称', name: 'companyName' },
          { label: 'gprs编号', name: 'gprsCode' },
          { label: '运营商', name: 'gprsType' },
          { label: '线路短号', name: 'lineShort' },
          { label: '车辆类型', name: 'carryTypeName' },
          { label: '设备类型', name: 'typeName' },
          { label: '原始票价(分)', name: 'carryOriginalPrice' },
          { label: '单笔金额(分)', name: 'price' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 表格编辑行数据
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        ruleForm: { // 表单值
          carryCode: '',
          deviceId: '',
          supplier: '',
          carryType: '',
          gprsCode: '',
          gprsType: '',
          type: '',
          lineShort: ''
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
            } },
            { validator: (rule, val, callback) => {
              if (this.dialog.title === '编辑') {
                callback()
              } else {
                this.$axios.get(this.api.sbgl.ansync, {
                  params: {
                    tempVal: encodeURIComponent(val),
                    tempName: rule.field,
                    companyId: localStorage.getItem('companyId')
                  }
                }).then(function (res) {
                  if (res.data.msg === 'false') {
                    return callback(new Error('车牌/闸机编号已存在'))
                  } else {
                    callback()
                  }
                })
              }
            }}
          ],
          deviceId: [
            { required: true, message: '请输入设备号', toggle: 'blur' },
            { min: 5, max: 50, message: '长度在5-50之间' },
            { validator: (rule, val, callback) => {
              if (this.va.string.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } },
            { validator: (rule, val, callback) => {
              if (this.va.pattern.test(val) === false) {
                return callback(new Error('不得使用非法字符'))
              } else {
                callback()
              }
            } },
            { validator: (rule, val, callback) => {
              if (this.dialog.title === '编辑') {
                callback()
              } else {
                this.$axios.get(this.api.sbgl.ansync, {
                  params: {
                    tempVal: encodeURIComponent(val),
                    tempName: rule.field,
                    companyId: localStorage.getItem('companyId')
                  }
                }).then(function (res) {
                  if (res.data.msg === 'false') {
                    return callback(new Error('设备号存在'))
                  } else {
                    callback()
                  }
                })
              }
            }}
          ],
          supplier: [
            { required: true, message: '请选择厂商', toggle: 'blur' }
          ],
          carryType: [
            { required: true, message: '请选择车辆类型', toggle: 'blur' }
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
            { required: true, message: '请输入运营商', toggle: 'blur' }
          ],
          type: [
            { required: true, message: '请选择收费类型', toggle: 'blur' }
          ],
          lineShort: [
            { required: true, message: '请输入线路短号', toggle: 'blur' },
            { min: 1, max: 10, message: '长度在2-10之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('不得包含特殊符号如：@/.~等'))
              } else {
                callback()
              }
            } }
          ]
        },
        indexEdit: 0, // 编辑行index
        timeout: null // 输入建议的触发时间间隔
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '企业管理', small: '设备管理' })
      this.hrefExcel = this.api.sbgl.excel + '?companyId=' + localStorage.getItem('companyId') // 添加导出url
    },
    methods: {
      Result (formData) { // 页面初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.sbgl.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 请求成功
            let data = res.data.data
            for (let i = 0; i < data.length; i++) {
              let supplier = data[i]['supplier']
              let carryType = data[i]['carryType']
              let type = data[i]['type']
              res.data.data[i].supplierName = this.getSupplier(supplier) // 全局转换
              res.data.data[i].carryTypeName = this.getCarryType(carryType) // 全局转换
              res.data.data[i].typeName = this.getDeviceType(type) // 全局转换
            }
            let page = res.data.page
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 未搜索到
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 其他
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '失败'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 报错
          console.log(err)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
          this.$store.commit('setLoading', false)
          this.$store.commit('clearPage')
        })
      },
      search () { // 搜索接口调用
        let formData = {}
        if (this.searchTime[0] === null || this.searchTime[1] === null) { // 防止用户没有请求时间 时间格式修改被调用报错
        } else if (this.searchTime === '') {
        } else {
          this.searchData.startTime = this.updateTime(this.searchTime[0])
          this.searchData.endTime = this.updateTime(this.searchTime[1])
        }
        formData['params'] = {
          companyId: localStorage.getItem('companyId'),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          deviceId: this.searchData.deviceId,
          lineShort: encodeURIComponent(this.searchData.lineShort),
          supplier: encodeURIComponent(this.searchData.supplier),
          carryType: this.searchData.carryType,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime
        }
        this.Result(formData)
        this.hrefExcel = this.api.sbgl.excel + this.toHash(formData['params']) // 调用json转换成字符串连接hash函数
      },
      handleCurrentChange (val) { // 分页
        if (this.searchTime[0] === null || this.searchTime[1] === null) { // 防止用户没有请求时间 时间格式修改被调用报错
        } else if (this.searchTime === '') {
        } else {
          this.searchData.startTime = this.updateTime(this.searchTime[0])
          this.searchData.endTime = this.updateTime(this.searchTime[1])
        }
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            carryCode: encodeURIComponent(this.searchData.carryCode),
            deviceId: this.searchData.deviceId,
            lineShort: encodeURIComponent(this.searchData.lineShort),
            supplier: encodeURIComponent(this.searchData.supplier),
            carryType: this.searchData.carryType,
            startTime: this.searchData.startTime,
            endTime: this.searchData.endTime,
            pageNum: val
          }
        })
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.carryCode = ''
        this.searchData.deviceId = ''
        this.searchData.lineShort = ''
        this.searchData.supplier = ''
        this.searchData.carryType = ''
        this.searchData.startTime = ''
        this.searchData.endTime = ''
        this.searchTime = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增设备'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.carryCode = row.carryCode === undefined ? '' : row.carryCode
        this.ruleForm.deviceId = row.deviceId === undefined ? '' : row.deviceId
        this.ruleForm.supplier = row.supplier === undefined ? '' : row.supplier.toString()
        this.ruleForm.carryType = row.carryType === undefined ? '' : row.carryType.toString()
        this.ruleForm.gprsCode = row.gprsCode === undefined ? '' : row.gprsCode
        this.ruleForm.gprsType = row.gprsType === undefined ? '' : row.gprsType
        this.ruleForm.type = row.type === undefined ? '' : row.type.toString()
        this.ruleForm.lineShort = row.lineShort === undefined ? '' : row.lineShort
        this.indexEdit = index
        this.tableRowData = row
      },
      handleDelete (index, row) { // 删除
        console.log(index, row)
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.sbgl.delete, {params: {id: row.id, companyId: localStorage.getItem('companyId')}})
          .then((res) => {
            console.log(res)
            if (res.data.msg.code === '20000') {
              that.$message({type: 'success', message: '删除成功'})
              that.tableData.splice(index, 1)
            } else {
              that.$message({type: 'error', message: '删除失败'})
            }
            that.$store.commit('setLoading', false)
          }).catch((err) => {
            that.$store.commit('setLoading', false)
            console.log(err)
            that.$message({type: 'error', message: '网络出错'})
          })
        }).catch(() => {})
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              let carryCode = that.ruleForm.carryCode
              let deviceId = that.ruleForm.deviceId
              let supplier = parseFloat(that.ruleForm.supplier)
              let gprsCode = that.ruleForm.gprsCode
              let gprsType = that.ruleForm.gprsType
              let lineShort = that.ruleForm.lineShort
              let carryType = that.ruleForm.carryType
              let type = that.ruleForm.type
              if (that.dialog.title === '编辑') {
                that.$axios.get(that.api.sbgl.update, {
                  params: {
                    id: that.tableRowData.id,
                    companyId: localStorage.getItem('companyId'),
                    carryCode: encodeURIComponent(carryCode),
                    deviceId: deviceId,
                    supplier: supplier,
                    gprsCode: gprsCode,
                    gprsType: encodeURIComponent(gprsType),
                    lineShort: encodeURIComponent(lineShort),
                    carryType: encodeURIComponent(carryType),
                    type: type
                  }
                }).then((res) => {
                  if (res.data.msg.code === '20000') {
                    that.tableData[that.indexEdit].carryCode = carryCode
                    that.tableData[that.indexEdit].deviceId = deviceId
                    that.tableData[that.indexEdit].supplier = supplier
                    that.tableData[that.indexEdit].gprsCode = gprsCode
                    that.tableData[that.indexEdit].gprsType = gprsType
                    that.tableData[that.indexEdit].lineShort = lineShort
                    that.tableData[that.indexEdit].carryType = carryType
                    that.tableData[that.indexEdit].supplierName = that.getSupplier(supplier)
                    that.tableData[that.indexEdit].carryTypeName = that.getCarryType(carryType)
                    that.tableData[that.indexEdit].typeName = that.getDeviceType(type)
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') {
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else {
                    that.$message({type: 'error', message: '编辑失败，请重新试试'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => {
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
                })
              } else {
                that.$axios.get(that.api.sbgl.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    carryCode: encodeURIComponent(carryCode),
                    deviceId: deviceId,
                    supplier: supplier,
                    gprsCode: gprsCode,
                    gprsType: encodeURIComponent(gprsType),
                    lineShort: encodeURIComponent(lineShort),
                    carryType: encodeURIComponent(carryType),
                    type: encodeURIComponent(type)
                  }
                }).then((res) => {
                  if (res.data.msg.code === '20000') {
                    let id = res.data.id
                    let data = res.data.data
                    // data.price = (parseFloat(data.price) / 100).toString()
                    res.data.data.id = id
                    res.data.data.supplierName = that.getSupplier(data.supplier) // 全局转换
                    res.data.data.carryTypeName = that.getCarryType(data.carryType) // 全局转换
                    res.data.data.typeName = that.getDeviceType(data.type) // 全局转换
                    if (that.tableData.length < 10) {
                      that.tableData.unshift(data)
                    } else {
                      that.tableData.splice(9, 1)
                      that.tableData.unshift(data)
                    }
                    that.$message({type: 'success', message: '新增成功'})
                  } else if (res.data.msg.code === '40001') {
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else {
                    that.$message({type: 'error', message: '新增失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => {
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
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
        this.ruleForm.carryCode = ''
        this.ruleForm.deviceId = ''
        this.ruleForm.supplier = ''
        this.ruleForm.gprsCode = ''
        this.ruleForm.gprsType = ''
        this.ruleForm.lineShort = ''
        this.ruleForm.carryType = ''
        this.ruleForm.type = ''
      },
      querySearchAsync (queryString, cb) { // 车牌输入建议
        let that = this
        clearTimeout(that.timeout)
        that.timeout = setTimeout(() => {
          that.$axios.get(that.api.suggestCarryCode, {params: {companyId: localStorage.getItem('companyId'), carryCode: encodeURIComponent(queryString)}})
          .then((res) => {
            console.log(res)
            cb(res.data.data)
          })
        }, 3000 * Math.random())
      },
      querySearchAsyncLineShort (queryString, cb) { // 线路短号建议搜索
        let that = this
        clearTimeout(that.timeout)
        that.timeout = setTimeout(() => {
          that.$axios.get(that.api.suggestLineShort, {params: {companyId: localStorage.getItem('companyId'), lineShort: encodeURIComponent(queryString)}})
          .then((res) => {
            console.log(res)
            cb(res.data.data)
          })
        }, 3000 * Math.random())
      }
    }
  }
</script>

<style>
</style>
