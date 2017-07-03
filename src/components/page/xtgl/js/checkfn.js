function checkFn (data) { // 修改列表数据
  for (let i = 0; i < data.length; i++) {
    data[i].checked = false
    data[i].disabled = false
    data[i].checkVal = []
  }
  return data
}

export default checkFn
