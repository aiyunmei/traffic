const getDeviceType = {
  install: (Vue) => {
    Vue.prototype.getDeviceType = (data) => {
      let nData
      if (data === 0) {
        nData = '换乘模式设备'
      } else if (data === 1) {
        nData = '阶梯模式进站设备'
      } else if (data === '0') {
        nData = '换乘模式设备'
      } else if (data === '1') {
        nData = '阶梯模式进站设备'
      } else if (data === '2') {
        nData = '阶梯模式出站设备'
      } else if (data === 2) {
        nData = '阶梯模式出站设备'
      } else {
        nData = null
      }
      return nData
    }
  }
}

export default getDeviceType
