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
                <el-input placeholder="当前版本" v-model.trim="searchData.appVersion" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="车牌号" v-model.trim="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="机具编号" v-model.trim="searchData.deviceId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-input placeholder="自编号" v-model.trim="searchData.carryNo" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-select v-model="searchData.supplierCode" @multiple="true" clearable allow-create placeholder="厂商" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.supplier" :label="item.label" :value="item.value" :key="index">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select v-model="searchData.carryType" @multiple="true" clearable allow-create placeholder="车辆类型" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.carryType" :label="item.label" :value="item.value" :key="index">
                  </el-option>
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
          <el-select v-model="version" placeholder="批量选择" style="position: relative;top: 2px;" @change="versionChange">
            <el-option v-for="item in versionOptions" :label="item" :value="item" :key="item"></el-option>
          </el-select>
          <el-button icon="setting" type="primary" @click="allApkTarVersions" v-if="false">批量选择</el-button>
          <el-button icon="delete" type="primary" @click="clearAllApkTarVersions" v-if="false">取消</el-button>
          <el-button type="primary" icon="edit" v-on:click="tableAdd('ruleForm')">提交</el-button>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span v-if="item.name === 'tarAppVersions'" title="点击选择版本">
                <el-select v-model="scope.row.checkTarAppVersion" @multiple="true" clearable allow-create placeholder="选择版本">
                  <el-option v-for="(item,index) in scope.row[item.name]" :label="item" :value="item" :key="index">
                  </el-option>
                </el-select>
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
  import getVersion from './js/getVersion'
  import setVersion from './js/setVersion'
  import allTarApkVersion from './js/allTarApkVersion'
  import clearTarApkVersion from './js/clearTarApkVersion'
  import qs from 'qs'
  export default {
    name: 'apksj',
    data () {
      return {
        searchData: { // 搜索数据
          appVersion: '',
          carryCode: '',
          deviceId: '',
          carryNo: '',
          supplierCode: '',
          carryType: ''
        },
        table: [ // 表格展示
          { label: '当前版本', name: 'appVersion' },
          { label: '目标版本', name: 'tarAppVersion' },
          { label: '选择目标版本', name: 'tarAppVersions' },
          { label: '车牌号', name: 'carryCode' },
          { label: '机具编号', name: 'deviceId' },
          { label: '自编号', name: 'carryNo' },
          { label: '厂商', name: 'supplierName' },
          { label: '车辆类型', name: 'carryTypeName' }
        ],
        tableData: [], // 表格数据
        pageSize: null, // 记录修改的分页长度
        versionOptions: [],
        version: ''
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: 'APK管理', small: '升级管理' })
      this.getVersionOptions()
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.apksj.result, formData || {})
        .then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') {
            let page = res.data.page
            let data = res.data.data
            for (let i = 0; i < data.length; i++) {
              let supplierCode = data[i].supplierCode
              let carryType = data[i].carryType
              res.data.data[i].checkTarAppVersion = ''
              res.data.data[i].supplierName = this.getSupplier(supplierCode) // 全局转换
              res.data.data[i].carryTypeName = this.getCarryType(carryType) // 全局转换
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.$store.commit('clearPage')
            this.tableData = []
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 失败
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '网络出错,请刷新试试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错,请刷新试试'})
        })
      },
      search () { // 搜索
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          appVersion: encodeURIComponent(this.searchData.appVersion),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          deviceId: encodeURIComponent(this.searchData.deviceId),
          carryNo: encodeURIComponent(this.searchData.carryNo),
          supplierCode: encodeURIComponent(this.searchData.supplierCode),
          carryType: encodeURIComponent(this.searchData.carryType),
          pageSize: this.pageSize
        }
        this.Result(formData)
      },
      handleCurrentChange (val) { // 分页
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          appVersion: encodeURIComponent(this.searchData.appVersion),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          deviceId: encodeURIComponent(this.searchData.deviceId),
          carryNo: encodeURIComponent(this.searchData.carryNo),
          supplierCode: encodeURIComponent(this.searchData.supplierCode),
          carryType: encodeURIComponent(this.searchData.carryType),
          pageNum: val,
          pageSize: this.pageSize
        }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.appVersion = ''
        this.searchData.carryCode = ''
        this.searchData.deviceId = ''
        this.searchData.carryNo = ''
        this.searchData.supplierCode = ''
        this.searchData.carryType = ''
      },
      tableAdd (formName) { // 批量提交
        let data = getVersion(this.tableData) // 调用解析版本列表
        console.log(data)
        if (data.length === 0) { // 直接点击提交
          this.$message({type: 'error', message: '请选择目标版本'})
        } else {
          this.$confirm('确认提交吗, 是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
          .then(() => {
            this.$store.commit('setLoading', true)
            this.$axios.post(this.api.apksj.update, qs.stringify({data: JSON.stringify(data)})).then((res) => {
              console.log(res)
              if (res.data.msg.code === '20000') { // 提交网络成功
                setVersion(data, this.tableData) // 更新table
                this.$message({type: 'success', message: '升级成功'})
              } else if (res.data.msg.code === '40001') { // 提交升级出错
                this.$message({type: 'error', message: res.data.msg.message})
              } else { // 提交升级失败
                this.$message({type: 'error', message: '网络出错'})
              }
              this.$store.commit('setLoading', false)
            }).catch((err) => { // 提交升级网络出错
              console.log(err)
              this.$store.commit('setLoading', false)
              this.$message({type: 'error', message: '网络出错'})
            })
          })
          .catch(() => {})
        }
      },
      handleSizeChange (val) { // 修改分页长度
        this.pageSize = val // 保存pageSize
        let formData = {}
        formData.params = {
          companyId: localStorage.getItem('companyId'),
          appVersion: encodeURIComponent(this.searchData.appVersion),
          carryCode: encodeURIComponent(this.searchData.carryCode),
          deviceId: encodeURIComponent(this.searchData.deviceId),
          carryNo: encodeURIComponent(this.searchData.carryNo),
          supplierCode: encodeURIComponent(this.searchData.supplierCode),
          carryType: encodeURIComponent(this.searchData.carryType),
          pageSize: val
        }
        this.Result(formData)
        console.log('修改了分页长度是:' + val)
      },
      allApkTarVersions () { // 全部选择目标版本
        allTarApkVersion(this.tableData)
      },
      clearAllApkTarVersions () { // 清空全部选择目标版本
        clearTarApkVersion(this.tableData)
      },
      getVersionOptions () {
        this.$axios.get(this.api.apksj.versionOptions, {
          params: {companyId: localStorage.getItem('companyId')}
        }).then((res) => {
          console.log(res)
          this.versionOptions = res.data.data
        }).catch((err) => {
          console.log(err)
          this.$message({type: 'error', message: '获取列表失败'})
        })
      },
      versionChange (val) {
        for (let i = 0; i < this.tableData.length; i++) {
          this.tableData[i].checkTarAppVersion = val
        }
      }
    }
  }
</script>
