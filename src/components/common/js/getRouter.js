function getRouter (data, getParentPath) { // 修改后台渲染的数据结构转换成路由需要的格式
  let nData = []
  let home = {
    path: '/readme',
    component: resolve => require(['../../common/Home.vue'], resolve),
    children: [
      {
        path: '/',
        component: resolve => require(['../../page/home/Readme.vue'], resolve)
      }
    ]
  }
  for (let i = 0; i < data.length; i++) {
    let moduleItems = data[i].moduleItems
    for (let j = 0; j < moduleItems.length; j++) {
      let obj = {}
      let path = moduleItems[j].modulePath
      let parentPath = getParentPath(path) // 调用根据子path获取父path
      obj.path = '/' + path
      obj.component = resolve => require([`../../page/${parentPath}/${path}.vue`], resolve)
      home.children.push(obj)
    }
  }
  nData.push(home)
  return nData
}

export default getRouter

