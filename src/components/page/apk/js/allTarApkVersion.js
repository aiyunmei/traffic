function allTarApkVersion (data) { // 全部选择目标版本
  for (let i = 0; i < data.length; i++) {
    data[i].checkTarAppVersion = data[i].tarAppVersion
  }
  return data
}

export default allTarApkVersion
