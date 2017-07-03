function clearRole (data) { // 清空选择数据
  for (let i = 0; i < data.length; i++) {
    data[i].checked = false
    data[i].checkVal = []
  }
  return data
}

export default clearRole
