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
                <el-input placeholder="分组" v-model.trim="searchData.carryTab" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="姓名" v-model.trim="searchData.name" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="电话" v-model.trim="searchData.telephone" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="2">
                <el-select v-model="searchData.status" @multiple="true" clearable allow-create placeholder="状态" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in [{value: '1', label: '启用'},{value: '0', label: '禁用'}]" :label="item.label" :value="item.value" :key="index">
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增用户</el-button>
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
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
              <el-form-item label="公司名称" prop="companyName" v-if="false">
                <el-input v-model="ruleForm.companyName"></el-input>
              </el-form-item>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="线路短号" prop="lineShort">
                <el-autocomplete v-model="ruleForm.lineShort" :fetch-suggestions="querySearchAsyncLineShort" style="width:100%;"></el-autocomplete>
              </el-form-item>
              <el-form-item label="分组" prop="carryTab">
                <el-input v-model="ruleForm.carryTab"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio-group v-model="ruleForm.status">
                  <el-radio-button label="1">启用</el-radio-button>
                  <el-radio-button label="0">禁用</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="电话" prop="telephone">
                <el-input v-model="ruleForm.telephone"></el-input>
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
    name: 'lryhgl',
    data () {
      return {
        searchData: { // 搜索数据
          carryTab: '',
          lineShort: '',
          status: '',
          name: '',
          telephone: ''
        },
        table: [ // 表格展示
          { label: '公司名称', name: 'companyName' },
          { label: '姓名', name: 'name' },
          { label: '线路短号', name: 'line' },
          { label: '分组', name: 'carryTab' },
          { label: '状态', name: 'statusName' },
          { label: '电话', name: 'telephone' },
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
          companyName: '',
          name: '',
          lineShort: '',
          carryTab: '',
          status: '',
          telephone: ''
        },
        rules: { // 表单规则
          companyName: [
            { required: true, message: '请输入公司名称', toggle: 'blur' },
            { min: 2, max: 25, message: '长度在2-25之间' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('不得包含特殊符号如：@/.~等'))
              } else {
                callback()
              }
            } }
          ],
          name: [
            { required: true, message: '请输入姓名', toggle: 'blur' },
            { min: 2, max: 8, message: '长度在2-8之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cn.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          lineShort: [
            { required: true, message: '请输入线路短号', toggle: 'blur' },
            { min: 2, max: 10, message: '长度在2-10之间' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('不得包含特殊符号如：@/.~等'))
              } else {
                callback()
              }
            } }
          ],
          carryTab: [
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
          status: [
            { required: true, message: '请选择状态', toggle: 'blur' }
          ],
          telephone: [
            { required: true, message: '请输入电话', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.telephone.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ]
        },
        indexEdit: 0, // 编辑行索引
        timeout: null
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '机具录入', small: '录入用户管理' })
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.lryhgl.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            for (let i = 0; i < data.length; i++) {
              let status = data[i].status
              res.data.data[i].statusName = this.getStatus(status) // 全局转换
            }
            let page = res.data.page
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '没有查询到数据'})
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
            carryTab: encodeURIComponent(this.searchData.carryTab),
            name: encodeURIComponent(this.searchData.name),
            lineShort: encodeURIComponent(this.searchData.lineShort),
            telephone: this.searchData.telephone,
            status: this.searchData.status
          }
        })
      },
      handleCurrentChange (val) { // 分页
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            carryTab: encodeURIComponent(this.searchData.carryTab),
            name: encodeURIComponent(this.searchData.name),
            lineShort: encodeURIComponent(this.searchData.lineShort),
            telephone: this.searchData.telephone,
            status: this.searchData.status,
            pageNum: val
          }
        })
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.carryTab = ''
        this.searchData.lineShort = ''
        this.searchData.telephone = ''
        this.searchData.status = ''
        this.searchData.name = ''
      },
      tableAdd () { // 新增
        this.dialog.title = '新增用户'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.companyName = row.companyName === undefined ? '' : row.companyName
        this.ruleForm.name = row.name === undefined ? '' : row.name
        this.ruleForm.lineShort = row.line === undefined ? '' : row.line
        this.ruleForm.carryTab = row.carryTab === undefined ? '' : row.carryTab
        this.ruleForm.status = row.status === undefined ? '' : row.status
        this.ruleForm.telephone = row.telephone === undefined ? '' : row.telephone
        this.indexEdit = index
        this.tableRowData = row
      },
      handleDelete (index, row) { // 删除
        this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          this.$store.commit('setLoading', true)
          this.$axios.get(this.api.lryhgl.delete, {
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
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              let companyName = that.ruleForm.companyName
              let name = that.ruleForm.name
              let lineShort = that.ruleForm.lineShort
              let carryTab = that.ruleForm.carryTab
              let status = that.ruleForm.status
              let telephone = that.ruleForm.telephone
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(this.api.lryhgl.update, {
                  params: {
                    id: that.tableRowData.id,
                    companyId: localStorage.getItem('companyId'),
                    companyName: encodeURIComponent(companyName),
                    name: encodeURIComponent(name),
                    lineShort: encodeURIComponent(lineShort),
                    carryTab: encodeURIComponent(carryTab),
                    status: status,
                    telephone: telephone
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].companyName = companyName
                    that.tableData[that.indexEdit].name = name
                    that.tableData[that.indexEdit].line = lineShort
                    that.tableData[that.indexEdit].carryTab = carryTab
                    that.tableData[that.indexEdit].status = status
                    that.tableData[that.indexEdit].statusName = that.getStatus(status) // 全局转换
                    that.tableData[that.indexEdit].telephone = telephone
                    console.log(that.tableData[that.indexEdit])
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 编辑网络出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
                })
              } else { // 如果是新增
                that.$axios.get(that.api.lryhgl.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    companyName: encodeURIComponent(companyName),
                    name: encodeURIComponent(name),
                    lineShort: encodeURIComponent(lineShort),
                    carryTab: encodeURIComponent(carryTab),
                    status: status,
                    telephone: telephone
                  }
                }).then((res) => {
                  console.log(res)
                  that.$store.commit('setLoading', false)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let id = res.data.id
                    let data = res.data.data
                    res.data.data.id = id
                    res.data.data.statusName = that.getStatus(data.status) // 全局转换
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
                    that.$message({type: 'error', message: '网络出错，请刷新页面试试'})
                  }
                }).catch((err) => { // 新增网络出错
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
        this.ruleForm.companyName = ''
        this.ruleForm.name = ''
        this.ruleForm.lineShort = ''
        this.ruleForm.carryTab = ''
        this.ruleForm.status = ''
        this.ruleForm.telephone = ''
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
