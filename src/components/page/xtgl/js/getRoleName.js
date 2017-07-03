function getRoleName (id, data) { // 根据rolid获取rolename
  let name
  for (let i = 0; i < data.length; i++) {
    if (parseInt(data[i].id) === parseInt(id)) {
      name = data[i].name
    }
  }
  return name
}

export default getRoleName
