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
                <el-input placeholder="公司地址" v-model.trim="searchData.address" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="6">
                <el-input placeholder="公司名称" v-model.trim="searchData.companyName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="电话" v-model.trim="searchData.telephone" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">新增企业</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column  v-for="(item,index) in table" :label="item.label" :key="index" :width="item.name === 'cardType' ? 250 : ''">
            <template scope="scope">
              <span title="修改卡类型" v-if="item.name === 'cardType'">
                <el-select style="width: 100%;" v-model="scope.row.checkCardType" multiple clearable allow-create placeholder="请选择">
                  <el-option v-for="(item,index) in options" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </span>
              <span v-else-if="item.name === 'account'" :title="scope.row.alipayEnterpriseAccountList[0].account">{{ scope.row.alipayEnterpriseAccountList[0].account }}</span>
              <span v-else-if="item.name === 'user'" :title="scope.row.alipayEnterpriseAccountList[0].user">{{ scope.row.alipayEnterpriseAccountList[0].user }}</span>
              <span v-else-if="item.name === 'gateWay'" :title="scope.row.alipayEnterpriseAccountList[0].gateWay">{{ scope.row.alipayEnterpriseAccountList[0].gateWay }}</span>
              <span v-else-if="item.name === 'appId'" :title="scope.row.alipayEnterpriseAccountList[0].appId">{{ scope.row.alipayEnterpriseAccountList[0].appId }}</span>
              <span v-else-if="item.name === 'privateKey'" :title="scope.row.alipayEnterpriseAccountList[0].privateKey">{{ scope.row.alipayEnterpriseAccountList[0].privateKey }}</span>
              <span v-else :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class="item-table-cc" width="160">
            <template scope="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="mini" @click="updateCardType(scope.$index, scope.row)">修改卡类型</el-button>
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

    </div>

    <el-dialog :title="dialog.title" v-model="dialog.hidden" top="70px" @close="closeDialog('ruleForm')">
      <div class="item-dialog">
        <div class="item-dialog-underline"></div>
        <div class="item-dialog-form">
          <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="dialog.position" label-width="20%">
            <el-form-item label="卡类型" prop="cardType" v-if="this.dialog.title === '新增企业'">
              <el-select style="width: 100%;" v-model="ruleForm.cardType" multiple clearable allow-create placeholder="请选择">
                <el-option v-for="(item,index) in options" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="公司编号" prop="code">
              <el-input v-model="ruleForm.code"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="telephone">
              <el-input v-model="ruleForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="省" prop="province">
              <el-select v-model="ruleForm.province" placeholder="请选择" @change="provinceChange" style="width: 100%;">
                <el-option v-for="(item, index) in provinceOptions" :key="item.index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市" prop="city">
              <el-select v-model="ruleForm.city" placeholder="请选择" @change="cityChange" style="width: 100%;">
                <el-option v-for="(item, index) in cityOptions" :key="item.index" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="区" prop="area">
              <el-select v-model="ruleForm.area" placeholder="请选择" style="width: 100%;">
                <el-option v-for="(item, index) in areaOptions" :key="item.index" :label="item" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="详细地址" prop="address">
              <el-input v-model="ruleForm.address"></el-input>
            </el-form-item>
            <el-form-item label="账号" prop="account">
              <el-input v-model="ruleForm.account"></el-input>
            </el-form-item>
            <el-form-item label="账号名称" prop="user">
              <el-input v-model="ruleForm.user"></el-input>
            </el-form-item>
            <el-form-item label="网关地址" prop="gateWay">
              <el-input v-model="ruleForm.gateWay"></el-input>
            </el-form-item>
            <el-form-item label="appId" prop="appId">
              <el-input v-model="ruleForm.appId"></el-input>
            </el-form-item>
            <el-form-item label="私钥" prop="privateKey">
              <el-input v-model="ruleForm.privateKey"></el-input>
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
  import setRuleForm from './js/setRuleForm'
  import updateCardType from './js/updateCardType'
  import updateRuleFrom from './js/updateRuleForm'
  export default {
    name: 'yygs',
    data () {
      return {
        searchData: { // 搜索数据
          address: '',
          companyName: '',
          telephone: ''
        },
        table: [ // 表格展示
          {label: 'appKey', name: 'appKey'},
          {label: '公司编号', name: 'code'},
          {label: '公司名称', name: 'name'},
          {label: '电话', name: 'telephone'},
          {label: '公司地址', name: 'address'},
          {label: '账号', name: 'account'},
          {label: '卡类型', name: 'cardType'},
          {label: '账号名称', name: 'user'},
          {label: '网关地址', name: 'gateWay'},
          {label: 'appId', name: 'appId'},
          {label: '私钥', name: 'privateKey'},
          {label: '创建时间', name: 'createTime'}
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 编辑行数据
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        ruleForm: { // 表单数据
          cardType: [], // 卡类型
          name: '', // 公司名称
          code: '', // 公司编号
          telephone: '', // 手机
          province: '', // 省份
          city: '', // 城市
          area: '', // 区
          address: '', // 具体地址
          account: '', // 账号
          user: '', // 账号名称
          gateWay: '', // 网管地址
          appId: '', // appId
          privateKey: '' // 私钥
        },
        rules: { // 表单规则
          cardType: [
            { type: 'array', required: true, message: '请选择卡类型', toggle: 'blur' }
          ],
          name: [
            { required: true, message: '请输入公司名称', toggle: 'blur' },
            { min: 2, max: 30, message: '长度在2-30之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          code: [
            { required: true, message: '请选输入公司编号', toggle: 'blur' },
            { min: 2, max: 10, message: '长度在2-10' },
            { validator: (rule, val, callback) => {
              if (this.va.number.test(val) === false) {
                return callback(new Error('必须为数字'))
              } else {
                callback()
              }
            } }
          ],
          telephone: [
            { required: true, message: '请选输入手机号', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.telephone.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          province: [
            { required: true, message: '请选择省份', toggle: 'blur' }
          ],
          city: [
            { required: true, message: '请选择城市', toggle: 'blur' }
          ],
          area: [
            { required: true, message: '请选择区', toggle: 'blur' }
          ],
          address: [
            { required: true, message: '请输入详细地址', toggle: 'blur' },
            { min: 2, max: 50, message: '长度在2-50之间' },
            { validator: (rule, val, callback) => {
              if (this.va.cnPattern.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          gateWay: [
            { required: true, message: '请输入网关地址', toggle: 'blur' },
            { validator: (rule, val, callback) => {
              if (this.va.url.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          appId: [
            { required: true, message: '请输入appId', toggle: 'blur' },
            { min: 2, max: 50, message: '长度在2-50之间' },
            { validator: (rule, val, callback) => {
              if (this.va.string.test(val) === false) {
                return callback(new Error('格式错误'))
              } else {
                callback()
              }
            } }
          ],
          privateKey: [
            { required: true, message: '请输入私钥', toggle: 'blur' }
          ],
          account: [
            { required: true, message: '请输入账号', toggle: 'blur' }
          ],
          user: [
            { required: true, message: '请输入账号名称', toggle: 'blur' }
          ]
        },
        indexEdit: 0, // 编辑当前索引
        options: [
          { label: 'ANT00001', value: 'ANT00001' },
          { label: 'T0420100', value: 'T0420100' }
        ],
        cityOptions: [],
        areaOptions: [],
        provinceOptions: [] // 城市数组
      }
    },
    computed: {
      cardType () {
        return this.ruleForm.cardType
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '企业管理', small: '企业接入管理' })
      this.setAddressOptinos()
    },
    methods: {
      Result (formData) { // 页面初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.yygs.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              data[i].checkCardType = []
              for (let j = 0; j < data[i].alipayEnterpriseAccountList.length; j++) {
                data[i].checkCardType.push(data[i].alipayEnterpriseAccountList[j].cardType)
              }
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '未查询到数据'})
          } else { // 失败
            this.$message({type: 'error', message: '网络错误，请刷新页面重试'})
            this.$store.commit('clearPage')
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络错误，请刷新页面重试'})
        })
      },
      setAddressOptinos () { // 获取省市区
        this.$axios.get('static/address.json', {})
        .then((res) => {
          this.provinceOptions = res.data
        })
      },
      search () { // 搜索
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            address: encodeURIComponent(this.searchData.address),
            companyName: encodeURIComponent(this.searchData.companyName),
            telephone: this.searchData.telephone
          }
        })
      },
      handleCurrentChange (val) { // 分页
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            address: encodeURIComponent(this.searchData.address),
            companyName: encodeURIComponent(this.searchData.companyName),
            telephone: this.searchData.telephone,
            pageNum: val
          }
        })
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.address = ''
        this.searchData.companyName = ''
        this.searchData.telephone = ''
      },
      tableAdd (formName) { // 新增
        this.dialog.title = '新增企业'
        this.dialog.hidden = true
      },
      handleEdit (index, row) { // 编辑
        this.dialog.title = '编辑'
        this.dialog.hidden = true
        this.ruleForm.name = row.name || ''
        this.ruleForm.code = row.code || ''
        this.ruleForm.telephone = row.telephone || ''
        this.ruleForm.province = row.province || ''
        this.ruleForm.city = row.city || ''
        this.ruleForm.area = row.area || ''
        this.ruleForm.address = row.address || ''
        this.ruleForm.account = row.alipayEnterpriseAccountList[0].account || ''
        this.ruleForm.user = row.alipayEnterpriseAccountList[0].user || ''
        this.ruleForm.gateWay = row.alipayEnterpriseAccountList[0].gateWay || ''
        this.ruleForm.appId = row.alipayEnterpriseAccountList[0].appId || ''
        this.ruleForm.privateKey = row.alipayEnterpriseAccountList[0].privateKey || ''
        this.tableRowData = row
        this.indexEdit = index
      },
      handleDelete (index, row) { // 删除
        let that = this
        that.$confirm('此操作将删除这条数据, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          that.$store.commit('setLoading', true)
          that.$axios.get(that.api.yygs.delete, {params: {appKey: row.appKey}})
          .then((res) => {
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
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              let data = setRuleForm(that.ruleForm, that.ruleForm.cardType)
              if (that.dialog.title === '编辑') { // 编辑
                that.$axios.get(that.api.yygs.update, {params: {data: updateRuleFrom(that.ruleForm, that.tableRowData), companyId: localStorage.getItem('companyId')}})
                .then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 编辑成功
                    that.$message({type: 'success', message: '编辑成功'})
                    setTimeout(() => {
                      window.location.reload()
                    }, 2000)
                  } else if (res.data.msg.code === '40001') { // 编辑出错
                    that.$message({type: 'error', message: res.data.msg.message})
                  } else { // 编辑出错
                    that.$message({type: 'error', message: '编辑失败'})
                  }
                  that.$store.commit('setLoading', false)
                }).catch((err) => {
                  console.log(err)
                  that.$store.commit('setLoading', false)
                  that.$message({type: 'error', message: '网络出错'})
                })
              } else { // 新增
                that.$axios.get(that.api.yygs.add, {params: {data: JSON.stringify(data), companyId: localStorage.getItem('companyId')}})
                .then((res) => {
                  console.log(res)
                  if (res.data.msg.code === '20000') { // 新增成功
                    that.$message({type: 'success', message: '新增成功'})
                    setTimeout(() => {
                      window.location.reload()
                    }, 2000)
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
      updateCardType (index, row) {
        if (row.checkCardType.length === 0) {
          this.$message({type: 'error', message: '卡类型不能为空'})
          return false
        }
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.yygs.cardType, {
          params: {data: JSON.stringify(updateCardType(row))}
        }).then((res) => {
          if (res.data.msg.code === '20000') { // 成功
            this.$message({type: 'success', message: res.data.msg.message})
            setTimeout(() => {
              window.location.reload()
            }, 2000)
          } else { // 失败
            this.$message({type: 'error', message: res.data.msg.message})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错'})
        })
      },
      closeDialog (formName) { // 关闭弹窗
        this.$refs[formName].resetFields()
        this.ruleForm.cardType = []
        this.ruleForm.name = ''
        this.ruleForm.code = ''
        this.ruleForm.telephone = ''
        this.ruleForm.province = ''
        this.ruleForm.city = ''
        this.ruleForm.area = ''
        this.ruleForm.address = ''
        this.ruleForm.account = ''
        this.ruleForm.user = ''
        this.ruleForm.gateWay = ''
        this.ruleForm.appId = ''
        this.ruleForm.privateKey = ''
      },
      provinceChange (val) { // 省变化
        this.ruleForm.city = ''
        this.ruleForm.area = ''
        console.log(this.cityOptions)
        let data = this.provinceOptions
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === val) {
            this.cityOptions = data[i].city
            break
          }
        }
      },
      cityChange (val) { // 市变化
        this.ruleForm.area = ''
        let data = this.cityOptions
        for (let i = 0; i < data.length; i++) {
          if (data[i].name === val) {
            this.areaOptions = data[i].area
            break
          }
        }
      }
    }
  }
</script>
