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
                <el-input placeholder="设备号" v-model.trim="searchData.deviceId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="4">
                <el-select placeholder="选择车辆类型" v-model="searchData.carryType" clearable class="item-search-input-l">
                  <el-option v-for="item in this.$store.state.carryType" :key="item.label" :label="item.label" :value="item.value"></el-option>
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
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <span v-if="item.name === 'imgAddress'"><el-button type="small" @click="readImg(scope.$index, scope.row)">查看图片</el-button></span>
              <span v-else :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
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

      <el-dialog :title="imgDialog.title" v-model="imgDialog.hidden" top="70px">
        <div class="item-dialog">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide v-for="item in imgDialog.src" :key="item">
              <img :src="item" style="width: 100%;height: 300px;cursor: pointer;" title="左右拖拽查看图片">
            </swiper-slide>
            <div class="swiper-pagination"  slot="pagination"></div>
          </swiper>
        </div>
      </el-dialog>

    </div>

  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'ghjl',
    data () {
      return {
        searchData: { // 搜索数据
          carryCode: '',
          deviceId: '',
          lineShort: '',
          carryType: ''
        },
        table: [ // 表格展示
          { label: '车牌/闸机编号', name: 'carryCode' },
          { label: '设备号', name: 'deviceId' },
          { label: '自编号', name: 'carryNo' },
          { label: '图片', name: 'imgAddress' },
          { label: '车辆类型', name: 'carryTypeName' },
          { label: '线路短号', name: 'lineShort' },
          { label: '公司名称', name: 'companyName' },
          { label: '经度(X)', name: 'addressX' },
          { label: '纬度(Y)', name: 'addressY' },
          { label: '地址', name: 'address' },
          { label: '创建时间', name: 'createTime' }
        ],
        tableData: [], // 表格数据
        imgDialog: { // 大图
          src: [],
          title: '',
          hidden: false
        },
        swiperOption: {
          direction: 'horizontal',
          pagination: '.swiper-pagination'
        }
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.$store.commit('setTableTitle', { big: '机具录入', small: '更换记录' })
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.ghjl.result, formData || {}).then((res) => {
          console.log(res)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let carryType = data[i].carryType
              res.data.data[i].carryTypeName = this.getCarryType(carryType)
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 失败
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '网络出错，请刷新页面试试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新页面试试'})
        })
      },
      search () { // 搜索
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            carryCode: encodeURIComponent(this.searchData.carryCode),
            deviceId: this.searchData.deviceId,
            lineShort: encodeURIComponent(this.searchData.lineShort),
            carryType: this.searchData.carryType
          }
        })
      },
      handleCurrentChange (val) { // 分页
        this.Result({
          params: {
            companyId: localStorage.getItem('companyId'),
            carryCode: encodeURIComponent(this.searchData.carryCode),
            deviceId: this.searchData.deviceId,
            lineShort: encodeURIComponent(this.searchData.lineShort),
            carryType: this.searchData.carryType,
            pageNum: val
          }
        })
        console.log('当卡第' + val + '页')
      },
      reset () { // 清空搜索数据
        this.searchData.carryCode = ''
        this.searchData.deviceId = ''
        this.searchData.lineShort = ''
        this.searchData.carryType = ''
      },
      readImg (index, row) { // 查看大图
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.readImg, {params: {deviceId: row.deviceId}})
        .then((res) => {
          console.log(res.data.data)
          this.imgDialog.title = '图片'
          this.imgDialog.hidden = true
          this.imgDialog.src = res.data.data
          this.$store.commit('setLoading', false)
        }).catch((err) => {
          console.log(err)
          this.$message({type: 'error', message: '网络出错'})
          this.$store.commit('setLoading', false)
        })
      }
    }
  }
</script>
