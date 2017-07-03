const updateTime = { // 时间格式转换
  install: function (Vue) {
    Vue.prototype.updateTime = function (time) {
      var seperator1 = '-'
      var seperator2 = ':'
      var month = time.getMonth() + 1
      var strDate = time.getDate()
      var hours = time.getHours()
      var min = time.getMinutes()
      var s = time.getSeconds()
      if (month < 10) {
        month = '0' + month
      }
      if (strDate < 10) {
        strDate = '0' + strDate
      }
      if (hours < 10) {
        hours = '0' + hours
      }
      if (min < 10) {
        min = '0' + min
      }
      if (s < 10) {
        s = '0' + s
      }
      var currentdate = time.getFullYear() + seperator1 + month + seperator1 + strDate + ' ' + hours + seperator2 + min + seperator2 + s
      return currentdate
    }
  }
}

export default updateTime
