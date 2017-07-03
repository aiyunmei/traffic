<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name: 'app',
    created () {
      this.Result()
    },
    methods: {
      Result () { // 动态路由 防止用户刷新页面路由动态失效故再渲染一次
        let loginName = localStorage.getItem('ms_username')
        if (loginName) {
          let routerData = JSON.parse(localStorage.getItem('routerData'))
          let nData = []
          let home = {
            path: '/readme',
            component: resolve => require(['./components/common/Home.vue'], resolve),
            children: [
              {
                path: '/',
                component: resolve => require(['./components/page/home/Readme.vue'], resolve)
              }
            ]
          }
          for (let i = 0; i < routerData.length; i++) {
            let moduleItems = routerData[i].moduleItems
            for (let j = 0; j < moduleItems.length; j++) {
              let obj = {}
              let path = moduleItems[j].modulePath
              let parentPath = this.getParentPath(path) // 调用子path查询父path的值
              obj.path = '/' + path
              obj.component = resolve => require([`./components/page/${parentPath}/${path}.vue`], resolve)
              home.children.push(obj)
            }
          }
          nData.push(home)
          this.$router.addRoutes(nData)
        } else {
          localStorage.removeItem('ms_username')
          localStorage.removeItem('routerData')
          localStorage.removeItem('companyId')
          localStorage.removeItem('accountId')
          this.$router.push('/login')
        }
      }
    }
  }
</script>

