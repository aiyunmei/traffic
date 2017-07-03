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
              <el-col :span="2">
                <el-input placeholder="安装人" v-model.trim="searchData.name" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="2">
                <el-input placeholder="车牌/闸机编号" v-model.trim="searchData.carryCode" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="2">
                <el-input placeholder="设备编号" v-model.trim="searchData.deviceId" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="2">
                <el-input placeholder="线路短号" v-model.trim="searchData.lineShort" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="2">
                <el-input placeholder="手机号" v-model.trim="searchData.telephone" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="2">
                <el-input placeholder="自编号" v-model.trim="searchData.carryNo" class="item-search-input-l" @keyup.enter.native="search"></el-input>
              </el-col>
              <el-col :span="2">
                <el-select v-model="searchData.supplierCode" @multiple="true" clearable allow-create placeholder="厂商" class="item-search-input-l" @keyup.enter.native="search">
                  <el-option v-for="(item,index) in this.$store.state.supplier" :label="item.label" :value="item.value" :key="index"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-date-picker @keyup.enter.native="search" v-model="searchTime" type="datetimerange" :picker-options="pickerOptions" placeholder="选择搜索时间范围" align="left" :editable="false" :clearable="false" class="item-search-input-l"></el-date-picker>
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
          <a :href="hrefExcel" target="_blank"><el-button type="primary" icon="upload">导出</el-button></a>
        </div>
      </div>

      <div class="item-table-main">
        <el-table :data="tableData" border>
          <el-table-column v-for="(item,index) in table" :label="item.label" :key="index">
            <template scope="scope">
              <!--<img v-if="item.name === 'imgAddress'" :src="scope.row[item.name]" style="width: 50px;height: 100%;" title="点击查看大图" />-->
              <span v-if="item.name === 'imgAddress'"><el-button type="small" @click="readImg(scope.$index, scope.row)">查看图片</el-button></span>
              <span v-else :title="scope.row[item.name]">{{ scope.row[item.name] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" class="item-table-cc" width="60">
            <template scope="scope">
              <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
            <el-form-item label="备注类型" prop="note">
              <el-radio-group v-model="ruleForm.note">
                <el-radio-button label="1">换卡</el-radio-button>
                <el-radio-button label="2">换机具</el-radio-button>
                <el-radio-button label="3">其他</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="审核状态" prop="pengdingStatus">
              <el-radio-group v-model="ruleForm.pengdingStatus">
                <el-radio-button label="1">已审核</el-radio-button>
                <el-radio-button label="0">未审核</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注内容" prop="noteDetails">
              <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="ruleForm.noteDetails"></el-input>
            </el-form-item>
            <div class="dialog-submit">
              <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            </div>
          </el-form>
        </div>
      </div>
    </el-dialog>

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
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'lrlb',
    data () {
      return {
        pickerOptions: { // 时间便捷选择
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
        searchTime: '', // 搜索时间间隔
        hrefExcel: '', // 导出excelurl
        searchData: { // 搜索数据
          name: '',
          carryCode: '',
          lineShort: '',
          deviceId: '',
          carryNo: '',
          supplierCode: '',
          telephone: '',
          startTime: '',
          endTime: ''
        },
        table: [ // 表格展示
          { label: '车牌/闸机编号', name: 'carryCode' },
          { label: '自编号', name: 'carryNo' },
          { label: '设备编号', name: 'deviceId' },
          { label: '线路短号', name: 'lineShort' },
          { label: '更新时间', name: 'updateTime' },
          { label: '图片', name: 'imgAddress' },
          { label: '厂商', name: 'supplierName' },
          { label: '公司名称', name: 'companyName' },
          { label: '安装人', name: 'name' },
          { label: '备注类型', name: 'noteName' },
          { label: '备注内容', name: 'noteDetails' },
          { label: '手机号', name: 'telephone' },
          { label: '经度(X)', name: 'addressX' },
          { label: '纬度(Y)', name: 'addressY' },
          { label: '安装地址', name: 'address' },
          { label: '审核状态', name: 'pengdingStatusName' }
        ],
        tableData: [], // 表格数据
        tableRowData: {}, // 表格编辑行数据
        dialog: { // 弹窗
          title: '',
          hidden: false,
          position: 'left'
        },
        imgDialog: { // 大图
          title: '',
          hidden: false,
          src: []
        },
        ruleForm: { // 表单数据
          note: '',
          pengdingStatus: '',
          noteDetails: ''
        },
        rules: { // 表单规则
          note: [
            { required: true, message: '请选择备注类型', toggle: 'blur' }
          ],
          pengdingStatus: [
            { required: true, message: '请选审核状态', toggle: 'blur' }
          ],
          noteDetails: [
            { max: 40, message: '不得超过40位' }
          ]
        },
        indexEdit: 0, // 表格编辑行索引
        swiperOption: {
          direction: 'horizontal',
          pagination: '.swiper-pagination'
        }
      }
    },
    created () {
      this.Result({params: {companyId: localStorage.getItem('companyId')}})
      this.hrefExcel = this.api.lrlb.excel + '?companyId=' + localStorage.getItem('companyId') // 添加导出url
      this.$store.commit('setTableTitle', { big: '机具录入', small: '录入列表' })
    },
    methods: {
      Result (formData) { // 初始化
        this.$store.commit('setLoading', true)
        this.$axios.get(this.api.lrlb.result, formData || {}).then((res) => {
          console.log(res.data)
          if (res.data.msg.code === '20000') { // 成功
            let data = res.data.data
            let page = res.data.page
            for (let i = 0; i < data.length; i++) {
              let note = data[i]['note']
              let pengdingStatus = data[i]['pengdingStatus']
              let supplierCode = data[i]['supplierCode']
              res.data.data[i].noteName = this.getNote(note)
              res.data.data[i].pengdingStatusName = this.getPengdingStatus(pengdingStatus)
              res.data.data[i].supplierName = this.getSupplier(supplierCode)
            }
            this.tableData = data
            this.$store.commit('setPage', page)
          } else if (res.data.msg.code === '40001') { // 无数据
            this.tableData = []
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: res.data.msg.message})
          } else { // 失败
            this.$store.commit('clearPage')
            this.$message({type: 'error', message: '网络出错，请刷新页面重试'})
          }
          this.$store.commit('setLoading', false)
        }).catch((err) => { // 网络出错
          console.log(err)
          this.$store.commit('clearPage')
          this.$store.commit('setLoading', false)
          this.$message({type: 'error', message: '网络出错，请刷新页面重试'})
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
          carryCode: encodeURIComponent(this.searchData.carryCode),
          name: encodeURIComponent(this.searchData.name),
          carryNo: this.searchData.carryNo,
          deviceId: this.searchData.deviceId,
          lineShort: encodeURIComponent(this.searchData.lineShort),
          supplierCode: this.searchData.supplierCode,
          telephone: this.searchData.telephone,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime
        }
        this.Result(formData)
        this.hrefExcel = this.api.lrlb.excel + this.toHash(formData['params']) // 调用json转换成字符串连接hash函数
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
          carryCode: encodeURIComponent(this.searchData.carryCode),
          name: encodeURIComponent(this.searchData.name),
          carryNo: this.searchData.carryNo,
          deviceId: this.searchData.deviceId,
          lineShort: encodeURIComponent(this.searchData.lineShort),
          supplierCode: this.searchData.supplierCode,
          telephone: this.searchData.telephone,
          startTime: this.searchData.startTime,
          endTime: this.searchData.endTime,
          pageNum: val
        }
        this.Result(formData)
        console.log('当前页数:' + val)
      },
      reset () { // 清空搜索数据
        this.searchData.name = ''
        this.searchData.carryCode = ''
        this.searchData.carryNo = ''
        this.searchData.lineShort = ''
        this.searchData.deviceId = ''
        this.searchData.supplierCode = ''
        this.searchData.telephone = ''
        this.searchData.startTime = ''
        this.searchData.endTime = ''
        this.searchTime = ''
      },
      handleEdit (index, row) { // 编辑
        this.dialog.hidden = true
        this.dialog.title = '编辑'
        this.indexEdit = index
        this.tableRowData = row
        this.ruleForm.note = row.note === undefined ? '' : row.note
        this.ruleForm.noteDetails = row.noteDetails === undefined ? '' : row.noteDetails
        this.ruleForm.pengdingStatus = row.pengdingStatus === undefined ? '' : row.pengdingStatus
      },
      submitForm (formName) { // 提交
        let that = this
        that.$refs[formName].validate((valid) => {
          if (valid) {
            that.$confirm('是否继续?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
            .then(() => {
              that.$store.commit('setLoading', true)
              let note = that.ruleForm.note
              let noteDetails = that.ruleForm.noteDetails
              let pengdingStatus = that.ruleForm.pengdingStatus
              that.$axios.get(that.api.lrlb.update, {
                params: {
                  id: that.tableRowData.id,
                  note: note,
                  noteDetails: encodeURIComponent(noteDetails),
                  pengdingStatus: pengdingStatus
                }
              }).then((res) => {
                console.log(res)
                if (res.data.msg.code === '20000') { // 编辑成功
                  that.tableData[that.indexEdit].note = note
                  that.tableData[that.indexEdit].noteName = that.getNote(note) // 全局转换
                  that.tableData[that.indexEdit].noteDetails = noteDetails
                  that.tableData[that.indexEdit].pengdingStatus = pengdingStatus
                  that.tableData[that.indexEdit].pengdingStatusName = that.getPengdingStatus(pengdingStatus) // 全局转换
                  that.dialog.hidden = false
                  that.$message({type: 'success', message: '编辑成功!'})
                } else if (res.data.msg.code === '40001') { // 编辑出错
                  that.$message({type: 'error', message: res.data.msg.message})
                } else { // 编辑失败
                  that.$message({type: 'error', message: '编辑失败'})
                }
                that.$store.commit('setLoading', false)
              }).catch((err) => { // 编辑网络出错
                console.log(err)
                that.$store.commit('setLoading', false)
                that.$message({type: 'error', message: '网络出错,请重新试试'})
              })
            })
            .catch(() => {})
          } else {
            console.log('error')
          }
        })
      },
      closeDialog () { // 关闭弹窗
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
