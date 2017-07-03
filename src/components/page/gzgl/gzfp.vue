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
              <el-col :span="3">
                <el-autocomplete :fetch-suggestions="querySearchAsyncLineShort" placeholder="线路短号(必填)" v-model="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-autocomplete>
              </el-col>
              <el-col :span="3">
                <el-select placeholder="燃油类别(必选)" v-model="searchData.carryFuelType" clearable class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="item in this.$store.state.carryFuelType" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select placeholder="车辆级别(必选)" v-model="searchData.carryLevel" clearable class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="item in this.$store.state.carryLevel" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select placeholder="车辆结构(必选)" v-model="searchData.carryBodyType" clearable class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="item in this.$store.state.carryBodyType" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="设备编号" v-model="searchData.deviceId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="自编号" v-model="searchData.carryNo" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="车牌号" v-model="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
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
          <el-tag type="primary">共搜索到{{ this.$store.state.page.total }}条</el-tag>
          <el-select placeholder="批量选择" v-model="transferRuleId" style="position: relative;top: 2px;">
            <el-option v-for="item in this.$store.state.ruleOptions" :key="item.label" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">提交</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name]">{{ scope.row[item.name] === undefined ? '无数据' : scope.row[item.name] }}</span>
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

  </div>
</template>

<script type="text/ecmascript-6">
  import qs from 'qs'
  export default {
    name: 'gzfp',
    data () {
      return {
        searchData: {
          lineShort: '', carryFuelType: '', carryLevel: '', carryBodyType: '', deviceId: '', carryNo: '', carryCode: ''
        },
        table: [
          { label: '线路短号', name: 'lineShort' },
          { label: '设备编号', name: 'deviceId' },
          { label: '自编号', name: 'carryNo' },
          { label: '车牌号', name: 'carryCode' },
          { label: '线路名称', name: 'lineName' },
          { label: '燃油类型', name: 'carryFuelType' },
          { label: '车辆级别', name: 'carryLevel' },
          { label: '车辆结构', name: 'carryBodyType' }
        ],
        tableData: [], // 表格数据
        transferRuleId: '',
        timeout: null
      }
    },
    created () {
      this.$store.commit('setTableTitle', { big: '换乘优惠管理', small: '规则分配' })
      this.getRuleOptions({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('clearPage')
    },
    methods: {
      Result (formData) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.gzfp.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') {
            let data = res.data.data.deviceList
            let page = res.data.data.page
            if (data.length === 0) {
              this.$message({type: 'error', message: '未查询到数据'})
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else {
            this.$message({type: 'error', message: '搜索失败'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$message({type: 'error', message: '搜索失败'})
          this.$store.commit('setLoading', false)
        })
      },
      getRuleOptions () {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.gzfp.getRuleOptions, {params: {companyId: localStorage.getItem('companyId')}})
        .then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') {
            let data = res.data.data.transferRuleList
            this.$store.commit('setRuleOptions', data)
          } else {
            this.$message({type: 'error', message: '获取基础规则列表失败'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
          this.$store.commit('setLoading', false)
        })
      },
      search () {
        if (this.searchData.lineShort === '' || this.searchData.carryFuelType === '' || this.searchData.carryLevel === '' || this.searchData.carryBodyType === '') {
          this.$message({type: 'error', message: '条件搜索不全'})
          return false
        }
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          lineShort: this.searchData.lineShort, // encodeURIComponent(this.searchData.lineShort),
          carryFuelType: encodeURIComponent(this.searchData.carryFuelType),
          carryLevel: encodeURIComponent(this.searchData.carryLevel),
          carryBodyType: encodeURIComponent(this.searchData.carryBodyType),
          deviceId: encodeURIComponent(this.searchData.deviceId),
          carryNo: encodeURIComponent(this.searchData.carryNo),
          carryCode: encodeURIComponent(this.searchData.carryCode)
        }
        this.Result(formData)
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          lineShort: this.searchData.lineShort, // encodeURIComponent(this.searchData.lineShort),
          carryFuelType: encodeURIComponent(this.searchData.carryFuelType),
          carryLevel: encodeURIComponent(this.searchData.carryLevel),
          carryBodyType: encodeURIComponent(this.searchData.carryBodyType),
          deviceId: encodeURIComponent(this.searchData.deviceId),
          carryNo: encodeURIComponent(this.searchData.carryNo),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          pageNum: val
        }
        this.Result(formData)
      },
      reset () {
        this.searchData.lineShort = ''
        this.searchData.carryFuelType = ''
        this.searchData.carryLevel = ''
        this.searchData.carryBodyType = ''
        this.searchData.deviceId = ''
        this.searchData.carryNo = ''
        this.searchData.carryCode = ''
        this.tableData = []
      },
      tableAdd () { // 提交
        let transferRuleId = this.transferRuleId
        if (this.searchData.lineShort === '' || this.searchData.carryFuelType === '' || this.searchData.carryLevel === '' || this.searchData.carryBodyType === '') {
          this.$message({type: 'error', message: '条件搜索不全'})
          return false
        }
        if (transferRuleId === '') {
          this.$message({type: 'error', message: '请先选择基础规则'})
          return false
        }
        this.$confirm('请确认你的搜索内容和数据库一致?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
        .then(() => {
          this.$store.commit('setLoading', true)
          let params = {
            transferRuleId: this.transferRuleId,
            companyId: localStorage.getItem('companyId'),
            lineShort: this.searchData.lineShort, // encodeURIComponent(this.searchData.lineShort),
            deviceId: encodeURIComponent(this.searchData.deviceId),
            carryNo: encodeURIComponent(this.searchData.carryNo),
            carryCode: encodeURIComponent(this.searchData.carryCode),
            carryFuelType: encodeURIComponent(this.searchData.carryFuelType),
            carryLevel: encodeURIComponent(this.searchData.carryLevel),
            carryBodyType: encodeURIComponent(this.searchData.carryBodyType)
          }
          this.$axios.post(this.api.gzfp.add, qs.stringify(params)).then((res) => {
            if (res.data.msg.code === '20000') {
              this.$message({type: 'success', message: '分配成功'})
            } else if (res.data.msg.code === '80001') { // 规则存在
              this.$message({type: 'error', message: res.data.msg.message})
            } else if (res.data.msg.code === '80002') { // 线路不存在
              this.$message({type: 'error', message: res.data.msg.message})
            } else {
              this.$message({type: 'error', message: '分配失败'})
            }
            this.$store.commit('setLoading', false)
          }).catch((err) => {
            console.log(err)
            this.$message({type: 'error', message: '网络出错'})
            this.$store.commit('setLoading', false)
          })
        }).catch(() => {})
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

