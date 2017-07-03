// const onBaseUrl = 'http://101.37.32.25' // 线上地址
const onBaseUrl = 'http://118.178.252.30' // 线上地址
const onRuleBaseUrl = 'http://101.37.32.25' // 规则录入 规则分配线上地址
// const onJtBaseUrl = 'http://121.40.166.37' // 阶梯收费线上地址
// const loBaseUrl = 'http://192.168.230.118' // 本地地址

const api = { // result 默认打开页面请求, update 修改, excel 下载excel表, goExcel 下载excel模板, delete 删除数据, add 新增数据, ansync 异步校验
  login: onBaseUrl + ':8083/SystemManagement/login',
  // login: loBaseUrl + ':8083/SystemManagement/login', // 本地地址
  suggestCarryCode: onBaseUrl + ':8082/DataBase/carry/getCarryCode', // 车牌号输入建议
  // suggestCaryCode: loBaseUrl + ':8090/DataBase/carry/getCarryCode', // 车牌号输入建议 本地地址
  suggestLineShort: onBaseUrl + ':8082/DataBase/line/getLineShort', // 线路短号输入建议
  // suggestLineShort: loBaseUrl + ':8090/DataBase/line/getLineShort', // 线路短号输入建议 本地地址
  readImg: onBaseUrl + ':8083/SystemManagement/img/getImg',
  // readImg: loBaseUrl + ':8090/VehNoLoad/img/getImg', // 本地地址
  sbgl: {// 设备管理
    result: onBaseUrl + ':8084/BusinessManagement/device/findDevice',
    add: onBaseUrl + ':8084/BusinessManagement/device/addDevice',
    update: onBaseUrl + ':8084/BusinessManagement/device/updateDevice',
    delete: onBaseUrl + ':8084/BusinessManagement/device/deleteDevice',
    ansync: onBaseUrl + ':8084/BusinessManagement/device/getOnly',
    excel: onBaseUrl + ':8084/BusinessManagement/device/exportExcel'
    // result: loBaseUrl + ':8091/BusinessManagement/device/findDevice', // 本地地址
    // add: loBaseUrl + ':8091/BusinessManagement/device/addDevice', // 本地地址
    // update: loBaseUrl + ':8091/BusinessManagement/device/updateDevice', // 本地地址
    // delete: loBaseUrl + ':8091/BusinessManagement/device/deleteDevice' // 本地地址
    // excel: loBaseUrl + ':8091/BusinessManagement/device/exportExcel' // 本地地址
  },
  xtcx: {// 心跳查询
    yresult: onBaseUrl + ':8084/BusinessManagement/last/heart/findLastHeart', // 有心跳查询
    nresult: onBaseUrl + ':8084/BusinessManagement/last/heart/findNoLastHeart', // 无心跳查询
    yexcel: onBaseUrl + ':8084/BusinessManagement/last/heart/ExcelLastHeart', // 有心跳导出excel
    nexcel: onBaseUrl + ':8084/BusinessManagement/last/heart/exportExcelNoLast', // 无心跳导出excel
    getCount: onBaseUrl + ':8084/BusinessManagement/last/heart/getCount' // 心跳次数
    // yresult: loBaseUrl + ':8091/BusinessManagement/last/heart/findLastHeart', // 本地地址
    // nresult: loBaseUrl + ':8091/BusinessManagement/last/heart/findNoLastHeart', // 本地地址
    // yexcel: loBaseUrl + ':8091/BusinessManagement/last/heart/ExcelLastHeart', // 本地地址
    // nexcel: loBaseUrl + ':8091/BusinessManagement/last/heart/exportExcelNoLast' // 本地地址
    // getCount: loBaseUrl + ':8091/BusinessManagement/last/heart/getCount'
  },
  yygs: {// 运营公司api
    result: onBaseUrl + ':8082/DataBase/company/findCompany',
    add: onBaseUrl + ':8082/DataBase/company/addCompany',
    update: onBaseUrl + ':8082/DataBase/company/updateCompany',
    cardType: onBaseUrl + ':8082/DataBase/company/updateCardType',
    delete: onBaseUrl + ':8082/DataBase/company/deleteCompany'
    // result: loBaseUrl + ':8090/DataBase/company/findCompany', // 本地地址
    // add: loBaseUrl + ':8090/DataBase/company/addCompany', // 本地地址
    // update: loBaseUrl + ':8090/DataBase/company/updateCompany', // 本地地址
    // cardType: loBaseUrl + ':8090/DataBase/company/updateCardType', // 本地地址
    // delete: loBaseUrl + ':8090/DataBase/company/deleteCompany' // 本地地址
  },
  cscx: { // 重试查询
    result: 'http://121.40.216.133:8082/TryPay/cs/findCs'
    // result: loBaseUrl + ':8080/TryPay/cs/findCs' // 本地地址
  },
  lryhgl: {// 录入用户管理
    result: onBaseUrl + ':8086/DeviceApp/device/app/user/findDeviceAppUser',
    update: onBaseUrl + ':8086/DeviceApp/device/app/user/updateDeviceAppUser',
    delete: onBaseUrl + ':8086/DeviceApp/device/app/user/deleteDeviceAppUser',
    add: onBaseUrl + ':8086/DeviceApp/device/app/user/addDeviceAppUser'
  },
  lrlb: {// 录入列表api
    result: onBaseUrl + ':8086/DeviceApp/device/app/device/findDeviceAppDevice',
    update: onBaseUrl + ':8086/DeviceApp/device/app/device/updateDeviceAppDevice',
    excel: onBaseUrl + ':8086/DeviceApp/device/app/device/excelDevcieAppDevcie'
    // result: loBaseUrl + ':8080/DeviceApp/device/app/device/findDeviceAppDevice', // 本地地址
  },
  wllb: {// 未录列表api
    result: onBaseUrl + ':8086/DeviceApp/device/app/carry/findDevcieAppCarry',
    update: onBaseUrl + ':8086/DeviceApp/device/app/carry/updateDeviceAppCarry',
    add: onBaseUrl + ':8086/DeviceApp/device/app/carry/addDeviceAppCarry',
    delete: onBaseUrl + ':8086/DeviceApp/device/app/carry/deleteDeviceAppCarry',
    goExcel: onBaseUrl + ':8086/DeviceApp/excel/getExcel?templateName=deviceAppCarry&excelName=', // encodeURIComponent('未录入')
    uploadExcel: onBaseUrl + ':8086/DeviceApp/device/app/carry/importDeviceAppCarry'
    // result: loBaseUrl + ':8080/DeviceApp/device/app/carry/findDevcieAppCarry', // 本地地址
    // uploadExcel: loBaseUrl + ':8080/DeviceApp//device/app/carry/importDeviceAppCarry' // 本地地址
    // add: loBaseUrl + ':8080/DeviceApp/device/app/carry/addDeviceAppCarry' // 本地地址
  },
  ghjl: {// 更换记录api
    result: onBaseUrl + ':8086/DeviceApp/deviceAppOldDevice/findDeviceAppOldDevice'
    // result: loBaseUrl + ':8080/DeviceApp/deviceAppOldDevice/findDeviceAppOldDevice' // 本地地址
  },
  sbllk: {// 设备流量卡api
    result: onBaseUrl + ':8086/DeviceApp/gprsDevice/findGprsDevice',
    add: onBaseUrl + ':8086/DeviceApp/gprsDevice/addGprsDevice',
    update: onBaseUrl + ':8086/DeviceApp/gprsDevice/updateGprsDevice',
    delete: onBaseUrl + ':8086/DeviceApp/gprsDevice/deleteGprsDevice',
    goExcel: onBaseUrl + ':8086/DeviceApp/excel/getExcel?templateName=GPRS',
    uploadExcel: onBaseUrl + ':8086/DeviceApp/gprsDevice/importGprsExcel'
    // uploadExcel: loBaseUrl + ':8080/DeviceApp/gprsDevice/importGprsExcel' // 本地地址
  },
  jjcsgl: { // 机具厂商管理api
    result: onBaseUrl + ':8086/DeviceApp/deviceFirms/findDeviceFirms',
    add: onBaseUrl + ':8086/DeviceApp/deviceFirms/addDeviceFirms',
    update: onBaseUrl + ':8086/DeviceApp/deviceFirms/updateDeviceFirms',
    delete: onBaseUrl + ':8086/DeviceApp/deviceFirms/deleteDeviceFirms'
    // result: loBaseUrl + ':8080/DeviceApp/deviceFirms/findDeviceFirms', // 本地地址
    // add: loBaseUrl + ':8080/DeviceApp/deviceFirms/addDeviceFirms', // 本地地址
    // update: loBaseUrl + ':8080/DeviceApp/deviceFirms/updateDeviceFirms', // 本地地址
    // delete: loBaseUrl + ':8080/DeviceApp/deviceFirms/deleteDeviceFirms' // 本地地址
  },
  gsgl: { // 公司管理api
    result: onBaseUrl + ':8082/DataBase/localCompany/findLocalCompany',
    add: onBaseUrl + ':8082/DataBase/localCompany/addLocalCompany',
    update: onBaseUrl + ':8082/DataBase/localCompany/updateLocalCompany',
    delete: onBaseUrl + ':8082/DataBase/localCompany/deleteLocalCompany',
    excel: onBaseUrl + ':8082/DataBase/localCompany/exprotLocalCompany'
    // goExcel:  onBaseUrl + ':8098',
    // uploadExcel:  onBaseUrl + ':8097'
    // result: loBaseUrl + ':8090/DataBase/localCompany/findLocalCompany', // 本地地址
    // add: loBaseUrl + ':8090/DataBase/localCompany/addLocalCompany', // 本地地址
    // update: loBaseUrl + ':8090/DataBase/localCompany/updateLocalCompany', // 本地地址
    // delete: loBaseUrl + ':8090/DataBase/localCompany/deleteLocalCompany', // 本地地址
    // excel: loBaseUrl + ':8090/DataBase/localCompany/exprotLocalCompany' // 本地地址
  },
  lxcx: { // 路线查询api
    result: onBaseUrl + ':8082/DataBase/line/findLine',
    add: onBaseUrl + ':8082/DataBase/line/addLine',
    update: onBaseUrl + ':8082/DataBase/line/updateLine',
    delete: onBaseUrl + ':8082/DataBase/line/deleteLine',
    excel: onBaseUrl + ':8082/DataBase/line/exportLineExcel',
    goExcel: onBaseUrl + ':8086/DeviceApp/excel/getExcel?templateName=line',
    uploadExcel: onBaseUrl + ':8082/DataBase/line/importLineExcel'
    // result: loBaseUrl + ':8090/DataBase/line/findLine', // 本地地址
    // add: loBaseUrl + ':8090/DataBase/line/addLine', // 本地地址
    // update: loBaseUrl + ':8090/DataBase/line/updateLine', // 本地地址
    // delete: loBaseUrl + ':8090/DataBase/line/deleteLine' // 本地地址
    // excel: loBaseUrl + ':8090/DataBase/line/exportLineExcel', // 本地地址
    // goExcel: loBaseUrl + ':8080/DeviceApp/excel/getExcel?templateName=line', // 本地地址
    // uploadExcel: loBaseUrl + ':8090/DataBase/line/importLineExcel' // 本地地址
  },
  clcx: { // 车辆查询api
    result: onBaseUrl + ':8082/DataBase/carry/findCarry',
    add: onBaseUrl + ':8082/DataBase/carry/addCarry',
    update: onBaseUrl + ':8082/DataBase/carry/updateCarry',
    delete: onBaseUrl + ':8082/DataBase/carry/deleteCarry',
    excel: onBaseUrl + ':8082/DataBase/carry/exportCarryExcel',
    goExcel: onBaseUrl + ':8086/DeviceApp/excel/getExcel?templateName=carry',
    uploadExcel: onBaseUrl + ':8082/DataBase/carry/importCarryExcel'
    // result: loBaseUrl + ':8090/DataBase/carry/findCarry', // 本地地址
    // add: loBaseUrl + ':8090/DataBase/carry/addCarry', // 本地地址
    // update: loBaseUrl + ':8090/DataBase/carry/updateCarry', // 本地地址
    // delete: loBaseUrl + ':8090/DataBase/carry/deleteCarry', // 本地地址
    // excel: loBaseUrl + ':8090/DataBase/carry/exportCarryExcel', // 本地地址
    // uploadExcel: loBaseUrl + ':8090/DataBase/carry/importCarryExcel' // 本地地址
  },
  sjcx: { // 司机查询api
    result: onBaseUrl + ':8082/DataBase/employee/findEmployee',
    add: onBaseUrl + ':8082/DataBase/employee/addEmployee',
    update: onBaseUrl + ':8082/DataBase/employee/updateEmployee',
    delete: onBaseUrl + ':8082/DataBase/employee/deleteEmployee',
    excel: onBaseUrl + ':8082/DataBase/employee/exportEmployeeExcel',
    goExcel: onBaseUrl + ':8086/DeviceApp/excel/getExcel?templateName=employee',
    uploadExcel: onBaseUrl + ':8082/DataBase/employee/importEmployeeExcel'
    // result: loBaseUrl + ':8090/DataBase/employee/findEmployee', // 本地地址
    // add: loBaseUrl + ':8090/DataBase/employee/addEmployee', // 本地地址
    // update: loBaseUrl + ':8090/DataBase/employee/updateEmployee', // 本地地址
    // delete: loBaseUrl + ':8090/DataBase/employee/deleteEmployee', // 本地地址
    // excel: loBaseUrl + ':8090/DataBase/employee/exportEmployeeExcel', // 本地地址
    // goExcel: loBaseUrl + ':8080/DeviceApp/excel/getExcel?templateName=employee', // 本地地址
    // uploadExcel: loBaseUrl + ':8090/DataBase/employee/importEmployeeExcel' // 本地地址
  },
  gzlr: { // 规则录入api
    result: onRuleBaseUrl + ':8086/transfer-rule/transfer/rule/list',
    add: onRuleBaseUrl + ':8086/transfer-rule/transfer/rule/info'
    // result: 'http://192.168.230.133:8080/transfer-rule/transfer/rule/list', // 本地地址
    // add: 'http://192.168.230.133:8080/transfer-rule/transfer/rule/info' // 本地地址
  },
  gzfp: { // 规则分配api
    result: onRuleBaseUrl + ':8086/transfer-rule/device/list',
    add: onRuleBaseUrl + ':8086/transfer-rule/line/transfer/rule',
    getRuleOptions: onRuleBaseUrl + ':8086/transfer-rule/transfer/rule/all' // 基础规则列表接口
    // result: 'http://192.168.230.101:8080/transfer-rule/device/list',  // 本地地址
    // add: 'http://192.168.230.101:8080/transfer-rule/line/transfer/rule', // 本地地址
    // getRuleOptions: 'http://192.168.230.101:8080/transfer-rule/transfer/rule/all' // 本地地址 基础规则列表接口
  },
  gzcx: { // 规则分配查询
    result: onRuleBaseUrl + ':8086/transfer-rule/line/transfer/list'
    // result: 'http://192.168.230.101:8080/transfer-rule/line/transfer/list' // 本地地址
  },
  hccx: {
    result: 'http://118.178.88.252:8085/cache-api/common/cache/info',
    getInput: 'http://118.178.88.252:8085/cache-api/common/cache/key/list'
    // result: 'http://192.168.230.129:8081/cache-api/common/cache/info', // 本地地址
    // getInput: 'http://192.168.230.129:8081/cache-api/common/cache/key/list' // 本地地址
  },
  bmd: { // 白名单api
    result: onBaseUrl + ':8085/ApkVersion/payWhiteList/findPayWhiteList',
    add: onBaseUrl + ':8085/ApkVersion/payWhiteList/addPayWhiteList',
    update: onBaseUrl + ':8085/ApkVersion/payWhiteList/updatePayWhiteList',
    delete: onBaseUrl + ':8085/ApkVersion/payWhiteList/deletePayWhiteList'
    // result: loBaseUrl + ':8092/ApkVersion/payWhiteList/findPayWhiteList', // 本地地址
    // add: loBaseUrl + ':8092/ApkVersion/payWhiteList/addPayWhiteList', // 本地地址
    // update: loBaseUrl + ':8092/ApkVersion/payWhiteList/updatePayWhiteList', // 本地地址
    // delete: loBaseUrl + ':8092/ApkVersion/payWhiteList/deletePayWhiteList' // 本地地址
  },
  zhgl: { // 账号管理 api
    result: onBaseUrl + ':8083/SystemManagement/findAccountFy',
    add: onBaseUrl + ':8083/SystemManagement/addAccount',
    update: onBaseUrl + ':8083/SystemManagement/updateAccount',
    delete: onBaseUrl + ':8083/SystemManagement/deleteAccount',
    getRoleOptions: onBaseUrl + ':8083/SystemManagement/role/findRole' // 获取所有角色列表
    // result: loBaseUrl + ':8093/SystemManagement/findAccountFy', // 本地地址
    // add: loBaseUrl + ':8093/SystemManagement/addAccount', // 本地地址
    // update: loBaseUrl + ':8093/SystemManagement/updateAccount', // 本地地址
    // delete: loBaseUrl + ':8093/SystemManagement/deleteAccount', // 本地地址
    // getRoleOptions: loBaseUrl + ':8093/SystemManagement/role/findRole' // 本地地址 获取所有角色列表
  },
  jsgl: { // 角色管理 api
    result: onBaseUrl + ':8083/SystemManagement/role/find',
    add: onBaseUrl + ':8083/SystemManagement/role/add',
    update: onBaseUrl + ':8083/SystemManagement/role/modify',
    delete: onBaseUrl + ':8083/SystemManagement/role/deleteRole', // 删除权限
    getRole: onBaseUrl + ':8083/SystemManagement/roleModule/findRoleModule', // 获取权限列表
    updateRole: onBaseUrl + ':8083/SystemManagement/roleModule/updateRole' // 修改权限api
    // result: loBaseUrl + ':8093/SystemManagement/role/find', // 本地地址
    // add: loBaseUrl + ':8093/SystemManagement/role/add', // 本地地址
    // update: loBaseUrl + ':8093/SystemManagement/role/modify', // 本地地址
    // delete: loBaseUrl + ':8093/SystemManagement/role/deleteRole',  // 本地地址 删除权限api
    // getRole: loBaseUrl + ':8093/SystemManagement/roleModule/findRoleModule', // 本地地址
    // updateRole: loBaseUrl + ':8093/SystemManagement/roleModule/updateRole' // 本地地址 修改权限api
  },
  cdgl: { // 菜单管理api
    add: onBaseUrl + ':8083',
    update: onBaseUrl + ':8083',
    delete: onBaseUrl + ':8083'
    // add: loBaseUrl + '', // 本地地址
    // update: loBaseUrl + '', // 本地地址
    // delete: loBaseUrl + '' // 本地地址
  },
  apkbb: {// apk版本管理api
    result: onBaseUrl + ':8085/ApkVersion/apk/system/version/findApkSystemVersion',
    delete: onBaseUrl + ':8085/ApkVersion/apk/system/version/deleteApkSystemVersion',
    upload: onBaseUrl + ':8085/ApkVersion/apk/system/version/addApkVersion'
    // upload: loBaseUrl + ':8092/ApkVersion/apk/system/version/addApkVersion' // 本地地址
  },
  apksj: { // apk升级api
    result: onBaseUrl + ':8085/ApkVersion/apkUpgrade/findApkSystemVersion',
    update: onBaseUrl + ':8085/ApkVersion/apkUpgrade/updateApkUpgrade',
    versionOptions: onBaseUrl + ':8085/ApkVersion/apk/system/version/findVersion'
    // result: loBaseUrl + ':8092/ApkVersion/apkUpgrade/findApkSystemVersion', // 本地地址
    // update: loBaseUrl + ':8092/ApkVersion/apkUpgrade/updateApkUpgrade', // 本地地址
    // versionOptions: loBaseUrl + ':8092/ApkVersion/apk/system/version/findVersion' // 本地地址
  },
  jtlr: { // 阶梯收费录入api
    result: 'http://121.40.166.37:8888/payservice/payServices/getALlRules',
    add: 'http://121.40.166.37:8888/payservice/payServices/initLadderRules',
    // update: onJtBaseUrl + '',
    delete: 'http://121.40.166.37:8888/payservice/payServices/deleteRule'
    // uploadExcel: onJtBaseUrl + ''
    // result: 'http://192.168.230.107:8080/payServices/getALlRules',
    // add: 'http://192.168.230.107:8080/payServices/initLadderRules',
    // update: onJtBaseUrl + '',
    // delete: 'http://192.168.230.107:8080/payServices/deleteRule'
    // uploadExcel: onJtBaseUrl + ''
  }
}

export default api
