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
                <el-input v-model="searchData.firms" placeholder="厂商" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增机具</el-button>
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

    </div>

    <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" @close="closeDialog('ruleForm')">
      <div class="item-dialog">
        <div class="item-dialog-underline"></div>
        <div class="item-dialog-form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
            <el-form-item label="厂商" prop="firms">
              <el-input v-model="ruleForm.firms"></el-input>
            </el-form-item>
            <el-form-item label="型号" prop="model">
              <el-input v-model="ruleForm.model"></el-input>
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
    name: 'jjcsgl',
    data () {
      return {
        searchData: { // 搜索数据
          firms: ''
        },
        table: [ // 表格展示数据
          { label: '厂商', name: 'firms' },
          { label: '公司名称', name: 'companyName' },
          { label: '型号', name: 'model' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 表格编辑行数据
        ruleForm: {firms: '', model: ''}, // 表单数据
        rules: { // 表单规则
          firms: [
            { required: true, message: '请输入厂商', toggle: 'blur' },
            { min: 2, max: 25, message: '长度在2-25之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('只能输入中文字母数字符号只能使用_-/'))
              } else {
                callback()
              }
            } }
          ],
          model: [
            { required: true, message: '请输入型号', toggle: 'blur' },
            { min: 2, max: 50, message: '长度在2-50之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('只能输入中文字母数字符号只能使用_-/'))
              } else {
                callback()
              }
            } }
          ]
        },
        dialog: { // 弹窗
          title: '', hidden: false, position: 'left'
        },
        indexEdit: 0 // 编辑行index
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '机具录入', small: '机具厂商管理' })
    },
    methods: {
      Result (formName) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.jjcsgl.result, formName || {})
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
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('setLoading', false)
          this.$store.commit('clearPage')
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
        })
      },
      search () { // 搜索
        let formData = {}
        formData.params = {firms: encodeURIComponent(this.searchData.firms)}
        this.Result(formData)
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {firms: encodeURIComponent(this.searchData.firms), pageNum: val}
        this.Result(formData)
      },
      reset () { // 清空搜索数据
        this.searchData.firms = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增机具'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.firms = row.firms === undefined ? '' : row.firms
        this.ruleForm.model = row.model === undefined ? '' : row.model
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.jjcsgl.delete, {
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
            let firms = that.ruleForm.firms
            let model = that.ruleForm.model
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              this.$store.commit('setLoading', true)
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.jjcsgl.update, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    id: that.tableRowData.id,
                    firms: encodeURIComponent(firms),
                    model: encodeURIComponent(model)
                  }
                }).then((res) => {
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].firms = firms
                    that.tableData[that.indexEdit].model = model
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => {
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错'})
                })
              } else { // 如果是新增
                that.$axios.get(that.api.jjcsgl.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    firms: encodeURIComponent(firms),
                    model: encodeURIComponent(model)
                  }
                }).then((res) => {
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
                  } else { // 新增失败
                    that.$message({type: 'error', message: '新增失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => {
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错'})
                })
              }
              that.dialog.hidden = false
            }).catch(() => {})
          } else {
            console.log('error')
          }
        })
      },
      closeDialog (formName) {
        this.$refs[formName].resetFields()
        this.ruleForm.firms = ''
        this.ruleForm.model = ''
      }
    }
  }
</script>
