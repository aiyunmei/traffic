const getStatus = {
  install: function (Vue) {
    Vue.prototype.getStatus = function (data) { // 数字状态字段转换展示中文
      let nData
      if (data === '0') {
        nData = '禁用'
      } else if (data === '1') {
        nData = '启用'
      } else if (data === 0) {
        nData = '禁用'
      } else if (data === 1) {
        nData = '启用'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getStatus
