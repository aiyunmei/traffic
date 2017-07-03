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
              <el-col :span="4">
                <el-input placeholder="车牌/闸机编号" v-model.trim="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="自编号" v-model.trim="searchData.carryNo" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-select v-model="searchData.status" @multiple="true" clearable allow-create placeholder="安装状态" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in [{label: '已安装', value: '1'}, {label: '未安装', value: '0'}]" :label="item.label" :value="item.value" :key="index"></el-option>
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
          <a :href="toExcelHref" target="_blank"><el-button type="primary" icon="document">Excel模板下载</el-button></a>
          <el-button type="primary" icon="upload" v-on:click="uploadExcel">上传Excel数据</el-button>
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增录入</el-button>
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
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="120px">
            <el-form-item label="车牌/闸机编号" prop="carryCode">
              <el-input v-model="ruleForm.carryCode"></el-input>
            </el-form-item>
            <el-form-item label="分组" prop="grouping">
              <el-input v-model="ruleForm.grouping"></el-input>
            </el-form-item>
            <el-form-item label="线路短号" prop="lineShort">
              <el-autocomplete v-model="ruleForm.lineShort" :fetch-suggestions="querySearchAsyncLineShort" style="width:100%;"></el-autocomplete>
            </el-form-item>
            <el-form-item label="安装状态" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio-button label="1">已安装</el-radio-button>
                <el-radio-button label="0">未安装</el-radio-button>
              </el-radio-group>
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
</template>

<script type="text/ecmascript-6">
  import excelupload from '../../views/excelUpload.vue'
  export default {
    name: 'wllb',
    components: { excelupload },
    data () {
      return {
        toExcelHref: '', // excel 模板下载url
        searchData: { // 搜索数据
          carryCode: '',
          carryNo: '',
          lineShort: '',
          status: ''
        },
        table: [ // 表格展示
          { label: '车牌/闸机编号', name: 'carryCode' },
          { label: '闸机站点名', name: 'carryName' },
          { label: '自编号', name: 'carryNo' },
          { label: '公司名称', name: 'companyName' },
          { label: '线路短号', name: 'lineShort' },
          { label: '分组', name: 'grouping' },
          { label: '安装状态', name: 'statusName' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 表格编辑行数据
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        ruleForm: { // 表单数据
          carryCode: '',
          grouping: '',
          lineShort: '',
          status: ''
        },
        rules: { // 表格规则
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
          grouping: [
            { required: true, message: '请输入分组', toggle: 'blur' },
            { min: 2, max: 15, message: '长度在2-15之间' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('不得包含特殊符号如：@/.~等'))
              } else {
                callback()
              }
            } }
          ],
          lineShort: [
            { required: true, message: '请输入线短号', toggle: 'blur' },
            { min: 2, max: 10, message: '长度在2-10之间' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('不得包含特殊符号如：@/.~等'))
              } else {
                callback()
              }
            } }
          ],
          status: [
            { required: true, message: '请选择安装状态', toggle: 'blur' }
          ]
        },
        indexEdit: 0, // 表格编辑行索引
        excelUpload: { // 上传excel
          title: '上传Excel数据',
          src: '',
          fileName: ''
        }
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.toExcelHref = this.api.wllb.goExcel // 写入下载excel 模板url
      this.$store.commit('setTableTitle', { big: '机具录入', small: '未录列表' })
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.wllb.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let status = data[i]['status'].toString()
              res.data.data[i].statusName = this.getInstall(status) // 全局转换
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '未查询到数据'})
          } else { // 失败
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '网络出错，请刷新页面重试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新页面重试'})
        })
      },
      search () { // 搜索
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            carryCode: encodeURIComponent(this.searchData.carryCode),
            carryNo: this.searchData.carryNo,
            lineShort: encodeURIComponent(this.searchData.lineShort),
            status: this.searchData.status
          }
        })
      },
      handleCurrentChange (val) { // 分页
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            carryCode: encodeURIComponent(this.searchData.carryCode),
            carryNo: this.searchData.carryNo,
            lineShort: encodeURIComponent(this.searchData.lineShort),
            status: this.searchData.status,
            pageNum: val
          }
        })
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.carryCode = ''
        this.searchData.carryNo = ''
        this.searchData.lineShort = ''
        this.searchData.status = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增录入'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.carryCode = row.carryCode === undefined ? '' : row.carryCode
        this.ruleForm.grouping = row.grouping === undefined ? '' : row.grouping
        this.ruleForm.lineShort = row.lineShort === undefined ? '' : row.lineShort
        this.ruleForm.status = row.status === undefined ? '' : row.status.toString()
        this.indexEdit = index
        this.tableRowData = row
      },
      handleDelete (index, row) { // 删除
        console.log(index, row)
        this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          this.$store.commit('setLoading', true)
          this.$axios.get(this.api.wllb.delete, {
            params: { id: row.id }
          }).then((res) => {
            if (res.data.msg.code === '20000') {
              this.$message({type: 'success', message: '删除成功!'})
              this.tableData.splice(index, 1)
            } else {
              this.$message({type: 'error', message: '删除失败'})
            }
            this.$store.commit('setLoading', false)
          }).catch((err) => {
            console.log(err)
            this.$store.commit('setLoading', false)
            this.$message({type: 'error', message: '网路出错，请刷新页面试试'})
          })
        })
        .catch(() => {})
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              let carryCode = that.ruleForm.carryCode
              let grouping = that.ruleForm.grouping
              let lineShort = that.ruleForm.lineShort
              let status = that.ruleForm.status
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.wllb.update, {
                  params: {
                    id: that.tableRowData.id,
                    companyId: localStorage.getItem('companyId'),
                    carryCode: encodeURIComponent(carryCode),
                    grouping: encodeURIComponent(grouping),
                    lineShort: lineShort,
                    status: parseFloat(status)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].carryCode = carryCode
                    that.tableData[that.indexEdit].grouping = grouping
                    that.tableData[that.indexEdit].lineShort = lineShort
                    that.tableData[that.indexEdit].status = status.toString()
                    that.tableData[that.indexEdit].statusName = that.getInstall(status)
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                }).catch((err) => { // 编辑网络出错
                  console.log(err)
                  that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
                })
              } else { // 如果是新增
                that.$axios.get(that.api.wllb.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    carryCode: encodeURIComponent(carryCode),
                    grouping: encodeURIComponent(grouping),
                    lineShort: lineShort,
                    status: parseFloat(status)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 如果新增成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    res.data.data.status = res.data.data.status.toString()
                    res.data.data.statusName = that.getInstall(status)
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
                }).catch((err) => { // 新增网络出错
                  console.log(err)
                  that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
                })
              }
              that.dialog.hidden = false
              that.$store.commit('setLoading', false)
            }).catch(() => {})
          } else {
            console.log('error')
          }
        })
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.carryCode = ''
        this.ruleForm.grouping = ''
        this.ruleForm.lineShort = ''
        this.ruleForm.status = ''
      },
      uploadExcel () { // 上传excel
        this.excelUpload.src = this.api.wllb.uploadExcel
        this.excelUpload.fileName = 'importExcel'
        this.$store.commit('setExcelDialogHidden', true)
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
