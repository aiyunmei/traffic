<template>
  <div class="sidebar">
    <el-menu :default-active="onRoutes" theme="dark" unique-opened router>
      <el-menu-item index="readme">
        <i class="fa fa-home" style="right: 0;font-size: 20px;"></i><span>Home</span>
      </el-menu-item>
      <el-submenu v-for="(item,index) in arr" v-bind:index="parseInt(index + 1).toString()" :key="index">
        <template slot="title">
          <i :class="item.moduleIcon"></i>
          <span>{{ item.moduleName }}</span>
        </template>
        <el-menu-item v-for="(item,index) in item.moduleItems" v-bind:index="item.modulePath" :key="index">
          <el-tooltip effect="dark" :content="item.moduleName" placement="right-start">
            <i :class="item.moduleIcon"></i>
          </el-tooltip>
          <span>{{ item.moduleName }}</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        arr: []
      }
    },
    computed: {
      onRoutes () {
        return this.$route.path.replace('/', '')
      }
    },
    created () {
      this.Result()
    },
    methods: {
      Result () {
        let routerData = JSON.parse(localStorage.getItem('routerData'))
        this.arr = routerData
      }
    },
    watch: {
    }
  }
</script>
