const getIsCircled = {
  install: function (Vue) { // 循环线路 转换展示数据
    Vue.prototype.getIsCircled = function (data) {
      let nData
      if (data === '0') {
        nData = '否'
      } else if (data === '1') {
        nData = '是'
      } else if (data === 0) {
        nData = '否'
      } else if (data === 1) {
        nData = '是'
      }
      return nData
    }
  }
}

export default getIsCircled
