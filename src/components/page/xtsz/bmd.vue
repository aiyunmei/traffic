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
                <el-input placeholder="userId" v-model.trim="searchData.userId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="账号名" v-model.trim="searchData.userName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3" v-if="false">
                <el-select v-model="searchData.status" clearable placeholder="状态" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.status" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3" v-if="false">
                <el-select v-model="searchData.type" clearable placeholder="接入方" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.join" :label="item.label" :value="item.value" :key="index"></el-option>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增成员</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class="item-table-cc" width="100">
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
            <el-form-item label="userId" prop="userId">
              <el-input v-model="ruleForm.userId"></el-input>
            </el-form-item>
            <el-form-item label="账号名" prop="userName">
              <el-input v-model="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="票价(分)" prop="price">
              <el-input v-model="ruleForm.price"></el-input>
            </el-form-item>
            <el-form-item label="接入方" prop="type" v-if="false">
              <el-select v-model="ruleForm.type" clearable placeholder="接入方" class="item-search-input-l">
                <el-option v-for="(item,index) in this.$store.state.join" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-radio-group v-model="ruleForm.status">
                <el-radio-button label="1">启用</el-radio-button>
                <el-radio-button label="0">禁用</el-radio-button>
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
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'bmd',
    data () {
      return {
        searchData: { // 搜索数据
          userId: '',
          userName: '',
          status: '',
          type: ''
        },
        table: [ // 表格展示
          { label: 'userId', name: 'userId' },
          { label: '账号名', name: 'userName' },
          { label: '票价(分)', name: 'price' },
          // { label: '接入方', name: 'type' },
          { label: '状态', name: 'statusName' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        ruleForm: { // 表单数据
          userId: '',
          userName: '',
          price: '',
          type: '',
          status: ''
        },
        rules: { // 表单规则
          userId: [
            { required: true, message: '请输入userId', toggle: 'blur' },
            { min: 5, max: 50, message: '长度在5-50之间' },
            { validator: (rule, val, callback) => {
              if (this.va.string.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          userName: [
            { required: true, message: '请输入账号名', toggle: 'blur' },
            { min: 1, max: 30, message: '长度在1-30之间' }
          ],
          price: [
            { required: true, message: '请输入票价', toggle: 'blur' },
            { min: 1, max: 5, message: '长度在1-5之间' },
            { validator: (rule, val, callback) => {
              if (this.va.number.test(val) === false) {
                return callback(new Error('请输入整数'))
              } else {
                callback()
              }
            } }
          ],
          type: [
            { required: true, message: '请选择接入方', toggle: 'blur' }
          ],
          status: [
            { required: true, message: '请选择状态', toggle: 'blur' }
          ]
        },
        indexEdit: 0 // 表格编辑行index
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '系统设置', small: '白名单' })
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.bmd.result, formData || {})
        .then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            for (let i = 0; i < data.length; i++) {
              let status = data[i].status
              res.data.data[i].statusName = this.getStatus(status) // 全局转换
            }
            this.tableData = data
            let page = res.data.page
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.$store.commit('clearPage')
            this.tableData = []
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 失败
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '网络出错，请刷新试试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {  // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
        })
      },
      search () { // 搜索
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            userId: encodeURIComponent(this.searchData.userId),
            userName: encodeURIComponent(this.searchData.userName),
            status: parseFloat(this.searchData.status),
            type: encodeURIComponent(this.searchData.type)
          }
        })
      },
      handleCurrentChange (val) { // 分页
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            userId: encodeURIComponent(this.searchData.userId),
            userName: encodeURIComponent(this.searchData.userName),
            status: parseFloat(this.searchData.status),
            type: encodeURIComponent(this.searchData.type),
            pageNum: val
          }
        })
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.userId = ''
        this.searchData.userName = ''
        this.searchData.status = ''
        this.searchData.type = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增录入'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.userId = row.userId === undefined ? '' : row.userId
        this.ruleForm.userName = row.userName === undefined ? '' : row.userName
        this.ruleForm.status = row.status === undefined ? '' : row.status.toString()
        this.ruleForm.type = row.type === undefined ? '' : row.type
        this.ruleForm.price = row.price === undefined ? '' : row.price.toString()
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.bmd.delete, {params: {id: row.id}}).then((res) => {
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
              let userId = that.ruleForm.userId
              let userName = that.ruleForm.userName
              let price = that.ruleForm.price
              // let type = that.ruleForm.type
              let status = that.ruleForm.status
              if (that.dialog.title === '编辑') { // 编辑
                that.$axios.get(that.api.bmd.update, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    id: that.tableRowData.id,
                    userId: encodeURIComponent(userId),
                    userName: encodeURIComponent(userName),
                    price: price,
                    status: parseFloat(status)
                    // type: encodeURIComponent(type)
                  }
                }).then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.tableData[that.indexEdit].userId = userId
                    that.tableData[that.indexEdit].userName = userName
                    that.tableData[that.indexEdit].price = price.toString()
                    // that.tableData[that.indexEdit].type = type
                    that.tableData[that.indexEdit].status = status
                    that.tableData[that.indexEdit].statusName = that.getStatus(status) // 全局转换
                    that.$message({type: 'success', message: '编辑成功'})
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑失败
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => {
                  console.log(err)
                  that.$message({type: 'error', message: '网络出错，新刷新试试'})
                  that.$store.commit('setLoading', false)
                })
              } else { // 新增
                that.$axios.get(that.api.bmd.add, {
                  params: {
                    companyId: localStorage.getItem('companyId'),
                    userId: encodeURIComponent(userId),
                    userName: encodeURIComponent(userName),
                    price: price,
                    status: parseFloat(status)
                    // type: encodeURIComponent(type)
                  }
                })
                .then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    let data = res.data.data
                    let id = res.data.id
                    res.data.data.id = id
                    res.data.data.price = price.toString()
                    res.data.data.statusName = that.getStatus(status) // 全局转换
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
                    that.$message({type: 'error', message: '网络出错，请刷新试试'})
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
            console.log('err')
          }
        })
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.userId = ''
        this.ruleForm.userName = ''
        this.ruleForm.status = ''
        this.ruleForm.price = ''
      }
    }
  }
</script>
