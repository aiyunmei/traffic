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
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="公司名称" v-model.trim="searchData.companyName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增线路</el-button>
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
              <el-form-item label="线路短号" prop="lineShort">
                <el-input v-model="ruleForm.lineShort"></el-input>
              </el-form-item>
              <el-form-item label="线路名称" prop="lineName">
                <el-input v-model="ruleForm.lineName"></el-input>
              </el-form-item>
              <el-form-item label="是否循环线路" prop="isCircled">
                <el-radio-group v-model="ruleForm.isCircled">
                  <el-radio-button label="1">是</el-radio-button>
                  <el-radio-button label="0">否</el-radio-button>
                </el-radio-group>
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
    name: 'lxcx',
    components: { excelupload },
    data () {
      return {
        hrefExcel: '', // excel导出url
        toExcelHref: '', // excel模板下载url
        searchData: { // 搜索数据
          lineShort: '',
          companyName: ''
        },
        table: [ // 表格展示
          { label: '公司名称', name: 'companyName' },
          { label: '线路名称', name: 'name' },
          { label: '线路短号', name: 'short' },
          { label: '是否循环线路', name: 'isCircledName' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        ruleForm: { // 表单数据
          lineShort: '',
          lineName: '',
          isCircled: ''
        },
        rules: { // 表单规则
          lineShort: [
            { required: true, message: '请输入线路短号', toggle: 'blur' },
            { min: 1, max: 10, message: '长度在1-10之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          lineName: [
            { required: true, message: '请输入线路名称', toggle: 'blur' },
            { min: 2, max: 15, message: '长度在2-15之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          isCircled: [
            { required: true, message: '请选择是否循环', toggle: 'blur' }
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
        indexEdit: 0
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '数据基础管理', small: '线路管理' })
      this.hrefExcel = this.api.lxcx.excel + '?companyId=' + localStorage.getItem('companyId') // 写入excel导出url
      this.toExcelHref = this.api.lxcx.goExcel // 写入下载excelurl
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.lxcx.result, formData || {}).then((res) => {
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let isCircled = data[i].isCircled
              res.data.data[i].isCircledName = this.getIsCircled(isCircled)
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
          lineShort: encodeURIComponent(this.searchData.lineShort),
          companyName: encodeURIComponent(this.searchData.companyName)
        }
        this.Result(formData)
        this.hrefExcel = this.api.lxcx.excel + this.toHash(formData['params']) // 调用json转换成字符串连接hash函数
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          companyName: encodeURIComponent(this.searchData.companyName),
          pageNum: val
        }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.lineShort = ''
        this.searchData.companyName = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增线路'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.lineShort = row.short === undefined ? '' : row.short
        this.ruleForm.lineName = row.name === undefined ? '' : row.name
        this.ruleForm.isCircled = row.isCircled === undefined ? '' : row.isCircled.toString()
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.lxcx.delete, {params: {id: row.id}}).then((res) => {
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
              let lineShort = that.ruleForm.lineShort
              let lineName = that.ruleForm.lineName
              let isCircled = that.ruleForm.isCircled
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.lxcx.update, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    id: that.tableRowData.id,
                    lineShort: encodeURIComponent(lineShort),
                    lineName: encodeURIComponent(lineName),
                    isCircled: parseFloat(isCircled)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].short = lineShort
                    that.tableData[that.indexEdit].name = lineShort
                    that.tableData[that.indexEdit].isCircled = isCircled
                    that.tableData[that.indexEdit].isCircledName = that.getIsCircled(isCircled) // 全局转换
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 编辑网络出错
                  console.log(err)
                  that.$message({type: 'error', message: '网络出错,请刷新试试'})
                  that.$store.commit('setLoading', false)
                })
              } else { // 如果是新增
                that.$axios.get(that.api.lxcx.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    lineShort: encodeURIComponent(lineShort),
                    lineName: encodeURIComponent(lineName),
                    isCircled: parseFloat(isCircled)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    res.data.data.isCircledName = that.getIsCircled(isCircled) // 全局转换
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
                }).catch((err) => {
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错,请刷新试试'})
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
        this.ruleForm.lineShort = ''
        this.ruleForm.lineName = ''
        this.ruleForm.isCircled = ''
      },
      uploadExcel () { // 上传excel
        this.excelUpload.src = this.api.lxcx.uploadExcel
        this.excelUpload.fileName = 'importExcel'
        this.$store.commit('setExcelDialogHidden', true)
      }
    }
  }
</script>
