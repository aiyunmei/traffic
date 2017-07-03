function getVersion (data) { // 获取升级id和版本选择信息
  let arr = []
  for (let i = 0; i < data.length; i++) {
    let id = data[i].id
    let checkTarAppVersion = data[i].checkTarAppVersion
    if (checkTarAppVersion !== '') {
      let obj = {}
      obj.id = id
      obj.checkTarAppVersion = checkTarAppVersion
      arr.push(obj)
    }
  }
  return arr
}

export default getVersion
