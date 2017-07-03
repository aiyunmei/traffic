function clearTarApkVersion (data) { // 取消全选
  for (let i = 0; i < data.length; i++) {
    data[i].checkTarAppVersion = ''
  }
  return data
}

export default clearTarApkVersion
