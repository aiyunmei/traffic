function updateCardType (data) { // 更新卡类型
  let nData = []
  let alipayEnterpriseAccountList = data.alipayEnterpriseAccountList
  let checkCardType = data.checkCardType
  if (alipayEnterpriseAccountList.length > checkCardType.length) { // 如果是减少
    for (let i = 0; i < alipayEnterpriseAccountList.length; i++) {
      for (let j = 0; j < checkCardType.length; j++) {
        if (alipayEnterpriseAccountList[i].cardType === checkCardType[j]) {
          let obj = {}
          obj.id = alipayEnterpriseAccountList[i].id
          obj.cardType = alipayEnterpriseAccountList[i].cardType
          obj.appKey = alipayEnterpriseAccountList[i].appKey
          nData.push(obj)
        }
      }
    }
  } else if (alipayEnterpriseAccountList.length < checkCardType.length) { // 变多
    for (let i = 0; i < checkCardType.length; i++) {
      for (let j = 0; j < alipayEnterpriseAccountList.length; j++) {
        if (checkCardType[i] === alipayEnterpriseAccountList[j].cardType) {
          let obj = {}
          obj.id = alipayEnterpriseAccountList[j].id
          obj.cardType = alipayEnterpriseAccountList[j].cardType
          obj.appKey = alipayEnterpriseAccountList[j].appKey
          nData.push(obj)
          checkCardType.splice(i, 1) // 删除掉已添加的对象
        }
      }
      for (let z = 0; z < checkCardType.length; z++) { // 遍历 新增的列表
        let obj = {}
        obj.id = ''
        obj.cardType = checkCardType[z]
        obj.appKey = alipayEnterpriseAccountList[0].appKey
        nData.push(obj)
      }
    }
    nData = uniqueArray(nData, 'cardType') // 执行去重
  } else if (alipayEnterpriseAccountList.length === checkCardType.length) { // 如果相等
    for (let i = 0; i < alipayEnterpriseAccountList.length; i++) {
      if (alipayEnterpriseAccountList[i].cardType === checkCardType[i]) { // 如果不变
        let obj = {}
        obj.id = alipayEnterpriseAccountList[i].id
        obj.cardType = alipayEnterpriseAccountList[i].cardType
        obj.appKey = alipayEnterpriseAccountList[i].appKey
        nData.push(obj)
      } else { // 如果变化了 (选择个数不变)
        let obj = {}
        obj.id = ''
        obj.cardType = checkCardType[i]
        obj.appKey = alipayEnterpriseAccountList[i].appKey
        nData.push(obj)
      }
    }
  }
  return nData
}

/*
 * JSON数组去重
 * @param: [array] json Array
 * @param: [string] 唯一的key名，根据此键名进行去重
 */
function uniqueArray (array, key) {
  var result = [array[0]]
  for (let i = 1; i < array.length; i++) {
    var item = array[i]
    var repeat = false
    for (let j = 0; j < result.length; j++) {
      if (item[key] === result[j][key]) {
        repeat = true
        break
      }
    }
    if (!repeat) {
      result.push(item)
    }
  }
  return result
}

export default updateCardType
