const getPersonStatus = {
  install: function (Vue) {
    Vue.prototype.getPersonStatus = function (data) { // 员工状态转换展示
      let nData
      if (data === '1') {
        nData = '在职'
      } else if (data === '2') {
        nData = '离职'
      } else if (data === 1) {
        nData = '在职'
      } else if (data === 2) {
        nData = '离职'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getPersonStatus
