const getParentPath = { // 根据子元素获取父元素path
  install: function (Vue) {
    Vue.prototype.getParentPath = function (data) {
      let nData
      if (data === 'sbgl' || data === 'xtcx' || data === 'yygs' || data === 'cscx') {
        nData = 'qygl'
      } else if (data === 'lrlb' || data === 'wllb' || data === 'ghjl' || data === 'sbllk' || data === 'lryhgl' || data === 'jjcsgl') {
        nData = 'jjlr'
      } else if (data === 'lxcx' || data === 'clcx' || data === 'sjcx' || data === 'gsgl') {
        nData = 'sjjjgl'
      } else if (data === 'apkbb' || data === 'apksj') {
        nData = 'apk'
      } else if (data === 'zhgl' || data === 'jsgl' || data === 'cdgl') {
        nData = 'xtgl'
      } else if (data === 'bmd') {
        nData = 'xtsz'
      } else if (data === 'gzlr' || data === 'gzfp' || data === 'gzcx' || data === 'hccx') {
        nData = 'gzgl'
      } else if (data === 'jtlr') {
        nData = 'jtgl'
      }
      return nData
    }
  }
}

export default getParentPath
