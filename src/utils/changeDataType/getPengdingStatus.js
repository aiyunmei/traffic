const getPengdingStatus = {
  install: function (Vue) {
    Vue.prototype.getPengdingStatus = function (data) { // 审核状态转换展示数据
      let nData
      if (data === '0') {
        nData = '未审核'
      } else if (data === '1') {
        nData = '已审核'
      } else if (data === 0) {
        nData = '未审核'
      } else if (data === 1) {
        nData = '已审核'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getPengdingStatus
