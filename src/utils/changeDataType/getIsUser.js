const getIsUser = {
  install: function (Vue) {
    Vue.prototype.getIsUser = function (data) {
      let nData
      if (data === '0') {
        nData = '否'
      } else if (data === '1') {
        nData = '是'
      } else if (data === 0) {
        nData = '否'
      } else if (data === 1) {
        nData = '是'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getIsUser
