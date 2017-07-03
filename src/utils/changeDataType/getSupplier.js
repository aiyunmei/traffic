const getSupplier = {
  install: function (Vue) { // 厂商字段变中文展示函数
    Vue.prototype.getSupplier = function (data) {
      let nData
      if (data === '1') {
        nData = '立方'
      } else if (data === '2') {
        nData = '易华录'
      } else if (data === '3') {
        nData = '华捷'
      } else if (data === '4') {
        nData = '雄帝'
      } else if (data === '5') {
        nData = '天津磁卡'
      } else if (data === '01') {
        nData = '立方'
      } else if (data === '02') {
        nData = '易华录'
      } else if (data === '03') {
        nData = '华捷'
      } else if (data === '04') {
        nData = '雄帝'
      } else if (data === '05') {
        nData = '天津磁卡'
      } else if (data === 1) {
        nData = '立方'
      } else if (data === 2) {
        nData = '易华录'
      } else if (data === 3) {
        nData = '华捷'
      } else if (data === 4) {
        nData = '雄帝'
      } else if (data === 5) {
        nData = '天津磁卡'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getSupplier
