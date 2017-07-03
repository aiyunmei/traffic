function EACH (arr, checkData) { // 便利过来的数字进行写入  idArr 选中数组 checkData 修改对象
  for (let i = 0; i < arr.length; i++) {
    let id = arr[i].id
    let checkVal = []
    for (let j = 0; j < arr[i].moduleItems.length; j++) {
      checkVal.push(arr[i].moduleItems[j].id)
    }
    for (let z = 0; z < checkData.length; z++) {
      if (parseInt(id) === parseInt(checkData[z].id)) {
        checkData[z].checked = true
        checkData[z].checkVal = checkVal
      }
    }
  }
}

export default EACH
