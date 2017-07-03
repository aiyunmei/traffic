const getNote = {
  install: function (Vue) {
    Vue.prototype.getNote = function (data) { // 备注类型转换展示数据
      let nData
      if (data === '1') {
        nData = '换卡'
      } else if (data === '2') {
        nData = '换机具'
      } else if (data === '3') {
        nData = '其他'
      } else if (data === 1) {
        nData = '换卡'
      } else if (data === 2) {
        nData = '换机具'
      } else if (data === 3) {
        nData = '其他'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getNote
