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
                <el-input placeholder="规则名称" v-model.trim="searchData.transferRuleName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新建规则</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column  v-for="(item,index) in table" :label="item.label" :key="index" :width="item.name === 'rules' ?  400 : ''">
            <template scope="scope">
              <span title="拉伸边框可查看所有规则" v-if="item.name === 'rules'">
                <!--<span v-for="(rule, index) in scope.row.rules">{{ '规则' + (index+ 1) + '：' + parseFloat(rule.price) / 100 + '元&nbsp;&nbsp;'  }}</span>-->
                <span v-for="(rule, key) in JSON.parse(scope.row.rules)">{{ '第' + (parseFloat(key)) + '次:' + rule.price + '分&nbsp;&nbsp;' }}</span>
              </span>
              <span :title="scope.row[item.name]" v-else>{{ scope.row[item.name] }}</span>
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
              <el-form-item label="规则名称" prop="ruleName">
                <el-input v-model="ruleForm.ruleName"></el-input>
              </el-form-item>
              <el-form-item v-for="(item, index) in ruleForm.rules" :label="'换乘规则'+ (index + 1) + '(分)'" :prop="'rules.' + index + '.price'" :key="index"
              :rules="[{ required: true, message: '请输入规则票价', toggle: 'blur' }, { min: 1, max: 5, message: '长度在1-5之间' }]">
                <el-input v-model="item.price" style="width:70%;"></el-input>
                <el-button @click="removeRule(item)" style="width: 25%;position: relative;top: -1px;">删除</el-button>
              </el-form-item>
              <div class="dialog-submit">
                <el-button @click="addRule">规则新增</el-button>
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
  import changePriceType from './js/changePriceType'
  import qs from 'qs'
  export default {
    name: 'gzlr',
    data () {
      return {
        searchData: { // 搜索内容
          transferRuleName: ''
        },
        table: [ // 表格展示
          { label: '规则名称', name: 'name' },
          { label: '规则', name: 'rules' },
          { label: '规则个数', name: 'times' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        ruleForm: { // 表单数据
          ruleName: '',
          rules: []
        },
        rules: { // 表单规则
          ruleName: [
            { required: true, message: '请输入规则名称', toggle: 'blur' },
            { min: 2, max: 25, message: '长度在2-25之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
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
        indexEdit: 0 // 编辑行index
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '换乘优惠管理', small: '基础规则录入' })
    },
    methods: {
      Result (formData) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.gzlr.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') {
            let data = res.data.data.transferRuleList
            let page = res.data.data.page
            if (data.length === 0) {
              this.$message({type: 'error', message: '没有查询到数据'})
            }
            this.tableData = data
            this.$store.commit('setPage', page)
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
      search () {
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          transferRuleName: encodeURIComponent(this.searchData.transferRuleName)
        }
        this.Result(formData)
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          transferRuleName: encodeURIComponent(this.searchData.transferRuleName),
          pageNum: val
        }
        this.Result(formData)
      },
      reset () {
        this.searchData.transferRuleName = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新建规则'
        this.dialog.hidden = true
        this.ruleForm.rules = [{price: ''}]
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) { // 通过
            let ruleName = that.ruleForm.ruleName
            let rules = that.ruleForm.rules
            for (let i = 0; i < rules.length; i++) { // 遍历校验
              if (that.va.number.test(rules[i].price) === false) {
                that.$message({type: 'error', message: '票价必须为整数'})
                return false
              }
              if (parseFloat(rules[i].price) > 1000) { // 换乘金额限定10元内
                that.$message({type: 'error', message: '票价金额不能超过1000分'})
                return false
              }
            }
            that.$confirm('提交成功规则无法删除修改，是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              let params = {
                companyId: localStorage.getItem('companyId'),
                transferRuleName: encodeURIComponent(ruleName),
                transferRuleTimes: rules.length,
                transferRuleRules: JSON.stringify(changePriceType(rules))
              }
              that.$axios.post(that.api.gzlr.add, qs.stringify(params)).then((res) => {
                console.log(res.data)
                if (res.data.msg.code === '20000') { // 成功
                  let obj = {name: decodeURI(params.transferRuleName), times: rules.length, rules: params.transferRuleRules, createTime: that.updateTime(new Date())}
                  if (that.tableData.length < 10) {
                    that.tableData.unshift(obj)
                  } else {
                    that.tableData.splice(9, 1)
                    that.tableData.unshift(obj)
                  }
                  that.$message({type: 'success', message: '新增成功'})
                } else if (res.data.msg.code === '40001') {
                  that.$message({type: 'error', message: res.data.msg.message})
                } else { // 失败
                  that.$message({type: 'error', message: '新增失败'})
                }
                that.$store.commit('setLoading', false)
              }).catch((err) => {
                console.log(err)
                that.$store.commit('setLoading', false)
                that.$message({type: 'error', message: '网络出错，请重试'})
              })
              this.dialog.hidden = false
            }).catch(() => {})
          } else { // 未通过
            console.log('error')
          }
        })
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.ruleName = ''
        this.ruleForm.isUsed = ''
        this.ruleForm.rules = []
      },
      addRule () { // 新增规则
        if (this.ruleForm.rules.length === 4) {
          this.$message({type: 'error', message: '换乘不能超过4条'})
          return false
        }
        this.ruleForm.rules.push({price: ''})
      },
      removeRule (data) { // 删除规则
        if (this.ruleForm.rules.length === 1) {
          this.$message({type: 'error', message: '换乘规则至少需要一条'})
          return false
        }
        let index = this.ruleForm.rules.indexOf(data)
        if (index !== -1) {
          this.ruleForm.rules.splice(index, 1)
        }
      }
    }
  }
</script>
