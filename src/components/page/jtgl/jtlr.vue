<template>
  <div class="item" v-loading.fullscreen.lock="this.$store.state.loading">

    <!--<div class="item-search">
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
    </div>-->

    <div class="item-table">

      <div class="item-table-title">
        <h2>{{ this.$store.state.tableTitle.big }}<span>{{ this.$store.state.tableTitle.small }}</span></h2>
        <div class="item-table-add">
          <!--<el-button type="primary" icon="upload" v-on:click="uploadExcel">上传Excel数据</el-button>-->
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增</el-button>
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
              <!--<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--<div class="item-pagination">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="this.$store.state.page.pageNum"
            :page-size="this.$store.state.page.pageSize"
            layout="prev, pager, next, jumper, total"
            :total="this.$store.state.page.total">
          </el-pagination>
        </div>-->

      </div>

      <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" @close="closeDialog('ruleForm')">
        <div class="item-dialog">
          <div class="item-dialog-underline"></div>
          <div class="item-dialog-form">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
              <el-form-item label="票价是否相同" prop="boolean" v-if="dialog.title === '编辑' ? false : true">
                <el-switch v-model="ruleForm.boolean" on-text="是" off-text="否"></el-switch>
              </el-form-item>
              <el-form-item label="起始站" prop="startStation">
                <el-input v-model="ruleForm.startStation"></el-input>
              </el-form-item>
              <el-form-item label="目标站" prop="endStation">
                <el-input v-model="ruleForm.endStation"></el-input>
              </el-form-item>
              <el-form-item :label="ruleForm.boolean === true ? '票价(分)' : '正向票价(分)'" prop="price1">
                <el-input v-model="ruleForm.price1"></el-input>
              </el-form-item>
              <el-form-item label="逆向票价(分)" prop="price2" v-if="ruleForm.boolean === true ? false : true">
                <el-input v-model="ruleForm.price2"></el-input>
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
    components: { excelupload },
    data () {
      return {
        searchData: {
          lineShort: ''
        },
        table: [
          { label: '起始站', name: 'startStation' },
          { label: '目标战', name: 'endStation' },
          { label: '票价(分)', name: 'price' }
        ],
        tableData: [],
        tableRowData: {},
        ruleForm: {
          boolean: true, startStation: '', endStation: '', price1: '', price2: ''
        },
        rules: {
          startStation: [
            { required: true, message: '请输入起始站', toggle: 'blur' },
            { min: 1, max: 15, message: '长度在1-15之间' }
          ],
          endStation: [
            { required: true, message: '请输入目标站', toggle: 'blur' },
            { min: 1, max: 15, message: '长度在1-15之间' }
          ],
          price1: [
            { required: true, message: '请输入票价', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.number.test(val) === false) {
                return callback(new Error('只能输入整数'))
              } else {
                callback()
              }
            } }
          ],
          price2: [
            { required: true, message: '请输入票价', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.number.test(val) === false) {
                return callback(new Error('只能输入整数'))
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
        indexEdit: 0
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '阶梯收费管理', small: '阶梯收费录入' })
    },
    methods: {
      Result (formData) { // 初始化
        // this.$store.commit('setLoading', true)
        this.$axios.get(this.api.jtlr.result, formData || {}).then((res) => {
          if (res.data.msg.code === '20000') {
            let data = res.data.data
            // let page = res.data.page
            this.tableData = data
            // this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') {
            this.$message({type: 'error', messagge: res.data.msg.message})
            this.tableData = []
            this.$store.commit('clearPage')
          } else {
            this.$message({type: 'error', messagge: '网络出错，请刷新试试'})
            this.$store.commit('clearPage')
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          if (err) throw err
          this.$message({type: 'error', messagge: '网络出错，请刷新试试'})
          this.$store.commit('setLoading', false)
          this.$store.commit('clearPage')
        })
      },
      search () { // 搜索
        const { lineShort } = this.searchData
        console.log(lineShort)
      },
      handleCurrentChange (val) { // 分页
      },
      reset () { // 清空搜索数据
        let data = this.searchData
        data.lineShort = ''
      },
      handleDelete (index, row) {
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.jtlr.delete, {params: {startStation: row.startStation, endStation: row.endStation}}).then((res) => {
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
      handleEdit (index, row) {
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.startStation = row.startStation === undefined ? '' : row.startStation
        this.ruleForm.endStation = row.endStation === undefined ? '' : row.endStation
        this.ruleForm.price1 = row.price === undefined ? '' : row.price.toString()
        this.tableRowData = row
        this.indexEdit = index
      },
      tableAdd () {
        this.dialog.title = '新增'
        this.dialog.hidden = true
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) { // 通过
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              // decodeURI
              const { boolean, startStation, endStation, price1, price2 } = that.ruleForm
              let params1 = {
                startStation: startStation, endStation: endStation, price: price1
              }
              let params2 = {
                startStation: endStation, endStation: startStation, price: price1
              }
              let params3 = {
                startStation: endStation, endStation: startStation, price: price2
              }
              let axios = that.$axios
              let msg = that.$message
              let store = that.$store
              let update = that.api.jtlr.update
              let add = that.api.jtlr.add
              // let row = that.tableRowData
              store.commit('setLoading', true)
              if (that.dialog.title === '编辑') { // 如果是修改
                // params1.id = row.id
                axios.get(update, { params: params1 }).then((res) => {
                  console.log(res)
                  store.commit('setLoading', false)
                }).catch((err) => {
                  if (err) throw err
                  msg({ type: 'error', message: '网络出错' })
                  store.commit('setLoading', false)
                })
              } else { // 如果是新增
                if (boolean === true) { // 如果往返票价相同
                  axios.all([
                    axios.get(add, { params: params1 }),
                    axios.get(add, { params: params2 })
                  ]).then(axios.spread((res1, res2) => {
                    console.log(res1, res2)
                    if (res1.data.msg.code === '20000' && res2.data.msg.code === '20000') {
                      msg({type: 'success', message: '新增成功'})
                      that.tableData.unshift(params1, params2)
                      that.dialog.hidden = false
                    } else {
                      msg({type: 'error', message: '新增失败'})
                    }
                    store.commit('setLoading', false)
                  })).catch((err1, err2) => {
                    console.log(err1, err2)
                    msg({ type: 'error', message: '网络出错' })
                    store.commit('setLoading', false)
                  })
                } else { // 如果不同
                  axios.all([
                    axios.get(add, { params: params1 }),
                    axios.get(add, { params: params3 })
                  ]).then(axios.spread((res1, res2) => {
                    console.log(res1, res2)
                    if (res1.data.msg.code === '20000' && res2.data.msg.code === '20000') {
                      msg({type: 'success', message: '新增成功'})
                      that.tableData.unshift(params1, params3)
                      that.dialog.hidden = false
                    } else {
                      msg({type: 'error', message: '新增失败'})
                    }
                    store.commit('setLoading', false)
                  })).catch((err1, err2) => {
                    console.log(err1, err2)
                    msg({ type: 'error', message: '网络出错' })
                    store.commit('setLoading', false)
                  })
                }
              }
            }).catch(() => {})
          } else { // 未通过
            console.log('error')
          }
        })
      },
      closeDialog (formName) {
        this.$refs[formName].resetFields()
        this.ruleForm.boolean = true
        this.ruleForm.startStation = ''
        this.ruleForm.endStation = ''
        this.ruleForm.price1 = ''
        this.ruleForm.price2 = ''
      },
      uploadExcel () {
        this.excelUpload.src = this.api.jtlr.uploadExcel
        this.excelUpload.fileName = 'importExcel'
        this.$store.commit('setExcelDialogHidden', true)
      }
    }
  }
</script>
