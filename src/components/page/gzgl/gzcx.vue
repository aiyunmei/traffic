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
                <el-autocomplete :fetch-suggestions="querySearchAsyncLineShort" placeholder="线路短号" v-model="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-autocomplete>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="规则名称" v-model="searchData.transferRuleName" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="3">
                <el-select placeholder="燃油类别" v-model="searchData.carryFuelType" clearable class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="item in this.$store.state.carryFuelType" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select placeholder="车辆级别" v-model="searchData.carryLevel" clearable class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="item in this.$store.state.carryLevel" :key="item.label" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-col>
              <el-col :span="3">
                <el-select placeholder="车辆结构" v-model="searchData.carryBodyType" clearable class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="item in this.$store.state.carryBodyType" :key="item.label" :label="item.label" :value="item.value"></el-option>
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
          <el-select placeholder="公司名称" v-model="companyId" class="item-search-input-l" @keyup.enter.native="search" @change="companyChange">
            <el-option v-for="item in this.$store.state.company" :key="item.label" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index" :width="item.name === 'transferRuleRules' ?  400 : ''">
            <template scope="scope">
              <span title="拉伸边框可查看所有规则" v-if="item.name === 'transferRuleRules'">
                <!--<span v-for="(rule, index) in scope.row.rules">{{ '规则' + (index+ 1) + '：' + parseFloat(rule.price) / 100 + '元&nbsp;&nbsp;'  }}</span>-->
                <span v-for="(rule, key) in JSON.parse(scope.row.transferRuleRules)">{{ '第' + (parseFloat(key)) + '次:' + rule.price + '分&nbsp;&nbsp;' }}</span>
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

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'gzcx',
    data () {
      return {
        searchData: { lineShort: '', carryFuelType: '', carryLevel: '', carryBodyType: '', transferRuleName: '' },
        table: [
          { label: '规则名称', name: 'transferRuleName' },
          { label: '规则明细', name: 'transferRuleRules' },
          { label: '线路短号', name: 'lineShort' },
          { label: '燃油类型', name: 'carryFuelType' },
          { label: '车辆级别', name: 'carryLevel' },
          { label: '车辆结构', name: 'carryBodyType' }
        ], // 表格展示
        tableData: [], // 表格数据
        timeout: null,
        companyId: '2'
      }
    },
    created () {
      this.$store.commit('setTableTitle', { big: '换乘优惠管理', small: '规则分配查询' })
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
    },
    methods: {
      Result (formData) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.gzcx.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') {
            let data = res.data.data.ruleList
            let page = res.data.data.page
            if (data.length === 0) {
              this.tableData = []
              this.$store.commit('clearPage')
              this.$message({type: 'error', message: '未查询到数据'})
            } else {
              for (let i = 0; i < data.length; i++) {
                res.data.data.ruleList[i].carryFuelType = decodeURI(data[i].carryFuelType)
                res.data.data.ruleList[i].carryLevel = decodeURI(data[i].carryLevel)
                res.data.data.ruleList[i].carryBodyType = decodeURI(data[i].carryBodyType)
              }
              this.tableData = data
              this.$store.commit('setPage', page)
            }
          } else if (res.data.msg.code === '40001') {
            this.$message({type: 'error', message: res.data.msg.message})
            this.$store.commit('clearPage')
          } else {
            this.$message({type: 'error', message: '网络出错，请刷新试试'})
            this.$store.commit('clearPage')
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
          this.$store.commit('clearPage')
        })
      },
      search () { // 搜索
        let formData = {}
        formData.params = {
          companyId: this.companyId,
          transferRuleName: encodeURIComponent(this.searchData.transferRuleName),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          carryFuelType: encodeURIComponent(this.searchData.carryFuelType),
          carryLevel: encodeURIComponent(this.searchData.carryLevel),
          carryBodyType: encodeURIComponent(this.searchData.carryBodyType)
        }
        this.Result(formData)
      },
      handleCurrentChange (val) {
        let formData = {}
        formData.params = {
          companyId: this.companyId,
          transferRuleName: encodeURIComponent(this.searchData.transferRuleName),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          carryFuelType: encodeURIComponent(this.searchData.carryFuelType),
          carryLevel: encodeURIComponent(this.searchData.carryLevel),
          carryBodyType: encodeURIComponent(this.searchData.carryBodyType),
          pageNum: val
        }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.lineShort = ''
        this.searchData.carryFuelType = ''
        this.searchData.carryLevel = ''
        this.searchData.carryBodyType = ''
      },
      companyChange (val) { // 改变公司
        let formData = {}
        formData.params = {
          companyId: val,
          transferRuleName: encodeURIComponent(this.searchData.transferRuleName),
          lineShort: encodeURIComponent(this.searchData.lineShort),
          carryFuelType: encodeURIComponent(this.searchData.carryFuelType),
          carryLevel: encodeURIComponent(this.searchData.carryLevel),
          carryBodyType: encodeURIComponent(this.searchData.carryBodyType)
        }
        this.Result(formData)
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
