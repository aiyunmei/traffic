const getInstall = {
  install: function (Vue) {
    Vue.prototype.getInstall = function (data) { // 安装安装转换成展示数据
      let nData
      if (data === '0') {
        nData = '未安装'
      } else if (data === '1') {
        nData = '已安装'
      } else if (data === 0) {
        nData = '未安装'
      } else if (data === 1) {
        nData = '已安装'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getInstall
