function getRole (data) { // 获取权限列表
  let arr = []
  for (let i = 0; i < data.length; i++) {
    if (data[i].checked === true) {
      arr.push(data[i].id)
    }
    for (let j = 0; j < data[i].checkVal.length; j++) {
      arr.push(data[i].checkVal[j])
    }
  }
  return arr
}

export default getRole
