function setVersion (data, tableData) { // 更新tableData
  for (let i = 0; i < data.length; i++) {
    let id = data[i].id
    let checkTarAppVersion = data[i].checkTarAppVersion
    for (let j = 0; j < tableData.length; j++) {
      if (tableData[j].id === id) {
        tableData[j].tarAppVersion = checkTarAppVersion
        tableData[j].checkTarAppVersion = ''
      }
    }
  }
  return tableData
}

export default setVersion
