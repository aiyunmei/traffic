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
                <el-input placeholder="车牌/闸机编号" v-model.trim="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="自编号" v-model.trim="searchData.carryNo" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="设备号" v-model.trim="searchData.deviceId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="分公司" v-model.trim="searchData.localCompanyName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="部门" v-model.trim="searchData.localDepartmentName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="8">
                <el-date-picker class="item-search-input-l" @keyup.enter.native="search" v-model="searchTime" type="datetimerange" :picker-options="pickerOptions" placeholder="选择搜索时间范围" align="left" :editable="false" :clearable="false"></el-date-picker>
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
          <a :href="hrefExcel" target="_blank" style="position: relative;top: 3px;"><el-button type="primary" icon="upload">导出</el-button></a>
          <el-radio-group v-model="changeHeart" @change="heartChange">
            <el-radio-button label="1">有心跳</el-radio-button>
            <el-radio-button label="0">无心跳</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span v-if="item.name === 'count'">
                <el-button v-if="tableData[scope.$index].getCount === null" type="small" @click="getCount(scope.$index, scope.row)">查看次数</el-button>
                <span v-else>{{ tableData[scope.$index].getCount }}</span>
              </span>
              <span v-else :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
        </el-table>

        <div class="item-pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="this.$store.state.page.pageNum"
            :page-size="this.$store.state.page.pageSize"
            :page-sizes="[10, 100, 200, 300]"
            layout="sizes, prev, pager, next, jumper, total"
            :total="this.$store.state.page.total">
          </el-pagination>
        </div>
      </div>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'xtcx',
    data () {
      return {
        pickerOptions: { // 时间间隔便捷选择
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        hrefExcel: '', // 到处url
        searchTime: '', // 搜索时间间隔
        changeHeart: '1', // 默认先有心跳
        url: this.api.xtcx.yresult, // 默认初始接口url
        searchData: { // 搜索数据
          lineShort: '',
          carryCode: '',
          carryNo: '',
          deviceId: '',
          localCompanyName: '',
          localDepartmentName: '',
          startTime: '',
          endTime: ''
        },
        table: [ // 表格展示
          { label: '车牌/闸机编号', name: 'carryCode' },
          { label: '自编号', name: 'carryNo' },
          { label: '设备号', name: 'deviceId' },
          { label: '公司名称', name: 'companyName' },
          { label: '分公司', name: 'localCompanyName' },
          { label: '部门', name: 'localDepartmentName' },
          { label: '线路短号', name: 'lineShort' },
          { label: '心跳次数', name: 'count' },
          { label: '心跳最后时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        pageSize: null // 设置分页间隔
      }
    },
    created () {
      this.$store.commit('setTableTitle', {big: '企业管理', small: '心跳查询'})
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.hrefExcel = this.api.xtcx.yexcel + '?companyId=' + localStorage.getItem('companyId')
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.url, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              res.data.data[i].getCount = null
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$message({type: 'error', message: res.data.msg.message})
            this.$store.commit('clearPage')
          } else { // 失败
            this.$message({type: 'error', message: '网络出错，请刷新试试'})
            this.$store.commit('clearPage')
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
          this.$store.commit('clearPage')
        })
      },
      search () { // 搜索
        let formData = {}
        if (this.searchTime[0] === null || this.searchTime[1] === null) { // 防止用户没有请求时间 时间格式修改被调用报错
        } else if (this.searchTime === '') {
        } else {
          this.searchData.startTime = this.updateTime(this.searchTime[0])
          this.searchData.endTime = this.updateTime(this.searchTime[1])
        }
        formData['params'] = {
          companyId: localStorage.getItem('companyId'),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          localCompanyName: encodeURIComponent(this.searchData.localCompanyName),
          localDepartmentName: encodeURIComponent(this.searchData.localDepartmentName),
          carryNo: this.searchData.carryNo,
          deviceId: this.searchData.deviceId,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime,
          pageSize: this.pageSize
        }
        this.Result(formData)

        this.changeHeart === '0' ? this.hrefExcel = this.api.xtcx.nexcel : this.hrefExcel = this.api.xtcx.yexcel

        this.hrefExcel = this.hrefExcel + this.toHash(formData['params']) // 调用json转换成字符串连接hash函数
        console.log(formData)
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        if (this.searchTime[0] === null || this.searchTime[1] === null) { // 防止用户没有请求时间 时间格式修改被调用报错
        } else if (this.searchTime === '') {
        } else {
          this.searchData.startTime = this.updateTime(this.searchTime[0])
          this.searchData.endTime = this.updateTime(this.searchTime[1])
        }
        formData['params'] = {
          companyId: localStorage.getItem('companyId'),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          localCompanyName: encodeURIComponent(this.searchData.localCompanyName),
          localDepartmentName: encodeURIComponent(this.searchData.localDepartmentName),
          carryNo: this.searchData.carryNo,
          deviceId: this.searchData.deviceId,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime,
          pageSize: this.pageSize,
          pageNum: val
        }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      handleSizeChange (val) { // 分页大小修改
        this.pageSize = val
        let formData = {}
        if (this.searchTime[0] === null || this.searchTime[1] === null) { // 防止用户没有请求时间 时间格式修改被调用报错
        } else if (this.searchTime === '') {
        } else {
          this.searchData.startTime = this.updateTime(this.searchTime[0])
          this.searchData.endTime = this.updateTime(this.searchTime[1])
        }
        formData['params'] = {
          companyId: localStorage.getItem('companyId'),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          localCompanyName: encodeURIComponent(this.searchData.localCompanyName),
          localDepartmentName: encodeURIComponent(this.searchData.localDepartmentName),
          carryNo: this.searchData.carryNo,
          deviceId: this.searchData.deviceId,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime,
          pageSize: val
        }
        this.Result(formData)
      },
      reset () { // 清空搜索
        this.searchData.lineShort = ''
        this.searchData.carryCode = ''
        this.searchData.carryNo = ''
        this.searchData.deviceId = ''
        this.searchData.localCompanyName = ''
        this.searchData.localDepartmentName = ''
        this.searchData.startTime = ''
        this.searchData.endTime = ''
        this.searchTime = ''
      },
      heartChange (val) { // 心跳类型切换
        let that = this
        if (val === '1') {
          that.url = that.api.xtcx.yresult
          that.reset() // 清除搜索数据
          that.pageSize = 10 // 修复心跳类型切换在pageSize设定后出现搜索不到的bug
          that.hrefExcel = this.api.xtcx.yexcel + '?companyId=' + localStorage.getItem('companyId')
          that.Result({params: {companyId: localStorage.getItem('companyId'), pageSize: that.pageSize}})
        } else if (val === '0') {
          that.url = that.api.xtcx.nresult
          that.reset() // 清楚搜素数据
          that.pageSize = 10 // 修复心跳类型切换在pageSize设定后出现搜索不到的bug
          that.hrefExcel = this.api.xtcx.nexcel + '?companyId=' + localStorage.getItem('companyId')
          that.Result({params: {companyId: localStorage.getItem('companyId'), pageSize: that.pageSize}})
        }
      },
      getCount (index, row) { // 获取心跳数量
        let formData = {}
        if (this.searchTime[0] === null || this.searchTime[1] === null) { // 防止用户没有请求时间 时间格式修改被调用报错
        } else if (this.searchTime === '') {
        } else {
          this.searchData.startTime = this.updateTime(this.searchTime[0])
          this.searchData.endTime = this.updateTime(this.searchTime[1])
        }
        let deviceId = row.deviceId
        formData.params = { // 无心跳去除时间搜索
          deviceId: deviceId,
          startTime: this.changeHeart === '0' ? '' : this.searchData.startTime,
          endTime: this.changeHeart === '0' ? '' : this.searchData.endTime
        }
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.xtcx.getCount, formData).then((res) => {
          this.tableData[index].getCount = res.data.data
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错'})
        })
      }
    }
  }
</script>

<style>
</style>
