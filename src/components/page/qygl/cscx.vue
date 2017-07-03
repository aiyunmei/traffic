<template>
  <div class="item" v-loading.fullscreen.lock="this.$store.state.loading">

    <div class="item-table">

      <div class="item-table-title">
        <h2>{{ this.$store.state.tableTitle.big }}<span>{{ this.$store.state.tableTitle.small }}</span></h2>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <!--<el-table-column label="操作" class="item-table-cc" width="120">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
          </el-table-column>-->
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
    data () {
      return {
        searchData: {
        },
        table: [
          { label: '线路短号', name: 'lineShort' },
          { label: '车牌号', name: 'carryCode' },
          { label: '自编号', name: 'carryNo' },
          { label: '设备号', name: 'deviceId' },
          { label: 'appKey', name: 'appKey' },
          { label: '实际扣款时间', name: 'actualOrderTime' },
          { label: '创建时间', name: 'createTime' },
          { label: '更新时间', name: 'updateTime' },
          { label: '实际交易金额(分)', name: 'perAmount' },
          { label: '重试次数', name: 'retryTimes' },
          { label: '错误信息', name: 'retryMessage' }
        ],
        tableData: []
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '企业管理', small: '重试查询' })
    },
    methods: {
      Result (formData) {
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.cscx.result, formData || {}).then((res) => {
          console.log(res.data)
          if (res.data.msg.code === '20000') {
            this.tableData = res.data.data
            this.$store.commit('setPage', res.data.page)
          } else if (res.data.msg.code === '40001') {
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: res.data.msg.message})
          } else {
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '查询失败'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新试试'})
        })
      },
      handleCurrentChange (val) {
        this.Result({params: {pageNum: val}})
        console.log('当前第' + val + '页')
      }
    }
  }
</script>
