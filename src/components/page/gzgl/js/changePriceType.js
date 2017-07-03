function changePriceType (data) { // json数组转换成后端需要的map格式  票价转化成分为单位
  let nData = {}
  for (let i = 0; i < data.length; i++) {
    let price = data[i].price
    let obj = {}
    obj.price = price
    nData[`${(i + 1)}`] = obj
  }
  return nData
}

export default changePriceType
