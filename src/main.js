// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'element-ui/lib/theme-default/index.css' // element 样式
import '../static/css/reset_min.css' // 全局重置样式
import '../static/css/main.css' // 主要样式
import '../static/css/color-dark.css' // 头部左侧菜单背景样式
import 'babel-polyfill' // 支持es6
import updateTime from './utils/updateTime/index' // 时间格式转换
import toHash from './utils/JsonToParams/index' // json 变hash值
import api from './utils/ajax/index' // ajax api接口
import va from './utils/validate/index' // 验证正则表达式
import getSupplier from './utils/changeDataType/getSupplier' // 厂商展示
import getStatus from './utils/changeDataType/getStatus' // 状态展示
import getNote from './utils/changeDataType/getNote' // 类型展示
import getPengdingStatus from './utils/changeDataType/getPengdingStatus' // 备注类型展示
import getInstall from './utils/changeDataType/getInstall' // 安装安装展示
import getCarryType from './utils/changeDataType/getCarryType' // 车辆类型展示
import getIsCircled from './utils/changeDataType/getIsCircled' // 是否审核展示
import getIsUser from './utils/changeDataType/getIsUser' // 是否可用展示
import getPersonStatus from './utils/changeDataType/getPersonStatus' // 展示员工状态
import getParentPath from './utils/getParentPath/index' // 根据子元素path获取父元素path
import getDeviceType from './utils/changeDataType/getDeviceType' // 展示设备类型

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.prototype.api = api
Vue.prototype.va = va
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)
Vue.use(updateTime)
Vue.use(toHash)
Vue.use(getSupplier)
Vue.use(getStatus)
Vue.use(getNote)
Vue.use(getPengdingStatus)
Vue.use(getInstall)
Vue.use(getCarryType)
Vue.use(getIsCircled)
Vue.use(getIsUser)
Vue.use(getPersonStatus)
Vue.use(getParentPath)
Vue.use(getDeviceType)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
