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
                <el-input placeholder="角色名" v-model.trim="searchData.name" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增角色</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name]">{{ scope.row[item.name] === undefined ? '/' : scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class="item-table-cc" width="150">
            <template scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" @click="handleSet(scope.$index, scope.row)">设置权限</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

      <!--编辑新增弹窗-->
      <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" class="item-dialog" @close="closeDialog('ruleForm')">
        <div class="item-dialog">
          <div class="item-dialog-underline"></div>
          <div class="item-dialog-form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="120px">
              <el-form-item label="角色名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="备注" prop="description">
                <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="ruleForm.description"></el-input>
              </el-form-item>
              <div class="dialog-submit">
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
              </div>
            </el-form>
          </div>
        </div>
      </el-dialog>
      <!--设置权限弹窗-->
      <el-dialog :title="setDialog.title" v-model="setDialog.hidden" top="70px" class="item-dialog" @close="closesetDialog">
        <div class="item-dialog">
          <div class="item-dialog-underline"></div>
          <div class="item-dialog-title">
            <el-tag type="primary">角色名称：{{ setDialog.setRoleName }}</el-tag>
          </div>
          <div class="item-dialog-form">
            <div class="item-dialog-form-check" v-for="(item,index) in checkData" :key="index">
              <el-checkbox v-model="item.checked" @change="handleCheckAllChange(index)" :disabled="item.disabled">{{ item.moduleName }}</el-checkbox>
              <el-checkbox-group v-model="item.checkVal" @change="handleCheckedChange(index)">
                <el-checkbox v-for="check in item.moduleItems" :label="check.id" :key="check.moduleName" :disabled="item.checked === false ? true : false">{{ check.moduleName }}</el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="dialog-submit">
              <el-button type="primary" @click="submitsetForm">提交</el-button>
            </div>
          </div>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  import chekckFn from './js/checkfn'
  import EACH from './js/role'
  import clearRole from './js/clearRole'
  import getRole from './js/getRole'
  export default {
    name: 'jsgl',
    props: [],
    data () {
      return {
        searchData: { // 搜索数据
          name: ''
        },
        table: [ // 表格展示
          { label: '角色名', name: 'name' },
          { label: '备注', name: 'description' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        ruleForm: { // 表单数据
          roleName: '',
          description: ''
        },
        rules: { // 表格规则
          name: [
            { required: true, message: '请输入角色名称', toggle: 'blur' },
            { min: 2, max: 20, message: '长度在2-20之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cn.test(val) === false) {
                return callback(new Error('格式错误, 必须为中文'))
              } else {
                callback()
              }
            } }
          ],
          description: [
            { max: 40, message: '长度不得超过40位' }
          ]
        },
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        setDialog: { // 权限弹窗
          title: '',
          hidden: false,
          setRoleName: ''
        },
        checkData: [], // 权限列表数据
        indexEdit: 0 // 表格行index
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '系统管理', small: '角色管理' })
      this.checkfn() // 写入权限列表数据
    },
    methods: {
      Result (formData) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.jsgl.result, formData || {})
        .then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 出错
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
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
        })
      },
      checkfn () { // 修改权限列表数据
        let data = JSON.parse(localStorage.getItem('routerData'))
        chekckFn(data) // 调用修改列表函数
        this.checkData = data
        let dialogHidden = this.$route.params.dialogHidden
        if (dialogHidden === 'true') {
          this.dialog.title = '新增角色'
          this.dialog.hidden = true
          this.$router.push('/jsgl')
        }
      },
      search () { // 搜索
        let formData = {}
        formData.params = { name: encodeURIComponent(this.searchData.name), companyId: localStorage.getItem('companyId') }
        this.Result(formData)
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = { name: encodeURIComponent(this.searchData.name), pageNum: val, companyId: localStorage.getItem('companyId') }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.name = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增角色'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.name = row.name === undefined ? '' : row.name
        this.ruleForm.description = row.description === undefined ? '' : row.description
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这个角色, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.jsgl.delete, {
            params: {
              roleId: row.id
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
      handleSet (index, row) { // 权限设置
        this.setDialog.setRoleName = row.name
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.jsgl.getRole, {params: {roleId: row.id, companyId: localStorage.getItem('companyId')}})
        .then((res) => {
          if (res.data.msg.code === '20000') { // 加载权限列表成功
            let data = res.data.data
            EACH(data, this.checkData)
            this.setDialog.title = '权限设置'
            this.setDialog.hidden = true
            this.tableRowData = row // 写入编辑行数据
          } else if (res.data.msg.code === '40001') { // 权限加载列表出错
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 权限列表失败
            this.$message({type: 'error', message: '加载权限列表失败'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 权限列表加载网错出错
          console.log(err)
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
        })
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) { // 通过
            let name = that.ruleForm.name
            let description = that.ruleForm.description
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              if (that.dialog.title === '编辑') { // 如果是编辑
                that.$axios.get(that.api.jsgl.update, {
                  params: {
                    id: that.tableRowData.id,
                    companyId: localStorage.getItem('companyId'),
                    modifier: localStorage.getItem('accountId'),
                    name: encodeURIComponent(name),
                    description: encodeURIComponent(description)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].name = name
                    that.tableData[that.indexEdit].description = description
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 新增出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 编辑网路出错
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错，请刷新试试'})
                })
              } else { // 如果是新增
                that.$axios.get(that.api.jsgl.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    creater: localStorage.getItem('accountId'),
                    name: encodeURIComponent(name),
                    description: encodeURIComponent(description)
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
                  } else { // 新增失败
                    that.$message({type: 'error', message: '新增失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => { // 新增网路出错
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
      submitsetForm () { // 权限列表提交
        this.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          this.$store.commit('setLoading', true)
          let formData = {}
          formData.roleId = this.tableRowData.id
          formData.moduleId = getRole(this.checkData) // 取选中列表函数id
          this.$axios.get(this.api.jsgl.updateRole, {params: {data: JSON.stringify(formData), companyId: localStorage.getItem('companyId')}})
          .then((res) => {
            console.log(res)
            if (res.data.msg.code === '20000') { // 修改成功
              this.$message({type: 'success', message: '修改权限成功'})
            } else if (res.data.msg.code === '40001') { // 修改出错
              this.$message({type: 'error', message: res.data.msg.message})
            } else { // 修改失败
              this.$message({type: 'error', message: '修改失败'})
            }
            this.$store.commit('setLoading', false)
          }).catch((err) => { // 网络出错
            console.log(err)
            this.$store.commit('setLoading', false)
            this.$message({type: 'error', message: '网络出错，请刷新试试'})
          })
          this.setDialog.hidden = false
        })
        .catch(() => {})
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.name = ''
        this.ruleForm.description = ''
      },
      closesetDialog () { // 关闭权限弹窗
        clearRole(this.checkData) // 调用清空权限选择数据函数
      },
      handleCheckAllChange (index) { // 选择父字段 子字段解除
        if (this.checkData[index].checked === false) {
          this.checkData[index].checkVal = []
        }
      },
      handleCheckedChange (index) { // 选择子字段
      }
    }
  }
</script>
