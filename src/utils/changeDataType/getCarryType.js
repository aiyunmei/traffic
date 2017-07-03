const getCarryType = {
  install: function (Vue) {
    Vue.prototype.getCarryType = function (data) { // 车辆类型转换展示数据
      let nData
      if (data === '01') {
        nData = '公交'
      } else if (data === '02') {
        nData = '快速公交'
      } else if (data === '1') {
        nData = '公交'
      } else if (data === '2') {
        nData = '快速公交'
      } else if (data === 1) {
        nData = '公交'
      } else if (data === 2) {
        nData = '快速公交'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getCarryType
