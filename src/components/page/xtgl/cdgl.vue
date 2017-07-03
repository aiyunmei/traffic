<template>
  <div class="item" v-loading.fullscreen.lock="this.$store.state.loading">

    <div class="item-table">

      <div class="item-table-title">
        <h2>{{ this.$store.state.tableTitle.big }}<span>{{ this.$store.state.tableTitle.small }}</span></h2>
        <div class="item-table-add">
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增菜单</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData">
          <!--下拉-->
          <el-table-column type="expand">
            <template scope="scope">
              <el-table :data="scope.row.moduleItems" :show-header="false" border>
                <el-table-column v-for="(item,index) in table" :key="index">
                  <template scope="scope">
                    <span :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                  <template scope="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row, 'cRow')">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, 'cRow')">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <!--下拉-->
          <!--一级标题-->
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name] === undefined ? '无数据' : scope.row[item.name]">{{ scope.row[item.name] === undefined ? '无数据' : scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <!--一级标题-->
          <el-table-column label="操作" width="120">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row, 'fRow')">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row, 'fRow')">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" @close="closeDialog('ruleForm')">
        <div class="item-dialog">
          <div class="item-dialog-underline"></div>
          <div class="item-dialog-form">
            <el-form ref="ruleForm" :model="ruleForm" :rules="rules" :label-position="dialog.position" label-width="20%">
              <el-form-item label="菜单类型" prop="moduleType" v-if="dialog.title === '编辑' ? false : true">
                <el-radio-group v-model="ruleForm.moduleType">
                  <el-radio-button label="1">新增一级菜单</el-radio-button>
                  <el-radio-button label="2">新增二级菜单</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="菜单名称" prop="moduleName">
                <el-input v-model="ruleForm.moduleName"></el-input>
              </el-form-item>
              <el-form-item label="插入位置" prop="moduleRole" v-if="moduleRoleHidden">
                <el-select v-model="ruleForm.moduleRole" clearable placeholder="请选择">
                  <el-option v-for="item in tableData" :key="item.moduleName" :label="item.moduleName" :value="item.id.toString()"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="Path地址" prop="modulePath" v-if="moduleRoleHidden">
                <el-input v-model="ruleForm.modulePath"></el-input>
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
    name: 'cdgl',
    data () {
      return {
        table: [ // 表格展示
          { label: '菜单名称', name: 'moduleName' },
          { label: '路由', name: 'modulePath' },
          { label: 'Id', name: 'id' },
          { label: 'parentId', name: 'parentId' }
        ],
        tableData: JSON.parse(localStorage.getItem('routerData')), // 表格数据
        tableRowData: {}, // 编辑表格行数据
        ruleForm: { // 表单数据
          moduleName: '',
          moduleType: '',
          moduleRole: '',
          modulePath: '',
          id: 0
        },
        rules: { // 表单规则
          moduleName: [
            { required: true, message: '请输入菜单名称', toggle: 'blur' },
            { min: 2, max: 10, message: '长度在2-10位' },
            { validator: (rule, val, callback) => {
              if (this.va.allpattern.test(val) === false) {
                return callback(new Error('不得使用非法字符'))
              } else {
                callback()
              }
            } }
          ],
          moduleType: [
            { required: true, message: '选择菜单类型', toggle: 'blur' }
          ],
          moduleRole: [
            { required: true, message: '请选择如要插入的一级菜单', toggle: 'blur' }
          ],
          modulePath: [
            { required: true, message: '请输入Path地址', toggle: 'blur' },
            { min: 2, max: 10, message: '长度在2-10位' },
            { validator: (rule, val, callback) => {
              if (this.va.pattern.test(val) === false) {
                return callback(new Error('不得使用非法字符'))
              } else {
                callback()
              }
            } }
          ]
        },
        moduleRoleHidden: false, // 一级二级切换
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        indexEdit: 0 // 编辑行index
      }
    },
    computed: {
      moduleType () { // 一级二级新增切换
        return this.ruleForm.moduleType
      }
    },
    created () {
      this.$store.commit('setTableTitle', { big: '系统管理', small: '菜单管理' })
    },
    methods: {
      handleEdit (index, row, status) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        let moduleName = row.moduleName
        this.ruleForm.moduleName = moduleName
        this.ruleForm.id = row.id
      },
      handleDelete (index, row, status) { // 删除
        this.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          this.$store.commit('setLoading', true)
          if (status === 'fRow') { // 如果是删除一级菜单
            this.$axios.get(this.api.cdgl.delete, {params: {id: row.id, companyId: localStorage.getItem('companyId')}})
            .then((res) => {
              if (res.data.msg.code === '20000') { // 删除一级菜单成功
                this.tableData.splice(index, 1)
                this.$message({type: 'success', message: '删除成功'})
              } else if (res.data.msg.code === '40001') { // 删除一级菜单出错
                this.$message({type: 'error', message: res.data.msg.code})
              } else { // 删除一级菜单失败
                this.$message({type: 'error', message: '删除失败'})
              }
              this.$store.commit('setLoading', false)
            }).catch((err) => { // 删除一级菜单网络出错
              console.log(err)
              this.$store.commit('setLoading', false)
              this.$message({type: 'error', message: '网络出错'})
            })
          } else { // 如果删除某一个子菜单
            let data = this.tableData
            let parentId = row.parentId
            let cindex = index
            let findex = ''
            for (let i = 0; i < data.length; i++) {
              let id = data[i].id
              if (parseFloat(parentId) === id) {
                findex = i
                break
              }
            }
            this.$axios.get(this.api.cdgl.delete, {params: {id: row.id, companyId: localStorage.getItem('companyId')}})
            .then((res) => {
              if (res.data.msg.code === '20000') { // 删除二级级菜单成功
                this.tableData[findex].moduleItems.splice(cindex, 1)
                this.$message({type: 'success', message: '删除成功'})
              } else if (res.data.msg.code === '40001') { // 删除二级级菜单出错
                this.$message({type: 'error', message: res.data.msg.code})
              } else { // 删除二级级菜单失败
                this.$message({type: 'error', message: '删除失败'})
              }
              this.$store.commit('setLoading', false)
            }).catch((err) => { // 删除二级级网络出错
              console.log(err)
              this.$store.commit('setLoading', false)
              this.$message({type: 'error', message: '网络出错'})
            })
          }
        }).catch(() => {})
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增菜单'
        this.dialog.hidden = true
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              let id = that.ruleForm.id
              let moduleName = that.ruleForm.moduleName
              let moduleRole = that.ruleForm.moduleRole
              let modulePath = that.ruleForm.modulePath
              let moduleType = that.ruleForm.moduleType
              that.$store.commit('setLoading', true)
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.cdgl.update, {params: {id: id, moduleName: encodeURIComponent(moduleName)}})
                .then((res) => {
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.$message({type: 'success', message: '编辑成功，请重新登陆刷新缓存'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 编辑网络出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                })
              } else {
                let formData = {}
                if (moduleType === '1') { // 新增一级菜单
                  formData['params'] = {
                    companyId: localStorage.getItem('companyId'),
                    moduleName: encodeURIComponent(moduleName)
                  }
                } else {
                  formData['params'] = { // 新增二级菜单
                    companyId: localStorage.getItem('companyId'),
                    moduleName: encodeURIComponent(moduleName),
                    parentId: moduleRole,
                    modulePath: modulePath
                  }
                }
                that.$axios.get(this.api.cdgl.add, formData).then((res) => {
                  if (res.data.msg.code === '20000') { // 新增成功
                    that.$message({type: 'success', message: '新增成功，请重新登陆刷新缓存'})
                  } else if (res.data.msg.code === '40001') { // 新增出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 新增失败
                    that.$message({type: 'error', message: '新增失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 新增网络出错
                  console.log(err)
                  that.$message({type: 'error', message: '网络出错'})
                  that.$store.commit('setLoading', false)
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
        this.ruleForm.moduleName = ''
        this.ruleForm.moduleType = ''
        this.ruleForm.moduleRole = ''
        this.ruleForm.modulePath = ''
      }
    },
    watch: {
      moduleType: function (nvl, ovl) { // 监听一级二级切换
        if (nvl === '2') {
          this.moduleRoleHidden = true
        } else {
          this.moduleRoleHidden = false
        }
      }
    }
  }
</script>
