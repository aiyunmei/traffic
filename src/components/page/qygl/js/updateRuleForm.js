function updateRuleForm (json, tableRowData) { // 编辑基础资料接口
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
  nJson.id = tableRowData.id
  nJson.appKey = encodeURIComponent(tableRowData.appKey)
  return nJson
}

export default updateRuleForm
