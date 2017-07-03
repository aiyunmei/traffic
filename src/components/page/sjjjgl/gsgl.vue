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
              <el-col :span="6">
                <el-input placeholder="公司名称" v-model.trim="searchData.localComName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增公司</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column  v-for="(item,index) in table" :label="item.label" :key="index">
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
              <el-form-item label="公司名称" prop="localComName">
                <el-input v-model="ruleForm.localComName"></el-input>
              </el-form-item>
              <el-form-item label="公司编号" prop="localComCode">
                <el-input v-model="ruleForm.localComCode"></el-input>
              </el-form-item>
              <el-form-item label="公司路由地址" prop="localComAddress">
                <el-input v-model="ruleForm.localComAddress"></el-input>
              </el-form-item>
              <el-form-item label="父公司编号" prop="localComParentCode">
                <el-input v-model="ruleForm.localComParentCode"></el-input>
              </el-form-item>
              <div class="dialog-submit">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'gsgl',
    data () {
      return {
        hrefExcel: '', // excel导出url
        toExcelHref: '', // excel模板下载url
        searchData: { // 搜索数据
          localComName: ''
        },
        table: [ // 表格展示
          { label: '公司名称', name: 'localComName' },
          { label: '公司编号', name: 'localComCode' },
          { label: '公司路由地址', name: 'localComAddress' },
          { label: '父公司编号', name: 'localComParentCode' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 表格行编辑
        ruleForm: { // 表单数据
          localComName: '', localComAddress: '', localComCode: '', localComParentCode: ''
        },
        rules: { // 表单规则
          localComName: [
            { required: true, message: '请输入公司名称', toggle: 'blur' },
            { min: 2, max: 25, message: '长度在2-25之间', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          localComCode: [
            { required: true, message: '请输入公司编号', toggle: 'blur' },
            { min: 2, max: 50, message: '长度在2-50之间', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.string.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          localComAddress: [
            { min: 2, max: 50, message: '长度在2-50之间', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (val === undefined) {
                callback()
                return false
              }
              if (val === '') {
                callback()
                return false
              }
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          localComParentCode: [
            { min: 2, max: 50, message: '长度在2-50之间', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (val === undefined) {
                callback()
                return false
              }
              if (val === '') {
                callback()
                return false
              }
              if (this.va.string.test(val) === false) {
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
        indexEdit: 0 // 编辑行index
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '数据基础管理', small: '公司管理' })
      this.hrefExcel = this.api.gsgl.excel + '?companyId=' + localStorage.getItem('companyId') // 写入excel导出url
    },
    methods: {
      Result (formData) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.gsgl.result, formData || {})
        .then((res) => {
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
            this.$message({type: 'error', message: '网络出错，请刷新试试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
        })
      },
      search () { // 搜索
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          localComName: encodeURIComponent(this.searchData.localComName)
        }
        this.Result(formData)
        this.hrefExcel = this.api.gsgl.excel + this.toHash(formData.params) // 调用json转换成字符串连接hash函数
      },
      handleCurrentChange (val) {
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          localComName: encodeURIComponent(this.searchData.localComName),
          pageNum: val
        }
        this.Result(formData)
        console.log('当前第' + val + '页')
      },
      reset () { // 清空搜索数据
        this.searchData.localComName = ''
      },
      tableAdd () { // 新增
        this.dialog.title = '新增公司'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.localComName = row.localComName === undefined ? '' : row.localComName
        this.ruleForm.localComCode = row.localComCode === undefined ? '' : row.localComCode
        this.ruleForm.localComAddress = row.localComAddress === undefined ? '' : row.localComAddress
        this.ruleForm.localComParentCode = row.localComParentCode === undefined ? '' : row.localComParentCode
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.gsgl.delete, {
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
            let that = this
            let localComName = that.ruleForm.localComName
            let localComCode = that.ruleForm.localComCode
            let localComAddress = that.ruleForm.localComAddress
            let localComParentCode = that.ruleForm.localComParentCode
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.gsgl.update, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    id: that.tableRowData.id,
                    localComName: encodeURIComponent(localComName),
                    localComCode: encodeURIComponent(localComCode),
                    localComAddress: encodeURIComponent(localComAddress),
                    localComParentCode: encodeURIComponent(localComParentCode)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].localComName = localComName
                    that.tableData[that.indexEdit].localComCode = localComCode
                    that.tableData[that.indexEdit].localComAddress = localComAddress
                    that.tableData[that.indexEdit].localComParentCode = localComParentCode
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
                that.$axios.get(that.api.gsgl.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    localComName: encodeURIComponent(localComName),
                    localComCode: encodeURIComponent(localComCode),
                    localComAddress: encodeURIComponent(localComAddress),
                    localComParentCode: encodeURIComponent(localComParentCode)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    if (that.tableData.length < 10) {
                      that.tableData.unshift(data)
                    } else {
                      that.tableData.splice(9, 1)
                      that.tableData.unshift(data)
                    }
                    that.$message({type: 'success', message: '新增成功'})
                  } else if (res.data.msg.code === '40001') { // 新增出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
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
        this.ruleForm.localComName = ''
        this.ruleForm.localComCode = ''
        this.ruleForm.localComAddress = ''
        this.ruleForm.localComParentCode = ''
      }
    }
  }
</script>
