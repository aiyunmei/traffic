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
                <el-input placeholder="账号" v-model.trim="searchData.loginName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增账号</el-button>
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

      <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" class="item-dialog" @close="closeDialog('ruleForm')">
        <div class="item-dialog-form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="120px">
            <el-form-item label="账号" prop="loginName" v-if="dialog.title === '编辑' ? false : true">
              <el-input v-model="ruleForm.loginName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input v-model="ruleForm.password" type="password"></el-input>
            </el-form-item>
            <el-form-item label="角色" prop="roleId">
              <el-select v-model="ruleForm.roleId" clearable placeholder="请选择" style="margin-right: 10px;">
                <el-option v-for="item in roleOptions" :label="item.name" :value="item.id" :key="item.id"></el-option>
              </el-select>
              <el-button type="primary" @click="toRole" icon="edit" style="position: absolute;">新建角色</el-button>
            </el-form-item>
            <el-form-item label="状态" prop="isUsed">
              <el-radio-group v-model="ruleForm.isUsed">
                <el-radio-button label="1">启用</el-radio-button>
                <el-radio-button label="0">禁用</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <div class="dialog-submit">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </div>
          </el-form>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import getRoleName from './js/getRoleName'
  export default {
    name: 'zhqx',
    data () {
      return {
        searchData: { // 搜索数据
          loginName: ''
        },
        table: [ // 表格展示
          { label: '账号', name: 'loginName' },
          { label: '角色', name: 'name' },
          { label: '状态', name: 'isUsedName' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        roleOptions: [], // 角色选择数据
        ruleForm: { // 表单数据
          loginName: '',
          password: '',
          roleId: '',
          isUsed: ''
        },
        rules: { // 表单规则
          loginName: [
            { required: true, message: '请输入账号', toggle: 'blur' },
            { min: 4, max: 30, message: '长度在4-30位' },
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
          password: [
            { required: true, message: '请输入密码', toggle: 'blur' },
            { min: 4, max: 20, message: '长度在4-20位' }
          ],
          roleId: [
            { required: true, message: '请选择角色', toggle: 'blur' }
          ],
          isUsed: [
            { required: true, message: '请设置状态', toggle: 'blur' }
          ]
        },
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        indexEdit: 0 // 表格行index
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.setRoleOptions()
      this.$store.commit('setTableTitle', { big: '系统管理', small: '账号管理' })
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.zhgl.result, formData || {})
        .then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') {
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let isUsed = data[i].isUsed
              res.data.data[i].isUsedName = this.getStatus(isUsed) // 全局转换
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: res.data.msg.message})
          } else {
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
      setRoleOptions () {
        this.$axios.get(this.api.zhgl.getRoleOptions, {params: {companyId: localStorage.getItem('companyId')}})
        .then((res) => {
          if (res.data.msg.code === '20000') {
            for (let i = 0; i < res.data.data.length; i++) {
              res.data.data[i].id = res.data.data[i].id.toString()
            }
            this.roleOptions = res.data.data
          }
        })
      },
      search () { // 搜索
        let formData = {}
        formData.params = {loginName: encodeURIComponent(this.searchData.loginName), companyId: localStorage.getItem('companyId')}
        this.Result(formData)
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {loginName: encodeURIComponent(this.searchData.loginName), companyId: localStorage.getItem('companyId'), pageNum: val}
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.loginName = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增账号'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        console.log(row)
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.password = row.password === undefined ? '' : row.password
        this.ruleForm.roleId = row.roleId === undefined ? '' : row.roleId.toString()
        this.ruleForm.isUsed = row.isUsed === undefined ? '' : row.isUsed.toString()
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这个账号, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.zhgl.delete, {params: {id: row.id, userId: row.userId}})
          .then((res) => {
            if (res.data.msg.code === '20000') {
              that.$message({type: 'success', message: '删除成功'})
              that.tableData.splice(index, 1)
            } else if (res.data.msg.code === '40001') {
              that.$message({type: 'error', message: res.data.msg.message})
            } else {
              that.$message({type: 'error', message: '删除失败'})
            }
            that.$store.commit('setLoading', false)
          }).catch((err) => {
            console.log(err)
            that.$store.commit('setLoading', false)
            that.$message({type: 'error', message: '网络出错'})
          })
        }).catch(() => {})
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            let password = that.ruleForm.password
            let roleId = that.ruleForm.roleId
            let isUsed = that.ruleForm.isUsed
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.zhgl.update, {
                  params: {
                    id: that.tableRowData.id,
                    userId: that.tableRowData.userId,
                    companyId: localStorage.getItem('companyId'),
                    modifier: localStorage.getItem('accountId'),
                    password: encodeURIComponent(password),
                    roleId: roleId,
                    isUsed: isUsed
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].password = password
                    that.tableData[that.indexEdit].isUsed = isUsed
                    that.tableData[that.indexEdit].isUsedName = that.getStatus(isUsed) // 全局转换
                    that.tableData[that.indexEdit].roleId = roleId
                    that.tableData[that.indexEdit].name = getRoleName(roleId, that.roleOptions) // 调用更具id获取角色名字
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
                  that.$message({type: 'error', message: '网络出错，请刷新试试'})
                })
              } else { // 如果是新增
                let loginName = that.ruleForm.loginName
                that.$axios.get(that.api.zhgl.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    creater: localStorage.getItem('accountId'),
                    loginName: encodeURIComponent(loginName),
                    password: encodeURIComponent(password),
                    roleId: roleId,
                    isUsed: isUsed
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let data = res.data.data
                    let id = res.data.id
                    let userId = res.data.userId
                    res.data.data.id = id
                    res.data.data.roleId = roleId
                    res.data.data.userId = userId
                    res.data.data.isUsedName = that.getStatus(isUsed) // 全局转换
                    res.data.data.name = getRoleName(roleId, that.roleOptions) // 调用更具id获取角色名字
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
            })
            .catch(() => {})
          } else {
            console.log('error')
          }
        })
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.loginName = ''
        this.ruleForm.password = ''
        this.ruleForm.roleId = ''
        this.ruleForm.isUsed = ''
      },
      toRole () { // 去新增角色
        this.dialog.hidden = false
        this.$router.push('/jsgl')
      }
    }
  }
</script>
