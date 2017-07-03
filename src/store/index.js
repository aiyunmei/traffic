import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loading: false, // loading
    routerData: {}, // 路由参数
    tableTitle: {}, // 表格 大小标题  big大 small小
    page: {}, // 分页对象 pageNum 当前页数，total 总数据数量, pageSize 一页显示多少个
    ruleOptions: [], // 规则列表
    excelUploadDialogHidden: false,
    deviceSupplier: [ // 设备管理里的厂商
      { label: '立方', value: '1' },
      { label: '易华录', value: '2' },
      { label: '华捷', value: '3' },
      { label: '雄帝', value: '4' },
      { label: '天津磁卡', value: '5' }
    ],
    supplier: [ // 其他模块的厂商
      { label: '立方', value: '01' },
      { label: '易华录', value: '02' },
      { label: '华捷', value: '03' },
      { label: '雄帝', value: '04' },
      { label: '天津磁卡', value: '05' }
    ],
    carryType: [
      { label: '公交', value: '1' },
      { label: '快速公交', value: '2' }
    ],
    join: [ // 接入方
      { label: '支付宝', value: '支付宝' },
      { label: '微信', value: '微信' },
      { label: '银联', value: '银联' }
    ],
    gprsType: [ // 运营商
      { label: '中国移动', value: '中国移动' },
      { label: '中国电信', value: '中国电信' },
      { label: '中国联通', value: '中国联通' }
    ],
    rulesRange: { // 规则个数的范围
      min: 1,
      max: 10
    },
    carryFuelType: [
      { label: '柴油', value: '柴油' },
      { label: 'CNG', value: 'CNG' },
      { label: '电', value: '电' }
    ],
    carryLevel: [
      { label: '空调', value: '空调' },
      { label: '普车', value: '普车' }
    ],
    carryBodyType: [
      { label: '单层', value: '单层' },
      { label: '双层', value: '双层' }
    ],
    company: [
      { label: '武汉公交', value: '2' }
    ],
    status: [ // 状态
      { label: '启用', value: '1' }, { label: '禁用', value: '0' }
    ],
    deviceType: [
      { label: '换乘模式设备', value: '0' },
      { label: '阶梯模式进站设备', value: '1' },
      { label: '阶梯模式出站设备', value: '2' }
    ]
  },
  mutations: {
    setLoading (state, boolean) {
      state.loading = boolean  // 修改loading 状态
    },
    setRouterData (state, json) { // 渲染routerData
      state.routerData = json
    },
    setTableTitle (state, json) { // 渲染标题
      state.tableTitle = json
    },
    setPage (state, json) { // 渲染页数
      state.page = json
    },
    clearPage (state) { // 清空页数
      state.page = {
        pageNum: 1, pageSize: 1, total: 0, pages: 0
      }
    },
    setExcelDialogHidden (state, boolean) {
      state.excelUploadDialogHidden = boolean // 修改上传弹窗状态
    },
    setRuleOptions (state, Array) {
      state.ruleOptions = Array // 写入规则列表
    }
  }
})
