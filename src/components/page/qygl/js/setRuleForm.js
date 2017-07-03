function setRuleForm (json, cardType) { // 解析ruleForm
  let nJson = {}
  nJson.name = encodeURIComponent(json.name)
  nJson.code = json.code
  nJson.telephone = json.telephone
  nJson.province = encodeURIComponent(json.province)
  nJson.city = encodeURIComponent(json.city)
  nJson.area = encodeURIComponent(json.area)
  nJson.address = encodeURIComponent(json.address)
  nJson.account = encodeURIComponent(json.account)
  nJson.user = encodeURIComponent(json.user)
  nJson.gateWay = encodeURIComponent(json.gateWay)
  nJson.appId = encodeURIComponent(json.appId)
  nJson.privateKey = encodeURIComponent(json.privateKey)
  nJson.alipayEnterpriseAccountList = []
  for (let i = 0; i < cardType.length; i++) {
    let obj = {}
    obj.cardType = cardType[i]
    nJson.alipayEnterpriseAccountList.push(obj)
  }
  return nJson
}

export default setRuleForm
