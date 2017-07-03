const toHash = { // 把json格式转换成链接后面的hash字符串
  install: function (Vue) {
    Vue.prototype.toHash = function (Json) {
      let hash = '?'
      for (let item in Json) {
        hash += item + '=' + encodeURIComponent(Json[item]) + '&' // 加上 encodeURIComponent 防止导出报错
      }
      let newHash = hash.substr(0, hash.length - 1) // 删除字符串的最后一个字符
      return newHash
    }
  }
}

export default toHash
